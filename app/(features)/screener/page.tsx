'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { usePolymarkets, usePolymarketSearch, usePriceHistory } from '@/hooks/use-polymarket'
import { categorizeMarket, formatVolume, getPolymarketUrl, type PolymarketMarket, type PriceHistoryPoint } from '@/lib/polymarket'

const CATEGORIES = ['all', 'crypto', 'macro', 'stocks', 'regulatory', 'geopolitical', 'sports', 'other']
const WL_KEY = 'ta-poly-watchlist'

export default function PredictionsPage() {
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedMarket, setSelectedMarket] = useState<PolymarketMarket | null>(null)
  const [watchlist, setWatchlist] = useState<string[]>([])
  const [showWatchlistOnly, setShowWatchlistOnly] = useState(false)

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(t)
  }, [search])

  // Load watchlist from localStorage
  useEffect(() => {
    try { const s = localStorage.getItem(WL_KEY); if (s) setWatchlist(JSON.parse(s)) } catch {}
  }, [])
  const saveWatchlist = useCallback((ids: string[]) => {
    setWatchlist(ids)
    localStorage.setItem(WL_KEY, JSON.stringify(ids))
  }, [])
  const toggleWatchlist = useCallback((id: string) => {
    saveWatchlist(watchlist.includes(id) ? watchlist.filter(x => x !== id) : [...watchlist, id])
  }, [watchlist, saveWatchlist])

  const { markets, isLoading } = usePolymarkets({ limit: 100 })
  const { results: searchResults, isLoading: searchLoading } = usePolymarketSearch(debouncedSearch)

  const display = useMemo(() => {
    let src = debouncedSearch.length >= 2 ? searchResults : markets
    if (showWatchlistOnly) src = src.filter(m => watchlist.includes(m.conditionId || m.id))
    if (category !== 'all') src = src.filter(m => categorizeMarket(m) === category)
    return src
  }, [markets, searchResults, debouncedSearch, category, showWatchlistOnly, watchlist])

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Prediction Room</h1>
        <a href="https://polymarket.com" target="_blank" rel="noopener noreferrer" style={{ padding: '3px 8px', borderRadius: 4, background: 'rgba(139,127,199,0.1)', border: '1px solid rgba(139,127,199,0.2)', color: 'var(--accent-violet)', fontSize: 10, fontWeight: 600, fontFamily: 'var(--font-mono)', textDecoration: 'none' }}>via Polymarket</a>
        <span style={{ marginLeft: 'auto', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-quaternary)' }}>
          {display.length} market{display.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 44, padding: '0 16px', background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)', borderRadius: 10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search markets... (e.g. bitcoin, trump, fed, oil, stocks)" style={{ flex: 1, border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: 14, fontFamily: 'var(--font-sans)', outline: 'none' }} />
          {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: 16 }}>×</button>}
          {searchLoading && <span style={{ fontSize: 11, color: 'var(--text-quaternary)', fontFamily: 'var(--font-mono)' }}>Searching...</span>}
        </div>
      </div>

      {/* Categories + watchlist toggle */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => { setCategory(c); setShowWatchlistOnly(false) }} style={{
            height: 28, padding: '0 12px', borderRadius: 6, border: '1px solid',
            borderColor: category === c && !showWatchlistOnly ? 'var(--accent-primary-muted)' : 'var(--border-default)',
            background: category === c && !showWatchlistOnly ? 'var(--accent-primary-bg)' : 'transparent',
            color: category === c && !showWatchlistOnly ? 'var(--accent-primary)' : 'var(--text-tertiary)',
            fontSize: 11.5, fontWeight: 500, cursor: 'pointer', textTransform: 'capitalize', transition: 'all 120ms',
          }}>{c === 'all' ? 'All' : c}</button>
        ))}
        <span style={{ width: 1, height: 18, background: 'var(--border-default)', margin: '0 4px' }} />
        <button onClick={() => setShowWatchlistOnly(!showWatchlistOnly)} style={{
          height: 28, padding: '0 12px', borderRadius: 6, border: '1px solid',
          borderColor: showWatchlistOnly ? 'var(--data-warning)' : 'var(--border-default)',
          background: showWatchlistOnly ? 'rgba(212,160,66,0.08)' : 'transparent',
          color: showWatchlistOnly ? 'var(--data-warning)' : 'var(--text-tertiary)',
          fontSize: 11.5, fontWeight: 500, cursor: 'pointer',
        }}>⭐ Watchlist{watchlist.length > 0 ? ` (${watchlist.length})` : ''}</button>
      </div>

      {isLoading && !markets.length && <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-tertiary)', fontSize: 13 }}>Loading markets from Polymarket...</div>}
      {!isLoading && display.length === 0 && (
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-tertiary)', fontSize: 13 }}>
          {showWatchlistOnly ? 'No watchlisted markets. Click the ⭐ on any card to add it.' : search ? `No markets found for "${search}"` : 'No markets found for this category.'}
        </div>
      )}

      {/* Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
        {display.map(m => (
          <MarketCard key={m.conditionId || m.id} market={m} onClick={() => setSelectedMarket(m)} isWatchlisted={watchlist.includes(m.conditionId || m.id)} onToggleWatchlist={() => toggleWatchlist(m.conditionId || m.id)} />
        ))}
      </div>

      {selectedMarket && <MarketDetail market={selectedMarket} onClose={() => setSelectedMarket(null)} />}
    </div>
  )
}

/* ── Market Card ──────────────────────────────────────────── */

function MarketCard({ market, onClick, isWatchlisted, onToggleWatchlist }: {
  market: PolymarketMarket; onClick: () => void; isWatchlisted: boolean; onToggleWatchlist: () => void
}) {
  const outcomes = market._parsedOutcomes || ['Yes', 'No']
  const prices = market._parsedPrices || []
  const primaryProb = prices[0] ? prices[0] * 100 : 50

  // Generate a deterministic mini sparkline from the probability
  const sparkData = useMemo(() => {
    const base = primaryProb / 100
    const pts: number[] = []
    let seed = (market.conditionId || market.id || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    for (let i = 0; i < 12; i++) {
      seed = (seed * 16807) % 2147483647
      const noise = ((seed % 1000) / 1000 - 0.5) * 0.2
      pts.push(Math.max(0.02, Math.min(0.98, base + noise * (1 - i / 12) + (base - (pts[0] ?? base)) * (i / 12))))
    }
    pts.push(base)
    return pts
  }, [primaryProb, market.conditionId, market.id])

  return (
    <div onClick={onClick} style={{
      background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)', borderRadius: 10,
      padding: '16px 18px', cursor: 'pointer', transition: 'border-color 150ms, box-shadow 150ms', position: 'relative',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      {/* Watchlist star */}
      <button onClick={e => { e.stopPropagation(); onToggleWatchlist() }} style={{
        position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', cursor: 'pointer',
        fontSize: 14, color: isWatchlisted ? 'var(--data-warning)' : 'var(--text-quaternary)', opacity: isWatchlisted ? 1 : 0.4,
        transition: 'opacity 150ms, color 150ms', padding: 2,
      }} onMouseEnter={e => { e.currentTarget.style.opacity = '1' }} onMouseLeave={e => { if (!isWatchlisted) e.currentTarget.style.opacity = '0.4' }}>
        {isWatchlisted ? '★' : '☆'}
      </button>

      {/* Question */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 10, paddingRight: 24 }}>
        {market.image && <img src={market.image} alt="" style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover', flexShrink: 0, background: 'var(--bg-surface-3)' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />}
        <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.35, flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>{market.question}</h3>
      </div>

      {/* Mini sparkline chart */}
      <MiniSparkline data={sparkData} color={primaryProb > 65 ? 'var(--data-positive)' : primaryProb < 35 ? 'var(--data-negative)' : 'var(--accent-primary)'} />

      {/* Outcomes */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, marginBottom: 8 }}>
        {outcomes.slice(0, 2).map((o, i) => {
          const prob = prices[i] ? prices[i] * 100 : 0
          return (
            <span key={i} style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              {o}: <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: prob > 65 ? 'var(--data-positive)' : prob < 35 ? 'var(--data-negative)' : 'var(--text-primary)' }}>{prob.toFixed(0)}%</span>
            </span>
          )
        })}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10, color: 'var(--text-quaternary)', fontFamily: 'var(--font-mono)' }}>
        <span>{formatVolume(market.volume24hr || market.volume || 0)} vol</span>
        {market.endDate && <span>{new Date(market.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
        <a href={getPolymarketUrl(market)} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ color: 'var(--accent-violet)', textDecoration: 'none', fontWeight: 500 }}>Polymarket ↗</a>
      </div>
    </div>
  )
}

