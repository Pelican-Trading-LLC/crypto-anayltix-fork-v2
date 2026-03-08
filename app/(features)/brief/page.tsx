'use client'

import { MOCK_BRIEF } from '@/lib/crypto-mock-data'
import { Bird, ArrowsClockwise } from '@phosphor-icons/react'

export default function BriefPage() {
  const brief = MOCK_BRIEF
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div className="max-w-[760px] mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold">Daily Brief</h1>
          <p className="text-sm text-muted-foreground mt-1">{today}</p>
        </div>
        <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
          <ArrowsClockwise size={18} />
        </button>
      </div>

      {/* Market Snapshot */}
      <div className="rounded-xl border bg-card p-5 mb-4">
        <h2 className="text-[11px] uppercase tracking-[1.5px] font-semibold text-muted-foreground mb-4">Market Snapshot</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'BTC', value: `${brief.market_snapshot.btc_price.toLocaleString()}`, change: brief.market_snapshot.btc_change_24h },
            { label: 'ETH', value: `${brief.market_snapshot.eth_price.toLocaleString()}`, change: brief.market_snapshot.eth_change_24h },
            { label: 'Total MCap', value: brief.market_snapshot.total_market_cap, change: null },
            { label: 'BTC Dom', value: `${brief.market_snapshot.btc_dominance}%`, change: null },
          ].map(item => (
            <div key={item.label}>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{item.label}</span>
              <div className="font-mono text-lg font-semibold tabular-nums">{item.value}</div>
              {item.change !== null && (
                <span className={`font-mono text-xs tabular-nums ${item.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {item.change >= 0 ? '▲' : '▼'} {item.change >= 0 ? '+' : ''}{item.change}%
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Overnight Summary */}
      <div className="rounded-xl border bg-card p-5 mb-4">
        <h2 className="text-[11px] uppercase tracking-[1.5px] font-semibold text-[#1DA1C4] mb-3">Overnight</h2>
        <p className="text-sm text-muted-foreground leading-[1.8]">{brief.overnight_summary}</p>
      </div>

      {/* Portfolio Impact */}
      <div className="rounded-xl border bg-card p-5 mb-4" style={{ background: 'linear-gradient(135deg, rgba(29,161,196,0.04) 0%, var(--card) 60%)' }}>
        <h2 className="text-[11px] uppercase tracking-[1.5px] font-semibold text-[#1DA1C4] mb-3">Your Portfolio</h2>
        <p className="text-sm text-muted-foreground leading-[1.8]">{brief.portfolio_impact}</p>
      </div>

      {/* Key Levels */}
      <div className="rounded-xl border bg-card p-5 mb-4">
        <h2 className="text-[11px] uppercase tracking-[1.5px] font-semibold text-muted-foreground mb-4">Key Levels Today</h2>
        <div className="space-y-3">
          {brief.key_levels.map((level, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-semibold text-white ${level.type === 'support' ? 'bg-green-500' : 'bg-red-500'}`}>
                {level.type === 'support' ? 'S' : 'R'}
              </span>
              <div>
                <span className="font-mono text-sm font-semibold">{level.asset} {level.level}</span>
                <p className="text-xs text-muted-foreground mt-0.5">{level.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* One Thing to Learn */}
      <div className="rounded-xl border bg-card p-5" style={{ borderLeftWidth: 3, borderLeftColor: '#1DA1C4' }}>
        <div className="flex items-center gap-2 mb-3">
          <Bird size={16} weight="fill" className="text-[#1DA1C4]" />
          <h2 className="text-[11px] uppercase tracking-[1.5px] font-semibold text-[#1DA1C4]">One Thing to Learn</h2>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#1DA1C4]/10 text-[#1DA1C4]">{brief.one_thing_to_learn.topic}</span>
        </div>
        <p className="text-sm text-muted-foreground leading-[1.8]">{brief.one_thing_to_learn.content}</p>
      </div>
    </div>
  )
}
