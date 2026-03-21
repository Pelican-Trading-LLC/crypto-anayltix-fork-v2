'use client'

import { useState } from 'react'
import { CALENDAR_EVENTS, type CalendarEvent } from '@/lib/crypto-mock-data'
import { Bird } from '@phosphor-icons/react'

const FILTER_TYPES = ['All', 'Macro', 'Crypto', 'Prediction', 'Tokenization', 'Webinar'] as const
type FilterType = (typeof FILTER_TYPES)[number]

const TYPE_COLORS: Record<CalendarEvent['type'], { bg: string; text: string }> = {
  macro: { bg: 'rgba(239,68,68,0.12)', text: '#ef4444' },
  crypto: { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b' },
  prediction: { bg: 'rgba(139,92,246,0.12)', text: '#8b5cf6' },
  tokenization: { bg: 'rgba(34,197,94,0.12)', text: '#22c55e' },
  webinar: { bg: 'rgba(6,182,212,0.12)', text: '#06b6d4' },
}

const IMPACT_STYLES: Record<string, { bg: string; text: string }> = {
  High: { bg: 'rgba(239,68,68,0.12)', text: '#ef4444' },
  Medium: { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b' },
  Low: { bg: 'rgba(107,114,128,0.12)', text: '#6b7280' },
}

function formatDate(iso: string): { month: string; day: string } {
  const d = new Date(iso + 'T00:00:00')
  const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase()
  const day = String(d.getDate())
  return { month, day }
}

export default function CalendarPage() {
  const [filter, setFilter] = useState<FilterType>('All')

  const filtered =
    filter === 'All'
      ? CALENDAR_EVENTS
      : CALENDAR_EVENTS.filter(
          (e) => e.type === filter.toLowerCase()
        )

  return (
    <div className="p-6 max-w-[900px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
          Calendar
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Macro events, crypto catalysts, prediction market expiries
        </p>
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2 mb-8">
        {FILTER_TYPES.map((t) => {
          const active = filter === t
          return (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer"
              style={{
                background: active ? 'rgba(6,182,212,0.15)' : 'transparent',
                color: active ? '#06b6d4' : 'var(--text-muted)',
                border: active
                  ? '1px solid rgba(6,182,212,0.3)'
                  : '1px solid var(--border-subtle)',
              }}
            >
              {t}
            </button>
          )
        })}
      </div>

      {/* Timeline */}
      <div className="relative">
        {filtered.map((event, i) => {
          const { month, day } = formatDate(event.date)
          const typeColor = TYPE_COLORS[event.type]
          const impactStyle = event.impact ? IMPACT_STYLES[event.impact] : null
          const isLast = i === filtered.length - 1

          return (
            <div key={`${event.date}-${event.title}`} className="flex gap-5 relative">
              {/* Timeline connector line */}
              {!isLast && (
                <div
                  className="absolute left-[40px] top-[60px] bottom-0 w-px"
                  style={{ background: 'var(--border-subtle)' }}
                />
              )}

              {/* Date block */}
              <div className="flex-shrink-0 w-[80px] pt-4 text-center">
                <div className="font-mono font-bold text-lg text-[var(--text-primary)]">
                  {month} {day}
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                  {event.dayOfWeek}
                </div>
              </div>

              {/* Event card */}
              <div
                className="flex-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 mb-4 transition-all duration-150 hover:border-[var(--border-hover)]"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {/* Top row: type tag + impact badge */}
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span
                    className="text-[11px] font-medium px-2 py-0.5 rounded-full capitalize"
                    style={{
                      backgroundColor: typeColor.bg,
                      color: typeColor.text,
                    }}
                  >
                    {event.type}
                  </span>

                  {impactStyle && (
                    <span
                      className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: impactStyle.bg,
                        color: impactStyle.text,
                      }}
                    >
                      {event.impact}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-semibold text-[var(--text-primary)] mb-1">
                  {event.title}
                </h3>

                {/* Time */}
                <p className="font-mono text-xs text-[var(--text-muted)] mb-1">
                  {event.time}
                </p>

                {/* Pelican pre-brief */}
                {event.pelicanBrief && (
                  <div
                    className="mt-2 pl-3"
                    style={{
                      background: 'rgba(6,182,212,0.04)',
                      borderLeft: '2px solid rgba(6,182,212,0.3)',
                    }}
                  >
                    <div className="flex items-center gap-1 mb-0.5">
                      <Bird size={12} weight="bold" className="text-[#06b6d4] opacity-60" />
                      <span className="text-[10px] font-medium text-[#06b6d4] opacity-60 uppercase tracking-wider">
                        Pelican Brief
                      </span>
                    </div>
                    <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed italic">
                      {event.pelicanBrief}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-[var(--text-muted)]">
              No events match this filter.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
