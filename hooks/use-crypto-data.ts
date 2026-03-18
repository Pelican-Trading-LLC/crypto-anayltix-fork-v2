import useSWR from 'swr'

// Generic fetcher
const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Fetch failed' }))
    throw new Error(error.error || `API error: ${res.status}`)
  }
  const json = await res.json()
  return json.data
}

// ── Types (what the API routes return) ──────────────────────

export interface LivePrice {
  symbol: string
  price: number
  price_change_24h: number
  market_cap: number
  volume_24h: number
}

export interface LiveMarketData extends LivePrice {
  name: string
  price_change_7d: number
  price_change_30d: number
  fdv: number
  volume_24h: number
  vol_mcap_ratio: number
  ath: number
  ath_date: string
  sparkline_7d: number[]
  circulating_supply: number
  total_supply: number | null
  image: string
  market_cap_rank: number
}

export interface LiveTokenData {
  symbol: string
  name: string
  price: number
  price_change_24h: number
  price_change_7d: number
  price_change_30d: number
  market_cap: number
  fdv: number
  volume_24h: number
  vol_mcap_ratio: number
  ath: number
  ath_date: string
  sparkline_7d: number[]
  tvl: number | null
  tvl_change_30d: number | null
  sources: { price: string; tvl: string | null }
}

export interface LiveGlobalData {
  total_market_cap: number
  total_volume_24h: number
  btc_dominance: number
  eth_dominance: number
  market_cap_change_24h: number
  active_cryptocurrencies: number
}

export interface LiveSectorData {
  name: string
  volume: number
  market_cap: number
  top_tokens: { symbol: string; change_7d: number; price: number }[]
}

// ── Hooks ────────────────────────────────────────────────────

/**
 * Fetch simple prices for a set of symbols.
 * Refreshes every 60 seconds.
 */
export function useLivePrices(symbols: string[]) {
  const key = symbols.length > 0 ? `/api/crypto/prices?symbols=${symbols.join(',')}` : null
  return useSWR<LivePrice[]>(key, fetcher, {
    refreshInterval: 60_000,
    revalidateOnFocus: false,
    dedupingInterval: 30_000,
  })
}

/**
 * Fetch detailed market data (with sparklines) for a set of symbols.
 * Refreshes every 5 minutes.
 */
export function useLiveMarketData(symbols: string[]) {
  const key = symbols.length > 0 ? `/api/crypto/prices?symbols=${symbols.join(',')}&detail=true` : null
  return useSWR<LiveMarketData[]>(key, fetcher, {
    refreshInterval: 300_000,
    revalidateOnFocus: false,
    dedupingInterval: 60_000,
  })
}

/**
 * Fetch deep-dive data for a single token (CoinGecko + DeFiLlama).
 * Refreshes every 5 minutes.
 */
export function useLiveTokenData(symbol: string | null) {
  const key = symbol ? `/api/crypto/token/${symbol}` : null
  return useSWR<LiveTokenData>(key, fetcher, {
    refreshInterval: 300_000,
    revalidateOnFocus: false,
  })
}

/**
 * Fetch global market data.
 * Refreshes every 2 minutes.
 */
export function useLiveGlobalData() {
  return useSWR<LiveGlobalData>('/api/crypto/global', fetcher, {
    refreshInterval: 120_000,
    revalidateOnFocus: false,
  })
}

/**
 * Fetch sector-level aggregated data.
 * Refreshes every 10 minutes.
 */
export function useLiveSectors() {
  return useSWR<LiveSectorData[]>('/api/crypto/sectors', fetcher, {
    refreshInterval: 600_000,
    revalidateOnFocus: false,
  })
}
