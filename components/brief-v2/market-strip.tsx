'use client'

import { CaretUp, CaretDown } from '@phosphor-icons/react'
import { useLivePrices } from '@/hooks/use-crypto-data'
import { MOCK_BRIEF_V2 } from '@/lib/crypto-mock-data'

export function MarketStrip() {
  const { data: livePrices, error: stripError } = useLivePrices(['BTC', 'ETH', 'SOL'])

  // Build market strip data: live prices override mock
  const priceMap = new Map(livePrices?.map(p => [p.symbol, p]) || [])

  const stripData = MOCK_BRIEF_V2.market_strip.map(m => {
    const live = priceMap.get(m.symbol)
    if (live && !m.suffix && !m.label) {
      // Override price tokens with live data
      return { ...m, price: live.price, change: live.price_change_24h }
    }
    return m // Keep BTC.D and F&G as mock
  })

  return (
    <div className="flex items-center gap-6 px-4 py-2 rounded-lg border bg-card mb-4 overflow-x-auto">
      {stripData.map(m => (
        <div key={m.symbol} className="flex items-center gap-2 shrink-0">
          <span className="text-[12px] font-medium text-muted-foreground">{m.symbol}</span>
          <span className="font-mono text-[12px] tabular-nums font-medium">
            {m.suffix ? `${m.price}${m.suffix}` : m.price > 1000 ? `${m.price.toLocaleString()}` : `${m.price}`}
          </span>
          {m.label ? (
            <span className="text-[10px] font-semibold text-amber-500">{m.label}</span>
          ) : m.change !== 0 ? (
            <span className={`inline-flex items-center gap-0.5 font-mono text-[10px] font-semibold ${m.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {m.change >= 0 ? <CaretUp size={8} weight="fill" /> : <CaretDown size={8} weight="fill" />}
              {m.change >= 0 ? '+' : ''}{m.change.toFixed(2)}%
            </span>
          ) : null}
        </div>
      ))}
      {stripError && (
        <span className="flex items-center gap-1 text-[10px] text-amber-500 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          offline
        </span>
      )}
    </div>
  )
}
