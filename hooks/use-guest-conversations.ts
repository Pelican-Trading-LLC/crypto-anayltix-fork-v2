"use client"

import { useCallback, type Dispatch, type SetStateAction } from "react"
import { isValidUUID } from "@/lib/supabase/helpers"

const GUEST_CONVERSATIONS_KEY = "pelican_guest_conversations"
const GUEST_USER_ID_KEY = "pelican_guest_user_id"

interface ConversationShape {
  id: string
  title: string
  created_at: string
  updated_at: string
  message_count: number
  last_message_preview: string
  user_id: string
  archived?: boolean
}

interface UseGuestConversationsOptions<TConversation extends ConversationShape> {
  isAuthenticated: boolean
  guestUserId: string | null
  setGuestUserId: Dispatch<SetStateAction<string | null>>
  setConversations: Dispatch<SetStateAction<TConversation[]>>
}

function generateGuestUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0
    const value = char === "x" ? random : (random & 0x3) | 0x8
    return value.toString(16)
  })
}

export function useGuestConversations<TConversation extends ConversationShape>({
  isAuthenticated,
  guestUserId,
  setGuestUserId,
  setConversations,
}: UseGuestConversationsOptions<TConversation>) {
  const saveGuestConversations = useCallback((conversations: TConversation[]) => {
    try {
      localStorage.setItem(GUEST_CONVERSATIONS_KEY, JSON.stringify(conversations))
    } catch {
      // Ignore localStorage write failures.
    }
  }, [])

  const loadGuestConversations = useCallback((): TConversation[] => {
    try {
      const stored = localStorage.getItem(GUEST_CONVERSATIONS_KEY)
      return stored ? (JSON.parse(stored) as TConversation[]) : []
    } catch {
      return []
    }
  }, [])

  const initializeGuestUserId = useCallback(() => {
    const storedGuestId = localStorage.getItem(GUEST_USER_ID_KEY)

    if (storedGuestId && isValidUUID(storedGuestId)) {
      setGuestUserId(storedGuestId)
      return
    }

    const newGuestId = generateGuestUUID()
    localStorage.setItem(GUEST_USER_ID_KEY, newGuestId)
    setGuestUserId(newGuestId)
  }, [setGuestUserId])

  const createGuestConversation = useCallback((title = "New Conversation"): TConversation | null => {
    if (isAuthenticated || !guestUserId) return null

    const newConversation = {
      id: `guest-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      title,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      message_count: 0,
      last_message_preview: "",
      user_id: guestUserId,
      archived: false,
    } as TConversation

    const updated = [newConversation, ...loadGuestConversations()]
    saveGuestConversations(updated)
    setConversations(updated)

    return newConversation
  }, [guestUserId, isAuthenticated, loadGuestConversations, saveGuestConversations, setConversations])

  const renameGuestConversation = useCallback((conversationId: string, newTitle: string) => {
    const updated = loadGuestConversations().map((conversation) =>
      conversation.id === conversationId
        ? { ...conversation, title: newTitle, updated_at: new Date().toISOString() }
        : conversation
    ) as TConversation[]

    saveGuestConversations(updated)
  }, [loadGuestConversations, saveGuestConversations])

  const archiveGuestConversation = useCallback((conversationId: string, archived = true) => {
    const updated = loadGuestConversations().map((conversation) =>
      conversation.id === conversationId
        ? { ...conversation, archived, updated_at: new Date().toISOString() }
        : conversation
    ) as TConversation[]

    saveGuestConversations(updated)
  }, [loadGuestConversations, saveGuestConversations])

  const removeGuestConversation = useCallback((conversationId: string) => {
    const updated = loadGuestConversations().filter((conversation) => conversation.id !== conversationId)
    saveGuestConversations(updated)
    localStorage.removeItem(`pelican_guest_messages_${conversationId}`)
  }, [loadGuestConversations, saveGuestConversations])

  const updateGuestMessages = useCallback((
    conversationId: string,
    messageCount: number,
    lastMessagePreview: string,
    messages?: unknown[]
  ) => {
    if (isAuthenticated) return

    const updated = loadGuestConversations().map((conversation) =>
      conversation.id === conversationId
        ? {
            ...conversation,
            message_count: messageCount,
            last_message_preview: lastMessagePreview,
            updated_at: new Date().toISOString(),
          }
        : conversation
    ) as TConversation[]

    saveGuestConversations(updated)
    setConversations(updated)

    if (messages?.length) {
      const toStore = messages.map((message: unknown) => {
        const parsed = message as {
          id: string
          role: string
          content: string
          timestamp: unknown
          attachments?: unknown
        }
        return {
          id: parsed.id,
          role: parsed.role,
          content: parsed.content,
          timestamp: parsed.timestamp,
          attachments: parsed.attachments,
        }
      })
      localStorage.setItem(`pelican_guest_messages_${conversationId}`, JSON.stringify(toStore))
    }
  }, [isAuthenticated, loadGuestConversations, saveGuestConversations, setConversations])

  const loadGuestMessages = useCallback((conversationId: string): unknown[] => {
    if (isAuthenticated) return []

    try {
      const stored = localStorage.getItem(`pelican_guest_messages_${conversationId}`)
      if (!stored) return []

      return (JSON.parse(stored) as Array<{ timestamp: string }>).map((message) => ({
        ...message,
        timestamp: new Date(message.timestamp),
        isStreaming: false,
      }))
    } catch {
      return []
    }
  }, [isAuthenticated])

  const ensureGuestConversation = useCallback((conversationId: string, title?: string) => {
    if (isAuthenticated) return

    const existing = loadGuestConversations()
    if (existing.some((conversation) => conversation.id === conversationId)) return

    const newConversation = {
      id: conversationId,
      title: title || "New Conversation",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      message_count: 0,
      last_message_preview: "",
      user_id: guestUserId || "",
      archived: false,
    } as TConversation

    const updated = [newConversation, ...existing]
    saveGuestConversations(updated)
    setConversations(updated)
  }, [guestUserId, isAuthenticated, loadGuestConversations, saveGuestConversations, setConversations])

  return {
    initializeGuestUserId,
    loadGuestConversations,
    createGuestConversation,
    renameGuestConversation,
    archiveGuestConversation,
    removeGuestConversation,
    updateGuestMessages,
    loadGuestMessages,
    ensureGuestConversation,
  }
}
