import { createHash } from 'crypto'
import type { BlakeChartState } from './types'

export function computeStructuralHash(state: BlakeChartState): string {
  const elements = {
    trend: state.trend,
    recentEvent: state.recentEvent,
    majorSwingDirection: state.majorSwing?.direction ?? null,
    nearbyManualLevels: (state.manualLevels ?? [])
      .filter((level) => level.status === 'active' && Math.abs((level.price - state.currentPrice) / state.currentPrice) < 0.05)
      .map((level) => ({ price: Math.round(level.price * 1000) / 1000, role: level.role, label: level.label }))
      .sort((a, b) => a.price - b.price),
    rsiZone: state.indicators.rsiZone,
    hasDivergence: state.divergences.length > 0,
    channelDirection: state.channel?.direction ?? null,
  }
  return createHash('sha256').update(JSON.stringify(elements)).digest('hex').slice(0, 16)
}

export function deriveBias(state: BlakeChartState): 'long' | 'short' | 'neutral' {
  if (state.trend === 'up' && state.indicators.rsiZone !== 'overbought') return 'long'
  if (state.trend === 'down' && state.indicators.rsiZone !== 'oversold') return 'short'
  return 'neutral'
}
