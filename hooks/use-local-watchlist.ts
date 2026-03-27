'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'ta-watchlist-local'

/**
 * localStorage-based watchlist for dev/preview mode (no auth required).
 */
export function useLocalWatchlist() {
  const [symbols, setSymbols] = useState<string[]>([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setSymbols(JSON.parse(saved))
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(symbols))
  }, [symbols])

  const addToWatchlist = useCallback((symbol: string) => {
    setSymbols(prev => {
      if (prev.includes(symbol.toUpperCase())) return prev
      return [...prev, symbol.toUpperCase()]
    })
  }, [])

  const removeFromWatchlist = useCallback((symbol: string) => {
    setSymbols(prev => prev.filter(s => s !== symbol.toUpperCase()))
  }, [])

  const isInWatchlist = useCallback((symbol: string) => {
    return symbols.includes(symbol.toUpperCase())
  }, [symbols])

  return { symbols, addToWatchlist, removeFromWatchlist, isInWatchlist, count: symbols.length }
}
