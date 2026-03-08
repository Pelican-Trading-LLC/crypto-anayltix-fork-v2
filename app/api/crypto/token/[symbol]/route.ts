import { NextResponse } from 'next/server'
import { getMarketData, symbolToId } from '@/lib/api/coingecko'
import { getProtocolTvl, getProtocolSlug } from '@/lib/api/defillama'
import { cached } from '@/lib/redis'

/**
 * GET /api/crypto/token/BTC
 * Returns combined CoinGecko market data + DeFiLlama TVL for a single token.
 * Cached 5 min.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params
    const upperSymbol = symbol.toUpperCase()
    const coinGeckoId = symbolToId(upperSymbol)

    if (!coinGeckoId) {
      return NextResponse.json({ error: `Unknown symbol: ${upperSymbol}` }, { status: 404 })
    }

    const cacheKey = `token:${upperSymbol}`

    const data = await cached(cacheKey, 300, async () => {
      const [marketData, tvlData] = await Promise.allSettled([
        getMarketData([coinGeckoId], { sparkline: true, priceChangePercentage: '24h,7d,30d' }),
        (async () => {
          const slug = getProtocolSlug(upperSymbol)
          if (!slug) return null
          try {
            return await getProtocolTvl(slug)
          } catch {
            return null
          }
        })(),
      ])

      const market = marketData.status === 'fulfilled' && marketData.value[0] ? marketData.value[0] : null
      const tvl = tvlData.status === 'fulfilled' ? tvlData.value : null

      if (!market) {
        throw new Error(`No market data found for ${upperSymbol}`)
      }

      let tvlCurrent: number | null = null
      let tvlChange30d: number | null = null
      if (tvl && tvl.tvl && tvl.tvl.length > 0) {
        tvlCurrent = tvl.tvl[tvl.tvl.length - 1]?.totalLiquidityUSD || null
        if (tvl.tvl.length > 30) {
          const tvl30dAgo = tvl.tvl[tvl.tvl.length - 31]?.totalLiquidityUSD
          if (tvl30dAgo && tvlCurrent) {
            tvlChange30d = ((tvlCurrent - tvl30dAgo) / tvl30dAgo) * 100
          }
        }
      }

      return {
        symbol: upperSymbol,
        name: market.name,
        price: market.current_price,
        price_change_24h: market.price_change_percentage_24h || 0,
        price_change_7d: market.price_change_percentage_7d_in_currency || 0,
        price_change_30d: market.price_change_percentage_30d_in_currency || 0,
        market_cap: market.market_cap,
        fdv: market.fully_diluted_valuation || 0,
        volume_24h: market.total_volume,
        vol_mcap_ratio: market.market_cap > 0 ? market.total_volume / market.market_cap : 0,
        ath: market.ath,
        ath_date: market.ath_date?.split('T')[0] || '',
        sparkline_7d: market.sparkline_in_7d?.price || [],
        circulating_supply: market.circulating_supply,
        total_supply: market.total_supply,
        image: market.image,
        tvl: tvlCurrent,
        tvl_change_30d: tvlChange30d ? Math.round(tvlChange30d * 10) / 10 : null,
        sources: {
          price: 'CoinGecko',
          tvl: tvl ? 'DeFiLlama' : null,
        },
      }
    })

    return NextResponse.json({ data, timestamp: Date.now() })
  } catch (error) {
    console.error('[API /crypto/token]', error)
    return NextResponse.json(
      { error: 'Failed to fetch token data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
