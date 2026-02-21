"use client"

import useSWR from "swr"
import { createClient } from "@/lib/supabase/client"
import { useMemo } from "react"
import type { RuleComplianceStat } from "@/types/trading"

export function usePlanCompliance(startDate?: string, endDate?: string) {
  const supabase = useMemo(() => createClient(), [])

  const { data, error, isLoading, mutate } = useSWR<RuleComplianceStat[]>(
    ['plan-compliance', startDate, endDate],
    async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const { data, error } = await supabase.rpc('get_plan_compliance_stats', {
        p_user_id: user.id,
        p_start_date: startDate || null,
        p_end_date: endDate || null,
      })

      if (error) throw error
      return (data as RuleComplianceStat[]) || []
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      onErrorRetry: (error, _key, _config, revalidate, { retryCount }) => {
        if (retryCount >= 3) return
        setTimeout(() => revalidate({ retryCount }), 5000 * (retryCount + 1))
      },
    }
  )

  return {
    stats: data || [],
    isLoading,
    error: error ?? null,
    refresh: mutate,
  }
}
