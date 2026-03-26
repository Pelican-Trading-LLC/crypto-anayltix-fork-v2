"use client"

import React, { useState, useMemo } from 'react'
import { DataTable, Column } from '@/components/v2/data-table'
import { FlowBar } from '@/components/v2/flow-bar'
import { FilterPill } from '@/components/v2/filter-pill'
import { TimeToggle } from '@/components/v2/time-toggle'
import { AnalyzeButton } from '@/components/v2/analyze-button'
import { useAnalyze } from '@/components/v2/pelican-analyze-panel'
import { V2_WALLETS, V2Wallet, formatCompact } from '@/lib/crypto-mock-data'

export function ProfitableWallets() {
  const analyze = useAnalyze()
  const [timeRange, setTimeRange] = useState('30D')
  const [showTradesFilter, setShowTradesFilter] = useState(true)
  const [showTokensFilter, setShowTokensFilter] = useState(true)

  const filtered = useMemo(() => {
    let data = V2_WALLETS
    if (showTradesFilter) data = data.filter((w) => w.trades >= 5)
    if (showTokensFilter) data = data.filter((w) => w.tokensTraded.length >= 5)
    return data.slice(0, 10)
  }, [showTradesFilter, showTokensFilter])

  const maxPnl = useMemo(() => Math.max(...filtered.map((w) => Math.abs(w.realizedPnl)), 1), [filtered])
  const maxRoi = useMemo(() => Math.max(...filtered.map((w) => Math.abs(w.roi)), 1), [filtered])

  const columns: Column<V2Wallet>[] = [
    {
      key: 'label',
      header: 'Name',
      width: '200px',
      render: (wallet) => (
        <span style={{ color: 'var(--v2-text-primary)' }}>
          <span style={{ marginRight: '6px' }}>{wallet.emoji}</span>
          <span style={{ fontWeight: 600 }}>{wallet.label}</span>
          <span
            className="v2-mono"
            style={{ marginLeft: '8px', fontSize: '11px', color: 'var(--v2-text-tertiary)' }}
          >
            {wallet.address}
          </span>
        </span>
      ),
    },
    {
      key: 'realizedPnl',
      header: 'Realized PnL',
      width: '160px',
      align: 'right',
      render: (wallet) => (
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          <span className="v2-mono" style={{ color: 'var(--v2-green)' }}>
            +${formatCompact(wallet.realizedPnl)}
          </span>
          <FlowBar value={wallet.realizedPnl} maxValue={maxPnl} color="green" />
        </span>
      ),
    },
    {
      key: 'roi',
      header: 'ROI',
      width: '140px',
      align: 'right',
      render: (wallet) => (
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          <span className="v2-mono" style={{ color: 'var(--v2-green)' }}>
            +{wallet.roi}%
          </span>
          <FlowBar value={wallet.roi} maxValue={maxRoi} color="green" />
        </span>
      ),
    },
    {
      key: 'winRate',
      header: 'Win Rate',
      width: '80px',
      align: 'right',
      render: (wallet) => (
        <span className="v2-mono" style={{ color: 'var(--v2-green)' }}>
          {wallet.winRate}%
        </span>
      ),
    },
    {
      key: 'analyze',
      header: '',
      width: '60px',
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
        <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--v2-text-primary)' }}>
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
