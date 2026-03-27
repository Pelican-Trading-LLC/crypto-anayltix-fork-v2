'use client'

import React, { useState } from 'react'
import { TokenIcon, FilterPill, InsightsButton, Sparkline, SourceLogo } from '@/components/shared'
import { formatCompact } from '@/lib/format'
import {
  MOCK_ANALYST_SETUPS,
  ANALYST_PERFORMANCE,
  MOCK_RESEARCH_FEED,
  MOCK_X_FEED,
} from '@/lib/crypto-mock-data'
import type { AnalystSetup, ResearchArticle, XPost } from '@/lib/crypto-mock-data'

// ── Tab types ─────────────────────────────────────────────────
type ActiveTab = 'setups' | 'research' | 'xfeed'

const TABS: { key: ActiveTab; label: string }[] = [
  { key: 'setups', label: 'Analyst Setups' },
  { key: 'research', label: 'Research Feed' },
  { key: 'xfeed', label: 'X Feed' },
]

const ANALYST_FILTERS = ['All Analysts', 'Blake Morrow', 'Nick Groves', 'Grega Horvat', 'Jack Marshall']
const PATTERN_FILTERS = ['All Patterns', 'Bull Flag', 'Cup & Handle', 'Elliott Wave', 'H&S', 'Bat Pattern']

// ── Source brand colors (for research feed author source text) ──
const SOURCE_BRAND_COLORS: Record<string, string> = {
  'The Block': '#E94560',
  'Blockworks': '#48CAE4',
  'Messari': '#66BB6A',
  'Delphi Digital': '#BB86FC',
  'Arkham Intel': '#F59E0B',
  'CoinDesk': '#3B82F6',
}

