'use client'

import useSWR from 'swr'
import { fetchMarkets, searchMarkets, fetchPriceHistory, fetchMarketById, type PolymarketMarket, type PriceHistoryPoint } from '@/lib/polymarket'

export function usePolymarkets(params?: { tag?: string; limit?: number }) {
  const { tag, limit = 100 } = params || {}
  const { data, error, isLoading, mutate } = useSWR<PolymarketMarket[]>(
    ['polymarket-markets', tag, limit],
    () => fetchMarkets({ limit, tag: tag || undefined }),
    { refreshInterval: 60_000, revalidateOnFocus: true, keepPreviousData: true }
  )
  return { markets: data || [], error, isLoading, refresh: mutate }
}

export function usePolymarketSearch(query: string) {
  const { data, error, isLoading } = useSWR(
    query.length >= 2 ? ['polymarket-search', query] : null,
    () => searchMarkets(query),
    { refreshInterval: 0, revalidateOnFocus: false, dedupingInterval: 2000 }
  )
  return { results: data || [], error, isLoading }
}

export function usePriceHistory(tokenId: string | null, interval = '1m') {
  const { data, error, isLoading } = useSWR<PriceHistoryPoint[]>(
    tokenId ? ['polymarket-history', tokenId, interval] : null,
    () => fetchPriceHistory(tokenId!, interval),
    { refreshInterval: 300_000, revalidateOnFocus: false }
  )
  return { history: data || [], error, isLoading }
}

export function usePolymarketDetail(conditionId: string | null) {
  const { data, error, isLoading } = useSWR(
    conditionId ? ['polymarket-detail', conditionId] : null,
    () => fetchMarketById(conditionId!),
    { refreshInterval: 30_000, revalidateOnFocus: true }
  )
  return { market: data, error, isLoading }
}
