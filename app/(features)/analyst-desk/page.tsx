'use client'

import { Bird } from '@phosphor-icons/react'
import {
  FA_ANALYSTS,
  ANALYST_CALLS,
  ANALYST_CONSENSUS,
  PELICAN_SYNTHESES,
} from '@/lib/crypto-mock-data'

function DirectionBadge({ direction }: { direction: string }) {
  const config =
    direction === 'Bullish' || direction.includes('BULLISH')
      ? { bg: 'rgba(34,197,94,0.12)', text: '#22c55e', label: 'BULLISH' }
      : direction === 'Bearish' || direction.includes('BEARISH')
        ? { bg: 'rgba(239,68,68,0.12)', text: '#ef4444', label: 'BEARISH' }
        : { bg: 'rgba(100,116,139,0.1)', text: '#64748b', label: 'NEUTRAL' }

  return (
    <span
      className="inline-block rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      {config.label}
    </span>
  )
}

function ViewCell({ view }: { view: string }) {
  const color =
    view === 'Bullish'
      ? '#22c55e'
      : view === 'Bearish'
        ? '#ef4444'
        : '#64748b'
  return (
    <span className="text-sm" style={{ color }}>
      {view}
    </span>
  )
}

function consensusColor(consensus: string) {
  if (consensus.includes('BULLISH')) return '#22c55e'
  if (consensus.includes('BEARISH')) return '#ef4444'
  return '#64748b'
}

function PelicanSynthesisBox({ text }: { text: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[rgba(6,182,212,0.2)] bg-[rgba(6,182,212,0.04)]">
      <div className="h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <div className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <Bird size={18} weight="fill" className="text-cyan-400" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400">
            PELICAN SYNTHESIS
          </span>
        </div>
        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
          {text}
        </p>
      </div>
    </div>
  )
}

export default function AnalystDeskPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      {/* ── Page Header ── */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
            Analyst Desk
          </h1>
          <span className="rounded bg-cyan-500/15 px-2 py-0.5 text-[11px] font-bold tracking-wider text-cyan-400">
            FA
          </span>
        </div>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          ForexAnalytix analyst intelligence
        </p>
      </div>

      {/* ── Analyst Profile Cards ── */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {FA_ANALYSTS.map((analyst) => (
          <div
            key={analyst.name}
            className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 transition-all duration-150 hover:-translate-y-px hover:border-[var(--border-hover)] hover:shadow-lg"
          >
            {/* Avatar + Name */}
            <div className="mb-4 flex items-center gap-3">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
                style={{ backgroundColor: analyst.color }}
              >
                {analyst.initials}
              </div>
              <div>
                <div className="font-semibold text-base text-[var(--text-primary)]">
                  {analyst.name}
                </div>
                <span className="inline-block rounded-full bg-[var(--bg-elevated)] px-2 py-0.5 text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">
                  {analyst.specialty}
                </span>
              </div>
            </div>

            {/* Instruments */}
            <div className="mb-1 text-sm text-[var(--text-secondary)]">
              <span className="text-[var(--text-muted)]">Instruments: </span>
              {analyst.instruments}
            </div>

            {/* Crypto */}
            <div className="mb-3 text-sm text-[var(--text-secondary)]">
              <span className="text-[var(--text-muted)]">Crypto: </span>
              {analyst.crypto}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 border-t border-[var(--border-subtle)] pt-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                  Win Rate
                </span>
                <div className="font-mono text-sm font-semibold tabular-nums text-[#22c55e]">
                  {analyst.winRate}
                </div>
              </div>
              {analyst.pips && (
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                    PIPs
                  </span>
                  <div className="font-mono text-sm font-semibold tabular-nums text-[var(--text-primary)]">
                    {analyst.pips}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Consensus Matrix ── */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
        <h2 className="mb-4 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          CONSENSUS MATRIX
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {['Instrument', 'Blake', 'Grega', 'Steve', 'Dale', 'Consensus'].map(
                  (col) => (
                    <th
                      key={col}
                      className="pb-3 text-left text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]"
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {ANALYST_CONSENSUS.map((row) => (
                <tr
                  key={row.instrument}
                  className="transition-colors duration-150 hover:bg-[var(--bg-elevated)]"
                >
                  <td className="py-2.5 text-sm font-medium text-[var(--text-primary)]">
                    {row.instrument}
                  </td>
                  <td className="py-2.5">
                    <ViewCell view={row.views.blake} />
                  </td>
                  <td className="py-2.5">
                    <ViewCell view={row.views.grega} />
                  </td>
                  <td className="py-2.5">
                    <ViewCell view={row.views.steve} />
                  </td>
                  <td className="py-2.5">
                    <ViewCell view={row.views.dale} />
                  </td>
                  <td className="py-2.5">
                    <span
                      className="text-sm font-bold"
                      style={{ color: consensusColor(row.consensus) }}
                    >
                      {row.consensus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Pelican Translation ── */}
      <PelicanSynthesisBox text={PELICAN_SYNTHESES.analystConsensus} />

      {/* ── Webinar Recap ── */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
        <div className="mb-5 flex items-center gap-3">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            FACE Daily Webinar &middot; Today
          </h2>
          <span className="rounded bg-cyan-500/15 px-2 py-0.5 text-[10px] font-bold tracking-wider text-cyan-400">
            LIVE
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left: Key analyst calls */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Key Analyst Calls
            </h3>
            <div className="space-y-3">
              {ANALYST_CALLS.map((call, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3"
                >
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className="text-sm font-medium text-[var(--text-primary)]">
                      {call.analyst}
                    </span>
                    <span className="font-mono text-xs tabular-nums text-[var(--text-secondary)]">
                      {call.instrument}
                    </span>
                    <DirectionBadge direction={call.direction} />
                  </div>
                  <p className="text-sm italic text-[var(--text-secondary)]">
                    &ldquo;{call.quote}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Pelican webinar synthesis */}
          <div>
            <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Pelican Webinar Synthesis
            </h3>
            <PelicanSynthesisBox text={PELICAN_SYNTHESES.webinarRecap} />
          </div>
        </div>
      </div>
    </div>
  )
}
