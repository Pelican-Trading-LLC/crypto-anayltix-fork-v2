"use client"

import React, { useState, useMemo } from 'react'
import { FilterPill } from '@/components/v2/filter-pill'
import { PredictionCard } from '@/components/v2/predictions/prediction-card'
import { V2_PREDICTION_CARDS } from '@/lib/crypto-mock-data'

const CATEGORIES = ['All', 'Crypto', 'Macro / Fed', 'Stocks', 'Regulatory', 'Geopolitical'] as const
type Category = typeof CATEGORIES[number]

const CATEGORY_MAP: Record<Category, string | null> = {
  'All': null,
  'Crypto': 'crypto',
  'Macro / Fed': 'macro',
  'Stocks': 'stocks',
  'Regulatory': 'regulatory',
  'Geopolitical': 'geopolitical',
}

const TICKER_TABS = ['BTC', 'ETH', 'SOL', 'AAPL', 'NVDA', 'SPX', 'TSLA', 'GOOGL', 'Fed Rates', 'More'] as const

export default function PredictionsPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [activeTicker, setActiveTicker] = useState<string | null>(null)
  const [searchFocused, setSearchFocused] = useState(false)

  const filtered = useMemo(() => {
    let cards = V2_PREDICTION_CARDS

    // Category filter
    const catKey = CATEGORY_MAP[activeCategory]
    if (catKey) {
      cards = cards.filter((c) => c.category === catKey)
    }

    // Ticker filter
    if (activeTicker && activeTicker !== 'More') {
      if (activeTicker === 'Fed Rates') {
        cards = cards.filter(
          (c) => c.category === 'macro' || c.question.toLowerCase().includes('fed')
        )
      } else {
        cards = cards.filter((c) => c.tickers.includes(activeTicker))
      }
    }

    // Search filter
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      cards = cards.filter(
        (c) =>
          c.question.toLowerCase().includes(q) ||
          c.tickers.some((t) => t.toLowerCase().includes(q))
      )
    }

    return cards
  }, [activeCategory, activeTicker, search])

  return (
    <div
      style={{
        background: 'var(--v2-bg-base, #0a0e17)',
        padding: '24px',
        minHeight: '100vh',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px',
          }}
        >
          <h1
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: 'var(--v2-text-primary, #e8e8ed)',
              margin: 0,
            }}
          >
            Prediction Room
          </h1>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '2px 8px',
              borderRadius: '9999px',
              background: 'var(--v2-violet-dim, rgba(139,92,246,0.15))',
              color: 'var(--v2-violet, #8b5cf6)',
              fontSize: '10px',
              fontWeight: 600,
              lineHeight: '18px',
            }}
          >
            via Polymarket
          </span>
        </div>

        {/* Search bar */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          placeholder="Search a Polymarket question or paste URL..."
          style={{
            width: '100%',
            height: '44px',
            padding: '0 14px',
            fontSize: '13px',
            color: 'var(--v2-text-primary, #e8e8ed)',
            background: 'var(--v2-bg-surface-2, #141825)',
            border: `1px solid ${searchFocused ? 'var(--v2-cyan-muted, rgba(6,182,212,0.3))' : 'var(--v2-border-default, rgba(255,255,255,0.08))'}`,
            borderRadius: '8px',
            outline: 'none',
            marginBottom: '16px',
            boxSizing: 'border-box',
            transition: 'border-color 150ms ease',
          }}
        />

        {/* Category filter pills */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            marginBottom: '12px',
          }}
        >
          {CATEGORIES.map((cat) => (
            <FilterPill
              key={cat}
              label={cat}
              active={activeCategory === cat}
              onClick={() => {
                setActiveCategory(cat)
                setActiveTicker(null)
              }}
            />
          ))}
        </div>

        {/* Ticker tabs */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            marginBottom: '20px',
            paddingBottom: '4px',
          }}
        >
          {TICKER_TABS.map((ticker) => (
            <FilterPill
              key={ticker}
              label={ticker}
              active={activeTicker === ticker}
              onClick={() =>
                setActiveTicker(activeTicker === ticker ? null : ticker)
              }
            />
          ))}
        </div>

        {/* Cards grid */}
        <div
          style={{
            display: 'grid',
            gap: '14px',
          }}
          className="grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
        >
          {filtered.map((card) => (
            <PredictionCard key={card.id} card={card} />
          ))}
          {filtered.length === 0 && (
            <div
              style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '48px 0',
                fontSize: '13px',
                color: 'var(--v2-text-tertiary, rgba(255,255,255,0.35))',
              }}
            >
              No predictions match your filters
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
