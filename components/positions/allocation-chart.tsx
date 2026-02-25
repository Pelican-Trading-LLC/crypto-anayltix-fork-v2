'use client'

import { useState, useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { PelicanCard } from '@/components/ui/pelican'
import { Trade } from '@/hooks/use-trades'
import {
  calculateAllocation,
  formatDollar,
  type AllocationView,
} from '@/lib/positions/dashboard-utils'

interface AllocationChartProps {
  openTrades: Trade[]
  onSelectTrade?: (tradeId: string) => void
}

export function AllocationChart({ openTrades, onSelectTrade }: AllocationChartProps) {
  const [view, setView] = useState<AllocationView>('ticker')

  const slices = useMemo(
    () => calculateAllocation(openTrades, view),
    [openTrades, view],
  )

  if (openTrades.length === 0) return null

  return (
    <PelicanCard>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
          Portfolio Allocation
        </h3>
        <div
          className="flex gap-1 p-0.5 rounded-lg"
          style={{ background: 'var(--bg-elevated)' }}
        >
          {(['ticker', 'asset_type'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setView(tab)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                view === tab
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              {tab === 'ticker' ? 'By Ticker' : 'By Asset Type'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="relative mx-auto" style={{ width: 240, height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={slices}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={60}
                strokeWidth={0}
                onClick={(entry) => {
                  if (view === 'ticker' && entry.tradeId && onSelectTrade) {
                    onSelectTrade(entry.tradeId)
                  }
                }}
                style={view === 'ticker' ? { cursor: 'pointer' } : undefined}
              >
                {slices.map((slice) => (
                  <Cell key={slice.label} fill={slice.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.[0]) return null
                  const d = payload[0].payload as (typeof slices)[0]
                  return (
                    <div
                      className="rounded-xl px-3 py-2 text-xs shadow-lg"
                      style={{
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border-default)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <p className="font-medium">{d.label}</p>
                      <p className="font-mono tabular-nums mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                        {formatDollar(d.value)} ({d.percent.toFixed(1)}%)
                      </p>
                    </div>
                  )
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-lg font-mono font-bold text-[var(--text-primary)]">
              {openTrades.length}
            </span>
            <span className="text-xs text-[var(--text-muted)]">
              {openTrades.length === 1 ? 'position' : 'positions'}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-3">
          {slices.map((slice) => (
            <div key={slice.label} className="flex items-center gap-1.5 text-xs">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: slice.color }}
              />
              <span className="text-[var(--text-secondary)]">{slice.label}</span>
              <span className="font-mono tabular-nums text-[var(--text-muted)]">
                {slice.percent.toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </PelicanCard>
  )
}
