'use client'

import useSWR from 'swr'
import type { RWAAsset, RWAMarketSummary } from '@/lib/api/rwa'

const fetcher = (url: string) =>
  fetch(url)
    .then(r => (r.ok ? r.json() : { assets: [], summary: null }))
    .catch(() => ({ assets: [], summary: null }))

export function useRWAData() {
  return useSWR<{ assets: RWAAsset[]; summary: RWAMarketSummary }>(
    '/api/rwa',
    fetcher,
    { refreshInterval: 3_600_000, dedupingInterval: 60_000 }
  )
}

export function useRWAByCategory(category: string) {
  const { data, ...rest } = useRWAData()
  const filtered = category === 'all'
    ? data?.assets
    : data?.assets?.filter(a => a.category === category)
  return { data: filtered, summary: data?.summary, ...rest }
}
