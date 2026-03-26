"use client"

import React, { useState } from 'react'
import { FilterPill } from '@/components/v2/filter-pill'
import { AnalyzeButton } from '@/components/v2/analyze-button'
import { useAnalyze } from '@/components/v2/pelican-analyze-panel'
import { PatternSVG } from './pattern-svg'
import { V2_ANALYST_SETUPS, type V2AnalystSetup } from '@/lib/crypto-mock-data'

const ANALYSTS = ['All Analysts', 'Blake Morrow', 'Nick Groves', 'Grega Horvat', 'Jack Marshall'] as const
const PATTERNS = ['All Patterns', 'Bull Flag', 'Cup & Handle', 'Falling Wedge', 'H&S', 'Elliott Wave'] as const

const patternFilterMap: Record<string, string> = {
  'H&S': 'Head & Shoulders',
}

function formatPrice(n: number): string {
  if (n >= 1000) return `$${n.toLocaleString()}`
  return `$${n}`
}

export function AnalystSetups() {
  const [activeAnalyst, setActiveAnalyst] = useState<string>('All Analysts')
  const [activePattern, setActivePattern] = useState<string>('All Patterns')
  const analyze = useAnalyze()

  const filtered = V2_ANALYST_SETUPS.filter((s) => {
    if (activeAnalyst !== 'All Analysts' && s.analyst !== activeAnalyst) return false
    if (activePattern !== 'All Patterns') {
      const mapped = patternFilterMap[activePattern] || activePattern
      if (s.pattern !== mapped) return false
    }
    return true
  })

  return (
    <div>
      {/* Analyst filter row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
        {ANALYSTS.map((a) => (
          <FilterPill
            key={a}
            label={a}
            active={activeAnalyst === a}
            onClick={() => setActiveAnalyst(a)}
          />
        ))}
      </div>

      {/* Pattern filter row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
        {PATTERNS.map((p) => (
          <FilterPill
            key={p}
            label={p}
            active={activePattern === p}
            onClick={() => setActivePattern(p)}
          />
        ))}
      </div>

      {/* Setup cards */}
      <div>
        {filtered.map((setup, i) => (
          <SetupCard key={i} setup={setup} onAnalyze={() => analyze('setup', setup as unknown as Record<string, unknown>)} />
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--v2-text-tertiary)', fontSize: '13px' }}>
            No setups match the selected filters.
          </div>
        )}
      </div>
    </div>
  )
}

function SetupCard({ setup, onAnalyze }: { setup: V2AnalystSetup; onAnalyze: () => void }) {
  const dirColor = setup.direction === 'Bullish' ? 'var(--v2-green)' : 'var(--v2-red)'

  return (
    <div
      style={{
        padding: '14px 0',
        borderBottom: '1px solid var(--v2-border)',
      }}
    >
      {/* Top row: avatar, analyst, token badge, pattern badge, direction */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
        {/* Avatar */}
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: setup.avatarColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {setup.analyst.split(' ').map((w) => w[0]).join('')}
        </div>

        {/* Analyst name */}
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--v2-text-primary)' }}>
          {setup.analyst}
        </span>

        {/* Token badge */}
        <span
          style={{
            padding: '2px 8px',
            borderRadius: '4px',
            background: 'rgba(6,182,212,0.15)',
            color: '#06B6D4',
            fontSize: '11px',
            fontWeight: 600,
          }}
        >
          {setup.token}
        </span>

        {/* Pattern badge */}
        <span
          style={{
            padding: '2px 8px',
            borderRadius: '4px',
            background: 'var(--v2-bg-elevated)',
            color: 'var(--v2-text-secondary)',
            fontSize: '11px',
            fontWeight: 500,
            border: '1px solid var(--v2-border)',
          }}
        >
          {setup.pattern}
        </span>

        {/* Direction */}
        <span style={{ fontSize: '12px', fontWeight: 600, color: dirColor }}>
          {setup.direction}
        </span>
      </div>

      {/* Description */}
      <div
        style={{
          fontSize: '12px',
          color: 'var(--v2-text-secondary)',
          lineHeight: 1.5,
          marginBottom: '10px',
        }}
      >
        {setup.description}
      </div>

      {/* Pattern SVG */}
      <div style={{ marginBottom: '10px' }}>
        <PatternSVG pattern={setup.pattern} />
      </div>

      {/* Bottom row: Entry, Target, Stop, TF, Analyze */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '12px', color: 'var(--v2-text-secondary)' }}>
          Entry: <span className="v2-mono" style={{ color: 'var(--v2-text-primary)' }}>{formatPrice(setup.entry)}</span>
        </span>
        <span style={{ fontSize: '12px', color: 'var(--v2-text-secondary)' }}>
          Target: <span className="v2-mono" style={{ color: 'var(--v2-green)' }}>{formatPrice(setup.target)}</span>
        </span>
        <span style={{ fontSize: '12px', color: 'var(--v2-text-secondary)' }}>
          Stop: <span className="v2-mono" style={{ color: 'var(--v2-red)' }}>{formatPrice(setup.stop)}</span>
        </span>
        <span style={{ fontSize: '12px', color: 'var(--v2-text-secondary)' }}>
          TF: <span className="v2-mono" style={{ color: 'var(--v2-text-primary)' }}>{setup.timeframe}</span>
        </span>
        <div style={{ marginLeft: 'auto' }}>
          <AnalyzeButton onClick={onAnalyze} />
        </div>
      </div>
    </div>
  )
}
