"use client"

import { useCallback } from "react"
import { useBehavioralInsights } from "@/hooks/use-behavioral-insights"

// ============================================================================
// Types
// ============================================================================

export interface AntiTradeWarning {
  type: 'ticker' | 'streak' | 'calendar' | 'plan' | 'sizing'
  severity: 'warning' | 'critical'
  title: string
  message: string
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Check if a date falls on an OPEX Friday (3rd Friday of the month).
 * OPEX Fridays are the 15th-21st when the day is Friday (day 5).
 */
function isOpexFriday(date: Date): boolean {
  const dayOfWeek = date.getDay()
  const dayOfMonth = date.getDate()
  return dayOfWeek === 5 && dayOfMonth >= 15 && dayOfMonth <= 21
}

// ============================================================================
// Hook
// ============================================================================

export function useAntiTradeCheck(): {
  checkTrade: (ticker: string, direction: string, positionSize?: number) => AntiTradeWarning[]
  isReady: boolean
} {
  const { data: insights, isLoading } = useBehavioralInsights()

  const checkTrade = useCallback((
    ticker: string,
    direction: string,
    positionSize?: number,
  ): AntiTradeWarning[] => {
    if (!insights || !insights.has_enough_data) return []

    const warnings: AntiTradeWarning[] = []
    const normalizedTicker = ticker.toUpperCase()

    // 1. Ticker history check
    const tickerData = insights.ticker_performance?.find(
      (t) => t.ticker.toUpperCase() === normalizedTicker,
    )
    if (tickerData && tickerData.total_trades >= 3 && tickerData.win_rate < 35) {
      warnings.push({
        type: 'ticker',
        severity: tickerData.win_rate < 25 ? 'critical' : 'warning',
        title: `Poor history with ${normalizedTicker}`,
        message: `You have a ${tickerData.win_rate.toFixed(0)}% win rate on ${normalizedTicker} across ${tickerData.total_trades} trades (avg P&L: $${tickerData.avg_pnl.toFixed(2)}).`,
      })
    }

    // 2. Losing streak check
    if (
      insights.streaks?.current_streak_type === 'losing' &&
      insights.streaks.current_streak_count >= 2
    ) {
      const count = insights.streaks.current_streak_count
      warnings.push({
        type: 'streak',
        severity: count >= 3 ? 'critical' : 'warning',
        title: `${count}-trade losing streak`,
        message: count >= 3 && insights.streaks.after_3_consecutive_losses?.total_trades > 0
          ? `After 3+ consecutive losses, your win rate drops to ${insights.streaks.after_3_consecutive_losses.win_rate.toFixed(0)}%. Consider stepping away.`
          : `You're on a ${count}-trade losing streak. Consider reducing size or taking a break.`,
      })
    }

    // 3. Calendar checks
    const now = new Date()
    const dayOfWeek = now.getDay()

    // OPEX Friday
    if (isOpexFriday(now) && insights.calendar_patterns?.opex_fridays) {
      const opex = insights.calendar_patterns.opex_fridays
      if (opex.total_trades >= 3 && opex.win_rate < 40) {
        warnings.push({
          type: 'calendar',
          severity: 'warning',
          title: 'OPEX Friday — historically weak',
          message: `Your OPEX Friday win rate is ${opex.win_rate.toFixed(0)}% across ${opex.total_trades} trades. Consider sitting out or reducing size.`,
        })
      }
    }

    // Day of week performance
    if (insights.day_of_week?.length > 0) {
      const todayStats = insights.day_of_week.find((d) => d.day_num === dayOfWeek)
      if (todayStats && todayStats.total_trades >= 5 && todayStats.win_rate < 35) {
        const dayName = todayStats.day_name
        warnings.push({
          type: 'calendar',
          severity: 'warning',
          title: `${dayName}s are your weakest day`,
          message: `Your ${dayName} win rate is ${todayStats.win_rate.toFixed(0)}% across ${todayStats.total_trades} trades (avg P&L: $${todayStats.avg_pnl.toFixed(2)}).`,
        })
      }
    }

    // 4. Position sizing check
    if (
      positionSize !== undefined &&
      insights.position_sizing?.has_data &&
      insights.position_sizing.avg_position_size
    ) {
      const avgSize = insights.position_sizing.avg_position_size
      const oversized = insights.position_sizing.oversized_trades

      if (
        positionSize > avgSize * 1.5 &&
        oversized &&
        oversized.total > 0 &&
        oversized.win_rate < (insights.position_sizing.normal_trades?.win_rate ?? 100)
      ) {
        warnings.push({
          type: 'sizing',
          severity: 'warning',
          title: 'Oversized position',
          message: `This position ($${positionSize.toLocaleString()}) is ${((positionSize / avgSize) * 100 - 100).toFixed(0)}% above your average. Oversized trades have a ${oversized.win_rate.toFixed(0)}% win rate vs ${insights.position_sizing.normal_trades?.win_rate.toFixed(0)}% for normal size.`,
        })
      }
    }

    return warnings
  }, [insights])

  return {
    checkTrade,
    isReady: !isLoading && insights !== null,
  }
}