// ── Chart Pattern SVGs ────────────────────────────────────────
function PatternSVG({ pattern }: { pattern: string }) {
  const w = 280
  const h = 80
  const stroke = 'var(--accent-primary)'
  const strokeMuted = 'var(--text-quaternary)'
  const green = 'var(--data-positive)'

  const common: React.SVGProps<SVGSVGElement> = {
    width: w,
    height: h,
    viewBox: '0 0 280 100',
    style: {
      display: 'block',
      background: 'var(--bg-surface-3)',
      borderRadius: 6,
      border: '1px solid var(--border-subtle)',
    },
    preserveAspectRatio: 'xMidYMid meet',
  }

  switch (pattern) {
    case 'Bull Flag':
      return (
        <svg {...common}>
          {/* Pole */}
          <polyline points="30,85 80,25" fill="none" stroke={stroke} strokeWidth={2} />
          {/* Flag channel */}
          <polyline points="80,25 140,40 200,35" fill="none" stroke={strokeMuted} strokeWidth={1.5} strokeDasharray="4,3" />
          <polyline points="80,35 140,50 200,45" fill="none" stroke={strokeMuted} strokeWidth={1.5} strokeDasharray="4,3" />
          {/* Breakout arrow */}
          <polyline points="200,35 250,12" fill="none" stroke={green} strokeWidth={2} />
          <polygon points="250,12 242,8 244,18" fill={green} />
          <text x="255" y="16" fill={green} fontSize="9" fontFamily="var(--font-mono)">BRK</text>
        </svg>
      )
    case 'Head & Shoulders':
      return (
        <svg {...common}>
          {/* Left shoulder */}
          <polyline points="20,70 50,40 80,55" fill="none" stroke={stroke} strokeWidth={2} />
          {/* Head */}
          <polyline points="80,55 120,15 160,55" fill="none" stroke={stroke} strokeWidth={2} />
          {/* Right shoulder */}
          <polyline points="160,55 190,40 220,55" fill="none" stroke={stroke} strokeWidth={2} />
          {/* Neckline */}
          <line x1="20" y1="70" x2="260" y2="58" stroke={strokeMuted} strokeWidth={1} strokeDasharray="5,4" />
          {/* Breakdown arrow */}
          <polyline points="220,58 250,82" fill="none" stroke="var(--data-negative)" strokeWidth={2} />
          <polygon points="250,82 244,74 252,74" fill="var(--data-negative)" />
          <text x="240" y="95" fill="var(--data-negative)" fontSize="9" fontFamily="var(--font-mono)">BKD</text>
        </svg>
      )
    case 'Cup & Handle':
      return (
        <svg {...common}>
          {/* Cup */}
          <path d="M 25,30 Q 25,90 140,90 Q 255,90 200,30" fill="none" stroke={stroke} strokeWidth={2} />
          {/* Handle dip */}
          <polyline points="200,30 215,42 230,32" fill="none" stroke={stroke} strokeWidth={1.5} />
          {/* Breakout arrow */}
          <polyline points="230,32 260,12" fill="none" stroke={green} strokeWidth={2} />
          <polygon points="260,12 252,8 254,18" fill={green} />
          {/* Resistance line */}
          <line x1="15" y1="30" x2="240" y2="30" stroke={strokeMuted} strokeWidth={1} strokeDasharray="5,4" />
        </svg>
      )
    case 'Elliott Wave':
      return (
        <svg {...common}>
          {/* 5-wave impulse */}
          <polyline points="20,80 60,40 80,55 130,15 155,45 210,20" fill="none" stroke={stroke} strokeWidth={2} />
          {/* Wave labels */}
          <text x="56" y="35" fill={stroke} fontSize="10" fontWeight="700" fontFamily="var(--font-mono)">1</text>
          <text x="76" y="68" fill={stroke} fontSize="10" fontWeight="700" fontFamily="var(--font-mono)">2</text>
          <text x="126" y="10" fill={stroke} fontSize="10" fontWeight="700" fontFamily="var(--font-mono)">3</text>
          <text x="151" y="58" fill={stroke} fontSize="10" fontWeight="700" fontFamily="var(--font-mono)">4</text>
          <text x="206" y="15" fill={stroke} fontSize="10" fontWeight="700" fontFamily="var(--font-mono)">5</text>
          {/* Corrective ABC */}
          <polyline points="210,20 230,50 245,35 265,65" fill="none" stroke={strokeMuted} strokeWidth={1.5} strokeDasharray="4,3" />
          <text x="227" y="62" fill={strokeMuted} fontSize="9" fontFamily="var(--font-mono)">A</text>
          <text x="242" y="30" fill={strokeMuted} fontSize="9" fontFamily="var(--font-mono)">B</text>
          <text x="260" y="78" fill={strokeMuted} fontSize="9" fontFamily="var(--font-mono)">C</text>
        </svg>
      )
    case 'Bat Pattern':
      return (
        <svg {...common}>
          {/* XABCD harmonic */}
          <polyline points="20,70 70,20 110,55 160,25 230,80" fill="none" stroke={stroke} strokeWidth={2} />
          {/* Point labels */}
          <text x="14" y="82" fill={stroke} fontSize="10" fontWeight="700" fontFamily="var(--font-mono)">X</text>
          <text x="66" y="15" fill={stroke} fontSize="10" fontWeight="700" fontFamily="var(--font-mono)">A</text>
          <text x="106" y="68" fill={stroke} fontSize="10" fontWeight="700" fontFamily="var(--font-mono)">B</text>
          <text x="156" y="20" fill={stroke} fontSize="10" fontWeight="700" fontFamily="var(--font-mono)">C</text>
          <text x="226" y="92" fill={stroke} fontSize="10" fontWeight="700" fontFamily="var(--font-mono)">D</text>
          {/* XA / AD retracement lines */}
          <line x1="20" y1="70" x2="70" y2="20" stroke={strokeMuted} strokeWidth={0.5} strokeDasharray="3,3" />
          <line x1="70" y1="20" x2="230" y2="80" stroke={strokeMuted} strokeWidth={0.5} strokeDasharray="3,3" />
          {/* Breakout from D */}
          <polyline points="230,80 260,50" fill="none" stroke={green} strokeWidth={2} />
          <polygon points="260,50 254,56 258,44" fill={green} />
        </svg>
      )
    case 'Falling Wedge':
      return (
        <svg {...common}>
          {/* Upper converging line */}
          <line x1="20" y1="20" x2="200" y2="45" stroke={strokeMuted} strokeWidth={1.5} strokeDasharray="5,4" />
          {/* Lower converging line */}
          <line x1="20" y1="85" x2="200" y2="55" stroke={strokeMuted} strokeWidth={1.5} strokeDasharray="5,4" />
          {/* Price action inside wedge */}
          <polyline points="30,25 55,80 80,30 110,75 140,40 170,65 195,50" fill="none" stroke={stroke} strokeWidth={2} />
          {/* Breakout arrow */}
          <polyline points="195,50 250,18" fill="none" stroke={green} strokeWidth={2} />
          <polygon points="250,18 242,14 244,24" fill={green} />
          <text x="252" y="22" fill={green} fontSize="9" fontFamily="var(--font-mono)">BRK</text>
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <text x="140" y="55" fill={strokeMuted} fontSize="12" textAnchor="middle" fontFamily="var(--font-sans)">{pattern}</text>
        </svg>
      )
  }
}

