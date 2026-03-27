'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { usePolymarkets, usePolymarketSearch, usePriceHistory } from '@/hooks/use-polymarket'
import { useProbabilityShifts, type ProbabilityShift } from '@/hooks/use-probability-shifts'
import { detectContrarianSignals, type ContrarianSignal } from '@/lib/contrarian-detector'
import { categorizeMarket, formatVolume, getPolymarketUrl, type PolymarketMarket, type PriceHistoryPoint } from '@/lib/polymarket'
import { MOCK_X_FEED, type XPost } from '@/lib/crypto-mock-data'

const CATEGORIES = ['all', 'contrarian', 'crypto', 'macro', 'stocks', 'regulatory', 'geopolitical', 'sports', 'other']
const WL_KEY = 'ta-poly-watchlist'

export default function PredictionsPage() {
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedMarket, setSelectedMarket] = useState<PolymarketMarket | null>(null)
  const [watchlist, setWatchlist] = useState<string[]>([])
  const [showWatchlistOnly, setShowWatchlistOnly] = useState(false)
  const [simPositions, setSimPositions] = useState<SimPosition[]>([])
  const [simOpen, setSimOpen] = useState(false)

  useEffect(() => { const t = setTimeout(() => setDebouncedSearch(search), 300); return () => clearTimeout(t) }, [search])
  useEffect(() => { try { const s = localStorage.getItem(WL_KEY); if (s) setWatchlist(JSON.parse(s)) } catch {} }, [])

  const saveWl = useCallback((ids: string[]) => { setWatchlist(ids); localStorage.setItem(WL_KEY, JSON.stringify(ids)) }, [])
  const toggleWl = useCallback((id: string) => { saveWl(watchlist.includes(id) ? watchlist.filter(x => x !== id) : [...watchlist, id]) }, [watchlist, saveWl])

  const { markets, isLoading } = usePolymarkets({ limit: 100 })
  const { results: searchResults, isLoading: searchLoading } = usePolymarketSearch(debouncedSearch)
  const shifts = useProbabilityShifts(markets)
  const contrarianSignals = useMemo(() => detectContrarianSignals(markets), [markets])

  const addToSim = useCallback((market: PolymarketMarket, side: 'yes' | 'no') => {
    const prices = market._parsedPrices || []
    const prob = side === 'yes' ? (prices[0] || 0.5) : (prices[1] || 0.5)
    setSimPositions(prev => [...prev, { marketId: market.conditionId || market.id, question: market.question, side, amount: 100, probability: prob }])
    setSimOpen(true)
  }, [])

  const display = useMemo(() => {
    let src = debouncedSearch.length >= 2 ? searchResults : markets
    if (showWatchlistOnly) src = src.filter(m => watchlist.includes(m.conditionId || m.id))
    if (category === 'contrarian') {
      const ids = new Set(contrarianSignals.map(s => s.market.conditionId || s.market.id))
      src = src.filter(m => ids.has(m.conditionId || m.id))
    } else if (category !== 'all') {
      src = src.filter(m => categorizeMarket(m) === category)
    }
    return src
  }, [markets, searchResults, debouncedSearch, category, showWatchlistOnly, watchlist, contrarianSignals])

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Prediction Room</h1>
        <a href="https://polymarket.com" target="_blank" rel="noopener noreferrer" style={{ padding: '3px 8px', borderRadius: 4, background: 'rgba(139,127,199,0.1)', border: '1px solid rgba(139,127,199,0.2)', color: 'var(--accent-violet)', fontSize: 10, fontWeight: 600, fontFamily: 'var(--font-mono)', textDecoration: 'none' }}>via Polymarket</a>
        <span style={{ marginLeft: 'auto', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-quaternary)' }}>{display.length} market{display.length !== 1 ? 's' : ''}</span>
      </div>

      {/* ── FEATURE 1: Probability Shift Ticker ────────────── */}
      <ShiftTicker shifts={shifts} markets={markets} onSelect={setSelectedMarket} />

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 44, padding: '0 16px', background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)', borderRadius: 10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search markets... (e.g. bitcoin, trump, fed, oil)" style={{ flex: 1, border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: 14, fontFamily: 'var(--font-sans)', outline: 'none' }} />
          {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: 16 }}>×</button>}
          {searchLoading && <span style={{ fontSize: 11, color: 'var(--text-quaternary)', fontFamily: 'var(--font-mono)' }}>Searching...</span>}
        </div>
      </div>

      {/* Categories + watchlist */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => { setCategory(c); setShowWatchlistOnly(false) }} style={{
            height: 28, padding: '0 12px', borderRadius: 6, border: '1px solid',
            borderColor: category === c && !showWatchlistOnly ? (c === 'contrarian' ? 'rgba(212,160,66,0.3)' : 'var(--accent-primary-muted)') : 'var(--border-default)',
            background: category === c && !showWatchlistOnly ? (c === 'contrarian' ? 'rgba(212,160,66,0.08)' : 'var(--accent-primary-bg)') : 'transparent',
            color: category === c && !showWatchlistOnly ? (c === 'contrarian' ? 'var(--data-warning)' : 'var(--accent-primary)') : 'var(--text-tertiary)',
            fontSize: 11.5, fontWeight: 500, cursor: 'pointer', textTransform: 'capitalize', transition: 'all 120ms',
          }}>{c === 'all' ? 'All' : c === 'contrarian' ? '⚡ Contrarian' : c}</button>
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
      {!isLoading && display.length === 0 && <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-tertiary)', fontSize: 13 }}>{showWatchlistOnly ? 'No watchlisted markets.' : search ? `No markets for "${search}"` : 'No markets for this category.'}</div>}

      {/* ── Card Grid ─────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
        {display.map(m => {
          const id = m.conditionId || m.id
          const signal = contrarianSignals.find(s => (s.market.conditionId || s.market.id) === id)
          return <MarketCard key={id} market={m} signal={signal} isWatchlisted={watchlist.includes(id)} onToggleWatchlist={() => toggleWl(id)} onClick={() => setSelectedMarket(m)} onAddToSim={addToSim} />
        })}
      </div>

      {/* ── FEATURE 2: Resolution Calendar ────────────────── */}
      <ResolutionCalendar markets={markets} />

      {/* ── FEATURE 5: Social Pulse ───────────────────────── */}
      <SocialPulse markets={markets} xFeed={MOCK_X_FEED} />

      {/* ── FEATURE 4: Portfolio Simulator ─────────────────── */}
      <PortfolioSimulator positions={simPositions} setPositions={setSimPositions} isOpen={simOpen} setIsOpen={setSimOpen} />

      {/* Detail modal */}
      {selectedMarket && <MarketDetail market={selectedMarket} onClose={() => setSelectedMarket(null)} />}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════ */
