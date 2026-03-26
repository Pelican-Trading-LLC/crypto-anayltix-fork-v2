"use client"

import React, { useState, useMemo } from 'react'
import { DataTable, Column } from '@/components/v2/data-table'
import { FlowBar } from '@/components/v2/flow-bar'
import { FilterPill } from '@/components/v2/filter-pill'
import { TimeToggle } from '@/components/v2/time-toggle'
import { AnalyzeButton } from '@/components/v2/analyze-button'
import { useAnalyze } from '@/components/v2/pelican-analyze-panel'
import { formatDollarCompact, formatPercentCompact } from '@/lib/format'
import { V2_WALLETS, V2Wallet } from '@/lib/crypto-mock-data'

export function ProfitableWallets() {
  const analyze = useAnalyze()
  const [timeRange, setTimeRange] = useState('30D')
  const [showTradesFilter, setShowTradesFilter] = useState(true)
  const [showTokensFilter, setShowTokensFilter] = useState(true)

  const filtered = useMemo(() => {
    let data = V2_WALLETS
    if (showTradesFilter) data = data.filter((w) => w.trades >= 5)
    if (showTokensFilter) data = data.filter((w) => w.tokensTraded.length >= 5)
    return data.slice(0, 8)
  }, [showTradesFilter, showTokensFilter])

  const maxPnl = useMemo(() => Math.max(...filtered.map((w) => Math.abs(w.realizedPnl)), 1), [filtered])
  const maxRoi = useMemo(() => Math.max(...filtered.map((w) => Math.abs(w.roi)), 1), [filtered])

  const columns: Column<V2Wallet>[] = [
    {
      key: 'label',
      header: 'Name',
      width: '240px',
      render: (wallet) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '14px' }}>{wallet.emoji}</span>
          <span
            className="v2-sans"
            style={{ fontSize: '12px', fontWeight: 500, color: 'var(--v2-text-secondary)' }}
          >
            {wallet.label}
          </span>
          <span
            className="v2-mono"
            style={{ fontSize: '11px', color: 'var(--v2-text-quaternary)' }}
          >
            [{wallet.address}]
          </span>
        </span>
      ),
    },
    {
      key: 'realizedPnl',
      header: 'Realized PnL',
      width: '140px',
      align: 'right',
      render: (wallet) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
          <span
            className="v2-mono"
            style={{ fontSize: '12px', fontWeight: 500, color: 'var(--v2-text-primary)' }}
          >
            {formatDollarCompact(wallet.realizedPnl)}
          </span>
          <FlowBar value={wallet.realizedPnl} maxAbsolute={maxPnl} />
        </span>
      ),
    },
    {
      key: 'roi',
      header: 'ROI',
      width: '100px',
      align: 'right',
      render: (wallet) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
          <span
            className="v2-mono"
            style={{ fontSize: '12px', fontWeight: 500, color: wallet.roi >= 0 ? 'var(--v2-green)' : 'var(--v2-red)' }}
          >
            {formatPercentCompact(wallet.roi)}
          </span>
          <FlowBar value={wallet.roi} maxAbsolute={maxRoi} />
        </span>
      ),
    },
    {
      key: 'winRate',
      header: 'Win Rate',
      width: '80px',
      align: 'right',
      render: (wallet) => {
        let color = 'var(--v2-text-primary)'
        if (wallet.winRate >= 70) color = 'var(--v2-green)'
        else if (wallet.winRate < 50) color = 'var(--v2-red)'
        return (
          <span
            className="v2-mono"
            style={{ fontSize: '12px', fontWeight: 600, color }}
          >
            {wallet.winRate}%
          </span>
        )
      },
    },
    {
      key: 'analyze',
      header: '',
      width: '72px',
      align: 'center',
      render: (wallet) => (
        <AnalyzeButton onClick={() => analyze('wallet', wallet as unknown as Record<string, unknown>)} />
      ),
    },
  ]

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
          style={{ fontSize: '14px', fontWeight: 600, color: 'var(--v2-text-primary)' }}
        >
          Most Profitable Addresses
        </span>
        <TimeToggle
          options={['7D', '30D', '90D', '180D']}
          value={timeRange}
          onChange={setTimeRange}
        />
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
        <FilterPill label="Solana" active />
        <FilterPill label="+ Filter" />
        <FilterPill label="Label &#9662;" />
      </div>

      {/* Active filter tags */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
        {showTradesFilter && (
          <FilterPill
            label="# Trades: &ge; 5.00"
            active
            dismissible
            onDismiss={() => setShowTradesFilter(false)}
          />
        )}
        {showTokensFilter && (
          <FilterPill
            label="# Tokens Traded: &ge; 5.00"
            active
            dismissible
            onDismiss={() => setShowTokensFilter(false)}
          />
        )}
        {(!showTradesFilter || !showTokensFilter) && (
          <button
            type="button"
            onClick={() => {
              setShowTradesFilter(true)
              setShowTokensFilter(true)
            }}
            className="v2-sans"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--v2-text-secondary)',
              fontSize: '11px',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Reset Filters
          </button>
        )}
      </div>

      <DataTable columns={columns} data={filtered} />
    </div>
  )
}
