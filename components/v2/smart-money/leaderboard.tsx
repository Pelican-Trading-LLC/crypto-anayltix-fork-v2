"use client"

import React from 'react'
import { DataTable, type Column } from '@/components/v2/data-table'
import { FlowBar } from '@/components/v2/flow-bar'
import { AnalyzeButton } from '@/components/v2/analyze-button'
import { useAnalyze } from '@/components/v2/pelican-analyze-panel'
import { ScatterPlot } from './scatter-plot'
import { V2_WALLETS } from '@/lib/crypto-mock-data'
import { formatDollarCompact, formatPercentCompact } from '@/lib/format'
import type { V2Wallet } from '@/lib/crypto-mock-data'

export function Leaderboard() {
  const analyze = useAnalyze()
  const maxPnl = Math.max(...V2_WALLETS.map((w) => w.totalPnl))

  const columns: Column<V2Wallet>[] = [
    {
      key: 'name',
      header: 'Name',
      width: '220px',
      render: (w) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '14px' }}>{w.emoji}</span>
          <span
            style={{
              fontWeight: 500,
              color: 'var(--v2-text-secondary)',
              fontSize: '12px',
            }}
          >
            {w.label}
          </span>
          <span
            className="v2-mono"
            style={{ fontSize: '11px', color: 'var(--v2-text-quaternary)' }}
          >
            [{w.address}]
          </span>
        </div>
      ),
    },
    {
      key: 'totalPnl',
      header: 'Total PnL',
      width: '140px',
      align: 'right',
      render: (w) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <span className="v2-mono" style={{ color: 'var(--v2-text-primary)', fontSize: '13px' }}>
            {formatDollarCompact(w.totalPnl)}
          </span>
          <FlowBar value={w.totalPnl} maxAbsolute={maxPnl} width={48} />
        </span>
      ),
    },
    {
      key: 'realizedPnl',
      header: 'Realized PnL',
      width: '100px',
      align: 'right',
      render: (w) => (
        <span className="v2-mono" style={{ fontSize: '13px', color: 'var(--v2-text-secondary)' }}>
          {formatDollarCompact(w.realizedPnl)}
        </span>
      ),
    },
    {
      key: 'roi',
      header: 'ROI',
      width: '80px',
      align: 'right',
      render: (w) => (
        <span className="v2-mono" style={{ fontSize: '13px', color: 'var(--v2-text-secondary)' }}>
          {formatPercentCompact(w.roi)}
        </span>
      ),
    },
    {
      key: 'winRate',
      header: 'Win Rate',
      width: '80px',
      align: 'right',
      render: (w) => {
        let color = 'var(--v2-text-primary)'
        if (w.winRate >= 70) color = 'var(--v2-green)'
        else if (w.winRate < 50) color = 'var(--v2-red)'
        return (
          <span className="v2-mono" style={{ fontSize: '13px', fontWeight: 600, color }}>
            {w.winRate}%
          </span>
        )
      },
    },
    {
      key: 'trades',
      header: '# Trades',
      width: '64px',
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
      width: '180px',
      align: 'right',
      render: (w) => (
        <span
          style={{
            fontSize: '11px',
            color: 'var(--v2-text-tertiary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'block',
          }}
        >
          {w.tokensTraded.join(', ')}
        </span>
      ),
    },
    {
      key: 'analyze',
      header: '',
      width: '72px',
      align: 'center',
      render: (w) => (
        <AnalyzeButton onClick={() => analyze('wallet', w as unknown as Record<string, unknown>)} />
      ),
    },
  ]

  return (
    <div>
      <ScatterPlot wallets={V2_WALLETS} />
      <DataTable columns={columns} data={V2_WALLETS.slice(0, 12)} />
    </div>
  )
}
