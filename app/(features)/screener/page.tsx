'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { usePolymarkets, usePolymarketSearch, usePriceHistory } from '@/hooks/use-polymarket'
import { useProbabilityShifts, type ProbabilityShift } from '@/hooks/use-probability-shifts'
import { detectContrarianSignals, type ContrarianSignal } from '@/lib/contrarian-detector'
import { categorizeMarket, formatVolume, getPolymarketUrl, type PolymarketMarket, type PriceHistoryPoint } from '@/lib/polymarket'
import { MOCK_X_FEED, type XPost } from '@/lib/crypto-mock-data'

const CATS = ['all', 'contrarian', 'crypto', 'macro', 'regulatory', 'geopolitical', 'sports', 'other'] as const
const WL_KEY = 'ta-poly-wl'
const mono: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }

/* ════════════════════════════════════════════════════════════ */
/* PAGE                                                        */
/* ════════════════════════════════════════════════════════════ */

export default function PredictionsPage() {
  const [cat, setCat] = useState<string>('all')
  const [q, setQ] = useState('')
  const [dq, setDq] = useState('')
  const [sel, setSel] = useState<PolymarketMarket | null>(null)
  const [wl, setWl] = useState<string[]>([])
  const [wlOnly, setWlOnly] = useState(false)
  const [simPos, setSimPos] = useState<SimPos[]>([])
  const [simOpen, setSimOpen] = useState(false)

  useEffect(() => { const t = setTimeout(() => setDq(q), 300); return () => clearTimeout(t) }, [q])
  useEffect(() => { try { const s = localStorage.getItem(WL_KEY); if (s) setWl(JSON.parse(s)) } catch {} }, [])
  const saveWl = useCallback((ids: string[]) => { setWl(ids); localStorage.setItem(WL_KEY, JSON.stringify(ids)) }, [])
  const toggleWl = useCallback((id: string) => saveWl(wl.includes(id) ? wl.filter(x => x !== id) : [...wl, id]), [wl, saveWl])
  const addSim = useCallback((m: PolymarketMarket, side: 'yes' | 'no') => {
    const p = m._parsedPrices || []; setSimPos(prev => [...prev, { id: m.conditionId || m.id, q: m.question, side, amt: 100, prob: side === 'yes' ? (p[0] || 0.5) : (p[1] || 0.5) }]); setSimOpen(true)
  }, [])

  const { markets, isLoading } = usePolymarkets({ limit: 500 })
  const { results: sr, isLoading: sl } = usePolymarketSearch(dq)
  const shifts = useProbabilityShifts(markets)
  const signals = useMemo(() => detectContrarianSignals(markets), [markets])
  const sigMap = useMemo(() => new Map(signals.map(s => [s.market.conditionId || s.market.id, s])), [signals])

  const activeMarkets = useMemo(() => {
    const src = dq.length >= 2 ? sr : markets
    return src.filter(m => {
      const p = m._parsedPrices || []
      // Skip fully resolved (0/1 or 1/0)
      const p0 = p[0] ?? 0.5, p1 = p[1] ?? 0.5
      if (p.length >= 2 && ((p0 >= 0.99 && p1 <= 0.01) || (p0 <= 0.01 && p1 >= 0.99))) return false
      return true
    })
  }, [markets, sr, dq])

  const display = useMemo(() => {
    let src = activeMarkets
    if (wlOnly) src = src.filter(m => wl.includes(m.conditionId || m.id))
    if (cat === 'contrarian') { const ids = new Set(signals.map(s => s.market.conditionId || s.market.id)); src = src.filter(m => ids.has(m.conditionId || m.id)) }
    else if (cat !== 'all') src = src.filter(m => categorizeMarket(m) === cat)
    return src
  }, [activeMarkets, cat, wlOnly, wl, signals])

  return (
    <div style={{ padding: '20px 24px', background: 'var(--bg-base)', minHeight: '100vh' }}>

      {/* ── Header ──────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>Prediction Room</h1>
        <a href="https://polymarket.com" target="_blank" rel="noopener noreferrer" style={{ padding: '3px 8px', borderRadius: 4, background: 'rgba(139,127,199,0.1)', border: '1px solid rgba(139,127,199,0.2)', color: 'var(--accent-violet)', fontSize: 10, fontWeight: 600, ...mono, textDecoration: 'none' }}>POLYMARKET</a>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--data-positive)', boxShadow: '0 0 4px var(--data-positive)' }} />
          <span style={{ fontSize: 10, color: 'var(--text-quaternary)', ...mono }}>{activeMarkets.length} LIVE</span>
        </div>
      </div>

      {/* ── Shift Ticker ────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.04) 0%, rgba(62,189,140,0.02) 100%)', border: '1px solid rgba(139,92,246,0.12)', borderRadius: 10, marginBottom: 14, overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.3), rgba(62,189,140,0.2), transparent)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', borderBottom: '1px solid rgba(139,92,246,0.08)' }}>
          <div style={{ width: 18, height: 18, borderRadius: 5, background: 'rgba(139,92,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--accent-primary)', ...mono }}>PROBABILITY SHIFTS</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginLeft: 'auto' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: shifts.length > 0 ? 'var(--data-positive)' : 'var(--accent-primary)', boxShadow: shifts.length > 0 ? '0 0 6px var(--data-positive)' : '0 0 4px rgba(139,92,246,0.4)', animation: shifts.length > 0 ? undefined : undefined }} />
            <span style={{ fontSize: 9, color: 'var(--text-tertiary)', ...mono }}>{shifts.length > 0 ? `${shifts.length} detected` : `Monitoring ${markets.length} markets`}</span>
          </div>
        </div>
        <div style={{ display: 'flex', overflowX: 'auto', padding: '8px 10px', gap: 8, scrollbarWidth: 'none' }}>
          {shifts.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', width: '100%' }}>
              <div style={{ display: 'flex', gap: 3 }}>
                {[0.6, 0.8, 1, 0.8, 0.6].map((o, i) => <div key={i} style={{ width: 2, height: 8 + i * 2, borderRadius: 1, background: 'var(--accent-primary)', opacity: o * 0.3 }} />)}
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Watching for 2%+ probability moves across all markets</span>
            </div>
          ) : shifts.slice(0, 10).map((s, i) => (
            <div key={i} onClick={() => setSel(s.market)} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px',
              background: s.direction === 'up' ? 'rgba(62,189,140,0.06)' : 'rgba(224,101,101,0.06)',
              borderRadius: 8,
              border: `1px solid ${s.direction === 'up' ? 'rgba(62,189,140,0.15)' : 'rgba(224,101,101,0.15)'}`,
              flexShrink: 0, cursor: 'pointer', transition: 'all 120ms',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = s.direction === 'up' ? 'rgba(62,189,140,0.12)' : 'rgba(224,101,101,0.12)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = s.direction === 'up' ? 'rgba(62,189,140,0.06)' : 'rgba(224,101,101,0.06)'; e.currentTarget.style.transform = 'translateY(0)' }}>
              <div style={{ width: 20, height: 20, borderRadius: 5, background: s.direction === 'up' ? 'rgba(62,189,140,0.15)' : 'rgba(224,101,101,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 10, color: s.direction === 'up' ? 'var(--data-positive)' : 'var(--data-negative)', fontWeight: 700 }}>{s.direction === 'up' ? '▲' : '▼'}</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-primary)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.market.question}</span>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                <span style={{ fontSize: 13, fontWeight: 700, ...mono, color: s.direction === 'up' ? 'var(--data-positive)' : 'var(--data-negative)', lineHeight: 1 }}>{s.currentProb.toFixed(0)}%</span>
                <span style={{ fontSize: 9, fontWeight: 600, ...mono, color: s.direction === 'up' ? 'var(--data-positive)' : 'var(--data-negative)', opacity: 0.7, lineHeight: 1 }}>{s.direction === 'up' ? '+' : ''}{s.delta.toFixed(1)}pp</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Search ──────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 42, padding: '0 14px', background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)', borderRadius: 8, marginBottom: 14 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search prediction markets..." style={{ flex: 1, border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none' }} />
        {q && <button onClick={() => setQ('')} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: 14, padding: 2 }}>×</button>}
        {sl && <span style={{ fontSize: 10, color: 'var(--text-quaternary)', ...mono }}>...</span>}
      </div>

      {/* ── Filters ─────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 5, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
        {CATS.map(c => (
          <button key={c} onClick={() => { setCat(c); setWlOnly(false) }} style={{
            height: 26, padding: '0 10px', borderRadius: 5, fontSize: 11, fontWeight: 500, cursor: 'pointer', transition: 'all 100ms',
            border: '1px solid', fontFamily: 'var(--font-sans)',
            borderColor: cat === c && !wlOnly ? 'var(--accent-primary-muted)' : 'var(--border-subtle)',
            background: cat === c && !wlOnly ? 'var(--accent-primary-bg)' : 'transparent',
            color: cat === c && !wlOnly ? 'var(--accent-primary)' : 'var(--text-quaternary)',
          }}>{c === 'contrarian' ? '⚡ Contrarian' : c.charAt(0).toUpperCase() + c.slice(1)}</button>
        ))}
        <div style={{ width: 1, height: 16, background: 'var(--border-subtle)', margin: '0 4px' }} />
        <button onClick={() => setWlOnly(!wlOnly)} style={{
          height: 26, padding: '0 10px', borderRadius: 5, fontSize: 11, fontWeight: 500, cursor: 'pointer', border: '1px solid',
          borderColor: wlOnly ? 'var(--accent-primary-muted)' : 'var(--border-subtle)', background: wlOnly ? 'var(--accent-primary-bg)' : 'transparent',
          color: wlOnly ? 'var(--accent-primary)' : 'var(--text-quaternary)',
        }}>★ Saved{wl.length > 0 ? ` (${wl.length})` : ''}</button>
      </div>

      {/* ── States ──────────────────────────────────────── */}
      {isLoading && !markets.length && <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-tertiary)', fontSize: 13 }}>Loading prediction markets...</div>}
      {!isLoading && display.length === 0 && <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-quaternary)', fontSize: 13 }}>{wlOnly ? 'No saved markets. Star ★ any card to save it.' : q ? `No markets for "${q}"` : 'No markets for this filter.'}</div>}

      {/* ── Card Grid ───────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 10 }}>
        {display.map(m => {
          const id = m.conditionId || m.id
          return <Card key={id} m={m} sig={sigMap.get(id)} wl={wl.includes(id)} onWl={() => toggleWl(id)} onSel={() => setSel(m)} onSim={addSim} />
        })}
      </div>

      {/* ── Resolution Calendar ─────────────────────────── */}
      <Calendar markets={activeMarkets} />

      {/* ── Social Pulse ────────────────────────────────── */}
      <Pulse markets={activeMarkets} xFeed={MOCK_X_FEED} />

      {/* ── Portfolio Simulator ─────────────────────────── */}
      <Simulator pos={simPos} setPos={setSimPos} open={simOpen} setOpen={setSimOpen} />

      {/* ── Detail Modal ────────────────────────────────── */}
      {sel && <Detail m={sel} onClose={() => setSel(null)} />}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════ */
/* CARD                                                        */
/* ════════════════════════════════════════════════════════════ */

function Card({ m, sig, wl, onWl, onSel, onSim }: { m: PolymarketMarket; sig?: ContrarianSignal; wl: boolean; onWl: () => void; onSel: () => void; onSim: (m: PolymarketMarket, s: 'yes' | 'no') => void }) {
  const outcomes = m._parsedOutcomes || ['Yes', 'No']
  const prices = m._parsedPrices || []
  const prob = prices[0] ? prices[0] * 100 : 50
  const probColor = prob > 65 ? 'var(--data-positive)' : prob < 35 ? 'var(--data-negative)' : 'var(--accent-primary)'

  // Deterministic sparkline from probability + market ID
  const spark = useMemo(() => {
    const base = prob / 100, pts: number[] = []
    let seed = (m.conditionId || m.id || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    for (let i = 0; i < 20; i++) { seed = (seed * 16807) % 2147483647; pts.push(Math.max(0.02, Math.min(0.98, base + ((seed % 1000) / 1000 - 0.5) * 0.25 * (1 - i / 20)))) }
    pts.push(base)
    return pts
  }, [prob, m.conditionId, m.id])

  return (
    <div onClick={onSel} style={{
      background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)', borderRadius: 10,
      padding: 0, cursor: 'pointer', transition: 'border-color 120ms, box-shadow 120ms, transform 120ms', position: 'relative', overflow: 'hidden',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      {/* Sparkline chart area — top of card */}
      <div style={{ height: 48, position: 'relative' }}>
        <MiniSparkline data={spark} color={probColor} />
        {/* Star overlay */}
        <button onClick={e => { e.stopPropagation(); onWl() }} style={{ position: 'absolute', top: 6, right: 8, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: wl ? 'var(--data-warning)' : 'rgba(255,255,255,0.3)', zIndex: 2, padding: 2 }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--data-warning)' }} onMouseLeave={e => { if (!wl) e.currentTarget.style.color = 'rgba(255,255,255,0.3)' }}>
          {wl ? '★' : '☆'}
        </button>
        {/* Contrarian — subtle top-left tag */}
        {sig && <div style={{ position: 'absolute', top: 6, left: 8, display: 'inline-flex', alignItems: 'center', gap: 3, padding: '1px 5px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', borderRadius: 3, zIndex: 2 }}>
          <span style={{ fontSize: 8, fontWeight: 700, ...mono, color: 'var(--accent-violet)', letterSpacing: '0.04em' }}>⚡ CONTRARIAN</span>
        </div>}
      </div>

      {/* Content below chart */}
      <div style={{ padding: '10px 14px 12px' }}>
        {/* Question */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          {m.image && <img src={m.image} alt="" style={{ width: 22, height: 22, borderRadius: 4, objectFit: 'cover', flexShrink: 0, background: 'var(--bg-surface-3)' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />}
          <h3 style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3, flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden', margin: 0 }}>{m.question}</h3>
        </div>

        {/* Outcomes — clean layout */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          {outcomes.slice(0, 2).map((o, i) => {
            const p = (prices[i] ?? 0) * 100
            const isY = o.toLowerCase() === 'yes', isN = o.toLowerCase() === 'no'
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{o}</span>
                <span style={{ fontSize: 14, fontWeight: 700, ...mono, color: p > 65 ? 'var(--data-positive)' : p < 35 ? 'var(--data-negative)' : 'var(--text-primary)' }}>{p.toFixed(0)}%</span>
                {(isY || isN) && <button onClick={e => { e.stopPropagation(); onSim(m, isY ? 'yes' : 'no') }} style={{ padding: '1px 6px', borderRadius: 3, border: `1px solid ${isY ? 'rgba(62,189,140,0.25)' : 'rgba(224,101,101,0.25)'}`, color: isY ? 'var(--data-positive)' : 'var(--data-negative)', background: 'transparent', fontSize: 9, fontWeight: 600, cursor: 'pointer', ...mono }}
                  onMouseEnter={e => { e.currentTarget.style.background = isY ? 'rgba(62,189,140,0.1)' : 'rgba(224,101,101,0.1)' }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>{o}</button>}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10, color: 'var(--text-quaternary)', ...mono }}>
          <span>{formatVolume(m.volume24hr || m.volume || 0)}</span>
          {m.endDate && <span>{new Date(m.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
          <a href={getPolymarketUrl(m)} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ color: 'var(--accent-violet)', textDecoration: 'none', fontWeight: 500, fontSize: 10 }}>Polymarket ↗</a>
        </div>
      </div>
    </div>
  )
}

/* ── Mini Sparkline (fills card top area) ───────────────── */
function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const w = 300, h = 48, pad = 2, cH = h - pad
  const min = Math.min(...data) * 0.9, max = Math.max(...data) * 1.1, range = max - min || 0.01
  const pts = data.map((v, i) => ({ x: (i / (data.length - 1)) * w, y: pad + (1 - (v - min) / range) * cH }))
  const f = pts[0], l = pts[pts.length - 1]
  if (!f || !l) return <div style={{ height: h }} />
  let d = `M ${f.x},${f.y}`
  for (let i = 1; i < pts.length; i++) { const p = pts[i - 1]!, c = pts[i]!; d += ` C ${(p.x + c.x) / 2},${p.y} ${(p.x + c.x) / 2},${c.y} ${c.x},${c.y}` }
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: h, display: 'block' }} preserveAspectRatio="none">
      <defs><linearGradient id="mcg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.2" /><stop offset="100%" stopColor={color} stopOpacity="0.02" /></linearGradient></defs>
      <path d={`${d} L ${l.x},${h} L ${f.x},${h} Z`} fill="url(#mcg)" />
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
    </svg>
  )
}

/* ════════════════════════════════════════════════════════════ */
/* DETAIL MODAL                                                */
/* ════════════════════════════════════════════════════════════ */

function Detail({ m, onClose }: { m: PolymarketMarket; onClose: () => void }) {
  const [iv, setIv] = useState('1m')
  const tid = m._parsedTokenIds?.[0] || ''
  const { history, isLoading: cl } = usePriceHistory(tid, iv)
  const oc = m._parsedOutcomes || ['Yes', 'No']
  const pr = m._parsedPrices || []

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 70, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 71, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px', pointerEvents: 'none' }}>
        <div style={{ width: '100%', maxWidth: 680, maxHeight: 'calc(100vh - 64px)', background: 'var(--bg-surface-1)', border: '1px solid var(--border-default)', borderRadius: 16, boxShadow: '0 24px 64px rgba(0,0,0,0.6)', overflow: 'hidden', display: 'flex', flexDirection: 'column', pointerEvents: 'auto' }}>

          {/* Header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-default)', display: 'flex', gap: 14, flexShrink: 0 }}>
            {m.image && <img src={m.image} alt="" style={{ width: 46, height: 46, borderRadius: 10, objectFit: 'cover', background: 'var(--bg-surface-3)', flexShrink: 0 }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.35, margin: '0 0 5px' }}>{m.question}</h2>
              <div style={{ display: 'flex', gap: 7, fontSize: 11, color: 'var(--text-tertiary)', ...mono, flexWrap: 'wrap' }}>
                <span>{formatVolume(m.volume || 0)} total</span>
                <span style={{ color: 'var(--border-default)' }}>·</span>
                <span>{formatVolume(m.volume24hr || 0)} 24h</span>
                <span style={{ color: 'var(--border-default)' }}>·</span>
                <span>{formatVolume(m.liquidity || 0)} liq</span>
                {m.endDate && <><span style={{ color: 'var(--border-default)' }}>·</span><span>Exp {new Date(m.endDate).toLocaleDateString()}</span></>}
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'var(--bg-surface-3)', border: '1px solid var(--border-default)', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', cursor: 'pointer', flexShrink: 0, fontSize: 16, fontWeight: 300 }}>×</button>
          </div>

          {/* Scrollable body */}
          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
            {/* Outcomes */}
            <div style={{ padding: '14px 20px', display: 'flex', gap: 10 }}>
              {oc.slice(0, 2).map((o, i) => {
                const p = pr[i] ? pr[i]! * 100 : 0
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--bg-surface-2)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)' }}>{o}</span>
                    <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.04)', overflow: 'hidden' }}>
                      <div style={{ width: `${p}%`, height: '100%', borderRadius: 3, background: p > 50 ? 'var(--data-positive)' : 'var(--data-negative)', opacity: 0.7 }} />
                    </div>
                    <span style={{ fontSize: 19, fontWeight: 700, ...mono, color: p > 65 ? 'var(--data-positive)' : p < 35 ? 'var(--data-negative)' : 'var(--text-primary)' }}>{p.toFixed(1)}%</span>
                  </div>
                )
              })}
            </div>

            {/* Chart */}
            <div style={{ padding: '0 20px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Probability History</span>
                <div style={{ display: 'flex', gap: 1, background: 'var(--bg-surface-3)', borderRadius: 6, padding: 2 }}>
                  {['1d', '1w', '1m', 'max'].map(x => <button key={x} onClick={() => setIv(x)} style={{ height: 24, padding: '0 9px', borderRadius: 4, border: 'none', background: iv === x ? 'var(--accent-primary-bg)' : 'transparent', color: iv === x ? 'var(--accent-primary)' : 'var(--text-quaternary)', fontSize: 10, fontWeight: 600, ...mono, cursor: 'pointer' }}>{x.toUpperCase()}</button>)}
                </div>
              </div>
              <div style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '12px 14px' }}>
                {cl || !history.length ? <div style={{ height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-quaternary)', fontSize: 11, ...mono }}>{cl ? 'Loading chart...' : 'No data for this interval'}</div> : <Chart h={history} height={130} />}
              </div>
            </div>

            {/* Description */}
            {m.description && (
              <div style={{ padding: '0 20px 14px' }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-quaternary)', ...mono, letterSpacing: '0.04em', marginBottom: 5 }}>RESOLUTION DETAILS</div>
                <p style={{ fontSize: 12.5, lineHeight: 1.6, color: 'var(--text-tertiary)', margin: 0, maxHeight: 90, overflow: 'auto' }}>{m.description}</p>
              </div>
            )}

            {/* Pelican */}
            <div style={{ padding: '0 20px 16px' }}>
              <div style={{ background: 'var(--pelican-bg)', border: '1px solid var(--pelican-border)', borderRadius: 8, padding: '14px 16px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, var(--pelican-gradient-start), var(--pelican-gradient-end))', opacity: 0.4 }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7, marginTop: 1 }}>
                  <img src="/images/pelican-logo.png" alt="" width={20} height={20} style={{ objectFit: 'contain' }} />
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--accent-primary)', ...mono }}>PELICAN ANALYSIS</span>
                </div>
                <div style={{ fontSize: 12.5, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                  {formatVolume(m.volume24hr || 0)} in 24h volume · {formatVolume(m.liquidity || 0)} liquidity.
                  {(pr[0] ?? 0.5) > 0.7 ? ' High confidence — watch for any reversal signals.' : (pr[0] ?? 0.5) < 0.3 ? ' Low probability priced in — potential contrarian edge.' : ' Market divided — catalysts could swing this either direction.'} Track 5%+ shifts as signal events.
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: '11px 20px', borderTop: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 10, color: 'var(--text-quaternary)', ...mono }}>POLYMARKET · LIVE DATA</span>
            <a href={getPolymarketUrl(m)} target="_blank" rel="noopener noreferrer" style={{ height: 32, padding: '0 16px', borderRadius: 6, background: 'var(--accent-violet)', color: 'white', fontSize: 12, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5 }}>Trade on Polymarket ↗</a>
          </div>
        </div>
      </div>
    </>
  )
}

/* ── Chart ──────────────────────────────────────────────── */
function Chart({ h, height = 150 }: { h: PriceHistoryPoint[]; height?: number }) {
  if (h.length < 2) return null
  const w = 620, pad = 4, cH = height - pad * 2 - 10
  const ps = h.map(x => x.p)
  const mn = Math.min(...ps) * 0.95, mx = Math.max(...ps) * 1.05, rng = mx - mn || 0.01
  const pts = h.map((x, i) => ({ x: (i / (h.length - 1)) * w, y: pad + (1 - (x.p - mn) / rng) * cH }))
  const f = pts[0], l = pts[pts.length - 1]
  if (!f || !l) return null
  let d = `M ${f.x},${f.y}`
  for (let i = 1; i < pts.length; i++) { const p = pts[i - 1]!, c = pts[i]!; d += ` C ${(p.x + c.x) / 2},${p.y} ${(p.x + c.x) / 2},${c.y} ${c.x},${c.y}` }
  return (
    <svg viewBox={`0 0 ${w} ${height}`} style={{ width: '100%', height, display: 'block' }} preserveAspectRatio="none">
      <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.18" /><stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0" /></linearGradient></defs>
      <path d={`${d} L ${l.x},${pad + cH} L ${f.x},${pad + cH} Z`} fill="url(#cg)" />
      <path d={d} fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" />
      <circle cx={l.x} cy={l.y} r="4" fill="var(--accent-primary)" stroke="var(--bg-surface-2)" strokeWidth="2" />
    </svg>
  )
}

/* ── Calendar ──────────────────────────────────────────── */
function Calendar({ markets }: { markets: PolymarketMarket[] }) {
  const groups = useMemo(() => {
    const g = new Map<string, { d: string; ms: PolymarketMarket[]; v: number }>()
    for (const m of markets) { if (!m.endDate) continue; const k = m.endDate.split('T')[0] ?? ''; const e = g.get(k) || { d: k, ms: [], v: 0 }; e.ms.push(m); e.v += (m.volume || 0); g.set(k, e) }
    return Array.from(g.values()).sort((a, b) => a.d.localeCompare(b.d)).filter(x => new Date(x.d) >= new Date()).slice(0, 8)
  }, [markets])
  if (groups.length === 0) return null
  return (
    <div style={{ marginTop: 28, marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Resolution Calendar</span>
      </div>
      <div style={{ display: 'flex', gap: 0, overflowX: 'auto', scrollbarWidth: 'none' }}>
        {groups.map((g, i) => {
          const d = new Date(g.d + 'T00:00:00'); const soon = d.getTime() - Date.now() < 7 * 86400000
          return <div key={g.d} style={{ width: 140, flexShrink: 0, padding: '10px 12px', background: soon ? 'rgba(224,101,101,0.03)' : 'var(--bg-surface-2)', border: '1px solid var(--border-subtle)', borderRight: i < groups.length - 1 ? 'none' : undefined, borderRadius: i === 0 ? '8px 0 0 8px' : i === groups.length - 1 ? '0 8px 8px 0' : 0 }}>
            <div style={{ fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-mono)', color: soon ? 'var(--data-negative)' : 'var(--text-primary)', marginBottom: 1 }}>{d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
            <div style={{ fontSize: 8, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-quaternary)', textTransform: 'uppercase', marginBottom: 5 }}>{d.toLocaleDateString('en-US', { weekday: 'short' })}</div>
            <div style={{ fontSize: 9, color: 'var(--text-tertiary)', marginBottom: 4 }}>{g.ms.length} · {formatVolume(g.v)}</div>
            {g.ms.slice(0, 2).map((m, j) => <div key={j} style={{ fontSize: 9, color: 'var(--text-quaternary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>{m.question.slice(0, 30)}{m.question.length > 30 ? '…' : ''}</div>)}
          </div>
        })}
      </div>
    </div>
  )
}

/* ── Social Pulse ──────────────────────────────────────── */
function Pulse({ markets, xFeed }: { markets: PolymarketMarket[]; xFeed: XPost[] }) {
  const tagged = useMemo(() => {
    const stop = new Set(['will', 'the', 'by', 'in', 'on', 'march', 'april', '2026', '2027'])
    const kws = new Map<string, PolymarketMarket[]>()
    for (const m of markets.slice(0, 20)) { m.question.replace(/[?!.,'"]/g, '').split(/\s+/).filter(w => w.length > 3 && !stop.has(w.toLowerCase())).map(w => w.toLowerCase()).slice(0, 4).forEach(t => { const e = kws.get(t) || []; e.push(m); kws.set(t, e) }) }
    const r: { tw: XPost; ms: PolymarketMarket[] }[] = []
    for (const tw of xFeed) { const txt = tw.text.toLowerCase(); const matched = new Set<PolymarketMarket>(); for (const [t, ms] of kws) { if (txt.includes(t)) ms.forEach(x => matched.add(x)) }; if (matched.size > 0) r.push({ tw, ms: Array.from(matched) }) }
    return r.slice(0, 4)
  }, [markets, xFeed])
  if (tagged.length === 0) return null
  return (
    <div style={{ marginTop: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}><span style={{ fontSize: 13, fontWeight: 700 }}>𝕏</span><span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Social Pulse</span></div>
      <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 8, overflow: 'hidden' }}>
        {tagged.map(({ tw, ms }, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 14px', borderBottom: i < tagged.length - 1 ? '1px solid var(--border-subtle)' : 'none', background: 'var(--bg-surface-2)' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}><span style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent-primary)' }}>@{tw.handle}</span>{tw.verified && <span style={{ fontSize: 9, color: '#3B82F6' }}>✓</span>}<span style={{ fontSize: 9, color: 'var(--text-quaternary)', fontFamily: 'var(--font-mono)' }}>· {tw.time}</span></div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>{tw.text}</div>
            </div>
            <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-end' }}>
              {ms.slice(0, 2).map((m, j) => { const p = (m._parsedPrices?.[0] || 0.5) * 100; return <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 6px', borderRadius: 3, background: 'var(--bg-surface-3)', fontSize: 9, maxWidth: 200 }}><span style={{ color: 'var(--text-quaternary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{m.question.slice(0, 25)}…</span><span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: p > 65 ? 'var(--data-positive)' : p < 35 ? 'var(--data-negative)' : 'var(--text-primary)', flexShrink: 0 }}>{p.toFixed(0)}%</span></div> })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Portfolio Simulator ───────────────────────────────── */
interface SimPos { id: string; q: string; side: 'yes' | 'no'; amt: number; prob: number }

function Simulator({ pos, setPos, open, setOpen }: { pos: SimPos[]; setPos: (p: SimPos[]) => void; open: boolean; setOpen: (o: boolean) => void }) {
  const ti = pos.reduce((s, p) => s + p.amt, 0)
  const mp = pos.reduce((s, p) => { const c = p.side === 'yes' ? p.prob : (1 - p.prob); return s + (c > 0 ? p.amt / c : 0) }, 0)
  const mr = ti > 0 ? ((mp - ti) / ti) * 100 : 0


  return (
    <div style={{ marginTop: 28, marginBottom: 20 }}>
      <button onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '10px 14px', background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)', borderRadius: open ? '8px 8px 0 0' : 8, cursor: 'pointer', color: 'var(--text-primary)' }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
        <span style={{ fontSize: 12, fontWeight: 600 }}>Portfolio Simulator</span>
        {pos.length > 0 && <span style={{ padding: '1px 7px', borderRadius: 10, background: 'var(--accent-primary-bg)', color: 'var(--accent-primary)', fontSize: 9, fontWeight: 700, ...mono }}>{pos.length}</span>}
        <span style={{ marginLeft: 'auto', fontSize: 9, color: 'var(--text-quaternary)' }}>Paper trading</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 150ms' }}><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      {open && (
        <div style={{ border: '1px solid var(--border-default)', borderTop: 'none', borderRadius: '0 0 8px 8px', background: 'var(--bg-surface-2)', padding: 14 }}>
          {pos.length === 0 ? <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-quaternary)', fontSize: 12 }}>Click Yes/No on cards to simulate positions</div> : (
            <>
              {pos.map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: i < pos.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <span style={{ padding: '1px 6px', borderRadius: 3, border: `1px solid ${p.side === 'yes' ? 'var(--data-positive)' : 'var(--data-negative)'}`, color: p.side === 'yes' ? 'var(--data-positive)' : 'var(--data-negative)', fontSize: 9, fontWeight: 700, ...mono }}>{p.side.toUpperCase()}</span>
                  <span style={{ flex: 1, fontSize: 11, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.q}</span>
                  <span style={{ fontSize: 10, ...mono, color: 'var(--text-quaternary)' }}>@{(p.prob * 100).toFixed(0)}¢</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>$</span>
                    <input type="number" value={p.amt} onChange={e => setPos(pos.map((x, j) => j === i ? { ...x, amt: Math.max(1, Number(e.target.value) || 0) } : x))} style={{ width: 52, height: 22, padding: '0 4px', borderRadius: 3, border: '1px solid var(--border-default)', background: 'var(--bg-base)', color: 'var(--text-primary)', fontSize: 11, ...mono, textAlign: 'right', outline: 'none' }} />
                  </div>
                  <button onClick={() => setPos(pos.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: 'var(--text-quaternary)', cursor: 'pointer', padding: 2, fontSize: 13 }}>×</button>
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border-default)' }}>
                {[{ l: 'INVESTED', v: `$${ti.toFixed(0)}`, c: 'var(--text-primary)' }, { l: 'MAX PAYOUT', v: `$${mp.toFixed(0)}`, c: 'var(--data-positive)' }, { l: 'MAX RETURN', v: `+${mr.toFixed(0)}%`, c: 'var(--data-positive)' }, { l: 'POSITIONS', v: `${pos.length}`, c: 'var(--text-primary)' }].map((s, i) => (
                  <div key={i}><div style={{ fontSize: 8, fontWeight: 600, color: 'var(--text-quaternary)', ...mono, letterSpacing: '0.04em', marginBottom: 3 }}>{s.l}</div><div style={{ fontSize: 15, fontWeight: 700, ...mono, color: s.c }}>{s.v}</div></div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
