'use client'

import { useState, useRef, useEffect } from 'react'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { AVAILABLE_TICKERS, ASSET_COLORS } from '@/lib/crypto-mock-data'

interface Props {
  onSelect: (symbol: string) => void
  currentSymbol: string | null
}

export function TokenSearch({ onSelect, currentSymbol }: Props) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const filtered = query.length > 0
    ? AVAILABLE_TICKERS.filter(t =>
        t.symbol.toLowerCase().includes(query.toLowerCase()) ||
        t.name.toLowerCase().includes(query.toLowerCase())
      )
    : AVAILABLE_TICKERS

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (symbol: string) => {
    onSelect(symbol)
    setQuery('')
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative w-full max-w-[320px]">
      <div className="relative">
        <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder="Search ticker (e.g. BTC, SOL, AAVE)"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border bg-card text-[13px] placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-[#1DA1C4]/40 transition-all"
        />
      </div>
      {open && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-xl border bg-card shadow-xl z-50 overflow-hidden max-h-[240px] overflow-y-auto">
          {filtered.map(t => (
            <button key={t.symbol} onClick={() => handleSelect(t.symbol)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-accent/5 transition-colors cursor-pointer ${
                currentSymbol === t.symbol ? 'bg-[#1DA1C4]/5' : ''
              }`}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                style={{ backgroundColor: ASSET_COLORS[t.symbol] || '#666' }}>
                {t.symbol[0]}
              </div>
              <div>
                <span className="text-[13px] font-medium">{t.symbol}</span>
                <span className="text-[11px] text-muted-foreground ml-2">{t.name}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
