"use client"

import React from 'react'

interface FlowBarProps {
  value: number
  maxValue: number
  color?: 'green' | 'red' | 'auto'
}

export function FlowBar({ value, maxValue, color = 'auto' }: FlowBarProps) {
  const fillPercent = Math.min((Math.abs(value) / maxValue) * 100, 100)

  let fillColor: string
  if (color === 'green') {
    fillColor = 'var(--v2-green)'
  } else if (color === 'red') {
    fillColor = 'var(--v2-red)'
  } else {
    fillColor = value >= 0 ? 'var(--v2-green)' : 'var(--v2-red)'
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        width: '40px',
        height: '5px',
        borderRadius: '2px',
        background: 'rgba(255,255,255,0.04)',
        marginLeft: '6px',
        verticalAlign: 'middle',
        overflow: 'hidden',
      }}
    >
      <span
        style={{
          width: `${fillPercent}%`,
          height: '100%',
          borderRadius: '2px',
          background: fillColor,
        }}
      />
    </span>
  )
}
