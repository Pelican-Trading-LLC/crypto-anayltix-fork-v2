"use client"

import useSWR from "swr"
import { useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { detectTilt, type TiltAlert } from "@/lib/tilt/tilt-detector"
import { useTradingPlan } from "@/hooks/use-trading-plan"

export function useTiltDetection() {
  const supabase = useMemo(() => createClient(), [])
  const { plan } = useTradingPlan()

  const { data, isLoading } = useSWR<TiltAlert[]>(
    'tilt-detection',
    async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const now = new Date()
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()

      // Today's trades
      const { data: todayData } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', user.id)
        .gte('entry_date', todayStart)
        .order('entry_date', { ascending: true })

      // Recent trades (last 20)
      const { data: recentData } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', user.id)
        .order('entry_date', { ascending: false })
        .limit(20)

      return detectTilt({
        todaysTrades: todayData || [],
        recentTrades: recentData || [],
        plan,
      })
    },
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  )

  const alerts = data || []
  const isOnTilt = alerts.some(a => a.severity === 'critical')

  return { alerts, isOnTilt, isLoading }
}
