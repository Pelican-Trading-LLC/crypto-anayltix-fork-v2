import { NextResponse } from 'next/server'
import { getMarketData, idsFromSymbols } from '@/lib/api/coingecko'
import { cached } from '@/lib/redis'

export const dynamic = 'force-dynamic'

/**
 * GET /api/crypto/sectors
 * Returns aggregated market data per sector. Cached 10 min.
 */

// Removed MAPLE, DIMO, PUFFER — no confirmed CoinGecko IDs
const SECTOR_DEFINITIONS: Record<string, string[]> = {
  'AI / Compute': ['TAO', 'RNDR', 'AKT', 'FET', 'NEAR'],
  'GameFi': ['GALA', 'IMX', 'RON', 'AXS', 'SAND'],
  'RWA': ['ONDO', 'PENDLE', 'MKR', 'COMP'],
  'DePIN': ['HNT', 'FIL', 'AR', 'IOTX'],
  'DeFi Bluechips': ['UNI', 'AAVE', 'MKR', 'CRV', 'LDO'],
  'Restaking': ['EIGEN', 'ETHFI', 'REZ', 'ALT'],
  'L2 / L3 Scaling': ['ARB', 'OP', 'STRK', 'MANTA', 'METIS'],
  'Memecoins': ['DOGE', 'WIF', 'PEPE', 'BONK', 'FLOKI'],
}

export async function GET() {
  try {
    const data = await cached('sectors:all', 600, async () => {
      const allSymbols = [...new Set(Object.values(SECTOR_DEFINITIONS).flat())]
      const allIds = idsFromSymbols(allSymbols)

      const marketData = await getMarketData(allIds, { sparkline: false, priceChangePercentage: '24h,7d' })

      const coinBySymbol = new Map<string, typeof marketData[0]>()
      for (const coin of marketData) {
        coinBySymbol.set(coin.symbol.toUpperCase(), coin)
      }

      const sectors = Object.entries(SECTOR_DEFINITIONS).map(([name, symbols]) => {
        let totalVolume = 0
        let totalMcap = 0
        const tokenData: { symbol: string; change_7d: number; price: number }[] = []

        for (const sym of symbols) {
          const coin = coinBySymbol.get(sym)
          if (coin) {
            totalVolume += coin.total_volume
            totalMcap += coin.market_cap
            tokenData.push({
              symbol: sym,
              change_7d: coin.price_change_percentage_7d_in_currency || 0,
              price: coin.current_price,
            })
          }
        }

        tokenData.sort((a, b) => b.change_7d - a.change_7d)

        return {
          name,
          token_count: symbols.length,
          volume: totalVolume,
          market_cap: totalMcap,
          top_tokens: tokenData.slice(0, 3),
        }
      })

      return sectors
    })

    return NextResponse.json({ data, timestamp: Date.now() })
  } catch (error) {
    console.error('[API /crypto/sectors]', error)
    return NextResponse.json(
      { error: 'Failed to fetch sector data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
