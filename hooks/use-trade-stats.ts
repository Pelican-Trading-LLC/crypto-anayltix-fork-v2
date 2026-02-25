"use client"

import useSWR from "swr"
import { createClient } from "@/lib/supabase/client"
import { useMemo } from "react"

export interface TradeStats {
  total_trades: number
  open_trades: number
  closed_trades: number
  win_rate: number
  total_pnl: number
  total_pnl_percent: number
  avg_win: number
  avg_loss: number
  largest_win: number
  largest_loss: number
  avg_r_multiple: number
  profit_factor: number
  expectancy: number
}

export interface SetupStats {
  setup_tag: string
  trade_count: number
  win_rate: number
  avg_pnl: number
  total_pnl: number
}

export interface DayOfWeekStats {
  day_of_week: string
  trade_count: number
  win_count: number
  loss_count: number
  total_pnl: number
  avg_pnl: number
}

export interface EquityCurvePoint {
  date: string
  cumulative_pnl: number
  trade_count: number
}

export interface UseTradeStatsReturn {
  stats: TradeStats | null
  setupStats: SetupStats[]
  dayOfWeekStats: DayOfWeekStats[]
  equityCurve: EquityCurvePoint[]
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

interface RawTrade {
  id: string
  status: string
  pnl_amount: number | null
  pnl_percent: number | null
  r_multiple: number | null
  exit_date: string | null
  entry_date: string
  setup_tags: string[] | null
  is_paper: boolean | null
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// ── Client-side fallback computation ──

function computeStatsFromTrades(trades: RawTrade[]): TradeStats {
  const openTrades = trades.filter(t => t.status === 'open')
  const closedTrades = trades.filter(t => t.status === 'closed')

  const wins = closedTrades.filter(t => (t.pnl_amount ?? 0) > 0)
  const losses = closedTrades.filter(t => (t.pnl_amount ?? 0) <= 0)

  const totalPnl = closedTrades.reduce((s, t) => s + (t.pnl_amount ?? 0), 0)
  const totalPnlPercent = closedTrades.reduce((s, t) => s + (t.pnl_percent ?? 0), 0)

  const avgWin = wins.length > 0
    ? wins.reduce((s, t) => s + (t.pnl_amount ?? 0), 0) / wins.length
    : 0
  const avgLoss = losses.length > 0
    ? losses.reduce((s, t) => s + (t.pnl_amount ?? 0), 0) / losses.length
    : 0

  const pnlValues = closedTrades.map(t => t.pnl_amount ?? 0)
  const largestWin = pnlValues.length > 0 ? Math.max(...pnlValues, 0) : 0
  const largestLoss = pnlValues.length > 0 ? Math.min(...pnlValues, 0) : 0

  const rValues = closedTrades
    .map(t => t.r_multiple)
    .filter((r): r is number => r !== null)
  const avgR = rValues.length > 0
    ? rValues.reduce((s, r) => s + r, 0) / rValues.length
    : 0

  const grossProfit = wins.reduce((s, t) => s + (t.pnl_amount ?? 0), 0)
  const grossLoss = Math.abs(losses.reduce((s, t) => s + (t.pnl_amount ?? 0), 0))
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 0 : 0

  const expectancy = closedTrades.length > 0 ? totalPnl / closedTrades.length : 0

  return {
    total_trades: trades.length,
    open_trades: openTrades.length,
    closed_trades: closedTrades.length,
    win_rate: closedTrades.length > 0 ? (wins.length / closedTrades.length) * 100 : 0,
    total_pnl: totalPnl,
    total_pnl_percent: totalPnlPercent,
    avg_win: avgWin,
    avg_loss: avgLoss,
    largest_win: largestWin,
    largest_loss: largestLoss,
    avg_r_multiple: avgR,
    profit_factor: profitFactor,
    expectancy,
  }
}

function computeEquityCurveFromTrades(trades: RawTrade[]): EquityCurvePoint[] {
  const closed = trades
    .filter(t => t.status === 'closed' && t.exit_date)
    .sort((a, b) => new Date(a.exit_date!).getTime() - new Date(b.exit_date!).getTime())

  let cumPnl = 0
  let count = 0
  return closed.map(t => {
    cumPnl += t.pnl_amount ?? 0
    count++
    return {
      date: t.exit_date!,
      cumulative_pnl: cumPnl,
      trade_count: count,
    }
  })
}

function computeSetupStatsFromTrades(trades: RawTrade[]): SetupStats[] {
  const closed = trades.filter(t => t.status === 'closed')
  const bySetup = new Map<string, RawTrade[]>()

  for (const trade of closed) {
    const tags = trade.setup_tags ?? ['Untagged']
    for (const tag of tags) {
      const list = bySetup.get(tag) || []
      list.push(trade)
      bySetup.set(tag, list)
    }
  }

  return Array.from(bySetup.entries()).map(([tag, tagTrades]) => {
    const wins = tagTrades.filter(t => (t.pnl_amount ?? 0) > 0)
    const totalPnl = tagTrades.reduce((s, t) => s + (t.pnl_amount ?? 0), 0)
    return {
      setup_tag: tag,
      trade_count: tagTrades.length,
      win_rate: tagTrades.length > 0 ? (wins.length / tagTrades.length) * 100 : 0,
      avg_pnl: tagTrades.length > 0 ? totalPnl / tagTrades.length : 0,
      total_pnl: totalPnl,
    }
  }).sort((a, b) => b.trade_count - a.trade_count)
}

function computeDayOfWeekFromTrades(trades: RawTrade[]): DayOfWeekStats[] {
  const closed = trades.filter(t => t.status === 'closed' && t.exit_date)
  const byDay = new Map<number, RawTrade[]>()

  for (const trade of closed) {
    const day = new Date(trade.exit_date!).getDay()
    const list = byDay.get(day) || []
    list.push(trade)
    byDay.set(day, list)
  }

  return DAY_NAMES.map((name, idx) => {
    const dayTrades = byDay.get(idx) || []
    const wins = dayTrades.filter(t => (t.pnl_amount ?? 0) > 0)
    const losses = dayTrades.filter(t => (t.pnl_amount ?? 0) <= 0)
    const totalPnl = dayTrades.reduce((s, t) => s + (t.pnl_amount ?? 0), 0)
    return {
      day_of_week: name,
      trade_count: dayTrades.length,
      win_count: wins.length,
      loss_count: losses.length,
      total_pnl: totalPnl,
      avg_pnl: dayTrades.length > 0 ? totalPnl / dayTrades.length : 0,
    }
  }).filter(d => d.trade_count > 0)
}

// ── Shared SWR config ──

const rpcSwrConfig = {
  revalidateOnFocus: false,
  dedupingInterval: 60000,
  shouldRetryOnError: false,
}

// ── Combined data type ──

interface AllTradeStatsData {
  stats: TradeStats
  setupStats: SetupStats[]
  dayOfWeekStats: DayOfWeekStats[]
  equityCurve: EquityCurvePoint[]
}

/**
 * Hook for fetching trade statistics
 *
 * Tries Supabase RPC functions first. If RPCs fail (404/missing),
 * falls back to client-side computation from raw trades.
 */
export function useTradeStats({
  isPaper,
}: {
  isPaper?: boolean
} = {}): UseTradeStatsReturn {
  const supabase = useMemo(() => createClient(), [])

  const { data, error, isLoading, mutate } = useSWR<AllTradeStatsData>(
    ['trade-stats-all', isPaper],
    async () => {
      // Try RPCs first
      const [statsRes, setupRes, dayRes, curveRes] = await Promise.allSettled([
        supabase.rpc('get_trade_stats', { p_is_paper: isPaper ?? null }),
        supabase.rpc('get_stats_by_setup', { p_is_paper: isPaper ?? null }),
        supabase.rpc('get_pnl_by_day_of_week', { p_is_paper: isPaper ?? null }),
        supabase.rpc('get_equity_curve', { p_is_paper: isPaper ?? null }),
      ])

      const statsOk = statsRes.status === 'fulfilled' && !statsRes.value.error && statsRes.value.data
      const setupOk = setupRes.status === 'fulfilled' && !setupRes.value.error && setupRes.value.data
      const dayOk = dayRes.status === 'fulfilled' && !dayRes.value.error && dayRes.value.data
      const curveOk = curveRes.status === 'fulfilled' && !curveRes.value.error && curveRes.value.data

      // If all RPCs succeeded, use their data
      if (statsOk && setupOk && dayOk && curveOk) {
        return {
          stats: statsRes.value.data as TradeStats,
          setupStats: (setupRes.value.data as SetupStats[]) || [],
          dayOfWeekStats: (dayRes.value.data as DayOfWeekStats[]) || [],
          equityCurve: (curveRes.value.data as EquityCurvePoint[]) || [],
        }
      }

      // Fallback: fetch raw trades and compute client-side
      let query = supabase
        .from('trades')
        .select('id, status, pnl_amount, pnl_percent, r_multiple, exit_date, entry_date, setup_tags, is_paper')

      if (isPaper != null) {
        query = query.eq('is_paper', isPaper)
      }

      const { data: trades, error: tradesError } = await query.order('exit_date', { ascending: true })
      if (tradesError) throw tradesError

      const rawTrades = (trades || []) as RawTrade[]

      return {
        stats: computeStatsFromTrades(rawTrades),
        setupStats: computeSetupStatsFromTrades(rawTrades),
        dayOfWeekStats: computeDayOfWeekFromTrades(rawTrades),
        equityCurve: computeEquityCurveFromTrades(rawTrades),
      }
    },
    rpcSwrConfig,
  )

  return {
    stats: data?.stats ?? null,
    setupStats: data?.setupStats ?? [],
    dayOfWeekStats: data?.dayOfWeekStats ?? [],
    equityCurve: data?.equityCurve ?? [],
    isLoading,
    error: error ?? null,
    refetch: () => mutate(),
  }
}
