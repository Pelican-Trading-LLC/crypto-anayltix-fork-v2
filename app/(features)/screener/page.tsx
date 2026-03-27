'use client'

import { useState } from 'react'
import { Bell } from '@phosphor-icons/react'
import { FilterPill, InsightsButton } from '@/components/shared'
import { MOCK_PREDICTION_CARDS, type PredictionCard } from '@/lib/crypto-mock-data'

type Category = 'all' | 'crypto' | 'macro' | 'stocks' | 'regulatory' | 'geopolitical'

const CATEGORIES: { label: string; value: Category }[] = [
  { label: 'All', value: 'all' },
  { label: 'Crypto', value: 'crypto' },
  { label: 'Macro / Fed', value: 'macro' },
  { label: 'Stocks', value: 'stocks' },
  { label: 'Regulatory', value: 'regulatory' },
  { label: 'Geopolitical', value: 'geopolitical' },
]

/* ── Chart path generator ────────────────────────────────────── */

function generateChartPath(index: number, width: number, height: number) {
  const points = 8
  const stepX = width / (points - 1)
  const values: number[] = []
  let seed = index * 137
  for (let i = 0; i < points; i++) {
    seed = (seed * 16807) % 2147483647
    values.push(0.2 + ((seed % 1000) / 1000) * 0.6)
  }

  const pad = 6
  const yRange = height - pad * 2
  const coords = values.map((v, i) => ({
    x: i * stepX,
    y: pad + yRange * (1 - v),
  }))

  // Build cubic bezier path
  if (coords.length === 0) return { linePath: '', areaPath: '', lastPoint: { x: 0, y: 0 } }
  const first = coords[0]!
  let d = `M ${first.x} ${first.y}`
  for (let i = 1; i < coords.length; i++) {
    const prev = coords[i - 1]!
    const curr = coords[i]!
    const cpx1 = prev.x + stepX * 0.4
    const cpy1 = prev.y
    const cpx2 = curr.x - stepX * 0.4
    const cpy2 = curr.y
    d += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${curr.x} ${curr.y}`
  }

  const last = coords[coords.length - 1]!
  const areaD = `${d} L ${last.x} ${height} L ${first.x} ${height} Z`

  return { linePath: d, areaPath: areaD, lastPoint: last }
}

/* ── Date labels for chart ───────────────────────────────────── */

const DATE_LABELS = ['Jan', 'Feb', 'Mar', 'Now']

/* ── Prediction Card component ───────────────────────────────── */

function PredictionCardItem({ card, index }: { card: PredictionCard; index: number }) {
  const chartW = 280
  const chartH = 72
  const { linePath, areaPath, lastPoint } = generateChartPath(index, chartW, chartH)

  return (
    <div
      style={{
        background: 'var(--bg-surface-2)',
        border: '1px solid var(--border-default)',
        borderRadius: 10,
        padding: 18,
        transition: 'border-color 200ms, box-shadow 200ms',
        borderLeft: card.isContrarian ? '2px solid var(--accent-violet)' : undefined,
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-strong)'
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-default)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Contrarian badge */}
      {card.isContrarian && (
        <div
          style={{
            fontSize: 9,
            fontWeight: 700,
            color: 'var(--accent-violet)',
            letterSpacing: '0.5px',
            marginBottom: 8,
          }}
        >
          ⚡ CONTRARIAN
        </div>
      )}

      {/* Icon circle + question */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
        <div
          style={{
            width: 28,
            height: 28,
            minWidth: 28,
            borderRadius: '50%',
            background: 'var(--bg-surface-3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--text-secondary)',
          }}
        >
          {card.icon}
        </div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--text-primary)',
            lineHeight: 1.4,
          }}
        >
          {card.question}
        </div>
      </div>

      {/* Outcome rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
        {card.outcomes.map((outcome, oi) => {
          const probColor =
            outcome.probability > 65
              ? 'var(--data-positive)'
              : outcome.probability < 35
                ? 'var(--data-negative)'
                : 'var(--text-primary)'

          return (
            <div
              key={oi}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-primary)',
                  flex: '0 0 auto',
                }}
              >
                {outcome.label}
              </span>

              <span
                style={{
                  fontSize: 14,
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: probColor,
                  fontVariantNumeric: 'tabular-nums',
                  flex: '0 0 auto',
                }}
              >
                {outcome.probability}%
              </span>

              <div style={{ display: 'flex', gap: 4, flex: '0 0 auto' }}>
                <span
                  style={{
                    height: 22,
                    padding: '0 8px',
                    fontSize: 10,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    border: '1px solid var(--data-positive)',
                    color: 'var(--data-positive)',
                    background: 'transparent',
                    borderRadius: 4,
                    display: 'inline-flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  Yes
                </span>
                <span
                  style={{
                    height: 22,
                    padding: '0 8px',
                    fontSize: 10,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    border: '1px solid var(--data-negative)',
                    color: 'var(--data-negative)',
                    background: 'transparent',
                    borderRadius: 4,
                    display: 'inline-flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  No
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Probability chart */}
      <div style={{ marginBottom: 10 }}>
        <svg
          width="100%"
          height={chartH}
          viewBox={`0 0 ${chartW} ${chartH}`}
          preserveAspectRatio="none"
          style={{ display: 'block' }}
        >
          <defs>
            <linearGradient id={`grad-${index}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity={0.15} />
              <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <path d={areaPath} fill={`url(#grad-${index})`} />
          <path
            d={linePath}
            fill="none"
            stroke="var(--accent-primary)"
            strokeWidth={2}
            strokeLinecap="round"
          />
          <circle
            cx={lastPoint.x}
            cy={lastPoint.y}
            r={3}
            fill="var(--accent-primary)"
            stroke="var(--bg-surface-2)"
            strokeWidth={2}
          />
          {/* Date labels */}
          {DATE_LABELS.map((label, li) => (
            <text
              key={li}
              x={(li / (DATE_LABELS.length - 1)) * chartW}
              y={chartH - 2}
              fill="var(--text-quaternary)"
              fontSize={9}
              fontFamily="var(--font-mono)"
              textAnchor={li === 0 ? 'start' : li === DATE_LABELS.length - 1 ? 'end' : 'middle'}
            >
              {label}
            </text>
          ))}
        </svg>
      </div>

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: 'var(--text-quaternary)',
            fontFamily: 'var(--font-mono)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {card.volume} vol &middot; {card.resolution}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <InsightsButton context={{ name: card.question, extra: `Prediction market: ${card.outcomes.map(o => `${o.label}: ${o.probability}%`).join(', ')}. Volume: ${card.volume}. Resolution: ${card.resolution}.` }} />
          <button
            onClick={() => alert(`Alert created for: ${card.question}`)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              color: 'var(--text-tertiary)',
              transition: 'color 150ms',
              display: 'flex',
              alignItems: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--accent-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-tertiary)'
            }}
          >
            <Bell size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────────────── */