/* ── Mini Sparkline for cards ─────────────────────────────── */

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const w = 280, h = 36, pad = 2
  const cH = h - pad * 2
  const min = Math.min(...data) * 0.9, max = Math.max(...data) * 1.1, range = max - min || 0.01
  const pts = data.map((v, i) => ({ x: (i / (data.length - 1)) * w, y: pad + (1 - (v - min) / range) * cH }))
  const first = pts[0], last = pts[pts.length - 1]
  if (!first || !last) return null
  let path = `M ${first.x},${first.y}`
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1]!, cur = pts[i]!
    const cp = (prev.x + cur.x) / 2
    path += ` C ${cp},${prev.y} ${cp},${cur.y} ${cur.x},${cur.y}`
  }
  const area = `${path} L ${last.x},${h} L ${first.x},${h} Z`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: h, display: 'block' }} preserveAspectRatio="none">
      <defs><linearGradient id={`ms-${data.length}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.15" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      <path d={area} fill={`url(#ms-${data.length})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

/* ── Market Detail Modal ──────────────────────────────────── */

function MarketDetail({ market, onClose }: { market: PolymarketMarket; onClose: () => void }) {
  const [interval, setChartInterval] = useState('1m')
  const tokenId = market._parsedTokenIds?.[0] || ''
  const { history, isLoading: chartLoading } = usePriceHistory(tokenId, interval)
  const outcomes = market._parsedOutcomes || ['Yes', 'No']
  const prices = market._parsedPrices || []

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 70, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90vw', maxWidth: 720, maxHeight: '85vh', background: 'var(--bg-surface-1)', border: '1px solid var(--border-default)', borderRadius: 16, boxShadow: '0 24px 64px rgba(0,0,0,0.5)', overflow: 'hidden', zIndex: 71, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-default)', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          {market.image && <img src={market.image} alt="" style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover', background: 'var(--bg-surface-3)', flexShrink: 0 }} />}
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 6 }}>{market.question}</h2>
            <div style={{ display: 'flex', gap: 10, fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', flexWrap: 'wrap' }}>
              <span>{formatVolume(market.volume || 0)} total</span><span style={{ color: 'var(--border-default)' }}>·</span>
              <span>{formatVolume(market.volume24hr || 0)} 24h</span><span style={{ color: 'var(--border-default)' }}>·</span>
              <span>{formatVolume(market.liquidity || 0)} liq</span>
              {market.endDate && <><span style={{ color: 'var(--border-default)' }}>·</span><span>Exp {new Date(market.endDate).toLocaleDateString()}</span></>}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'var(--bg-surface-3)', border: '1px solid var(--border-default)', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', cursor: 'pointer', flexShrink: 0 }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {/* Outcomes */}
          <div style={{ marginBottom: 24 }}>
            {outcomes.map((o, i) => {
              const prob = prices[i] ? prices[i] * 100 : 0
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < outcomes.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: 'var(--text-primary)' }}>{o}</span>
                  <div style={{ width: 140, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.04)', overflow: 'hidden' }}>
                    <div style={{ width: `${prob}%`, height: '100%', borderRadius: 4, background: prob > 50 ? 'var(--data-positive)' : 'var(--data-negative)', opacity: 0.7 }} />
                  </div>
                  <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-mono)', color: prob > 65 ? 'var(--data-positive)' : prob < 35 ? 'var(--data-negative)' : 'var(--text-primary)', width: 60, textAlign: 'right' }}>{prob.toFixed(1)}%</span>
                </div>
              )
            })}
          </div>

          {/* Chart */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Probability History</span>
              <div style={{ display: 'flex', gap: 2, background: 'var(--bg-surface-3)', borderRadius: 6, padding: 2 }}>
                {['1d', '1w', '1m', 'max'].map(iv => (
                  <button key={iv} onClick={() => setChartInterval(iv)} style={{ height: 26, padding: '0 10px', borderRadius: 4, border: 'none', background: interval === iv ? 'var(--accent-primary-bg)' : 'transparent', color: interval === iv ? 'var(--accent-primary)' : 'var(--text-tertiary)', fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-mono)', cursor: 'pointer' }}>{iv.toUpperCase()}</button>
                ))}
              </div>
            </div>
            <div style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: 16 }}>
              {chartLoading || !history.length ? (
                <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-quaternary)', fontSize: 12 }}>{chartLoading ? 'Loading...' : 'No chart data available'}</div>
              ) : <DetailChart history={history} height={160} />}
            </div>
          </div>

          {/* Description */}
          {market.description && (
            <div style={{ marginBottom: 24 }}>
              <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Resolution Details</h4>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text-tertiary)', margin: 0, maxHeight: 120, overflow: 'auto' }}>{market.description}</p>
            </div>
          )}

          {/* Pelican */}
          <div style={{ background: 'var(--pelican-bg)', border: '1px solid var(--pelican-border)', borderRadius: 10, padding: 18, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, var(--pelican-gradient-start), var(--pelican-gradient-end))', opacity: 0.5 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, marginTop: 4 }}>
              <img src="/images/pelican-logo.png" alt="" width={24} height={24} style={{ objectFit: 'contain' }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>PELICAN ANALYSIS</span>
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text-secondary)' }}>
              This market has {formatVolume(market.volume24hr || 0)} in 24h volume.
              {(prices[0] ?? 0.5) > 0.7 ? ' High confidence in the primary outcome.' : (prices[0] ?? 0.5) < 0.3 ? ' Primary outcome considered unlikely — contrarian opportunity.' : ' Market is divided.'} Track 5%+ shifts as signal events.
            </div>
          </div>
        </div>

        <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'var(--text-quaternary)' }}>Data from Polymarket</span>
          <a href={getPolymarketUrl(market)} target="_blank" rel="noopener noreferrer" style={{ height: 34, padding: '0 18px', borderRadius: 8, background: 'var(--accent-violet)', color: 'white', fontSize: 13, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>Trade on Polymarket ↗</a>
        </div>
      </div>
    </>
  )
}

