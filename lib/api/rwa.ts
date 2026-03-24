/**
 * RWA (Real World Assets) API Client
 * Fetches tokenized asset data with rich mock fallback
 */

// ── Types ──────────────────────────────────────

export interface RWAAsset {
  id: string
  name: string
  platform: string
  network: string
  category: 'treasuries' | 'private_credit' | 'commodities' | 'equities' | 'real_estate' | 'other'
  totalValue: number
  apy: number | null
  change30d: number | null
  underlying: string
}

export const RWA_CATEGORIES = ['treasuries', 'private_credit', 'commodities', 'equities', 'real_estate', 'other'] as const

export interface RWAMarketSummary {
  totalTokenized: number
  treasuries: number
  privateCredit: number
  equities: number
  commodities: number
  realEstate: number
  change30d: number
}

// ── Mock Data ──────────────────────────────────────

export const MOCK_RWA_ASSETS: RWAAsset[] = [
  { id: 'buidl', name: 'BlackRock BUIDL', platform: 'Securitize', network: 'Ethereum', category: 'treasuries', totalValue: 1_700_000_000, apy: 4.8, change30d: 12.4, underlying: 'US Treasury Bills' },
  { id: 'usdy', name: 'Ondo USDY', platform: 'Ondo Finance', network: 'Ethereum', category: 'treasuries', totalValue: 680_000_000, apy: 5.1, change30d: 8.2, underlying: 'US Treasury Notes' },
  { id: 'paxg', name: 'Paxos Gold', platform: 'Paxos', network: 'Ethereum', category: 'commodities', totalValue: 520_000_000, apy: null, change30d: 4.1, underlying: 'Physical Gold (LBMA)' },
  { id: 'maple', name: 'Maple Direct', platform: 'Maple Finance', network: 'Ethereum', category: 'private_credit', totalValue: 340_000_000, apy: 8.2, change30d: 15.8, underlying: 'Corporate Loans' },
  { id: 'centrifuge', name: 'Centrifuge Pools', platform: 'Centrifuge', network: 'Ethereum', category: 'private_credit', totalValue: 280_000_000, apy: 7.4, change30d: 22.1, underlying: 'Invoice Financing' },
  { id: 'fobxx', name: 'Franklin OnChain US Gov', platform: 'Franklin Templeton', network: 'Stellar', category: 'treasuries', totalValue: 450_000_000, apy: 4.9, change30d: 6.8, underlying: 'US Government Money Market' },
  { id: 'goldfinch', name: 'Goldfinch', platform: 'Goldfinch', network: 'Ethereum', category: 'private_credit', totalValue: 110_000_000, apy: 9.1, change30d: -3.2, underlying: 'Emerging Market Loans' },
  { id: 'backed', name: 'Backed bCSPX', platform: 'Backed Finance', network: 'Ethereum', category: 'equities', totalValue: 65_000_000, apy: null, change30d: 2.8, underlying: 'S&P 500 Index' },
  { id: 'realio', name: 'Realio RST', platform: 'Realio Network', network: 'Ethereum', category: 'real_estate', totalValue: 45_000_000, apy: 6.2, change30d: 1.4, underlying: 'Commercial Real Estate' },
  { id: 'swarm', name: 'Swarm dTSLA', platform: 'Swarm Markets', network: 'Ethereum', category: 'equities', totalValue: 28_000_000, apy: null, change30d: 5.6, underlying: 'Tesla Inc. Stock' },
]

export const MOCK_RWA_SUMMARY: RWAMarketSummary = {
  totalTokenized: 17_200_000_000,
  treasuries: 10_400_000_000,
  privateCredit: 4_200_000_000,
  equities: 890_000_000,
  commodities: 1_100_000_000,
  realEstate: 610_000_000,
  change30d: 14.2,
}

// ── Endpoints ──────────────────────────────────────

export async function fetchRWAAssets(): Promise<RWAAsset[]> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    const res = await fetch('https://api.rwa.xyz/v4/assets/', {
      signal: controller.signal,
      next: { revalidate: 0 },
    })
    clearTimeout(timeout)

    if (!res.ok) {
      throw new Error(`RWA API error: ${res.status}`)
    }

    return res.json()
  } catch (error) {
    console.warn('[RWA] Live API unavailable, using mock data:', error instanceof Error ? error.message : 'Unknown error')
    return MOCK_RWA_ASSETS
  }
}

export function getRWASummary(): RWAMarketSummary {
  return MOCK_RWA_SUMMARY
}
