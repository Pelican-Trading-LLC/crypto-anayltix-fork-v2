'use client'

import { Bird, CaretUp, CaretDown, Lightning, CheckCircle } from '@phosphor-icons/react'
import {
  MACRO_REGIME,
  PREDICTION_MARKETS,
  ANALYST_CALLS,
  X_FEED,
  SIGNALS_DATA,
  PELICAN_SYNTHESES,
  MOCK_PORTFOLIO,
  formatUSD,
  formatPnl,
} from '@/lib/crypto-mock-data'

/* ─── Direction Badge ─────────────────────────────────────────── */

function DirectionBadge({ direction }: { direction: 'Bullish' | 'Bearish' | 'Neutral' }) {
  const styles = {
    Bullish: 'bg-[rgba(34,197,94,0.12)] text-[#22c55e]',
    Bearish: 'bg-[rgba(239,68,68,0.12)] text-[#ef4444]',
    Neutral: 'bg-[rgba(100,116,139,0.1)] text-[#64748b]',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${styles[direction]}`}>
      {direction === 'Bullish' && <CaretUp size={10} weight="fill" className="mr-0.5" />}
      {direction === 'Bearish' && <CaretDown size={10} weight="fill" className="mr-0.5" />}
      {direction}
    </span>
  )
}

/* ─── Pelican Morning Brief ───────────────────────────────────── */

function PelicanBrief() {
  return (
    <div className="relative rounded-lg overflow-hidden" style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.12)' }}>
      {/* Top gradient border */}
      <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #06B6D4, #8B5CF6)' }} />
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Bird size={18} weight="fill" className="text-[#06B6D4]" />
          <span className="text-[10px] tracking-[1px] font-mono uppercase text-[#06B6D4] font-semibold">
            PELICAN SYNTHESIS
          </span>
        </div>
        <p className="text-[13px] leading-relaxed text-[var(--text-secondary)]">
          {PELICAN_SYNTHESES.morningBrief}
        </p>
      </div>
    </div>
  )
}

/* ─── Macro Regime Card ───────────────────────────────────────── */

function MacroRegimeCard() {
  const { overall, instruments } = MACRO_REGIME
  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[11px] uppercase tracking-[1.5px] font-semibold text-[var(--text-muted)]">MACRO REGIME</h3>
          <span className="text-[11px] text-[var(--text-muted)]">{overall.signalsAligned}/{overall.signalsTotal} signals aligned</span>
        </div>
      </div>
      <div className="space-y-3">
        {instruments.map((inst) => (
          <div key={inst.symbol} className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[13px] font-semibold text-[var(--text-primary)]">{inst.label}</span>
              <DirectionBadge direction={inst.direction} />
            </div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-[13px] tabular-nums text-[var(--text-primary)]">{inst.value}</span>
              <span className="text-[11px] text-[var(--text-muted)]">{inst.sublabel}</span>
            </div>
            <div className="border-t border-[var(--border-subtle)] pt-2 mt-2">
              <p className="text-[11px] leading-relaxed text-[var(--text-secondary)]">{inst.insight}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Prediction Market Signals ───────────────────────────────── */

function PredictionMarketSignals() {
  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
      <h3 className="text-[11px] uppercase tracking-[1.5px] font-semibold text-[var(--text-muted)] mb-4">
        PREDICTION MARKET SIGNALS
      </h3>
      <div className="space-y-2">
        {PREDICTION_MARKETS.map((pm) => (
          <div
            key={pm.id}
            className="rounded-lg bg-[var(--bg-elevated)] p-3"
            style={{ borderLeft: pm.isContrarian ? '2px solid #8B5CF6' : '2px solid transparent' }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[12px] font-medium text-[var(--text-primary)] flex-1 mr-2">{pm.question}</span>
              {pm.isContrarian && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[rgba(139,92,246,0.12)] text-[#8B5CF6] whitespace-nowrap">
                  <Lightning size={10} weight="fill" /> CONTRARIAN
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[11px] text-[var(--text-muted)]">{pm.leadingOutcome}</span>
              <div className="flex-1 h-1.5 rounded-full bg-[var(--bg-base)] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${pm.probability}%`,
                    backgroundColor: pm.probability >= 60 ? '#22c55e' : pm.probability <= 40 ? '#ef4444' : '#f59e0b',
                  }}
                />
              </div>
              <span className="font-mono text-[12px] tabular-nums font-semibold text-[var(--text-primary)]">
                {pm.probability}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[var(--text-muted)] font-mono tabular-nums">Vol: {pm.volume}</span>
              <span className="text-[10px] text-[var(--text-secondary)]">{pm.signal}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Analyst Calls ───────────────────────────────────────────── */

