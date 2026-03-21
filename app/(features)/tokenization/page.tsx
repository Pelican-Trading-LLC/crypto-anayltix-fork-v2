'use client';

import { Bird, ArrowRight, TrendUp } from '@phosphor-icons/react';
import {
  TOKENIZATION_PULSE,
  TOKENIZATION_MILESTONES,
  TRADFI_EQUIVALENTS,
  PELICAN_SYNTHESES,
} from '@/lib/crypto-mock-data';

export default function TokenizationPage() {
  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Tokenization</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Real-world assets moving on-chain — treasuries, stocks, commodities, credit
        </p>
      </div>

      {/* Tokenization Pulse — 2x2 grid */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TOKENIZATION_PULSE.map((sector) => (
            <div
              key={sector.category}
              className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 transition-all duration-150 hover:border-[var(--border-hover)] hover:shadow-lg hover:-translate-y-px"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-[var(--text-primary)]">
                  {sector.category}
                </span>
                <span className="text-xs font-mono text-[var(--data-positive)] bg-[rgba(34,197,94,0.1)] px-2 py-0.5 rounded-full">
                  {sector.growth}
                </span>
              </div>

              <div className="text-2xl font-mono font-semibold text-[var(--text-primary)] tabular-nums mb-4">
                {sector.totalValue}
              </div>

              <div className="space-y-2">
                {sector.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-[var(--text-secondary)]">{item.name}</span>
                    <div className="flex items-center gap-3">
                      {item.value && (
                        <span className="font-mono tabular-nums text-[var(--text-primary)]">
                          {item.value}
                        </span>
                      )}
                      {item.yield && (
                        <span className="text-xs text-[var(--data-positive)]">
                          {item.yield}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pelican Synthesis */}
      <section>
        <div className="rounded-xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.06)] p-5 relative overflow-hidden">
          {/* Gradient top bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500/60 via-cyan-400/80 to-cyan-500/60" />

          <div className="flex items-center gap-2 mb-3">
            <Bird size={18} weight="fill" className="text-cyan-400" />
            <span className="text-xs font-semibold tracking-wider text-cyan-400 uppercase">
              Pelican Synthesis
            </span>
          </div>

          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {PELICAN_SYNTHESES.tokenization}
          </p>
        </div>
      </section>

      {/* What Just Moved On-Chain — timeline feed */}
      <section>
        <h2 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase mb-4">
          What Just Moved On-Chain
        </h2>

        <div className="relative">
          {/* Vertical connecting line */}
          <div className="absolute left-[7px] top-3 bottom-3 w-px bg-[var(--border-subtle)]" />

          <div className="space-y-3">
            {TOKENIZATION_MILESTONES.map((milestone, i) => (
              <div key={i} className="flex gap-4 relative">
                {/* Timeline dot */}
                <div className="relative z-10 mt-1.5 flex-shrink-0">
                  <div className="w-[15px] h-[15px] rounded-full border-2 border-[var(--border-default)] bg-[var(--bg-surface)]" />
                </div>

                {/* Card */}
                <div className="flex-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 transition-all duration-150 hover:border-[var(--border-hover)]">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <span className="font-semibold text-[var(--text-primary)]">
                      {milestone.title}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                        milestone.impact === 'High'
                          ? 'text-red-400 bg-red-400/10'
                          : milestone.impact === 'Medium'
                          ? 'text-amber-400 bg-amber-400/10'
                          : 'text-[var(--text-muted)] bg-[var(--bg-elevated)]'
                      }`}
                    >
                      {milestone.impact}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] mb-2">
                    {milestone.description}
                  </p>
                  <span className="text-xs font-mono tabular-nums text-[var(--text-muted)]">
                    {milestone.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TradFi Equivalents */}
      <section>
        <h2 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase mb-4">
          TradFi → Tokenized Equivalents
        </h2>

        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_auto_1fr_1fr] gap-4 px-5 py-3 border-b border-[var(--border-subtle)]">
            <span className="text-xs font-medium tracking-wider uppercase text-[var(--text-muted)]">
              Traditional
            </span>
            <span className="w-5" />
            <span className="text-xs font-medium tracking-wider uppercase text-[var(--text-muted)]">
              Tokenized
            </span>
            <span className="text-xs font-medium tracking-wider uppercase text-[var(--text-muted)]">
              Advantage
            </span>
          </div>

          {/* Table rows */}
          {TRADFI_EQUIVALENTS.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-[1fr_auto_1fr_1fr] gap-4 px-5 py-3 items-center transition-colors duration-150 hover:bg-[var(--bg-elevated)]"
            >
              <span className="text-sm text-[var(--text-secondary)]">
                {row.traditional}
              </span>
              <ArrowRight
                size={16}
                weight="bold"
                className="text-[var(--text-muted)] flex-shrink-0"
              />
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {row.tokenized}
              </span>
              <span className="text-sm text-[var(--data-positive)] flex items-center gap-1.5">
                <TrendUp size={14} weight="bold" className="flex-shrink-0" />
                {row.advantage}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
