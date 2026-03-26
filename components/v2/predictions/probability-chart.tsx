"use client"

import React from 'react'

interface ProbabilityChartProps {
  data: number[]
  id: string
}

/**
 * Generate a smooth cubic bezier SVG path from data points.
 * Uses Catmull-Rom to Bezier conversion for natural curves.
 */
function smoothPath(points: [number, number][]): string {
  if (points.length < 2) return ''
  const first = points[0] as [number, number]
  if (points.length === 2) {
    const second = points[1] as [number, number]
    return `M${first[0]},${first[1]} L${second[0]},${second[1]}`
  }

  let d = `M${first[0]},${first[1]}`

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)] as [number, number]
    const p1 = points[i] as [number, number]
    const p2 = points[i + 1] as [number, number]
    const p3 = points[Math.min(i + 2, points.length - 1)] as [number, number]

    // Catmull-Rom to cubic bezier control points
    const tension = 6
    const cp1x = p1[0] + (p2[0] - p0[0]) / tension
    const cp1y = p1[1] + (p2[1] - p0[1]) / tension
    const cp2x = p2[0] - (p3[0] - p1[0]) / tension
    const cp2y = p2[1] - (p3[1] - p1[1]) / tension

    d += ` C${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`
  }

  return d
}

export function ProbabilityChart({ data, id }: ProbabilityChartProps) {
  if (!data || data.length === 0) return null

  const viewW = 280
  const viewH = 72
  const padX = 6
  const padTop = 4
  const padBottom = 14
  const innerW = viewW - padX * 2
  const innerH = viewH - padTop - padBottom

  // Map data to coordinates
  const points: [number, number][] = data.map((val, i) => {
    const x = padX + (i / (data.length - 1)) * innerW
    const y = padTop + innerH - (val / 100) * innerH
    return [x, y]
  })

  const linePath = smoothPath(points)

  // Area path: line path + close down to bottom
  const lastPt = points[points.length - 1]
  const firstPt = points[0]
  if (!lastPt || !firstPt) return null
  const areaPath = `${linePath} L${lastPt[0].toFixed(1)},${viewH - padBottom} L${firstPt[0].toFixed(1)},${viewH - padBottom} Z`

  const dateLabels = ['Mar 1', 'Mar 8', 'Mar 15', 'Mar 22']

  return (
    <svg
      viewBox={`0 0 ${viewW} ${viewH}`}
      width="100%"
      height={72}
      preserveAspectRatio="none"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id={`chartGrad-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.15} />
          <stop offset="100%" stopColor="#22D3EE" stopOpacity={0.0} />
        </linearGradient>
      </defs>

      {/* Area fill */}
      <path
        d={areaPath}
        fill={`url(#chartGrad-${id})`}
      />

      {/* Data line */}
      <path
        d={linePath}
        fill="none"
        stroke="#22D3EE"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Current value dot */}
      <circle
        cx={lastPt[0]}
        cy={lastPt[1]}
        r={3}
        fill="#22D3EE"
        stroke="var(--v2-bg-surface-2, #0F1420)"
        strokeWidth={2}
      />

      {/* Date labels */}
      {dateLabels.map((label, i) => {
        const x = padX + (i / (dateLabels.length - 1)) * innerW
        return (
          <text
            key={label}
            x={x}
            y={viewH - 2}
            textAnchor={i === 0 ? 'start' : i === dateLabels.length - 1 ? 'end' : 'middle'}
            fill="var(--v2-text-quaternary, rgba(255,255,255,0.25))"
            fontSize={9}
            fontFamily="var(--font-mono, monospace)"
          >
            {label}
          </text>
        )
      })}
    </svg>
  )
}
