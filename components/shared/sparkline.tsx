"use client"

import React from 'react'

interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  positive: boolean
}

export function Sparkline({ data, width = 60, height = 20, positive }: SparklineProps) {
  if (!data || data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((v - min) / range) * (height - 2) - 1
    return `${x},${y}`
  }).join(' ')

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: 'inline-block', flexShrink: 0, verticalAlign: 'middle' }}
    >
      <polyline
        points={points}
        fill="none"
        stroke={positive ? 'var(--data-positive)' : 'var(--data-negative)'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
