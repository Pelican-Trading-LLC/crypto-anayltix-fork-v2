"use client"

import React, { useState, useMemo } from 'react'
import { X } from '@phosphor-icons/react'
import { DataTable, Column } from '@/components/v2/data-table'
import { FlowBar } from '@/components/v2/flow-bar'
import { AnalyzeButton } from '@/components/v2/analyze-button'
import { useAnalyze } from '@/components/v2/pelican-analyze-panel'
import { V2_WATCHLIST_TOKENS, V2Token, formatCompact } from '@/lib/crypto-mock-data'

function formatPrice(price: number): string {
  if (price >= 1) return `$${price.toFixed(2)}`
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

export function WatchlistTab() {
  const analyze = useAnalyze()
  const [tokens, setTokens] = useState<V2Token[]>(V2_WATCHLIST_TOKENS)
  const [searchValue, setSearchValue] = useState('')

  const maxVolume = useMemo(() => Math.max(...tokens.map(t => Math.abs(t.volume)), 1), [tokens])
  const maxInflow = useMemo(() => Math.max(...tokens.map(t => Math.abs(t.inflows)), 1), [tokens])

  const removeToken = (ticker: string) => {
    setTokens((prev) => prev.filter((t) => t.ticker !== ticker))
  }

  const columns: Column<V2Token>[] = [
    {
      key: 'chain',
      header: 'Chain',
      width: '50px',
      render: (token) => (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: 600,
            color: token.chain === 'solana' ? '#9945FF' : '#627EEA',
            background: token.chain === 'solana' ? 'rgba(153,69,255,0.12)' : 'rgba(98,126,234,0.12)',
            borderRadius: '3px',
            padding: '2px 6px',
          }}
        >
          {token.chain === 'solana' ? 'SOL' : 'ETH'}
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
          <span className="v2-mono" style={{ color: positive ? 'var(--v2-green)' : 'var(--v2-red)' }}>
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
          <FlowBar value={token.inflows} maxAbsolute={maxInflow} />
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
          <span className="v2-mono" style={{ color: positive ? 'var(--v2-green)' : 'var(--v2-red)', fontWeight: 600 }}>
            {positive ? '+' : '-'}${formatCompact(Math.abs(token.netFlows))}
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
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--v2-red)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--v2-text-tertiary)' }}
        >
          <X size={14} weight="bold" />
        </button>
      ),
    },
  ]

  return (
    <div>
      {/* Add Token input */}
      <div style={{ marginBottom: '12px' }}>
        <input
          type="text"
          placeholder="Search token to add..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{
            width: '260px',
            padding: '8px 12px',
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
