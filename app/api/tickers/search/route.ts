import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createUserRateLimiter, rateLimitResponse } from "@/lib/rate-limit"

export const dynamic = "force-dynamic"

const tickerSearchLimiter = createUserRateLimiter('ticker-search', 60, '1 m')

const POLYGON_API_KEY = process.env.POLYGON_API_KEY

// Static fallback for common tickers when Polygon API is unavailable
const COMMON_TICKERS: TickerSearchResult[] = [
  // Crypto (primary)
  { ticker: 'BTC', name: 'Bitcoin', type: 'CRYPTO', market: 'crypto', active: true },
  { ticker: 'ETH', name: 'Ethereum', type: 'CRYPTO', market: 'crypto', active: true },
  { ticker: 'SOL', name: 'Solana', type: 'CRYPTO', market: 'crypto', active: true },
  { ticker: 'XRP', name: 'Ripple', type: 'CRYPTO', market: 'crypto', active: true },
  { ticker: 'DOGE', name: 'Dogecoin', type: 'CRYPTO', market: 'crypto', active: true },
  { ticker: 'ADA', name: 'Cardano', type: 'CRYPTO', market: 'crypto', active: true },
  { ticker: 'AVAX', name: 'Avalanche', type: 'CRYPTO', market: 'crypto', active: true },
  { ticker: 'LINK', name: 'Chainlink', type: 'CRYPTO', market: 'crypto', active: true },
  { ticker: 'DOT', name: 'Polkadot', type: 'CRYPTO', market: 'crypto', active: true },
  { ticker: 'MATIC', name: 'Polygon', type: 'CRYPTO', market: 'crypto', active: true },
  { ticker: 'ARB', name: 'Arbitrum', type: 'CRYPTO', market: 'crypto', active: true },
  { ticker: 'OP', name: 'Optimism', type: 'CRYPTO', market: 'crypto', active: true },
  { ticker: 'SUI', name: 'Sui', type: 'CRYPTO', market: 'crypto', active: true },
  { ticker: 'APT', name: 'Aptos', type: 'CRYPTO', market: 'crypto', active: true },
  { ticker: 'PEPE', name: 'Pepe', type: 'CRYPTO', market: 'crypto', active: true },
  { ticker: 'UNI', name: 'Uniswap', type: 'CRYPTO', market: 'crypto', active: true },
  { ticker: 'AAVE', name: 'Aave', type: 'CRYPTO', market: 'crypto', active: true },
  { ticker: 'FET', name: 'Fetch.ai', type: 'CRYPTO', market: 'crypto', active: true },
  { ticker: 'NEAR', name: 'NEAR Protocol', type: 'CRYPTO', market: 'crypto', active: true },
  { ticker: 'ATOM', name: 'Cosmos', type: 'CRYPTO', market: 'crypto', active: true },
  { ticker: 'INJ', name: 'Injective', type: 'CRYPTO', market: 'crypto', active: true },
  { ticker: 'RENDER', name: 'Render', type: 'CRYPTO', market: 'crypto', active: true },
  { ticker: 'TIA', name: 'Celestia', type: 'CRYPTO', market: 'crypto', active: true },
  { ticker: 'SEI', name: 'Sei', type: 'CRYPTO', market: 'crypto', active: true },
  { ticker: 'BONK', name: 'Bonk', type: 'CRYPTO', market: 'crypto', active: true },
  // Stablecoins
  { ticker: 'USDT', name: 'Tether', type: 'CRYPTO', market: 'crypto', active: true },
  { ticker: 'USDC', name: 'USD Coin', type: 'CRYPTO', market: 'crypto', active: true },
]

export interface TickerSearchResult {
  ticker: string
  name: string
  type: string
  market: string
  active: boolean
}

