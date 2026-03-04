"use client"

import { useState } from "react"

function getLogoSymbol(ticker: string): string {
  // Strip Polygon prefixes (X: for crypto, C: for forex)
  const cleaned = ticker.replace(/^X:/, '').replace(/^C:/, '')

  // Map crypto/forex pairs to base symbol
  const cryptoMap: Record<string, string> = {
    'BTCUSD': 'BTC',
    'ETHUSD': 'ETH',
    'SOLUSD': 'SOL',
    'ADAUSD': 'ADA',
    'DOGEUSD': 'DOGE',
    'XRPUSD': 'XRP',
    'MATICUSD': 'MATIC',
    'DOTUSD': 'DOT',
    'LINKUSD': 'LINK',
    'AVAXUSD': 'AVAX',
  }

  return cryptoMap[cleaned] || cleaned
}

export function LogoImg({ symbol, size = 16 }: { symbol: string; size?: number }) {
  const [hidden, setHidden] = useState(false)
  const logoSymbol = getLogoSymbol(symbol)

  if (hidden) return null

  return (
    <img
      src={`https://api.elbstream.com/logos/symbol/${logoSymbol}?format=png&size=50`}
      alt={`${symbol} logo`}
      className="rounded-sm object-contain flex-shrink-0"
      style={{ width: size, height: size }}
      loading="lazy"
      onError={() => setHidden(true)}
    />
  )
}
