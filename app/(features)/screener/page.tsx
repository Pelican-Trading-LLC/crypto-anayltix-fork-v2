'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Scales, ChartBar, Coins, ChatCircle } from '@phosphor-icons/react'
import { tabContent, staggerContainer, staggerItem } from '@/components/ui/pelican/motion-variants'
import { PolymarketTab } from '@/components/markets-intel/polymarket-tab'
import { RWATab } from '@/components/markets-intel/rwa-tab'
import { usePolymarketEvents } from '@/hooks/use-polymarket'
import { useRWAData } from '@/hooks/use-rwa'
import { parseMarket } from '@/lib/api/polymarket'
import type { ParsedMarket } from '@/lib/api/polymarket'
import { formatCompact } from '@/lib/crypto-mock-data'
import { usePelicanPanelContext } from '@/providers/pelican-panel-provider'

const TABS = [
  { label: 'Prediction Markets', icon: ChartBar },
  { label: 'Tokenization', icon: Coins },
  { label: 'All', icon: Scales },
] as const

function AllTab() {
  const { data: events } = usePolymarketEvents('crypto', 5)
  const { data: rwaData } = useRWAData()
  const { openWithPrompt } = usePelicanPanelContext()
  const markets: ParsedMarket[] = events?.flatMap(e => e.markets.map(parseMarket)).slice(0, 5) ?? []
  const assets = rwaData?.assets?.slice(0, 10) ?? []

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8">
      {/* Top Predictions */}
      <motion.div variants={staggerItem}>
        <h3 className="text-[11px] uppercase tracking-[1.5px] font-semibold text-muted-foreground mb-4">TOP PREDICTION MARKETS</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {markets.map(m => {
            const pct = (m.yesPrice * 100).toFixed(0)
            const color = m.yesPrice >= 0.6 ? 'text-green-500' : m.yesPrice <= 0.4 ? 'text-red-500' : 'text-amber-500'
            return (
              <div key={m.id} className="rounded-xl border bg-card p-3">
                <div className="text-[11px] text-muted-foreground line-clamp-2 mb-2">{m.question}</div>
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-lg font-semibold tabular-nums ${color}`}>{pct}%</span>
                  <span className="font-mono text-[10px] text-muted-foreground tabular-nums">{formatCompact(m.volume)}</span>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Top RWA Assets */}
      <motion.div variants={staggerItem}>
        <h3 className="text-[11px] uppercase tracking-[1.5px] font-semibold text-muted-foreground mb-4">TOP TOKENIZED ASSETS</h3>
        <div className="rounded-xl border bg-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {['NAME', 'PLATFORM', 'TOTAL VALUE', 'APY', '30D %', 'UNDERLYING', ''].map(h => (
                  <th key={h} className={`px-4 py-3 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground ${h !== 'NAME' && h !== 'PLATFORM' && h !== 'UNDERLYING' && h !== '' ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assets.map(asset => (
                <tr key={asset.id} className="border-b border-[var(--border)] last:border-0 hover:bg-accent/5 transition-colors">
                  <td className="px-4 py-3 text-[13px] font-medium">{asset.name}</td>
                  <td className="px-4 py-3 text-[12px] text-muted-foreground">{asset.platform}</td>
                  <td className="px-4 py-3 font-mono text-[13px] tabular-nums text-right">{formatCompact(asset.totalValue)}</td>
                  <td className="px-4 py-3 font-mono text-[13px] tabular-nums text-right">
                    {asset.apy !== null ? <span className="text-green-500">{asset.apy}%</span> : <span className="text-muted-foreground">---</span>}
                  </td>
                  <td className="px-4 py-3 font-mono text-[12px] tabular-nums text-right">
                    <span className={asset.change30d >= 0 ? 'text-green-500' : 'text-red-500'}>
                      {asset.change30d >= 0 ? '+' : ''}{asset.change30d.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-muted-foreground truncate max-w-[200px]">{asset.underlying}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openWithPrompt(null, {
                        visibleMessage: `Analyze ${asset.name}`,
                        fullPrompt: `[RWA ANALYSIS]\nAnalyze ${asset.name} — a tokenized ${asset.underlying} on ${asset.platform}. Total value: $${asset.totalValue.toLocaleString()}. APY: ${asset.apy ?? 'N/A'}%. 30D change: ${asset.change30d}%.`
                      }, null)}
                      className="flex items-center gap-1 text-[11px] text-[#1DA1C4] hover:underline font-medium cursor-pointer whitespace-nowrap"
                    >
                      <ChatCircle size={12} weight="fill" />
                      Ask
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function MarketsIntelligencePage() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Scales size={24} className="text-[#1DA1C4]" />
          <h1 className="text-xl font-semibold">Markets Intelligence</h1>
        </div>
        <p className="text-sm text-muted-foreground">Prediction markets, tokenized assets, and macro intelligence in one view.</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 border-b border-[var(--border-subtle)] pb-px">
        {TABS.map((tab, i) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.label}
              onClick={() => setActiveTab(i)}
              className={`flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium transition-colors relative ${
                i === activeTab
                  ? 'text-[#1DA1C4]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon size={16} weight={i === activeTab ? 'fill' : 'regular'} />
              {tab.label}
              {i === activeTab && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1DA1C4] rounded-full"
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={tabContent}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {activeTab === 0 && <PolymarketTab />}
          {activeTab === 1 && <RWATab />}
          {activeTab === 2 && <AllTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
