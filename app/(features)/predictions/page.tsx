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
        background: 'var(--v2-bg-base)',
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
              fontSize: '16px',
              fontWeight: 700,
              color: 'var(--v2-text-primary)',
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
              fontSize: '11px',
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
          placeholder="Search a Polymarket question or paste URL..."
          style={{
            width: '100%',
            height: '44px',
            padding: '0 14px',
            fontSize: '13px',
            color: 'var(--v2-text-primary)',
            background: 'var(--v2-bg-elevated)',
            border: '1px solid var(--v2-border)',
            borderRadius: '6px',
            outline: 'none',
            marginBottom: '16px',
            boxSizing: 'border-box',
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
            <button
              key={ticker}
              type="button"
              onClick={() =>
                setActiveTicker(activeTicker === ticker ? null : ticker)
              }
              style={{
                padding: '4px 12px',
                borderRadius: '9999px',
                border: `1px solid ${
                  activeTicker === ticker
                    ? 'var(--v2-cyan-dim, rgba(6,182,212,0.4))'
                    : 'var(--v2-border)'
                }`,
                background:
                  activeTicker === ticker
                    ? 'var(--v2-cyan-dim, rgba(6,182,212,0.12))'
                    : 'transparent',
                color:
                  activeTicker === ticker
                    ? 'var(--v2-cyan, #06B6D4)'
                    : 'var(--v2-text-secondary)',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                lineHeight: '18px',
                flexShrink: 0,
              }}
            >
              {ticker}
            </button>
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
                color: 'var(--v2-text-tertiary)',
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
