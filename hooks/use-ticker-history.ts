"use client"

import useSWR from "swr"
import { createClient } from "@/lib/supabase/client"
import { useMemo } from "react"
import { useAuth } from "@/lib/providers/auth-provider"

// ============================================================================
// Types
// ============================================================================

export interface TickerHistory {
  times_traded: number
  wins: number
  losses: number
  win_rate: number
  total_pnl: number
  avg_pnl: number
  avg_hold_days: number
  last_traded: string | null
  best_trade: number
  worst_trade: number
}

// ============================================================================
// SWR Config
// ============================================================================

const tickerHistorySwrConfig = {
  revalidateOnFocus: false,
  dedupingInterval: 120000,
  onErrorRetry: (error: any, _key: string, _config: any, revalidate: any, { retryCount }: { retryCount: number }) => {
    if (error?.status === 404) return
    if (error?.status === 403) return
    if (retryCount >= 3) return
    setTimeout(() => revalidate({ retryCount }), 5000 * Math.pow(2, retryCount))
  },
}

// ============================================================================
// Helpers
// ============================================================================

function computeHoldDays(entryDate: string | null, exitDate: string | null): number | null {
  if (!entryDate || !exitDate) return null
  const entry = new Date(entryDate)
  const exit = new Date(exitDate)
  if (isNaN(entry.getTime()) || isNaN(exit.getTime())) return null
  const diffMs = exit.getTime() - entry.getTime()
  return Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)))
}

interface ClosedTrade {
  ticker: string
  pnl_amount: number | null
  pnl_percent: number | null
  entry_date: string | null
  exit_date: string | null
  status: string
}

function aggregateByTicker(trades: ClosedTrade[]): Record<string, TickerHistory> {
  const grouped: Record<string, ClosedTrade[]> = {}

  for (const trade of trades) {
    if (trade.pnl_amount == null) continue
    if (!grouped[trade.ticker]) {
      grouped[trade.ticker] = []
    }
    grouped[trade.ticker]!.push(trade)
  }

  const result: Record<string, TickerHistory> = {}

  for (const [ticker, group] of Object.entries(grouped)) {
    const timesTr = group.length
    let wins = 0
    let losses = 0
    let totalPnl = 0
    let bestTrade = -Infinity
    let worstTrade = Infinity
    let lastTraded: string | null = null
    let holdDaysSum = 0
    let holdDaysCount = 0

    for (const trade of group) {
      const pnl = trade.pnl_amount!

      if (pnl > 0) {
        wins++
      } else {
        losses++
      }

      totalPnl += pnl

      if (pnl > bestTrade) bestTrade = pnl
      if (pnl < worstTrade) worstTrade = pnl

      if (trade.exit_date) {
        if (!lastTraded || trade.exit_date > lastTraded) {
          lastTraded = trade.exit_date
        }
      }

      const holdDays = computeHoldDays(trade.entry_date, trade.exit_date)
      if (holdDays != null) {
        holdDaysSum += holdDays
        holdDaysCount++
      }
    }

    result[ticker] = {
      times_traded: timesTr,
      wins,
      losses,
      win_rate: Math.round((wins / timesTr) * 1000) / 10,
      total_pnl: Math.round(totalPnl * 100) / 100,
      avg_pnl: Math.round((totalPnl / timesTr) * 100) / 100,
      avg_hold_days: holdDaysCount > 0 ? Math.round((holdDaysSum / holdDaysCount) * 10) / 10 : 0,
      last_traded: lastTraded,
      best_trade: bestTrade === -Infinity ? 0 : Math.round(bestTrade * 100) / 100,
      worst_trade: worstTrade === Infinity ? 0 : Math.round(worstTrade * 100) / 100,
    }
  }

  return result
}

// ============================================================================
// Hook
// ============================================================================

const EMPTY_RESULT: Record<string, TickerHistory> = {}

export function useTickerHistory(tickers: string[]): {
  data: Record<string, TickerHistory>
  isLoading: boolean
} {
  const supabase = useMemo(() => createClient(), [])
  const { user } = useAuth()

  const { data, isLoading } = useSWR<Record<string, TickerHistory>>(
    user && tickers.length > 0 ? ['ticker-history', user.id, tickers.sort().join(',')] : null,
    async () => {
      const { data: trades, error } = await supabase
        .from('trades')
        .select('ticker, pnl_amount, pnl_percent, entry_date, exit_date, status')
        .in('ticker', tickers)
        .eq('status', 'closed')

      if (error) throw error
      if (!trades || trades.length === 0) return EMPTY_RESULT

      return aggregateByTicker(trades as ClosedTrade[])
    },
    tickerHistorySwrConfig,
  )

  return {
    data: data ?? EMPTY_RESULT,
    isLoading,
  }
}
