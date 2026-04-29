import type { Candle, Pivot, SwingMove } from '../types'

export function findMajorSwing(pivots: Pivot[], candles: Candle[]): SwingMove | null {
  if (pivots.length < 2 || candles.length === 0) return null

  let best: SwingMove | null = null
  for (let i = 0; i < pivots.length; i += 1) {
    const a = pivots[i]
    if (!a) continue
    for (let j = i + 1; j < pivots.length; j += 1) {
      const b = pivots[j]
      if (!b || a.type === b.type) continue

      const range = Math.abs(b.price - a.price)
      const anchor = a.price || b.price
      const rangePercent = anchor ? (range / anchor) * 100 : 0
      const direction = b.type === 'high' ? 'up' : 'down'
      const move: SwingMove = {
        startPivot: a,
        endPivot: b,
        direction,
        range,
        rangePercent,
      }

      if (!best || move.range > best.range) best = move
    }
  }

  return best
}

