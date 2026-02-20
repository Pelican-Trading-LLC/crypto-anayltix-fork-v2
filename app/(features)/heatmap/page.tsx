"use client"

import { useState, useRef, useEffect, useMemo, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { useHeatmap, type HeatmapTimeframe } from "@/hooks/use-heatmap"
import { usePelicanPanelContext } from "@/providers/pelican-panel-provider"
import { useTrades } from "@/hooks/use-trades"
import { useWatchlist } from "@/hooks/use-watchlist"
import { useMarketPulse } from "@/hooks/use-market-pulse"
import { Treemap } from "@/components/heatmap/treemap"
import { HeatmapGrid } from "@/components/heatmap/heatmap-grid"
import { SectorLegend } from "@/components/heatmap/sector-legend"
import { getSectors, type SP500Sector } from "@/lib/data/sp500-constituents"
import { ArrowsClockwise, GridFour, SquaresFour, Lightning, Crosshair } from "@phosphor-icons/react"
import { getMarketStatus } from "@/hooks/use-market-data"
import { PageHeader, DataCell, pageEnter } from "@/components/ui/pelican"
import type { HeatmapStock } from "@/app/api/heatmap/route"
import { cn } from "@/lib/utils"

// ── Types ────────────────────────────────────────────────────────────────────

type ViewMode = "treemap" | "grid"

const TIMEFRAMES: { value: HeatmapTimeframe; label: string }[] = [
  { value: '1D', label: '1D' },
  { value: '1W', label: '1W' },
  { value: '1M', label: '1M' },
  { value: '3M', label: '3M' },
  { value: 'YTD', label: 'YTD' },
  { value: '1Y', label: '1Y' },
]

// ── Context-rich prompt builder ──────────────────────────────────────────────

interface HeatmapContext {
  spxChange: number | null
  vixLevel: number | null
  sectorPerformance: Record<string, number>
  openTrades: { ticker: string; direction: string; entry_price: number; pnl_percent: number | null }[]
  watchlistTickers: string[]
}

function buildAnalysisPrompt(stock: HeatmapStock, ctx: HeatmapContext): string {
  const change = stock.changePercent ?? 0
  const parts = [
    `Analyze ${stock.ticker} (${stock.name}, ${stock.sector}).`,
    `It's ${change >= 0 ? 'up' : 'down'} ${Math.abs(change).toFixed(2)}% today${stock.price != null ? ` at $${stock.price.toFixed(2)}` : ''}.`,
  ]

  // Sector relative strength
  const sectorChange = ctx.sectorPerformance[stock.sector]
  if (sectorChange != null) {
    const rel = change - sectorChange
    if (Math.abs(rel) > 0.5) {
      parts.push(
        `Its sector (${stock.sector}) is ${sectorChange >= 0 ? 'up' : 'down'} ${Math.abs(sectorChange).toFixed(2)}%, so ${stock.ticker} is ${rel > 0 ? 'outperforming' : 'underperforming'} its sector by ${Math.abs(rel).toFixed(2)}%.`
      )
    }
  }

  // Broad market context
  if (ctx.spxChange != null) {
    parts.push(`S&P 500 is ${ctx.spxChange >= 0 ? 'up' : 'down'} ${Math.abs(ctx.spxChange).toFixed(2)}% today.`)
  }
  if (ctx.vixLevel != null) {
    parts.push(`VIX is at ${ctx.vixLevel.toFixed(1)}.`)
  }

  // User position context
  const pos = ctx.openTrades.find(t => t.ticker === stock.ticker)
  if (pos) {
    parts.push(`I have a ${pos.direction.toUpperCase()} position from $${pos.entry_price}.`)
    if (pos.pnl_percent != null) {
      parts.push(`Current P&L: ${pos.pnl_percent >= 0 ? '+' : ''}${pos.pnl_percent.toFixed(1)}%.`)
    }
    parts.push('Should I hold, add, or exit?')
  } else if (ctx.watchlistTickers.includes(stock.ticker)) {
    parts.push('This is on my watchlist. Is now a good entry?')
  } else {
    parts.push('I have no position. Is this relative strength/weakness worth a trade?')
  }

  parts.push('Give me key levels, the catalyst, and a trade plan with invalidation.')
  return parts.join(' ')
}

// ── Market Breadth Strip ─────────────────────────────────────────────────────

function MarketBreadthStrip({ stocks }: { stocks: HeatmapStock[] }) {
  if (stocks.length === 0) return null

  const advancing = stocks.filter(s => (s.changePercent ?? 0) > 0.05).length
  const declining = stocks.filter(s => (s.changePercent ?? 0) < -0.05).length
  const unchanged = stocks.length - advancing - declining
  const advPct = ((advancing / stocks.length) * 100).toFixed(0)

  return (
    <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] flex-wrap">
      <span>
        <span className="text-[var(--data-positive)] font-semibold">{advancing}</span> advancing
      </span>
      <span>
        <span className="text-[var(--data-negative)] font-semibold">{declining}</span> declining
      </span>
      <span>
        <span className="text-[var(--text-secondary)] font-semibold">{unchanged}</span> flat
      </span>

      {/* Advance/Decline bar */}
      <div className="flex-1 max-w-[200px] h-1.5 bg-[var(--bg-elevated)] rounded-full overflow-hidden flex">
        <div className="bg-[var(--data-positive)] h-full transition-all duration-300" style={{ width: `${advPct}%` }} />
        <div className="bg-[var(--data-negative)] h-full flex-1" />
      </div>

      <span className="font-medium text-[var(--text-secondary)]">{advPct}% green</span>
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function HeatmapPage() {
  return (
    <Suspense>
      <HeatmapPageInner />
    </Suspense>
  )
}

function HeatmapPageInner() {
  const searchParams = useSearchParams()
  const [viewMode, setViewMode] = useState<ViewMode>("treemap")
  const [selectedSectors, setSelectedSectors] = useState<SP500Sector[]>(getSectors())
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [timeframe, setTimeframe] = useState<HeatmapTimeframe>('1D')
  const [showMyStocks, setShowMyStocks] = useState(false)
  const [highlightedSector, setHighlightedSector] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 })

  // Filter to a single sector if passed via query param
  useEffect(() => {
    const sectorParam = searchParams.get('sector')
    if (sectorParam) {
      const allSectors = getSectors()
      const match = allSectors.find(s => s === sectorParam)
      if (match) setSelectedSectors([match])
    }
  }, [searchParams])

  // Data hooks
  const { stocks, isLoading, error, lastUpdated, refetch } = useHeatmap({
    autoRefresh,
    refreshInterval: 60000,
    timeframe,
  })
  const { openWithPrompt } = usePelicanPanelContext()
  const { openTrades } = useTrades({ status: 'open' })
  const { items: watchlistItems } = useWatchlist()
  const { data: marketPulse } = useMarketPulse()

  // Portfolio overlay data
  const emptyEarnings = useMemo(() => new Set<string>(), [])
  const positionTickers = useMemo(() => new Set(openTrades.map(t => t.ticker)), [openTrades])
  const watchlistTickers = useMemo(() => new Set((watchlistItems ?? []).map((w: { ticker: string }) => w.ticker)), [watchlistItems])
  const positionPnl = useMemo(() => {
    const map = new Map<string, number>()
    openTrades.forEach(t => { if (t.pnl_percent != null) map.set(t.ticker, t.pnl_percent) })
    return map
  }, [openTrades])

  // Sector performance for context prompts
  const sectorPerformance = useMemo(() => {
    const perf: Record<string, number> = {}
    const sectors = getSectors()
    for (const sector of sectors) {
      const sectorStocks = stocks.filter(s => s.sector === sector)
      if (sectorStocks.length > 0) {
        perf[sector] = sectorStocks.reduce((sum, s) => sum + (s.changePercent ?? 0), 0) / sectorStocks.length
      }
    }
    return perf
  }, [stocks])

  // Market context for prompts
  const heatmapContext: HeatmapContext = useMemo(() => {
    const spxItem = marketPulse?.items?.find((i: { symbol: string }) => i.symbol === 'SPX')
    const vixItem = marketPulse?.items?.find((i: { symbol: string }) => i.symbol === 'VIX')
    return {
      spxChange: spxItem?.changePercent ?? null,
      vixLevel: vixItem?.price ?? null,
      sectorPerformance,
      openTrades: openTrades.map(t => ({
        ticker: t.ticker,
        direction: t.direction,
        entry_price: t.entry_price,
        pnl_percent: t.pnl_percent,
      })),
      watchlistTickers: Array.from(watchlistTickers),
    }
  }, [marketPulse, sectorPerformance, openTrades, watchlistTickers])

  // Container dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        setDimensions({
          width: Math.max(width - 32, 600),
          height: Math.max(height - 100, 400),
        })
      }
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [viewMode])

  const handleStockClick = useCallback((ticker: string, name: string) => {
    const stock = stocks.find(s => s.ticker === ticker)
    if (stock) {
      openWithPrompt(ticker, buildAnalysisPrompt(stock, heatmapContext), 'heatmap')
    } else {
      openWithPrompt(ticker, `Analyze ${ticker} (${name}). Provide momentum drivers, key levels, setup quality, and a tactical trade plan with invalidation.`, 'heatmap')
    }
  }, [stocks, heatmapContext, openWithPrompt])

  const handleToggleSector = useCallback((sector: SP500Sector) => {
    setSelectedSectors((prev) => {
      if (prev.includes(sector)) {
        if (prev.length === 1) return prev
        return prev.filter((s) => s !== sector)
      }
      return [...prev, sector]
    })
  }, [])

  const handleSectorHighlight = useCallback((sector: SP500Sector) => {
    setHighlightedSector(prev => prev === sector ? null : sector)
  }, [])

  // Filter stocks by selected sectors
  const filteredStocks = useMemo(
    () => stocks.filter((stock) => selectedSectors.includes(stock.sector as SP500Sector)),
    [stocks, selectedSectors]
  )

  const marketStatus = getMarketStatus()
  const isMarketOpen = marketStatus === 'open'

  const subtitleParts = [
    `${filteredStocks.length} stocks`,
    `${selectedSectors.length} sectors`,
  ]
  if (timeframe !== '1D') {
    subtitleParts.push(`${timeframe} performance`)
  } else if (lastUpdated) {
    subtitleParts.push(`Updated ${new Date(lastUpdated).toLocaleTimeString()}`)
  }

  return (
    <motion.div
      variants={pageEnter}
      initial="hidden"
      animate="visible"
      className="flex flex-col h-full overflow-hidden"
    >
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 bg-gradient-to-b from-white/[0.03] to-transparent border-b border-[var(--border-subtle)]">
        <PageHeader
          title="S&P 500 Heatmap"
          subtitle={subtitleParts.join(' · ')}
          className="mb-3"
          actions={
            <div className="flex items-center gap-2 flex-wrap">
              {/* Timeframe selector */}
              <div className="flex items-center gap-0.5 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg p-0.5">
                {TIMEFRAMES.map(tf => (
                  <button
                    key={tf.value}
                    onClick={() => setTimeframe(tf.value)}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                      timeframe === tf.value
                        ? 'bg-[var(--accent-muted)] text-[var(--accent-primary)] shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    )}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>

              {/* My Stocks toggle */}
              <button
                onClick={() => setShowMyStocks(!showMyStocks)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150",
                  showMyStocks
                    ? 'bg-[var(--accent-muted)] text-[var(--accent-primary)] border border-[var(--accent-primary)]/30'
                    : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-default)] hover:border-[var(--border-hover)]'
                )}
              >
                <Crosshair className="w-3.5 h-3.5" weight={showMyStocks ? "fill" : "regular"} />
                My Stocks
              </button>

              {/* Auto-refresh toggle */}
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-150",
                  autoRefresh
                    ? 'bg-[var(--accent-muted)] text-[var(--accent-primary)] border border-[var(--accent-primary)]/30'
                    : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-default)] hover:border-[var(--border-hover)]'
                )}
              >
                <Lightning className="w-3 h-3" weight={autoRefresh ? "fill" : "regular"} />
                Auto
              </button>

              {/* Manual refresh */}
              <button
                onClick={() => refetch()}
                disabled={isLoading}
                className="px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-default)] hover:border-[var(--border-hover)] transition-all duration-150 disabled:opacity-50"
              >
                <ArrowsClockwise className={cn("w-4 h-4 text-[var(--text-secondary)]", isLoading && 'animate-spin')} />
              </button>

              {/* View mode toggle */}
              <div className="hidden sm:flex items-center gap-1 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg p-1">
                <button
                  onClick={() => setViewMode('treemap')}
                  className={cn(
                    "px-3 py-1.5 rounded text-xs font-medium transition-all duration-150",
                    viewMode === 'treemap'
                      ? 'bg-[var(--accent-muted)] text-[var(--accent-primary)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  )}
                >
                  <SquaresFour className="w-4 h-4" weight={viewMode === 'treemap' ? "fill" : "regular"} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "px-3 py-1.5 rounded text-xs font-medium transition-all duration-150",
                    viewMode === 'grid'
                      ? 'bg-[var(--accent-muted)] text-[var(--accent-primary)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  )}
                >
                  <GridFour className="w-4 h-4" weight={viewMode === 'grid' ? "fill" : "regular"} />
                </button>
              </div>
            </div>
          }
        />

        {/* Market status + Breadth strip */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", isMarketOpen ? 'bg-[var(--data-positive)]' : 'bg-[var(--data-warning)]')} />
            <span className="text-xs text-[var(--text-muted)]">
              Market {isMarketOpen ? 'Open' : marketStatus.replace('-', ' ')}
            </span>
          </div>
          <MarketBreadthStrip stocks={filteredStocks} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
        {/* Sidebar */}
        <div className="flex-shrink-0 sm:w-64 border-b sm:border-b-0 sm:border-r border-[var(--border-subtle)] overflow-y-auto">
          {/* Mobile: horizontal scrolling pills */}
          <div className="sm:hidden flex gap-2 overflow-x-auto scrollbar-hide p-3 pb-2">
            {getSectors().map((sector) => {
              const sectorStocks = stocks.filter(s => s.sector === sector)
              const avgChange = sectorStocks.length > 0
                ? sectorStocks.reduce((sum, s) => sum + (s.changePercent ?? 0), 0) / sectorStocks.length
                : 0
              const isSelected = selectedSectors.includes(sector)

              return (
                <button
                  key={sector}
                  onClick={() => handleToggleSector(sector)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[10px] whitespace-nowrap flex-shrink-0 border transition-all duration-150",
                    isSelected
                      ? 'bg-[var(--accent-muted)] border-[var(--accent-primary)]/30 text-[var(--accent-primary)]'
                      : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-muted)]'
                  )}
                >
                  {sector}
                  <span className="ml-1">
                    <DataCell
                      value={avgChange.toFixed(2)}
                      sentiment={avgChange >= 0 ? 'positive' : 'negative'}
                      prefix={avgChange >= 0 ? '+' : ''}
                      suffix="%"
                      size="sm"
                      className="text-[10px]"
                    />
                  </span>
                </button>
              )
            })}
          </div>

          {/* Desktop: vertical legend */}
          <div className="hidden sm:block p-4">
            <SectorLegend
              stocks={stocks}
              selectedSectors={selectedSectors}
              onToggleSector={handleToggleSector}
              onHighlightSector={handleSectorHighlight}
              highlightedSector={highlightedSector}
            />
          </div>
        </div>

        {/* Heatmap visualization */}
        <div ref={containerRef} className="flex-1 p-4 overflow-auto">
          {error && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-[var(--data-negative)] text-sm mb-2">Failed to load heatmap data</p>
                <button onClick={() => refetch()} className="text-xs text-[var(--accent-primary)] hover:text-[var(--accent-hover)] transition-colors duration-150">
                  Try again
                </button>
              </div>
            </div>
          )}

          {isLoading && stocks.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <ArrowsClockwise className="w-8 h-8 text-[var(--accent-primary)] animate-spin mx-auto mb-2" />
                <p className="text-[var(--text-muted)] text-sm">Loading heatmap data...</p>
              </div>
            </div>
          )}

          {!error && !isLoading && filteredStocks.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <p className="text-[var(--text-muted)] text-sm">No stocks to display</p>
            </div>
          )}

          {!error && filteredStocks.length > 0 && (
            <>
              {/* Desktop: Treemap or Grid */}
              {viewMode === 'treemap' && (
                <div className="hidden sm:flex items-center justify-center">
                  <Treemap
                    stocks={filteredStocks}
                    width={dimensions.width}
                    height={dimensions.height}
                    onStockClick={handleStockClick}
                    highlightedSector={highlightedSector}
                    showMyStocks={showMyStocks}
                    positionTickers={positionTickers}
                    watchlistTickers={watchlistTickers}
                    positionPnl={positionPnl}
                    earningsToday={emptyEarnings}
                  />
                </div>
              )}

              {viewMode === 'grid' && (
                <div className="hidden sm:block">
                  <HeatmapGrid stocks={filteredStocks} onStockClick={handleStockClick} />
                </div>
              )}

              {/* Mobile: Sorted list view */}
              <div className="sm:hidden space-y-1 p-3">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    {selectedSectors.length === getSectors().length ? 'All Stocks' : `${selectedSectors.join(', ')}`} — Sorted by Change
                  </h3>
                  <span className="text-[10px] font-mono tabular-nums text-[var(--text-muted)]">
                    {filteredStocks.length} stocks
                  </span>
                </div>

                {[...filteredStocks]
                  .sort((a, b) => (b.changePercent ?? 0) - (a.changePercent ?? 0))
                  .map((stock) => (
                    <button
                      key={stock.ticker}
                      onClick={() => handleStockClick(stock.ticker, stock.name)}
                      className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[var(--bg-elevated)] active:bg-[var(--bg-elevated)] transition-colors duration-150 min-h-[44px] cursor-pointer"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-xs font-bold text-[var(--accent-primary)] w-12 text-left tabular-nums">
                          {stock.ticker}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)] truncate">
                          {stock.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-[10px] font-mono tabular-nums text-[var(--text-secondary)]">
                          ${stock.price?.toFixed(2) ?? '—'}
                        </span>
                        <DataCell
                          value={stock.changePercent?.toFixed(2) ?? '0.00'}
                          sentiment={(stock.changePercent ?? 0) >= 0 ? 'positive' : 'negative'}
                          prefix={(stock.changePercent ?? 0) >= 0 ? '+' : ''}
                          suffix="%"
                          size="sm"
                          className="w-16 text-right font-semibold"
                        />
                      </div>
                    </button>
                  ))
                }
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}
