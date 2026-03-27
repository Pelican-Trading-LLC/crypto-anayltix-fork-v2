'use client'

import React, { useState, useMemo } from 'react'
import { MagnifyingGlass, SquaresFour, Table as TableIcon } from '@phosphor-icons/react'
import { TokenIcon, ChainBadge, FlowBar, FilterPill, TimeToggle, InsightsButton, Sparkline } from '@/components/shared'
import { formatPrice, formatCompact, formatPercent, formatInteger } from '@/lib/format'
import { MOCK_TOKENS, MOCK_WALLETS, CALENDAR_EVENTS } from '@/lib/crypto-mock-data'
import type { MockToken, MockWallet } from '@/lib/crypto-mock-data'

/* ─── Types ─────────────────────────────────────────────────── */

type SortColumn =
  | 'symbol' | 'price' | 'change24h' | 'marketCap' | 'traders'
  | 'volume' | 'liquidity' | 'inflows' | 'outflows' | 'netFlows'
type SortDir = 'asc' | 'desc'
type Tab = 'default' | 'watchlist'
type ViewMode = 'table' | 'heatmap'

/* ─── Sort Indicator ────────────────────────────────────────── */

function SortIndicator({ column, sortColumn, sortDirection }: {
  column: SortColumn
  sortColumn: SortColumn
  sortDirection: SortDir
}) {
  const isActive = column === sortColumn
  return (
    <span className="inline-flex flex-col leading-none ml-1 -mb-px select-none" style={{ fontSize: 8, lineHeight: '8px' }}>
      <span style={{ color: isActive && sortDirection === 'asc' ? 'var(--text-primary)' : 'var(--text-quaternary)' }}>&#9650;</span>
      <span style={{ color: isActive && sortDirection === 'desc' ? 'var(--text-primary)' : 'var(--text-quaternary)' }}>&#9660;</span>
    </span>
  )
}

/* ─── Suggested Pill ────────────────────────────────────────── */

