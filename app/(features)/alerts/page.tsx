'use client'

import { useState, useMemo } from 'react'
import { FilterPill } from '@/components/shared'
import { MOCK_SMART_ALERTS as MOCK_ALERTS, type AlertRow } from '@/lib/crypto-mock-data'

/* ── type badge colors ─────────────────────────────────────── */
const TYPE_COLORS: Record<AlertRow['type'], { color: string; bg: string }> = {
  Price:       { color: 'var(--data-warning)',   bg: 'rgba(212,160,66,0.10)'  },
  'On-Chain':  { color: 'var(--accent-primary)', bg: 'rgba(74,144,196,0.10)'  },
  Technical:   { color: '#60A5FA',               bg: 'rgba(96,165,250,0.10)'  },
  Prediction:  { color: 'var(--accent-violet)',  bg: 'rgba(139,127,199,0.10)' },
  Convergence: { color: 'var(--data-positive)',  bg: 'rgba(62,189,140,0.10)'  },
}

const STATUS_FILTERS  = ['All', 'Armed', 'Triggered'] as const
const TYPE_FILTERS    = ['Price', 'On-Chain', 'Technical', 'Prediction', 'Convergence'] as const

const TEMPLATE_PILLS = [
  'Price breaks level',
  'Whale accumulation',
  'Prediction market shift',
  'EMA crossover',
  'Analyst posts setup',
]

