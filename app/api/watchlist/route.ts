import { NextResponse } from 'next/server'
import { redis } from '@/lib/redis'
import { TICKER_CONFIGS } from '@/lib/blake-mode/config'
import { getCachedAnalysis } from '@/lib/blake-mode/analysis-cache'
import { buildBlakeChartState } from '@/lib/blake-mode/ta/engine'
import { computeUrgency } from '@/lib/blake-mode/urgency'

export const dynamic = 'force-dynamic'

export async function GET() {
  const cacheKey = 'blake-mode:watchlist:payload'
  if (redis) {
    const cached = await redis.get<unknown>(cacheKey)
    if (cached) return NextResponse.json(typeof cached === 'string' ? JSON.parse(cached) : cached)
  }

  const tiles = await Promise.all(
    Object.keys(TICKER_CONFIGS).map(async (ticker) => {
      const state = await buildBlakeChartState(ticker)
      const analysis = await getCachedAnalysis(ticker)
      return {
        ticker,
        displayName: state.displayName,
        assetClass: state.assetClass,
        currentPrice: state.currentPrice,
        priceChangePercent24h: state.priceChangePercent24h,
        urgency: computeUrgency(state),
        manualLevels: state.manualLevels,
        candles: state.candles.slice(-100),
        ema50: state.indicators.ema50.slice(-100),
        ema200: state.indicators.ema200.slice(-100),
        analysis,
      }
    })
  )

  const payload = { tiles, generatedAt: new Date().toISOString() }
  if (redis) await redis.set(cacheKey, payload, { ex: 60 })
  return NextResponse.json(payload)
}
