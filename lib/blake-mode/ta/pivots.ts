import type { Candle, Pivot } from '../types'

export function detectPivots(candles: Candle[], lookback = 5): Pivot[] {
  const pivots: Pivot[] = []
  if (candles.length < lookback * 2 + 1) return pivots

  for (let i = lookback; i <= candles.length - lookback - 1; i += 1) {
    const candle = candles[i]
    if (!candle) continue

    let isHigh = true
    let isLow = true

    for (let j = i - lookback; j <= i + lookback; j += 1) {
      if (j === i) continue
      const compare = candles[j]
      if (!compare) continue
      if (candle.high <= compare.high) isHigh = false
      if (candle.low >= compare.low) isLow = false
    }

    if (isHigh) pivots.push({ index: i, time: candle.time, price: candle.high, type: 'high' })
    if (isLow) pivots.push({ index: i, time: candle.time, price: candle.low, type: 'low' })
  }

  return pivots.sort((a, b) => a.time - b.time)
}

