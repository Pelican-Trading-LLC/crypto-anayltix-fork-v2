"use client"

import React from 'react'
import { DataTable, type Column } from '@/components/v2/data-table'
import { AnalyzeButton } from '@/components/v2/analyze-button'
import { useAnalyze } from '@/components/v2/pelican-analyze-panel'
import { V2_RECENT_TRADES, formatCompact } from '@/lib/crypto-mock-data'
import type { V2RecentTrade } from '@/lib/crypto-mock-data'

export function TradesFeed() {
  const analyze = useAnalyze()

  const columns: Column<V2RecentTrade>[] = [
    {
      key: 'wallet',
      header: 'Wallet',
      width: '180px',
      render: (t) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          <span style={{ fontWeight: 600, color: 'var(--v2-text-primary)', fontSize: '13px' }}>
            {t.wallet}
          </span>
          <span
            className="v2-mono"
            style={{ fontSize: '11px', color: 'var(--v2-text-tertiary)' }}
          >
            {t.walletAddr}
          </span>
        </div>
      ),
    },
    {
      key: 'token',
      header: 'Token',
      width: '100px',
      render: (t) => (
        <span style={{ fontWeight: 600, color: 'var(--v2-text-primary)', fontSize: '13px' }}>
          {t.token}
        </span>
      ),
    },
    {
      key: 'direction',
      header: 'Direction',
      width: '80px',
      render: (t) => (
        <span
          style={{
            display: 'inline-block',
            padding: '2px 8px',
            borderRadius: '3px',
            fontSize: '11px',
            fontWeight: 600,
            background:
              t.direction === 'Buy'
                ? 'rgba(34, 197, 94, 0.15)'
                : 'rgba(239, 68, 68, 0.15)',
            color:
              t.direction === 'Buy' ? 'var(--v2-green)' : 'var(--v2-red)',
          }}
        >
          {t.direction}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      width: '100px',
      align: 'right',
      render: (t) => (
        <span className="v2-mono" style={{ fontSize: '13px', color: 'var(--v2-text-primary)' }}>
          {formatCompact(t.amount)}
        </span>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      width: '100px',
      align: 'right',
      render: (t) => (
        <span className="v2-mono" style={{ fontSize: '13px', color: 'var(--v2-text-primary)' }}>
          ${t.price < 0.01 ? t.price.toFixed(6) : t.price.toFixed(4)}
        </span>
      ),
    },
    {
      key: 'time',
      header: 'Time',
      width: '80px',
      align: 'right',
      render: (t) => (
        <span className="v2-mono" style={{ fontSize: '12px', color: 'var(--v2-text-tertiary)' }}>
          {t.time}
        </span>
      ),
    },
    {
      key: 'analyze',
      header: '',
      width: '50px',
      align: 'center',
      render: (t) => (
        <AnalyzeButton
          onClick={() =>
            analyze('wallet', { wallet: t.wallet, address: t.walletAddr, token: t.token } as unknown as Record<string, unknown>)
          }
        />
      ),
    },
  ]

  return <DataTable columns={columns} data={V2_RECENT_TRADES} />
}
