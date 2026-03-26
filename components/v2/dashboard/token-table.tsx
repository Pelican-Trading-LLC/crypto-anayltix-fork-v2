"use client"

import React, { useState, useMemo } from 'react'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import { DataTable, Column } from '@/components/v2/data-table'
import { FlowBar } from '@/components/v2/flow-bar'
import { AnalyzeButton } from '@/components/v2/analyze-button'
import { useAnalyze } from '@/components/v2/pelican-analyze-panel'
import { V2_TOKENS, V2Token, formatCompact } from '@/lib/crypto-mock-data'

const PAGE_SIZE = 10

function formatPrice(price: number): string {
  if (price >= 1) return `$${price.toFixed(2)}`
  // count leading zeros after decimal
  const str = price.toFixed(10)
  const decimals = str.split('.')[1] || ''
  let leadingZeros = 0
  for (const c of decimals) {
    if (c === '0') leadingZeros++
    else break
  }
  const sigFigs = Math.max(leadingZeros + 3, 4)
  return `$${price.toFixed(sigFigs)}`
}

export function TokenTable() {
  const analyze = useAnalyze()
  const [page, setPage] = useState(0)

  const maxVolume = useMemo(() => Math.max(...V2_TOKENS.map(t => Math.abs(t.volume))), [])
  const maxInflow = useMemo(() => Math.max(...V2_TOKENS.map(t => Math.abs(t.inflows))), [])

  const totalPages = Math.ceil(V2_TOKENS.length / PAGE_SIZE)
  const pagedData = V2_TOKENS.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const columns: Column<V2Token>[] = [
    {
      key: 'chain',
      header: 'Chain',
      width: '50px',
      render: () => (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: 600,
            color: '#9945FF',
            background: 'rgba(153,69,255,0.12)',
            borderRadius: '3px',
            padding: '2px 6px',
          }}
        >
          SOL
        </span>
      ),
    },
    {
      key: 'name',
      header: 'Token',
      width: '140px',
      render: (token) => (
        <span style={{ fontWeight: 600, color: 'var(--v2-text-primary)' }}>
          {token.emoji} {token.name}
        </span>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      width: '90px',
      align: 'right',
      render: (token) => (
        <span className="v2-mono" style={{ color: 'var(--v2-text-primary)' }}>
          {formatPrice(token.price)}
        </span>
      ),
    },
    {
      key: 'change24h',
      header: 'Chg 24h',
      width: '80px',
      align: 'right',
      render: (token) => {
        if (token.change24h === null) {
          return <span className="v2-mono" style={{ color: 'var(--v2-text-secondary)' }}>N/A</span>
        }
        const positive = token.change24h >= 0
        return (
          <span
            className="v2-mono"
            style={{ color: positive ? 'var(--v2-green)' : 'var(--v2-red)' }}
          >
            {positive ? '+' : ''}{token.change24h.toFixed(2)}%
          </span>
        )
      },
    },
    {
      key: 'analyze',
      header: '',
      width: '60px',
      align: 'center',
      render: (token) => (
        <AnalyzeButton onClick={() => analyze('token', token as unknown as Record<string, unknown>)} />
      ),
    },
    {
      key: 'mcap',
      header: 'MCap',
      width: '90px',
      align: 'right',
      render: (token) => (
        <span className="v2-mono" style={{ color: 'var(--v2-text-secondary)' }}>
          ${formatCompact(token.mcap)}
        </span>
      ),
    },
    {
      key: 'traders',
      header: 'Traders',
      width: '70px',
      align: 'right',
      render: (token) => (
        <span className="v2-mono" style={{ color: 'var(--v2-text-secondary)' }}>
          {token.traders.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'volume',
      header: 'Volumes',
      width: '100px',
      align: 'right',
      render: (token) => (
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          <span className="v2-mono" style={{ color: 'var(--v2-text-primary)' }}>
            ${formatCompact(token.volume)}
          </span>
          <FlowBar value={token.volume} maxValue={maxVolume} color="auto" />
        </span>
      ),
    },
    {
      key: 'liquidity',
      header: 'Liquidity',
      width: '100px',
      align: 'right',
      render: (token) => (
        <span className="v2-mono" style={{ color: 'var(--v2-text-secondary)' }}>
          ${formatCompact(token.liquidity)}
        </span>
      ),
    },
    {
      key: 'inflows',
      header: 'Inflows',
      width: '100px',
      align: 'right',
      render: (token) => (
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          <span className="v2-mono" style={{ color: 'var(--v2-green)' }}>
            ${formatCompact(token.inflows)}
          </span>
          <FlowBar value={token.inflows} maxValue={maxInflow} color="green" />
        </span>
      ),
    },
    {
      key: 'outflows',
      header: 'Outflows',
      width: '100px',
      align: 'right',
      render: (token) => (
        <span className="v2-mono" style={{ color: token.outflows === 0 ? 'var(--v2-text-secondary)' : 'var(--v2-red)' }}>
          ${formatCompact(token.outflows)}
        </span>
      ),
    },
    {
      key: 'netFlows',
      header: 'Net Flows',
      width: '100px',
      align: 'right',
      render: (token) => {
        const positive = token.netFlows >= 0
        return (
          <span
            className="v2-mono"
            style={{
              color: positive ? 'var(--v2-green)' : 'var(--v2-red)',
              fontWeight: 600,
            }}
          >
            {positive ? '+' : '-'}${formatCompact(Math.abs(token.netFlows))}
          </span>
        )
      },
    },
  ]

  return (
    <div>
      <DataTable columns={columns} data={pagedData} />

      {/* Pagination */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '12px',
        }}
      >
        <button
          type="button"
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            border: '1px solid var(--v2-border)',
            background: 'transparent',
            color: page === 0 ? 'var(--v2-text-tertiary)' : 'var(--v2-text-secondary)',
            cursor: page === 0 ? 'default' : 'pointer',
            opacity: page === 0 ? 0.4 : 1,
          }}
        >
          <CaretLeft size={14} weight="bold" />
        </button>
        <span
          className="v2-mono"
          style={{ fontSize: '11px', color: 'var(--v2-text-secondary)' }}
        >
          {page + 1} / {totalPages}
        </span>
        <button
          type="button"
          disabled={page >= totalPages - 1}
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            border: '1px solid var(--v2-border)',
            background: 'transparent',
            color: page >= totalPages - 1 ? 'var(--v2-text-tertiary)' : 'var(--v2-text-secondary)',
            cursor: page >= totalPages - 1 ? 'default' : 'pointer',
            opacity: page >= totalPages - 1 ? 0.4 : 1,
          }}
        >
          <CaretRight size={14} weight="bold" />
        </button>
      </div>
    </div>
  )
}
