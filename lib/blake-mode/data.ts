import { cached, redis } from '@/lib/redis'
import { getTickerConfig } from './config'
import type { Candle, TickerConfig } from './types'

export { getTickerConfig, TICKER_CONFIGS } from './config'

interface PolygonAgg {
  t: number
  o: number
  h: number
  l: number
  c: number
  v?: number
}

interface PolygonAggsResponse {
  results?: PolygonAgg[]
  status?: string
  error?: string
}

function dateParam(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function seededNoise(seed: number): number {
  const raw = Math.sin(seed * 12.9898) * 43758.5453
  return raw - Math.floor(raw)
}

function demoBasePrice(symbol: string): number {
  switch (symbol) {
    case 'BTC':
      return 84500
    case 'ETH':
      return 3150
    case 'SOL':
      return 145
    case 'MAGS':
      return 56
    case 'AAPL':
      return 184
    case 'AMZN':
      return 188
    case 'EURUSD':
      return 1.0735
    case 'GBPUSD':
      return 1.251
    default:
      return 100
  }
}

function generateDemoCandles(config: TickerConfig): Candle[] {
  const candles: Candle[] = []
  const now = new Date()
  const stepHours = config.timeframe === '4H' ? 4 : 24
  const totalSlots = config.timeframe === '4H' ? config.lookbackDays * 6 : config.lookbackDays
  const base = demoBasePrice(config.symbol)
  const trendBias = config.assetClass === 'forex' ? -0.02 : config.symbol === 'ETH' ? -0.08 : 0.12

  for (let slot = totalSlots - 1; slot >= 0; slot -= 1) {
    const time = new Date(now.getTime() - slot * stepHours * 60 * 60 * 1000)
    const day = time.getUTCDay()
    if (config.assetClass !== 'crypto' && (day === 0 || day === 6)) continue

    const index = candles.length
    const cycle = Math.sin(index / 12) * 0.035 + Math.sin(index / 37) * 0.07
    const trend = (index / Math.max(totalSlots, 1)) * trendBias
    const shock = (seededNoise(index + config.symbol.length) - 0.5) * 0.018
    const close = base * (1 + cycle + trend + shock)
    const previous = candles[candles.length - 1]
    const open = previous ? previous.close : close * (1 - (seededNoise(index + 7) - 0.5) * 0.01)
    const spread = close * (0.006 + seededNoise(index + 13) * 0.01)
    const high = Math.max(open, close) + spread
    const low = Math.min(open, close) - spread

    candles.push({
      time: Math.floor(time.getTime() / 1000),
      open,
      high,
      low,
      close,
      volume: Math.round(base * 1000 * (0.8 + seededNoise(index + 23))),
    })
  }

  return candles
}

export async function fetchCandles(symbol: string): Promise<Candle[]> {
  const config = getTickerConfig(symbol)
  const cacheKey = `blake-mode:candles:${config.symbol}:${config.timeframe}:${config.lookbackDays}`

  return cached(cacheKey, 60, async () => {
    const apiKey = process.env.POLYGON_API_KEY
    if (!apiKey) {
      console.warn(`[Blake Mode] POLYGON_API_KEY missing; using demo candles for ${config.symbol}`)
      return generateDemoCandles(config)
    }

    const multiplier = config.timeframe === '4H' ? 4 : 1
    const timespan = config.timeframe === '4H' ? 'hour' : 'day'
    const to = new Date()
    const from = new Date(to.getTime() - config.lookbackDays * 24 * 60 * 60 * 1000)
    const encodedTicker = encodeURIComponent(config.polygonTicker)
    const url = `https://api.polygon.io/v2/aggs/ticker/${encodedTicker}/range/${multiplier}/${timespan}/${dateParam(from)}/${dateParam(to)}?adjusted=true&sort=asc&limit=50000&apiKey=${apiKey}`

    const response = await fetch(url, { cache: 'no-store' })
    if (!response.ok) {
      console.warn(`[Blake Mode] Polygon candles failed for ${config.symbol}: ${response.status}; using demo candles`)
      return generateDemoCandles(config)
    }

    const data = (await response.json()) as PolygonAggsResponse
    if (!data.results?.length) {
      console.warn(`[Blake Mode] Polygon returned no candles for ${config.symbol}: ${data.status ?? data.error ?? 'empty'}; using demo candles`)
      return generateDemoCandles(config)
    }

    const candles = data.results.map((bar) => ({
      time: Math.floor(bar.t / 1000),
      open: bar.o,
      high: bar.h,
      low: bar.l,
      close: bar.c,
      volume: bar.v ?? 0,
    }))

    if (redis) console.info(`[Blake Mode] cached ${candles.length} candles at ${cacheKey}`)
    return candles
  })
}
