// DeFiLlama API client — uses proxy routes to avoid CORS

export interface DeFiProtocol {
  id: string; name: string; symbol: string; slug: string; logo: string
  category: string; chains: string[]; tvl: number
  change_1h: number | null; change_1d: number | null; change_7d: number | null
  mcap: number | null; fdv: number | null; url: string
}

export interface YieldPool {
  pool: string; chain: string; project: string; symbol: string
  tvlUsd: number; apy: number; apyBase: number | null; apyReward: number | null
  apyMean30d: number; stablecoin: boolean; ilRisk: string; exposure: string
  predictions: { predictedClass: string; binnedConfidence: number } | null
}

export interface ChainTvl { name: string; tvl: number; tokenSymbol: string }

export interface DEXProtocol {
  name: string; displayName: string; logo: string
  total24h: number | null; total7d: number | null; total30d: number | null
  change_1d: number | null; change_7d: number | null; chains: string[]
}

export interface FeesProtocol {
  name: string; displayName: string; logo: string
  total24h: number | null; total7d: number | null; totalAllTime: number | null
  dailyRevenue: number | null; change_1d: number | null; chains: string[]
}

export interface Stablecoin {
  name: string; symbol: string; circulating: { peggedUSD: number }; price: number
}

// ── Fetchers (via proxy) ────────────────────────────────────

export async function fetchProtocols(): Promise<DeFiProtocol[]> {
  try {
    const res = await fetch('/api/defillama/protocols')
    if (!res.ok) return []
    return res.json()
  } catch (err) { console.error('[DeFiLlama] protocols:', err); return [] }
}

export async function fetchChains(): Promise<ChainTvl[]> {
  try {
    const res = await fetch('/api/defillama/chains')
    if (!res.ok) return []
    return res.json()
  } catch (err) { console.error('[DeFiLlama] chains:', err); return [] }
}

export async function fetchYieldPools(): Promise<YieldPool[]> {
  try {
    const res = await fetch('/api/defillama/yields')
    if (!res.ok) return []
    const d = await res.json()
    return d.data || d || []
  } catch (err) { console.error('[DeFiLlama] yields:', err); return [] }
}

export async function fetchDEXOverview(): Promise<{ protocols: DEXProtocol[]; total24h: number } | null> {
  try {
    const res = await fetch('/api/defillama/dexs')
    if (!res.ok) return null
    return res.json()
  } catch (err) { console.error('[DeFiLlama] dexs:', err); return null }
}

export async function fetchFeesOverview(): Promise<{ protocols: FeesProtocol[] } | null> {
  try {
    const res = await fetch('/api/defillama/fees')
    if (!res.ok) return null
    return res.json()
  } catch (err) { console.error('[DeFiLlama] fees:', err); return null }
}

export async function fetchStablecoins(): Promise<Stablecoin[]> {
  try {
    const res = await fetch('/api/defillama/stablecoins')
    if (!res.ok) return []
    const d = await res.json()
    return d.peggedAssets || d || []
  } catch (err) { console.error('[DeFiLlama] stables:', err); return [] }
}

// ── Helpers ─────────────────────────────────────────────────

export function formatTvl(v: number | string | null | undefined): string {
  const n = Number(v) || 0
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B'
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return '$' + (n / 1e3).toFixed(0) + 'K'
  if (n > 0) return '$' + n.toFixed(0)
  return '$0'
}

export function formatChange(v: number | null | undefined): { text: string; color: string } {
  if (v === null || v === undefined || isNaN(Number(v))) return { text: '—', color: 'var(--text-quaternary)' }
  const n = Number(v)
  return { text: (n >= 0 ? '+' : '') + n.toFixed(2) + '%', color: n >= 0 ? 'var(--data-positive)' : 'var(--data-negative)' }
}

export function normalizeCategory(c: string): string {
  const m: Record<string, string> = { 'Dexes': 'DEX', 'DEX': 'DEX', 'Lending': 'Lending', 'CDP': 'Lending', 'Liquid Staking': 'Staking', 'Restaking': 'Staking', 'Liquid Restaking': 'Staking', 'Bridge': 'Bridge', 'Yield Aggregator': 'Yield', 'Yield': 'Yield', 'Farm': 'Yield', 'Derivatives': 'Derivatives', 'Options': 'Derivatives', 'Perpetuals': 'Derivatives', 'RWA': 'RWA', 'Prediction Market': 'Prediction' }
  return m[c] || 'Other'
}
