"use client"

import { useEffect } from "react"
import type { SupabaseClient } from "@supabase/supabase-js"
import { logger } from "@/lib/logger"

export type ConversationRefreshSource = "realtime" | "window-event"

interface UseConversationRealtimeOptions {
  userId: string | null | undefined
  supabase: SupabaseClient
  onRefresh: (source: ConversationRefreshSource) => void
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
        () => {
          logger.info("[CONVERSATIONS-REALTIME] Refresh requested", { source: "realtime" })
          onRefresh("realtime")
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [userId, supabase, onRefresh])

  useEffect(() => {
    if (!userId) return

    const handler = () => {
      logger.info("[CONVERSATIONS-REALTIME] Refresh requested", { source: "window-event" })
      onRefresh("window-event")
    }

    window.addEventListener("pelican:conversation-created", handler)
    return () => {
      window.removeEventListener("pelican:conversation-created", handler)
    }
  }, [userId, onRefresh])
}
