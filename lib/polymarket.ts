// Polymarket Gamma API client — no auth required

const isBrowser = typeof window !== 'undefined'
const BASE = isBrowser ? '/api/polymarket' : 'https://gamma-api.polymarket.com'

export interface PolymarketMarket {
  id: string
  question: string
  description: string
  conditionId: string
  slug: string
  image: string
  icon: string
  active: boolean
  closed: boolean
  archived: boolean
  outcomes: string
  outcomePrices: string
  clobTokenIds: string
  volume: number
  volume24hr: number
  liquidity: number
  endDate: string
  tags: { label: string; slug: string }[]
  createdAt: string
  updatedAt: string
  _parsedOutcomes?: string[]
  _parsedPrices?: number[]
  _parsedTokenIds?: string[]
}

export interface PriceHistoryPoint {
  t: number
  p: number
}

// ── API ──────────────────────────────────────────────────────

export async function fetchMarkets(params?: {
  limit?: number; offset?: number; order?: string; ascending?: boolean
  active?: boolean; closed?: boolean; tag?: string
}): Promise<PolymarketMarket[]> {
  const { limit = 30, offset = 0, order = 'volume24hr', ascending = false, active = true, closed = false, tag } = params || {}
  try {
    const sp = new URLSearchParams({ limit: String(limit), offset: String(offset), order, ascending: String(ascending), active: String(active), closed: String(closed), accepting_orders: 'true' })
    if (tag) sp.set('tag', tag)
    const url = isBrowser ? `${BASE}/markets?${sp}` : `${BASE}/markets?${sp}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Gamma ${res.status}`)
    const markets: PolymarketMarket[] = await res.json()
    return markets.map(parseMarket)
  } catch (err) {
    console.error('[Polymarket] fetchMarkets:', err)
    return []
  }
}

export async function searchMarkets(query: string, limit = 20): Promise<PolymarketMarket[]> {
  if (!query.trim()) return []
  const q = query.toLowerCase()

  // Fetch a large set and filter — Gamma API doesn't have text search
  const all = await fetchMarkets({ limit: 200 })
  return all.filter(m =>
    m.question.toLowerCase().includes(q) ||
    (m.description || '').toLowerCase().includes(q) ||
    (m.tags || []).some(t => t.label.toLowerCase().includes(q))
  ).slice(0, limit)
}

export async function fetchPriceHistory(tokenId: string, interval = '1m', fidelity = 100): Promise<PriceHistoryPoint[]> {
  if (!tokenId) return []
  try {
    // Price history is on clob.polymarket.com, NOT gamma-api
    const sp = new URLSearchParams({ market: tokenId, interval, fidelity: String(fidelity) })
    const url = isBrowser
      ? `/api/polymarket/prices-history?${sp}`
      : `https://clob.polymarket.com/prices-history?${sp}`
    const res = await fetch(url)
    if (!res.ok) return []
    const data = await res.json()
    if (data.history && Array.isArray(data.history)) return data.history
    if (Array.isArray(data)) return data
    return []
  } catch { return [] }
}

export async function fetchMarketById(conditionId: string): Promise<PolymarketMarket | null> {
  try {
    const url = isBrowser ? `${BASE}/markets/${conditionId}` : `https://gamma-api.polymarket.com/markets/${conditionId}`
    const res = await fetch(url)
    if (!res.ok) return null
    return parseMarket(await res.json())
  } catch { return null }
}

// ── Helpers ──────────────────────────────────────────────────

function parseMarket(m: PolymarketMarket): PolymarketMarket {
  try { m._parsedOutcomes = typeof m.outcomes === 'string' ? JSON.parse(m.outcomes) : m.outcomes || ['Yes', 'No'] } catch { m._parsedOutcomes = ['Yes', 'No'] }
  try { m._parsedPrices = typeof m.outcomePrices === 'string' ? JSON.parse(m.outcomePrices).map(Number) : [] } catch { m._parsedPrices = [] }
  try { m._parsedTokenIds = typeof m.clobTokenIds === 'string' ? JSON.parse(m.clobTokenIds) : [] } catch { m._parsedTokenIds = [] }
  return m
}

export function formatVolume(vol: number | string | undefined | null): string {
  const n = Number(vol) || 0
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`
  if (n > 0) return `$${n.toFixed(0)}`
  return '$0'
}

export function getPolymarketUrl(m: PolymarketMarket): string {
  return `https://polymarket.com/event/${m.slug || m.conditionId}`
}

export function categorizeMarket(m: PolymarketMarket): string {
  const q = m.question.toLowerCase()
  const tags = (m.tags || []).map(t => t.label.toLowerCase())
  if (tags.some(t => ['crypto', 'bitcoin', 'ethereum'].includes(t)) || /btc|bitcoin|ethereum|crypto|sol\b|eth\b/.test(q)) return 'crypto'
  if (tags.some(t => ['fed', 'rates', 'inflation', 'economy'].includes(t)) || /\bfed\b|rate|inflation|gdp|cpi/.test(q)) return 'macro'
  if (/stock|aapl|nvda|tsla|s&p|nasdaq|earnings/.test(q)) return 'stocks'
  if (/sec\b|etf|regulat|approve/.test(q)) return 'regulatory'
  if (/trump|elect|war|tariff|geopolit/.test(q) || tags.some(t => ['politics', 'election'].includes(t))) return 'geopolitical'
  if (tags.some(t => ['sports', 'nfl', 'nba'].includes(t)) || /nfl|nba|super bowl|world cup/.test(q)) return 'sports'
  return 'other'
}
