"use client"

import { TradeStats, EquityCurvePoint } from "@/hooks/use-trade-stats"
import { TrendingUp, TrendingDown, Target, Award, AlertCircle } from "lucide-react"
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

interface DashboardTabProps {
  stats: TradeStats | null
  equityCurve: EquityCurvePoint[]
  isLoading: boolean
}

export function DashboardTab({ stats, equityCurve, isLoading }: DashboardTabProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-2" />
          <p className="text-foreground/50 text-sm">Loading stats...</p>
        </div>
      </div>
    )
  }

  if (!stats || stats.total_trades === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-foreground/50 text-sm">No trade data yet. Log your first trade to see stats!</p>
      </div>
    )
  }

  const statCards = [
    {
      label: 'Total P&L',
      value: `${stats.total_pnl >= 0 ? '+' : ''}$${stats.total_pnl.toFixed(2)}`,
      color: stats.total_pnl >= 0 ? 'text-green-400' : 'text-red-400',
      bgColor: stats.total_pnl >= 0 ? 'bg-green-600/10' : 'bg-red-600/10',
      borderColor: stats.total_pnl >= 0 ? 'border-green-500/30' : 'border-red-500/30',
      icon: stats.total_pnl >= 0 ? TrendingUp : TrendingDown,
    },
    {
      label: 'Win Rate',
      value: `${stats.win_rate.toFixed(1)}%`,
      color: stats.win_rate >= 50 ? 'text-green-400' : 'text-red-400',
      bgColor: 'bg-purple-600/10',
      borderColor: 'border-purple-500/30',
      icon: Target,
    },
    {
      label: 'Total Trades',
      value: stats.total_trades.toString(),
      color: 'text-foreground',
      bgColor: 'bg-white/[0.03]',
      borderColor: 'border-border',
      icon: Award,
    },
    {
      label: 'Profit Factor',
      value: stats.profit_factor.toFixed(2),
      color: stats.profit_factor >= 1 ? 'text-green-400' : 'text-red-400',
      bgColor: 'bg-white/[0.03]',
      borderColor: 'border-border',
      icon: AlertCircle,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className={`p-4 rounded-lg border ${card.bgColor} ${card.borderColor}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-foreground/60 uppercase tracking-wide">
                  {card.label}
                </span>
                <Icon className="w-4 h-4 text-foreground/40" />
              </div>
              <div className={`text-2xl font-bold font-mono tabular-nums ${card.color}`}>
                {card.value}
              </div>
            </div>
          )
        })}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border border-border bg-white/[0.03]">
          <div className="text-xs text-foreground/60 uppercase tracking-wide mb-2">
            Avg Win
          </div>
          <div className="text-xl font-mono font-semibold text-green-400">
            +${stats.avg_win.toFixed(2)}
          </div>
        </div>
        <div className="p-4 rounded-lg border border-border bg-white/[0.03]">
          <div className="text-xs text-foreground/60 uppercase tracking-wide mb-2">
            Avg Loss
          </div>
          <div className="text-xl font-mono font-semibold text-red-400">
            -${Math.abs(stats.avg_loss).toFixed(2)}
          </div>
        </div>
        <div className="p-4 rounded-lg border border-border bg-white/[0.03]">
          <div className="text-xs text-foreground/60 uppercase tracking-wide mb-2">
            Avg R-Multiple
          </div>
          <div className={`text-xl font-mono font-semibold ${
            stats.avg_r_multiple >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {stats.avg_r_multiple.toFixed(2)}R
          </div>
        </div>
      </div>

      {/* Equity Curve */}
      {equityCurve.length > 0 && (
        <div className="p-4 rounded-lg border border-border bg-white/[0.03]">
          <h3 className="text-sm font-semibold text-foreground mb-4">Equity Curve</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={equityCurve}>
              <XAxis
                dataKey="date"
                tick={{ fill: 'oklch(0.60 0.02 280)', fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis
                tick={{ fill: 'oklch(0.60 0.02 280)', fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'oklch(0.08 0.01 280)',
                  border: '1px solid oklch(0.18 0.02 280)',
                  borderRadius: '8px',
                  color: 'oklch(0.95 0.01 280)',
                }}
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: number | undefined) => [`$${(value ?? 0).toFixed(2)}`, 'P&L']}
              />
              <Line
                type="monotone"
                dataKey="cumulative_pnl"
                stroke="oklch(0.60 0.25 280)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
