'use client'

import useSWR from 'swr'
import type { PolymarketEvent } from '@/lib/api/polymarket'
import { safeParseEvents } from '@/lib/api/polymarket'

const fetcher = (url: string) =>
  fetch(url)
    .then(r => (r.ok ? r.json() : []))
    .catch(() => [])

export function usePolymarketEvents(tag?: string, limit = 10) {
  const params = new URLSearchParams()
  if (tag) params.set('tag', tag)
  params.set('limit', String(limit))

  return useSWR<PolymarketEvent[]>(
    `/api/polymarket/events?${params}`,
    fetcher,
    { refreshInterval: 300_000, dedupingInterval: 60_000, fallbackData: [] }
  )
}

export function usePolymarketSearch(query: string) {
  return useSWR<PolymarketEvent[]>(
    query ? `/api/polymarket/search?q=${encodeURIComponent(query)}` : null,
    fetcher,
    { refreshInterval: 300_000, dedupingInterval: 60_000, fallbackData: [] }
  )
}

export function useCryptoMarkets(limit = 5) {
  const { data, ...rest } = usePolymarketEvents('crypto', limit)
  const markets = safeParseEvents(data).slice(0, limit)
  return { data: markets, ...rest }
}

export function useFedRateMarkets(limit = 5) {
  const { data, ...rest } = usePolymarketEvents('fed-funds-rate', limit)
  const markets = safeParseEvents(data).slice(0, limit)
  return { data: markets, ...rest }
}
