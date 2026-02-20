"use client"

/**
 * Conversations Hook
 * 
 * Manages conversation state for both authenticated and guest users.
 * Uses RLS-safe operations for all database interactions.
 * 
 * @version 3.0.0 - Streamlined (removed legacy duplicates)
 */

import { useState, useEffect, useMemo, useCallback } from "react"
import { usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import * as Sentry from "@sentry/nextjs"
import { captureError } from "@/lib/sentry-helper"
import { useGuestConversations } from "@/hooks/use-guest-conversations"
import { useConversationRealtime } from "@/hooks/use-conversation-realtime"
import {
  updateConversation as updateConversationDB,
  hardDeleteConversation,
  logRLSError
} from "@/lib/supabase/helpers"

// ============================================================================
// Types
// ============================================================================

export interface Conversation {
  id: string
  title: string
  created_at: string
  updated_at: string
  message_count: number
  last_message_preview: string
  user_id: string
  archived?: boolean
}

export interface UseConversationsReturn {
  // State
  conversations: Conversation[]
  loading: boolean
  user: User | null
  guestUserId: string | null
  effectiveUserId: string | null

  // Pagination
  hasMore: boolean
  loadingMore: boolean
  loadMore: () => void

  // Filters
  filter: "all" | "archived" | "active"
  setFilter: (filter: "all" | "archived" | "active") => void
  search: string
  setSearch: (search: string) => void

  // Filtered list
  list: Conversation[]

  // Operations
  create: (title?: string) => Promise<Conversation | null>
  rename: (id: string, title: string) => Promise<boolean>
  archive: (id: string, archived?: boolean) => Promise<boolean>
  remove: (id: string) => Promise<boolean>

  // Guest-specific
  updateGuestMessages: (id: string, count: number, preview: string, messages?: unknown[]) => void
  loadGuestMessages: (id: string) => unknown[]
  ensureGuestConversation: (id: string, title?: string) => void
}

// ============================================================================
// Debounce Hook
// ============================================================================

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

// ============================================================================
// Main Hook
// ============================================================================

const PAGE_SIZE = 20

export function useConversations(): UseConversationsReturn {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [guestUserId, setGuestUserId] = useState<string | null>(null)
  const [filter, setFilter] = useState<"all" | "archived" | "active">("active")
  const [search, setSearch] = useState("")

  const debouncedSearch = useDebounce(search, 300)
  const pathname = usePathname()
  const supabase = useMemo(() => createClient(), [])
  const effectiveUserId = user?.id || guestUserId
  const {
    initializeGuestUserId,
    loadGuestConversations,
    createGuestConversation,
    renameGuestConversation,
    archiveGuestConversation,
    removeGuestConversation,
    updateGuestMessages: updateGuestConversationMessages,
    loadGuestMessages: loadGuestConversationMessages,
    ensureGuestConversation: ensureGuestConversationExists,
  } = useGuestConversations<Conversation>({
    isAuthenticated: Boolean(user?.id),
    guestUserId,
    setGuestUserId,
    setConversations,
  })

  // --------------------------------------------------------------------------
  // Debug: Log user ID sources
  // --------------------------------------------------------------------------
  useEffect(() => {
    // Debug logging removed for performance
  }, [user, guestUserId, effectiveUserId, pathname])

  // --------------------------------------------------------------------------
  // Load from database
  // --------------------------------------------------------------------------
  const loadFromDatabase = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .eq("user_id", userId)
        .is("deleted_at", null)
        .order("updated_at", { ascending: false })
        .limit(PAGE_SIZE)

      if (error) throw error

      const rows = data || []
      setConversations(rows)
      setHasMore(rows.length === PAGE_SIZE)
    } catch (error) {
      setConversations([])
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    initializeGuestUserId()
  }, [initializeGuestUserId])

  // --------------------------------------------------------------------------
  // Auth state management
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!guestUserId) return

    let cancelled = false
    let subscription: { unsubscribe: () => void } | null = null

    const init = async () => {
      const { data: { user: fetchedUser }, error: authError } = await supabase.auth.getUser()
      if (cancelled) return

      setUser(fetchedUser)

      if (fetchedUser?.id) {
        await loadFromDatabase(fetchedUser.id)
      } else {
        setConversations(loadGuestConversations())
        setLoading(false)
      }
    }

    const setupListener = () => {
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        if (cancelled) return

        setUser(session?.user || null)

        if (session?.user?.id) {
          loadFromDatabase(session.user.id)
        } else {
          setConversations(loadGuestConversations())
          setLoading(false)
        }
      })
      subscription = data.subscription
    }

    init()
    setupListener()

    return () => {
      cancelled = true
      subscription?.unsubscribe()
    }
  }, [guestUserId, loadFromDatabase, loadGuestConversations, supabase])

  const refreshCurrentUserConversations = useCallback(() => {
    if (user?.id) {
      void loadFromDatabase(user.id)
    }
  }, [user?.id, loadFromDatabase])

  useConversationRealtime({
    userId: user?.id,
    supabase,
    onRefresh: refreshCurrentUserConversations,
  })

  // --------------------------------------------------------------------------
  // Load more (pagination)
  // --------------------------------------------------------------------------
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return

    const userId = user?.id || guestUserId
    if (!userId || !user?.id) return // Guest conversations are all in localStorage

    const oldest = conversations[conversations.length - 1]
    if (!oldest) return

    setLoadingMore(true)
    try {
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .eq("user_id", userId)
        .is("deleted_at", null)
        .lt("updated_at", oldest.updated_at)
        .order("updated_at", { ascending: false })
        .limit(PAGE_SIZE)

      if (error) throw error

      const rows = data || []
      if (rows.length > 0) {
        setConversations(prev => [...prev, ...rows])
      }
      setHasMore(rows.length === PAGE_SIZE)
    } catch (error) {
      setHasMore(false)
    } finally {
      setLoadingMore(false)
    }
  }, [loadingMore, hasMore, user?.id, guestUserId, conversations, supabase])

  // --------------------------------------------------------------------------
  // Refetch on route change to /chat
  // --------------------------------------------------------------------------
  useEffect(() => {
    // Refetch conversations when navigating to /chat
    if (pathname === '/chat') {
      // Get fresh auth state instead of relying on potentially stale user state
      supabase.auth.getUser().then(({ data: { user: freshUser } }) => {
        if (freshUser?.id) {
          loadFromDatabase(freshUser.id)
        } else if (user?.id) {
          loadFromDatabase(user.id)
        } else {
          setConversations(loadGuestConversations())
          setLoading(false)
        }
      })
    }
  }, [pathname, user?.id, loadFromDatabase, guestUserId, effectiveUserId, supabase, loadGuestConversations])

  // --------------------------------------------------------------------------
  // CREATE
  // --------------------------------------------------------------------------
  const create = useCallback(async (title = "New Conversation"): Promise<Conversation | null> => {
    // Get fresh auth state
    const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      Sentry.captureException(authError, { tags: { action: "create_conversation" } })
    }

    const userId = currentUser?.id || guestUserId
    if (!userId) {
      return null
    }

    // Authenticated user: save to database
    if (currentUser?.id) {
      try {
        const { data, error } = await supabase
          .from("conversations")
          .insert({ user_id: userId, title })
          .select()
          .single()

        if (error || !data) {
          throw error || new Error("No data returned")
        }

        await loadFromDatabase(currentUser.id)
        if (!user) setUser(currentUser)
        
        return data
      } catch (error) {
        Sentry.captureException(error, { 
          tags: { action: "create_conversation" },
          extra: { userId, title }
        })
        return null
      }
    }

    return createGuestConversation(title)
  }, [guestUserId, user, loadFromDatabase, supabase, createGuestConversation])

  // --------------------------------------------------------------------------
  // RENAME
  // --------------------------------------------------------------------------
  const rename = useCallback(async (conversationId: string, newTitle: string): Promise<boolean> => {
    if (!effectiveUserId) return false

    // Optimistic update — preserve updated_at so conversation doesn't jump position
    const previous = conversations
    setConversations(prev =>
      prev.map(c => c.id === conversationId
        ? { ...c, title: newTitle }
        : c
      )
    )

    try {
      if (user?.id) {
        // Use API route for consistency with other clients
        const response = await fetch(`/api/conversations/${conversationId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: newTitle }),
        })

        if (!response.ok) {
          const err = await response.json()
          throw new Error(err.error || "Rename failed")
        }
      } else {
        renameGuestConversation(conversationId, newTitle)
      }
      return true
    } catch (error) {
      captureError(error, { action: "rename_conversation", conversationId })
      setConversations(previous) // Rollback
      return false
    }
  }, [conversations, effectiveUserId, user?.id, renameGuestConversation])

  // --------------------------------------------------------------------------
  // ARCHIVE
  // --------------------------------------------------------------------------
  const archive = useCallback(async (conversationId: string, archived = true): Promise<boolean> => {
    if (!effectiveUserId) return false

    // Optimistic update
    const previous = conversations
    setConversations(prev =>
      prev.map(c => c.id === conversationId
        ? { ...c, archived, updated_at: new Date().toISOString() }
        : c
      )
    )

    try {
      if (user?.id) {
        const { success, error } = await updateConversationDB(
          supabase,
          conversationId,
          effectiveUserId,
          { archived, archived_at: archived ? new Date().toISOString() : null, updated_at: new Date().toISOString() }
        )

        if (!success || error) {
          logRLSError("update", "conversations", error, { conversationId, archived })
          throw error || new Error("Archive failed")
        }
      } else {
        archiveGuestConversation(conversationId, archived)
      }
      return true
    } catch (error) {
      setConversations(previous) // Rollback
      return false
    }
  }, [conversations, effectiveUserId, user?.id, archiveGuestConversation])

  // --------------------------------------------------------------------------
  // REMOVE (hard delete)
  // --------------------------------------------------------------------------
  const remove = useCallback(async (conversationId: string): Promise<boolean> => {
    if (!effectiveUserId) return false

    // Optimistic update
    const previous = conversations
    setConversations(prev => prev.filter(c => c.id !== conversationId))

    try {
      if (user?.id) {
        const { deleted, error } = await hardDeleteConversation(
          supabase,
          conversationId,
          effectiveUserId
        )

        if (!deleted || error) {
          logRLSError("delete", "conversations", error, { conversationId })
          throw error || new Error("Delete failed")
        }
      } else {
        removeGuestConversation(conversationId)
      }
      return true
    } catch (error) {
      setConversations(previous) // Rollback
      return false
    }
  }, [conversations, effectiveUserId, user?.id, removeGuestConversation, supabase])

  // --------------------------------------------------------------------------
  // Guest-specific utilities
  // --------------------------------------------------------------------------
  const updateGuestMessages = useCallback((
    conversationId: string,
    messageCount: number,
    lastMessagePreview: string,
    messages?: unknown[]
  ) => {
    updateGuestConversationMessages(conversationId, messageCount, lastMessagePreview, messages)
  }, [updateGuestConversationMessages])

  const loadGuestMessages = useCallback((conversationId: string): unknown[] => {
    return loadGuestConversationMessages(conversationId)
  }, [loadGuestConversationMessages])

  const ensureGuestConversation = useCallback((conversationId: string, title?: string) => {
    ensureGuestConversationExists(conversationId, title)
  }, [ensureGuestConversationExists])

  // --------------------------------------------------------------------------
  // Filtered list
  // --------------------------------------------------------------------------
  const list = useMemo(() => {
    let result = conversations

    // Filter by archived status
    if (filter === "archived") {
      result = result.filter(c => c.archived)
    } else if (filter === "active") {
      result = result.filter(c => !c.archived)
    }

    // Filter by search
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase()
      result = result.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.last_message_preview.toLowerCase().includes(q)
      )
    }

    return result
  }, [conversations, filter, debouncedSearch])

  // --------------------------------------------------------------------------
  // Return
  // --------------------------------------------------------------------------
  return {
    conversations,
    loading,
    user,
    guestUserId,
    effectiveUserId,
    hasMore,
    loadingMore,
    loadMore,
    filter,
    setFilter,
    search,
    setSearch,
    list,
    create,
    rename,
    archive,
    remove,
    updateGuestMessages,
    loadGuestMessages,
    ensureGuestConversation,
  }
}
