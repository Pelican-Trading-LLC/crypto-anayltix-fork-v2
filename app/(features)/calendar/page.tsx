'use client'

import { useState } from 'react'
import { MOCK_CALENDAR, EVENT_COLORS, ASSET_COLORS } from '@/lib/crypto-mock-data'
import { Bird } from '@phosphor-icons/react'
import { usePelicanPanelContext } from '@/providers/pelican-panel-provider'

const IMPACT_COLORS: Record<string, string> = {
  high: '#E06565',
  medium: '#D4A042',
  low: '#6B7280',
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  token_unlock: 'Token Unlock',
  governance: 'Governance',
  fed_meeting: 'Fed Meeting',
  earnings: 'Earnings',
  expiration: 'Expiration',
  halving: 'Halving',
  upgrade: 'Upgrade',
}

// March 2026 starts on Sunday (day 0), has 31 days
const YEAR = 2026
const MONTH = 2 // 0-indexed: March
const DAYS_IN_MONTH = 31
const FIRST_DAY_OF_WEEK = new Date(YEAR, MONTH, 1).getDay() // 0 = Sun

// Convert Sunday-start (0-6) to Monday-start offset (0-6)
const MONDAY_OFFSET = FIRST_DAY_OF_WEEK === 0 ? 6 : FIRST_DAY_OF_WEEK - 1

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function getEventsForDay(day: number) {
  const dateStr = `2026-03-${String(day).padStart(2, '0')}`
  return MOCK_CALENDAR.filter((e) => e.date === dateStr)
}

