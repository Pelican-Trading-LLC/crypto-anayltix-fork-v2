import { fetchCandles, getTickerConfig } from '../data'
import type { BlakeChartState, Candle } from '../types'
import { detectChannel } from './channels'
import { detectDivergences } from './divergence'
import { computeFibLevels } from './fibs'
import { computeIndicators } from './indicators'
import { detectHorizontalLevels } from './levels'
import { detectPivots } from './pivots'
import { findMajorSwing } from './swing'
import { detectTrendlines } from './trendlines'

function determineTrend(candles: Candle[], ema50: number[], ema200: number[]): BlakeChartState['trend'] {
  const fast = ema50[ema50.length - 1]
  const slow = ema200[ema200.length - 1]
  const fastPrior = ema50[Math.max(0, ema50.length - 8)]
  if (typeof fast !== 'number' || typeof slow !== 'number' || typeof fastPrior !== 'number') return 'sideways'

  const slope = fast - fastPrior
  const slopePct = Math.abs(slope / fastPrior) * 100
  if (fast > slow && slope >= 0) return 'up'
  if (fast < slow && slope <= 0) return 'down'
  if (slopePct < 0.5) return 'sideways'
  return fast > slow ? 'up' : 'down'
}

function determineRecentEvent(candles: Candle[]): BlakeChartState['recentEvent'] {
  if (candles.length < 12) return null
  const latest = candles[candles.length - 1]
  const previous = candles.slice(Math.max(0, candles.length - 30), -1)
  const recent = candles.slice(-5)
  if (!latest || previous.length === 0) return null

  const priorHigh = Math.max(...previous.map((c) => c.high))
  const priorLow = Math.min(...previous.map((c) => c.low))
  const recentHigh = Math.max(...recent.map((c) => c.high))
  const recentLow = Math.min(...recent.map((c) => c.low))
  const range = priorHigh - priorLow
  const buffer = range * 0.002

  if (latest.close > priorHigh) return 'breakout'
  if (latest.close < priorLow) return 'breakdown'
  if (recentHigh > priorHigh - buffer) return 'new_trend_high'
  if (recentLow < priorLow + buffer) return 'new_trend_low'
  if (latest.high >= priorHigh - buffer && latest.close < latest.open) return 'rejection'
  return 'consolidation'
}

export async function buildBlakeChartState(symbol: string): Promise<BlakeChartState> {
  const config = getTickerConfig(symbol)
  const candles = await fetchCandles(config.symbol)
  const latest = candles[candles.length - 1]
  if (!latest) throw new Error(`No candles available for ${symbol}`)

  const comparisonBars = config.timeframe === '4H' ? 6 : 1
  const comparison = candles[Math.max(0, candles.length - 1 - comparisonBars)] ?? latest
  const priceChange24h = latest.close - comparison.close
  const priceChangePercent24h = comparison.close ? (priceChange24h / comparison.close) * 100 : 0

  const pivots = detectPivots(candles)
  const majorSwing = findMajorSwing(pivots, candles)
  const fibLevels = majorSwing ? computeFibLevels(majorSwing) : []
  const horizontalLevels = detectHorizontalLevels(pivots, candles)
  const trendlines = detectTrendlines(pivots, candles)
  const channel = detectChannel(trendlines, pivots)
  const indicators = computeIndicators(candles)
  const divergences = detectDivergences(pivots, candles, indicators.rsi14)

  return {
    ticker: config.symbol,
    displayName: config.displayName,
    assetClass: config.assetClass,
    timeframe: config.timeframe,
    candles,
    currentPrice: latest.close,
    priceChange24h,
    priceChangePercent24h,
    majorSwing,
    fibLevels,
    horizontalLevels,
    manualLevels: [],
    trendlines,
    channel,
    indicators,
    divergences,
    trend: determineTrend(candles, indicators.ema50, indicators.ema200),
    recentEvent: determineRecentEvent(candles),
  }
}
