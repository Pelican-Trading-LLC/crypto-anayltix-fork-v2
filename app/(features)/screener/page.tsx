'use client'

import { useState, useMemo } from 'react'
import { usePolymarkets, usePolymarketSearch, usePriceHistory } from '@/hooks/use-polymarket'
import { categorizeMarket, formatVolume, getPolymarketUrl, type PolymarketMarket, type PriceHistoryPoint } from '@/lib/polymarket'

const CATEGORIES = ['all', 'crypto', 'macro', 'stocks', 'regulatory', 'geopolitical', 'sports', 'other']

export default function PredictionsPage() {
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedMarket, setSelectedMarket] = useState<PolymarketMarket | null>(null)

  const { markets, isLoading } = usePolymarkets({ limit: 50 })
  const { results: searchResults, isLoading: searchLoading } = usePolymarketSearch(search)

  const display = useMemo(() => {
    const src = search.length >= 2 ? searchResults : markets
    if (category === 'all') return src
    return src.filter(m => categorizeMarket(m) === category)
  }, [markets, searchResults, search, category])

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Prediction Room</h1>
        <a href="https://polymarket.com" target="_blank" rel="noopener noreferrer" style={{
          padding: '3px 8px', borderRadius: 4, background: 'rgba(139,127,199,0.1)', border: '1px solid rgba(139,127,199,0.2)',
          color: 'var(--accent-violet)', fontSize: 10, fontWeight: 600, fontFamily: 'var(--font-mono)', textDecoration: 'none',
        }}>via Polymarket</a>
        <span style={{ marginLeft: 'auto', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-quaternary)' }}>
          {markets.length} markets
        </span>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 44, padding: '0 16px', background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)', borderRadius: 10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search any Polymarket contract..." style={{ flex: 1, border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: 14, fontFamily: 'var(--font-sans)', outline: 'none' }} />
          {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: 16 }}>×</button>}
          {searchLoading && <span style={{ fontSize: 11, color: 'var(--text-quaternary)' }}>Searching...</span>}
        </div>
      </div>

      {/* Categories */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)} style={{
            height: 28, padding: '0 12px', borderRadius: 6, border: '1px solid',
            borderColor: category === c ? 'var(--accent-primary-muted)' : 'var(--border-default)',
            background: category === c ? 'var(--accent-primary-bg)' : 'transparent',
            color: category === c ? 'var(--accent-primary)' : 'var(--text-tertiary)',
            fontSize: 11.5, fontWeight: 500, cursor: 'pointer', textTransform: 'capitalize', transition: 'all 120ms',
          }}>{c === 'all' ? 'All' : c}</button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && !markets.length && (
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-tertiary)', fontSize: 13 }}>Loading markets from Polymarket...</div>
      )}

      {/* No results */}
      {!isLoading && display.length === 0 && search && (
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-tertiary)', fontSize: 13 }}>No markets found for &ldquo;{search}&rdquo;</div>
      )}

      {/* Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 14 }}>
        {display.map(m => (
          <MarketCard key={m.conditionId || m.id} market={m} onClick={() => setSelectedMarket(m)} />
        ))}
      </div>

      {/* Detail modal */}
      {selectedMarket && <MarketDetail market={selectedMarket} onClose={() => setSelectedMarket(null)} />}
    </div>
  )
}

/* ── Market Card ──────────────────────────────────────────── */

