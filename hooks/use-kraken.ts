'use client'

import useSWR from 'swr'
import { fetchTickers, fetchOHLC, fetchAssetPairs, type KrakenTicker } from '@/lib/kraken'

const CORE_SYMBOLS = [
  'BTC', 'ETH', 'SOL', 'XRP', 'ADA', 'AVAX', 'DOT', 'LINK',
  'UNI', 'AAVE', 'ATOM', 'NEAR', 'ARB', 'OP', 'APT', 'SUI',
  'SEI', 'TIA', 'INJ', 'FET', 'RENDER', 'ONDO', 'JUP', 'BONK',
  'WIF', 'PEPE', 'SHIB', 'DOGE', 'LTC', 'MKR', 'CRV', 'LDO',
  'PENDLE', 'GRT', 'FIL', 'PYTH',
]

export function useKrakenTickers(additionalSymbols: string[] = []) {
  const allSymbols = [...new Set([...CORE_SYMBOLS, ...additionalSymbols])]

  const { data, error, isLoading, mutate } = useSWR<KrakenTicker[]>(
    ['kraken-tickers', allSymbols.join(',')],
    () => fetchTickers(allSymbols),
    { refreshInterval: 15_000, revalidateOnFocus: true, dedupingInterval: 5_000, keepPreviousData: true }
  )

  return {
    tickers: data || [],
    tickerMap: new Map((data || []).map(t => [t.symbol, t])),
    error,
    isLoading,
    refresh: mutate,
  }
}

export function useKrakenOHLC(symbol: string | null, interval: number = 60) {
  const { data, error, isLoading } = useSWR(
    symbol ? ['kraken-ohlc', symbol, interval] : null,
    () => fetchOHLC(symbol!, interval),
    { refreshInterval: 60_000, revalidateOnFocus: false }
  )
  return { candles: data || [], error, isLoading }
}

export function useKrakenPairs() {
  const { data, error, isLoading } = useSWR(
    'kraken-pairs',
    fetchAssetPairs,
    { refreshInterval: 0, revalidateOnFocus: false, dedupingInterval: 3600_000 }
  )
  return { pairs: data || [], error, isLoading }
}
