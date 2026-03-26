"use client"

import React, { useState, useMemo } from 'react'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import { DataTable, Column } from '@/components/v2/data-table'
import { FlowBar } from '@/components/v2/flow-bar'
import { AnalyzeButton } from '@/components/v2/analyze-button'
import { useAnalyze } from '@/components/v2/pelican-analyze-panel'
import { formatPrice, formatDollarCompact, formatPercent } from '@/lib/format'
import { V2_TOKENS, V2Token } from '@/lib/crypto-mock-data'

const PAGE_SIZE = 10

export function TokenTable() {
  const analyze = useAnalyze()
  const [page, setPage] = useState(0)

  const maxVolume = useMemo(() => Math.max(...V2_TOKENS.map(t => Math.abs(t.volume))), [])
  const maxInflow = useMemo(() => Math.max(...V2_TOKENS.map(t => Math.abs(t.inflows))), [])
  const maxOutflow = useMemo(() => Math.max(...V2_TOKENS.map(t => Math.abs(t.outflows))), [])
  const maxNetFlow = useMemo(() => Math.max(...V2_TOKENS.map(t => Math.abs(t.netFlows))), [])

  const totalPages = Math.ceil(V2_TOKENS.length / PAGE_SIZE)
  const pagedData = V2_TOKENS.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const columns: Column<V2Token>[] = [
    {
      key: 'chain',
      header: 'Chain',
      width: '48px',
      render: () => (
        <span
          className="v2-mono"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '20px',
            padding: '0 6px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: 600,
            color: 'var(--v2-text-tertiary)',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          SOL
        </span>
      ),
    },
    {
      key: 'name',
      header: 'Token',
      width: '160px',
      render: (token) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: 'var(--v2-bg-surface-3)',
              fontSize: '12px',
              flexShrink: 0,
            }}
          >
            {token.emoji}
          </span>
          <span>
            <span
              className="v2-sans"
              style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--v2-text-primary)' }}
            >
              {token.name}
            </span>
            <span
              className="v2-sans"
              style={{ fontSize: '11px', color: 'var(--v2-text-tertiary)', marginLeft: '4px' }}
            >
              ({token.ticker})
            </span>
          </span>
        </span>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      width: '100px',
      align: 'right',
      render: (token) => (
        <span
          className="v2-mono"
          style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--v2-text-primary)' }}
        >
          {formatPrice(token.price)}
        </span>
      ),
    },
    {
      key: 'change24h',
      header: 'Chg 24h',
      width: '88px',
      align: 'right',
      render: (token) => {
        if (token.change24h === null) {
          return (
            <span className="v2-mono" style={{ fontSize: '12px', color: 'var(--v2-text-tertiary)' }}>
              —
            </span>
          )
        }
        const positive = token.change24h >= 0
        return (
          <span
            className="v2-mono"
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: positive ? 'var(--v2-green)' : 'var(--v2-red)',
            }}
          >
            {formatPercent(token.change24h)}
          </span>
        )
      },
    },
    {
      key: 'analyze',
      header: '',
      width: '72px',
      align: 'center',
      render: (token) => (
        <AnalyzeButton onClick={() => analyze('token', token as unknown as Record<string, unknown>)} />
      ),
    },
    {
      key: 'mcap',
      header: 'MCap',
      width: '88px',
      align: 'right',
      render: (token) => (
        <span
          className="v2-mono"
          style={{ fontSize: '12px', fontWeight: 400, color: 'var(--v2-text-secondary)' }}
        >
          {formatDollarCompact(token.mcap)}
        </span>
      ),
    },
    {
      key: 'traders',
      header: 'Traders',
      width: '68px',
      align: 'right',
      render: (token) => (
        <span
          className="v2-mono"
          style={{ fontSize: '11.5px', fontWeight: 400, color: 'var(--v2-text-tertiary)' }}
        >
          {token.traders.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'volume',
      header: 'Volumes',
      width: '130px',
      align: 'right',
      render: (token) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
          <span
            className="v2-mono"
            style={{ fontSize: '12px', fontWeight: 400, color: 'var(--v2-text-primary)' }}
          >
            {formatDollarCompact(token.volume)}
          </span>
          <FlowBar value={token.volume} maxAbsolute={maxVolume} />
        </span>
      ),
    },
    {
      key: 'liquidity',
      header: 'Liquidity',
      width: '100px',
      align: 'right',
      render: (token) => (
        <span
          className="v2-mono"
          style={{ fontSize: '12px', fontWeight: 400, color: 'var(--v2-text-secondary)' }}
        >
          {formatDollarCompact(token.liquidity)}
        </span>
      ),
    },
    {
      key: 'inflows',
      header: 'Inflows',
      width: '130px',
      align: 'right',
      render: (token) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
          <span
            className="v2-mono"
            style={{ fontSize: '12px', fontWeight: 400, color: 'var(--v2-green)' }}
          >
            {formatDollarCompact(token.inflows)}
          </span>
          <FlowBar value={token.inflows} maxAbsolute={maxInflow} />
        </span>
      ),
    },
    {
      key: 'outflows',
      header: 'Outflows',
      width: '130px',
      align: 'right',
      render: (token) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
          <span
            className="v2-mono"
            style={{
              fontSize: '12px',
              fontWeight: 400,
              color: token.outflows === 0 ? 'var(--v2-text-quaternary)' : 'var(--v2-red)',
            }}
          >
            {formatDollarCompact(token.outflows)}
          </span>
          <FlowBar value={-token.outflows} maxAbsolute={maxOutflow} />
        </span>
      ),
    },
    {
      key: 'netFlows',
      header: 'Net Flows',
      width: '130px',
      align: 'right',
      render: (token) => {
        const positive = token.netFlows >= 0
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
            <span
              className="v2-mono"
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: positive ? 'var(--v2-green)' : 'var(--v2-red)',
              }}
            >
              {formatDollarCompact(token.netFlows)}
            </span>
            <FlowBar value={token.netFlows} maxAbsolute={maxNetFlow} />
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
          style={{ fontSize: '12px', color: 'var(--v2-text-tertiary)' }}
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