export default function CalendarPage() {
  const { openWithPrompt } = usePelicanPanelContext()
  const [selectedDate, setSelectedDate] = useState<number | null>(null)

  const filteredEvents = selectedDate
    ? MOCK_CALENDAR.filter(
        (e) => e.date === `2026-03-${String(selectedDate).padStart(2, '0')}`
      )
    : MOCK_CALENDAR

  const totalCells = MONDAY_OFFSET + DAYS_IN_MONTH
  const rows = Math.ceil(totalCells / 7)

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">
          Crypto Calendar
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          March 2026 &mdash; Key events, unlocks, and macro catalysts
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── Left Panel: Month Grid ── */}
        <div className="w-full lg:w-[55%]">
          <div
            className="rounded-xl border border-[rgba(255,255,255,0.06)] p-5"
            style={{ background: 'var(--bg-surface, #111118)' }}
          >
            {/* Month header */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[15px] font-semibold text-[var(--text-primary)]">
                March 2026
              </span>
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate(null)}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                >
                  Clear filter
                </button>
              )}
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {WEEKDAYS.map((d) => (
                <div
                  key={d}
                  className="text-center text-[11px] uppercase tracking-wider font-medium text-[var(--text-muted)] py-1"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: rows * 7 }).map((_, i) => {
                const day = i - MONDAY_OFFSET + 1
                const isValidDay = day >= 1 && day <= DAYS_IN_MONTH
                const events = isValidDay ? getEventsForDay(day) : []
                const isSelected = selectedDate === day
                const isToday = day === 8 // March 8, 2026

                if (!isValidDay) {
                  return <div key={i} className="h-14" />
                }

                return (
                  <button
                    key={i}
                    onClick={() =>
                      setSelectedDate(isSelected ? null : day)
                    }
                    className="h-14 rounded-lg flex flex-col items-center justify-center gap-1 transition-all duration-150 hover:bg-[var(--bg-elevated,#16161f)] cursor-pointer"
                    style={{
                      background: isSelected
                        ? 'rgba(139,92,246,0.15)'
                        : undefined,
                      border: isSelected
                        ? '1px solid rgba(139,92,246,0.3)'
                        : isToday
                        ? '1px solid rgba(255,255,255,0.15)'
                        : '1px solid transparent',
                    }}
                  >
                    <span
                      className={`text-[13px] font-mono tabular-nums ${
                        isToday
                          ? 'text-[var(--accent-primary,#4A90C4)] font-semibold'
                          : 'text-[var(--text-secondary)]'
                      }`}
                    >
                      {day}
                    </span>
                    {events.length > 0 && (
                      <div className="flex gap-[3px]">
                        {events.map((ev) => (
                          <span
                            key={ev.id}
                            className="block rounded-full"
                            style={{
                              width: 5,
                              height: 5,
                              backgroundColor:
                                EVENT_COLORS[ev.type] || '#6B7280',
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Legend */}
            <div className="mt-5 pt-4 border-t border-[rgba(255,255,255,0.06)] flex flex-wrap gap-x-4 gap-y-2">
              {Object.entries(EVENT_COLORS).map(([type, color]) => (
                <div key={type} className="flex items-center gap-1.5">
                  <span
                    className="block rounded-full"
                    style={{
                      width: 7,
                      height: 7,
                      backgroundColor: color,
                    }}
                  />
                  <span className="text-[11px] text-[var(--text-muted)] capitalize">
                    {EVENT_TYPE_LABELS[type] || type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Panel: Event Cards ── */}
        <div className="w-full lg:w-[45%] flex flex-col gap-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-[var(--text-secondary)]">
              {selectedDate
                ? `Events on March ${selectedDate}`
                : 'All upcoming events'}
            </span>
            <span className="text-xs font-mono tabular-nums text-[var(--text-muted)]">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
            </span>
          </div>

          {filteredEvents.length === 0 ? (
            <div
              className="rounded-xl border border-[rgba(255,255,255,0.06)] p-8 flex flex-col items-center justify-center text-center"
              style={{ background: 'var(--bg-surface, #111118)' }}
            >
              <p className="text-sm text-[var(--text-muted)]">
                No events on this day.
              </p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-xl border border-[rgba(255,255,255,0.06)] p-4 transition-all duration-150 hover:border-[rgba(255,255,255,0.15)]"
                style={{
                  background: 'var(--bg-surface, #111118)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {/* Top row: badges */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {/* Type badge */}
                  <span
                    className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${EVENT_COLORS[event.type] || '#6B7280'}20`,
                      color: EVENT_COLORS[event.type] || '#6B7280',
                    }}
                  >
                    {EVENT_TYPE_LABELS[event.type] || event.type}
                  </span>

                  {/* Impact badge */}
                  <span
                    className="text-[11px] font-medium px-2 py-0.5 rounded-full uppercase"
                    style={{
                      backgroundColor: `${IMPACT_COLORS[event.impact]}20`,
                      color: IMPACT_COLORS[event.impact],
                    }}
                  >
                    {event.impact}
                  </span>

                  {/* Asset pill */}
                  <span
                    className="text-[11px] font-semibold font-mono px-2 py-0.5 rounded-full ml-auto"
                    style={{
                      backgroundColor: `${ASSET_COLORS[event.asset] || '#6B7280'}20`,
                      color: ASSET_COLORS[event.asset] || '#6B7280',
                    }}
                  >
                    {event.asset}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-[14px] font-semibold text-[var(--text-primary)] mb-1">
                  {event.title}
                </h3>

                {/* Date */}
                <p className="text-[12px] font-mono tabular-nums text-[var(--text-muted)] mb-2">
                  {new Date(event.date + 'T00:00:00').toLocaleDateString(
                    'en-US',
                    {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    }
                  )}
                </p>

                {/* Description */}
                <p className="text-[13px] text-[var(--text-secondary)] mb-3 leading-relaxed">
                  {event.description}
                </p>

                {/* Ask Pelican button */}
                <button
                  onClick={() => openWithPrompt(event.asset, {
                    visibleMessage: `Tell me about ${event.title}`,
                    fullPrompt: `[CALENDAR EVENT]\nEvent: ${event.title}\nType: ${event.type}\nDate: ${event.date}\nAsset: ${event.asset}\nImpact: ${event.impact}\nDescription: ${event.description}\n\nTell me about this event and how it might impact ${event.asset} and the broader crypto market.`,
                  }, 'calendar')}
                  className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--accent-primary,#4A90C4)] hover:text-[var(--accent-hover,#5BA3D9)] transition-colors cursor-pointer"
                >
                  <Bird size={16} weight="bold" />
                  Ask Pelican about this event
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