export default function PredictionRoomPage() {
  const [categoryFilter, setCategoryFilter] = useState<Category>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = MOCK_PREDICTION_CARDS.filter((card) => {
    const matchesCategory = categoryFilter === 'all' || card.category === categoryFilter
    const matchesSearch =
      !searchQuery || card.question.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <h1
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: 0,
          }}
        >
          Prediction Room
        </h1>
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: '#fff',
            background: 'var(--accent-violet)',
            padding: '2px 8px',
            borderRadius: 4,
            letterSpacing: '0.3px',
          }}
        >
          via Polymarket
        </span>
      </div>

      {/* Search bar */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search a Polymarket question or paste URL..."
          style={{
            width: '100%',
            height: 44,
            background: 'var(--bg-surface-2)',
            border: '1px solid var(--border-default)',
            borderRadius: 8,
            padding: '0 16px',
            fontSize: 13,
            color: 'var(--text-primary)',
            outline: 'none',
            transition: 'border-color 150ms',
            fontFamily: 'var(--font-sans)',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-strong)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-default)'
          }}
        />
      </div>

      {/* Category filters */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {CATEGORIES.map((cat) => (
          <FilterPill
            key={cat.value}
            label={cat.label}
            active={categoryFilter === cat.value}
            onClick={() => setCategoryFilter(cat.value)}
          />
        ))}
      </div>

      {/* Card grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 14,
        }}
        className="prediction-grid"
      >
        {filtered.map((card, i) => (
          <PredictionCardItem key={card.id} card={card} index={i} />
        ))}
      </div>

      {/* Responsive grid styles */}
      <style jsx>{`
        @media (max-width: 1024px) {
          .prediction-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .prediction-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
