"use client"

import React, { useState } from 'react'
import { TokenTable } from '@/components/v2/dashboard/token-table'
import { WatchlistTab } from '@/components/v2/dashboard/watchlist-tab'
import { ProfitableWallets } from '@/components/v2/dashboard/profitable-wallets'
import { FilterPill } from '@/components/v2/filter-pill'
import { TimeToggle } from '@/components/v2/time-toggle'

type Tab = 'default' | 'watchlist'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('default')
  const [timeRange, setTimeRange] = useState('24H')

  return (
    <div
      style={{
        background: 'var(--v2-bg-base)',
        minHeight: '100vh',
        padding: '24px',
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              fontSize: '16px',
              fontWeight: 700,
              color: 'var(--v2-text-primary)',
            }}
          >
            Token Screener
          </span>
          <span
            className="v2-mono"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '10px',
              fontWeight: 600,
              color: 'var(--v2-green)',
              border: '1px solid rgba(34,197,94,0.3)',
              borderRadius: '9999px',
              padding: '2px 8px',
            }}
          >
            <span
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: 'var(--v2-green)',
              }}
            />
            LIVE
          </span>
        </div>
        <TimeToggle
          options={['5M', '1H', '6H', '24H']}
          value={timeRange}
          onChange={setTimeRange}
        />
      </div>

      {/* Sub-tabs */}
      <div
        style={{
          display: 'flex',
          gap: '24px',
          borderBottom: '1px solid var(--v2-border)',
          marginBottom: '12px',
        }}
      >
        {(['default', 'watchlist'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid var(--v2-cyan)' : '2px solid transparent',
              padding: '8px 0',
              fontSize: '13px',
              fontWeight: activeTab === tab ? 600 : 400,
              color: activeTab === tab ? 'var(--v2-cyan)' : 'var(--v2-text-secondary)',
              cursor: 'pointer',
              transition: 'color 0.15s, border-color 0.15s',
            }}
          >
            {tab === 'default' ? 'Default' : 'Watchlist'}
          </button>
        ))}
      </div>

      {/* Filter bar (Default tab only) */}
      {activeTab === 'default' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '12px',
            flexWrap: 'wrap',
          }}
        >
          <FilterPill label="Solana" active />
          <FilterPill label="Spot" active color="#22c55e" />
          <FilterPill label="Perps" />
          <FilterPill label="All Caps &#9662;" />
          <FilterPill label="Sectors &#9662;" />
          <FilterPill label="Any Token Age(D)" />
          <FilterPill label="+ Filter" />
          <FilterPill label="&#128302; Smart Money" />
        </div>
      )}

      {/* Content */}
      {activeTab === 'default' ? <TokenTable /> : <WatchlistTab />}

      {/* Profitable Wallets section */}
      <div style={{ marginTop: '20px' }}>
        <ProfitableWallets />
      </div>
    </div>
  )
}
