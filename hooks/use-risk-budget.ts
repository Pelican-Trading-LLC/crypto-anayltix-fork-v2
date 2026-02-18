"use client"

import useSWR from "swr"
import { useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { computeBudgetStatus, type BudgetStatus } from "@/lib/risk-budget/budget-tracker"
import { useTradingPlan } from "@/hooks/use-trading-plan"

export function useRiskBudget() {
  const supabase = useMemo(() => createClient(), [])
  const { plan } = useTradingPlan()

  const { data: budget, isLoading } = useSWR<BudgetStatus | null>(
    plan ? ['risk-budget', plan.id] : null,
    async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const now = new Date()
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()

      // Monday of current week
      const dayOfWeek = now.getDay()
      const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1
      const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - mondayOffset)
      const weekStart = monday.toISOString()

      // 1st of current month
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

      // Fetch today's trades
      const { data: todayData } = await supabase
        .from('trades')
        .select('pnl_amount, status')
        .eq('user_id', user.id)
        .gte('entry_date', todayStart)

      // Fetch week trades (closed)
      const { data: weekData } = await supabase
        .from('trades')
        .select('pnl_amount, status')
        .eq('user_id', user.id)
        .eq('status', 'closed')
        .gte('entry_date', weekStart)

      // Fetch month trades (closed)
      const { data: monthData } = await supabase
        .from('trades')
        .select('pnl_amount, status')
        .eq('user_id', user.id)
        .eq('status', 'closed')
        .gte('entry_date', monthStart)

      return computeBudgetStatus(
        plan,
        (todayData || []).map(t => ({ pnl_amount: t.pnl_amount, status: t.status })),
        (weekData || []).map(t => ({ pnl_amount: t.pnl_amount, status: t.status })),
        (monthData || []).map(t => ({ pnl_amount: t.pnl_amount, status: t.status })),
      )
    },
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  )

  return { budget: budget ?? null, isLoading }
}