function AnalystCallsFeed() {
  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
      <h3 className="text-[11px] uppercase tracking-[1.5px] font-semibold text-[var(--text-muted)] mb-4">
        LATEST ANALYST CALLS
      </h3>
      <div className="space-y-3">
        {ANALYST_CALLS.map((call, i) => (
          <div key={`${call.analyst}-${call.instrument}-${i}`} className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center text-[10px] font-bold text-[var(--text-secondary)]">
              {call.analyst.split(' ').map(w => w[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[12px] font-semibold text-[var(--text-primary)]">{call.analyst}</span>
                <span className="text-[11px] font-mono text-[var(--text-secondary)]">{call.instrument}</span>
                <DirectionBadge direction={call.direction} />
              </div>
              <p className="text-[12px] italic text-[var(--text-secondary)] leading-relaxed">&ldquo;{call.quote}&rdquo;</p>
              <span className="text-[10px] text-[var(--text-muted)]">{call.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── X Live Feed ─────────────────────────────────────────────── */

function XLiveFeed() {
  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[11px] uppercase tracking-[1.5px] font-semibold text-[var(--text-muted)]">
          &#x1D54F; LIVE FEED
        </h3>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[rgba(34,197,94,0.1)] text-[#22c55e] text-[10px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
          LIVE
        </span>
      </div>
      <div className="max-h-[600px] overflow-y-auto space-y-3 pr-1 scrollbar-thin">
        {X_FEED.map((post, i) => (
          <div key={`${post.user}-${i}`} className="rounded-lg bg-[var(--bg-elevated)] p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[12px] font-semibold text-[#06B6D4]">{post.user}</span>
              {post.verified && (
                <CheckCircle size={12} weight="fill" className="text-[#3b82f6]" />
              )}
              <span className="text-[10px] text-[var(--text-muted)] ml-auto">{post.time}</span>
            </div>
            <p className="text-[12px] leading-relaxed text-[var(--text-secondary)]">{post.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Portfolio Stats Row ─────────────────────────────────────── */

function PortfolioStatsRow() {
  const pnlPositive = MOCK_PORTFOLIO.total_pnl >= 0
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {[
        { label: 'Portfolio Value', value: formatUSD(MOCK_PORTFOLIO.total_value), color: 'text-[var(--text-primary)]' },
        { label: '24H P&L', value: formatPnl(MOCK_PORTFOLIO.total_pnl), color: pnlPositive ? 'text-[#22c55e]' : 'text-[#ef4444]' },
        { label: 'Open Positions', value: '5', color: 'text-[var(--text-primary)]' },
        { label: 'AI Alerts', value: String(SIGNALS_DATA.length), color: 'text-[#f59e0b]' },
        { label: 'Regime', value: MACRO_REGIME.overall.direction, color: MACRO_REGIME.overall.direction === 'Risk-On' ? 'text-[#22c55e]' : 'text-[#ef4444]' },
      ].map((stat) => (
        <div key={stat.label} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3">
          <span className="text-[10px] uppercase tracking-[1px] text-[var(--text-muted)] font-medium">{stat.label}</span>
          <div className={`font-mono text-lg tabular-nums font-semibold mt-1 ${stat.color}`}>{stat.value}</div>
        </div>
      ))}
    </div>
  )
}

/* ─── Dashboard Page ──────────────────────────────────────────── */

export default function DashboardPage() {
  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[var(--text-primary)]">Situation Room</h1>
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
            Command center &mdash; macro, predictions, analysts, live feed
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold ${
            MACRO_REGIME.overall.direction === 'Risk-On'
              ? 'bg-[rgba(34,197,94,0.12)] text-[#22c55e]'
              : 'bg-[rgba(239,68,68,0.12)] text-[#ef4444]'
          }`}
        >
          {MACRO_REGIME.overall.direction === 'Risk-On' ? (
            <CaretUp size={12} weight="fill" />
          ) : (
            <CaretDown size={12} weight="fill" />
          )}
          {MACRO_REGIME.overall.direction}
        </span>
      </div>

      {/* Pelican Morning Brief */}
      <PelicanBrief />

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* LEFT: Macro Regime */}
        <MacroRegimeCard />

        {/* CENTER: Prediction Markets + Analyst Calls */}
        <div className="space-y-4">
          <PredictionMarketSignals />
          <AnalystCallsFeed />
        </div>

        {/* RIGHT: X Live Feed */}
        <XLiveFeed />
      </div>

      {/* Portfolio Stats Row */}
      <PortfolioStatsRow />
    </div>
  )
}
