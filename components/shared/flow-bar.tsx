"use client"

import React from 'react'

interface FlowBarProps {
  value: number
  max: number
}

export function FlowBar({ value, max }: FlowBarProps) {
  const pct = max === 0 ? 0 : Math.min(Math.abs(value) / max * 100, 100)
  const isPositive = value >= 0
  const fillWidth = Math.max(pct, 6) // min 3px out of 48px ≈ 6%

  return (
    <div
      style={{
        display: 'flex',
        width: 48,
        minWidth: 48,
        height: 6,
        borderRadius: 3,
        background: 'rgba(255,255,255,0.06)',
        overflow: 'hidden',
        flexShrink: 0,
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          [isPositive ? 'left' : 'right']: 0,
          top: 0,
          width: `${fillWidth}%`,
          height: '100%',
          borderRadius: 3,
          background: isPositive ? 'var(--data-positive)' : 'var(--data-negative)',
          opacity: 0.85,
        }}
      />
    </div>
  )
}
