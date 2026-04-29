import { redis } from '@/lib/redis'
import { buildBlakeChartState } from './ta/engine'
import { getServerLevels } from './store/server-levels'

function formatPrice(price: number, ticker: string): string {
  return ticker.includes('USD') && ticker.length === 6 ? price.toFixed(5) : price.toFixed(price >= 100 ? 2 : 4)
}

export async function getCachedAnalysis(ticker: string): Promise<string> {
  const cacheKey = `blake-mode:analysis:${ticker}`
  if (redis) {
    const cached = await redis.get<string>(cacheKey)
    if (cached) return cached
  }

  const manualLevels = await getServerLevels(ticker)
  const state = await buildBlakeChartState(ticker, { manualLevels })
  const nearest = state.manualLevels
    .filter((level) => level.status === 'active')
    .sort((a, b) => Math.abs((a.price - state.currentPrice) / state.currentPrice) - Math.abs((b.price - state.currentPrice) / state.currentPrice))[0]
  const levelText = nearest ? `${nearest.label || nearest.role} near ${formatPrice(nearest.price, ticker)}` : `${state.trend} trend structure`
  const analysis = `Intraday Update: $${ticker} is working through ${state.recentEvent?.replaceAll('_', ' ') ?? 'structure'} and ${levelText} is in play. A clean move away from that level keeps the ${state.trend === 'down' ? 'downside' : state.trend === 'up' ? 'upside' : 'range'} pressure active.`

  if (redis) await redis.set(cacheKey, analysis, { ex: 900 })
  return analysis
}
