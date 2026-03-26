"use client"

import React from 'react'

interface FlowBarProps {
  value: number
  maxAbsolute: number
  width?: number
  height?: number
}

export function FlowBar({ value, maxAbsolute, width = 48, height = 4 }: FlowBarProps) {
  if (value === 0 || maxAbsolute === 0) {
    return (
      <span
        style={{
          display: 'inline-flex',
          width: `${width}px`,
          height: `${height}px`,
          borderRadius: `${height / 2}px`,
          background: 'rgba(255,255,255,0.04)',
          verticalAlign: 'middle',
        }}
      />
    )
  }

  const fillPercent = Math.max(4, Math.min((Math.abs(value) / maxAbsolute) * 100, 100))
  const isPositive = value > 0
  const fillColor = isPositive ? 'var(--v2-green)' : 'var(--v2-red)'

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: isPositive ? 'flex-start' : 'flex-end',
        width: `${width}px`,
        height: `${height}px`,
        borderRadius: `${height / 2}px`,
        background: 'rgba(255,255,255,0.04)',
        verticalAlign: 'middle',
        overflow: 'hidden',
      }}
    >
      <span
        style={{
          width: `${fillPercent}%`,
          height: '100%',
          borderRadius: `${height / 2}px`,
          background: fillColor,
          opacity: 0.8,
        }}
      />
    </span>
  )
}
