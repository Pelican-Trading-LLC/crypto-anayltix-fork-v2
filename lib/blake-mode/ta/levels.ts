import type { Candle, HorizontalLevel, Pivot } from '../types'

interface Cluster {
  pivots: Pivot[]
  price: number
}

export function detectHorizontalLevels(
  pivots: Pivot[],
  candles: Candle[],
  clusterTolerancePercent = 0.75
): HorizontalLevel[] {
  const latest = candles[candles.length - 1]
  if (!latest) return []

  const clusters: Cluster[] = []
  for (const pivot of pivots) {
    const existing = clusters.find((cluster) => {
      const tolerance = cluster.price * (clusterTolerancePercent / 100)
      return Math.abs(pivot.price - cluster.price) <= tolerance
    })

    if (existing) {
      existing.pivots.push(pivot)
      existing.price = existing.pivots.reduce((sum, p) => sum + p.price, 0) / existing.pivots.length
    } else {
      clusters.push({ pivots: [pivot], price: pivot.price })
    }
  }

  return clusters
    .filter((cluster) => cluster.pivots.length >= 2)
    .map((cluster) => {
      const times = cluster.pivots.map((p) => p.time)
      const price = cluster.price
      const role: HorizontalLevel['role'] = price > latest.close ? 'resistance' : price < latest.close ? 'support' : 'pivot'
      return {
        price,
        touchCount: cluster.pivots.length,
        firstTouchTime: Math.min(...times),
        lastTouchTime: Math.max(...times),
        role,
        strength: 'minor' as const,
      }
    })
    .sort((a, b) => {
      if (b.touchCount !== a.touchCount) return b.touchCount - a.touchCount
      return Math.abs(a.price - latest.close) - Math.abs(b.price - latest.close)
    })
    .slice(0, 12)
    .map((level, index): HorizontalLevel => ({
      ...level,
      strength: index < 4 ? 'major' : 'minor',
    }))
}
