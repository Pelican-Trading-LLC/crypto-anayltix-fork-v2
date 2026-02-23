"use client"

import useSWR from "swr"
import { useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/lib/providers/auth-provider"

/**
 * Determines if the current user is a first-time user by checking
 * whether they have ANY conversations with messages.
 *
 * This is the authoritative check — it queries the source of truth
 * (the conversations table) rather than relying on onboarding_progress
 * which may not exist for legacy users.
 */
export function useIsFirstTimeUser(): { isFirstTime: boolean; isLoading: boolean } {
  const { user } = useAuth()
  const supabase = useMemo(() => createClient(), [])

  const { data, isLoading } = useSWR(
    user ? ["is_first_time_user", user.id] : null,
    async () => {
      const { count, error } = await supabase
        .from("conversations")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user!.id)
        .gt("message_count", 0)
        .limit(1)

      if (error) throw error
      return (count ?? 0) === 0
    },
    { revalidateOnFocus: false, dedupingInterval: 120000 },
  )

  return {
    isFirstTime: !isLoading && data === true,
    isLoading,
  }
}
