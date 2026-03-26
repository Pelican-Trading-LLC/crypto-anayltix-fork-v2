"use client"

import React, { useState, useMemo } from 'react'
import { X, BookmarkSimple } from '@phosphor-icons/react'
import { DataTable, Column } from '@/components/v2/data-table'
import { FlowBar } from '@/components/v2/flow-bar'
import { AnalyzeButton } from '@/components/v2/analyze-button'
import { useAnalyze } from '@/components/v2/pelican-analyze-panel'
import { formatPrice, formatDollarCompact, formatPercent } from '@/lib/format'
import { V2_WATCHLIST_TOKENS, V2Token } from '@/lib/crypto-mock-data'

export function WatchlistTab() {
  const analyze = useAnalyze()
  const [tokens, setTokens] = useState<V2Token[]>(V2_WATCHLIST_TOKENS)
  const [searchValue, setSearchValue] = useState('')

  const maxVolume = useMemo(() => Math.max(...tokens.map(t => Math.abs(t.volume)), 1), [tokens])
  const maxInflow = useMemo(() => Math.max(...tokens.map(t => Math.abs(t.inflows)), 1), [tokens])
  const maxOutflow = useMemo(() => Math.max(...tokens.map(t => Math.abs(t.outflows)), 1), [tokens])
  const maxNetFlow = useMemo(() => Math.max(...tokens.map(t => Math.abs(t.netFlows)), 1), [tokens])

  const removeToken = (ticker: string) => {
    setTokens((prev) => prev.filter((t) => t.ticker !== ticker))
  }

  const columns: Column<V2Token>[] = [
    {
      key: 'chain',
      header: 'Chain',
      width: '48px',
      render: (token) => (
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
          {token.chain === 'solana' ? 'SOL' : token.chain === 'ethereum' ? 'ETH' : 'BASE'}
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
    {
      key: 'remove',
      header: '',
      width: '36px',
      align: 'center',
      render: (token) => (
        <button
          type="button"
          onClick={() => removeToken(token.ticker)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            padding: 0,
            color: 'var(--v2-text-tertiary)',
            cursor: 'pointer',
            transition: 'color 120ms ease',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--v2-red)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--v2-text-tertiary)' }}
        >
          <X size={14} weight="bold" />
        </button>
      ),
    },
  ]

  // Empty state
  if (tokens.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '240px',
          gap: '8px',
        }}
      >
        <BookmarkSimple size={32} weight="regular" style={{ color: 'var(--v2-text-quaternary)' }} />
        <span
          className="v2-sans"
          style={{ fontSize: '14px', fontWeight: 600, color: 'var(--v2-text-secondary)' }}
        >
          Add tokens to your watchlist
        </span>
        <span
          className="v2-sans"
          style={{ fontSize: '12.5px', color: 'var(--v2-text-tertiary)', textAlign: 'center', maxWidth: '320px' }}
        >
          Search for tokens below and add them to track their performance, flows, and metrics.
        </span>
        <div style={{ marginTop: '12px', width: '100%', maxWidth: '360px' }}>
          <input
            type="text"
            placeholder="&#128269; Search and add tokens..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="v2-sans"
            style={{
              width: '100%',
              height: '36px',
              padding: '0 12px',
              fontSize: '13px',
              background: 'var(--v2-bg-elevated)',
              border: '1px solid var(--v2-border)',
              borderRadius: '6px',
              color: 'var(--v2-text-primary)',
              outline: 'none',
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Search bar */}
      <div style={{ marginBottom: '12px' }}>
        <input
          type="text"
          placeholder="&#128269; Search and add tokens..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="v2-sans"
          style={{
            width: '320px',
            height: '36px',
            padding: '0 12px',
            fontSize: '13px',
            background: 'var(--v2-bg-elevated)',
            border: '1px solid var(--v2-border)',
            borderRadius: '6px',
            color: 'var(--v2-text-primary)',
            outline: 'none',
          }}
        />
      </div>

      <DataTable columns={columns} data={tokens} />
    </div>
  )
}
