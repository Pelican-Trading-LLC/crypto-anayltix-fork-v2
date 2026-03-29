'use client'

import { useState, useMemo } from 'react'
import { TokenIcon, ChainBadge, FlowBar, FilterPill, InsightsButton } from '@/components/shared'
import { formatCompact, formatPercent, formatInteger } from '@/lib/format'
import {
  MOCK_WALLETS,
  MOCK_TOP_TOKENS_TRADING,
  MOCK_TOP_TOKENS_HOLDING,
  MOCK_RECENT_TRADES,
} from '@/lib/crypto-mock-data'
import type { MockWallet } from '@/lib/crypto-mock-data'

// ── derived wallet data ──────────────────────────────────────
const TRADES_PER_WALLET = [156, 89, 234, 1240, 567, 178, 312, 2340, 45, 890, 423, 12]
const TOKENS_TRADED = [
  'JUP, PIGEON & 4 more',
  'FAF, KNIFE & 3 more',
  'ONDO, JUP & 6 more',
  'PUNCH, FAF & 12 more',
  'SOL, JUP & 3 more',
  'ETH, BTC & 2 more',
  'VNUT, SAMBA & 5 more',
  'KNIFE, LAYOFF & 8 more',
  'BTC, ETH & 1 more',
  'JUP, ONDO & 4 more',
  'WOJAK, MS2 & 3 more',
  'FAF & 1 more',
]

type ActiveTab = 'leaderboard' | 'tokens' | 'trades'

const SUB_TABS: { key: ActiveTab; label: string }[] = [
  { key: 'leaderboard', label: 'Leaderboard' },
  { key: 'tokens', label: 'Top Tokens' },
  { key: 'trades', label: 'Trades' },
]

// ── scatter tooltip ──────────────────────────────────────────
function ScatterTooltip({ wallet, x, y }: { wallet: MockWallet; x: number; y: number }) {
  return (
    <div
      style={{
        position: 'fixed',
        left: x + 12,
        top: y - 40,
        background: 'var(--bg-elevated, #16161f)',
        border: '1px solid var(--border-default)',
        borderRadius: 6,
        padding: '6px 10px',
        fontSize: 11,
        fontFamily: 'var(--font-sans)',
        color: 'var(--text-primary)',
        zIndex: 100,
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
        boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
      }}
    >
      <div style={{ fontWeight: 600 }}>{wallet.emoji} {wallet.label}</div>
      <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
        PnL {formatCompact(wallet.realizedPnl)} &middot; ROI {formatPercent(wallet.roi)}
      </div>
    </div>
  )
}

