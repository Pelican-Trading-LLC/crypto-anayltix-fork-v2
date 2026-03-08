/**
 * CoinGecko API Client
 * Free tier: 30 calls/min, no API key required for basic endpoints
 * Pro tier: uses api.coingecko.com with x-cg-pro-api-key header
 * Demo tier: uses api.coingecko.com with x-cg-demo-api-key header
 */

const BASE_URL = 'https://api.coingecko.com/api/v3'
const API_KEY = process.env.COINGECKO_API_KEY || ''

// Rate limiter: simple delay between requests (server-side only)
let lastRequestTime = 0
const MIN_INTERVAL_MS = 2100 // ~28 req/min, safely under 30/min limit

async function rateLimitedFetch(url: string): Promise<Response> {
  const now = Date.now()
  const elapsed = now - lastRequestTime
  if (elapsed < MIN_INTERVAL_MS) {
    await new Promise(r => setTimeout(r, MIN_INTERVAL_MS - elapsed))
  }
  lastRequestTime = Date.now()

  const headers: Record<string, string> = { 'Accept': 'application/json' }
  if (API_KEY) {
    headers['x-cg-demo-api-key'] = API_KEY
  }

  const res = await fetch(url, { headers, next: { revalidate: 0 } })

  if (res.status === 429) {
    console.warn('[CoinGecko] Rate limited. Waiting 60s...')
    await new Promise(r => setTimeout(r, 60000))
    return fetch(url, { headers })
  }

  if (!res.ok) {
    throw new Error(`CoinGecko API error: ${res.status} ${res.statusText} for ${url}`)
  }

  return res
}

// ── Types ──────────────────────────────────────

export interface CoinGeckoPrice {
  id: string
  symbol: string
  name: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  fully_diluted_valuation: number | null
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  price_change_percentage_7d_in_currency?: number
  price_change_percentage_30d_in_currency?: number
  market_cap_change_24h: number
  circulating_supply: number
  total_supply: number | null
  max_supply: number | null
  ath: number
  ath_date: string
  sparkline_in_7d?: { price: number[] }
  image: string
}

export interface CoinGeckoGlobal {
  data: {
    active_cryptocurrencies: number
    total_market_cap: { usd: number }
    total_volume: { usd: number }
    market_cap_percentage: { btc: number; eth: number }
    market_cap_change_percentage_24h_usd: number
  }
}

// ── Endpoints ──────────────────────────────────────────────

/**
 * Get market data for a list of coin IDs.
 * Supports sparkline, 7d/30d price changes.
 * Max 250 IDs per call on free tier.
 */
export async function getMarketData(
  coinIds: string[],
  options: { sparkline?: boolean; priceChangePercentage?: string } = {}
): Promise<CoinGeckoPrice[]> {
  const { sparkline = false, priceChangePercentage = '24h,7d,30d' } = options
  const ids = coinIds.join(',')
  const url = `${BASE_URL}/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=${sparkline}&price_change_percentage=${priceChangePercentage}&per_page=250`
  const res = await rateLimitedFetch(url)
  return res.json()
}

/**
 * Get global market overview (total market cap, BTC dominance, etc.)
 */
export async function getGlobalData(): Promise<CoinGeckoGlobal> {
  const url = `${BASE_URL}/global`
  const res = await rateLimitedFetch(url)
  return res.json()
}

/**
 * Simple price lookup for multiple coins.
 * Lightest endpoint — use for dashboard/market strip.
 */
export async function getSimplePrice(
  coinIds: string[],
  options: { include_24h_change?: boolean; include_market_cap?: boolean; include_24h_vol?: boolean } = {}
): Promise<Record<string, { usd: number; usd_24h_change?: number; usd_market_cap?: number; usd_24h_vol?: number }>> {
  const ids = coinIds.join(',')
  const params = new URLSearchParams({
    ids,
    vs_currencies: 'usd',
    include_24hr_change: String(options.include_24h_change ?? true),
    include_market_cap: String(options.include_market_cap ?? false),
    include_24hr_vol: String(options.include_24h_vol ?? false),
  })
  const url = `${BASE_URL}/simple/price?${params}`
  const res = await rateLimitedFetch(url)
  return res.json()
}

/**
 * Search for coins by query string.
 * Returns id, name, symbol, market_cap_rank, thumb image.
 */
export async function searchCoins(query: string): Promise<{ coins: { id: string; name: string; symbol: string; market_cap_rank: number; thumb: string }[] }> {
  const url = `${BASE_URL}/search?query=${encodeURIComponent(query)}`
  const res = await rateLimitedFetch(url)
  return res.json()
}

// ── ID Mapping ───────────────────────────────────────────────

/**
 * CoinGecko uses slugified IDs (e.g., "bitcoin" not "BTC").
 * This maps common ticker symbols to CoinGecko IDs.
 * Extend as needed.
 */
export const SYMBOL_TO_COINGECKO_ID: Record<string, string> = {
  BTC: 'bitcoin', ETH: 'ethereum', SOL: 'solana', AVAX: 'avalanche-2',
  LINK: 'chainlink', DOT: 'polkadot', MATIC: 'matic-network', ADA: 'cardano',
  DOGE: 'dogecoin', XRP: 'ripple', BNB: 'binancecoin', ATOM: 'cosmos',
  UNI: 'uniswap', AAVE: 'aave', ARB: 'arbitrum', OP: 'optimism',
  LDO: 'lido-dao', EIGEN: 'eigenlayer', PENDLE: 'pendle', MKR: 'maker',
  GMX: 'gmx', COMP: 'compound-governance-token', CRV: 'curve-dao-token',
  ONDO: 'ondo-finance', TAO: 'bittensor', RNDR: 'render-token', AKT: 'akash-network',
  FIL: 'filecoin', HNT: 'helium', GALA: 'gala', IMX: 'immutable-x',
  RON: 'ronin', WIF: 'dogwifcoin',
  NEAR: 'near', APT: 'aptos', SUI: 'sui', SEI: 'sei-network',
  TIA: 'celestia', JUP: 'jupiter-exchange-solana', ETHFI: 'ether-fi',
  REZ: 'renzo', AERO: 'aerodrome-finance', STX: 'blockstack',
  INJ: 'injective-protocol', PYTH: 'pyth-network', W: 'wormhole',
}

export function symbolToId(symbol: string): string | null {
  return SYMBOL_TO_COINGECKO_ID[symbol.toUpperCase()] || null
}

export function idsFromSymbols(symbols: string[]): string[] {
  return symbols.map(s => SYMBOL_TO_COINGECKO_ID[s.toUpperCase()]).filter(Boolean) as string[]
}
