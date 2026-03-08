/**
 * DeFiLlama API Client
 * Free, no authentication, no rate limits documented.
 * https://defillama.com/docs/api
 */

const BASE_URL = 'https://api.llama.fi'

async function llamaFetch(path: string): Promise<Response> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Accept': 'application/json' },
    next: { revalidate: 0 },
  })
  if (!res.ok) {
    throw new Error(`DeFiLlama API error: ${res.status} for ${path}`)
  }
  return res
}

// ── Types ────────────────────────────────────────────────────

export interface LlamaProtocol {
  id: string
  name: string
  slug: string
  symbol: string | null
  tvl: number
  chainTvls: Record<string, number>
  change_1h: number | null
  change_1d: number | null
  change_7d: number | null
  mcap: number | null
  category: string
  chains: string[]
  url: string
  logo: string
}

export interface LlamaProtocolDetail {
  id: string
  name: string
  symbol: string | null
  tvl: { date: number; totalLiquidityUSD: number }[]
  currentChainTvls: Record<string, number>
  chainTvls: Record<string, { tvl: { date: number; totalLiquidityUSD: number }[] }>
  mcap: number | null
  category: string
}

export interface LlamaChainTvl {
  name: string
  tvl: number
  tokenSymbol: string | null
  cmcId: string | null
}

// ── Endpoints ────────────────────────────────────────────────

/**
 * Get all protocols (summary list).
 * Returns ~4000+ protocols. Filter client-side.
 */
export async function getAllProtocols(): Promise<LlamaProtocol[]> {
  const res = await llamaFetch('/protocols')
  return res.json()
}

/**
 * Get detailed TVL data for a specific protocol (includes historical).
 * slug = protocol slug from the protocols list (e.g., "aave", "uniswap")
 */
export async function getProtocolTvl(slug: string): Promise<LlamaProtocolDetail> {
  const res = await llamaFetch(`/protocol/${slug}`)
  return res.json()
}

/**
 * Get current TVL for all chains.
 */
export async function getChainsTvl(): Promise<LlamaChainTvl[]> {
  const res = await llamaFetch('/v2/chains')
  return res.json()
}

/**
 * Get TVL for a specific chain over time.
 */
export async function getChainTvlHistory(chain: string): Promise<{ date: number; tvl: number }[]> {
  const res = await llamaFetch(`/v2/historicalChainTvl/${chain}`)
  return res.json()
}

// ── Helpers ────────────────────────────────────────────────

/** Slug map for common protocols */
export const PROTOCOL_SLUGS: Record<string, string> = {
  AAVE: 'aave', UNI: 'uniswap', LIDO: 'lido', EIGEN: 'eigenlayer',
  PENDLE: 'pendle', GMX: 'gmx', COMP: 'compound-finance', CRV: 'curve-dex',
  MKR: 'makerdao', ETHENA: 'ethena', MORPHO: 'morpho',
  ARB: 'arbitrum', OP: 'optimism', BLUR: 'blur',
  JUPITER: 'jupiter', HYPERLIQUID: 'hyperliquid', AERODROME: 'aerodrome',
}

export function getProtocolSlug(symbol: string): string | null {
  return PROTOCOL_SLUGS[symbol.toUpperCase()] || null
}
