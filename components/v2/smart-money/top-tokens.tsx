"use client"

import React, { useState } from 'react'
import { Info } from '@phosphor-icons/react'
import { DataTable, type Column } from '@/components/v2/data-table'
import { FlowBar } from '@/components/v2/flow-bar'
import { FilterPill } from '@/components/v2/filter-pill'
import {
  V2_TOP_TOKENS_TRADING,
  V2_TOP_TOKENS_HOLDING,
} from '@/lib/crypto-mock-data'
import { formatDollarCompact, formatPercent } from '@/lib/format'
import type { V2TopTokenTrading, V2TopTokenHolding } from '@/lib/crypto-mock-data'

/* ── Shared sub-components ────────────────────────────────────── */

function SolBadge() {
  return (
    <span
      className="v2-mono"
      style={{
        display: 'inline-block',
        padding: '2px 6px',
        borderRadius: '3px',
        fontSize: '10px',
        fontWeight: 600,
        background: 'rgba(255,255,255,0.06)',
        color: 'var(--v2-text-tertiary)',
      }}
    >
      SOL
    </span>
  )
}

function ToggleSwitch({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '11px',
        color: 'var(--v2-text-secondary)',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{
          width: '14px',
          height: '14px',
          accentColor: '#06B6D4',
          cursor: 'pointer',
        }}
      />
      {label}
    </label>
  )
}

function LiveBadge() {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 8px',
        borderRadius: '3px',
        fontSize: '10px',
        fontWeight: 700,
        background: 'rgba(34, 197, 94, 0.15)',
        color: 'var(--v2-green)',
        letterSpacing: '0.5px',
      }}
    >
      <span
        style={{
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: 'var(--v2-green)',
          display: 'inline-block',
        }}
      />
      LIVE
    </span>
  )
}

/* ── Main Component ───────────────────────────────────────────── */

