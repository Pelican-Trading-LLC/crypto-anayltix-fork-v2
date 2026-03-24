/**
 * Polymarket Gamma API Client
 * Public API — no authentication required
 * Docs: https://gamma-api.polymarket.com
 */

const BASE_URL = 'https://gamma-api.polymarket.com'

// ── Types ──────────────────────────────────────

export interface PolymarketEvent {
  id: string
  slug: string
  title: string
  description: string
  startDate: string
  endDate: string
  active: boolean
  closed: boolean
  liquidity: number
  volume: number
  markets: PolymarketMarket[]
}

export interface PolymarketMarket {
  id: string
  question: string
  conditionId: string
  slug: string
  outcomes: string | string[]
  outcomePrices: string | string[]
  volume: number
  liquidity: number
  active: boolean
  closed: boolean
  groupItemTitle?: string
}

export interface ParsedMarket {
  id: string
  question: string
  yesPrice: number
  noPrice: number
  volume: number
  liquidity: number
  slug: string
  outcomes: string[]
}

// ── Helpers ──────────────────────────────────────

function parseJsonOrArray<T>(raw: string | T[] | undefined, fallback: T[]): T[] {
  if (!raw) return fallback
  if (Array.isArray(raw)) return raw
  try { return JSON.parse(raw) } catch { return fallback }
}

export function parseMarket(m: PolymarketMarket): ParsedMarket {
  const prices = parseJsonOrArray(m.outcomePrices, []).map(Number)
  const outcomes = parseJsonOrArray(m.outcomes, ['Yes', 'No'])

  return {
    id: m.id || '',
    question: m.question || '',
    yesPrice: prices[0] ?? 0,
    noPrice: prices[1] ?? 0,
    volume: m.volume || 0,
    liquidity: m.liquidity || 0,
    slug: m.slug || '',
    outcomes,
  }
}

/** Safely parse an array of PolymarketEvents into ParsedMarkets. Handles malformed data gracefully. */
export function safeParseEvents(data: unknown): ParsedMarket[] {
  if (!Array.isArray(data)) return []
  return data.flatMap((e: Partial<PolymarketEvent>) => {
    const mkts = Array.isArray(e?.markets) ? e.markets : []
    return mkts.map((m) => parseMarket(m))
  })
}

// ── Endpoints ──────────────────────────────────────

export async function fetchEvents(params: {
  tag?: string
  limit?: number
  active?: boolean
}): Promise<PolymarketEvent[]> {
  const { tag, limit = 10, active = true } = params
  const searchParams = new URLSearchParams({
    limit: String(limit),
    active: String(active),
    closed: 'false',
  })
  if (tag) searchParams.set('tag', tag)

  const res = await fetch(`${BASE_URL}/events?${searchParams}`, {
    next: { revalidate: 0 },
  })

  if (!res.ok) {
    throw new Error(`Polymarket API error: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export async function fetchMarkets(params: {
  tag?: string
  limit?: number
}): Promise<PolymarketMarket[]> {
  const { tag, limit = 10 } = params
  const searchParams = new URLSearchParams({
    limit: String(limit),
    active: 'true',
    closed: 'false',
  })
  if (tag) searchParams.set('tag', tag)

  const res = await fetch(`${BASE_URL}/markets?${searchParams}`, {
    next: { revalidate: 0 },
  })

  if (!res.ok) {
    throw new Error(`Polymarket API error: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export async function searchEvents(query: string): Promise<PolymarketEvent[]> {
  const searchParams = new URLSearchParams({
    title: query,
    active: 'true',
    closed: 'false',
    limit: '20',
  })

  const res = await fetch(`${BASE_URL}/events?${searchParams}`, {
    next: { revalidate: 0 },
  })

  if (!res.ok) {
    throw new Error(`Polymarket API error: ${res.status} ${res.statusText}`)
  }

  return res.json()
}
