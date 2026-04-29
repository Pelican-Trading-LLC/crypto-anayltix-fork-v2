import type { BlakeChartState } from './types'

export type Urgency = 'green' | 'yellow' | 'red'

export function computeUrgency(state: BlakeChartState): Urgency {
  const price = state.currentPrice
  const manualLevels = (state.manualLevels ?? []).filter((level) => level.status === 'active')
  if (manualLevels.length === 0) return 'green'

  const closest = manualLevels.reduce((nearest, level) =>
    Math.abs((level.price - price) / price) < Math.abs((nearest.price - price) / price) ? level : nearest
  )
  const distancePercent = Math.abs((closest.price - price) / price) * 100

  if (state.divergences.length > 0 && distancePercent < 2) return 'red'
  if (distancePercent < 0.5) return 'red'
  if (distancePercent < 1.5) return 'yellow'
  return 'green'
}