// ── scatter plot ─────────────────────────────────────────────
function ScatterPlot({ wallets }: { wallets: MockWallet[] }) {
  const [hovered, setHovered] = useState<{ wallet: MockWallet; x: number; y: number } | null>(null)

  const maxRpnl = useMemo(() => Math.max(...wallets.map(w => w.realizedPnl)), [wallets])
  const maxRoi = useMemo(() => Math.max(...wallets.map(w => w.roi)), [wallets])

  const CHART_LEFT = 44
  const CHART_RIGHT = 16
  const CHART_TOP = 16
  const CHART_BOTTOM = 24

  const yLabels = ['0%', '100%', '200%', '300%', '400%', '500%']
  const xLabels = ['$0', '$20K', '$40K', '$60K', '$80K', '$100K']

  const CHART_HEIGHT = 220
  const INNER_LEFT = 52
  const INNER_RIGHT = 16
  const INNER_TOP = 16
  const INNER_BOTTOM = 38

  return (
    <div style={{ position: 'relative' }}>
      {/* Y-axis title */}
      <div style={{
        position: 'absolute', left: -6, top: '50%', transform: 'translateY(-50%) rotate(-90deg)',
        fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', color: 'var(--text-tertiary)',
        fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', zIndex: 4,
      }}>
        ROI (Return on Investment)
      </div>

      <div
        style={{
          background: 'var(--bg-surface-2)',
          border: '1px solid var(--border-default)',
          borderRadius: 8,
          height: CHART_HEIGHT,
          padding: 0,
          overflow: 'hidden',
          position: 'relative',
          marginLeft: 18,
        }}
      >
        {/* Y-axis labels */}
        {yLabels.map((label, i) => {
          const pct = i / (yLabels.length - 1)
          const top = INNER_TOP + (1 - pct) * (CHART_HEIGHT - INNER_TOP - INNER_BOTTOM)
          return (
            <span
              key={label}
              style={{
                position: 'absolute',
                left: 8,
                top,
                transform: 'translateY(-50%)',
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-quaternary)',
                zIndex: 2,
              }}
            >
              {label}
            </span>
          )
        })}

        {/* X-axis labels */}
        {xLabels.map((label, i) => {
          const pct = i / (xLabels.length - 1)
          return (
            <span
              key={label}
              style={{
                position: 'absolute',
                bottom: 18,
                left: `${INNER_LEFT / 3.6 + pct * (100 - INNER_LEFT / 3.6 - INNER_RIGHT / 3.6)}%`,
                transform: 'translateX(-50%)',
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-quaternary)',
                zIndex: 2,
              }}
            >
              {label}
            </span>
          )
        })}

        {/* X-axis title */}
        <div style={{
          position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)',
          fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', color: 'var(--text-tertiary)',
          fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', zIndex: 4,
        }}>
          Total PnL (Realized Profit)
        </div>

        {/* Grid lines - horizontal */}
        {yLabels.map((_, i) => {
          const pct = i / (yLabels.length - 1)
          const top = INNER_TOP + (1 - pct) * (CHART_HEIGHT - INNER_TOP - INNER_BOTTOM)
          return (
            <div
              key={`h-${i}`}
              style={{
                position: 'absolute',
                left: INNER_LEFT,
                right: INNER_RIGHT,
                top,
                height: 1,
                background: 'rgba(90,130,180,0.06)',
              }}
            />
          )
        })}

        {/* Grid lines - vertical */}
        {xLabels.map((_, i) => {
          const pct = i / (xLabels.length - 1)
          return (
            <div
              key={`v-${i}`}
              style={{
                position: 'absolute',
                left: `${INNER_LEFT / 3.6 + pct * (100 - INNER_LEFT / 3.6 - INNER_RIGHT / 3.6)}%`,
                top: INNER_TOP,
                bottom: INNER_BOTTOM,
                width: 1,
                background: 'rgba(90,130,180,0.06)',
              }}
            />
          )
        })}

        {/* Dots */}
        {wallets.map((w, idx) => {
          const chartW = 100 - INNER_LEFT / 3.6 - INNER_RIGHT / 3.6
          const chartH = CHART_HEIGHT - INNER_TOP - INNER_BOTTOM
          const xPct = Math.min(w.realizedPnl / maxRpnl, 1)
          const yPct = Math.min(w.roi / maxRoi, 1)
          const leftPct = INNER_LEFT / 3.6 + xPct * chartW
          const topPx = INNER_TOP + (1 - yPct) * chartH

          return (
            <div
              key={idx}
              onMouseEnter={(e) => setHovered({ wallet: w, x: e.clientX, y: e.clientY })}
              onMouseLeave={() => setHovered(null)}
              style={{
                position: 'absolute',
                left: `${leftPct}%`,
                top: topPx,
                width: 10,
                height: 10,
                borderRadius: '50%',
                border: '2px solid var(--accent-primary)',
                background: 'transparent',
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                zIndex: 3,
                transition: 'box-shadow 120ms',
                boxShadow: hovered?.wallet === w ? '0 0 6px var(--accent-primary)' : 'none',
              }}
            />
          )
        })}

        {hovered && <ScatterTooltip wallet={hovered.wallet} x={hovered.x} y={hovered.y} />}
      </div>
    </div>
  )
}

