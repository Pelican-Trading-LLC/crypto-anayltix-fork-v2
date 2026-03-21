'use client'

import { useState } from 'react'
import { Lightning } from '@phosphor-icons/react'
import { SIGNALS_DATA, type Signal } from '@/lib/crypto-mock-data'

const TABS = ['All Signals', 'Convergence', 'Contrarian', 'On-Chain', 'Analyst', 'Macro', 'Tokenization', 'Technical'] as const
type Tab = typeof TABS[number]

const severityStyles: Record<Signal['severity'], string> = {
  HIGH: 'bg-[rgba(239,68,68,0.12)] text-[#ef4444]',
  MEDIUM: 'bg-[rgba(245,158,11,0.12)] text-[#f59e0b]',
  LOW: 'bg-[rgba(100,116,139,0.1)] text-[#64748b]',
}

const actionStyles: Record<Signal['action'], string> = {
  Position: 'bg-[rgba(34,197,94,0.12)] text-[#22c55e]',
  Watch: 'bg-[rgba(245,158,11,0.12)] text-[#f59e0b]',
  Hedge: 'bg-[rgba(59,130,246,0.12)] text-[#3b82f6]',
  Confirm: 'bg-[rgba(100,116,139,0.1)] text-[#64748b]',
}

export default function SignalsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('All Signals')

  const filtered = activeTab === 'All Signals'
    ? SIGNALS_DATA
    : SIGNALS_DATA.filter((s) => s.type === activeTab)

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Lightning size={24} weight="bold" className="text-[#06B6D4]" />
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Signals &amp; Alerts</h1>
        </div>
        <p className="text-sm text-[var(--text-secondary)] ml-[36px]">Multi-source intelligence signals</p>
      </div>

      {/* Tab Bar */}
      <div className="flex flex-wrap gap-1 mb-6 p-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === tab
                ? 'bg-[rgba(6,182,212,0.12)] text-[#06B6D4]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Signal Cards */}
      <div className="space-y-3">
        {filtered.map((signal, i) => (
          <div
            key={`${signal.type}-${i}`}
            className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 overflow-hidden"
            style={{ borderLeftWidth: 3, borderLeftColor: signal.color }}
          >
            {/* Top row: severity + type + time */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${severityStyles[signal.severity]}`}>
                  {signal.severity}
                </span>
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-semibold"
                  style={{
                    backgroundColor: `${signal.color}1F`,
                    color: signal.color,
                  }}
                >
                  {signal.type}
                </span>
              </div>
              <span className="text-xs text-[var(--text-muted)] font-mono">{signal.time}</span>
            </div>

            {/* Title */}
            <h3 className="text-base font-semibold text-[var(--text-primary)]">{signal.title}</h3>

            {/* Description */}
            <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">{signal.description}</p>

            {/* Bottom row: tokens + action + confidence */}
            <div className="flex items-center flex-wrap gap-2 mt-3">
              {signal.tokens.map((token) => (
                <span
                  key={token}
                  className="bg-[var(--bg-elevated)] px-2 py-0.5 rounded text-xs font-mono text-[var(--text-secondary)]"
                >
                  {token}
                </span>
              ))}
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${actionStyles[signal.action]}`}>
                {signal.action}
              </span>
              <span className="text-xs font-mono text-[var(--text-muted)] ml-auto">
                {signal.confidence} confidence
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-[var(--text-muted)] mt-8 mb-4">
        You&apos;re all caught up
      </div>
    </div>
  )
}
