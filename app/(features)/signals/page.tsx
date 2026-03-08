'use client'

import { useState } from 'react'
import { ArrowsClockwise, Bird, Heart, ArrowsLeftRight } from '@phosphor-icons/react'
import { MOCK_ANALYST_POSTS, MOCK_CT_SIGNALS, MOCK_WALLET_SIGNALS, MOCK_MACRO_SIGNALS } from '@/lib/crypto-mock-data'

const FILTER_TABS = ['All', 'Analyst', 'CT', 'On-Chain', 'Macro'] as const
type FilterType = typeof FILTER_TABS[number]

const borderColors: Record<string, string> = {
  analyst: '#1DA1C4', ct: '#A78BFA', onchain: '#22C55E', macro: '#F59E0B',
}

export default function SignalsPage() {
  const [filter, setFilter] = useState<FilterType>('All')

  const allSignals = [
    ...MOCK_ANALYST_POSTS, ...MOCK_CT_SIGNALS,
    ...MOCK_WALLET_SIGNALS, ...MOCK_MACRO_SIGNALS,
  ]

  const filtered = filter === 'All' ? allSignals :
    filter === 'Analyst' ? MOCK_ANALYST_POSTS :
    filter === 'CT' ? MOCK_CT_SIGNALS :
    filter === 'On-Chain' ? MOCK_WALLET_SIGNALS :
    MOCK_MACRO_SIGNALS

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">Signals</h1>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[11px] text-green-500">Live</span>
        </div>
        <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
          <ArrowsClockwise size={18} />
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl bg-card border">
        {FILTER_TABS.map(tab => (
          <button key={tab} onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors cursor-pointer ${
              filter === tab ? 'bg-[#1DA1C4]/15 text-[#1DA1C4]' : 'text-muted-foreground hover:text-foreground'
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Signal cards */}
      <div className="space-y-3">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {filtered.map((signal: any) => (
          <div key={signal.id} className="rounded-xl border bg-card p-4 relative overflow-hidden"
            style={{ borderLeftWidth: 3, borderLeftColor: borderColors[signal.type] || '#666' }}>

            {signal.type === 'analyst' && (
              <>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                      style={{ backgroundColor: signal.analyst_color }}>
                      {signal.analyst_name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <span className="text-[13px] font-medium">{signal.analyst_name}</span>
                      <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-muted text-muted-foreground">{signal.methodology}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-muted-foreground">{signal.timestamp}</span>
                    <Bird size={16} weight="fill" className="text-[#1DA1C4]" />
                  </div>
                </div>
                <div className="flex gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${signal.direction === 'BULLISH' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {signal.direction}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#1DA1C4]/10 text-[#1DA1C4]">{signal.asset}</span>
                  {signal.in_portfolio && <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted text-muted-foreground">In portfolio</span>}
                </div>
                <h3 className="text-[14px] font-semibold mb-1">{signal.title}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">{signal.body}</p>
                <div className="flex gap-2 mb-2">
                  {Object.entries(signal.key_levels).map(([k, v]) => (
                    <span key={k} className="px-2 py-1 rounded-md bg-muted text-[11px] font-mono">
                      <span className="uppercase text-muted-foreground">{k}</span> <span className="font-semibold">{v as string}</span>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${signal.confidence}%`, background: 'linear-gradient(90deg, #1A6FB5, #25BFDF)' }} />
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">{signal.confidence}%</span>
                </div>
              </>
            )}

            {signal.type === 'ct' && (
              <>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium">{signal.author}</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-[#1DA1C4]/10 text-[#1DA1C4]">{signal.asset}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-muted-foreground">{signal.timestamp}</span>
                    <Bird size={16} weight="fill" className="text-[#1DA1C4]" />
                  </div>
                </div>
                <div className="pl-3 border-l-2 border-muted-foreground/20 mb-3">
                  <p className="text-[12px] italic text-muted-foreground">{signal.original_tweet}</p>
                </div>
                <div className="rounded-lg p-2.5 mb-2"
                  style={{ background: 'linear-gradient(135deg, rgba(29,161,196,0.04) 0%, var(--card) 40%)', border: '1px solid rgba(29,161,196,0.10)' }}>
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[1.5px] font-semibold text-[#1DA1C4] mb-1">
                    <Bird size={12} weight="fill" className="text-[#1DA1C4]" />
                    PELICAN TRANSLATION
                  </div>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{signal.pelican_translation}</p>
                </div>
                <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1"><Heart size={12} /> {signal.engagement.likes.toLocaleString()}</span>
                  <span className="flex items-center gap-1"><ArrowsLeftRight size={12} /> {signal.engagement.retweets}</span>
                </div>
              </>
            )}

            {signal.type === 'onchain' && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${signal.action === 'Bought' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-[13px] font-medium">{signal.wallet_label}</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-purple-500/10 text-purple-500">{signal.archetype}</span>
                  <span className="text-[13px] text-muted-foreground">{signal.action}</span>
                  <span className="text-[13px] font-semibold text-[#1DA1C4]">{signal.amount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-muted-foreground">{signal.timestamp}</span>
                  <Bird size={16} weight="fill" className="text-[#1DA1C4]" />
                </div>
              </div>
            )}

            {signal.type === 'macro' && (
              <>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-[1.5px] font-semibold text-amber-500">MACRO TRANSLATION</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-[#1DA1C4]/10 text-[#1DA1C4]">ForexAnalytix</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-muted-foreground">{signal.timestamp}</span>
                    <Bird size={16} weight="fill" className="text-[#1DA1C4]" />
                  </div>
                </div>
                <h3 className="text-[14px] font-semibold mb-2">{signal.title}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">{signal.body}</p>
                <div className="flex gap-2">
                  {signal.affected_assets.map((a: string) => (
                    <span key={a} className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted text-muted-foreground">{a}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="text-center text-[12px] text-muted-foreground mt-8 mb-4">
        You&apos;re all caught up
      </div>
    </div>
  )
}
