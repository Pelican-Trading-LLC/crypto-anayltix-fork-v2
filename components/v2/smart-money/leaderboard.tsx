"use client"

import React from 'react'
import { DataTable, type Column } from '@/components/v2/data-table'
import { FlowBar } from '@/components/v2/flow-bar'
import { AnalyzeButton } from '@/components/v2/analyze-button'
import { useAnalyze } from '@/components/v2/pelican-analyze-panel'
import { ScatterPlot } from './scatter-plot'
import { V2_WALLETS, formatCompact } from '@/lib/crypto-mock-data'
import type { V2Wallet } from '@/lib/crypto-mock-data'

export function Leaderboard() {
  const analyze = useAnalyze()
  const maxPnl = Math.max(...V2_WALLETS.map((w) => w.totalPnl))

  const columns: Column<V2Wallet>[] = [
    {
      key: 'name',
      header: 'Name',
      width: undefined,
      render: (w) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>{w.emoji}</span>
          <span style={{ fontWeight: 600, color: 'var(--v2-text-primary)', fontSize: '13px' }}>
            {w.label}
          </span>
          <span
            className="v2-mono"
            style={{ fontSize: '11px', color: 'var(--v2-text-tertiary)' }}
          >
            {w.address}
          </span>
        </div>
      ),
    },
    {
      key: 'totalPnl',
      header: 'Total PnL',
      width: '120px',
      align: 'right',
      render: (w) => (
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          <span className="v2-mono" style={{ color: 'var(--v2-green)', fontSize: '13px' }}>
            ${formatCompact(w.totalPnl)}
          </span>
          <FlowBar value={w.totalPnl} maxAbsolute={maxPnl} />
        </span>
      ),
    },
    {
      key: 'realizedPnl',
      header: 'Realized PnL',
      width: '100px',
      align: 'right',
      render: (w) => (
        <span className="v2-mono" style={{ fontSize: '13px', color: 'var(--v2-text-primary)' }}>
          ${formatCompact(w.realizedPnl)}
        </span>
      ),
    },
    {
      key: 'roi',
      header: 'ROI',
      width: '80px',
      align: 'right',
      render: (w) => (
        <span className="v2-mono" style={{ fontSize: '13px', color: 'var(--v2-text-primary)' }}>
          {w.roi}%
        </span>
      ),
    },
    {
      key: 'winRate',
      header: 'Win Rate',
      width: '80px',
      align: 'right',
      render: (w) => (
        <span className="v2-mono" style={{ fontSize: '13px', color: 'var(--v2-green)' }}>
          {w.winRate}%
        </span>
      ),
    },
    {
      key: 'trades',
      header: '# Trades',
      width: '60px',
      align: 'right',
      render: (w) => (
        <span className="v2-mono" style={{ fontSize: '13px', color: 'var(--v2-text-tertiary)' }}>
          {w.trades}
        </span>
      ),
    },
    {
      key: 'tokensTraded',
      header: 'Tokens Traded',
      width: '120px',
      render: (w) => {
        const first3 = w.tokensTraded.slice(0, 3).join(', ')
        const extra = w.tokensTraded.length > 3 ? ` & ${w.tokensTraded.length - 3} more` : ''
        return (
          <span style={{ fontSize: '12px', color: 'var(--v2-text-secondary)' }}>
            {first3}
            {extra && (
              <span style={{ color: 'var(--v2-text-tertiary)' }}>{extra}</span>
            )}
          </span>
        )
      },
    },
    {
      key: 'analyze',
      header: '',
      width: '50px',
      align: 'center',
      render: (w) => (
        <AnalyzeButton onClick={() => analyze('wallet', w as unknown as Record<string, unknown>)} />
      ),
    },
  ]

  return (
    <div>
      <ScatterPlot wallets={V2_WALLETS} />
      <div style={{ height: '20px' }} />
      <DataTable columns={columns} data={V2_WALLETS} />
    </div>
  )
}
