import type { BlakeChartState } from '@/lib/blake-mode/types'
import { AdminModeToggle } from './AdminModeToggle'

function formatPrice(value: number, assetClass: BlakeChartState['assetClass']): string {
  if (assetClass === 'forex') return value.toFixed(5)
  if (value >= 1000) return value.toLocaleString(undefined, { maximumFractionDigits: 2 })
  return value.toFixed(2)
}

export function BlakeChartHeader({
  state,
  adminMode = false,
  onAdminModeChange,
}: {
  state: BlakeChartState
  adminMode?: boolean
  onAdminModeChange?: (enabled: boolean) => void
}) {
  const positive = state.priceChangePercent24h >= 0

  return (
    <div className={['flex items-start justify-between border-b border-black/10 px-4 py-3 text-[#1F2937]', adminMode ? 'bg-[#FEE2E2]' : 'bg-[#FAF9E7]'].join(' ')}>
      <div>
        <div className="flex items-baseline gap-2">
          <h2 className="text-[15px] font-semibold leading-none">{state.ticker}</h2>
          <span className="text-xs text-[#1F2937]/70">{state.displayName}</span>
          <span className="rounded-sm border border-black/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
            {state.timeframe}
          </span>
        </div>
        <p className="mt-1 text-[11px] uppercase tracking-wide text-[#1F2937]/60">
          Pipczar structure map · {state.assetClass}
        </p>
        {onAdminModeChange && (
          <div className="mt-2">
            <AdminModeToggle enabled={adminMode} onChange={onAdminModeChange} />
          </div>
        )}
      </div>

      <div className="text-right font-mono tabular-nums">
        <div className="text-lg font-semibold">{formatPrice(state.currentPrice, state.assetClass)}</div>
        <div className={positive ? 'text-xs text-[#15803D]' : 'text-xs text-[#B91C1C]'}>
          {positive ? '+' : ''}
          {state.priceChangePercent24h.toFixed(2)}%
        </div>
      </div>
    </div>
  )
}
