'use client'

import { useState, Fragment } from 'react'
import { UNIFIED_ASSETS, PELICAN_SYNTHESES, type UnifiedAsset } from '@/lib/crypto-mock-data'

const TABS = [
  { label: 'All Assets', filter: null },
  { label: 'Crypto', filter: 'crypto' },
  { label: 'Tokenized Stocks', filter: 'equity' },
  { label: 'Tokenized ETFs', filter: 'etf' },
  { label: 'RWA', filter: 'rwa' },
  { label: 'DeFi', filter: 'defi' },
  { label: 'Commodities', filter: 'commodity' },
  { label: 'Stablecoins', filter: 'stablecoin' },
] as const

const CATEGORY_COLORS: Record<UnifiedAsset['category'], { bg: string; text: string }> = {
  crypto: { bg: 'rgba(59,130,246,0.12)', text: '#3B82F6' },
  equity: { bg: 'rgba(34,197,94,0.12)', text: '#22C55E' },
  etf: { bg: 'rgba(139,92,246,0.12)', text: '#8B5CF6' },
  rwa: { bg: 'rgba(245,158,11,0.12)', text: '#F59E0B' },
  defi: { bg: 'rgba(236,72,153,0.12)', text: '#EC4899' },
  commodity: { bg: 'rgba(234,179,8,0.12)', text: '#EAB308' },
  stablecoin: { bg: 'rgba(107,114,128,0.12)', text: '#6B7280' },
}

const CATEGORY_LABELS: Record<UnifiedAsset['category'], string> = {
  crypto: 'Crypto',
  equity: 'Equity',
  etf: 'ETF',
  rwa: 'RWA',
  defi: 'DeFi',
  commodity: 'Commodity',
  stablecoin: 'Stablecoin',
}

const CORRELATION_ASSETS = ['BTC', 'SPX', 'GOLD', 'DXY', 'AAPL']

function formatPrice(price: number): string {
  if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  if (price >= 1) return price.toFixed(2)
  return price.toFixed(3)
}

function formatMarketCap(cap: string): string {
  return '$' + cap
}

function getCorrelation(symbol: string, target: string): number | null {
  if (symbol === target) return 1.0
  const asset = UNIFIED_ASSETS.find(a => a.symbol === symbol)
  if (asset?.correlations[target] !== undefined) return asset.correlations[target]
  // Check reverse lookup
  const targetAsset = UNIFIED_ASSETS.find(a => a.symbol === target)
  if (targetAsset?.correlations[symbol] !== undefined) return targetAsset.correlations[symbol]
  return null
}

export default function MarketPulsePage() {
  const [activeTab, setActiveTab] = useState<string | null>(null)

  const filteredAssets = activeTab
    ? UNIFIED_ASSETS.filter(a => a.category === activeTab)
    : UNIFIED_ASSETS

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Market Pulse</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Cross-asset market overview</p>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 flex-wrap">
        {TABS.map(tab => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.filter)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === tab.filter
                ? 'bg-[rgba(6,182,212,0.12)] text-[#06B6D4]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Pelican Synthesis */}
      <div
        className="rounded-lg p-4 relative overflow-hidden"
        style={{
          background: 'rgba(6,182,212,0.06)',
          border: '1px solid rgba(6,182,212,0.12)',
        }}
      >
        <div className="h-[2px] bg-gradient-to-r from-[#06B6D4] to-[#8B5CF6] absolute top-0 left-0 right-0" />
        <p
          className="font-mono text-[10px] tracking-[1px] uppercase mb-2"
          style={{ color: '#06B6D4' }}
        >
          PELICAN SYNTHESIS
        </p>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          {PELICAN_SYNTHESES.marketPulse}
        </p>
      </div>

      {/* Asset Table */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold px-4 py-3">
                  Asset
                </th>
                <th className="text-left text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold px-4 py-3">
                  Type
                </th>
                <th className="text-right text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold px-4 py-3">
                  Price
                </th>
                <th className="text-right text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold px-4 py-3">
                  24h Change
                </th>
                <th className="text-right text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold px-4 py-3">
                  Market Cap
                </th>
                <th className="text-left text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold px-4 py-3">
                  Pelican Insight
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => {
                const isPositive = asset.change24h >= 0
                const colors = CATEGORY_COLORS[asset.category]
                return (
                  <tr
                    key={asset.symbol}
                    className="hover:bg-[var(--bg-elevated)] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm font-bold text-[var(--text-primary)]">
                        {asset.symbol}
                      </span>
                      <span className="text-xs text-[var(--text-muted)] ml-2">
                        {asset.name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                        style={{ background: colors.bg, color: colors.text }}
                      >
                        {CATEGORY_LABELS[asset.category]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-sm text-[var(--text-primary)]">
                      ${formatPrice(asset.price)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className="font-mono tabular-nums text-sm inline-flex items-center gap-1"
                        style={{ color: isPositive ? '#22C55E' : '#EF4444' }}
                      >
                        <span className="text-xs">{isPositive ? '\u25B2' : '\u25BC'}</span>
                        {isPositive ? '+' : ''}{asset.change24h.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-sm text-[var(--text-muted)]">
                      {formatMarketCap(asset.marketCap)}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[12px] text-[var(--text-secondary)] max-w-[300px] truncate">
                        {asset.pelicanInsight}
                      </p>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cross-Asset Correlation Matrix */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
          Cross-Asset Correlation Matrix
        </h2>
        <div className="overflow-x-auto">
          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: `80px repeat(${CORRELATION_ASSETS.length}, 1fr)`,
            }}
          >
            {/* Corner cell */}
            <div />
            {/* Header row */}
            {CORRELATION_ASSETS.map(symbol => (
              <div
                key={`header-${symbol}`}
                className="text-center font-mono text-xs font-semibold text-[var(--text-secondary)] py-2"
              >
                {symbol}
              </div>
            ))}
            {/* Data rows */}
            {CORRELATION_ASSETS.map(rowSymbol => (
              <Fragment key={`row-${rowSymbol}`}>
                {/* Row label */}
                <div
                  className="flex items-center font-mono text-xs font-semibold text-[var(--text-secondary)] pr-2"
                >
                  {rowSymbol}
                </div>
                {/* Cells */}
                {CORRELATION_ASSETS.map(colSymbol => {
                  const value = getCorrelation(rowSymbol, colSymbol)
                  const isPositive = value !== null && value >= 0
                  const intensity = value !== null ? Math.abs(value) : 0
                  const bg =
                    value === null
                      ? 'transparent'
                      : rowSymbol === colSymbol
                        ? 'rgba(139,92,246,0.15)'
                        : isPositive
                          ? `rgba(34,197,94,${0.08 + intensity * 0.25})`
                          : `rgba(239,68,68,${0.08 + intensity * 0.25})`
                  return (
                    <div
                      key={`cell-${rowSymbol}-${colSymbol}`}
                      className="flex items-center justify-center rounded-md py-3"
                      style={{ background: bg }}
                    >
                      <span
                        className="font-mono text-xs tabular-nums"
                        style={{
                          color:
                            value === null
                              ? 'var(--text-muted)'
                              : rowSymbol === colSymbol
                                ? 'var(--text-secondary)'
                                : isPositive
                                  ? '#22C55E'
                                  : '#EF4444',
                        }}
                      >
                        {value !== null ? value.toFixed(2) : '\u2014'}
                      </span>
                    </div>
                  )
                })}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
