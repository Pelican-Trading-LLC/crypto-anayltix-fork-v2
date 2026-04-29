import type { Channel, Pivot, Trendline } from '../types'

function averageLinePrice(line: Trendline): number {
  return (line.startPrice + line.endPrice) / 2
}

export function detectChannel(trendlines: Trendline[], pivots: Pivot[]): Channel | null {
  void pivots
  if (trendlines.length < 2) return null

  for (let i = 0; i < trendlines.length; i += 1) {
    const first = trendlines[i]
    if (!first) continue
    for (let j = i + 1; j < trendlines.length; j += 1) {
      const second = trendlines[j]
      if (!second || first.direction !== second.direction) continue

      const slopeBase = Math.max(Math.abs(first.slope), Math.abs(second.slope), 0.0000001)
      const parallelEnough = Math.abs(first.slope - second.slope) / slopeBase <= 0.15
      if (!parallelEnough) continue

      const upperLine = averageLinePrice(first) >= averageLinePrice(second) ? first : second
      const lowerLine = upperLine === first ? second : first
      return {
        upperLine,
        lowerLine,
        direction: first.direction,
        width: Math.abs(averageLinePrice(upperLine) - averageLinePrice(lowerLine)),
      }
    }
  }

  return null
}
