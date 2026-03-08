'use client'

import { useState } from 'react'
import { Bird } from '@phosphor-icons/react'
import { MOCK_SMART_MONEY } from '@/lib/crypto-mock-data'

const FILTERS = ['All', 'Accumulation', 'Distribution', 'Transfer'] as const

export default function SmartMoneyPage() {
  const [filter, setFilter] = useState<string>('All')

  const filtered = filter === 'All' ? MOCK_SMART_MONEY :
    MOCK_SMART_MONEY.filter(e => e.action.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-xl font-semibold">Smart Money Tracker</h1>
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        <span className="text-[11px] text-green-500">Live</span>
      </div>

      <div className="flex gap-2 mb-6">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors border cursor-pointer ${
              filter === f ? 'bg-[#1DA1C4]/10 text-[#1DA1C4] border-[#1DA1C4]/20' : 'text-muted-foreground border-[var(--border)] hover:text-foreground hover:bg-card'
            }`}>
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(entry => (
          <div key={entry.id} className="rounded-xl border bg-card p-4 hover:border-[var(--ring)] transition-colors cursor-pointer">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] text-muted-foreground">{entry.time}</span>
                <span className="text-[13px] font-medium">{entry.wallet_label}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#1DA1C4]/10 text-[#1DA1C4]">{entry.archetype}</span>
              </div>
              <Bird size={16} weight="fill" className="text-[#1DA1C4]" />
            </div>
            <p className="text-[14px] mb-1.5">
              <span className="text-muted-foreground">{entry.action}</span>{' '}
              <span className="font-semibold text-[#1DA1C4]">{entry.amount}</span>
            </p>
            <div className="rounded-lg p-2.5 mt-1"
              style={{ background: 'linear-gradient(135deg, rgba(29,161,196,0.04) 0%, var(--card) 40%)', border: '1px solid rgba(29,161,196,0.10)' }}>
              <div className="flex items-center gap-1.5 mb-1">
                <Bird size={12} weight="fill" className="text-[#1DA1C4]" />
                <span className="text-[10px] uppercase tracking-[1.5px] font-semibold text-[#1DA1C4]">Pelican</span>
              </div>
              <p className="text-[12px] italic text-muted-foreground leading-relaxed">
                &ldquo;{entry.pelican_commentary}&rdquo;
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
