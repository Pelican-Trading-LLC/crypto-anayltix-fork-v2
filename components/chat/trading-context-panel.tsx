"use client"

import { Card } from "@/components/ui/card"
import { TrendUp, TrendDown, Pulse, Star, CaretDown, CaretUp, CaretRight, GraduationCap, X, Plus, ChartLineUp, ChatCircle, Briefcase, Trash, MagnifyingGlass, Bell, BellRinging, BellSimple } from "@phosphor-icons/react"
import { IconTooltip } from "@/components/ui/icon-tooltip"
import { cn, normalizeTicker } from "@/lib/utils"
import { useState, useRef } from "react"
import type { Trade } from "@/hooks/use-trades"
import { motion, AnimatePresence } from "framer-motion"
import { useChart } from "@/providers/chart-provider"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { EducationChat } from "./EducationChat"
import { ActionsTab } from "./actions-tab"
import { useWatchlist } from "@/hooks/use-watchlist"
import { useLiveQuotes } from "@/hooks/use-live-quotes"
import { KNOWN_FOREX_PAIRS } from "@/lib/ticker-blocklist"
import { useTrades } from "@/hooks/use-trades"
import { formatPercent } from "@/lib/formatters"
import { MOCK_POSITIONS, MOCK_MARKET, MOCK_BRIEF, ASSET_COLORS, formatUSD, formatPct } from '@/lib/crypto-mock-data'
import { useOnboardingProgress } from "@/hooks/use-onboarding-progress"
import { useTraderProfile } from "@/hooks/use-trader-profile"
import { usePelicanPanelContext } from "@/providers/pelican-panel-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Dynamic imports with SSR disabled to prevent build-time errors
const TradingViewChart = dynamic(
  () => import("./TradingViewChart").then(m => ({ default: m.TradingViewChart })),
  { ssr: false }
)

const EconomicCalendar = dynamic(
  () => import("./EconomicCalendar").then(m => ({ default: m.EconomicCalendar })),
  { ssr: false }
)

interface MarketIndex {
  symbol: string
  name: string
  price: number | null
  change: number | null
  changePercent: number | null
}

interface SectorData {
  name: string
  changePercent: number | null
}

interface WatchlistTicker {
  id: string
  symbol: string
  price: number | null
  changePercent: number | null
  customPrompt: string | null
  notes: string | null
  alertPriceAbove: number | null
  alertPriceBelow: number | null
}

// --- Market-adaptive panel configuration ---
interface MarketPanelConfig {
  indices: MarketIndex[]
  categories: SectorData[]
  categoryLabel: string
  /** Map sidebar category names → heatmap filter names (stocks only) */
  categoryHeatmapMap: Record<string, string>
  showVix: boolean
  volatilityLabel: string
  volatilitySubLabel: string
}

const MARKET_PANEL_CONFIGS: Record<string, MarketPanelConfig> = {
  crypto: {
    indices: [
      { symbol: "X:BTCUSD", name: "Bitcoin", price: null, change: null, changePercent: null },
      { symbol: "X:ETHUSD", name: "Ethereum", price: null, change: null, changePercent: null },
      { symbol: "X:SOLUSD", name: "Solana", price: null, change: null, changePercent: null },
    ],
    categories: [
      { name: "DeFi", changePercent: null },
      { name: "Layer 1", changePercent: null },
      { name: "Layer 2", changePercent: null },
      { name: "Gaming", changePercent: null },
    ],
    categoryLabel: "Categories",
    categoryHeatmapMap: {},
    showVix: false,
    volatilityLabel: "",
    volatilitySubLabel: "",
  },
}

function getMarketConfig(primaryMarket: string): MarketPanelConfig {
  return (MARKET_PANEL_CONFIGS[primaryMarket] ?? MARKET_PANEL_CONFIGS.crypto) as MarketPanelConfig
}

