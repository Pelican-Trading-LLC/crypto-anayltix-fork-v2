import type { BlakeConfluence } from '@/lib/blake-mode/confluence/aggregator'

function formatCompact(value: number): string {
  const abs = Math.abs(value)
  if (abs >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`
  if (abs >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
  return value.toFixed(2)
}

function MetricCard({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-[#0B1220] p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-white/42">{label}</p>
      <p className="mt-2 font-mono text-lg font-semibold tabular-nums text-white">{value}</p>
      {detail && <p className="mt-1 text-xs text-white/52">{detail}</p>}
    </div>
  )
}

export function ConfluencePanel({ confluence }: { confluence: BlakeConfluence }) {
  if (confluence.type === 'crypto') {
    const data = confluence.data
    return (
      <section className="rounded-md border border-white/10 bg-[#101A2B] p-4 shadow-xl shadow-black/20">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Confluence</h3>
          <span className="font-mono text-[10px] uppercase tracking-wide text-white/40">crypto</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            label="Funding Rate"
            value={data.funding ? `${(data.funding.current * 100).toFixed(3)}%` : 'n/a'}
            detail={data.funding ? data.funding.trend : undefined}
          />
          <MetricCard
            label="Liquidations"
            value={data.liquidations ? formatCompact(data.liquidations.upsideAmount) : 'n/a'}
            detail={data.liquidations ? `upside near ${data.liquidations.upsideClusterPrice.toFixed(2)}` : undefined}
          />
          <MetricCard
            label="Whale Activity"
            value={data.whaleActivity ? data.whaleActivity.activeWallets24h.toLocaleString() : 'n/a'}
            detail={data.whaleActivity ? data.whaleActivity.netFlow : undefined}
          />
          <MetricCard
            label="Polymarket"
            value={data.predictionMarkets?.[0] ? `${data.predictionMarkets[0].probability.toFixed(1)}%` : 'n/a'}
            detail={data.predictionMarkets?.[0]?.contract.slice(0, 64)}
          />
        </div>
      </section>
    )
  }

  if (confluence.type === 'equity') {
    const data = confluence.data
    return (
      <section className="rounded-md border border-white/10 bg-[#101A2B] p-4 shadow-xl shadow-black/20">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Confluence</h3>
          <span className="font-mono text-[10px] uppercase tracking-wide text-white/40">equity</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <MetricCard label="10Y Yield" value={data.macro ? `${data.macro.tenYearYield.toFixed(2)}%` : 'n/a'} />
          <MetricCard label="DXY" value={data.macro ? data.macro.dxy.toFixed(2) : 'n/a'} />
          <MetricCard label="VIX" value={data.macro ? data.macro.vix.toFixed(2) : 'n/a'} />
          <MetricCard
            label="30D vs SPY"
            value={data.relativeStrength ? `${data.relativeStrength.vsSpyPercent30d >= 0 ? '+' : ''}${data.relativeStrength.vsSpyPercent30d.toFixed(2)}%` : 'n/a'}
          />
        </div>
      </section>
    )
  }

  const data = confluence.data

  return (
    <section className="rounded-md border border-white/10 bg-[#101A2B] p-4 shadow-xl shadow-black/20">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Confluence</h3>
        <span className="font-mono text-[10px] uppercase tracking-wide text-white/40">forex</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          label="DXY"
          value={data.dxy ? data.dxy.current.toFixed(2) : 'n/a'}
          detail={data.dxy ? `${data.dxy.oneDayChange >= 0 ? '+' : ''}${data.dxy.oneDayChange.toFixed(2)}% 1D` : undefined}
        />
        <MetricCard
          label="Yield Differential"
          value={data.yieldDifferential ? `${data.yieldDifferential.differential.toFixed(2)}%` : 'n/a'}
          detail={data.yieldDifferential ? data.yieldDifferential.trend : undefined}
        />
      </div>
    </section>
  )
}
