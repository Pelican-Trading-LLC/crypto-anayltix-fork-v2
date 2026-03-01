"use client"

import useSWR from "swr"
import { createClient } from "@/lib/supabase/client"
import { useMemo } from "react"
import { useAuth } from "@/lib/providers/auth-provider"

// ============================================================================
// Types
// ============================================================================

export interface TodayWarning {
  type: 'calendar' | 'streak' | 'plan'
  severity: 'warning' | 'critical'
  title: string
  message: string
  action: string
}

export interface TodaysWarnings {
  warnings: TodayWarning[]
  warning_count: number
  generated_at: string
}

// ============================================================================
// SWR Config
// ============================================================================

const rpcSwrConfig = {
  revalidateOnFocus: false,
  dedupingInterval: 120000,
  onErrorRetry: (error: Error & { status?: number }, _key: string, _config: unknown, revalidate: (opts?: { retryCount: number }) => void, { retryCount }: { retryCount: number }) => {
    if (error?.status === 404) return
    if (error?.status === 403) return
    if (retryCount >= 3) return
    setTimeout(() => revalidate({ retryCount }), 5000 * Math.pow(2, retryCount))
  },
}

// ============================================================================
// Hook
// ============================================================================

export function useTodaysWarnings(): {
  warnings: TodayWarning[]
  warningCount: number
  isLoading: boolean
  error: Error | null
  refresh: () => void
} {
  const supabase = useMemo(() => createClient(), [])
  const { user } = useAuth()

  const { data, error, isLoading, mutate } = useSWR<TodaysWarnings>(
    user ? ['todays-warnings', user.id] : null,
    async () => {
      const { data, error } = await supabase.rpc('get_todays_warnings', {
        p_user_id: user!.id,
      })

      if (error) throw error
      return data as TodaysWarnings
    },
    rpcSwrConfig,
  )

  return {
    warnings: data?.warnings ?? [],
    warningCount: data?.warning_count ?? 0,
    isLoading,
    error: error ?? null,
    refresh: mutate,
  }
}
