'use client'

import { useCryptoMarkets, useFedRateMarkets } from '@/hooks/use-polymarket'
import type { ParsedMarket } from '@/lib/api/polymarket'
import { formatCompact } from '@/lib/crypto-mock-data'

function MarketRow({ market }: { market: ParsedMarket }) {
  const pct = (market.yesPrice * 100).toFixed(0)
  const color = market.yesPrice >= 0.6 ? 'text-green-500' : market.yesPrice <= 0.4 ? 'text-red-500' : 'text-amber-500'
  const bgColor = market.yesPrice >= 0.6 ? 'bg-green-500/10' : market.yesPrice <= 0.4 ? 'bg-red-500/10' : 'bg-amber-500/10'

  return (
    <div className="flex items-center justify-between py-2 border-b border-[var(--border-subtle)] last:border-0">
      <span className="text-[12px] text-muted-foreground flex-1 mr-3 line-clamp-1">{market.question}</span>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className={`font-mono text-[13px] font-semibold tabular-nums px-2 py-0.5 rounded-md ${color} ${bgColor}`}>
          {pct}%
        </span>
        <span className="font-mono text-[10px] text-muted-foreground tabular-nums w-16 text-right">
          {formatCompact(market.volume)}
        </span>
      </div>
    </div>
  )
}

export function BriefPredictionMarkets() {
  const { data: fedMarkets, isLoading: fedLoading } = useFedRateMarkets(4)
  const { data: cryptoMarkets, isLoading: cryptoLoading } = useCryptoMarkets(4)

  const isLoading = fedLoading && cryptoLoading
  const safeFed = Array.isArray(fedMarkets) ? fedMarkets : []
  const safeCrypto = Array.isArray(cryptoMarkets) ? cryptoMarkets : []
  const isEmpty = !safeFed.length && !safeCrypto.length

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[11px] uppercase tracking-[1.5px] font-semibold text-muted-foreground">PREDICTION MARKET SIGNALS</span>
        </div>
        <div className="space-y-3">
          {[1,2,3,4].map(i => <div key={i} className="h-6 rounded shimmer" />)}
        </div>
      </div>
    )
  }

  if (isEmpty) return null

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] uppercase tracking-[1.5px] font-semibold text-muted-foreground">PREDICTION MARKET SIGNALS</span>
        <span className="text-[10px] text-muted-foreground/60">via Polymarket</span>
      </div>

      {/* Fed & Macro */}
      {safeFed.length > 0 && (
        <div className="mb-4">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-medium">Fed & Macro</span>
          <div className="mt-2">
            {safeFed.map(m => <MarketRow key={m.id} market={m} />)}
          </div>
        </div>
      )}

      {/* Crypto */}
      {safeCrypto.length > 0 && (
        <div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-medium">Crypto</span>
          <div className="mt-2">
            {safeCrypto.map(m => <MarketRow key={m.id} market={m} />)}
          </div>
        </div>
      )}

      {/* Pelican Synthesis */}
      <div className="mt-4 px-3 py-2.5 rounded-lg bg-[#1DA1C4]/5 border border-[#1DA1C4]/10">
        <p className="text-[12px] text-muted-foreground leading-relaxed">
          <span className="text-[#1DA1C4] font-semibold">Pelican:</span> Prediction markets are the sharpest leading indicator for crypto. When Fed rate cut odds shift 10%+, BTC moves within 48 hours. Currently pricing in macro uncertainty — position sizing should be conservative until odds stabilize.
        </p>
      </div>
    </div>
  )
}
