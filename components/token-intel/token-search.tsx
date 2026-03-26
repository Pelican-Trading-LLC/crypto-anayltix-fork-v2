'use client'

import { useState, useRef, useEffect } from 'react'
import { MagnifyingGlass, CircleNotch } from '@phosphor-icons/react'
import { AVAILABLE_TICKERS, ASSET_COLORS } from '@/lib/crypto-mock-data'

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

interface SearchResult {
  symbol: string
  name: string
  isLive: boolean
}

interface Props {
  onSelect: (symbol: string) => void
  currentSymbol: string | null
}

export function TokenSearch({ onSelect, currentSymbol }: Props) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [apiResults, setApiResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const debouncedQuery = useDebounce(query, 400)

  // Local results (mock data tokens)
  const localResults: SearchResult[] = query.length > 0
    ? AVAILABLE_TICKERS
        .filter(t => t.symbol.toLowerCase().includes(query.toLowerCase()) || t.name.toLowerCase().includes(query.toLowerCase()))
        .map(t => ({ symbol: t.symbol, name: t.name, isLive: true }))
    : AVAILABLE_TICKERS.map(t => ({ symbol: t.symbol, name: t.name, isLive: true }))

  // API search for tokens not in mock data
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setApiResults([])
      return
    }
    if (localResults.length >= 3) {
      setApiResults([])
      return
    }

    setSearching(true)
    fetch(`/api/crypto/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then(r => r.ok ? r.json() : { data: [] })
      .then(json => {
        const results = (json.data || [])
          .filter((c: { symbol: string; name: string }) => !AVAILABLE_TICKERS.some(t => t.symbol === c.symbol.toUpperCase()))
          .slice(0, 5)
          .map((c: { symbol: string; name: string }) => ({
            symbol: c.symbol.toUpperCase(),
            name: c.name,
            isLive: false,
          }))
        setApiResults(results)
      })
      .catch(() => setApiResults([]))
      .finally(() => setSearching(false))
  }, [debouncedQuery]) // eslint-disable-line react-hooks/exhaustive-deps

  const combined = [...localResults, ...apiResults]

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
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border bg-card text-[13px] placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-[#4A90C4]/40 transition-all"
        />
        {searching && (
          <CircleNotch size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground animate-spin" />
        )}
      </div>
      {open && combined.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-xl border bg-card shadow-xl z-50 overflow-hidden max-h-[300px] overflow-y-auto">
          {localResults.length > 0 && apiResults.length > 0 && (
            <div className="px-4 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground border-b border-[var(--border)]">Full Data</div>
          )}
          {localResults.map(t => (
            <button key={t.symbol} onClick={() => handleSelect(t.symbol)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-accent/5 transition-colors cursor-pointer ${
                currentSymbol === t.symbol ? 'bg-[#4A90C4]/5' : ''
              }`}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                style={{ backgroundColor: ASSET_COLORS[t.symbol] || '#666' }}>
                {t.symbol[0]}
              </div>
              <div className="flex-1">
                <span className="text-[13px] font-medium">{t.symbol}</span>
                <span className="text-[11px] text-muted-foreground ml-2">{t.name}</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#3EBD8C]/10 text-[#3EBD8C] font-semibold">Live</span>
            </button>
          ))}
          {apiResults.length > 0 && (
            <>
              <div className="px-4 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground border-b border-t border-[var(--border)]">Price Only</div>
              {apiResults.map(t => (
                <button key={t.symbol} onClick={() => handleSelect(t.symbol)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-accent/5 transition-colors cursor-pointer ${
                    currentSymbol === t.symbol ? 'bg-[#4A90C4]/5' : ''
                  }`}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-[#444]">
                    {t.symbol[0]}
                  </div>
                  <div className="flex-1">
                    <span className="text-[13px] font-medium">{t.symbol}</span>
                    <span className="text-[11px] text-muted-foreground ml-2">{t.name}</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#D4A042]/10 text-[#D4A042] font-semibold">Limited</span>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
