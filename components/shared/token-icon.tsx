"use client"

import React from 'react'

const TOKEN_HUES: Record<string, number> = {
  FAF: 30, PUNCH: 340, WOJAK: 120, CAPTCHA: 160, VNUT: 270,
  NOHAT: 200, VDOR: 50, CATFU: 15, PIGEON: 220, JUP: 180,
  PTOKEN: 290, UNTIL: 80, CHUD: 310, MS2: 140, SPAWN: 260,
  LAYOFF: 350, SAMBA: 40, BTC: 35, ETH: 230, SOL: 280,
  AAPL: 0, NVDA: 120, ONDO: 200, PENGU: 210, META: 220,
  RENDER: 160, PUMP: 340, FARTCOIN: 60, MPLX: 270,
  KNIFE: 10, GOLD: 45, DXY: 190,
}

function hashHue(symbol: string): number {
  let hash = 0
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash) % 360
}

interface TokenIconProps {
  symbol: string
  size?: number
}

export function TokenIcon({ symbol, size = 22 }: TokenIconProps) {
  const hue = TOKEN_HUES[symbol.toUpperCase()] ?? hashHue(symbol)
  const letters = symbol.slice(0, 2).toUpperCase()
  const fontSize = size * 0.4

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `hsl(${hue}, 35%, 18%)`,
        border: `1px solid hsl(${hue}, 30%, 28%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontSize,
          fontWeight: 700,
          color: `hsl(${hue}, 45%, 65%)`,
          lineHeight: 1,
          fontFamily: 'var(--font-sans)',
        }}
      >
        {letters}
      </span>
    </div>
  )
}
