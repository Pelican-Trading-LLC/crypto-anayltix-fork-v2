'use client'

import { useState } from 'react'
import { useRWAByCategory } from '@/hooks/use-rwa'
import { RWA_CATEGORIES } from '@/lib/api/rwa'
import type { RWAAsset } from '@/lib/api/rwa'
import { formatCompact } from '@/lib/crypto-mock-data'
import { usePelicanPanelContext } from '@/providers/pelican-panel-provider'
import { ChatCircle } from '@phosphor-icons/react'

const CATEGORY_LABELS: Record<string, string> = {
  all: 'All',
  treasuries: 'Treasuries',
  private_credit: 'Private Credit',
  commodities: 'Commodities',
  equities: 'Equities',
  real_estate: 'Real Estate',
  other: 'Other',
}

export function RWATab() {
  const [category, setCategory] = useState('all')
  const { data: assets, summary, isLoading } = useRWAByCategory(category)
  const { openWithPrompt } = usePelicanPanelContext()

  return (
    <div>
      {/* Stats Strip */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
          {[
            { label: 'Total Tokenized', value: formatCompact(summary.totalTokenized), change: summary.change30d },
            { label: 'Treasuries', value: formatCompact(summary.treasuries), change: 12.4 },
            { label: 'Private Credit', value: formatCompact(summary.privateCredit), change: 15.8 },
            { label: 'Equities', value: formatCompact(summary.equities), change: 8.2 },
            { label: 'Commodities', value: formatCompact(summary.commodities), change: 4.1 },
            { label: 'Real Estate', value: formatCompact(summary.realEstate), change: 1.4 },
          ].map(s => (
            <div key={s.label} className="rounded-xl border bg-card p-3 text-center">
              <div className="font-mono text-base font-semibold tabular-nums">{s.value}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{s.label}</div>
              <div className={`font-mono text-[11px] tabular-nums mt-1 ${s.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {s.change >= 0 ? '+' : ''}{s.change.toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category filter pills */}
      <div className="flex gap-1 mb-6 flex-wrap">
        {['all', ...RWA_CATEGORIES].map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
              cat === category
                ? 'bg-[#14B8A6]/15 text-[#14B8A6]'
                : 'text-muted-foreground hover:text-foreground hover:bg-[var(--bg-elevated)]'
            }`}
          >
            {CATEGORY_LABELS[cat] || cat}
          </button>
        ))}
      </div>

      {/* Asset Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="flex items-center gap-4">
              <div className="flex-1 h-8 rounded shimmer" />
              <div className="w-20 h-8 rounded shimmer" />
              <div className="w-16 h-8 rounded shimmer" />
            </div>
          ))}
        </div>
      ) : !assets?.length ? (
        <div className="text-center py-12 text-muted-foreground text-sm">
          No assets found in this category.
        </div>
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {['NAME', 'PLATFORM', 'NETWORK', 'TOTAL VALUE', 'APY', '30D %', 'UNDERLYING', ''].map(h => (
                  <th key={h} className={`px-4 py-3 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground ${h !== 'NAME' && h !== 'PLATFORM' && h !== 'NETWORK' && h !== 'UNDERLYING' && h !== '' ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assets.map((asset: RWAAsset) => (
                <tr key={asset.id} className="border-b border-[var(--border)] last:border-0 hover:bg-accent/5 transition-colors">
                  <td className="px-4 py-3 text-[13px] font-medium">{asset.name}</td>
                  <td className="px-4 py-3 text-[12px] text-muted-foreground">{asset.platform}</td>
                  <td className="px-4 py-3 text-[12px] text-muted-foreground">{asset.network}</td>
                  <td className="px-4 py-3 font-mono text-[13px] tabular-nums text-right">{formatCompact(asset.totalValue)}</td>
                  <td className="px-4 py-3 font-mono text-[13px] tabular-nums text-right">
                    {asset.apy !== null ? <span className="text-green-500">{asset.apy}%</span> : <span className="text-muted-foreground">---</span>}
                  </td>
                  <td className="px-4 py-3 font-mono text-[12px] tabular-nums text-right">
                    {asset.change30d != null ? (
                      <span className={asset.change30d >= 0 ? 'text-green-500' : 'text-red-500'}>
                        {asset.change30d >= 0 ? '+' : ''}{asset.change30d.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-muted-foreground">---</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[11px] text-muted-foreground max-w-[200px] truncate">{asset.underlying}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openWithPrompt(null, {
                        visibleMessage: `Analyze ${asset.name}`,
                        fullPrompt: `[RWA ANALYSIS]\nAnalyze this tokenized real-world asset:\nName: ${asset.name}\nPlatform: ${asset.platform}\nNetwork: ${asset.network}\nTotal Value: $${asset.totalValue.toLocaleString()}\nAPY: ${asset.apy ?? 'N/A'}%\n30D Change: ${asset.change30d}%\nUnderlying: ${asset.underlying}\n\nProvide:\n1. Risk assessment of the underlying asset and platform\n2. Yield comparison vs traditional alternatives\n3. Smart money activity in this token\n4. Whether this represents genuine tokenization adoption or hype`
                      }, null)}
                      className="flex items-center gap-1 text-[11px] text-[#1DA1C4] hover:underline font-medium cursor-pointer whitespace-nowrap"
                    >
                      <ChatCircle size={12} weight="fill" />
                      Ask
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
