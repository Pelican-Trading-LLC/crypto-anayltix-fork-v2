'use client'

import { usePolymarkets } from '@/hooks/use-polymarket'
import { categorizeMarket, formatVolume, type PolymarketMarket } from '@/lib/polymarket'

function MarketRow({ market }: { market: PolymarketMarket }) {
  const prices = market._parsedPrices || []
  const prob = prices[0] ? prices[0] * 100 : 50
  const pct = prob.toFixed(0)
  const color = prob >= 60 ? 'text-[#3EBD8C]' : prob <= 40 ? 'text-[#E06565]' : 'text-[#D4A042]'
  const bgColor = prob >= 60 ? 'bg-[#3EBD8C]/10' : prob <= 40 ? 'bg-[#E06565]/10' : 'bg-[#D4A042]/10'

  return (
    <div className="flex items-center justify-between py-2 border-b border-[var(--border-subtle)] last:border-0">
      <span className="text-[12px] text-muted-foreground flex-1 mr-3 line-clamp-1">{market.question}</span>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className={`font-mono text-[13px] font-semibold tabular-nums px-2 py-0.5 rounded-md ${color} ${bgColor}`}>
          {pct}%
        </span>
        <span className="font-mono text-[10px] text-muted-foreground tabular-nums w-16 text-right">
          {formatVolume(market.volume24hr || market.volume || 0)}
        </span>
      </div>
    </div>
  )
}

export function BriefPredictionMarkets() {
  const { markets, isLoading: marketsLoading } = usePolymarkets({ limit: 12 })

  const fedMarkets = markets.filter(m => categorizeMarket(m) === 'macro').slice(0, 4)
  const cryptoMarkets = markets.filter(m => categorizeMarket(m) === 'crypto').slice(0, 4)

  const isLoading = marketsLoading
  const isEmpty = !fedMarkets.length && !cryptoMarkets.length

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
      {fedMarkets.length > 0 && (
        <div className="mb-4">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-medium">Fed & Macro</span>
          <div className="mt-2">
            {fedMarkets.map(m => <MarketRow key={m.id} market={m} />)}
          </div>
        </div>
      )}

      {/* Crypto */}
      {cryptoMarkets.length > 0 && (
        <div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-medium">Crypto</span>
          <div className="mt-2">
            {cryptoMarkets.map(m => <MarketRow key={m.id} market={m} />)}
          </div>
        </div>
      )}

      {/* Pelican Synthesis */}
      <div className="mt-4 px-3 py-2.5 rounded-lg bg-[#4A90C4]/5 border border-[#4A90C4]/10">
        <p className="text-[12px] text-muted-foreground leading-relaxed">
          <span className="text-[#4A90C4] font-semibold">Pelican:</span> Prediction markets are the sharpest leading indicator for crypto. When Fed rate cut odds shift 10%+, BTC moves within 48 hours. Currently pricing in macro uncertainty — position sizing should be conservative until odds stabilize.
        </p>
      </div>
    </div>
  )
}
