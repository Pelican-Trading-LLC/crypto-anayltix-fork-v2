"use client"

import useSWR from "swr"
import { createClient } from "@/lib/supabase/client"
import { useMemo, useCallback } from "react"
import { useAuth } from "@/lib/providers/auth-provider"

// ============================================================================
// Types
// ============================================================================

export interface TradePattern {
  id: string
  pattern_type: 'timing' | 'behavioral' | 'setup' | 'ticker' | 'risk' | 'emotional'
  title: string
  description: string
  severity: 'info' | 'warning' | 'critical'
  metrics: Record<string, any>
  is_dismissed: boolean
  discovered_at: string
}

// ============================================================================
// SWR Config
// ============================================================================

const swrConfig = {
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

export function useTradePatterns(): {
  patterns: TradePattern[]
  isLoading: boolean
  error: Error | null
  dismissPattern: (id: string) => Promise<void>
  refreshPatterns: () => void
} {
  const supabase = useMemo(() => createClient(), [])
  const { user } = useAuth()

  const { data, error, isLoading, mutate } = useSWR<TradePattern[]>(
    user ? ['trade-patterns', user.id] : null,
    async () => {
      const { data, error } = await supabase
        .from('trade_patterns')
        .select('*')
        .eq('is_dismissed', false)
        .order('discovered_at', { ascending: false })

      if (error) throw error
      return data as TradePattern[]
    },
    swrConfig,
  )

  const dismissPattern = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('trade_patterns')
      .update({ is_dismissed: true })
      .eq('id', id)

    if (error) {
      throw new Error(error.message || 'Failed to dismiss pattern')
    }

    mutate()
  }, [supabase, mutate])

  return {
    patterns: data ?? [],
    isLoading,
    error: error ?? null,
    dismissPattern,
    refreshPatterns: mutate,
  }
}
