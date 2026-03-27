const LLAMA = 'https://api.llama.fi'
const YIELDS = 'https://yields.llama.fi'
const STABLES = 'https://stablecoins.llama.fi'

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

// ── Fetchers ────────────────────────────────────────────────

export async function fetchProtocols(): Promise<DeFiProtocol[]> {
  try { const r = await fetch(`${LLAMA}/protocols`); if (!r.ok) throw r; return r.json() } catch { return [] }
}

export async function fetchChains(): Promise<ChainTvl[]> {
  try { const r = await fetch(`${LLAMA}/v2/chains`); if (!r.ok) throw r; return r.json() } catch { return [] }
}

export async function fetchYieldPools(): Promise<YieldPool[]> {
  try { const r = await fetch(`${YIELDS}/pools`); if (!r.ok) throw r; const d = await r.json(); return d.data || [] } catch { return [] }
}

export async function fetchDEXOverview(): Promise<{ protocols: DEXProtocol[]; total24h: number } | null> {
  try { const r = await fetch(`${LLAMA}/overview/dexs`); if (!r.ok) throw r; return r.json() } catch { return null }
}

export async function fetchFeesOverview(): Promise<{ protocols: FeesProtocol[] } | null> {
  try { const r = await fetch(`${LLAMA}/overview/fees`); if (!r.ok) throw r; return r.json() } catch { return null }
}

export async function fetchStablecoins(): Promise<Stablecoin[]> {
  try { const r = await fetch(`${STABLES}/stablecoins?includePrices=true`); if (!r.ok) throw r; const d = await r.json(); return d.peggedAssets || [] } catch { return [] }
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
  if (v === null || v === undefined || isNaN(v)) return { text: '—', color: 'var(--text-quaternary)' }
  return { text: (v >= 0 ? '+' : '') + v.toFixed(2) + '%', color: v >= 0 ? 'var(--data-positive)' : 'var(--data-negative)' }
}

export function normalizeCategory(c: string): string {
  const m: Record<string, string> = { 'Dexes': 'DEX', 'DEX': 'DEX', 'Lending': 'Lending', 'CDP': 'Lending', 'Liquid Staking': 'Staking', 'Restaking': 'Staking', 'Liquid Restaking': 'Staking', 'Bridge': 'Bridge', 'Yield Aggregator': 'Yield', 'Yield': 'Yield', 'Farm': 'Yield', 'Derivatives': 'Derivatives', 'Options': 'Derivatives', 'Perpetuals': 'Derivatives', 'RWA': 'RWA', 'Prediction Market': 'Prediction' }
  return m[c] || 'Other'
}
