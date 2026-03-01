"use client"

import useSWR from "swr"
import { createClient } from "@/lib/supabase/client"
import { useMemo } from "react"
import { useAuth } from "@/lib/providers/auth-provider"
import type { PortfolioSummary } from "@/types/portfolio"

// ============================================================================
// SWR Config
// ============================================================================

const rpcSwrConfig = {
  revalidateOnFocus: false,
  dedupingInterval: 30000,
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

export function usePortfolioSummary(): {
  data: PortfolioSummary | null
  isLoading: boolean
  error: Error | null
  refresh: () => void
} {
  const supabase = useMemo(() => createClient(), [])
  const { user } = useAuth()

  const { data, error, isLoading, mutate } = useSWR<PortfolioSummary>(
    user ? ['portfolio-summary', user.id] : null,
    async () => {
      const { data, error } = await supabase.rpc('get_portfolio_summary', {
        p_user_id: user!.id,
      })

      if (error) throw error
      return data as PortfolioSummary
    },
    rpcSwrConfig,
  )

  return {
    data: data ?? null,
    isLoading,
    error: error ?? null,
    refresh: mutate,
  }
}
