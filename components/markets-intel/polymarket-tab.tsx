'use client'

import { useState } from 'react'
import { usePolymarketEvents } from '@/hooks/use-polymarket'
import { parseMarket } from '@/lib/api/polymarket'
import type { ParsedMarket } from '@/lib/api/polymarket'
import { formatCompact } from '@/lib/crypto-mock-data'
import { usePelicanPanelContext } from '@/providers/pelican-panel-provider'
import { ChatCircle } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { tabContent } from '@/components/ui/pelican/motion-variants'

const SUB_TABS = [
  { label: 'Crypto', tag: 'crypto' },
  { label: 'Fed Rates', tag: 'fed-funds-rate' },
  { label: 'Finance', tag: 'finance' },
  { label: 'Economy', tag: 'economy' },
] as const

function MarketCard({ market }: { market: ParsedMarket }) {
  const { openWithPrompt } = usePelicanPanelContext()
  const pct = (market.yesPrice * 100).toFixed(0)
  const noPct = (market.noPrice * 100).toFixed(0)
  const color = market.yesPrice >= 0.6 ? '#22C55E' : market.yesPrice <= 0.4 ? '#EF4444' : '#F59E0B'

  return (
    <div className="rounded-xl border bg-card p-4 hover:border-[var(--border-hover)] transition-all hover:-translate-y-px">
      <div className="text-[13px] font-medium mb-3 line-clamp-2 leading-tight min-h-[2.5em]">
        {market.question}
      </div>

      {/* Probability bar */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 h-2 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, backgroundColor: color }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px]">
        <div className="flex gap-3">
          <span className="font-mono tabular-nums">
            <span style={{ color }} className="font-semibold">{pct}%</span>
            <span className="text-muted-foreground ml-1">Yes</span>
          </span>
          <span className="font-mono tabular-nums text-muted-foreground">
            {noPct}% No
          </span>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
          Vol: {formatCompact(market.volume)}
        </span>
      </div>

      {/* Liquidity + Ask Pelican */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border-subtle)]">
        <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
          Liq: {formatCompact(market.liquidity)}
        </span>
        <button
          onClick={() => openWithPrompt(null, {
            visibleMessage: `Analyze: ${market.question}`,
            fullPrompt: `[PREDICTION MARKET ANALYSIS]\nAnalyze this Polymarket prediction: "${market.question}"\nCurrent YES price: ${pct}%\nVolume: $${market.volume.toLocaleString()}\n\nProvide:\n1. What this prediction implies for crypto markets\n2. Historical accuracy of similar prediction markets\n3. How traders should position based on these odds\n4. Key catalysts that could shift the odds`
          }, null)}
          className="flex items-center gap-1 text-[11px] text-[#1DA1C4] hover:underline font-medium cursor-pointer"
        >
          <ChatCircle size={12} weight="fill" />
          Ask Pelican
        </button>
      </div>
    </div>
  )
}

export function PolymarketTab() {
  const [activeSubTab, setActiveSubTab] = useState(0)
  const currentTag = SUB_TABS[activeSubTab]?.tag ?? 'crypto'
  const { data: events, isLoading } = usePolymarketEvents(currentTag, 12)

  const markets: ParsedMarket[] = (Array.isArray(events) ? events : [])
    .flatMap(e => (Array.isArray(e?.markets) ? e.markets : []).map(m => {
      try { return parseMarket(m) } catch { return null }
    }))
    .filter((m): m is ParsedMarket => m !== null)

  return (
    <div>
      {/* Sub-tabs */}
      <div className="flex gap-1 mb-6">
        {SUB_TABS.map((tab, i) => (
          <button
            key={tab.tag}
            onClick={() => setActiveSubTab(i)}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
              i === activeSubTab
                ? 'bg-[#1DA1C4]/15 text-[#1DA1C4]'
                : 'text-muted-foreground hover:text-foreground hover:bg-[var(--bg-elevated)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTag}
          variants={tabContent}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="rounded-xl border bg-card p-4">
                  <div className="h-10 rounded shimmer mb-3" />
                  <div className="h-2 rounded-full shimmer mb-3" />
                  <div className="h-4 rounded shimmer" />
                </div>
              ))}
            </div>
          ) : markets.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No active markets found for this category.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {markets.map(m => <MarketCard key={m.id} market={m} />)}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
