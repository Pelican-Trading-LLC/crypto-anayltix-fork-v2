"use client"

import React, { useState } from 'react'
import { FilterPill } from '@/components/v2/filter-pill'
import { TimeToggle } from '@/components/v2/time-toggle'
import type { V2Wallet } from '@/lib/crypto-mock-data'
import { formatCompact } from '@/lib/crypto-mock-data'

interface ScatterPlotProps {
  wallets: V2Wallet[]
}

export function ScatterPlot({ wallets }: ScatterPlotProps) {
  const [timeRange, setTimeRange] = useState('30D')

  const padding = { top: 20, right: 20, bottom: 32, left: 48 }
  const width = 600
  const height = 200

  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom

  const maxPnl = Math.max(...wallets.map((w) => w.realizedPnl))
  const maxRoi = Math.max(...wallets.map((w) => w.roi))

  // Generate grid ticks
  const xTicks = [0, maxPnl * 0.25, maxPnl * 0.5, maxPnl * 0.75, maxPnl]
  const yTicks = [0, maxRoi * 0.25, maxRoi * 0.5, maxRoi * 0.75, maxRoi]

  function xPos(val: number) {
    return padding.left + (val / maxPnl) * chartW
  }
  function yPos(val: number) {
    return padding.top + chartH - (val / maxRoi) * chartH
  }

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
        }}
      >
        <span
          className="v2-sans"
          style={{ fontSize: '14px', fontWeight: 700, color: 'var(--v2-text-primary)' }}
        >
          Who Are The Best Smart Money Traders?
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FilterPill label="Label" />
          <FilterPill label="+ Filter" />
          <TimeToggle
            options={['7D', '30D', '90D', '180D']}
            value={timeRange}
            onChange={setTimeRange}
          />
        </div>
      </div>

      {/* Chart */}
      <div
        style={{
          height: '200px',
          background: 'var(--v2-bg-elevated)',
          border: '1px solid var(--v2-border)',
          borderRadius: '6px',
          padding: '16px',
        }}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          height="100%"
          style={{ overflow: 'visible' }}
        >
          {/* Grid lines */}
          {xTicks.map((t, i) => (
            <line
              key={`xg-${i}`}
              x1={xPos(t)}
              y1={padding.top}
              x2={xPos(t)}
              y2={padding.top + chartH}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
          ))}
          {yTicks.map((t, i) => (
            <line
              key={`yg-${i}`}
              x1={padding.left}
              y1={yPos(t)}
              x2={padding.left + chartW}
              y2={yPos(t)}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
          ))}

          {/* X-axis labels */}
          {xTicks.map((t, i) => (
            <text
              key={`xl-${i}`}
              x={xPos(t)}
              y={height - 2}
              textAnchor="middle"
              fill="var(--v2-text-tertiary)"
              fontSize="10"
              fontFamily="var(--font-geist-mono), monospace"
            >
              ${formatCompact(t)}
            </text>
          ))}

          {/* Y-axis labels */}
          {yTicks.map((t, i) => (
            <text
              key={`yl-${i}`}
              x={padding.left - 6}
              y={yPos(t) + 3}
              textAnchor="end"
              fill="var(--v2-text-tertiary)"
              fontSize="10"
              fontFamily="var(--font-geist-mono), monospace"
            >
              {Math.round(t)}%
            </text>
          ))}

          {/* Axis labels */}
          <text
            x={padding.left + chartW / 2}
            y={height + 8}
            textAnchor="middle"
            fill="var(--v2-text-tertiary)"
            fontSize="10"
            fontFamily="var(--font-geist-mono), monospace"
          >
            Realized PnL
          </text>
          <text
            x={8}
            y={padding.top + chartH / 2}
            textAnchor="middle"
            fill="var(--v2-text-tertiary)"
            fontSize="10"
            fontFamily="var(--font-geist-mono), monospace"
            transform={`rotate(-90, 8, ${padding.top + chartH / 2})`}
          >
            ROI %
          </text>

          {/* Dots */}
          {wallets.map((w, i) => (
            <circle
              key={i}
              cx={xPos(w.realizedPnl)}
              cy={yPos(w.roi)}
              r={4}
              fill="transparent"
              stroke="#06B6D4"
              strokeWidth={1.5}
            />
          ))}
        </svg>
      </div>
    </div>
  )
}