interface TradingContextPanelProps {
  indices?: MarketIndex[]
  vix?: number | null
  vixChange?: number | null
  sectors?: SectorData[]
  isLoading?: boolean
  onRefresh?: () => void
  collapsed?: boolean
  onToggleCollapse?: () => void
  onPrefillChat?: (message: string) => void
  // Learning mode props
  selectedTerm?: { term: string; fullName: string; shortDef: string; category: string } | null
  onClearTerm?: () => void
  learnTabActive?: boolean
  onLearnTabClick?: () => void
  learningEnabled?: boolean
  onToggleLearning?: () => void
  onFocusInput?: () => void
}

export function TradingContextPanel({
  indices,
  vix,
  vixChange,
  sectors,
  isLoading = false,
  collapsed = false,
  onToggleCollapse,
  onPrefillChat,
  selectedTerm,
  onClearTerm,
  learnTabActive = false,
  onLearnTabClick,
  learningEnabled = false,
  onToggleLearning,
  onFocusInput,
}: TradingContextPanelProps) {
  const { mode, selectedTicker, showChart, showCalendar, closeChart } = useChart()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(collapsed)
  const [editingWatchlist, setEditingWatchlist] = useState(false)
  const [addTickerInput, setAddTickerInput] = useState("")
  const addInputRef = useRef<HTMLInputElement>(null)

  // Real watchlist from Supabase
  const { items: watchlistItems, addToWatchlist, removeFromWatchlist, updateCustomPrompt, updateWatchlistItem, loading: watchlistLoading } = useWatchlist()
  const { openWithPrompt } = usePelicanPanelContext()
  const [alertEditTicker, setAlertEditTicker] = useState<string | null>(null)
  const [alertInput, setAlertInput] = useState("")
  const alertInputRef = useRef<HTMLInputElement>(null)
  const [priceAlertEditId, setPriceAlertEditId] = useState<string | null>(null)
  const [priceAboveInput, setPriceAboveInput] = useState("")
  const [priceBelowInput, setPriceBelowInput] = useState("")

  // Live quotes for watchlist tickers
  const watchlistSymbols = watchlistItems.map(item => item.ticker)
  const { quotes: watchlistQuotes } = useLiveQuotes(watchlistSymbols)

  // Merge watchlist items with live prices
  const watchlistTickers: WatchlistTicker[] = watchlistItems.map(item => ({
    id: item.id,
    symbol: item.ticker,
    price: watchlistQuotes[item.ticker]?.price ?? null,
    changePercent: watchlistQuotes[item.ticker]?.changePercent ?? null,
    customPrompt: item.custom_prompt ?? null,
    notes: item.notes ?? null,
    alertPriceAbove: item.alert_price_above ?? null,
    alertPriceBelow: item.alert_price_below ?? null,
  }))

  // Open trades
  const { openTrades } = useTrades()
  const { completeMilestone } = useOnboardingProgress()
  const { primaryMarket } = useTraderProfile()

  // Market-adaptive config driven by trader profile
  const marketConfig = getMarketConfig(primaryMarket)

  const defaultIndices: MarketIndex[] = indices || marketConfig.indices
  const defaultVix = vix ?? null
  const defaultVixChange = vixChange ?? null
  const defaultSectors: SectorData[] = sectors || marketConfig.categories

  // Map sidebar category names → heatmap filter names (empty for non-stock markets)
  const sectorToSP500 = marketConfig.categoryHeatmapMap

  // Rich prompt builder for active position clicks
  const buildPositionReviewPrompt = (trade: Trade) => {
    return [
      `Review my ${trade.direction} position in ${trade.ticker}.`,
      `Entry: ${trade.entry_price}`,
      trade.stop_loss ? `Stop: ${trade.stop_loss}` : null,
      trade.take_profit ? `Target: ${trade.take_profit}` : null,
      trade.thesis ? `Thesis: ${trade.thesis}` : null,
      trade.pnl_percent != null
        ? `Current P&L: ${trade.pnl_percent >= 0 ? '+' : ''}${trade.pnl_percent.toFixed(1)}%`
        : null,
      trade.entry_date ? `Opened: ${new Date(trade.entry_date).toLocaleDateString()}` : null,
      trade.conviction ? `Conviction: ${trade.conviction}/10` : null,
      'Give me updated analysis: price action, key levels, news catalysts, and whether my thesis still holds.',
    ].filter(Boolean).join(' ')
  }

  const handleAddTicker = async () => {
    const ticker = normalizeTicker(addTickerInput)
    if (!ticker) return
    // Duplicate check with normalization
    if (watchlistItems.some(item => normalizeTicker(item.ticker) === ticker)) {
      setAddTickerInput("")
      return
    }
    await addToWatchlist(ticker, { added_from: 'manual' })
    completeMilestone("first_watchlist")
    setAddTickerInput("")
    addInputRef.current?.focus()
  }

  const formatPrice = (price: number | null, symbol?: string) => {
    if (price === null) return "---"
    // Forex pairs need 4-5 decimal places; JPY pairs use 2-3
    if (symbol && KNOWN_FOREX_PAIRS.has(symbol.toUpperCase())) {
      const isJpyPair = symbol.toUpperCase().includes('JPY')
      const decimals = isJpyPair ? 3 : 5
      return price.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    }
    return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }


  const getChangeColor = (value: number | null) => {
    if (value === null) return "text-[var(--text-muted)]"
    return value >= 0 ? "text-[var(--data-positive)]" : "text-[var(--data-negative)]"
  }

  const getChangeBg = (value: number | null) => {
    if (value === null) return "bg-[var(--bg-elevated)]"
    return value >= 0 ? "bg-[var(--data-positive)]/10" : "bg-[var(--data-negative)]/10"
  }

  const [actionsTabActive, setActionsTabActive] = useState(false)

  const tabs = [
    { key: "market" as const, label: "Market" },
    { key: "actions" as const, label: "Actions" },
    { key: "learn" as const, label: "Learn" },
  ]

  const activeMode = learnTabActive ? "learn" : actionsTabActive ? "actions" : mode === "chart" && selectedTicker ? "chart" : mode === "calendar" ? "calendar" : "overview"

  // Chart, calendar, and learn modes get a full-height card
  if (activeMode === "chart" || activeMode === "calendar" || activeMode === "learn" || activeMode === "actions") {
    return (
      <Card className="border-l-0 rounded-l-none bg-[var(--bg-surface)]/60 backdrop-blur-xl border-l border-[var(--border-subtle)] rounded-none border-y-0 border-r-0 overflow-hidden h-full flex flex-col max-h-full">
        {(activeMode === "learn" || activeMode === "actions") && (
          <div className="flex items-center border-b border-border/20 shrink-0">
            <div className="flex flex-1">
              {tabs.map((tab) => {
                const isActive =
                  tab.key === "learn" ? learnTabActive :
                  tab.key === "actions" ? actionsTabActive :
                  false

                return (
                  <button
                    key={tab.key}
                    onClick={() => {
                      if (tab.key === "learn") {
                        if (actionsTabActive) setActionsTabActive(false)
                        onLearnTabClick?.()
                      } else if (tab.key === "actions") {
                        if (learnTabActive && onLearnTabClick) onLearnTabClick()
                        setActionsTabActive(!actionsTabActive)
                      } else {
                        if (learnTabActive && onLearnTabClick) onLearnTabClick()
                        if (actionsTabActive) setActionsTabActive(false)
                        closeChart()
                      }
                    }}
                    className={cn(
                      "flex-1 py-2.5 text-xs transition-colors duration-150 border-b-2 relative cursor-pointer",
                      isActive
                        ? "text-foreground font-medium border-primary"
                        : "text-muted-foreground border-transparent hover:text-foreground"
                    )}
                  >
                    <span className="flex items-center justify-center gap-1.5">
                      {tab.label}
                      {tab.key === "learn" && selectedTerm && !learnTabActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      )}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="h-full min-h-0 flex-1"
          >
            {activeMode === "actions" ? (
              <ActionsTab
                onSend={(msg) => onPrefillChat?.(msg)}
                onFocusInput={onFocusInput}
                openTrades={openTrades}
              />
            ) : activeMode === "learn" ? (
              learningEnabled ? (
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border-subtle)]">
                    <span className="text-xs text-[var(--text-muted)]">Learn mode active</span>
                    <button
                      onClick={() => onToggleLearning?.()}
                      className="text-xs text-[var(--text-muted)] hover:text-[var(--data-negative)] transition-colors"
                    >
                      Disable
                    </button>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <EducationChat
                      selectedTerm={selectedTerm ?? null}
                      onClear={onClearTerm ?? (() => {})}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <GraduationCap size={40} weight="thin" className="text-[var(--accent-primary)]/40 mb-3" />
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                    Learn mode highlights trading terms in Pelican&apos;s responses. Click any term to get the definition.
                  </p>
                  <button
                    onClick={() => onToggleLearning?.()}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-hover)] transition-colors duration-150"
                  >
                    Enable Learn Mode
                  </button>
                </div>
              )
            ) : activeMode === "chart" && selectedTicker ? (
              <TradingViewChart symbol={selectedTicker} onClose={closeChart} />
            ) : (
              <EconomicCalendar onClose={closeChart} />
            )}
          </motion.div>
        </AnimatePresence>
      </Card>
    )
  }

  return (
    <Card className="border-l-0 rounded-l-none bg-[var(--bg-surface)]/60 backdrop-blur-xl border-l border-[var(--border-subtle)] rounded-none border-y-0 border-r-0 overflow-hidden">
      {/* Tab bar */}
      <div className="flex items-center border-b border-border/20">
        <div className="flex flex-1">
          {tabs.map((tab) => {
            const isActive =
              tab.key === "learn"
                ? learnTabActive
                : tab.key === "actions"
                  ? actionsTabActive && !learnTabActive
                  : tab.key === "market"
                    ? !learnTabActive && !actionsTabActive && mode === "overview"
                    : false

            return (
              <button
                key={tab.key}
                onClick={() => {
                  if (tab.key === "learn") {
                    if (actionsTabActive) setActionsTabActive(false)
                    onLearnTabClick?.()
                  } else if (tab.key === "actions") {
                    if (learnTabActive && onLearnTabClick) onLearnTabClick()
                    setActionsTabActive(!actionsTabActive)
                  } else {
                    if (tab.key === "market") closeChart()
                    if (learnTabActive && onLearnTabClick) onLearnTabClick()
                    if (actionsTabActive) setActionsTabActive(false)
                  }
                }}
                className={cn(
                  "flex-1 py-2.5 text-xs transition-colors duration-150 border-b-2 relative cursor-pointer",
                  isActive
                    ? "text-foreground font-medium border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                )}
              >
                <span className="flex items-center justify-center gap-1.5">
                  {tab.label}
                  {tab.key === "learn" && selectedTerm && !learnTabActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </span>
              </button>
            )
          })}
        </div>
        <div className="flex items-center gap-0.5 px-1.5">
          <IconTooltip label={isCollapsed ? "Expand sections" : "Collapse sections"} side="left">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-muted-foreground hover:text-foreground transition-colors duration-150 p-0.5"
            >
              {isCollapsed ? <CaretUp size={14} weight="regular" /> : <CaretDown size={14} weight="regular" />}
            </button>
          </IconTooltip>
          {onToggleCollapse && (
            <IconTooltip label="Hide Market Overview" side="left">
              <button
                onClick={onToggleCollapse}
                className="text-muted-foreground hover:text-foreground transition-colors duration-150 p-0.5"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </IconTooltip>
          )}
        </div>
      </div>

      {/* Learn tab content */}
      {learnTabActive && (
        <div className="flex-1 overflow-hidden" style={{ height: 'calc(100% - 42px)' }}>
          <EducationChat
            selectedTerm={selectedTerm ?? null}
            onClear={onClearTerm ?? (() => {})}
          />
        </div>
      )}

      {/* Market tab content */}
      {!learnTabActive && !actionsTabActive && (
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {/* Portfolio */}
              <div className="px-4 py-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">PORTFOLIO</span>
                  <span className="font-mono text-[11px] text-muted-foreground">$65,942</span>
                </div>
                {MOCK_POSITIONS.map(p => (
                  <div key={p.asset} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white" style={{ backgroundColor: ASSET_COLORS[p.asset] }}>{p.asset[0]}</div>
                      <span className="text-[13px] font-medium">{p.asset}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-[12px] tabular-nums">{formatUSD(p.current_price)}</div>
                      <div className={`font-mono text-[10px] tabular-nums ${p.price_change_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {formatPct(p.price_change_24h)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Active Positions */}
              {openTrades.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                      <Briefcase size={12} weight="regular" />
                      Active Positions
                    </h4>
                    <span className="text-[10px] text-[var(--text-muted)] font-mono tabular-nums">{openTrades.length}</span>
                  </div>
                  <div className="space-y-1.5">
                    {openTrades.map((trade) => (
                      <div
                        key={trade.id}
                        onClick={() => onPrefillChat?.(buildPositionReviewPrompt(trade))}
                        className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-elevated)] cursor-pointer transition-all duration-150"
                      >
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "text-[9px] font-semibold px-1.5 py-0.5 rounded uppercase",
                            trade.direction === 'long'
                              ? "bg-[var(--data-positive)]/10 text-[var(--data-positive)]"
                              : "bg-[var(--data-negative)]/10 text-[var(--data-negative)]"
                          )}>
                            {trade.direction}
                          </span>
                          <span className="text-xs font-semibold text-[var(--text-primary)]">{trade.ticker}</span>
                        </div>
                        <span className="text-[10px] text-[var(--text-muted)] font-mono tabular-nums">
                          ${trade.entry_price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Crypto Sectors */}
              <div className="px-4 py-3">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">CRYPTO SECTORS</span>
                {MOCK_MARKET.sectors.map(s => (
                  <div key={s.name} className="flex items-center justify-between py-2">
                    <span className="text-[13px]">{s.name}</span>
                    <span className={`font-mono text-[12px] tabular-nums ${s.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {s.change >= 0 ? '+' : ''}{s.change}%
                    </span>
                  </div>
                ))}
              </div>

              {/* Volatility — only shown for markets that reference VIX */}
              {marketConfig.showVix && (
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Volatility</h4>
                <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2">
                    <Pulse size={16} weight="regular" className="text-[var(--data-warning)]" />
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-[var(--text-primary)]">{marketConfig.volatilityLabel}</span>
                      <span className="text-[10px] text-[var(--text-muted)]">{marketConfig.volatilitySubLabel}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold font-mono tabular-nums text-[var(--text-primary)]">{formatPrice(defaultVix)}</span>
                    <span className={cn("text-[10px] font-medium font-mono tabular-nums", getChangeColor(defaultVixChange))}>
                      {formatPercent(defaultVixChange)}
                    </span>
                  </div>
                </div>
              </div>
              )}

              {/* Market Overview */}
              <div className="px-4 py-3">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">MARKET OVERVIEW</span>
                {[
                  { label: 'BTC Dominance', value: `${MOCK_BRIEF.market_snapshot.btc_dominance}%` },
                  { label: 'Total MCap', value: MOCK_BRIEF.market_snapshot.total_market_cap },
                  { label: 'Fear & Greed', value: `${MOCK_MARKET.fear_greed} (${MOCK_MARKET.fear_greed_label})` },
                  { label: 'ETH/BTC', value: MOCK_MARKET.eth_btc.toFixed(4) },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-2">
                    <span className="text-[13px]">{item.label}</span>
                    <span className="font-mono text-[12px] tabular-nums">{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Refresh indicator */}
              {isLoading && (
                <div className="flex items-center justify-center py-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--accent-primary)]"></div>
                </div>
              )}

              {/* Last updated */}
              <div className="text-center pt-2 border-t border-[var(--border-subtle)]">
                <span className="text-[10px] text-[var(--text-muted)]">
                  {isLoading ? "Updating..." : "Prices via CoinGecko"}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      )}
    </Card>
  )
}