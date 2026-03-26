"use client"

import React, { useState } from 'react'
import { AnalystSetups } from '@/components/v2/analysis-hub/analyst-setups'
import { ResearchFeed } from '@/components/v2/analysis-hub/research-feed'
import { XFeed } from '@/components/v2/analysis-hub/x-feed'

const TABS = ['Analyst Setups', 'Research Feed', 'X Feed'] as const
type Tab = (typeof TABS)[number]

export default function AnalysisHubPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Analyst Setups')

  return (
    <div
      style={{
        background: 'var(--v2-bg-base)',
        padding: '24px',
        minHeight: '100%',
      }}
    >
      {/* Page title */}
      <h1
        className="v2-sans"
        style={{
          fontSize: '18px',
          fontWeight: 600,
          color: 'var(--v2-text-primary)',
          margin: '0 0 16px 0',
        }}
      >
        Analysis Hub
      </h1>

      {/* Sub-tab bar */}
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
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid #22D3EE' : '2px solid transparent',
              color: activeTab === tab ? 'var(--v2-text-primary)' : 'var(--v2-text-secondary)',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'color 0.15s, border-color 0.15s',
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab) {
                ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--v2-text-primary)'
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab) {
                ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--v2-text-secondary)'
              }
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'Analyst Setups' && <AnalystSetups />}
      {activeTab === 'Research Feed' && <ResearchFeed />}
      {activeTab === 'X Feed' && <XFeed />}
    </div>
  )
}
