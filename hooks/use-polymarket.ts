'use client'

import useSWR from 'swr'
import type { PolymarketEvent, ParsedMarket } from '@/lib/api/polymarket'
import { parseMarket } from '@/lib/api/polymarket'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function usePolymarketEvents(tag?: string, limit = 10) {
  const params = new URLSearchParams()
  if (tag) params.set('tag', tag)
  params.set('limit', String(limit))

  return useSWR<PolymarketEvent[]>(
    `/api/polymarket/events?${params}`,
    fetcher,
    { refreshInterval: 300_000, dedupingInterval: 60_000 }
  )
}

export function usePolymarketSearch(query: string) {
  return useSWR<PolymarketEvent[]>(
    query ? `/api/polymarket/search?q=${encodeURIComponent(query)}` : null,
    fetcher,
    { refreshInterval: 300_000, dedupingInterval: 60_000 }
  )
}

export function useCryptoMarkets(limit = 5) {
  const { data, ...rest } = usePolymarketEvents('crypto', limit)
  const markets: ParsedMarket[] = data?.flatMap(e => e.markets.map(parseMarket)).slice(0, limit) ?? []
  return { data: markets, ...rest }
}

export function useFedRateMarkets(limit = 5) {
  const { data, ...rest } = usePolymarketEvents('fed-funds-rate', limit)
  const markets: ParsedMarket[] = data?.flatMap(e => e.markets.map(parseMarket)).slice(0, limit) ?? []
  return { data: markets, ...rest }
}
