import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createUserRateLimiter, rateLimitResponse } from "@/lib/rate-limit"

export const dynamic = "force-dynamic"

const moversLimiter = createUserRateLimiter('movers', 30, '1 m')

const POLYGON_API_KEY = process.env.POLYGON_API_KEY

export interface Mover {
  ticker: string
  name: string
  price: number
  changePercent: number
  volume: number
}

export interface MoversResponse {
  gainers: Mover[]
  losers: Mover[]
  active: Mover[]
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { success } = await moversLimiter.limit(user.id)
    if (!success) return rateLimitResponse()

    // Check cache first
    const { data: cachedData } = await supabase
      .from('cached_market_data')
      .select('data, fetched_at')
      .eq('data_type', 'top_movers')
      .is('user_id', null)
      .single()

    if (cachedData?.fetched_at) {
      const cacheAge = Date.now() - new Date(cachedData.fetched_at).getTime()
      if (cacheAge < 300_000) { // 5 minutes
        return NextResponse.json(cachedData.data, {
          headers: { "Cache-Control": "public, s-maxage=300" },
        })
      }
    }

    if (!POLYGON_API_KEY) {
      return NextResponse.json({
        gainers: [],
        losers: [],
        active: [],
      })
    }

    // Fetch gainers, losers, and most active from Polygon
    const [gainersRes, losersRes, activeRes] = await Promise.all([
      fetch(`https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/gainers?apiKey=${POLYGON_API_KEY}`),
      fetch(`https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/losers?apiKey=${POLYGON_API_KEY}`),
      fetch(`https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers?sort=volume&limit=10&apiKey=${POLYGON_API_KEY}`),
    ])

    if (!gainersRes.ok || !losersRes.ok || !activeRes.ok) {
      console.error("Polygon movers API error")
      // Return stale cache if available
      if (cachedData?.data) {
        return NextResponse.json(cachedData.data)
      }
      return NextResponse.json({ error: "Failed to fetch movers" }, { status: 502 })
    }

    interface PolygonTicker {
      ticker: string
      name?: string
      todaysChangePerc?: number
      day?: { c?: number; v?: number }
      lastTrade?: { p?: number }
    }

    const [gainersData, losersData, activeData]: Array<{ tickers?: PolygonTicker[] }> = await Promise.all([
      gainersRes.json(),
      losersRes.json(),
      activeRes.json(),
    ])

    const mapMover = (ticker: PolygonTicker): Mover => ({
      ticker: ticker.ticker,
      name: ticker.name || ticker.ticker,
      price: ticker.lastTrade?.p ?? ticker.day?.c ?? 0,
      changePercent: ticker.todaysChangePerc ?? 0,
      volume: ticker.day?.v ?? 0,
    })

    const response: MoversResponse = {
      gainers: (gainersData?.tickers || []).slice(0, 10).map(mapMover),
      losers: (losersData?.tickers || []).slice(0, 10).map(mapMover),
      active: (activeData?.tickers || []).slice(0, 10).map(mapMover),
    }

    // Cache the response
    await supabase
      .from('cached_market_data')
      .upsert({
        data_type: 'top_movers',
        data: response,
        fetched_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 300_000).toISOString(),
        user_id: null,
        cache_key: 'daily_movers',
      }, {
        onConflict: 'data_type,cache_key',
      })

    return NextResponse.json(response, {
      headers: { "Cache-Control": "public, s-maxage=300" },
    })
  } catch (error) {
    console.error("Movers API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