/* SHIFT TICKER                                                  */
/* ══════════════════════════════════════════════════════════════ */

function ShiftTicker({ shifts, markets, onSelect }: { shifts: ProbabilityShift[]; markets: PolymarketMarket[]; onSelect: (m: PolymarketMarket) => void }) {
  return (
    <div style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-subtle)', borderRadius: 8, marginBottom: 16, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--data-warning)" strokeWidth="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--data-warning)', fontFamily: 'var(--font-mono)' }}>PROBABILITY SHIFTS</span>
        <span style={{ fontSize: 10, color: 'var(--text-quaternary)', marginLeft: 'auto' }}>
          {shifts.length > 0 ? `${shifts.length} shift${shifts.length > 1 ? 's' : ''} detected` : `Monitoring ${markets.length} markets...`}
        </span>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--data-positive)', animation: 'livePulse 3s ease-in-out infinite' }} />
      </div>
      <div style={{ display: 'flex', overflowX: 'auto', padding: '8px 12px', gap: 10, scrollbarWidth: 'none' }}>
        {shifts.length === 0 ? (
          <span style={{ fontSize: 11, color: 'var(--text-quaternary)', padding: '4px 8px' }}>Shifts appear here when probabilities move 2%+ between polls (60s intervals)</span>
        ) : shifts.map((s, i) => (
          <div key={i} onClick={() => onSelect(s.market)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: 'var(--bg-surface-3)', borderRadius: 6, border: `1px solid ${s.direction === 'up' ? 'rgba(62,189,140,0.15)' : 'rgba(224,101,101,0.15)'}`, flexShrink: 0, cursor: 'pointer' }}>
            <div style={{ width: 20, height: 20, borderRadius: 4, background: s.direction === 'up' ? 'rgba(62,189,140,0.12)' : 'rgba(224,101,101,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 11, color: s.direction === 'up' ? 'var(--data-positive)' : 'var(--data-negative)' }}>{s.direction === 'up' ? '↑' : '↓'}</span>
            </div>
            <span style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--text-primary)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.market.question}</span>
            <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', color: s.direction === 'up' ? 'var(--data-positive)' : 'var(--data-negative)', whiteSpace: 'nowrap' }}>
              {s.currentProb.toFixed(0)}% <span style={{ fontSize: 10, fontWeight: 500 }}>({s.direction === 'up' ? '+' : ''}{s.delta.toFixed(1)}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════ */
/* MARKET CARD                                                   */
/* ══════════════════════════════════════════════════════════════ */

function MarketCard({ market, signal, isWatchlisted, onToggleWatchlist, onClick, onAddToSim }: {
  market: PolymarketMarket; signal?: ContrarianSignal; isWatchlisted: boolean; onToggleWatchlist: () => void; onClick: () => void; onAddToSim: (m: PolymarketMarket, side: 'yes' | 'no') => void
}) {
  const outcomes = market._parsedOutcomes || ['Yes', 'No']
  const prices = market._parsedPrices || []
  const primaryProb = prices[0] ? prices[0] * 100 : 50

  const sparkData = useMemo(() => {
    const base = primaryProb / 100
    const pts: number[] = []
    let seed = (market.conditionId || market.id || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    for (let i = 0; i < 12; i++) { seed = (seed * 16807) % 2147483647; const n = ((seed % 1000) / 1000 - 0.5) * 0.2; pts.push(Math.max(0.02, Math.min(0.98, base + n * (1 - i / 12) + (base - (pts[0] ?? base)) * (i / 12)))) }
    pts.push(base)
    return pts
  }, [primaryProb, market.conditionId, market.id])

  return (
    <div onClick={onClick} style={{
      background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)', borderRadius: 10,
      borderLeft: signal ? `3px solid ${signal.severity === 'strong' ? 'var(--data-warning)' : 'var(--accent-violet)'}` : undefined,
      padding: '16px 18px', cursor: 'pointer', transition: 'border-color 150ms, box-shadow 150ms', position: 'relative',
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}
    >
      {/* Watchlist star */}
      <button onClick={e => { e.stopPropagation(); onToggleWatchlist() }} style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: isWatchlisted ? 'var(--data-warning)' : 'var(--text-quaternary)', opacity: isWatchlisted ? 1 : 0.4, transition: 'opacity 150ms', padding: 2 }}
        onMouseEnter={e => { e.currentTarget.style.opacity = '1' }} onMouseLeave={e => { if (!isWatchlisted) e.currentTarget.style.opacity = '0.4' }}>
        {isWatchlisted ? '★' : '☆'}
      </button>

      {/* Contrarian badge */}
      {signal && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', background: signal.severity === 'strong' ? 'rgba(212,160,66,0.08)' : 'rgba(139,127,199,0.06)', borderRadius: 4, marginBottom: 8 }}>
          <span style={{ fontSize: 10 }}>⚡</span>
          <span style={{ fontSize: 10, fontWeight: 600, fontFamily: 'var(--font-mono)', color: signal.severity === 'strong' ? 'var(--data-warning)' : 'var(--accent-violet)', letterSpacing: '0.04em' }}>CONTRARIAN</span>
        </div>
      )}

      {/* Question */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 10, paddingRight: 24 }}>
        {market.image && <img src={market.image} alt="" style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover', flexShrink: 0, background: 'var(--bg-surface-3)' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />}
        <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.35, flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>{market.question}</h3>
      </div>

      <MiniSparkline data={sparkData} color={primaryProb > 65 ? 'var(--data-positive)' : primaryProb < 35 ? 'var(--data-negative)' : 'var(--accent-primary)'} />

      {/* Outcomes with Yes/No sim buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, marginBottom: 8 }}>
        {outcomes.slice(0, 2).map((o, i) => {
          const prob = prices[i] ? prices[i] * 100 : 0
          const isYes = o.toLowerCase() === 'yes'
          const isNo = o.toLowerCase() === 'no'
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{o}:</span>
              <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: 12, color: prob > 65 ? 'var(--data-positive)' : prob < 35 ? 'var(--data-negative)' : 'var(--text-primary)' }}>{prob.toFixed(0)}%</span>
              {(isYes || isNo) && (
                <button onClick={e => { e.stopPropagation(); onAddToSim(market, isYes ? 'yes' : 'no') }} style={{
                  padding: '1px 6px', borderRadius: 3, border: `1px solid ${isYes ? 'var(--data-positive)' : 'var(--data-negative)'}`, color: isYes ? 'var(--data-positive)' : 'var(--data-negative)',
                  background: 'transparent', fontSize: 9, fontWeight: 600, cursor: 'pointer', transition: 'background 100ms',
                }} onMouseEnter={e => { e.currentTarget.style.background = isYes ? 'rgba(62,189,140,0.12)' : 'rgba(224,101,101,0.12)' }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                  {o}
                </button>
              )}
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10, color: 'var(--text-quaternary)', fontFamily: 'var(--font-mono)' }}>
        <span>{formatVolume(market.volume24hr || market.volume || 0)} vol</span>
        {market.endDate && <span>{new Date(market.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
        <a href={getPolymarketUrl(market)} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ color: 'var(--accent-violet)', textDecoration: 'none', fontWeight: 500 }}>Polymarket ↗</a>
      </div>
    </div>
  )
}

/* ── Mini Sparkline ──────────────────────────────────────────  */
function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const w = 280, h = 36, pad = 2, cH = h - pad * 2
  const min = Math.min(...data) * 0.9, max = Math.max(...data) * 1.1, range = max - min || 0.01
  const pts = data.map((v, i) => ({ x: (i / (data.length - 1)) * w, y: pad + (1 - (v - min) / range) * cH }))
  const first = pts[0], last = pts[pts.length - 1]
  if (!first || !last) return null
  let path = `M ${first.x},${first.y}`
  for (let i = 1; i < pts.length; i++) { const p = pts[i - 1]!, c = pts[i]!; path += ` C ${(p.x + c.x) / 2},${p.y} ${(p.x + c.x) / 2},${c.y} ${c.x},${c.y}` }
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: h, display: 'block' }} preserveAspectRatio="none">
      <defs><linearGradient id={`ms`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.15" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      <path d={`${path} L ${last.x},${h} L ${first.x},${h} Z`} fill={`url(#ms)`} />
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

/* ══════════════════════════════════════════════════════════════ */
/* RESOLUTION CALENDAR                                           */
/* ══════════════════════════════════════════════════════════════ */

function ResolutionCalendar({ markets }: { markets: PolymarketMarket[] }) {
  const grouped = useMemo(() => {
    const g = new Map<string, { date: string; markets: PolymarketMarket[]; totalVolume: number }>()
    for (const m of markets) {
      if (!m.endDate) continue
      const dk = m.endDate.split('T')[0] ?? ''
      const ex = g.get(dk) || { date: dk, markets: [], totalVolume: 0 }
      ex.markets.push(m); ex.totalVolume += (m.volume || 0); g.set(dk, ex)
    }
    return Array.from(g.values()).sort((a, b) => a.date.localeCompare(b.date)).filter(g => new Date(g.date) >= new Date()).slice(0, 8)
  }, [markets])

  if (grouped.length === 0) return null
  return (
    <div style={{ marginTop: 32, marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Resolution Calendar</h3>
      </div>
      <div style={{ display: 'flex', gap: 0, overflowX: 'auto', scrollbarWidth: 'none' }}>
        {grouped.map((g, gi) => {
          const d = new Date(g.date + 'T00:00:00')
          const soon = (d.getTime() - Date.now()) < 7 * 86400000
          return (
            <div key={g.date} style={{ width: 160, flexShrink: 0, padding: '12px 16px', background: soon ? 'rgba(224,101,101,0.04)' : 'var(--bg-surface-2)', border: '1px solid var(--border-subtle)', borderRight: gi < grouped.length - 1 ? 'none' : undefined, borderRadius: gi === 0 ? '8px 0 0 8px' : gi === grouped.length - 1 ? '0 8px 8px 0' : 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-mono)', color: soon ? 'var(--data-negative)' : 'var(--text-primary)', marginBottom: 2 }}>{d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
              <div style={{ fontSize: 9, fontWeight: 500, fontFamily: 'var(--font-mono)', color: 'var(--text-quaternary)', textTransform: 'uppercase', marginBottom: 6 }}>{d.toLocaleDateString('en-US', { weekday: 'short' })}</div>
              <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginBottom: 6 }}>{g.markets.length} contract{g.markets.length > 1 ? 's' : ''} · {formatVolume(g.totalVolume)}</div>
              {g.markets.slice(0, 2).map((m, mi) => <div key={mi} style={{ fontSize: 10, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.4 }}>{m.question.length > 35 ? m.question.slice(0, 33) + '...' : m.question}</div>)}
              {g.markets.length > 2 && <span style={{ fontSize: 9, color: 'var(--text-quaternary)' }}>+{g.markets.length - 2} more</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════ */
/* SOCIAL PULSE                                                  */
/* ══════════════════════════════════════════════════════════════ */

function SocialPulse({ markets, xFeed }: { markets: PolymarketMarket[]; xFeed: XPost[] }) {
  const tagged = useMemo(() => {
    const stopWords = new Set(['will', 'the', 'by', 'in', 'on', 'at', 'to', 'of', 'for', 'is', 'be', 'end', 'march', 'april', '2026', '2027'])
    const kws = new Map<string, PolymarketMarket[]>()
    for (const m of markets.slice(0, 20)) {
      const terms = m.question.replace(/[?!.,'"]/g, '').split(/\s+/).filter(w => w.length > 3 && !stopWords.has(w.toLowerCase())).map(w => w.toLowerCase()).slice(0, 4)
      for (const t of terms) { const ex = kws.get(t) || []; ex.push(m); kws.set(t, ex) }
    }
    const results: { tweet: XPost; markets: PolymarketMarket[] }[] = []
    for (const tw of xFeed) {
      const txt = tw.text.toLowerCase()
      const matched = new Set<PolymarketMarket>()
      for (const [term, mkts] of kws) { if (txt.includes(term)) mkts.forEach(m => matched.add(m)) }
      if (matched.size > 0) results.push({ tweet: tw, markets: Array.from(matched) })
    }
    return results.slice(0, 5)
  }, [markets, xFeed])

  if (tagged.length === 0) return null
  return (
    <div style={{ marginTop: 32, marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 700 }}>𝕏</span>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Social Pulse</h3>
        <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>CT chatter relevant to active markets</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: '1px solid var(--border-subtle)', borderRadius: 8, overflow: 'hidden' }}>
        {tagged.map(({ tweet, markets: mm }, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 16px', borderBottom: i < tagged.length - 1 ? '1px solid var(--border-subtle)' : 'none', background: 'var(--bg-surface-2)' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-primary)' }}>@{tweet.handle}</span>
                {tweet.verified && <span style={{ fontSize: 10, color: '#3B82F6' }}>✓</span>}
                <span style={{ fontSize: 10, color: 'var(--text-quaternary)', fontFamily: 'var(--font-mono)' }}>· {tweet.time}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>{tweet.text}</div>
            </div>
            <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
              {mm.slice(0, 2).map((m, mi) => {
                const prob = (m._parsedPrices?.[0] || 0.5) * 100
                return (
                  <div key={mi} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 8px', borderRadius: 4, background: 'var(--bg-surface-3)', border: '1px solid var(--border-subtle)', maxWidth: 220 }}>
                    <span style={{ fontSize: 10, color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{m.question.length > 30 ? m.question.slice(0, 28) + '...' : m.question}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', color: prob > 65 ? 'var(--data-positive)' : prob < 35 ? 'var(--data-negative)' : 'var(--text-primary)', flexShrink: 0 }}>{prob.toFixed(0)}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════ */
/* PORTFOLIO SIMULATOR                                           */
/* ══════════════════════════════════════════════════════════════ */

interface SimPosition { marketId: string; question: string; side: 'yes' | 'no'; amount: number; probability: number }

function PortfolioSimulator({ positions, setPositions, isOpen, setIsOpen }: { positions: SimPosition[]; setPositions: (p: SimPosition[]) => void; isOpen: boolean; setIsOpen: (o: boolean) => void }) {
  const totalInvested = positions.reduce((s, p) => s + p.amount, 0)
  const maxPayout = positions.reduce((s, p) => { const cost = p.side === 'yes' ? p.probability : (1 - p.probability); return s + (cost > 0 ? p.amount / cost : 0) }, 0)
  const maxReturn = totalInvested > 0 ? ((maxPayout - totalInvested) / totalInvested) * 100 : 0

  return (
    <div style={{ marginTop: 32, marginBottom: 24 }}>
      <button onClick={() => setIsOpen(!isOpen)} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '12px 16px', background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)', borderRadius: isOpen ? '8px 8px 0 0' : 8, cursor: 'pointer', color: 'var(--text-primary)' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
        <span style={{ fontSize: 13, fontWeight: 600 }}>Portfolio Simulator</span>
        {positions.length > 0 && <span style={{ padding: '2px 8px', borderRadius: 10, background: 'var(--accent-primary-bg)', color: 'var(--accent-primary)', fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{positions.length}</span>}
        <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-quaternary)' }}>Paper trading · No real money</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 200ms' }}><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      {isOpen && (
        <div style={{ border: '1px solid var(--border-default)', borderTop: 'none', borderRadius: '0 0 8px 8px', background: 'var(--bg-surface-2)', padding: 16 }}>
          {positions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-tertiary)', fontSize: 12.5 }}>Click <strong>Yes</strong> or <strong>No</strong> on any card to add to your simulator.</div>
          ) : (
            <>
              {positions.map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < positions.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <span style={{ padding: '2px 8px', borderRadius: 4, border: `1px solid ${p.side === 'yes' ? 'var(--data-positive)' : 'var(--data-negative)'}`, color: p.side === 'yes' ? 'var(--data-positive)' : 'var(--data-negative)', fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-mono)', flexShrink: 0 }}>{p.side.toUpperCase()}</span>
                  <span style={{ flex: 1, fontSize: 12, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.question}</span>
                  <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', flexShrink: 0 }}>@ {(p.probability * 100).toFixed(0)}¢</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>$</span>
                    <input type="number" value={p.amount} onChange={e => { const v = Math.max(1, Number(e.target.value) || 0); setPositions(positions.map((x, j) => j === i ? { ...x, amount: v } : x)) }} style={{ width: 60, height: 26, padding: '0 6px', borderRadius: 4, border: '1px solid var(--border-default)', background: 'var(--bg-base)', color: 'var(--text-primary)', fontSize: 12, fontFamily: 'var(--font-mono)', textAlign: 'right', outline: 'none' }} />
                  </div>
                  <button onClick={() => setPositions(positions.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: 'var(--text-quaternary)', cursor: 'pointer', padding: 4, flexShrink: 0 }}>×</button>
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border-default)' }}>
                {[
                  { label: 'INVESTED', value: `$${totalInvested.toFixed(0)}`, color: 'var(--text-primary)' },
                  { label: 'MAX PAYOUT', value: `$${maxPayout.toFixed(0)}`, color: 'var(--data-positive)' },
                  { label: 'MAX RETURN', value: `+${maxReturn.toFixed(0)}%`, color: 'var(--data-positive)' },
                  { label: 'POSITIONS', value: `${positions.length}`, color: 'var(--text-primary)' },
                ].map((s, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-quaternary)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em', marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-mono)', color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════ */
/* MARKET DETAIL MODAL                                           */
/* ══════════════════════════════════════════════════════════════ */

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
          <div style={{ marginBottom: 24 }}>
            {outcomes.map((o, i) => {
              const prob = prices[i] ? prices[i] * 100 : 0
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < outcomes.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: 'var(--text-primary)' }}>{o}</span>
                  <div style={{ width: 140, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.04)', overflow: 'hidden' }}><div style={{ width: `${prob}%`, height: '100%', borderRadius: 4, background: prob > 50 ? 'var(--data-positive)' : 'var(--data-negative)', opacity: 0.7 }} /></div>
                  <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-mono)', color: prob > 65 ? 'var(--data-positive)' : prob < 35 ? 'var(--data-negative)' : 'var(--text-primary)', width: 60, textAlign: 'right' }}>{prob.toFixed(1)}%</span>
                </div>
              )
            })}
          </div>
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
              {chartLoading || !history.length ? <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-quaternary)', fontSize: 12 }}>{chartLoading ? 'Loading...' : 'No chart data available'}</div> : <DetailChart history={history} height={160} />}
            </div>
          </div>
          {market.description && <div style={{ marginBottom: 24 }}><h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Resolution Details</h4><p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text-tertiary)', margin: 0, maxHeight: 120, overflow: 'auto' }}>{market.description}</p></div>}
          <div style={{ background: 'var(--pelican-bg)', border: '1px solid var(--pelican-border)', borderRadius: 10, padding: 18, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, var(--pelican-gradient-start), var(--pelican-gradient-end))', opacity: 0.5 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, marginTop: 4 }}>
              <img src="/images/pelican-logo.png" alt="" width={24} height={24} style={{ objectFit: 'contain' }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>PELICAN ANALYSIS</span>
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text-secondary)' }}>
              This market has {formatVolume(market.volume24hr || 0)} in 24h volume. {(prices[0] ?? 0.5) > 0.7 ? 'High confidence in the primary outcome.' : (prices[0] ?? 0.5) < 0.3 ? 'Primary outcome unlikely — contrarian opportunity.' : 'Market is divided.'} Track 5%+ probability shifts as signal events.
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

function DetailChart({ history, height = 160 }: { history: PriceHistoryPoint[]; height?: number }) {
  if (!history || history.length < 2) return null
  const w = 600, pad = 4, cH = height - pad * 2 - 12
  const prices = history.map(h => h.p)
  const min = Math.min(...prices) * 0.95, max = Math.max(...prices) * 1.05, range = max - min || 0.01
  const pts = history.map((h, i) => ({ x: (i / (history.length - 1)) * w, y: pad + (1 - (h.p - min) / range) * cH }))
  const first = pts[0], last = pts[pts.length - 1]
  if (!first || !last) return null
  let path = `M ${first.x},${first.y}`
  for (let i = 1; i < pts.length; i++) { const p = pts[i - 1]!, c = pts[i]!; path += ` C ${(p.x + c.x) / 2},${p.y} ${(p.x + c.x) / 2},${c.y} ${c.x},${c.y}` }
  return (
    <svg viewBox={`0 0 ${w} ${height}`} style={{ width: '100%', height, display: 'block' }} preserveAspectRatio="none">
      <defs><linearGradient id="dcg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.2" /><stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0" /></linearGradient></defs>
      <path d={`${path} L ${last.x},${pad + cH} L ${first.x},${pad + cH} Z`} fill="url(#dcg)" />
      <path d={path} fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" />
      <circle cx={last.x} cy={last.y} r="4" fill="var(--accent-primary)" stroke="var(--bg-surface-2)" strokeWidth="2" />
    </svg>
  )
}
