"use client"

import { useEffect } from "react"
import type { SupabaseClient } from "@supabase/supabase-js"

interface UseConversationRealtimeOptions {
  userId: string | null | undefined
  supabase: SupabaseClient
  onRefresh: () => void
}

export function useConversationRealtime({
  userId,
  supabase,
  onRefresh,
}: UseConversationRealtimeOptions) {
  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel(`conversations:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
          filter: `user_id=eq.${userId}`,
        },
        onRefresh
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [userId, supabase, onRefresh])

  useEffect(() => {
    if (!userId) return

    const handler = () => {
      onRefresh()
    }

    window.addEventListener("pelican:conversation-created", handler)
    return () => {
      window.removeEventListener("pelican:conversation-created", handler)
    }
  }, [userId, onRefresh])
}
