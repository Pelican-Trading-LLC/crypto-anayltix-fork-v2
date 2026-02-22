"use client"

import useSWR from "swr"
import { createClient } from "@/lib/supabase/client"
import { useMemo, useCallback } from "react"
import type { Playbook } from "@/types/trading"

// ── Types ──

export interface PlaybookFormData {
  name: string
  setup_type: string
  description?: string | null
  timeframe?: string | null
  market_conditions?: string | null
  entry_rules?: string | null
  exit_rules?: string | null
  risk_rules?: string | null
  checklist?: string[]
  market_type?: string
  instruments?: string[] | null
  notes?: string | null
}

export interface PlaybookStats {
  totalTrades: number
  winningTrades: number
  losingTrades: number
  winRate: number
  avgR: number | null
  profitFactor: number | null
  expectancy: number | null
  totalPnl: number
  bestTrade: { id: string; ticker: string; pnl: number } | null
  worstTrade: { id: string; ticker: string; pnl: number } | null
  recentTrades: Array<{
    id: string
    ticker: string
    direction: string
    pnl_amount: number | null
    pnl_percent: number | null
    r_multiple: number | null
    entry_date: string
    exit_date: string | null
  }>
  equityCurve: Array<{ date: string; cumPnl: number }>
  rDistribution: Array<{ range: string; count: number }>
}

// ── usePlaybooks ──

export function usePlaybooks() {
  const supabase = useMemo(() => createClient(), [])

  const { data, error, isLoading, mutate } = useSWR<Playbook[]>(
    'playbooks',
    async () => {
      const { data, error } = await supabase
        .from('playbooks')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (error) throw error
      return data as Playbook[]
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  )

  const playbooks = data || []

  const createPlaybook = useCallback(async (formData: PlaybookFormData): Promise<Playbook> => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('You must be logged in to create a playbook')

    // Get max display_order for ordering
    const maxOrder = playbooks.reduce((max, p) => Math.max(max, p.display_order), -1)

    const { data, error } = await supabase
      .from('playbooks')
      .insert({
        user_id: user.id,
        name: formData.name,
        setup_type: formData.setup_type,
        description: formData.description || null,
        timeframe: formData.timeframe || null,
        market_conditions: formData.market_conditions || null,
        entry_rules: formData.entry_rules || null,
        exit_rules: formData.exit_rules || null,
        risk_rules: formData.risk_rules || null,
        checklist: formData.checklist || [],
        market_type: formData.market_type || 'all',
        instruments: formData.instruments || null,
        notes: formData.notes || null,
        display_order: maxOrder + 1,
        is_active: true,
      })
      .select()
      .single()

    if (error) throw new Error(error.message || 'Failed to create playbook')
    mutate()
    return data as Playbook
  }, [supabase, mutate, playbooks])

  const updatePlaybook = useCallback(async (
    playbookId: string,
    updates: Partial<Playbook>
  ): Promise<void> => {
    const { error } = await supabase
      .from('playbooks')
      .update(updates)
      .eq('id', playbookId)

    if (error) throw new Error(error.message || 'Failed to update playbook')
    mutate()
  }, [supabase, mutate])

  const deletePlaybook = useCallback(async (playbookId: string): Promise<void> => {
    // Soft delete via is_active = false
    const { error } = await supabase
      .from('playbooks')
      .update({ is_active: false })
      .eq('id', playbookId)

    if (error) throw new Error(error.message || 'Failed to delete playbook')
    mutate()
  }, [supabase, mutate])

  const reorderPlaybooks = useCallback(async (
    orderedIds: string[]
  ): Promise<void> => {
    // Update display_order for each playbook
    const updates = orderedIds.map((id, index) =>
      supabase
        .from('playbooks')
        .update({ display_order: index })
        .eq('id', id)
    )

    const results = await Promise.all(updates)
    const failed = results.find(r => r.error)
    if (failed?.error) throw new Error(failed.error.message || 'Failed to reorder playbooks')
    mutate()
  }, [supabase, mutate])

  return {
    playbooks,
    isLoading,
    error: error ?? null,
    mutate,
    createPlaybook,
    updatePlaybook,
    deletePlaybook,
    reorderPlaybooks,
  }
}

// ── usePlaybookStats ──

