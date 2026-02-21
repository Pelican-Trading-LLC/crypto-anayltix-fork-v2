"use client"

import useSWR from "swr"
import { createClient } from "@/lib/supabase/client"
import { useMemo } from "react"
import { useAuth } from "@/lib/providers/auth-provider"

// ============================================================================
// Types
// ============================================================================

export interface DayOfWeekInsight {
  day_num: number
  day_name: string
  total_trades: number
  wins: number
  losses: number
  win_rate: number
  total_pnl: number
  avg_pnl: number
  avg_hold_hours: number
}

export interface TickerInsight {
  ticker: string
  total_trades: number
  wins: number
  losses: number
  win_rate: number
  total_pnl: number
  avg_pnl: number
  avg_r: number
  avg_hold_hours: number
}

export interface ConvictionInsight {
  conviction_level: 'low' | 'medium' | 'high' | 'unset'
  total_trades: number
  wins: number
  win_rate: number
  avg_pnl: number
  avg_r: number
}

export interface HoldingPeriodInsight {
  period: 'under_1h' | '1h_to_4h' | '4h_to_1d' | '1d_to_3d' | '3d_to_1w' | 'over_1w'
  total_trades: number
  wins: number
  win_rate: number
  avg_pnl: number
  avg_r: number
  total_pnl: number
}

export interface StreakInsight {
  current_streak_type: 'winning' | 'losing' | 'none'
  current_streak_count: number
  max_win_streak: number
  max_loss_streak: number
  after_2_consecutive_losses: { total_trades: number; wins: number; win_rate: number; avg_pnl: number }
  after_3_consecutive_losses: { total_trades: number; wins: number; win_rate: number; avg_pnl: number }
}

export interface SizingInsight {
  has_data: boolean
  avg_position_size?: number
  oversized_trades?: { total: number; wins: number; win_rate: number; avg_pnl: number }
  normal_trades?: { total: number; wins: number; win_rate: number; avg_pnl: number }
}

export interface SetupInsight {
  setup: string
  total_trades: number
  wins: number
  win_rate: number
  avg_pnl: number
  avg_r: number
  total_pnl: number
}

export interface TimeOfDayInsight {
  session: 'pre_market_early' | 'first_hour' | 'midday' | 'afternoon' | 'after_hours'
  total_trades: number
  wins: number
  win_rate: number
  avg_pnl: number
  total_pnl: number
}

export interface CalendarInsight {
  overall_win_rate: number
  overall_avg_pnl: number
  opex_fridays: { total_trades: number; wins: number; win_rate: number; total_pnl: number; avg_pnl: number }
  fridays: { total_trades: number; wins: number; win_rate: number; total_pnl: number }
  mondays: { total_trades: number; wins: number; win_rate: number; total_pnl: number }
  first_trade_of_day: { total_trades: number; wins: number; win_rate: number; avg_pnl: number }
}

export interface BehavioralInsights {
  has_enough_data: boolean
  total_closed_trades: number
  min_trades_needed?: number
  message?: string
  generated_at?: string
  day_of_week: DayOfWeekInsight[]
  ticker_performance: TickerInsight[]
  conviction: ConvictionInsight[]
  holding_period: HoldingPeriodInsight[]
  streaks: StreakInsight
  position_sizing: SizingInsight
  setup_performance: SetupInsight[]
  time_of_day: TimeOfDayInsight[]
  calendar_patterns: CalendarInsight
}

// ============================================================================
// SWR Config
// ============================================================================

const rpcSwrConfig = {
  revalidateOnFocus: false,
  dedupingInterval: 300000,
  onErrorRetry: (error: any, _key: string, _config: any, revalidate: any, { retryCount }: { retryCount: number }) => {
    if (error?.status === 404) return
    if (error?.status === 403) return
    if (retryCount >= 3) return
    setTimeout(() => revalidate({ retryCount }), 5000 * Math.pow(2, retryCount))
  },
}

// ============================================================================
// Hook
// ============================================================================

export function useBehavioralInsights(): {
  data: BehavioralInsights | null
  isLoading: boolean
  error: Error | null
  refresh: () => void
} {
  const supabase = useMemo(() => createClient(), [])
  const { user } = useAuth()

  const { data, error, isLoading, mutate } = useSWR<BehavioralInsights>(
    user ? ['behavioral-insights', user.id] : null,
    async () => {
      const { data, error } = await supabase.rpc('get_all_behavioral_insights', {
        p_user_id: user!.id,
      })

      if (error) throw error
      return data as BehavioralInsights
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
