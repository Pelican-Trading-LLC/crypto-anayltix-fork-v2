"use client"

import React from 'react'
import { useKrakenTickers } from '@/hooks/use-kraken'
import { formatPrice, formatPercent } from '@/lib/format'

const TICKER_SYMBOLS = [
  'BTC', 'ETH', 'SOL', 'XRP', 'ADA', 'AVAX', 'DOT', 'LINK',
  'ONDO', 'JUP', 'RENDER', 'DOGE', 'PEPE', 'ARB', 'SUI', 'AAVE',
]

// Fallback for non-crypto assets
const STATIC_TICKERS = [
  { symbol: 'DXY', price: '104.00', change: '-0.32%', positive: false },
  { symbol: 'SPX', price: '5,248.20', change: '+0.41%', positive: true },
  { symbol: 'GOLD', price: '$2,180.50', change: '+0.68%', positive: true },
]

interface TickerDisplay {
  symbol: string
  price: string
  change: string
  positive: boolean
}

function TickerItem({ item }: { item: TickerDisplay }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', padding: '0 20px' }}>
      <span style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: 11 }}>{item.symbol}</span>
      <span style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: 11 }}>{item.price}</span>
      <span style={{
        color: item.positive ? 'var(--data-positive)' : 'var(--data-negative)',
        fontWeight: 600,
        fontSize: 10,
      }}>
        {item.positive ? '▲' : '▼'} {item.change}
      </span>
      <span style={{ color: 'var(--border-default)', margin: '0 4px' }}>│</span>
    </span>
  )
}

export function PortfolioStrip() {
  const { tickers, tickerMap } = useKrakenTickers()

  // Build display items from live data, falling back to mock
  const liveItems: TickerDisplay[] = TICKER_SYMBOLS.map(sym => {
    const t = tickerMap.get(sym)
    if (t) {
      return {
        symbol: sym,
        price: formatPrice(t.price),
        change: formatPercent(t.change24h),
        positive: t.change24h >= 0,
      }
    }
    // Fallback — show loading placeholder
    return { symbol: sym, price: '...', change: '', positive: true }
  })

  const allItems = [...liveItems, ...STATIC_TICKERS]

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 60,
        height: 32,
        background: 'var(--bg-surface-1)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        fontFamily: 'var(--font-mono)',
      }}
    >
      {/* Portfolio summary — fixed left */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '0 16px',
        flexShrink: 0,
        borderRight: '1px solid var(--border-subtle)',
        height: '100%',
        background: 'var(--bg-surface-1)',
        zIndex: 2,
      }}>
        <span style={{ color: 'var(--text-quaternary)', fontWeight: 500, fontSize: 10 }}>PORTFOLIO</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 11 }}>$46,423.59</span>
        <span style={{ color: 'var(--data-positive)', fontWeight: 600, fontSize: 10 }}>+$1,831.88 (+4.11%)</span>
      </div>

      {/* Rolling ticker */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            animation: 'ticker-scroll 45s linear infinite',
            whiteSpace: 'nowrap',
          }}
        >
          {allItems.map((item, i) => <TickerItem key={`a-${i}`} item={item} />)}
          {allItems.map((item, i) => <TickerItem key={`b-${i}`} item={item} />)}
        </div>
      </div>

      <style jsx>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
