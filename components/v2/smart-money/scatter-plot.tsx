"use client"

import React, { useState } from 'react'
import { FilterPill } from '@/components/v2/filter-pill'
import { TimeToggle } from '@/components/v2/time-toggle'
import type { V2Wallet } from '@/lib/crypto-mock-data'

interface ScatterPlotProps {
  wallets: V2Wallet[]
}

const Y_LABELS = ['0%', '100%', '200%', '300%', '400%', '500%']
const X_LABELS = ['$0', '$20K', '$40K', '$60K', '$80K', '$100K', '$120K']

export function ScatterPlot({ wallets }: ScatterPlotProps) {
  const [timeRange, setTimeRange] = useState('30D')

  const maxPnl = 120000
  const maxRoi = 500

  return (
    <div
      style={{
        background: 'var(--v2-bg-surface-2)',
        border: '1px solid var(--v2-border)',
        borderRadius: '8px',
        marginBottom: '20px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px 0 16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            className="v2-sans"
            style={{ fontSize: '14px', fontWeight: 600, color: 'var(--v2-text-primary)' }}
          >
            Who Are The Best Smart Money Traders?
          </span>
          <FilterPill label="Label" />
          <FilterPill label="+ Filter" />
        </div>
        <TimeToggle
          options={['7D', '30D', '90D', '180D']}
          value={timeRange}
          onChange={setTimeRange}
        />
      </div>

      {/* Chart wrapper with padding for labels */}
      <div
        style={{
          position: 'relative',
          height: '220px',
          padding: '24px 32px 40px 56px',
        }}
      >
        {/* Y-axis labels */}
        {Y_LABELS.map((label, i) => {
          const fraction = i / (Y_LABELS.length - 1)
          // Chart inner height = 220 - 24 (top pad) - 40 (bottom pad) = 156px
          // Top of chart area = 24px; bottom-most label at 24 + 156 = 180px
          const topPx = 24 + (1 - fraction) * 156
          return (
            <span
              key={`y-${i}`}
              className="v2-mono"
              style={{
                position: 'absolute',
                left: '8px',
                top: `${topPx}px`,
                transform: 'translateY(-50%)',
                fontSize: '10px',
                color: 'var(--v2-text-quaternary)',
                pointerEvents: 'none',
              }}
            >
              {label}
            </span>
          )
        })}

        {/* X-axis labels — positioned below chart area */}
        {X_LABELS.map((label, i) => {
          const fraction = i / (X_LABELS.length - 1)
          return (
            <span
              key={`x-${i}`}
              className="v2-mono"
              style={{
                position: 'absolute',
                bottom: '10px',
                left: `calc(56px + ${fraction} * (100% - 56px - 32px))`,
                transform: 'translateX(-50%)',
                fontSize: '10px',
                color: 'var(--v2-text-quaternary)',
                pointerEvents: 'none',
              }}
            >
              {label}
            </span>
          )
        })}

        {/* Inner plot area */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          {/* Horizontal grid lines */}
          {Y_LABELS.map((_, i) => {
            const pct = (1 - i / (Y_LABELS.length - 1)) * 100
            return (
              <div
                key={`hg-${i}`}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: `${pct}%`,
                  height: '1px',
                  background: 'rgba(255,255,255,0.03)',
                  pointerEvents: 'none',
                }}
              />
            )
          })}

          {/* Vertical grid lines */}
          {X_LABELS.map((_, i) => {
            const pct = (i / (X_LABELS.length - 1)) * 100
            return (
              <div
                key={`vg-${i}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: `${pct}%`,
                  width: '1px',
                  background: 'rgba(255,255,255,0.03)',
                  pointerEvents: 'none',
                }}
              />
            )
          })}

          {/* Scatter dots */}
          {wallets.map((w, i) => {
            const leftPct = Math.min((w.realizedPnl / maxPnl) * 100, 100)
            const topPct = Math.max((1 - w.roi / maxRoi) * 100, 0)
            return (
              <div
                key={i}
                title={`${w.label} -- PnL: $${w.realizedPnl.toLocaleString()} / ROI: ${w.roi}%`}
                style={{
                  position: 'absolute',
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  transform: 'translate(-50%, -50%)',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  border: '2px solid #22D3EE',
                  background: 'transparent',
                  cursor: 'pointer',
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