export interface TickerSearchResponse {
  results: TickerSearchResult[]
  count: number
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { success } = await tickerSearchLimiter.limit(user.id)
    if (!success) return rateLimitResponse()

    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50)

    if (!query || query.length < 1) {
      return NextResponse.json({
        results: [],
        count: 0,
      })
    }

    // No Polygon API key - use static fallback
    if (!POLYGON_API_KEY) {
      const upperQuery = query.toUpperCase()
      const filtered = COMMON_TICKERS.filter(
        t => t.ticker.includes(upperQuery) || t.name.toUpperCase().includes(upperQuery)
      )

      // Sort: exact match first
      filtered.sort((a, b) => {
        const aExact = a.ticker === upperQuery ? 0 : a.ticker.startsWith(upperQuery) ? 1 : 2
        const bExact = b.ticker === upperQuery ? 0 : b.ticker.startsWith(upperQuery) ? 1 : 2
        return aExact - bExact
      })

      const sliced = filtered.slice(0, limit)

      // Allow any 1-5 character uppercase string as a valid ticker
      if (sliced.length === 0 && /^[A-Z]{1,5}$/.test(upperQuery)) {
        sliced.push({
          ticker: upperQuery,
          name: `${upperQuery} (Custom)`,
          type: 'CRYPTO',
          market: 'crypto',
          active: true,
        })
      }

      return NextResponse.json({
        results: sliced,
        count: sliced.length,
      })
    }

    // Search using Polygon.io reference tickers endpoint (all markets)
    const url = `https://api.polygon.io/v3/reference/tickers?search=${encodeURIComponent(query)}&active=true&limit=${limit}&apiKey=${POLYGON_API_KEY}`

    const response = await fetch(url)

    if (!response.ok) {
      console.error("Polygon.io ticker search error:", response.status)
      // Fallback to static list on API failure
      const upperQuery = query.toUpperCase()
      const filtered = COMMON_TICKERS.filter(
        t => t.ticker.includes(upperQuery) || t.name.toUpperCase().includes(upperQuery)
      )

      // Sort: exact match first
      filtered.sort((a, b) => {
        const aExact = a.ticker === upperQuery ? 0 : a.ticker.startsWith(upperQuery) ? 1 : 2
        const bExact = b.ticker === upperQuery ? 0 : b.ticker.startsWith(upperQuery) ? 1 : 2
        return aExact - bExact
      })

      const sliced = filtered.slice(0, limit)

      // Allow any 1-5 character uppercase string as a valid ticker
      if (sliced.length === 0 && /^[A-Z]{1,5}$/.test(upperQuery)) {
        sliced.push({
          ticker: upperQuery,
          name: `${upperQuery} (Custom)`,
          type: 'CRYPTO',
          market: 'crypto',
          active: true,
        })
      }

      return NextResponse.json({
        results: sliced,
        count: sliced.length,
      })
    }

    interface PolygonTickerResult {
      ticker: string
      name: string
      type: string
      market: string
      active: boolean
    }

    interface PolygonTickersResponse {
      results?: PolygonTickerResult[]
      count?: number
      status?: string
    }

    const data: PolygonTickersResponse = await response.json()

    const results: TickerSearchResult[] = (data.results || []).map((ticker) => ({
      ticker: ticker.ticker,
      name: ticker.name,
      type: ticker.type,
      market: ticker.market,
      active: ticker.active,
    }))

    // Merge: static crypto/fx/etf come first, then sort by match quality
    const upperQuery = query.toUpperCase()
    const staticMatches = COMMON_TICKERS.filter(
      t => t.ticker.includes(upperQuery) || t.name.toUpperCase().includes(upperQuery)
    )

    // Static crypto/forex/etf entries always take priority over Polygon stock results
    // because Polygon doesn't serve these markets well
    const priorityStatic = staticMatches.filter(
      s => s.market === 'crypto' || s.market === 'fx'
    )
    const otherStatic = staticMatches.filter(
      s => s.market !== 'crypto' && s.market !== 'fx'
    )

    // Dedup: static priority entries always win, then Polygon results, then other static
    const seen = new Set<string>()
    const merged: TickerSearchResult[] = []

    // 1. Priority static (crypto, forex) — always first
    for (const s of priorityStatic) {
      if (!seen.has(s.ticker)) {
        seen.add(s.ticker)
        merged.push(s)
      }
    }

    // 2. Polygon results — skip if already added from static priority
    for (const r of results) {
      if (!seen.has(r.ticker)) {
        seen.add(r.ticker)
        merged.push(r)
      }
    }

    // 3. Other static matches (stock fallbacks) — fill remaining
    for (const s of otherStatic) {
      if (!seen.has(s.ticker)) {
        seen.add(s.ticker)
        merged.push(s)
      }
    }

    // Sort: exact ticker match first, then starts-with, then contains
    merged.sort((a, b) => {
      const aExact = a.ticker === upperQuery ? 0 : a.ticker.startsWith(upperQuery) ? 1 : 2
      const bExact = b.ticker === upperQuery ? 0 : b.ticker.startsWith(upperQuery) ? 1 : 2
      return aExact - bExact
    })

    const finalResults = merged.slice(0, limit)

    return NextResponse.json(
      {
        results: finalResults,
        count: finalResults.length,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    )
  } catch (error) {
    console.error("Ticker search API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