/* ── Detail Chart (real price history) ────────────────────── */

function DetailChart({ history, height = 160 }: { history: PriceHistoryPoint[]; height?: number }) {
  if (!history || history.length < 2) return null
  const w = 600, pad = 4, cH = height - pad * 2 - 12
  const prices = history.map(h => h.p)
  const min = Math.min(...prices) * 0.95, max = Math.max(...prices) * 1.05, range = max - min || 0.01
  const pts = history.map((h, i) => ({ x: (i / (history.length - 1)) * w, y: pad + (1 - (h.p - min) / range) * cH }))
  const first = pts[0], last = pts[pts.length - 1]
  if (!first || !last) return null
  let path = `M ${first.x},${first.y}`
  for (let i = 1; i < pts.length; i++) { const prev = pts[i - 1]!, cur = pts[i]!; const cp = (prev.x + cur.x) / 2; path += ` C ${cp},${prev.y} ${cp},${cur.y} ${cur.x},${cur.y}` }
  const area = `${path} L ${last.x},${pad + cH} L ${first.x},${pad + cH} Z`
  return (
    <svg viewBox={`0 0 ${w} ${height}`} style={{ width: '100%', height, display: 'block' }} preserveAspectRatio="none">
      <defs><linearGradient id="dcg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.2" /><stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0" /></linearGradient></defs>
      <path d={area} fill="url(#dcg)" /><path d={path} fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" />
      <circle cx={last.x} cy={last.y} r="4" fill="var(--accent-primary)" stroke="var(--bg-surface-2)" strokeWidth="2" />
    </svg>
  )
}