function MarketCard({ market, onClick }: { market: PolymarketMarket; onClick: () => void }) {
  const outcomes = market._parsedOutcomes || ['Yes', 'No']
  const prices = market._parsedPrices || []
  const tokenId = market._parsedTokenIds?.[0] || ''
  const { history } = usePriceHistory(tokenId, '1m')

  return (
    <div onClick={onClick} style={{
      background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)', borderRadius: 10,
      padding: 18, cursor: 'pointer', transition: 'border-color 200ms, box-shadow 200ms',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      {/* Question */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        {market.image && <img src={market.image} alt="" style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover', flexShrink: 0, background: 'var(--bg-surface-3)' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />}
        <h3 style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3, flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
          {market.question}
        </h3>
      </div>

      {/* Outcomes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
        {outcomes.slice(0, 3).map((o, i) => {
          const prob = prices[i] ? prices[i] * 100 : 0
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{o}</span>
              <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)', color: prob > 65 ? 'var(--data-positive)' : prob < 35 ? 'var(--data-negative)' : 'var(--text-primary)' }}>
                {prob.toFixed(0)}%
              </span>
            </div>
          )
        })}
      </div>

      {/* Chart */}
      <ProbChart history={history} height={64} />

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text-quaternary)', fontFamily: 'var(--font-mono)' }}>
          <span>{formatVolume(market.volume24hr || market.volume || 0)} vol</span>
          {market.endDate && <span>{new Date(market.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
        </div>
        <a href={getPolymarketUrl(market)} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ fontSize: 10, color: 'var(--accent-violet)', textDecoration: 'none', fontWeight: 500 }}>
          Polymarket ↗
        </a>
      </div>
    </div>
  )
}

/* ── Probability Chart ────────────────────────────────────── */

function ProbChart({ history, height = 64 }: { history: PriceHistoryPoint[]; height?: number }) {
  if (!history || history.length < 2) {
    return <div style={{ height, borderRadius: 4, background: 'var(--bg-surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 10, color: 'var(--text-quaternary)' }}>Loading chart...</span></div>
  }
  const w = 300, pad = 4
  const cW = w, cH = height - pad * 2
  const prices = history.map(h => h.p)
  const min = Math.min(...prices) * 0.95, max = Math.max(...prices) * 1.05, range = max - min || 0.01
  const pts = history.map((h, i) => ({ x: (i / (history.length - 1)) * cW, y: pad + (1 - (h.p - min) / range) * cH }))
  const first = pts[0]
  const last = pts[pts.length - 1]
  if (!first || !last) return null
  let path = `M ${first.x},${first.y}`
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1]!
    const cur = pts[i]!
    const cp = (prev.x + cur.x) / 2
    path += ` C ${cp},${prev.y} ${cp},${cur.y} ${cur.x},${cur.y}`
  }
  const area = `${path} L ${last.x},${height} L ${first.x},${height} Z`
  const gid = `pg-${Math.random().toString(36).slice(2, 6)}`

  return (
    <svg viewBox={`0 0 ${w} ${height}`} style={{ width: '100%', height, display: 'block' }} preserveAspectRatio="none">
      <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.15" /><stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0" /></linearGradient></defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={path} fill="none" stroke="var(--accent-primary)" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx={last.x} cy={last.y} r="3" fill="var(--accent-primary)" stroke="var(--bg-surface-2)" strokeWidth="2" />
    </svg>
  )
}

/* ── Market Detail Modal ──────────────────────────────────── */

function MarketDetail({ market, onClose }: { market: PolymarketMarket; onClose: () => void }) {
  const [interval, setInterval_] = useState('1m')
  const tokenId = market._parsedTokenIds?.[0] || ''
  const { history, isLoading: chartLoading } = usePriceHistory(tokenId, interval)
  const outcomes = market._parsedOutcomes || ['Yes', 'No']
  const prices = market._parsedPrices || []

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 70, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />
      <div style={{ position: 'fixed', top: '5%', left: '50%', transform: 'translateX(-50%)', width: 640, maxHeight: '90vh', background: 'var(--bg-surface-2)', border: '1px solid var(--border-strong)', borderRadius: 12, boxShadow: '0 16px 48px rgba(0,0,0,0.4)', overflow: 'hidden', zIndex: 71, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-default)', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          {market.image && <img src={market.image} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', background: 'var(--bg-surface-3)', flexShrink: 0 }} />}
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 4 }}>{market.question}</h2>
            <div style={{ display: 'flex', gap: 8, fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
              <span>{formatVolume(market.volume || 0)} total</span>
              <span>·</span>
              <span>{formatVolume(market.volume24hr || 0)} 24h</span>
              <span>·</span>
              <span>{formatVolume(market.liquidity || 0)} liq</span>
              {market.endDate && <><span>·</span><span>Exp {new Date(market.endDate).toLocaleDateString()}</span></>}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: 4 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {/* Outcomes */}
          <div style={{ marginBottom: 20 }}>
            {outcomes.map((o, i) => {
              const prob = prices[i] ? prices[i] * 100 : 0
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < outcomes.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{o}</span>
                  <div style={{ width: 120, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.04)', overflow: 'hidden' }}>
                    <div style={{ width: `${prob}%`, height: '100%', borderRadius: 3, background: prob > 50 ? 'var(--data-positive)' : 'var(--data-negative)', opacity: 0.7 }} />
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-mono)', color: prob > 65 ? 'var(--data-positive)' : prob < 35 ? 'var(--data-negative)' : 'var(--text-primary)', width: 50, textAlign: 'right' }}>
                    {prob.toFixed(1)}%
                  </span>
                </div>
              )
            })}
          </div>

          {/* Chart with time controls */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Probability History</span>
              <div style={{ display: 'flex', gap: 2 }}>
                {['1h', '6h', '1d', '1w', '1m', 'max'].map(iv => (
                  <button key={iv} onClick={() => setInterval_(iv)} style={{ height: 24, padding: '0 8px', borderRadius: 4, border: 'none', background: interval === iv ? 'var(--accent-primary-bg)' : 'transparent', color: interval === iv ? 'var(--accent-primary)' : 'var(--text-tertiary)', fontSize: 10, fontWeight: 600, fontFamily: 'var(--font-mono)', cursor: 'pointer' }}>
                    {iv.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '12px 8px' }}>
              {chartLoading ? <div style={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-quaternary)', fontSize: 11 }}>Loading chart...</div> : <ProbChart history={history} height={140} />}
            </div>
          </div>

          {/* Description */}
          {market.description && (
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Resolution Details</h4>
              <p style={{ fontSize: 12.5, lineHeight: 1.6, color: 'var(--text-tertiary)', margin: 0 }}>{market.description}</p>
            </div>
          )}

          {/* Pelican Analysis */}
          <div style={{ background: 'var(--pelican-bg)', border: '1px solid var(--pelican-border)', borderRadius: 8, padding: 16, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, var(--pelican-gradient-start), var(--pelican-gradient-end))', opacity: 0.5 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, marginTop: 4 }}>
              <img src="/images/pelican-logo.png" alt="" width={22} height={22} style={{ objectFit: 'contain' }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>PELICAN ANALYSIS</span>
            </div>
            <div style={{ fontSize: 12.5, lineHeight: 1.7, color: 'var(--text-secondary)' }}>
              This market has {formatVolume(market.volume24hr || 0)} in 24h volume with {formatVolume(market.liquidity || 0)} liquidity.
              {(prices[0] ?? 0.5) > 0.7 ? ' The market is highly confident in the primary outcome.' : (prices[0] ?? 0.5) < 0.3 ? ' The market considers the primary outcome unlikely — potential contrarian opportunity.' : ' The market is relatively divided on this outcome.'} Track probability shifts above 5% as potential signal events.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'var(--text-quaternary)' }}>Data from Polymarket · Real-time probabilities</span>
          <a href={getPolymarketUrl(market)} target="_blank" rel="noopener noreferrer" style={{ height: 32, padding: '0 16px', borderRadius: 6, background: 'var(--accent-violet)', color: 'white', fontSize: 12, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            Trade on Polymarket ↗
          </a>
        </div>
      </div>
    </>
  )
}
