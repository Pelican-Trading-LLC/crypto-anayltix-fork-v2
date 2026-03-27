import type { PolymarketMarket } from '@/lib/polymarket'

export interface ContrarianSignal {
  market: PolymarketMarket
  type: 'extreme_reversal' | 'volume_divergence'
  description: string
  severity: 'strong' | 'moderate'
}

export function detectContrarianSignals(markets: PolymarketMarket[]): ContrarianSignal[] {
  const signals: ContrarianSignal[] = []

  for (const market of markets) {
    const prices = market._parsedPrices || []
    const prob = prices[0] ? prices[0] * 100 : 50

    if (prob > 90 || prob < 10) {
      signals.push({
        market, type: 'extreme_reversal',
        description: prob > 90 ? `${prob.toFixed(0)}% confident — near-certainty. Watch for cracks.` : `Only ${prob.toFixed(0)}% — contrarian opportunity if you disagree.`,
        severity: 'moderate',
      })
    }

    if (prob < 25 && (market.volume24hr || 0) > 500000) {
      signals.push({
        market, type: 'volume_divergence',
        description: `Only ${prob.toFixed(0)}% but $${((market.volume24hr || 0) / 1000).toFixed(0)}K in 24h vol — someone betting on the unlikely outcome.`,
        severity: 'strong',
      })
    }
    if (prob > 75 && (market.volume24hr || 0) > 500000) {
      signals.push({
        market, type: 'volume_divergence',
        description: `${prob.toFixed(0)}% consensus with $${((market.volume24hr || 0) / 1000).toFixed(0)}K volume — heavy activity despite consensus.`,
        severity: 'moderate',
      })
    }
  }

  const best = new Map<string, ContrarianSignal>()
  for (const s of signals) {
    const id = s.market.conditionId || s.market.id
    const existing = best.get(id)
    if (!existing || s.severity === 'strong') best.set(id, s)
  }
  return Array.from(best.values()).sort((a, b) => a.severity === 'strong' && b.severity !== 'strong' ? -1 : b.severity === 'strong' && a.severity !== 'strong' ? 1 : 0)
}
