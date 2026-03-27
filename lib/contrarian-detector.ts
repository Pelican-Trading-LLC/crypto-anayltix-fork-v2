import type { PolymarketMarket } from '@/lib/polymarket'

export interface ContrarianSignal {
  market: PolymarketMarket
  type: 'extreme_reversal' | 'volume_divergence'
  description: string
  severity: 'strong' | 'moderate'
}

/**
 * Much more selective contrarian detection.
 * Only flags truly unusual situations, not every extreme-probability market.
 */
export function detectContrarianSignals(markets: PolymarketMarket[]): ContrarianSignal[] {
  const signals: ContrarianSignal[] = []

  for (const market of markets) {
    const prices = market._parsedPrices || []
    const prob = prices[0] ? prices[0] * 100 : 50
    const vol24h = Number(market.volume24hr) || 0

    // Only flag: low probability (10-25%) with VERY high volume (>$1M 24h)
    // This means someone is betting big on an unlikely outcome
    if (prob >= 10 && prob <= 25 && vol24h > 1000000) {
      signals.push({
        market, type: 'volume_divergence',
        description: `${prob.toFixed(0)}% but $${(vol24h / 1e6).toFixed(1)}M in 24h volume`,
        severity: 'strong',
      })
    }

    // Or: probability between 35-65% with very high volume — genuinely contested
    if (prob >= 35 && prob <= 65 && vol24h > 2000000) {
      signals.push({
        market, type: 'volume_divergence',
        description: `Contested at ${prob.toFixed(0)}% with $${(vol24h / 1e6).toFixed(1)}M volume`,
        severity: 'moderate',
      })
    }
  }

  // Deduplicate
  const best = new Map<string, ContrarianSignal>()
  for (const s of signals) {
    const id = s.market.conditionId || s.market.id
    if (!best.has(id) || s.severity === 'strong') best.set(id, s)
  }
  return Array.from(best.values()).slice(0, 8) // Max 8 contrarian signals
}
