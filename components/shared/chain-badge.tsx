"use client"

import React from 'react'

interface ChainBadgeProps {
  chain: string
}

export function ChainBadge({ chain }: ChainBadgeProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 24,
        height: 18,
        borderRadius: 3,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid var(--border-subtle)',
        fontSize: 8,
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        color: 'var(--text-quaternary)',
        lineHeight: 1,
      }}
    >
      {chain}
    </span>
  )
}
