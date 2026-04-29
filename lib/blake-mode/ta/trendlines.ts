import type { Candle, Pivot, Trendline } from '../types'

function lineValueAt(start: Pivot, end: Pivot, time: number): number {
  const timeDelta = end.time - start.time
  if (timeDelta === 0) return end.price
  const slope = (end.price - start.price) / timeDelta
  return start.price + slope * (time - start.time)
}

function buildLine(pivots: Pivot[], candles: Candle[], type: 'high' | 'low'): Trendline | null {
  const relevant = pivots.filter((p) => p.type === type).slice(-5)
  if (relevant.length < 2) return null

  const p1 = relevant[relevant.length - 2]
  const p2 = relevant[relevant.length - 1]
  const latest = candles[candles.length - 1]
  if (!p1 || !p2 || !latest || p1.time === p2.time) return null

  const slope = (p2.price - p1.price) / (p2.time - p1.time)
  const direction = slope >= 0 ? 'ascending' : 'descending'
  let touchCount = 2

  for (const pivot of relevant.slice(0, -2)) {
    const projected = lineValueAt(p1, p2, pivot.time)
    if (Math.abs(pivot.price - projected) / projected <= 0.005) touchCount += 1
  }

  const candleTouches = candles
    .slice(Math.max(0, p1.index), Math.min(candles.length, p2.index + 1))
    .filter((candle) => {
      const projected = lineValueAt(p1, p2, candle.time)
      const price = type === 'high' ? candle.high : candle.low
      return Math.abs(price - projected) / projected <= 0.005
    })
    .length

  touchCount = Math.max(touchCount, candleTouches)
  if (touchCount < 3) return null

  return {
    startTime: p1.time,
    startPrice: p1.price,
    endTime: latest.time,
    endPrice: lineValueAt(p1, p2, latest.time),
    slope,
    direction,
    touchCount,
  }
}

export function detectTrendlines(pivots: Pivot[], candles: Candle[]): Trendline[] {
  return [buildLine(pivots, candles, 'high'), buildLine(pivots, candles, 'low')].filter(
    (line): line is Trendline => Boolean(line)
  )
}

