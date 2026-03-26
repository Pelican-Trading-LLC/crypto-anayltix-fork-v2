'use client'

import { useRWAData } from '@/hooks/use-rwa'
import { formatCompact } from '@/lib/crypto-mock-data'

export function BriefTokenizationPulse() {
  const { data, isLoading } = useRWAData()

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-5">
        <span className="text-[11px] uppercase tracking-[1.5px] font-semibold text-muted-foreground">TOKENIZATION PULSE</span>
        <div className="mt-4 space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-6 rounded shimmer" />)}
        </div>
      </div>
    )
  }

  if (!data) return null

  const { assets, summary } = data
  const topAssets = assets?.slice(0, 5) ?? []

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] uppercase tracking-[1.5px] font-semibold text-muted-foreground">TOKENIZATION PULSE</span>
        <span className="text-[10px] text-muted-foreground/60">via rwa.xyz</span>
      </div>

      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <div className="font-mono text-lg font-semibold tabular-nums">{formatCompact(summary.totalTokenized)}</div>
            <div className="text-[10px] text-muted-foreground">Total Tokenized</div>
          </div>
          <div className="text-center">
            <div className="font-mono text-lg font-semibold tabular-nums">{formatCompact(summary.treasuries)}</div>
            <div className="text-[10px] text-muted-foreground">Treasuries</div>
          </div>
          <div className="text-center">
            <div className="font-mono text-lg font-semibold tabular-nums text-[#3EBD8C]">+{summary.change30d}%</div>
            <div className="text-[10px] text-muted-foreground">30D Growth</div>
          </div>
        </div>
      )}

      {/* Top Assets */}
      {topAssets.length > 0 && (
        <div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-medium">Top Assets</span>
          <div className="mt-2">
            {topAssets.map(asset => (
              <div key={asset.id} className="flex items-center justify-between py-2 border-b border-[var(--border-subtle)] last:border-0">
                <div className="flex-1 min-w-0 mr-3">
                  <span className="text-[12px] font-medium">{asset.name}</span>
                  <span className="text-[10px] text-muted-foreground ml-2">{asset.platform}</span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="font-mono text-[12px] tabular-nums">{formatCompact(asset.totalValue)}</span>
                  {asset.apy != null && (
                    <span className="font-mono text-[11px] text-[#3EBD8C] tabular-nums">{asset.apy}%</span>
                  )}
                  {asset.change30d != null && (
                    <span className={`font-mono text-[11px] tabular-nums ${asset.change30d >= 0 ? 'text-[#3EBD8C]' : 'text-[#E06565]'}`}>
                      {asset.change30d >= 0 ? '+' : ''}{asset.change30d.toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pelican Synthesis */}
      <div className="mt-4 px-3 py-2.5 rounded-lg bg-[#4A90C4]/5 border border-[#4A90C4]/10">
        <p className="text-[12px] text-muted-foreground leading-relaxed">
          <span className="text-[#4A90C4] font-semibold">Pelican:</span> Tokenized treasuries are the TradFi gateway drug. BlackRock BUIDL at $1.7B proves institutions want on-chain yield. This is structural — not a trade. The RWA sector is quietly building the infrastructure that bridges $300T in traditional assets to DeFi rails.
        </p>
      </div>
    </div>
  )
}