// ── Highlight $TICKER mentions in tweet text ──────────────────
function highlightTickers(text: string): React.ReactNode {
  const parts = text.split(/(\$[A-Z]{1,10})/g)
  return parts.map((part, i) =>
    /^\$[A-Z]{1,10}$/.test(part) ? (
      <span key={i} style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{part}</span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  )
}

// ══════════════════════════════════════════════════════════════
// ANALYSIS HUB PAGE
// ══════════════════════════════════════════════════════════════

export default function AnalysisHubPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('setups')
  const [expandedArticle, setExpandedArticle] = useState<number | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<number | null>(0)
  const [showSummary, setShowSummary] = useState<Record<number, boolean>>({})
  const [analystFilter, setAnalystFilter] = useState('All Analysts')
  const [patternFilter, setPatternFilter] = useState('All Patterns')

  // ── Filtered setups ─────────────────────────────────────────
  const filteredSetups = MOCK_ANALYST_SETUPS.filter((s: AnalystSetup) => {
    const matchAnalyst = analystFilter === 'All Analysts' || s.analyst === analystFilter
    const matchPattern =
      patternFilter === 'All Patterns' ||
      (patternFilter === 'H&S' ? s.pattern === 'Head & Shoulders' : s.pattern === patternFilter)
    return matchAnalyst && matchPattern
  })

  return (
    <div style={{ padding: '24px' }}>
      {/* ── Page Header ────────────────────────────────────────── */}
      <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
        Analysis Hub
      </h1>
      <p style={{ fontSize: 12.5, color: 'var(--text-tertiary)', marginBottom: 20 }}>
        Curated setups, institutional research, and Crypto Twitter signal.
      </p>

      {/* ── Tab Bar ────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          gap: 0,
          borderBottom: '1px solid var(--border-default)',
          marginBottom: 20,
        }}
      >
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              padding: '8px 18px',
              fontSize: 12.5,
              fontWeight: activeTab === t.key ? 600 : 400,
              fontFamily: 'var(--font-sans)',
              color: activeTab === t.key ? 'var(--accent-primary)' : 'var(--text-tertiary)',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === t.key ? '2px solid var(--accent-primary)' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 120ms',
              marginBottom: -1,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* ANALYST SETUPS TAB                                       */}
      {/* ══════════════════════════════════════════════════════════ */}
      {activeTab === 'setups' && (
        <div>
          {/* Filter pills row 1 — Analysts */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
            {ANALYST_FILTERS.map((f) => (
              <FilterPill
                key={f}
                label={f}
                active={analystFilter === f}
                onClick={() => setAnalystFilter(f)}
              />
            ))}
          </div>

          {/* Filter pills row 2 — Patterns */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
            {PATTERN_FILTERS.map((f) => (
              <FilterPill
                key={f}
                label={f}
                active={patternFilter === f}
                onClick={() => setPatternFilter(f)}
              />
            ))}
          </div>

          {/* Setup Cards */}
          {filteredSetups.length === 0 && (
            <p style={{ fontSize: 13, color: 'var(--text-quaternary)', textAlign: 'center', padding: '32px 0' }}>
              No setups match the current filters.
            </p>
          )}

          {filteredSetups.map((setup: AnalystSetup, idx: number) => {
            const perf = ANALYST_PERFORMANCE[setup.analyst]
            const cumLast = perf?.cumPnl?.[perf.cumPnl.length - 1] ?? 0
            const pnlPositive = cumLast >= 0

            return (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-surface-2)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 10,
                  padding: 16,
                  marginBottom: 12,
                }}
              >
                {/* ── Header row ─────────────────────────────────── */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  {/* Avatar */}
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: setup.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', lineHeight: 1 }}>
                      {setup.initials}
                    </span>
                  </div>

                  {/* Name + Performance sparkline */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                        {setup.analyst}
                      </span>
                    </div>
                    {perf && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                        <Sparkline data={perf.cumPnl} width={48} height={16} positive={pnlPositive} />
                        <span
                          style={{
                            fontSize: 11,
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 600,
                            fontVariantNumeric: 'tabular-nums',
                            color: pnlPositive ? 'var(--data-positive)' : 'var(--data-negative)',
                          }}
                        >
                          {pnlPositive ? '+' : ''}{formatCompact(cumLast)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Badges */}
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                    {/* Token badge */}
                    <span
                      style={{
                        background: 'var(--bg-surface-3)',
                        padding: '2px 7px',
                        borderRadius: 4,
                        fontSize: 10,
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        color: 'var(--text-secondary)',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {setup.token}
                    </span>

                    {/* Pattern badge */}
                    <span
                      style={{
                        background: 'var(--accent-primary-bg)',
                        padding: '2px 7px',
                        borderRadius: 4,
                        fontSize: 10,
                        fontWeight: 600,
                        color: 'var(--accent-primary)',
                      }}
                    >
                      {setup.pattern}
                    </span>

                    {/* Direction badge */}
                    <span
                      style={{
                        padding: '2px 7px',
                        borderRadius: 4,
                        fontSize: 10,
                        fontWeight: 700,
                        background:
                          setup.direction === 'Bullish'
                            ? 'rgba(34, 197, 94, 0.10)'
                            : 'rgba(239, 68, 68, 0.10)',
                        color: setup.direction === 'Bullish' ? 'var(--data-positive)' : 'var(--data-negative)',
                      }}
                    >
                      {setup.direction}
                    </span>
                  </div>
                </div>

                {/* ── Chart Pattern SVG (compact) ──────────────── */}
                <div style={{ marginBottom: 10 }}>
                  <PatternSVG pattern={setup.pattern} />
                </div>

                {/* ── Analyst Commentary ─────────────────────────── */}
                <div
                  style={{
                    borderLeft: '2px solid var(--accent-primary-muted)',
                    paddingLeft: 12,
                    marginBottom: 12,
                  }}
                >
                  <p
                    style={{
                      fontSize: 12.5,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.65,
                      margin: 0,
                      fontStyle: 'italic',
                    }}
                  >
                    &ldquo;{setup.description}&rdquo;
                  </p>
                </div>

                {/* ── Footer: Entry / Target / Stop / TF + Insights */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--text-secondary)' }}>
                      Entry <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{setup.entry}</span>
                    </span>
                    <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--text-secondary)' }}>
                      Target <span style={{ fontWeight: 600, color: 'var(--data-positive)' }}>{setup.target}</span>
                    </span>
                    <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--text-secondary)' }}>
                      Stop <span style={{ fontWeight: 600, color: 'var(--data-negative)' }}>{setup.stop}</span>
                    </span>
                    <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--text-quaternary)' }}>
                      {setup.timeframe}
                    </span>
                  </div>
                  <InsightsButton context={{ symbol: setup.token, name: `${setup.analyst}: ${setup.pattern} on ${setup.token}`, extra: `Direction: ${setup.direction}. Entry: ${setup.entry}, Target: ${setup.target}, Stop: ${setup.stop}. ${setup.description}` }} />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* RESEARCH FEED TAB                                        */}
      {/* ══════════════════════════════════════════════════════════ */}
      {activeTab === 'research' && (
        <div style={{ display: 'flex', height: 'calc(100vh - 220px)', overflow: 'hidden', border: '1px solid var(--border-default)', borderRadius: 10 }}>
          {/* Left panel — article list */}
          <div style={{ width: 420, flexShrink: 0, borderRight: '1px solid var(--border-default)', overflowY: 'auto', background: 'var(--bg-surface-1)' }}>
            {MOCK_RESEARCH_FEED.map((article: ResearchArticle, idx: number) => {
              const isActive = selectedArticle === idx
              const brandColor = SOURCE_BRAND_COLORS[article.source] || 'var(--text-tertiary)'
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedArticle(idx)}
                  style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid var(--border-subtle)',
                    borderLeft: isActive ? '2px solid var(--accent-primary)' : '2px solid transparent',
                    background: isActive ? 'var(--bg-surface-2)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'background 100ms',
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'var(--bg-surface-3)' }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                >
                  {/* Meta line */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <SourceLogo source={article.source} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: brandColor }}>{article.source}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-quaternary)' }}>·</span>
                    <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{article.author}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-quaternary)' }}>·</span>
                    <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-quaternary)' }}>{article.time}</span>
                  </div>
                  {/* Title */}
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 4 }}>
                    {article.title}
                  </div>
                  {/* Token pills */}
                  <div style={{ display: 'flex', gap: 4 }}>
                    {article.tokens.slice(0, 3).map((t) => (
                      <span key={t} style={{ background: 'var(--bg-surface-3)', padding: '1px 6px', borderRadius: 3, fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-secondary)' }}>{t}</span>
                    ))}
                    {article.tokens.length > 3 && (
                      <span style={{ fontSize: 10, color: 'var(--text-quaternary)' }}>+{article.tokens.length - 3}</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right panel — article detail */}
          <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-base)', padding: '28px 32px' }}>
            {selectedArticle === null ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.4 }}>
                <span style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>Select an article to read</span>
              </div>
            ) : (() => {
              const article = MOCK_RESEARCH_FEED[selectedArticle]
              if (!article) return null
              const brandColor = SOURCE_BRAND_COLORS[article.source] || 'var(--text-tertiary)'
              const summaryShown = showSummary[selectedArticle]

              return (
                <div style={{ maxWidth: 680 }}>
                  {/* Source header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <SourceLogo source={article.source} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: brandColor }}>{article.source}</span>
                    <span style={{ fontSize: 13, color: 'var(--text-quaternary)' }}>·</span>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{article.author}</span>
                    <span style={{ fontSize: 13, color: 'var(--text-quaternary)' }}>·</span>
                    <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--text-quaternary)' }}>{article.time}</span>
                    <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', background: 'var(--bg-surface-2)', padding: '2px 8px', borderRadius: 4, color: 'var(--text-tertiary)' }}>{article.readTime}</span>
                  </div>

                  {/* Title */}
                  <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.3, margin: '0 0 16px' }}>
                    {article.title}
                  </h2>

                  {/* Token tags */}
                  <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
                    {article.tokens.map((t) => (
                      <span key={t} style={{ padding: '4px 10px', borderRadius: 5, background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)' }}>{t}</span>
                    ))}
                  </div>

                  {/* Article body */}
                  <div style={{ fontSize: 14.5, lineHeight: 1.8, color: 'var(--text-secondary)' }}>
                    {article.body.split('\n\n').map((paragraph, pi) => {
                      // Check if paragraph is a quote (starts with ")
                      const isQuote = paragraph.startsWith('"') || paragraph.startsWith('\u201c')
                      if (isQuote) {
                        return (
                          <blockquote key={pi} style={{ borderLeft: '3px solid var(--accent-primary-muted)', paddingLeft: 16, color: 'var(--text-primary)', fontStyle: 'italic', margin: '16px 0' }}>
                            {paragraph}
                          </blockquote>
                        )
                      }
                      return <p key={pi} style={{ marginBottom: 16 }}>{paragraph}</p>
                    })}
                  </div>

                  {/* Pelican Summarize section */}
                  <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border-default)' }}>
                    {!summaryShown ? (
                      <button
                        onClick={() => setShowSummary(prev => ({ ...prev, [selectedArticle]: true }))}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '10px 18px', borderRadius: 8,
                          background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)',
                          color: 'var(--accent-primary)', fontSize: 13, fontWeight: 500,
                          cursor: 'pointer', transition: 'all 120ms', fontFamily: 'var(--font-sans)',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-primary-bg)'; e.currentTarget.style.borderColor = 'var(--accent-primary-muted)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-surface-2)'; e.currentTarget.style.borderColor = 'var(--border-default)' }}
                      >
                        <img src="/images/pelican-logo.png" alt="" width={24} height={24} style={{ objectFit: 'contain' }} />
                        Summarize with Pelican
                      </button>
                    ) : (
                      <div style={{
                        background: 'var(--pelican-bg)', border: '1px solid var(--pelican-border)',
                        borderRadius: 8, padding: 16, position: 'relative', overflow: 'hidden',
                      }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, var(--pelican-gradient-start), var(--pelican-gradient-end))', opacity: 0.5 }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, marginTop: 4 }}>
                          <img src="/images/pelican-logo.png" alt="" width={26} height={26} style={{ objectFit: 'contain' }} />
                          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-primary)', letterSpacing: '0.06em' }}>PELICAN SUMMARY</span>
                        </div>
                        <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text-secondary)', margin: 0 }}>
                          {article.pelicanSummary}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* X FEED TAB                                               */}
      {/* ══════════════════════════════════════════════════════════ */}
      {activeTab === 'xfeed' && (
        <div>
          {MOCK_X_FEED.map((post: XPost, idx: number) => {
            const firstLetter = post.displayName.charAt(0).toUpperCase()

            return (
              <div
                key={idx}
                style={{
                  borderBottom: '1px solid var(--border-subtle, rgba(255,255,255,0.06))',
                  padding: '12px 0',
                }}
              >
                {/* ── Top row: avatar + name + handle + verified + time + link */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  {/* Avatar */}
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: `hsl(${post.profileHue}, 35%, 25%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: 11, fontWeight: 700, color: `hsl(${post.profileHue}, 50%, 70%)`, lineHeight: 1 }}>
                      {firstLetter}
                    </span>
                  </div>

                  {/* Name + handle + verified */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)' }}>
                      {post.displayName}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                      @{post.handle}
                    </span>
                    {post.verified && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#1D9BF0" style={{ flexShrink: 0 }}>
                        <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81C14.67 2.63 13.43 1.75 12 1.75s-2.67.88-3.34 2.19c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91C2.63 9.33 1.75 10.57 1.75 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.27 4.8-5.23 1.47 1.36-6.2 6.76z" />
                      </svg>
                    )}
                    <span style={{ fontSize: 11, color: 'var(--text-quaternary)' }}>·</span>
                    <span
                      style={{
                        fontSize: 11,
                        fontFamily: 'var(--font-mono)',
                        fontVariantNumeric: 'tabular-nums',
                        color: 'var(--text-quaternary)',
                      }}
                    >
                      {post.time}
                    </span>
                  </div>

                  {/* Link to tweet */}
                  <a
                    href={post.tweetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: 'var(--text-quaternary)',
                      fontSize: 12,
                      textDecoration: 'none',
                      flexShrink: 0,
                      opacity: 0.6,
                      transition: 'opacity 100ms',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.6' }}
                    title="Open on X"
                  >
                    ↗
                  </a>
                </div>

                {/* ── Tweet text ──────────────────────────────────── */}
                <p
                  style={{
                    fontSize: 12.5,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.45,
                    marginLeft: 36,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical' as const,
                    overflow: 'hidden',
                  }}
                >
                  {highlightTickers(post.text)}
                </p>

                {/* ── Engagement ─────────────────────────────────── */}
                <div
                  style={{
                    display: 'flex',
                    gap: 16,
                    marginLeft: 36,
                    marginTop: 6,
                    fontSize: 10,
                    fontFamily: 'var(--font-mono)',
                    fontVariantNumeric: 'tabular-nums',
                    color: 'var(--text-quaternary)',
                    opacity: 0.6,
                  }}
                >
                  <span>{'\uD83D\uDCAC'} {post.replies.toLocaleString()}</span>
                  <span>{'\uD83D\uDD04'} {post.retweets.toLocaleString()}</span>
                  <span>{'\u2764\uFE0F'} {post.likes.toLocaleString()}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
