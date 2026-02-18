'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AnalyticsChart } from '@/components/admin/AnalyticsChart'
import { HorizontalBarChart } from '@/components/admin/HorizontalBarChart'
import { ConversionFunnel } from '@/components/admin/ConversionFunnel'
import { DollarSign, RefreshCw, Users, UserCheck, MessageSquare, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AnalyticsData {
  daily_conversations_30d: { date: string; count: number }[]
  daily_signups_30d: { date: string; count: number }[]
  daily_messages_30d: { date: string; count: number }[]
  daily_credits_30d: { date: string; total_used: number }[]
  plan_distribution: { plan: string; count: number }[]
  top_tickers_30d: { ticker: string; count: number }[]
  user_activity_distribution: { bucket: string; count: number }[]
  conversion_funnel: { total_signups: number; active_trial: number; converted_paid: number; churned: number }
  mrr: number
  // New fields
  active_users_7d: number
  active_users_30d: number
  avg_messages_per_user: number
  avg_conversation_length: number
  total_conversations: number
  busiest_hours: { hour: number; label: string; count: number }[]
  fetched_at: string
}

function formatDayLabel(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function toChartData(series: { date: string; count: number }[]) {
  return series.map((d) => ({ label: formatDayLabel(d.date), value: d.count }))
}

function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

/** Skeleton placeholder for loading state */
function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <Card className={className}>
      <CardContent className="py-6">
        <div className="space-y-3">
          <div className="h-3 w-24 rounded bg-muted animate-pulse" />
          <div className="h-7 w-16 rounded bg-muted animate-pulse" />
        </div>
      </CardContent>
    </Card>
  )
}

function SkeletonChart() {
  return (
    <Card>
      <CardHeader>
        <div className="h-4 w-40 rounded bg-muted animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-px h-40">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-muted animate-pulse"
              style={{ height: `${20 + Math.random() * 60}%` }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function SkeletonHorizontalBars() {
  return (
    <Card>
      <CardHeader>
        <div className="h-4 w-48 rounded bg-muted animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-16 h-3 rounded bg-muted animate-pulse" />
              <div className="flex-1 h-5 rounded bg-muted animate-pulse" style={{ width: `${40 + Math.random() * 50}%` }} />
              <div className="w-8 h-3 rounded bg-muted animate-pulse" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }
    setError(null)
    try {
      const res = await fetch('/api/admin/analytics', { cache: 'no-store' })
      if (!res.ok) throw new Error(`Failed to fetch analytics (${res.status})`)
      const json: AnalyticsData = await res.json()
      setData(json)
      setLastUpdated(json.fetched_at ?? new Date().toISOString())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load analytics')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleRefresh = () => {
    if (refreshing) return
    fetchData(true)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Analytics</h1>
        </div>
        {/* Loading skeleton for MRR */}
        <SkeletonCard />
        {/* Loading skeleton for stat cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        {/* Loading skeleton for charts */}
        <div className="grid gap-4 lg:grid-cols-2">
          <SkeletonChart />
          <SkeletonChart />
          <SkeletonChart />
          <SkeletonChart />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <SkeletonHorizontalBars />
          <SkeletonHorizontalBars />
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-sm text-destructive">{error ?? 'No data'}</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => fetchData()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalPlanUsers = data.plan_distribution.reduce((s, p) => s + p.count, 0)

  return (
    <div className="space-y-6">
      {/* Header with refresh + last updated */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Last updated: {formatTimestamp(lastUpdated)}
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`size-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* MRR — prominent card with accent border */}
      <Card className="border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.08)]">
        <CardContent className="flex items-center gap-4 py-6">
          <div className="rounded-lg bg-emerald-500/10 p-3">
            <DollarSign className="size-6 text-emerald-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Monthly Recurring Revenue</p>
            <p className="text-3xl font-bold tabular-nums">${data.mrr.toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>

      {/* Active Users stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="rounded-md bg-blue-500/10 p-2">
              <UserCheck className="size-4 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Active Users (7d)</p>
              <p className="text-2xl font-bold tabular-nums">{data.active_users_7d.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="rounded-md bg-blue-500/10 p-2">
              <Users className="size-4 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Active Users (30d)</p>
              <p className="text-2xl font-bold tabular-nums">{data.active_users_30d.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="rounded-md bg-amber-500/10 p-2">
              <MessageSquare className="size-4 text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Avg Messages/User (30d)</p>
              <p className="text-2xl font-bold tabular-nums">{data.avg_messages_per_user.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="rounded-md bg-emerald-500/10 p-2">
              <Clock className="size-4 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Avg Conversation Length</p>
              <p className="text-2xl font-bold tabular-nums">
                {data.avg_conversation_length} <span className="text-sm font-normal text-muted-foreground">msgs</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time series charts -- 2x2 grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        <AnalyticsChart title="Messages Per Day" data={toChartData(data.daily_messages_30d)} />
        <AnalyticsChart
          title="Credit Consumption"
          data={data.daily_credits_30d.map((d) => ({ label: formatDayLabel(d.date), value: d.total_used }))}
          emptyMessage="Credit consumption is estimated from user message counts. No messages in the last 30 days."
        />
        <AnalyticsChart title="Conversations Per Day" data={toChartData(data.daily_conversations_30d)} />
        <AnalyticsChart title="Signups Per Day" data={toChartData(data.daily_signups_30d)} />
      </div>

      {/* Busiest Hours chart */}
      <AnalyticsChart
        title="Busiest Hours (UTC)"
        data={data.busiest_hours.map((h) => ({ label: h.label, value: h.count }))}
        emptyMessage="No message data available to determine busiest hours."
      />

      {/* Horizontal charts + funnel */}
      <div className="grid gap-4 lg:grid-cols-2">
        <HorizontalBarChart
          title="Popular Tickers (30 Days)"
          data={data.top_tickers_30d.map((t) => ({ label: t.ticker, value: t.count }))}
          emptyMessage="No ticker data yet. Tickers are extracted from user messages."
        />
        <HorizontalBarChart
          title="User Activity Distribution"
          data={data.user_activity_distribution.map((d) => ({ label: d.bucket, value: d.count }))}
          emptyMessage="No user activity data available."
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ConversionFunnel data={data.conversion_funnel} />

        {/* Plan Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Plan Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {data.plan_distribution.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No plan data available.</p>
            ) : (
              <div className="space-y-3">
                {data.plan_distribution.map(({ plan, count }) => {
                  const pct = totalPlanUsers > 0 ? (count / totalPlanUsers) * 100 : 0
                  return (
                    <div key={plan} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="capitalize font-medium">{plan}</span>
                        <span className="text-muted-foreground tabular-nums">
                          {count} ({pct.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