export function usePlaybookStats(playbookId: string | null) {
  const supabase = useMemo(() => createClient(), [])

  const { data: stats, isLoading } = useSWR<PlaybookStats>(
    playbookId ? ['playbook-stats', playbookId] : null,
    async () => {
      if (!playbookId) throw new Error('No playbook ID')

      const { data: trades, error } = await supabase
        .from('trades')
        .select('id, ticker, direction, pnl_amount, pnl_percent, r_multiple, entry_date, exit_date, status')
        .eq('playbook_id', playbookId)
        .eq('status', 'closed')
        .order('exit_date', { ascending: true })

      if (error) throw error

      const closedTrades = trades || []
      const totalTrades = closedTrades.length

      if (totalTrades === 0) {
        return {
          totalTrades: 0,
          winningTrades: 0,
          losingTrades: 0,
          winRate: 0,
          avgR: null,
          profitFactor: null,
          expectancy: null,
          totalPnl: 0,
          bestTrade: null,
          worstTrade: null,
          recentTrades: [],
          equityCurve: [],
          rDistribution: [],
        }
      }

      const winningTrades = closedTrades.filter(t => (t.pnl_amount ?? 0) > 0)
      const losingTrades = closedTrades.filter(t => (t.pnl_amount ?? 0) <= 0)
      const winRate = totalTrades > 0 ? (winningTrades.length / totalTrades) * 100 : 0

      // Average R-multiple
      const rValues = closedTrades
        .map(t => t.r_multiple)
        .filter((r): r is number => r !== null)
      const avgR = rValues.length > 0
        ? rValues.reduce((sum, r) => sum + r, 0) / rValues.length
        : null

      // Profit factor
      const grossProfit = winningTrades.reduce((sum, t) => sum + (t.pnl_amount ?? 0), 0)
      const grossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + (t.pnl_amount ?? 0), 0))
      const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : null

      // Total P&L
      const totalPnl = closedTrades.reduce((sum, t) => sum + (t.pnl_amount ?? 0), 0)

      // Expectancy (average P&L per trade)
      const expectancy = totalTrades > 0 ? totalPnl / totalTrades : null

      // Best / worst trade
      const sorted = [...closedTrades].sort((a, b) => (a.pnl_amount ?? 0) - (b.pnl_amount ?? 0))
      const worst = sorted[0]
      const best = sorted[sorted.length - 1]
      const worstTrade = worst
        ? { id: worst.id, ticker: worst.ticker, pnl: worst.pnl_amount ?? 0 }
        : null
      const bestTrade = best
        ? { id: best.id, ticker: best.ticker, pnl: best.pnl_amount ?? 0 }
        : null

      // Recent trades (last 10)
      const recentTrades = [...closedTrades]
        .sort((a, b) => new Date(b.exit_date || b.entry_date).getTime() - new Date(a.exit_date || a.entry_date).getTime())
        .slice(0, 10)
        .map(t => ({
          id: t.id,
          ticker: t.ticker,
          direction: t.direction,
          pnl_amount: t.pnl_amount,
          pnl_percent: t.pnl_percent,
          r_multiple: t.r_multiple,
          entry_date: t.entry_date,
          exit_date: t.exit_date,
        }))

      // Equity curve
      let cumPnl = 0
      const equityCurve = closedTrades.map(t => {
        cumPnl += t.pnl_amount ?? 0
        return {
          date: t.exit_date || t.entry_date,
          cumPnl,
        }
      })

      // R-multiple distribution
      const rRanges = [
        { range: '< -2R', min: -Infinity, max: -2 },
        { range: '-2R to -1R', min: -2, max: -1 },
        { range: '-1R to 0R', min: -1, max: 0 },
        { range: '0R to 1R', min: 0, max: 1 },
        { range: '1R to 2R', min: 1, max: 2 },
        { range: '2R to 3R', min: 2, max: 3 },
        { range: '> 3R', min: 3, max: Infinity },
      ]
      const rDistribution = rRanges.map(({ range, min, max }) => ({
        range,
        count: rValues.filter(r => r >= min && r < max).length,
      }))

      return {
        totalTrades,
        winningTrades: winningTrades.length,
        losingTrades: losingTrades.length,
        winRate,
        avgR,
        profitFactor: profitFactor === Infinity ? null : profitFactor,
        expectancy,
        totalPnl,
        bestTrade,
        worstTrade,
        recentTrades,
        equityCurve,
        rDistribution,
      }
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  )

  return { stats: stats ?? null, isLoading }
}
