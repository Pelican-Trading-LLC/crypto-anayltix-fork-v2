"use client"

import React from 'react'

const TICKER_ITEMS = [
  { symbol: 'BTC', price: '$84,230.00', change: '+7.44%', positive: true },
  { symbol: 'ETH', price: '$2,180.00', change: '-6.84%', positive: false },
  { symbol: 'SOL', price: '$138.50', change: '-2.46%', positive: false },
  { symbol: 'BNB', price: '$612.40', change: '+1.82%', positive: true },
  { symbol: 'XRP', price: '$0.6284', change: '+3.21%', positive: true },
  { symbol: 'ADA', price: '$0.4520', change: '-1.18%', positive: false },
  { symbol: 'AVAX', price: '$34.80', change: '-1.97%', positive: false },
  { symbol: 'DOT', price: '$7.42', change: '+0.86%', positive: true },
  { symbol: 'LINK', price: '$16.85', change: '+18.66%', positive: true },
  { symbol: 'MATIC', price: '$0.892', change: '-0.54%', positive: false },
  { symbol: 'ONDO', price: '$1.34', change: '+6.80%', positive: true },
  { symbol: 'JUP', price: '$0.892', change: '+12.40%', positive: true },
  { symbol: 'RENDER', price: '$7.42', change: '+8.20%', positive: true },
  { symbol: 'DXY', price: '104.00', change: '-0.32%', positive: false },
  { symbol: 'SPX', price: '5,248.20', change: '+0.41%', positive: true },
  { symbol: 'GOLD', price: '$2,180.50', change: '+0.68%', positive: true },
]

function TickerItem({ item }: { item: typeof TICKER_ITEMS[0] }) {
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

      {/* Rolling ticker — Bloomberg style */}
      <div style={{
        flex: 1,
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            animation: 'ticker-scroll 40s linear infinite',
            whiteSpace: 'nowrap',
          }}
        >
          {/* Render twice for seamless loop */}
          {TICKER_ITEMS.map((item, i) => <TickerItem key={`a-${i}`} item={item} />)}
          {TICKER_ITEMS.map((item, i) => <TickerItem key={`b-${i}`} item={item} />)}
        </div>
      </div>

      {/* CSS animation */}
      <style jsx>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
