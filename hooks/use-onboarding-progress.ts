"use client"

import useSWR from "swr"
import { useCallback, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/lib/providers/auth-provider"
import { MILESTONES, TOTAL_MILESTONES } from "@/lib/onboarding-milestones"

interface OnboardingRow {
  user_id: string
  completed_milestones: string[]
  dismissed: boolean
  created_at: string
  updated_at: string
}

export function useOnboardingProgress() {
  const { user } = useAuth()
  const supabase = useMemo(() => createClient(), [])

  const { data, error, isLoading, mutate } = useSWR<OnboardingRow | null>(
    user ? ["onboarding_progress", user.id] : null,
    async () => {
      const { data, error } = await supabase
        .from("onboarding_progress")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle()

      if (error) throw error
      return data as OnboardingRow | null
    },
    { revalidateOnFocus: false, dedupingInterval: 60000 },
  )

  const completed = data?.completed_milestones ?? []
  const dismissed = data?.dismissed ?? false
  const progress = TOTAL_MILESTONES > 0 ? Math.round((completed.length / TOTAL_MILESTONES) * 100) : 0

  const nextMilestone = useMemo(
    () => MILESTONES.find((m) => !completed.includes(m.key)) ?? null,
    [completed],
  )

  const completeMilestone = useCallback(
    async (key: string) => {
      if (!user || completed.includes(key)) return

      const updated = [...completed, key]

      // Optimistic update
      mutate(
        (prev) =>
          prev
            ? { ...prev, completed_milestones: updated }
            : {
                user_id: user.id,
                completed_milestones: updated,
                dismissed: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
        false,
      )

      const { error } = await supabase.from("onboarding_progress").upsert(
        {
          user_id: user.id,
          completed_milestones: updated,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      )

      if (error) {
        // Revert on failure
        mutate()
      }
    },
    [user, completed, supabase, mutate],
  )

  const dismiss = useCallback(async () => {
    if (!user) return

    mutate(
      (prev) =>
        prev
          ? { ...prev, dismissed: true }
          : {
              user_id: user.id,
              completed_milestones: [],
              dismissed: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
      false,
    )

    await supabase.from("onboarding_progress").upsert(
      {
        user_id: user.id,
        dismissed: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    )
  }, [user, supabase, mutate])

  return {
    milestones: MILESTONES,
    completed,
    progress,
    nextMilestone,
    completeMilestone,
    dismiss,
    dismissed,
    isLoading,
    isFirstSession: !isLoading && data === null,
    error: error ?? null,
  }
}
