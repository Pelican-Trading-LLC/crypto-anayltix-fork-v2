"use client"

import React from 'react'

interface ProbabilityChartProps {
  data: number[]
  width?: string | number
  height?: number
}

export function ProbabilityChart({
  data,
  width = '100%',
  height = 80,
}: ProbabilityChartProps) {
  if (!data || data.length === 0) return null

  const padding = { top: 4, right: 4, bottom: 16, left: 4 }
  const chartWidth = 300
  const chartHeight = height
  const innerWidth = chartWidth - padding.left - padding.right
  const innerHeight = chartHeight - padding.top - padding.bottom

  // Y-axis range: 0-100
  const yMin = 0
  const yMax = 100

  const points = data
    .map((val, i) => {
      const x = padding.left + (i / (data.length - 1)) * innerWidth
      const y =
        padding.top + innerHeight - ((val - yMin) / (yMax - yMin)) * innerHeight
      return `${x},${y}`
    })
    .join(' ')

  const dateLabels = ['Mar 1', 'Mar 8', 'Mar 15', 'Mar 22']

  return (
    <svg
      viewBox={`0 0 ${chartWidth} ${chartHeight}`}
      width={width}
      height={height}
      preserveAspectRatio="none"
      style={{ display: 'block' }}
    >
      {/* Grid lines at 25%, 50%, 75% */}
      {[25, 50, 75].map((pct) => {
        const y =
          padding.top + innerHeight - ((pct - yMin) / (yMax - yMin)) * innerHeight
        return (
          <line
            key={pct}
            x1={padding.left}
            y1={y}
            x2={chartWidth - padding.right}
            y2={y}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={0.5}
            strokeDasharray="4 3"
          />
        )
      })}

      {/* Data line */}
      <polyline
        points={points}
        fill="none"
        stroke="#06B6D4"
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Date labels */}
      {dateLabels.map((label, i) => {
        const x =
          padding.left + (i / (dateLabels.length - 1)) * innerWidth
        return (
          <text
            key={label}
            x={x}
            y={chartHeight - 2}
            textAnchor={i === 0 ? 'start' : i === dateLabels.length - 1 ? 'end' : 'middle'}
            fill="var(--v2-text-tertiary, rgba(255,255,255,0.35))"
            fontSize={10}
            fontFamily="var(--font-mono, monospace)"
          >
            {label}
          </text>
        )
      })}
    </svg>
  )
}