// ── main page ────────────────────────────────────────────────
export default function SmartMoneyPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('leaderboard')

  // Derive max values for flow bars
  const maxTotalPnl = useMemo(
    () => Math.max(...MOCK_WALLETS.map((w) => w.realizedPnl * 1.15)),
    []
  )
  const maxFlows24h = useMemo(
    () => Math.max(...MOCK_TOP_TOKENS_TRADING.map((t) => Math.abs(t.flows24h))),
    []
  )
  const maxFlows7d = useMemo(
    () => Math.max(...MOCK_TOP_TOKENS_TRADING.map((t) => Math.abs(t.flows7d))),
    []
  )
  const maxFlows30d = useMemo(
    () => Math.max(...MOCK_TOP_TOKENS_TRADING.map((t) => Math.abs(t.flows30d))),
    []
  )
  const maxBalance = useMemo(
    () => Math.max(...MOCK_TOP_TOKENS_HOLDING.map((t) => t.balance)),
    []
  )

  return (
    <div style={{ padding: '24px 24px 48px', width: '100%' }}>
      {/* ── Header ───────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          Smart Money
        </h1>
        <div style={{ display: 'flex', gap: 6 }}>
          <FilterPill label="Solana" active />
          <FilterPill label="Ethereum" />
        </div>
        <div style={{ display: 'flex', gap: 6, marginLeft: 8 }}>
          <FilterPill label="Spot" active variant="spot" />
          <FilterPill label="Perps" />
        </div>
      </div>

      {/* ── Sub-tabs ─────────────────────────── */}
      <div
        style={{
          display: 'flex',
          gap: 24,
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: 20,
        }}
      >
        {SUB_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.key ? '2px solid var(--accent-primary)' : '2px solid transparent',
              padding: '8px 0',
              fontSize: 13,
              fontWeight: activeTab === tab.key ? 600 : 500,
              color: activeTab === tab.key ? 'var(--text-primary)' : 'var(--text-tertiary)',
              cursor: 'pointer',
              transition: 'color 120ms',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════ */}
      {/* LEADERBOARD TAB                           */}
      {/* ══════════════════════════════════════════ */}
      {activeTab === 'leaderboard' && (
        <div>
          {/* Scatter plot */}
          <ScatterPlot wallets={MOCK_WALLETS} />

          {/* Wallet table */}
          <div style={{ marginTop: 16, overflowX: 'auto' }}>
            {/* Header row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                height: 32,
                paddingLeft: 12,
                paddingRight: 12,
                gap: 0,
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              {[
                { label: 'Name', w: 280 },
                { label: 'Total PnL', w: 160 },
                { label: 'Realized PnL', w: 140 },
                { label: 'ROI', w: 100 },
                { label: 'Win Rate', w: 100 },
                { label: '# Trades', w: 90 },
                { label: 'Tokens Traded', w: 0, flex: true },
                { label: '', w: 60 },
              ].map((col) => (
                <div
                  key={col.label || 'insights'}
                  style={{
                    width: ('flex' in col && col.flex) ? undefined : col.w,
                    flex: ('flex' in col && col.flex) ? 1 : undefined,
                    flexShrink: ('flex' in col && col.flex) ? undefined : 0,
                    fontSize: 10,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--text-quaternary)',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  {col.label}
                </div>
              ))}
            </div>

            {/* Data rows */}
            {MOCK_WALLETS.map((w, idx) => {
              const totalPnl = w.realizedPnl * 1.15
              const trades = TRADES_PER_WALLET[idx] ?? 0
              const tokensTraded = TOKENS_TRADED[idx] ?? ''
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: 38,
                    paddingLeft: 12,
                    paddingRight: 12,
                    gap: 0,
                    borderBottom: '1px solid var(--border-subtle)',
                    transition: 'background 120ms',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-elevated, rgba(255,255,255,0.02))' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                >
                  {/* Name */}
                  <div style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {w.emoji} {w.label}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--text-tertiary)',
                      }}
                    >
                      [{w.address}]
                    </span>
                  </div>

                  {/* Total PnL */}
                  <div style={{ width: 160, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: totalPnl >= 0 ? 'var(--data-positive)' : 'var(--data-negative)' }}>
                      {formatCompact(totalPnl)}
                    </span>
                    <FlowBar value={totalPnl} max={maxTotalPnl} />
                  </div>

                  {/* Realized PnL */}
                  <div style={{ width: 140, flexShrink: 0 }}>
                    <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--text-secondary)' }}>
                      {formatCompact(w.realizedPnl)}
                    </span>
                  </div>

                  {/* ROI */}
                  <div style={{ width: 100, flexShrink: 0 }}>
                    <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: w.roi >= 0 ? 'var(--data-positive)' : 'var(--data-negative)' }}>
                      {formatPercent(w.roi)}
                    </span>
                  </div>

                  {/* Win Rate */}
                  <div style={{ width: 100, flexShrink: 0 }}>
                    <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: w.winRate >= 50 ? 'var(--data-positive)' : 'var(--data-negative)' }}>
                      {w.winRate}%
                    </span>
                  </div>

                  {/* # Trades */}
                  <div style={{ width: 90, flexShrink: 0 }}>
                    <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--text-tertiary)' }}>
                      {formatInteger(trades)}
                    </span>
                  </div>

                  {/* Tokens Traded */}
                  <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12, color: 'var(--text-tertiary)' }}>
                    {tokensTraded}
                  </div>

                  {/* Insights */}
                  <div style={{ width: 60, flexShrink: 0, textAlign: 'center' }}>
                    <InsightsButton iconOnly context={{ symbol: w.label, name: w.label, extra: `Wallet ${w.address} — PnL: ${formatCompact(w.realizedPnl)}, ROI: ${formatPercent(w.roi)}, Win rate: ${w.winRate}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════ */}
      {/* TOP TOKENS TAB                            */}
      {/* ══════════════════════════════════════════ */}
      {activeTab === 'tokens' && (
        <div>
          {/* ── Section 1: What Are Smart Money Trading? ── */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                What Are Smart Money Trading?
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 10,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--data-positive)',
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--data-positive)',
                    display: 'inline-block',
                    animation: 'pulse 2s infinite',
                  }}
                />
                LIVE
              </span>
            </div>

            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                height: 32,
                paddingLeft: 12,
                paddingRight: 12,
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              {[
                { label: 'Chain', w: 48 },
                { label: 'Token', w: 160 },
                { label: '24H Flows', w: 140 },
                { label: '7D Flows', w: 140 },
                { label: '30D Flows', w: 140 },
                { label: 'Traders', w: 68 },
                { label: 'Token Age D', w: 80 },
                { label: 'Market Cap', w: 100 },
              ].map((col) => (
                <div
                  key={col.label}
                  style={{
                    width: ('flex' in col && col.flex) ? undefined : col.w,
                    flex: ('flex' in col && col.flex) ? 1 : undefined,
                    flexShrink: ('flex' in col && col.flex) ? undefined : 0,
                    fontSize: 10,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--text-quaternary)',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  {col.label}
                </div>
              ))}
            </div>

            {/* Rows */}
            {MOCK_TOP_TOKENS_TRADING.map((t, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: 38,
                  paddingLeft: 12,
                  paddingRight: 12,
                  borderBottom: '1px solid var(--border-subtle)',
                  transition: 'background 120ms',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-elevated, rgba(255,255,255,0.02))' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                {/* Chain */}
                <div style={{ width: 48, flexShrink: 0 }}>
                  <ChainBadge chain={t.chain} />
                </div>

                {/* Token */}
                <div style={{ width: 160, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <TokenIcon symbol={t.symbol} size={20} />
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {t.name}
                  </span>
                </div>

                {/* 24H Flows */}
                <div style={{ width: 140, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontFamily: 'var(--font-mono)',
                      fontVariantNumeric: 'tabular-nums',
                      color: t.flows24h >= 0 ? 'var(--data-positive)' : 'var(--data-negative)',
                    }}
                  >
                    {formatCompact(t.flows24h)}
                  </span>
                  <FlowBar value={t.flows24h} max={maxFlows24h} />
                </div>

                {/* 7D Flows */}
                <div style={{ width: 140, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontFamily: 'var(--font-mono)',
                      fontVariantNumeric: 'tabular-nums',
                      color: t.flows7d >= 0 ? 'var(--data-positive)' : 'var(--data-negative)',
                    }}
                  >
                    {formatCompact(t.flows7d)}
                  </span>
                  <FlowBar value={t.flows7d} max={maxFlows7d} />
                </div>

                {/* 30D Flows */}
                <div style={{ width: 140, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontFamily: 'var(--font-mono)',
                      fontVariantNumeric: 'tabular-nums',
                      color: t.flows30d >= 0 ? 'var(--data-positive)' : 'var(--data-negative)',
                    }}
                  >
                    {formatCompact(t.flows30d)}
                  </span>
                  <FlowBar value={t.flows30d} max={maxFlows30d} />
                </div>

                {/* Traders */}
                <div style={{ width: 68, flexShrink: 0 }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontFamily: 'var(--font-mono)',
                      fontVariantNumeric: 'tabular-nums',
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    {formatInteger(t.traders)}
                  </span>
                </div>

                {/* Token Age */}
                <div style={{ width: 80, flexShrink: 0 }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontFamily: 'var(--font-mono)',
                      fontVariantNumeric: 'tabular-nums',
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    {t.tokenAge}
                  </span>
                </div>

                {/* Market Cap */}
                <div style={{ width: 100, flexShrink: 0 }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontFamily: 'var(--font-mono)',
                      fontVariantNumeric: 'tabular-nums',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {formatCompact(t.mcap)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* ── Section 2: What Are Smart Money Holding? ── */}
          <div style={{ marginTop: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                What Are Smart Money Holding?
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 10,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--data-positive)',
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--data-positive)',
                    display: 'inline-block',
                    animation: 'pulse 2s infinite',
                  }}
                />
                LIVE
              </span>
            </div>

            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                height: 32,
                paddingLeft: 12,
                paddingRight: 12,
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              {[
                { label: 'Chain', w: 48 },
                { label: 'Token', w: 160 },
                { label: 'Balance $', w: 140 },
                { label: 'Change 24H', w: 100 },
                { label: 'Share %', w: 80 },
                { label: 'Holders', w: 80 },
                { label: 'Market Cap', w: 100 },
              ].map((col) => (
                <div
                  key={col.label}
                  style={{
                    width: ('flex' in col && col.flex) ? undefined : col.w,
                    flex: ('flex' in col && col.flex) ? 1 : undefined,
                    flexShrink: ('flex' in col && col.flex) ? undefined : 0,
                    fontSize: 10,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--text-quaternary)',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  {col.label}
                </div>
              ))}
            </div>

            {/* Rows */}
            {MOCK_TOP_TOKENS_HOLDING.map((t, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: 38,
                  paddingLeft: 12,
                  paddingRight: 12,
                  borderBottom: '1px solid var(--border-subtle)',
                  transition: 'background 120ms',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-elevated, rgba(255,255,255,0.02))' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                {/* Chain */}
                <div style={{ width: 48, flexShrink: 0 }}>
                  <ChainBadge chain={t.chain} />
                </div>

                {/* Token */}
                <div style={{ width: 160, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <TokenIcon symbol={t.symbol} size={20} />
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {t.name}
                  </span>
                </div>

                {/* Balance */}
                <div style={{ width: 140, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontFamily: 'var(--font-mono)',
                      fontVariantNumeric: 'tabular-nums',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {formatCompact(t.balance)}
                  </span>
                  <FlowBar value={t.balance} max={maxBalance} />
                </div>

                {/* Balance Change 24H */}
                <div style={{ width: 100, flexShrink: 0 }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontFamily: 'var(--font-mono)',
                      fontVariantNumeric: 'tabular-nums',
                      color: t.balanceChange24h >= 0 ? 'var(--data-positive)' : 'var(--data-negative)',
                    }}
                  >
                    {formatPercent(t.balanceChange24h)}
                  </span>
                </div>

                {/* Share of Holdings */}
                <div style={{ width: 80, flexShrink: 0 }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontFamily: 'var(--font-mono)',
                      fontVariantNumeric: 'tabular-nums',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {t.shareOfHoldings.toFixed(1)}%
                  </span>
                </div>

                {/* Holders */}
                <div style={{ width: 80, flexShrink: 0 }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontFamily: 'var(--font-mono)',
                      fontVariantNumeric: 'tabular-nums',
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    {formatInteger(t.holders)}
                  </span>
                </div>

                {/* Market Cap */}
                <div style={{ width: 100, flexShrink: 0 }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontFamily: 'var(--font-mono)',
                      fontVariantNumeric: 'tabular-nums',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {formatCompact(t.mcap)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════ */}
      {/* TRADES TAB                                */}
      {/* ══════════════════════════════════════════ */}
      {activeTab === 'trades' && (
        <div style={{ overflowX: 'auto' }}>
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              height: 32,
              paddingLeft: 12,
              paddingRight: 12,
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            {[
              { label: 'Wallet', w: 200 },
              { label: 'Direction', w: 80 },
              { label: 'Token', w: 80 },
              { label: 'Amount', w: 120 },
              { label: 'Price', w: 100 },
              { label: 'Time', w: 80 },
              { label: '', w: 72 },
            ].map((col) => (
              <div
                key={col.label || 'insights'}
                style={{
                  width: col.w,
                  flexShrink: 0,
                  fontSize: 10,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--text-quaternary)',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {col.label}
              </div>
            ))}
          </div>

          {/* Rows */}
          {MOCK_RECENT_TRADES.slice(0, 15).map((t, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                height: 38,
                paddingLeft: 12,
                paddingRight: 12,
                borderBottom: '1px solid var(--border-subtle)',
                transition: 'background 120ms',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-elevated, rgba(255,255,255,0.02))' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              {/* Wallet */}
              <div style={{ width: 200, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {t.walletLabel}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-tertiary)',
                  }}
                >
                  {t.walletAddress}
                </span>
              </div>

              {/* Direction */}
              <div style={{ width: 80, flexShrink: 0 }}>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: t.direction === 'Buy' ? 'var(--data-positive)' : 'var(--data-negative)',
                  }}
                >
                  {t.direction}
                </span>
              </div>

              {/* Token */}
              <div style={{ width: 80, flexShrink: 0 }}>
                <span
                  style={{
                    fontSize: 12,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                  }}
                >
                  {t.token}
                </span>
              </div>

              {/* Amount */}
              <div style={{ width: 120, flexShrink: 0 }}>
                <span
                  style={{
                    fontSize: 12,
                    fontFamily: 'var(--font-mono)',
                    fontVariantNumeric: 'tabular-nums',
                    color: 'var(--text-primary)',
                  }}
                >
                  {t.amount}
                </span>
              </div>

              {/* Price */}
              <div style={{ width: 100, flexShrink: 0 }}>
                <span
                  style={{
                    fontSize: 12,
                    fontFamily: 'var(--font-mono)',
                    fontVariantNumeric: 'tabular-nums',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {t.price}
                </span>
              </div>

              {/* Time */}
              <div style={{ width: 80, flexShrink: 0 }}>
                <span
                  style={{
                    fontSize: 12,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-tertiary)',
                  }}
                >
                  {t.time}
                </span>
              </div>

              {/* Insights */}
              <div style={{ width: 72, flexShrink: 0 }}>
                <InsightsButton context={{ symbol: t.token, name: `${t.walletLabel} ${t.direction} ${t.token}`, extra: `${t.direction} ${t.amount} at ${t.price}. Wallet: ${t.walletAddress}. Time: ${t.time}.` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
