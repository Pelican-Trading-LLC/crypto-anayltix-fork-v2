'use client'

import { useState, useMemo, useEffect } from 'react'
import { TokenIcon, FlowBar, FilterPill, InsightsButton } from '@/components/shared'
import { formatPrice, formatCompact, formatPercent } from '@/lib/format'
import { useKrakenTickers } from '@/hooks/use-kraken'
import { parseTradeCSV, type ParsedTrade } from '@/lib/csv-parser'
import { DEMO_POSITIONS, DEMO_TRADE_HISTORY, DEMO_EQUITY_CURVE, type DemoPosition } from '@/lib/positions-data'

type SubTab = 'holdings' | 'history' | 'performance' | 'connections'

export default function PositionsPage() {
  const [hasData, setHasData] = useState(false)
  const [subTab, setSubTab] = useState<SubTab>('holdings')
  const [positions, setPositions] = useState<DemoPosition[]>([])
  const [tradeHistory, setTradeHistory] = useState<ParsedTrade[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [historyFilter, setHistoryFilter] = useState('All')
  const [showModal, setShowModal] = useState<'exchange' | 'wallet' | null>(null)

  // Load persisted data
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ta-positions')
      const savedTrades = localStorage.getItem('ta-trade-history')
      if (saved) { setPositions(JSON.parse(saved)); setHasData(true) }
      if (savedTrades) setTradeHistory(JSON.parse(savedTrades))
    } catch { /* ignore */ }
  }, [])

  // Kraken live prices for position symbols
  const posSymbols = useMemo(() => positions.map(p => p.symbol), [positions])
  const { tickerMap } = useKrakenTickers(posSymbols)

  // Hydrate positions with live prices
  const livePositions = useMemo(() => positions.map(pos => {
    const live = tickerMap.get(pos.symbol)
    if (!live) return pos
    return {
      ...pos,
      currentPrice: live.price,
      marketValue: pos.quantity * live.price,
      unrealizedPnl: (live.price - pos.averageCost) * pos.quantity,
      unrealizedPnlPercent: pos.averageCost > 0 ? ((live.price - pos.averageCost) / pos.averageCost) * 100 : 0,
      dayChange: live.changeAbs24h * pos.quantity,
      dayChangePercent: live.change24h,
    }
  }), [positions, tickerMap])

  // Portfolio totals
  const totals = useMemo(() => {
    const totalValue = livePositions.reduce((s, p) => s + p.marketValue, 0)
    const totalUnrealized = livePositions.reduce((s, p) => s + p.unrealizedPnl, 0)
    const totalDayChange = livePositions.reduce((s, p) => s + p.dayChange, 0)
    const totalCost = livePositions.reduce((s, p) => s + (p.averageCost * p.quantity), 0)
    const dayPct = totalValue > 0 ? (totalDayChange / (totalValue - totalDayChange)) * 100 : 0
    return { totalValue, totalUnrealized, totalDayChange, dayPct, totalCost }
  }, [livePositions])

  const maxMarketValue = useMemo(() => Math.max(...livePositions.map(p => p.marketValue), 1), [livePositions])

  // Load demo data
  const loadDemo = () => {
    setPositions(DEMO_POSITIONS)
    setTradeHistory(DEMO_TRADE_HISTORY)
    setHasData(true)
    localStorage.setItem('ta-positions', JSON.stringify(DEMO_POSITIONS))
    localStorage.setItem('ta-trade-history', JSON.stringify(DEMO_TRADE_HISTORY))
  }

  // CSV upload
  const handleCSV = (file: File) => {
    if (file.size > 10 * 1024 * 1024) { alert('File too large. Max 10MB.'); return }
    file.text().then(content => {
      const trades = parseTradeCSV(content)
      if (trades.length === 0) { alert('No trades found. Check your CSV format.'); return }
      const newHistory = [...tradeHistory, ...trades]
      setTradeHistory(newHistory)
      localStorage.setItem('ta-trade-history', JSON.stringify(newHistory))
      setHasData(true)
      setSubTab('history')
    })
  }

  // Filtered trade history
  const filteredHistory = useMemo(() => {
    if (historyFilter === 'All') return tradeHistory
    if (historyFilter === 'Buy' || historyFilter === 'Sell') return tradeHistory.filter(t => t.type === historyFilter)
    return tradeHistory.filter(t => t.symbol === historyFilter)
  }, [tradeHistory, historyFilter])

  const thStyle: React.CSSProperties = { fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-quaternary)', padding: '0 8px' }

  // ═════════════════════════════════════════════════════════════
  // EMPTY STATE
  // ═════════════════════════════════════════════════════════════
  if (!hasData) {
    return (
      <div
        style={{ padding: '32px 28px', minHeight: '100vh', background: 'var(--bg-base)', border: isDragging ? '2px dashed var(--accent-primary)' : '2px dashed transparent', borderRadius: 12, transition: 'all 200ms' }}
        onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={e => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f?.name.match(/\.(csv|tsv)$/i)) handleCSV(f) }}
      >
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Positions</h1>
        <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 32 }}>Track your portfolio across exchanges, wallets, and manual imports.</p>

        <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
          {/* Connect Exchange */}
          <div style={{ flex: 1, background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)', borderRadius: 12, padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--accent-primary-bg)', border: '1px solid var(--accent-primary-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="2" y1="9" x2="22" y2="9"/><line x1="12" y1="9" x2="12" y2="21"/></svg>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Connect Exchange</h3>
            <p style={{ fontSize: 12.5, color: 'var(--text-tertiary)', lineHeight: 1.5, marginBottom: 16, maxWidth: 240 }}>Link your broker via SnapTrade. Read-only access. Supports Coinbase, Kraken, Binance, and 50+ others.</p>
            <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
              {['CB', 'KR', 'BN', 'GM', 'KC'].map(ex => (
                <div key={ex} style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--bg-surface-3)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: 'var(--text-quaternary)', fontFamily: 'var(--font-mono)' }}>{ex}</div>
              ))}
              <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--bg-surface-3)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: 'var(--text-quaternary)' }}>50+</div>
            </div>
            <button onClick={() => setShowModal('exchange')} style={{ height: 38, padding: '0 20px', borderRadius: 8, background: 'var(--accent-primary)', border: 'none', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Connect Exchange</button>
            <div style={{ fontSize: 10, color: 'var(--text-quaternary)', marginTop: 8 }}>Powered by SnapTrade · Read-only</div>
          </div>

          {/* Connect Wallet */}
          <div style={{ flex: 1, background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)', borderRadius: 12, padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(139,127,199,0.08)', border: '1px solid rgba(139,127,199,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-violet)" strokeWidth="1.5"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z"/></svg>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Connect Wallet</h3>
            <p style={{ fontSize: 12.5, color: 'var(--text-tertiary)', lineHeight: 1.5, marginBottom: 16, maxWidth: 240 }}>Track on-chain positions in real time. Supports Ethereum, Solana, Base, Arbitrum.</p>
            <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
              {['ETH', 'SOL', 'BASE', 'ARB'].map(c => (
                <div key={c} style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--bg-surface-3)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: 'var(--text-quaternary)', fontFamily: 'var(--font-mono)' }}>{c}</div>
              ))}
            </div>
            <button onClick={() => setShowModal('wallet')} style={{ height: 38, padding: '0 20px', borderRadius: 8, background: 'var(--accent-violet)', border: 'none', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Connect Wallet</button>
            <div style={{ fontSize: 10, color: 'var(--text-quaternary)', marginTop: 8 }}>Read-only · Your keys stay with you</div>
          </div>

          {/* Import CSV */}
          <div style={{ flex: 1, background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)', borderRadius: 12, padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(212,160,66,0.08)', border: '1px solid rgba(212,160,66,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--data-warning)" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="12" y2="12"/><line x1="15" y1="15" x2="12" y2="12"/></svg>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Import CSV</h3>
            <p style={{ fontSize: 12.5, color: 'var(--text-tertiary)', lineHeight: 1.5, marginBottom: 16, maxWidth: 240 }}>Upload trade history from any exchange. Supports Coinbase, Binance, Kraken, custom formats.</p>
            <label style={{ height: 38, padding: '0 20px', borderRadius: 8, background: 'var(--bg-surface-3)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              Upload CSV
              <input type="file" accept=".csv,.tsv" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleCSV(f) }} />
            </label>
            <div style={{ fontSize: 10, color: 'var(--text-quaternary)', marginTop: 8 }}>Drag & drop supported · Max 10MB</div>
          </div>
        </div>

        {/* Demo button */}
        <div style={{ textAlign: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: 20 }}>
          <span style={{ fontSize: 12, color: 'var(--text-quaternary)', marginRight: 12 }}>Or start with demo data</span>
          <button onClick={loadDemo} style={{ height: 34, padding: '0 16px', borderRadius: 6, background: 'var(--bg-surface-3)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
            Load Demo Portfolio
          </button>
        </div>

        {/* Modal */}
        {showModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setShowModal(null)}>
            <div onClick={e => e.stopPropagation()} style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)', borderRadius: 16, padding: 32, maxWidth: 400, textAlign: 'center' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                {showModal === 'exchange' ? 'Connect Exchange via SnapTrade' : 'Connect Wallet'}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-tertiary)', lineHeight: 1.6, marginBottom: 20 }}>
                {showModal === 'exchange' ? 'SnapTrade integration is being configured. In the meantime, load the demo portfolio or import a CSV.' : 'Wallet connection is coming soon. Load the demo portfolio or import a CSV to get started.'}
              </p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                <button onClick={() => { loadDemo(); setShowModal(null) }} style={{ height: 38, padding: '0 20px', borderRadius: 8, background: 'var(--accent-primary)', border: 'none', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Load Demo Portfolio</button>
                <button onClick={() => setShowModal(null)} style={{ height: 38, padding: '0 16px', borderRadius: 8, background: 'var(--bg-surface-3)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ═════════════════════════════════════════════════════════════
  // CONNECTED STATE
  // ═════════════════════════════════════════════════════════════
  return (
    <div style={{ padding: '24px 28px', minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Positions</h1>
        <button onClick={() => { setHasData(false); setPositions([]); setTradeHistory([]); localStorage.removeItem('ta-positions'); localStorage.removeItem('ta-trade-history') }} style={{ height: 30, padding: '0 12px', borderRadius: 6, background: 'var(--bg-surface-3)', border: '1px solid var(--border-default)', color: 'var(--text-tertiary)', fontSize: 11, cursor: 'pointer' }}>Reset</button>
      </div>

      {/* Portfolio Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'TOTAL VALUE', value: formatCompact(totals.totalValue), color: 'var(--text-primary)' },
          { label: '24H P&L', value: `${totals.totalDayChange >= 0 ? '+' : ''}${formatCompact(totals.totalDayChange)} (${totals.dayPct >= 0 ? '+' : ''}${totals.dayPct.toFixed(2)}%)`, color: totals.totalDayChange >= 0 ? 'var(--data-positive)' : 'var(--data-negative)' },
          { label: 'UNREALIZED', value: `${totals.totalUnrealized >= 0 ? '+' : ''}${formatCompact(totals.totalUnrealized)}`, color: totals.totalUnrealized >= 0 ? 'var(--data-positive)' : 'var(--data-negative)' },
          { label: 'REALIZED', value: '+$3,220', color: 'var(--data-positive)' },
          { label: 'WIN RATE', value: '64%', color: 'var(--data-positive)' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', color: 'var(--text-quaternary)', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: s.color, fontFamily: 'var(--font-mono)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border-default)', marginBottom: 20 }}>
        {(['holdings', 'history', 'performance', 'connections'] as SubTab[]).map(t => (
          <button key={t} onClick={() => setSubTab(t)} style={{
            padding: '8px 18px', fontSize: 12.5, fontWeight: subTab === t ? 600 : 400,
            color: subTab === t ? 'var(--accent-primary)' : 'var(--text-tertiary)',
            background: 'none', border: 'none', borderBottom: subTab === t ? '2px solid var(--accent-primary)' : '2px solid transparent',
            cursor: 'pointer', marginBottom: -1, textTransform: 'capitalize',
          }}>{t}</button>
        ))}
      </div>

      {/* ── Holdings Tab ─────────────────────────────────── */}
      {subTab === 'holdings' && (
        <>
          {/* Allocation bars */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 16, height: 8, borderRadius: 4, overflow: 'hidden' }}>
            {livePositions.sort((a, b) => b.marketValue - a.marketValue).map(p => {
              const pct = totals.totalValue > 0 ? (p.marketValue / totals.totalValue) * 100 : 0
              return <div key={p.symbol} title={`${p.symbol} ${pct.toFixed(1)}%`} style={{ width: `${pct}%`, background: `hsl(${hashHue(p.symbol)}, 45%, 45%)`, borderRadius: 2, minWidth: pct > 0 ? 4 : 0 }} />
            })}
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ height: 34, background: 'var(--bg-surface-2)', borderBottom: '1px solid var(--border-default)' }}>
                  <th style={{ ...thStyle, width: 160, textAlign: 'left' }}>Token</th>
                  <th style={{ ...thStyle, width: 100, textAlign: 'right' }}>Quantity</th>
                  <th style={{ ...thStyle, width: 100, textAlign: 'right' }}>Avg Cost</th>
                  <th style={{ ...thStyle, width: 100, textAlign: 'right' }}>Price</th>
                  <th style={{ ...thStyle, width: 130, textAlign: 'right' }}>Market Value</th>
                  <th style={{ ...thStyle, width: 150, textAlign: 'right' }}>Unrealized P&L</th>
                  <th style={{ ...thStyle, width: 100, textAlign: 'right' }}>Day Chg</th>
                  <th style={{ ...thStyle, width: 80, textAlign: 'center' }}>Exchange</th>
                  <th style={{ ...thStyle, width: 48, textAlign: 'center' }}>
                    <img src="/images/pelican-logo.png" alt="" width={18} height={18} style={{ objectFit: 'contain', opacity: 0.5 }} />
                  </th>
                </tr>
              </thead>
              <tbody>
                {livePositions.sort((a, b) => b.marketValue - a.marketValue).map(pos => (
                  <tr key={pos.symbol} style={{ height: 44, borderBottom: '1px solid var(--border-subtle)', transition: 'background 100ms' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-surface-3)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                    <td style={{ padding: '0 8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <TokenIcon symbol={pos.symbol} size={22} />
                        <div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{pos.symbol}</span>
                          <span style={{ fontSize: 11, color: 'var(--text-tertiary)', marginLeft: 6 }}>{pos.name}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right', padding: '0 8px', fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--text-primary)' }}>{pos.quantity.toLocaleString()}</td>
                    <td style={{ textAlign: 'right', padding: '0 8px', fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--text-tertiary)' }}>{formatPrice(pos.averageCost)}</td>
                    <td style={{ textAlign: 'right', padding: '0 8px', fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--text-primary)' }}>{formatPrice(pos.currentPrice)}</td>
                    <td style={{ textAlign: 'right', padding: '0 8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{formatCompact(pos.marketValue)}</span>
                        <FlowBar value={pos.marketValue} max={maxMarketValue} />
                      </div>
                    </td>
                    <td style={{ textAlign: 'right', padding: '0 8px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, fontWeight: 600, color: pos.unrealizedPnl >= 0 ? 'var(--data-positive)' : 'var(--data-negative)' }}>
                        {pos.unrealizedPnl >= 0 ? '+' : ''}{formatCompact(pos.unrealizedPnl)} ({formatPercent(pos.unrealizedPnlPercent)})
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', padding: '0 8px', fontFamily: 'var(--font-mono)', fontSize: 12, color: pos.dayChangePercent >= 0 ? 'var(--data-positive)' : 'var(--data-negative)' }}>
                      {formatPercent(pos.dayChangePercent)}
                    </td>
                    <td style={{ textAlign: 'center', padding: '0 8px' }}>
                      <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', background: 'var(--bg-surface-3)', padding: '2px 6px', borderRadius: 4, color: 'var(--text-tertiary)' }}>{pos.exchange}</span>
                    </td>
                    <td style={{ textAlign: 'center', padding: '0 8px' }}>
                      <InsightsButton iconOnly context={{ symbol: pos.symbol, name: pos.name, price: pos.currentPrice, change24h: pos.dayChangePercent, extra: `Position: ${pos.quantity} ${pos.symbol} @ avg $${pos.averageCost}. P&L: ${formatPercent(pos.unrealizedPnlPercent)}` }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── Trade History Tab ────────────────────────────── */}
      {subTab === 'history' && (
        <>
          <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
            {['All', 'Buy', 'Sell'].map(f => <FilterPill key={f} label={f} active={historyFilter === f} onClick={() => setHistoryFilter(f)} />)}
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ height: 34, background: 'var(--bg-surface-2)', borderBottom: '1px solid var(--border-default)' }}>
                  <th style={{ ...thStyle, width: 150, textAlign: 'left' }}>Date</th>
                  <th style={{ ...thStyle, width: 60, textAlign: 'center' }}>Type</th>
                  <th style={{ ...thStyle, width: 80, textAlign: 'left' }}>Token</th>
                  <th style={{ ...thStyle, width: 100, textAlign: 'right' }}>Quantity</th>
                  <th style={{ ...thStyle, width: 100, textAlign: 'right' }}>Price</th>
                  <th style={{ ...thStyle, width: 100, textAlign: 'right' }}>Total</th>
                  <th style={{ ...thStyle, width: 80, textAlign: 'right' }}>Fee</th>
                  <th style={{ ...thStyle, width: 90, textAlign: 'center' }}>Exchange</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((t, i) => (
                  <tr key={i} style={{ height: 40, borderBottom: '1px solid var(--border-subtle)', transition: 'background 100ms' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-surface-3)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                    <td style={{ padding: '0 8px', fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--text-tertiary)' }}>{t.date}</td>
                    <td style={{ textAlign: 'center', padding: '0 8px' }}>
                      <span style={{ fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-mono)', color: t.type === 'Buy' ? 'var(--data-positive)' : 'var(--data-negative)' }}>{t.type.toUpperCase()}</span>
                    </td>
                    <td style={{ padding: '0 8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <TokenIcon symbol={t.symbol} size={18} />
                        <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>{t.symbol}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right', padding: '0 8px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-primary)' }}>{t.quantity.toLocaleString()}</td>
                    <td style={{ textAlign: 'right', padding: '0 8px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>{formatPrice(t.price)}</td>
                    <td style={{ textAlign: 'right', padding: '0 8px', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{formatCompact(t.total)}</td>
                    <td style={{ textAlign: 'right', padding: '0 8px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-quaternary)' }}>${t.fee.toFixed(2)}</td>
                    <td style={{ textAlign: 'center', padding: '0 8px' }}>
                      <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', background: 'var(--bg-surface-3)', padding: '2px 6px', borderRadius: 4, color: 'var(--text-tertiary)' }}>{t.exchange}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredHistory.length === 0 && <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-quaternary)', fontSize: 13 }}>No trades match the current filter</div>}
        </>
      )}

      {/* ── Performance Tab ──────────────────────────────── */}
      {subTab === 'performance' && (
        <>
          {/* Equity Curve */}
          <div style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)', borderRadius: 10, padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 12 }}>EQUITY CURVE</div>
            <svg width="100%" height={180} viewBox={`0 0 ${DEMO_EQUITY_CURVE.length * 40} 180`} preserveAspectRatio="none" style={{ display: 'block' }}>
              <defs>
                <linearGradient id="eq-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              {(() => {
                const d = DEMO_EQUITY_CURVE
                const min = Math.min(...d) * 0.98, max = Math.max(...d) * 1.02, range = max - min
                const w = d.length * 40, h = 180
                const pts = d.map((v, i) => `${(i / (d.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ')
                const area = `${pts} ${w},${h} 0,${h}`
                return <>
                  <polygon points={area} fill="url(#eq-grad)" />
                  <polyline points={pts} fill="none" stroke="var(--accent-primary)" strokeWidth={2} />
                </>
              })()}
            </svg>
          </div>

          {/* Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
            {[
              { label: 'Total Return', value: '+$8,412 (+22.1%)', color: 'var(--data-positive)' },
              { label: 'Best Trade', value: 'SOL +$1,120 (+40.6%)', color: 'var(--data-positive)' },
              { label: 'Worst Trade', value: 'ETH -$1,134 (-11.0%)', color: 'var(--data-negative)' },
              { label: 'Sharpe Ratio', value: '1.84', color: 'var(--accent-primary)' },
              { label: 'Win Rate', value: '64% (7/11)', color: 'var(--data-positive)' },
              { label: 'Avg Win', value: '+$682.40', color: 'var(--data-positive)' },
              { label: 'Avg Loss', value: '-$412.80', color: 'var(--data-negative)' },
              { label: 'Profit Factor', value: '2.31', color: 'var(--accent-primary)' },
            ].map((m, i) => (
              <div key={i} style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '12px 14px' }}>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', color: 'var(--text-quaternary)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>{m.label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: m.color, fontFamily: 'var(--font-mono)' }}>{m.value}</div>
              </div>
            ))}
          </div>

          {/* Pelican Portfolio Insights */}
          <div style={{ background: 'var(--pelican-bg)', border: '1px solid var(--pelican-border)', borderRadius: 10, padding: 20, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, var(--pelican-gradient-start), var(--pelican-gradient-end))', opacity: 0.5 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, marginTop: 4 }}>
              <img src="/images/pelican-logo.png" alt="" width={24} height={24} style={{ objectFit: 'contain' }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>PORTFOLIO INSIGHTS</span>
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text-secondary)' }}>
              Your portfolio is concentrated in large-cap assets (BTC 38%, ETH 18%) which reduces volatility but limits upside.
              Your Solana ecosystem exposure (SOL + JUP + PENDLE) makes up 21% and has been your strongest performer this month at +28% combined.
              Consider: your ETH position is underwater at -11%. Historical pattern shows ETH tends to lag BTC by 2-3 weeks in recovery cycles —
              the current BTC strength could signal an ETH recovery window ahead. Your win rate of 64% is solid but your average
              loss ($412) is 60% of your average win ($682) — tightening stops could improve your profit factor above 2.5.
            </div>
          </div>
        </>
      )}

      {/* ── Connections Tab ───────────────────────────────── */}
      {subTab === 'connections' && (
        <div>
          <div style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)', borderRadius: 10, padding: 16, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--data-positive)', boxShadow: '0 0 6px var(--data-positive)' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Demo Portfolio</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>8 positions · {tradeHistory.length} trades</div>
            </div>
            <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-quaternary)' }}>Connected</span>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button onClick={() => setShowModal('exchange')} style={{ height: 34, padding: '0 14px', borderRadius: 6, background: 'var(--bg-surface-3)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer' }}>+ Connect Exchange</button>
            <button onClick={() => setShowModal('wallet')} style={{ height: 34, padding: '0 14px', borderRadius: 6, background: 'var(--bg-surface-3)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer' }}>+ Connect Wallet</button>
            <label style={{ height: 34, padding: '0 14px', borderRadius: 6, background: 'var(--bg-surface-3)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
              Import CSV
              <input type="file" accept=".csv,.tsv" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleCSV(f) }} />
            </label>
          </div>

          {/* Modal reuse */}
          {showModal && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setShowModal(null)}>
              <div onClick={e => e.stopPropagation()} style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)', borderRadius: 16, padding: 32, maxWidth: 400, textAlign: 'center' }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                  {showModal === 'exchange' ? 'Connect Exchange via SnapTrade' : 'Connect Wallet'}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-tertiary)', lineHeight: 1.6, marginBottom: 20 }}>
                  This feature is being configured. Stay tuned!
                </p>
                <button onClick={() => setShowModal(null)} style={{ height: 38, padding: '0 20px', borderRadius: 8, background: 'var(--accent-primary)', border: 'none', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Got it</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function hashHue(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h)
  return Math.abs(h) % 360
}