export default function AlertsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [typeFilter, setTypeFilter]     = useState<string>('All')
  const [builderInput, setBuilderInput] = useState('')

  const filtered = useMemo(() => {
    return MOCK_ALERTS.filter((a: AlertRow) => {
      if (statusFilter !== 'All' && a.status !== statusFilter) return false
      if (typeFilter !== 'All' && a.type !== typeFilter) return false
      return true
    })
  }, [statusFilter, typeFilter])

  const triggered = useMemo(
    () => MOCK_ALERTS.filter((a: AlertRow) => a.status === 'Triggered'),
    [],
  )

  return (
    <div style={{ padding: '24px 28px', minHeight: '100vh', background: 'var(--bg-base)' }}>

      {/* ── Pelican Alert Builder — Hero ─────────────────────── */}
      <div
        style={{
          background: 'linear-gradient(180deg, var(--bg-surface-2) 0%, var(--bg-surface-1) 100%)',
          border: '1px solid var(--border-default)',
          borderRadius: 16,
          padding: '36px 32px 28px',
          marginBottom: 28,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
        }}
      >
        {/* Accent gradient line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: 'linear-gradient(90deg, transparent 5%, var(--accent-primary) 30%, var(--accent-violet) 70%, transparent 95%)',
            opacity: 0.5,
          }}
        />

        {/* Centered pelican logo + title */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
          <img
            src="/images/pelican-logo.png"
            alt="Pelican AI"
            width={56}
            height={56}
            style={{ objectFit: 'contain', marginBottom: 12 }}
          />
          <h1 style={{
            fontSize: 20,
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            margin: 0,
          }}>
            Smart Alerts
          </h1>
          <p style={{
            fontSize: 13,
            color: 'var(--text-tertiary)',
            margin: '6px 0 0',
            textAlign: 'center',
          }}>
            AI-powered alerts across price, on-chain flows, prediction markets, and technical signals
          </p>
        </div>

        {/* Chat-style input */}
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            gap: 0,
            background: 'var(--bg-base)',
            border: '1px solid var(--border-default)',
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transition: 'border-color 150ms, box-shadow 150ms',
          }}>
            <input
              type="text"
              value={builderInput}
              onChange={(e) => setBuilderInput(e.target.value)}
              placeholder="Alert me when BTC breaks $85K and 2+ smart money wallets are buying..."
              style={{
                flex: 1,
                height: 52,
                background: 'transparent',
                border: 'none',
                padding: '0 20px',
                fontSize: 14,
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
                outline: 'none',
              }}
            />
            <button
              style={{
                height: 52,
                padding: '0 28px',
                background: 'var(--accent-primary)',
                color: '#fff',
                fontWeight: 600,
                fontSize: 14,
                fontFamily: 'var(--font-sans)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'background 120ms',
              }}
            >
              <img src="/images/pelican-logo.png" alt="" width={18} height={18} style={{ objectFit: 'contain', filter: 'brightness(10)' }} />
              Create
            </button>
          </div>

          {/* Template pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 14 }}>
            {TEMPLATE_PILLS.map((t) => (
              <button
                key={t}
                onClick={() => setBuilderInput(t === 'Price breaks level' ? 'Alert me when BTC breaks above $85,000' :
                  t === 'Whale accumulation' ? 'Alert me when smart money wallets accumulate >$5M in any token' :
                  t === 'Prediction market shift' ? 'Alert me when BTC $90K probability drops below 60%' :
                  t === 'EMA crossover' ? 'Alert me when SOL 50 EMA crosses above 200 EMA' :
                  'Alert me when any analyst posts a new setup on Token Analytix')}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-tertiary)',
                  fontSize: 11.5,
                  fontFamily: 'var(--font-sans)',
                  height: 30,
                  padding: '0 14px',
                  borderRadius: 20,
                  cursor: 'pointer',
                  transition: 'all 120ms',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary-muted)'; e.currentTarget.style.color = 'var(--accent-primary)'; e.currentTarget.style.background = 'var(--accent-primary-bg)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filter Pills ──────────────────────────────────────── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16, alignItems: 'center' }}>
        {STATUS_FILTERS.map((f) => (
          <FilterPill
            key={`s-${f}`}
            label={f}
            active={statusFilter === f}
            onClick={() => { setStatusFilter(f); if (f === 'All') setTypeFilter('All') }}
          />
        ))}
        <span style={{ width: 1, height: 18, background: 'var(--border-default)', margin: '0 6px', flexShrink: 0 }} />
        {TYPE_FILTERS.map((f) => (
          <FilterPill
            key={`t-${f}`}
            label={f}
            active={typeFilter === f}
            onClick={() => setTypeFilter(typeFilter === f ? 'All' : f)}
          />
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-quaternary)' }}>
          {filtered.length} alert{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ── Alert Table ───────────────────────────────────────── */}
      <div style={{ border: '1px solid var(--border-default)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        {/* header row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: 38,
            background: 'var(--bg-surface-2)',
            borderBottom: '1px solid var(--border-default)',
            padding: '0 16px',
          }}
        >
          <span style={{ ...thStyle, width: 72 }}>Token</span>
          <span style={{ ...thStyle, width: 108 }}>Type</span>
          <span style={{ ...thStyle, flex: 1 }}>Condition</span>
          <span style={{ ...thStyle, width: 92, textAlign: 'center' }}>Status</span>
          <span style={{ ...thStyle, width: 76, textAlign: 'center' }}>Severity</span>
          <span style={{ ...thStyle, width: 84, textAlign: 'right' }}>Created</span>
        </div>

        {/* data rows */}
        {filtered.map((alert: AlertRow, i: number) => {
          const tc = TYPE_COLORS[alert.type]
          const isTriggered = alert.status === 'Triggered'

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                height: 44,
                padding: '0 16px',
                borderBottom: '1px solid var(--border-subtle)',
                borderLeft: isTriggered ? '3px solid var(--data-positive)' : '3px solid transparent',
                background: isTriggered ? 'rgba(62,189,140,0.03)' : 'transparent',
                transition: 'background 120ms',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = isTriggered ? 'rgba(62,189,140,0.06)' : 'var(--bg-surface-3)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = isTriggered ? 'rgba(62,189,140,0.03)' : 'transparent' }}
            >
              {/* Token */}
              <span style={{ width: 72, fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>
                {alert.token}
              </span>

              {/* Type badge */}
              <span style={{ width: 108 }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    height: 24,
                    padding: '0 10px',
                    borderRadius: 5,
                    fontSize: 11,
                    fontWeight: 600,
                    color: tc.color,
                    background: tc.bg,
                  }}
                >
                  {alert.type}
                </span>
              </span>

              {/* Condition */}
              <span style={{ flex: 1, fontSize: 12.5, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 12 }}>
                {alert.condition}
              </span>

              {/* Status */}
              <span
                style={{
                  width: 92,
                  textAlign: 'center',
                  fontSize: 11.5,
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono)',
                  color: isTriggered ? 'var(--data-positive)' : 'var(--text-tertiary)',
                }}
              >
                {isTriggered ? '● Triggered' : '○ Armed'}
              </span>

              {/* Severity */}
              <span
                style={{
                  width: 76,
                  textAlign: 'center',
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono)',
                  color:
                    alert.severity === 'High'   ? 'var(--data-negative)' :
                    alert.severity === 'Medium'  ? 'var(--data-warning)' :
                    'var(--text-quaternary)',
                }}
              >
                {alert.severity}
              </span>

              {/* Created */}
              <span style={{ width: 84, textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-quaternary)' }}>
                {alert.created}
              </span>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-quaternary)', fontSize: 13 }}>
            No alerts match the current filters
          </div>
        )}
      </div>

      {/* ── Recently Triggered ────────────────────────────────── */}
      {triggered.length > 0 && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 32, marginBottom: 16 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--data-positive)', boxShadow: '0 0 6px var(--data-positive)' }} />
            <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Recently Triggered
            </h2>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-quaternary)', marginLeft: 4 }}>
              {triggered.length} alert{triggered.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {triggered.map((alert: AlertRow, i: number) => (
              <div
                key={`trig-${i}`}
                style={{
                  background: 'var(--bg-surface-2)',
                  border: '1px solid var(--border-default)',
                  borderLeft: '3px solid var(--data-positive)',
                  borderRadius: 10,
                  padding: '16px 20px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                }}
              >
                {/* card header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', flex: 1, lineHeight: 1.4 }}>
                    {alert.condition}
                  </span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      height: 24,
                      padding: '0 10px',
                      borderRadius: 5,
                      fontSize: 10,
                      fontWeight: 600,
                      color: 'var(--data-positive)',
                      background: 'rgba(62,189,140,0.10)',
                    }}
                  >
                    ● Triggered
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-quaternary)' }}>
                    {alert.triggeredAt}
                  </span>
                </div>

                {/* pelican synthesis box */}
                {alert.postTriggerAnalysis && (
                  <div
                    style={{
                      background: 'var(--pelican-bg)',
                      border: '1px solid var(--pelican-border)',
                      borderRadius: 10,
                      padding: '14px 16px',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* gradient top */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, var(--pelican-gradient-start), var(--pelican-gradient-end))', opacity: 0.5 }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, marginTop: 2 }}>
                      <img src="/images/pelican-logo.png" alt="" width={24} height={24} style={{ objectFit: 'contain' }} />
                      <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-primary)', letterSpacing: '0.06em' }}>
                        POST-TRIGGER ANALYSIS
                      </span>
                    </div>

                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                      {alert.postTriggerAnalysis}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/* ── shared header cell style ──────────────────────────────── */
const thStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.06em',
  color: 'var(--text-quaternary)',
}
