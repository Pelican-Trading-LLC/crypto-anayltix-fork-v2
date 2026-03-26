"use client"

import React, { useState } from 'react'
import { FilterPill } from '@/components/v2/filter-pill'
import { Leaderboard } from '@/components/v2/smart-money/leaderboard'
import { TopTokens } from '@/components/v2/smart-money/top-tokens'
import { TradesFeed } from '@/components/v2/smart-money/trades-feed'

const TABS = ['Leaderboard', 'Top Tokens', 'Trades'] as const
type Tab = (typeof TABS)[number]

export default function SmartMoneyPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Leaderboard')

  return (
    <div
      style={{
        background: 'var(--v2-bg-base)',
        padding: '24px',
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '16px',
        }}
      >
        <span
          className="v2-sans"
          style={{ fontSize: '16px', fontWeight: 700, color: 'var(--v2-text-primary)' }}
        >
          Smart Money
        </span>
        <FilterPill label="Solana" active color="cyan" />
        <FilterPill label="Spot" active color="green" />
        <FilterPill label="Perps" />
      </div>

      {/* Tab bar */}
      <div
        style={{
          display: 'flex',
          gap: '0',
          borderBottom: '1px solid var(--v2-border)',
          marginBottom: '20px',
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className="v2-sans"
            style={{
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 600,
              color:
                activeTab === tab ? '#06B6D4' : 'var(--v2-text-tertiary)',
              background: 'none',
              border: 'none',
              borderBottom:
                activeTab === tab ? '2px solid #06B6D4' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'color 0.15s, border-color 0.15s',
              marginBottom: '-1px',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'Leaderboard' && <Leaderboard />}
      {activeTab === 'Top Tokens' && <TopTokens />}
      {activeTab === 'Trades' && <TradesFeed />}
    </div>
  )
}
