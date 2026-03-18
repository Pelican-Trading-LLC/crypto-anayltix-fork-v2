import { NextResponse } from 'next/server'
import { getSimplePrice, getMarketData, idsFromSymbols, SYMBOL_TO_COINGECKO_ID } from '@/lib/api/coingecko'
import { cached } from '@/lib/redis'

export const dynamic = 'force-dynamic'

/**
 * GET /api/crypto/prices?symbols=BTC,ETH,SOL&detail=true
 *
 * detail=false (default): returns simple prices + 24h change (cached 60s)
 * detail=true: returns full market data with sparklines (cached 5 min)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbolsParam = searchParams.get('symbols')
    const detail = searchParams.get('detail') === 'true'

    if (!symbolsParam) {
      return NextResponse.json({ error: 'Missing symbols parameter' }, { status: 400 })
    }

    const symbols = symbolsParam.split(',').map(s => s.trim().toUpperCase())
    const ids = idsFromSymbols(symbols)

    if (ids.length === 0) {
      return NextResponse.json({ error: 'No valid symbols found' }, { status: 400 })
    }

    if (detail) {
      const cacheKey = `cg:market:${ids.sort().join(',')}`
      const data = await cached(cacheKey, 300, () =>
        getMarketData(ids, { sparkline: true, priceChangePercentage: '24h,7d,30d' })
      )

      const idToSymbol = Object.fromEntries(
        Object.entries(SYMBOL_TO_COINGECKO_ID).map(([sym, id]) => [id, sym])
      )

      const result = data.map(coin => ({
        symbol: idToSymbol[coin.id] || coin.symbol.toUpperCase(),
        name: coin.name,
        price: coin.current_price,
        price_change_24h: coin.price_change_percentage_24h,
        price_change_7d: coin.price_change_percentage_7d_in_currency || 0,
        price_change_30d: coin.price_change_percentage_30d_in_currency || 0,
        market_cap: coin.market_cap,
        fdv: coin.fully_diluted_valuation || 0,
        volume_24h: coin.total_volume,
        vol_mcap_ratio: coin.market_cap > 0 ? coin.total_volume / coin.market_cap : 0,
        ath: coin.ath,
        ath_date: coin.ath_date?.split('T')[0] || '',
        sparkline_7d: coin.sparkline_in_7d?.price || [],
        circulating_supply: coin.circulating_supply,
        total_supply: coin.total_supply,
        image: coin.image,
        market_cap_rank: coin.market_cap_rank,
      }))

      return NextResponse.json({ data: result, timestamp: Date.now() })
    } else {
      const cacheKey = `cg:simple:${ids.sort().join(',')}`
      const data = await cached(cacheKey, 60, () =>
        getSimplePrice(ids, { include_24h_change: true, include_market_cap: true, include_24h_vol: true })
      )

      const idToSymbol = Object.fromEntries(
        Object.entries(SYMBOL_TO_COINGECKO_ID).map(([sym, id]) => [id, sym])
      )

      const result = Object.entries(data).map(([id, vals]) => ({
        symbol: idToSymbol[id] || id,
        price: vals.usd,
        price_change_24h: vals.usd_24h_change || 0,
        market_cap: vals.usd_market_cap || 0,
        volume_24h: vals.usd_24h_vol || 0,
      }))

      return NextResponse.json({ data: result, timestamp: Date.now() })
    }
  } catch (error) {
    console.error('[API /crypto/prices]', error)
    return NextResponse.json(
      { error: 'Failed to fetch prices', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