function SuggestedPill({ text }: { text: string }) {
  return (
    <button
      style={{
        height: 32,
        padding: '0 14px',
        fontSize: 12,
        borderRadius: 20,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid var(--border-subtle)',
        color: 'var(--text-tertiary)',
        cursor: 'pointer',
        transition: 'all 120ms',
        fontFamily: 'var(--font-sans)',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-primary-muted)'; e.currentTarget.style.color = 'var(--accent-primary)'; e.currentTarget.style.background = 'var(--accent-primary-bg)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
    >
      {text}
    </button>
  )
}

/* ─── Dashboard Page ────────────────────────────────────────── */

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('default')
  const [timeRange, setTimeRange] = useState('24h')
  const [walletTimeRange, setWalletTimeRange] = useState('30D')
  const [sortColumn, setSortColumn] = useState<SortColumn>('volume')
  const [sortDirection, setSortDirection] = useState<SortDir>('desc')
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [draggedCol, setDraggedCol] = useState<SortColumn | null>(null)

  /* Column order for drag-to-reorder */
  const DATA_COLS: SortColumn[] = ['price', 'change24h', 'marketCap', 'traders', 'volume', 'liquidity', 'inflows', 'outflows', 'netFlows']
  const [columnOrder, setColumnOrder] = useState<SortColumn[]>(() => {
    if (typeof window !== 'undefined') {
      try { const s = localStorage.getItem('ta-col-order'); if (s) return JSON.parse(s) } catch {}
    }
    return DATA_COLS
  })

  const handleColDrop = (targetCol: SortColumn) => {
    if (draggedCol && draggedCol !== targetCol) {
      const newOrder = [...columnOrder]
      const fromIdx = newOrder.indexOf(draggedCol)
      const toIdx = newOrder.indexOf(targetCol)
      if (fromIdx !== -1 && toIdx !== -1) {
        newOrder.splice(fromIdx, 1)
        newOrder.splice(toIdx, 0, draggedCol)
        setColumnOrder(newOrder)
        if (typeof window !== 'undefined') localStorage.setItem('ta-col-order', JSON.stringify(newOrder))
      }
    }
    setDraggedCol(null)
  }

  const dragProps = (col: SortColumn) => ({
    draggable: true,
    onDragStart: () => setDraggedCol(col),
    onDragOver: (e: React.DragEvent) => e.preventDefault(),
    onDrop: () => handleColDrop(col),
    onDragEnd: () => setDraggedCol(null),
  })

  /* Fallback safely if mock data not available */
  const tokens: MockToken[] = MOCK_TOKENS ?? []
  const wallets: MockWallet[] = MOCK_WALLETS ?? []

  /* Sorted tokens */
  const sortedTokens = useMemo(() => {
    const copy = [...tokens]
    copy.sort((a, b) => {
      let aVal: number | string = 0
      let bVal: number | string = 0
      switch (sortColumn) {
        case 'symbol': aVal = a.symbol; bVal = b.symbol; break
        case 'price': aVal = a.price; bVal = b.price; break
        case 'change24h': aVal = a.change24h; bVal = b.change24h; break
        case 'marketCap': aVal = a.marketCap; bVal = b.marketCap; break
        case 'traders': aVal = a.traders; bVal = b.traders; break
        case 'volume': aVal = a.volume; bVal = b.volume; break
        case 'liquidity': aVal = a.liquidity; bVal = b.liquidity; break
        case 'inflows': aVal = a.inflows; bVal = b.inflows; break
        case 'outflows': aVal = a.outflows; bVal = b.outflows; break
        case 'netFlows': aVal = a.netFlows; bVal = b.netFlows; break
      }
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }
      return sortDirection === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number)
    })
    return copy
  }, [tokens, sortColumn, sortDirection])

  /* Column maximums for FlowBars */
  const maxVolume = useMemo(() => Math.max(...tokens.map(t => Math.abs(t.volume)), 1), [tokens])
  const maxInflows = useMemo(() => Math.max(...tokens.map(t => Math.abs(t.inflows)), 1), [tokens])
  const maxOutflows = useMemo(() => Math.max(...tokens.map(t => Math.abs(t.outflows)), 1), [tokens])
  const maxNetFlows = useMemo(() => Math.max(...tokens.map(t => Math.abs(t.netFlows)), 1), [tokens])

  /* Wallet FlowBar maxes */
  const maxWalletPnl = useMemo(() => Math.max(...wallets.map(w => Math.abs(w.realizedPnl)), 1), [wallets])
  const maxWalletRoi = useMemo(() => Math.max(...wallets.map(w => Math.abs(w.roi)), 1), [wallets])

  const handleSort = (col: SortColumn) => {
    if (sortColumn === col) {
      setSortDirection(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(col)
      setSortDirection('desc')
    }
  }

  const thStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--text-tertiary)',
    whiteSpace: 'nowrap',
    cursor: 'grab',
    userSelect: 'none',
    padding: '0 8px',
  }

  /* Column config for drag-reorder */
  const COL_CFG: Record<SortColumn, { label: string; width: number; align: 'left' | 'right' | 'center' }> = {
    symbol: { label: 'Token', width: 160, align: 'left' },
    price: { label: 'Price', width: 96, align: 'right' },
    change24h: { label: 'Chg 24h', width: 88, align: 'right' },
    marketCap: { label: 'MCap', width: 88, align: 'right' },
    traders: { label: 'Traders', width: 68, align: 'right' },
    volume: { label: 'Volume', width: 130, align: 'right' },
    liquidity: { label: 'Liquidity', width: 100, align: 'right' },
    inflows: { label: 'Inflows', width: 130, align: 'right' },
    outflows: { label: 'Outflows', width: 130, align: 'right' },
    netFlows: { label: 'Net Flows', width: 130, align: 'right' },
  }

  const renderDataCell = (col: SortColumn, token: MockToken) => {
    const mono: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: 12, fontVariantNumeric: 'tabular-nums' }
    switch (col) {
      case 'price': return <span style={{ ...mono, color: 'var(--text-primary)' }}>{formatPrice(token.price)}</span>
      case 'change24h': return <span style={{ ...mono, color: token.change24h >= 0 ? 'var(--data-positive)' : 'var(--data-negative)' }}>{formatPercent(token.change24h)}</span>
      case 'marketCap': return <span style={{ ...mono, color: 'var(--text-secondary)' }}>{formatCompact(token.marketCap)}</span>
      case 'traders': return <span style={{ ...mono, color: 'var(--text-tertiary)' }}>{formatInteger(token.traders)}</span>
      case 'volume': return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}><span style={{ ...mono, color: 'var(--text-primary)' }}>{formatCompact(token.volume)}</span><FlowBar value={token.volume} max={maxVolume} /></div>
      case 'liquidity': return <span style={{ ...mono, color: 'var(--text-secondary)' }}>{formatCompact(token.liquidity)}</span>
      case 'inflows': return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}><span style={{ ...mono, color: 'var(--text-primary)' }}>{formatCompact(token.inflows)}</span><FlowBar value={token.inflows} max={maxInflows} /></div>
      case 'outflows': return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}><span style={{ ...mono, color: 'var(--text-primary)' }}>{formatCompact(token.outflows)}</span><FlowBar value={-token.outflows} max={maxOutflows} /></div>
      case 'netFlows': return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}><span style={{ ...mono, color: token.netFlows >= 0 ? 'var(--data-positive)' : 'var(--data-negative)' }}>{formatCompact(token.netFlows)}</span><FlowBar value={token.netFlows} max={maxNetFlows} /></div>
      default: return null
    }
  }

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>

      {/* ─── Hero Section ──────────────────────────────────────── */}
      <section style={{ paddingTop: 40, paddingBottom: 28, textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <img
            src="/images/pelican-logo.png"
            alt="Pelican AI"
            width={100}
            height={100}
            style={{ objectFit: 'contain' }}
          />
        </div>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.03em',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          What&apos;s Moving Today?
        </h1>

        {/* Search bar */}
        <div style={{ maxWidth: 620, margin: '20px auto 0' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              height: 50,
              background: 'var(--bg-surface-2)',
              border: '1px solid var(--border-default)',
              borderRadius: 12,
              padding: '0 8px 0 18px',
              gap: 10,
              boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
              transition: 'border-color 150ms, box-shadow 150ms',
            }}
          >
            <MagnifyingGlass size={18} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Ask Pelican anything about the market..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: 14,
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
              }}
            />
            <button
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'var(--accent-primary)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(74,144,196,0.3)',
              }}
            >
              <img src="/images/pelican-logo.png" alt="Pelican" width={22} height={22} style={{ objectFit: 'contain', filter: 'brightness(10)' }} />
            </button>
          </div>
        </div>

        {/* Suggested pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 14 }}>
          <SuggestedPill text="What are smart money wallets buying?" />
          <SuggestedPill text="Why is SOL outperforming?" />
          <SuggestedPill text="Top tokens by net inflow" />
          <SuggestedPill text="Contrarian signals active" />
        </div>
      </section>

      {/* ─── Token Screener ────────────────────────────────────── */}
      <section style={{ padding: '0 24px 24px' }}>

        {/* Screener Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Token Screener</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span className="live-dot" />
              <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--data-positive)', fontWeight: 600 }}>LIVE</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>Last synced: 2s ago</span>
            <TimeToggle options={['5m', '1h', '6h', '24h']} value={timeRange} onChange={setTimeRange} />
          </div>
        </div>

        {/* Sub-tabs */}
        <div style={{ display: 'flex', gap: 20, borderBottom: '1px solid var(--border-subtle)', marginBottom: 12 }}>
          {(['default', 'watchlist'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 0',
                fontSize: 13,
                fontWeight: 500,
                color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-tertiary)',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid var(--accent-primary)' : '2px solid transparent',
                cursor: 'pointer',
                marginBottom: -1,
                fontFamily: 'var(--font-sans)',
              }}
            >
              {tab === 'default' ? 'Default' : 'Watchlist'}
            </button>
          ))}
        </div>

        {activeTab === 'default' ? (
          <>
            {/* Filter bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                <FilterPill label="Solana" active />
                <FilterPill label="Spot" active variant="spot" />
                <FilterPill label="Perps" />
                <FilterPill label="All Caps &#9662;" />
                <FilterPill label="Sectors &#9662;" />
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  onClick={() => setViewMode('table')}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 5,
                    border: '1px solid var(--border-default)',
                    background: viewMode === 'table' ? 'var(--accent-primary-bg)' : 'transparent',
                    color: viewMode === 'table' ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <TableIcon size={14} />
                </button>
                <button
                  onClick={() => setViewMode('heatmap')}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 5,
                    border: '1px solid var(--border-default)',
                    background: viewMode === 'heatmap' ? 'var(--accent-primary-bg)' : 'transparent',
                    color: viewMode === 'heatmap' ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <SquaresFour size={14} />
                </button>
              </div>
            </div>

            {viewMode === 'heatmap' ? (
              /* ─── Heatmap View ─────────────────────────────── */
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gridAutoRows: '80px',
                gap: 4,
                padding: '16px 0',
              }}>
                {sortedTokens.map((token, i) => {
                  const isLarge = i < 3
                  const isMedium = i >= 3 && i < 8
                  const change = token.change24h
                  const getHeatColor = (c: number) => {
                    if (c > 20) return 'rgba(62,189,140,0.5)'
                    if (c > 5) return 'rgba(62,189,140,0.3)'
                    if (c > 0) return 'rgba(62,189,140,0.12)'
                    if (c > -5) return 'rgba(224,101,101,0.12)'
                    if (c > -20) return 'rgba(224,101,101,0.3)'
                    return 'rgba(224,101,101,0.5)'
                  }
                  return (
                    <div
                      key={token.symbol}
                      style={{
                        gridColumn: isLarge ? 'span 2' : 'span 1',
                        gridRow: isLarge ? 'span 2' : isMedium ? 'span 2' : 'span 1',
                        background: getHeatColor(change),
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 6,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'filter 150ms',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.2)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.filter = 'brightness(1)' }}
                    >
                      <span style={{ fontSize: isLarge ? 16 : isMedium ? 14 : 12, fontWeight: 700, color: 'white' }}>{token.symbol}</span>
                      <span style={{ fontSize: isLarge ? 14 : 11, fontWeight: 600, color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                        {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                      </span>
                      {(isLarge || isMedium) && (
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>
                          {formatCompact(token.marketCap)}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
            /* ─── Token Screener Table ─────────────────────── */
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', minWidth: 1300, borderCollapse: 'collapse' }}>
                <thead>
                  <tr
                    style={{
                      height: 34,
                      background: 'var(--bg-surface-2)',
                      position: 'sticky',
                      top: 0,
                      zIndex: 10,
                      borderBottom: '1px solid var(--border-default)',
                    }}
                  >
                    {/* Fixed columns */}
                    <th style={{ ...thStyle, width: 48, textAlign: 'center', cursor: 'default' }}>Chain</th>
                    <th style={{ ...thStyle, width: 160, textAlign: 'left' }} onClick={() => handleSort('symbol')}>
                      Token <SortIndicator column="symbol" sortColumn={sortColumn} sortDirection={sortDirection} />
                    </th>
                    {/* Dynamic data columns — drag to reorder */}
                    {columnOrder.filter(c => c !== 'symbol').map(col => {
                      const cfg = COL_CFG[col]
                      if (!cfg) return null
                      return (
                        <React.Fragment key={col}>
                          {col === 'change24h' && <th style={{ ...thStyle, width: 68, textAlign: 'center', cursor: 'default' }}>7D</th>}
                          <th
                            {...dragProps(col)}
                            style={{ ...thStyle, width: cfg.width, textAlign: cfg.align, opacity: draggedCol === col ? 0.4 : 1 }}
                            onClick={() => handleSort(col)}
                          >
                            {cfg.label} <SortIndicator column={col} sortColumn={sortColumn} sortDirection={sortDirection} />
                          </th>
                        </React.Fragment>
                      )
                    })}
                    {/* Pelican insights — last column */}
                    <th style={{ ...thStyle, width: 52, textAlign: 'center', cursor: 'default' }}>
                      <img src="/images/pelican-logo.png" alt="Insights" width={22} height={22} style={{ objectFit: 'contain', opacity: 0.6, filter: 'brightness(1.3)' }} />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTokens.map(token => (
                    <tr
                      key={token.symbol}
                      style={{
                        height: 38,
                        borderBottom: '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        transition: 'background 100ms',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-surface-3)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                    >
                      {/* Fixed: Chain */}
                      <td style={{ textAlign: 'center', padding: '0 8px' }}><ChainBadge chain={token.chain} /></td>
                      {/* Fixed: Token */}
                      <td style={{ padding: '0 8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <TokenIcon symbol={token.symbol} size={22} />
                          <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>{token.symbol}</span>
                        </div>
                      </td>
                      {/* Dynamic data columns */}
                      {columnOrder.filter(c => c !== 'symbol').map(col => (
                        <React.Fragment key={col}>
                          {col === 'change24h' && (
                            <td style={{ textAlign: 'center', padding: '0 8px' }}>
                              <Sparkline data={token.sparkline7d} width={52} height={18} positive={token.change24h >= 0} />
                            </td>
                          )}
                          <td style={{ textAlign: COL_CFG[col]?.align || 'right', padding: '0 8px' }}>
                            {renderDataCell(col, token)}
                          </td>
                        </React.Fragment>
                      ))}
                      {/* Pelican insights — last column */}
                      <td style={{ textAlign: 'center', padding: '0 8px' }}>
                        <InsightsButton iconOnly context={{ symbol: token.symbol, name: token.name, price: token.price, change24h: token.change24h, volume: token.volume, netFlows: token.netFlows }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
          </>
        ) : (
          /* ─── Watchlist Tab ─────────────────────────────────── */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 24px', gap: 16 }}>
            <span style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>
              Add tokens to your watchlist
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                height: 38,
                width: 320,
                background: 'var(--bg-surface-2)',
                border: '1px solid var(--border-default)',
                borderRadius: 8,
                padding: '0 12px',
                gap: 8,
              }}
            >
              <MagnifyingGlass size={14} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search tokens..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: 13,
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-sans)',
                }}
              />
            </div>
          </div>
        )}
      </section>

      {/* ─── Most Profitable Addresses ─────────────────────────── */}
      <section style={{ padding: '0 24px 48px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Most Profitable Addresses</span>
          <TimeToggle options={['7D', '30D', '90D', '180D']} value={walletTimeRange} onChange={setWalletTimeRange} />
        </div>

        {/* Wallet Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ height: 34, background: 'var(--bg-surface-2)', borderBottom: '1px solid var(--border-default)' }}>
                <th style={{ ...thStyle, textAlign: 'left', cursor: 'default' }}>Name</th>
                <th style={{ ...thStyle, width: 180, textAlign: 'right', cursor: 'default' }}>Realized PnL</th>
                <th style={{ ...thStyle, width: 150, textAlign: 'right', cursor: 'default' }}>ROI</th>
                <th style={{ ...thStyle, width: 80, textAlign: 'right', cursor: 'default' }}>Win Rate</th>
                <th style={{ ...thStyle, width: 72, textAlign: 'center', cursor: 'default' }}>Insights</th>
              </tr>
            </thead>
            <tbody>
              {wallets.slice(0, 8).map(wallet => (
                <tr
                  key={wallet.address}
                  style={{
                    height: 38,
                    borderBottom: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'background 100ms',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-surface-3)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                >
                  {/* Name */}
                  <td style={{ padding: '0 8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 16 }}>{wallet.emoji}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{wallet.label}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-tertiary)' }}>{wallet.address}</span>
                    </div>
                  </td>

                  {/* Realized PnL */}
                  <td style={{ textAlign: 'right', padding: '0 8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 12.5,
                        fontVariantNumeric: 'tabular-nums',
                        color: 'var(--data-positive)',
                      }}>
                        {formatCompact(wallet.realizedPnl)}
                      </span>
                      <FlowBar value={wallet.realizedPnl} max={maxWalletPnl} />
                    </div>
                  </td>

                  {/* ROI */}
                  <td style={{ textAlign: 'right', padding: '0 8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 12.5,
                        fontVariantNumeric: 'tabular-nums',
                        color: 'var(--data-positive)',
                      }}>
                        {formatPercent(wallet.roi)}
                      </span>
                      <FlowBar value={wallet.roi} max={maxWalletRoi} />
                    </div>
                  </td>

                  {/* Win Rate */}
                  <td style={{
                    textAlign: 'right',
                    padding: '0 8px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12.5,
                    fontVariantNumeric: 'tabular-nums',
                    color: 'var(--text-primary)',
                  }}>
                    {wallet.winRate}%
                  </td>

                  {/* Insights */}
                  <td style={{ textAlign: 'center', padding: '0 8px' }}>
                    <InsightsButton context={{ symbol: wallet.label, name: wallet.label, extra: `Wallet ${wallet.address} — PnL: ${formatCompact(wallet.realizedPnl)}, ROI: ${formatPercent(wallet.roi)}, Win rate: ${wallet.winRate}%` }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── Upcoming Events ───────────────────────────────── */}
      <section style={{ padding: '0 24px 48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Upcoming Events</span>
        </div>

        {CALENDAR_EVENTS.slice(0, 6).map((event, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 16,
            padding: '10px 0',
            borderBottom: '1px solid var(--border-subtle)',
          }}>
            {/* Date */}
            <div style={{ width: 48, flexShrink: 0, textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                {event.date.split('-')[2]}
              </div>
              <div style={{ fontSize: 9, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-quaternary)', textTransform: 'uppercase' as const }}>
                {event.dayOfWeek}
              </div>
            </div>

            {/* Type badge */}
            <div style={{ width: 100, flexShrink: 0 }}>
              <span style={{
                padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600,
                fontFamily: 'var(--font-mono)', textTransform: 'capitalize' as const,
                color: event.type === 'macro' ? 'var(--data-negative)' :
                       event.type === 'crypto' ? 'var(--data-warning)' :
                       event.type === 'prediction' ? 'var(--accent-violet)' :
                       'var(--data-positive)',
                background: event.type === 'macro' ? 'rgba(224,101,101,0.1)' :
                            event.type === 'crypto' ? 'rgba(212,160,66,0.1)' :
                            event.type === 'prediction' ? 'rgba(139,127,199,0.1)' :
                            'rgba(62,189,140,0.1)',
              }}>
                {event.type}
              </span>
            </div>

            {/* Event details */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{event.title}</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 1, fontFamily: 'var(--font-mono)' }}>{event.time}</div>
            </div>

            {/* Impact */}
            <span style={{
              fontSize: 10, fontWeight: 600, fontFamily: 'var(--font-mono)',
              color: event.impact === 'High' ? 'var(--data-negative)' : 'var(--data-warning)',
            }}>
              {event.impact}
            </span>

            {/* Pelican brief */}
            <div style={{ width: 16, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
              <img src="/images/pelican-logo.png" alt="" style={{ width: 20, height: 20, objectFit: 'contain', opacity: 0.5, cursor: 'pointer' }} title={event.pelicanBrief} />
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