export function TopTokens() {
  const [excludeStable, setExcludeStable] = useState(false)
  const [excludeL1L2, setExcludeL1L2] = useState(false)

  // ── Trading section maxes ──
  const maxFlow24h = Math.max(...V2_TOP_TOKENS_TRADING.map((t) => Math.abs(t.flows24h)))
  const maxFlow7d = Math.max(...V2_TOP_TOKENS_TRADING.map((t) => Math.abs(t.flows7d)))
  const maxFlow30d = Math.max(...V2_TOP_TOKENS_TRADING.map((t) => Math.abs(t.flows30d)))

  const tradingColumns: Column<V2TopTokenTrading>[] = [
    {
      key: 'chain',
      header: 'Chain',
      width: '48px',
      render: () => <SolBadge />,
    },
    {
      key: 'token',
      header: 'Token',
      width: '160px',
      render: (t) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <span>{t.emoji}</span>
          <span style={{ fontWeight: 600, color: 'var(--v2-text-primary)', fontSize: '13px' }}>
            {t.token}
          </span>
        </span>
      ),
    },
    {
      key: 'flows24h',
      header: '24H Flows',
      width: '140px',
      align: 'right',
      render: (t) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <span className="v2-mono" style={{ fontSize: '13px', color: 'var(--v2-green)' }}>
            {formatDollarCompact(t.flows24h)}
          </span>
          <FlowBar value={t.flows24h} maxAbsolute={maxFlow24h} />
        </span>
      ),
    },
    {
      key: 'flows7d',
      header: '7D Flows',
      width: '140px',
      align: 'right',
      render: (t) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <span
            className="v2-mono"
            style={{
              fontSize: '13px',
              color: t.flows7d >= 0 ? 'var(--v2-green)' : 'var(--v2-red)',
            }}
          >
            {formatDollarCompact(t.flows7d)}
          </span>
          <FlowBar value={t.flows7d} maxAbsolute={maxFlow7d} />
        </span>
      ),
    },
    {
      key: 'flows30d',
      header: '30D Flows',
      width: '140px',
      align: 'right',
      render: (t) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <span
            className="v2-mono"
            style={{
              fontSize: '13px',
              color: t.flows30d >= 0 ? 'var(--v2-green)' : 'var(--v2-red)',
            }}
          >
            {formatDollarCompact(t.flows30d)}
          </span>
          <FlowBar value={t.flows30d} maxAbsolute={maxFlow30d} />
        </span>
      ),
    },
    {
      key: 'traders',
      header: 'Traders',
      width: '68px',
      align: 'right',
      render: (t) => (
        <span className="v2-mono" style={{ fontSize: '13px', color: 'var(--v2-text-tertiary)' }}>
          {t.traders.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'tokenAgeDays',
      header: 'Token Age',
      width: '80px',
      align: 'right',
      render: (t) => (
        <span className="v2-mono" style={{ fontSize: '13px', color: 'var(--v2-text-tertiary)' }}>
          {t.tokenAgeDays}d
        </span>
      ),
    },
    {
      key: 'mcap',
      header: 'Market Cap',
      width: '100px',
      align: 'right',
      render: (t) => (
        <span className="v2-mono" style={{ fontSize: '13px', color: 'var(--v2-text-secondary)' }}>
          {formatDollarCompact(t.mcap)}
        </span>
      ),
    },
  ]

  // ── Holding section ──
  const maxBalance = Math.max(...V2_TOP_TOKENS_HOLDING.map((t) => t.balance))

  const holdingColumns: Column<V2TopTokenHolding>[] = [
    {
      key: 'chain',
      header: 'Chain',
      width: '48px',
      render: () => <SolBadge />,
    },
    {
      key: 'token',
      header: 'Token',
      width: '160px',
      render: (t) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <span>{t.emoji}</span>
          <span style={{ fontWeight: 600, color: 'var(--v2-text-primary)', fontSize: '13px' }}>
            {t.token}
          </span>
        </span>
      ),
    },
    {
      key: 'balance',
      header: 'Balance',
      width: '140px',
      align: 'right',
      render: (t) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <span className="v2-mono" style={{ fontSize: '13px', color: 'var(--v2-text-primary)' }}>
            {formatDollarCompact(t.balance)}
          </span>
          <FlowBar value={t.balance} maxAbsolute={maxBalance} />
        </span>
      ),
    },
    {
      key: 'balanceChange24h',
      header: 'Balance Change 24H',
      width: '100px',
      align: 'right',
      render: (t) => (
        <span
          className="v2-mono"
          style={{
            fontSize: '13px',
            color:
              t.balanceChange24h > 0
                ? 'var(--v2-green)'
                : t.balanceChange24h === 0
                  ? 'var(--v2-text-tertiary)'
                  : 'var(--v2-red)',
          }}
        >
          {formatPercent(t.balanceChange24h)}
        </span>
      ),
    },
    {
      key: 'shareOfHoldings',
      header: 'Share of Holdings',
      width: '100px',
      align: 'right',
      render: (t) => (
        <span className="v2-mono" style={{ fontSize: '13px', color: 'var(--v2-text-secondary)' }}>
          {t.shareOfHoldings}%
        </span>
      ),
    },
    {
      key: 'holders',
      header: 'Holders',
      width: '68px',
      align: 'right',
      render: (t) => (
        <span className="v2-mono" style={{ fontSize: '13px', color: 'var(--v2-text-tertiary)' }}>
          {t.holders.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'mcap',
      header: 'Market Cap',
      width: '100px',
      align: 'right',
      render: (t) => (
        <span className="v2-mono" style={{ fontSize: '13px', color: 'var(--v2-text-secondary)' }}>
          {formatDollarCompact(t.mcap)}
        </span>
      ),
    },
  ]

  return (
    <div>
      {/* Section 1: What Are Smart Money Trading? */}
      <div>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '10px',
          }}
        >
          <span
            className="v2-sans"
            style={{ fontSize: '14px', fontWeight: 600, color: 'var(--v2-text-primary)' }}
          >
            What Are Smart Money Trading?
          </span>
          <LiveBadge />
          <Info size={14} weight="regular" style={{ color: 'var(--v2-text-tertiary)' }} />
          <FilterPill label="+ Filter" />
        </div>

        {/* Filter row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '10px',
            flexWrap: 'wrap',
          }}
        >
          <FilterPill label="All Caps &#9662;" />
          <FilterPill label="Token Age(D)" />
          <FilterPill label="Sectors &#9662;" />
          <FilterPill label="&#128302; Label &#9662;" />
        </div>

        {/* Toggle row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '14px',
          }}
        >
          <ToggleSwitch
            label="Exclude Stablecoin"
            checked={excludeStable}
            onChange={setExcludeStable}
          />
          <ToggleSwitch
            label="Exclude L1/L2 Tokens & Derivatives"
            checked={excludeL1L2}
            onChange={setExcludeL1L2}
          />
        </div>

        <DataTable columns={tradingColumns} data={V2_TOP_TOKENS_TRADING} />
      </div>

      {/* Section 2: What Are Smart Money Holding? */}
      <div style={{ marginTop: '30px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '10px',
          }}
        >
          <span
            className="v2-sans"
            style={{ fontSize: '14px', fontWeight: 600, color: 'var(--v2-text-primary)' }}
          >
            What Are Smart Money Holding?
          </span>
          <LiveBadge />
          <Info size={14} weight="regular" style={{ color: 'var(--v2-text-tertiary)' }} />
          <FilterPill label="+ Filter" />
        </div>

        <DataTable columns={holdingColumns} data={V2_TOP_TOKENS_HOLDING} />
      </div>
    </div>
  )
}
