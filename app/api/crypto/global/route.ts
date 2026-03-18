import { NextResponse } from 'next/server'
import { getGlobalData } from '@/lib/api/coingecko'
import { cached } from '@/lib/redis'

export const dynamic = 'force-dynamic'

/**
 * GET /api/crypto/global
 * Returns BTC dominance, total market cap, etc. Cached 2 min.
 */
export async function GET() {
  try {
    const data = await cached('cg:global', 120, async () => {
      const global = await getGlobalData()
      return {
        total_market_cap: global.data.total_market_cap.usd,
        total_volume_24h: global.data.total_volume.usd,
        btc_dominance: Math.round(global.data.market_cap_percentage.btc * 10) / 10,
        eth_dominance: Math.round(global.data.market_cap_percentage.eth * 10) / 10,
        market_cap_change_24h: Math.round(global.data.market_cap_change_percentage_24h_usd * 100) / 100,
        active_cryptocurrencies: global.data.active_cryptocurrencies,
      }
    })

    return NextResponse.json({ data, timestamp: Date.now() })
  } catch (error) {
    console.error('[API /crypto/global]', error)
    return NextResponse.json(
      { error: 'Failed to fetch global data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
