'use client'

import { cn } from '@/lib/utils'

function getTileColor(pct: number) {
  if (pct > 1.5) return 'bg-emerald-500/40 border-emerald-500/30'
  if (pct > 0.5) return 'bg-emerald-500/25 border-emerald-500/20'
  if (pct > 0) return 'bg-emerald-500/10 border-emerald-500/10'
  if (pct > -0.5) return 'bg-red-500/10 border-red-500/10'
  if (pct > -1) return 'bg-red-500/25 border-red-500/20'
  return 'bg-red-500/40 border-red-500/30'
}

function getTextColor(pct: number) {
  if (pct > 0) return 'text-emerald-600'
  if (pct < 0) return 'text-red-600'
  return 'text-slate-400'
}

const tabs = ['Layer 1', 'DeFi', 'Memes'] as const

export function HeatmapMock() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden h-[360px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <span className="text-sm font-medium text-slate-900">Crypto Heatmap</span>
        <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-0.5">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={cn(
                'text-[10px] font-medium px-2.5 py-1 rounded-md transition-colors',
                tab === 'Layer 1'
                  ? 'bg-[#1DA1C4]/10 text-[#1DA1C4]'
                  : 'text-slate-400 hover:text-slate-600'
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap grid */}
      <div className="flex-1 p-3">
        <div className="grid grid-cols-4 grid-rows-3 gap-1.5 h-full">
          {/* Row 1: BTC (2 cols), ETH (2 cols) */}
          <div
            className={cn(
              'col-span-2 row-span-2 rounded-lg border flex flex-col items-center justify-center gap-0.5 transition-colors',
              getTileColor(3.2)
            )}
          >
            <span className="text-sm font-semibold text-slate-900">BTC</span>
            <span className={cn('text-xs font-mono tabular-nums', getTextColor(3.2))}>+3.2%</span>
          </div>
          <div
            className={cn(
              'col-span-2 row-span-1 rounded-lg border flex flex-col items-center justify-center gap-0.5',
              getTileColor(2.1)
            )}
          >
            <span className="text-xs font-semibold text-slate-900">ETH</span>
            <span className={cn('text-[10px] font-mono tabular-nums', getTextColor(2.1))}>+2.1%</span>
          </div>

          {/* Row 2 continued: SOL, AVAX */}
          <div
            className={cn(
              'rounded-lg border flex flex-col items-center justify-center gap-0.5',
              getTileColor(-1.4)
            )}
          >
            <span className="text-[10px] font-semibold text-slate-900">SOL</span>
            <span className={cn('text-[10px] font-mono tabular-nums', getTextColor(-1.4))}>-1.4%</span>
          </div>
          <div
            className={cn(
              'rounded-lg border flex flex-col items-center justify-center gap-0.5',
              getTileColor(1.8)
            )}
          >
            <span className="text-[10px] font-semibold text-slate-900">AVAX</span>
            <span className={cn('text-[10px] font-mono tabular-nums', getTextColor(1.8))}>+1.8%</span>
          </div>

          {/* Row 3: DOT, LINK, UNI, AAVE */}
          <div
            className={cn(
              'rounded-lg border flex flex-col items-center justify-center gap-0.5',
              getTileColor(0.6)
            )}
          >
            <span className="text-[10px] font-semibold text-slate-900">DOT</span>
            <span className={cn('text-[10px] font-mono tabular-nums', getTextColor(0.6))}>+0.6%</span>
          </div>
          <div
            className={cn(
              'rounded-lg border flex flex-col items-center justify-center gap-0.5',
              getTileColor(-0.8)
            )}
          >
            <span className="text-[10px] font-semibold text-slate-900">LINK</span>
            <span className={cn('text-[10px] font-mono tabular-nums', getTextColor(-0.8))}>-0.8%</span>
          </div>
          <div
            className={cn(
              'rounded-lg border flex flex-col items-center justify-center gap-0.5',
              getTileColor(4.2)
            )}
          >
            <span className="text-[10px] font-semibold text-slate-900">UNI</span>
            <span className={cn('text-[10px] font-mono tabular-nums', getTextColor(4.2))}>+4.2%</span>
          </div>
          <div
            className={cn(
              'rounded-lg border flex flex-col items-center justify-center gap-0.5',
              getTileColor(-0.3)
            )}
          >
            <span className="text-[10px] font-semibold text-slate-900">AAVE</span>
            <span className={cn('text-[10px] font-mono tabular-nums', getTextColor(-0.3))}>-0.3%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
