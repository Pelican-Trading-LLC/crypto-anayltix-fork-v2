import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createUserRateLimiter, rateLimitResponse } from "@/lib/rate-limit"

export const dynamic = "force-dynamic"

const marketDataLimiter = createUserRateLimiter('market-data', 60, '1 m')

const POLYGON_API_KEY = process.env.POLYGON_API_KEY

// Polygon crypto endpoints
const CRYPTO_URL = `https://api.polygon.io/v2/snapshot/locale/global/markets/crypto/tickers?tickers=X:BTCUSD,X:ETHUSD,X:SOLUSD,X:AVAXUSD&apiKey=${POLYGON_API_KEY}`

// Polygon API response interfaces
interface PolygonCryptoSnapshot {
  ticker: string
  todaysChangePerc?: number
  lastTrade?: { p?: number }
  day?: { c?: number }
}

interface PolygonCryptoResponse {
  tickers?: PolygonCryptoSnapshot[]
  status?: string
}

// Our API response interfaces
interface MarketIndex {
  symbol: string
  name: string
  price: number | null
  change: number | null
  changePercent: number | null
}

interface SectorData {
  name: string
  changePercent: number | null
}

interface WatchlistTicker {
  symbol: string
  price: number | null
  changePercent: number | null
}

interface MarketDataResponse {
  indices: MarketIndex[]
  vix: number | null
  vixChange: number | null
  sectors: SectorData[]
  watchlist: WatchlistTicker[]
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { success } = await marketDataLimiter.limit(user.id)
    if (!success) return rateLimitResponse()

    const fallbackData: MarketDataResponse = {
      indices: [
        { symbol: "BTC", name: "Bitcoin", price: null, change: null, changePercent: null },
        { symbol: "ETH", name: "Ethereum", price: null, change: null, changePercent: null },
        { symbol: "SOL", name: "Solana", price: null, change: null, changePercent: null },
      ],
      vix: null,
      vixChange: null,
      sectors: [
        { name: "DeFi", changePercent: null },
        { name: "Layer 1", changePercent: null },
        { name: "Layer 2", changePercent: null },
        { name: "Gaming", changePercent: null },
      ],
      watchlist: [
        { symbol: "BTC", price: null, changePercent: null },
        { symbol: "ETH", price: null, changePercent: null },
        { symbol: "SOL", price: null, changePercent: null },
        { symbol: "AVAX", price: null, changePercent: null },
      ],
    }

    if (!POLYGON_API_KEY) {
      return NextResponse.json(fallbackData)
    }

    // Fetch crypto data from Polygon
    const cryptoResponse = await fetch(CRYPTO_URL)

    if (!cryptoResponse.ok) {
      console.error("Polygon.io API error:", { crypto: cryptoResponse.status })
      return NextResponse.json(
        { error: "Failed to fetch market data from upstream provider" },
        { status: 502 }
      )
    }

    const cryptoData: PolygonCryptoResponse = await cryptoResponse.json()

    // Map crypto tickers
    const cryptoMap: Record<string, { name: string; symbol: string }> = {
      "X:BTCUSD": { name: "Bitcoin", symbol: "BTC" },
      "X:ETHUSD": { name: "Ethereum", symbol: "ETH" },
      "X:SOLUSD": { name: "Solana", symbol: "SOL" },
      "X:AVAXUSD": { name: "Avalanche", symbol: "AVAX" },
    }

    const indices: MarketIndex[] = []
    const watchlist: WatchlistTicker[] = []

    // Process crypto from Polygon response
    if (cryptoData.tickers && Array.isArray(cryptoData.tickers)) {
      cryptoData.tickers.forEach((ticker: PolygonCryptoSnapshot) => {
        const mapping = cryptoMap[ticker.ticker]
        if (mapping) {
          const price = ticker.lastTrade?.p ?? ticker.day?.c ?? null
          indices.push({
            symbol: mapping.symbol,
            name: mapping.name,
            price,
            change: null,
            changePercent: ticker.todaysChangePerc ?? null,
          })
          watchlist.push({
            symbol: mapping.symbol,
            price,
            changePercent: ticker.todaysChangePerc ?? null,
          })
        }
      })
    }

    // Sectors are not available from Polygon for crypto — return nulls
    const sectors: SectorData[] = [
      { name: "DeFi", changePercent: null },
      { name: "Layer 1", changePercent: null },
      { name: "Layer 2", changePercent: null },
      { name: "Gaming", changePercent: null },
    ]

    const response: MarketDataResponse = {
      indices,
      vix: null,
      vixChange: null,
      sectors,
      watchlist,
    }

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    })
  } catch (error) {
    console.error("Market data API error:", error)

    // Return null values with 502 to indicate upstream failure
    return NextResponse.json(
      {
        indices: [
          { symbol: "BTC", name: "Bitcoin", price: null, change: null, changePercent: null },
          { symbol: "ETH", name: "Ethereum", price: null, change: null, changePercent: null },
          { symbol: "SOL", name: "Solana", price: null, change: null, changePercent: null },
        ],
        vix: null,
        vixChange: null,
        sectors: [
          { name: "DeFi", changePercent: null },
          { name: "Layer 1", changePercent: null },
          { name: "Layer 2", changePercent: null },
          { name: "Gaming", changePercent: null },
        ],
        watchlist: [
          { symbol: "BTC", price: null, changePercent: null },
          { symbol: "ETH", price: null, changePercent: null },
          { symbol: "SOL", price: null, changePercent: null },
          { symbol: "AVAX", price: null, changePercent: null },
        ],
      },
      { status: 502 }
    )
  }
}

