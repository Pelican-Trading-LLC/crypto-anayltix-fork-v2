'use client'

import { useState } from 'react'
import { Lightning, ArrowRight } from '@phosphor-icons/react'
import {
  PREDICTION_MARKETS,
  CONTRARIAN_SPOTLIGHT,
  TRADFI_BRIDGE_PREDICTIONS,
  PELICAN_SYNTHESES,
} from '@/lib/crypto-mock-data'

const TABS = ['Macro & Fed', 'Crypto', 'Geopolitical', 'Regulatory', 'Contrarian Signals'] as const
type Tab = typeof TABS[number]

const TAB_CATEGORY_MAP: Record<Tab, string | null> = {
  'Macro & Fed': 'macro',
  'Crypto': 'crypto',
  'Geopolitical': 'geopolitical',
  'Regulatory': 'regulatory',
  'Contrarian Signals': null,
}

function probColor(p: number) {
  if (p > 70) return 'bg-green-500'
  if (p >= 30) return 'bg-amber-400'
  return 'bg-red-500'
}

export default function PredictionsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Macro & Fed')

  const filtered = activeTab === 'Contrarian Signals'
    ? PREDICTION_MARKETS.filter(c => c.isContrarian)
    : PREDICTION_MARKETS.filter(c => c.category === TAB_CATEGORY_MAP[activeTab])

  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-8">
      {/* ── Page Header ── */}
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Predictions</h1>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 text-[11px] font-semibold tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              LIVE
            </span>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Prediction market intelligence — contrarian signals, probability-as-indicator
          </p>
        </div>
      </div>

      {/* ── Contrarian Signal Spotlight ── */}
      <div className="bg-gradient-to-r from-[rgba(139,92,246,0.06)] to-[rgba(6,182,212,0.06)] border border-[rgba(139,92,246,0.15)] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightning size={20} weight="fill" className="text-amber-400" />
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Contrarian Signal Spotlight</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left side */}
          <div className="space-y-4">
            <p className="text-lg font-semibold text-[var(--text-primary)]">
              {CONTRARIAN_SPOTLIGHT.question}
            </p>

            {/* Stat boxes */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-3 text-center">
                <p className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] mb-1">Current Probability</p>
                <p className="text-3xl font-mono text-amber-400 tabular-nums">{CONTRARIAN_SPOTLIGHT.currentProbability}%</p>
              </div>
              <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-3 text-center">
                <p className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] mb-1">Volume</p>
                <p className="text-xl font-mono text-[var(--text-primary)] tabular-nums">{CONTRARIAN_SPOTLIGHT.volume}</p>
              </div>
              <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-3 text-center">
                <p className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] mb-1">Move Required</p>
                <p className="text-xl font-mono text-red-400 tabular-nums">{CONTRARIAN_SPOTLIGHT.moveRequired}</p>
              </div>
            </div>

            {/* Historical instances */}
            <div>
              <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Historical Instances</p>
              <div className="flex flex-wrap gap-2">
                {CONTRARIAN_SPOTLIGHT.history.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs">
                    <span className="font-mono text-[var(--text-secondary)] tabular-nums">{h.date}</span>
                    <span className="text-[var(--text-muted)]">|</span>
                    <span className="font-mono text-amber-400 tabular-nums">{h.probability}%</span>
                    <span className="text-[var(--text-muted)]">|</span>
                    <span className="font-mono text-[var(--text-secondary)] tabular-nums">${h.btcPrice.toLocaleString()}</span>
                    <span className="text-[var(--text-muted)]">|</span>
                    <span className={`font-medium ${h.label.includes('BOTTOM') ? 'text-green-400' : 'text-red-400'}`}>
                      {h.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right side — Pelican Analysis */}
          <div className="relative rounded-xl overflow-hidden bg-[rgba(6,182,212,0.04)] border border-[rgba(6,182,212,0.12)]">
            <div className="h-[2px] bg-gradient-to-r from-cyan-500/60 via-cyan-400 to-cyan-500/60" />
            <div className="p-4">
              <p className="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-2">Pelican Analysis</p>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {CONTRARIAN_SPOTLIGHT.pelicanAnalysis}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div className="flex gap-1 p-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors cursor-pointer ${
              activeTab === tab
                ? 'bg-[#06B6D4]/15 text-[#06B6D4]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Prediction Contracts Table ── */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border-subtle)]">
              <th className="text-left text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-medium px-4 py-3">Question</th>
              <th className="text-left text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-medium px-4 py-3">Leading Outcome</th>
              <th className="text-left text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-medium px-4 py-3 w-[180px]">Probability</th>
              <th className="text-right text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-medium px-4 py-3">Volume</th>
              <th className="text-left text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-medium px-4 py-3">Signal</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(contract => (
              <tr
                key={contract.id}
                className={`border-b border-[var(--border-subtle)] last:border-b-0 hover:bg-[var(--bg-elevated)] transition-colors ${
                  contract.isContrarian ? 'border-l-2 border-l-violet-500' : ''
                }`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[var(--text-primary)]">{contract.question}</span>
                    {contract.isContrarian && (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-violet-500/15 text-violet-400 text-[10px] font-semibold whitespace-nowrap">
                        <Lightning size={10} weight="fill" /> CONTRARIAN
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">{contract.leadingOutcome}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-[var(--bg-base)] overflow-hidden">
                      <div
                        className={`h-full rounded-full ${probColor(contract.probability)}`}
                        style={{ width: `${contract.probability}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-[var(--text-primary)] tabular-nums w-8 text-right">
                      {contract.probability}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-sm font-mono text-[var(--text-secondary)] tabular-nums">
                  {contract.volume}
                </td>
                <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">{contract.signal}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-[var(--text-muted)]">
                  No contracts in this category
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── TradFi Bridge ── */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          TradFi <ArrowRight size={16} weight="bold" className="inline text-[var(--text-muted)] mx-1" /> Prediction Market Bridge
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TRADFI_BRIDGE_PREDICTIONS.map((item, i) => (
            <div
              key={i}
              className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-3 flex items-center gap-3 hover:border-[var(--border-hover)] transition-colors"
            >
              <span className="text-sm text-[var(--text-muted)] flex-1">{item.traditional}</span>
              <ArrowRight size={14} weight="bold" className="text-[var(--text-muted)] shrink-0" />
              <span className="text-sm text-[var(--text-primary)] flex-1">{item.tokenized}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
