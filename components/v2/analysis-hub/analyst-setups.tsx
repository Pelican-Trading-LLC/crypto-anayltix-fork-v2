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
          <div
            className="v2-sans"
            style={{ padding: '24px', textAlign: 'center', color: 'var(--v2-text-tertiary)', fontSize: '13px' }}
          >
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
        padding: '16px 0',
        borderBottom: '1px solid var(--v2-border)',
      }}
    >
      {/* Top row: avatar, analyst, token badge, pattern badge, direction */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        {/* Avatar — 32px circle */}
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: setup.avatarColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '12px',
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {setup.analyst.split(' ').map((w) => w[0]).join('')}
        </div>

        {/* Analyst name */}
        <span
          className="v2-sans"
          style={{ fontSize: '13px', fontWeight: 600, color: 'var(--v2-text-primary)' }}
        >
          {setup.analyst}
        </span>

        {/* Token badge */}
        <span
          className="v2-mono"
          style={{
            height: '20px',
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0 6px',
            borderRadius: '4px',
            background: 'rgba(255,255,255,0.04)',
            color: 'var(--v2-text-tertiary)',
            fontSize: '10px',
          }}
        >
          {setup.token}
        </span>

        {/* Pattern badge */}
        <span
          className="v2-sans"
          style={{
            height: '20px',
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0 6px',
            borderRadius: '4px',
            background: 'rgba(255,255,255,0.04)',
            color: 'var(--v2-text-tertiary)',
            fontSize: '10px',
          }}
        >
          {setup.pattern}
        </span>

        {/* Direction */}
        <span
          className="v2-sans"
          style={{ fontSize: '12px', fontWeight: 600, color: dirColor }}
        >
          {setup.direction}
        </span>
      </div>

      {/* Description */}
      <div
        className="v2-sans"
        style={{
          fontSize: '12.5px',
          color: 'var(--v2-text-secondary)',
          lineHeight: 1.5,
          marginTop: '6px',
        }}
      >
        {setup.description}
      </div>

      {/* Pattern SVG */}
      <div style={{ margin: '12px 0' }}>
        <PatternSVG pattern={setup.pattern} />
      </div>

      {/* Bottom row: Entry, Target, Stop, TF, Analyze */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <span className="v2-sans" style={{ fontSize: '12px', color: 'var(--v2-text-secondary)' }}>
          Entry:{' '}
          <span className="v2-mono" style={{ color: 'var(--v2-text-primary)' }}>
            {formatPrice(setup.entry)}
          </span>
        </span>
        <span className="v2-sans" style={{ fontSize: '12px', color: 'var(--v2-text-secondary)' }}>
          Target:{' '}
          <span className="v2-mono" style={{ color: 'var(--v2-green)' }}>
            {formatPrice(setup.target)}
          </span>
        </span>
        <span className="v2-sans" style={{ fontSize: '12px', color: 'var(--v2-text-secondary)' }}>
          Stop:{' '}
          <span className="v2-mono" style={{ color: 'var(--v2-red)' }}>
            {formatPrice(setup.stop)}
          </span>
        </span>
        <span className="v2-sans" style={{ fontSize: '12px', color: 'var(--v2-text-secondary)' }}>
          TF:{' '}
          <span className="v2-mono" style={{ color: 'var(--v2-text-tertiary)' }}>
            {setup.timeframe}
          </span>
        </span>
        <div style={{ marginLeft: 'auto' }}>
          <AnalyzeButton onClick={onAnalyze} />
        </div>
      </div>
    </div>
  )
}
