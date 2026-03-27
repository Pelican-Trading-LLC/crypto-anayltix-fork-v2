'use client'

import { useState } from 'react'
import { usePolymarkets } from '@/hooks/use-polymarket'
import { categorizeMarket, formatVolume, type PolymarketMarket } from '@/lib/polymarket'
import { usePelicanPanelContext } from '@/providers/pelican-panel-provider'
import { ChatCircle } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { tabContent } from '@/components/ui/pelican/motion-variants'

const SUB_TABS = [
  { label: 'Crypto', filter: 'crypto' },
  { label: 'Macro', filter: 'macro' },
  { label: 'Stocks', filter: 'stocks' },
  { label: 'Geopolitical', filter: 'geopolitical' },
] as const

function MarketCard({ market }: { market: PolymarketMarket }) {
  const { openWithPrompt } = usePelicanPanelContext()
  const prices = market._parsedPrices || []
  const prob = prices[0] ? prices[0] * 100 : 50
  const noPct = prices[1] ? (prices[1] * 100).toFixed(0) : (100 - prob).toFixed(0)
  const pct = prob.toFixed(0)
  const color = prob >= 60 ? '#3EBD8C' : prob <= 40 ? '#E06565' : '#D4A042'

  return (
    <div className="group rounded-xl border bg-card p-4 hover:border-[var(--border-hover)] transition-all hover:-translate-y-px">
      <div className="text-[13px] font-medium mb-3 line-clamp-2 leading-tight min-h-[2.5em]">
        {market.question}
      </div>
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 h-2 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
        </div>
      </div>
      <div className="flex items-center justify-between text-[11px]">
        <div className="flex gap-3">
          <span className="font-mono tabular-nums"><span style={{ color }} className="font-semibold">{pct}%</span><span className="text-muted-foreground ml-1">Yes</span></span>
          <span className="font-mono tabular-nums text-muted-foreground">{noPct}% No</span>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground tabular-nums">Vol: {formatVolume(market.volume24hr || market.volume || 0)}</span>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border-subtle)]">
        <span className="font-mono text-[10px] text-muted-foreground tabular-nums">Liq: {formatVolume(market.liquidity || 0)}</span>
        <button
          onClick={() => openWithPrompt(null, {
            visibleMessage: `Analyze: ${market.question}`,
            fullPrompt: `[PREDICTION MARKET ANALYSIS]\nAnalyze this Polymarket prediction: "${market.question}"\nCurrent YES price: ${pct}%\nVolume: ${formatVolume(market.volume || 0)}\n\nProvide:\n1. What this prediction implies for crypto markets\n2. Historical accuracy of similar prediction markets\n3. How traders should position based on these odds\n4. Key catalysts that could shift the odds`
          }, null)}
          className="flex items-center gap-1 text-[11px] text-[#4A90C4] hover:underline font-medium cursor-pointer opacity-40 group-hover:opacity-90 transition-opacity"
        >
          <ChatCircle size={12} weight="fill" />Ask Pelican
        </button>
      </div>
    </div>
  )
}

export function PolymarketTab() {
  const [activeSubTab, setActiveSubTab] = useState(0)
  const currentFilter = SUB_TABS[activeSubTab]?.filter ?? 'crypto'
  const { markets: allMarkets, isLoading } = usePolymarkets({ limit: 30 })

  const markets = allMarkets.filter(m => categorizeMarket(m) === currentFilter).slice(0, 12)

  return (
    <div>
      <div className="flex gap-1 mb-6">
        {SUB_TABS.map((tab, i) => (
          <button key={tab.filter} onClick={() => setActiveSubTab(i)} className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${i === activeSubTab ? 'bg-[#4A90C4]/15 text-[#4A90C4]' : 'text-muted-foreground hover:text-foreground hover:bg-[var(--bg-elevated)]'}`}>
            {tab.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={currentFilter} variants={tabContent} initial="hidden" animate="visible" exit="exit">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map(i => (<div key={i} className="rounded-xl border bg-card p-4"><div className="h-10 rounded shimmer mb-3" /><div className="h-2 rounded-full shimmer mb-3" /><div className="h-4 rounded shimmer" /></div>))}
            </div>
          ) : markets.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">No active markets for this category.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {markets.map(m => <MarketCard key={m.conditionId || m.id} market={m} />)}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
