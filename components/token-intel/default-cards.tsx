'use client'

import { CaretUp, CaretDown, TrendUp, CurrencyCircleDollar, Fire, Lightning } from '@phosphor-icons/react'
import { MOCK_TOKEN_INTEL, MOCK_POSITIONS, ASSET_COLORS, formatUSD, formatPct, formatCompact } from '@/lib/crypto-mock-data'

// ─── Card 1: Market Overview ───────────────────────────────

const OVERVIEW_TOKENS = ['BTC', 'ETH', 'SOL'] as const

export function MarketOverviewCard({ onSelect }: { onSelect: (symbol: string) => void }) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendUp size={14} weight="fill" className="text-[#4A90C4]" />
        <span className="text-[11px] uppercase tracking-[1.5px] font-semibold text-muted-foreground">MARKET OVERVIEW</span>
      </div>
      <div className="space-y-0">
        {OVERVIEW_TOKENS.map(symbol => {
          const d = MOCK_TOKEN_INTEL[symbol]
          if (!d) return null
          const isUp = d.price_change_24h >= 0
          return (
            <button
              key={symbol}
              onClick={() => onSelect(symbol)}
              className="w-full flex items-center gap-3 py-3 border-b border-[var(--border)] last:border-0 hover:bg-accent/5 transition-colors rounded-md px-2 cursor-pointer text-left"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                style={{ backgroundColor: ASSET_COLORS[symbol] || '#666' }}
              >
                {symbol[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-[13px] font-semibold">{symbol}</span>
                  <span className="text-[11px] text-muted-foreground">{d.name}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-mono text-[13px] font-semibold tabular-nums">{formatUSD(d.price)}</div>
                <div className={`inline-flex items-center gap-0.5 text-[11px] font-mono font-medium ${isUp ? 'text-[#3EBD8C]' : 'text-[#E06565]'}`}>
                  {isUp ? <CaretUp size={10} weight="fill" /> : <CaretDown size={10} weight="fill" />}
                  {formatPct(d.price_change_24h)}
                </div>
              </div>
            </button>
          )
        })}
      </div>
      <div className="mt-3 pt-3 border-t border-[var(--border)] grid grid-cols-2 gap-x-4 gap-y-1.5">
        <div className="flex justify-between">
          <span className="text-[11px] text-muted-foreground">Total MCap</span>
          <span className="font-mono text-[11px] tabular-nums font-medium">$2.87T</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[11px] text-muted-foreground">BTC Dom</span>
          <span className="font-mono text-[11px] tabular-nums font-medium">58.4%</span>
        </div>
      </div>
    </div>
  )
}

// ─── Card 2: Trending on Pelican ───────────────────────────

const TRENDING = [
  { symbol: 'BTC', reason: 'Options expiry $4.2B Friday', heat: 'high' as const },
  { symbol: 'SOL', reason: '$400M unlock in 5 days', heat: 'high' as const },
  { symbol: 'ETH', reason: 'Funding turned negative', heat: 'medium' as const },
  { symbol: 'AAVE', reason: 'V4 governance vote upcoming', heat: 'medium' as const },
  { symbol: 'WIF', reason: 'Extreme funding — liquidation risk', heat: 'high' as const },
]

const HEAT_STYLES = {
  high: 'bg-[#E06565]/10 text-[#E06565]',
  medium: 'bg-[#D4A042]/10 text-[#D4A042]',
  low: 'bg-[#3EBD8C]/10 text-[#3EBD8C]',
}

export function TrendingCard({ onSelect }: { onSelect: (symbol: string) => void }) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Fire size={14} weight="fill" className="text-[#D4A042]" />
        <span className="text-[11px] uppercase tracking-[1.5px] font-semibold text-muted-foreground">TRENDING ON PELICAN</span>
      </div>
      <div className="space-y-0">
        {TRENDING.map(t => (
          <button
            key={t.symbol}
            onClick={() => onSelect(t.symbol)}
            className="w-full flex items-center gap-3 py-2.5 border-b border-[var(--border)] last:border-0 hover:bg-accent/5 transition-colors rounded-md px-2 cursor-pointer text-left"
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
              style={{ backgroundColor: ASSET_COLORS[t.symbol] || '#666' }}
            >
              {t.symbol[0]}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[13px] font-medium">{t.symbol}</span>
              <span className="text-[11px] text-muted-foreground ml-2 truncate">{t.reason}</span>
            </div>
            <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold shrink-0 ${HEAT_STYLES[t.heat]}`}>
              {t.heat === 'high' ? 'HOT' : 'WARM'}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Card 3: Funding Rate Watch ────────────────────────────

interface FundingItem {
  symbol: string
  rate: number
  annualized: number
  status: 'elevated' | 'negative' | 'normal'
}

const FUNDING_WATCH: FundingItem[] = [
  { symbol: 'WIF', rate: 0.045, annualized: 59.13, status: 'elevated' },
  { symbol: 'SOL', rate: 0.025, annualized: 32.85, status: 'elevated' },
  { symbol: 'ETH', rate: -0.0045, annualized: -5.84, status: 'negative' },
  { symbol: 'BTC', rate: 0.0082, annualized: 10.72, status: 'normal' },
  { symbol: 'AAVE', rate: 0.003, annualized: 3.94, status: 'normal' },
]

function getFundingColor(status: FundingItem['status']): string {
  if (status === 'elevated') return '#E06565'
  if (status === 'negative') return '#3EBD8C'
  return '#6B7280'
}

export function FundingRateCard({ onSelect }: { onSelect: (symbol: string) => void }) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <CurrencyCircleDollar size={14} weight="fill" className="text-[#4A90C4]" />
        <span className="text-[11px] uppercase tracking-[1.5px] font-semibold text-muted-foreground">FUNDING RATE WATCH</span>
      </div>
      <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">
        Funding rates are like overnight repo rates, paid 3x daily. Elevated rates signal overcrowded longs; negative rates mean shorts are paying.
      </p>
      <div className="space-y-0">
        {FUNDING_WATCH.map(f => {
          const color = getFundingColor(f.status)
          return (
            <button
              key={f.symbol}
              onClick={() => onSelect(f.symbol)}
              className="w-full flex items-center gap-3 py-2.5 border-b border-[var(--border)] last:border-0 hover:bg-accent/5 transition-colors rounded-md px-2 cursor-pointer text-left"
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                style={{ backgroundColor: ASSET_COLORS[f.symbol] || '#666' }}
              >
                {f.symbol[0]}
              </div>
              <span className="text-[13px] font-medium flex-1">{f.symbol}</span>
              <div className="text-right shrink-0">
                <span className="font-mono text-[12px] font-semibold tabular-nums" style={{ color }}>
                  {f.rate >= 0 ? '+' : ''}{(f.rate * 100).toFixed(4)}%
                </span>
                <span className="font-mono text-[10px] text-muted-foreground ml-1">
                  ({f.annualized >= 0 ? '+' : ''}{f.annualized.toFixed(0)}% ann.)
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
