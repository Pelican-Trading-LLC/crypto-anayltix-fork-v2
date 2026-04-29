import type { Candle, DivergenceSignal, Pivot } from '../types'

const RSI_OFFSET = 14

function rsiAtPivot(pivot: Pivot, rsi14: number[]): { time: number; value: number } | null {
  const value = rsi14[pivot.index - RSI_OFFSET]
  if (typeof value !== 'number') return null
  return { time: pivot.time, value }
}

function comparePair(type: 'high' | 'low', p1: Pivot, p2: Pivot, r1: number, r2: number): DivergenceSignal['type'] | null {
  if (type === 'high') {
    if (p2.price > p1.price && r2 < r1) return 'bearish'
    if (p2.price < p1.price && r2 > r1) return 'hidden_bearish'
  } else {
    if (p2.price < p1.price && r2 > r1) return 'bullish'
    if (p2.price > p1.price && r2 < r1) return 'hidden_bullish'
  }
  return null
}

export function detectDivergences(pivots: Pivot[], _candles: Candle[], rsi14: number[]): DivergenceSignal[] {
  const signals: DivergenceSignal[] = []

  for (const type of ['high', 'low'] as const) {
    const sameType = pivots.filter((pivot) => pivot.type === type).slice(-4)
    const p1 = sameType[sameType.length - 2]
    const p2 = sameType[sameType.length - 1]
    if (!p1 || !p2) continue

    const rsiPivot1 = rsiAtPivot(p1, rsi14)
    const rsiPivot2 = rsiAtPivot(p2, rsi14)
    if (!rsiPivot1 || !rsiPivot2) continue

    const signalType = comparePair(type, p1, p2, rsiPivot1.value, rsiPivot2.value)
    if (!signalType) continue

    signals.push({
      type: signalType,
      pricePivot1: p1,
      pricePivot2: p2,
      rsiPivot1,
      rsiPivot2,
    })
  }

  return signals
}

