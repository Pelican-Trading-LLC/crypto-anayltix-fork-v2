'use client'

import { cn } from '@/lib/utils'

export interface TooltipData {
  ticker: string
  companyName?: string
  price: number | null
  changePercent: number | null
  changeAmount?: number | null
  volume?: number | null
  marketCap?: number | null
  sector: string
}

interface HeatmapTooltipProps {
  data: TooltipData | null
  position: { x: number; y: number }
  visible: boolean
}

function formatLargeNumber(n: number): string {
  if (n >= 1e12) return `${(n / 1e12).toFixed(1)}T`
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`
  return n.toLocaleString()
}

export function HeatmapTooltip({ data, position, visible }: HeatmapTooltipProps) {
  if (!data || !visible) return null

  const change = data.changePercent ?? 0
  const isPositive = change >= 0

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        left: position.x + 12,
        top: position.y - 8,
        transform: position.x > (typeof window !== 'undefined' ? window.innerWidth - 260 : 800) ? 'translateX(calc(-100% - 24px))' : undefined,
      }}
    >
      <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg shadow-2xl p-3 min-w-[200px] max-w-[260px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-bold text-[var(--text-primary)]">{data.ticker}</span>
          <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{data.sector}</span>
        </div>

        {/* Company name */}
        {data.companyName && (
          <p className="text-xs text-[var(--text-muted)] mb-2 truncate">{data.companyName}</p>
        )}

        {/* Price + Change */}
        <div className="flex items-baseline justify-between mb-1">
          {data.price != null && (
            <span className="text-lg font-mono font-semibold tabular-nums text-[var(--text-primary)]">
              ${data.price.toFixed(2)}
            </span>
          )}
          <span className={cn(
            "text-sm font-mono font-semibold tabular-nums",
            isPositive ? 'text-[var(--data-positive)]' : 'text-[var(--data-negative)]'
          )}>
            {isPositive ? '+' : ''}{change.toFixed(2)}%
          </span>
        </div>

        {/* Volume + Market Cap */}
        {(data.volume != null || data.marketCap != null) && (
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--border-subtle)]">
            {data.volume != null && (
              <div>
                <p className="text-[10px] text-[var(--text-muted)] uppercase">Volume</p>
                <p className="text-xs font-mono tabular-nums text-[var(--text-secondary)]">{formatLargeNumber(data.volume)}</p>
              </div>
            )}
            {data.marketCap != null && (
              <div className="text-right">
                <p className="text-[10px] text-[var(--text-muted)] uppercase">Mkt Cap</p>
                <p className="text-xs font-mono tabular-nums text-[var(--text-secondary)]">{formatLargeNumber(data.marketCap)}</p>
              </div>
            )}
          </div>
        )}

        {/* Click hint */}
        <p className="text-[10px] text-[var(--text-muted)] mt-2 text-center">Click to analyze with Pelican</p>
      </div>
    </div>
  )
}
