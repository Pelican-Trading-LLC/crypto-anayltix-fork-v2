import type { KrakenTicker } from '@/lib/kraken'
import type { MockToken } from '@/lib/crypto-mock-data'

export interface MergedToken extends MockToken {
  _isLive: boolean
}

/**
 * Merge Kraken live data into mock token list.
 * Live price/change/volume override mock values.
 * Mock-only fields (flows, smart money, liquidity) stay from mock.
 */
export function mergeTokenData(live: KrakenTicker[], mock: MockToken[]): MergedToken[] {
  const liveMap = new Map(live.map(t => [t.symbol, t]))
  const mockMap = new Map(mock.map(t => [t.symbol, t]))
  const merged: MergedToken[] = []

  // Merge mock tokens with live where available
  for (const m of mock) {
    const l = liveMap.get(m.symbol)
    if (l) {
      merged.push({
        ...m,
        price: l.price,
        change24h: l.change24h,
        volume: l.volumeUsd24h,
        traders: l.trades24h || m.traders,
        _isLive: true,
      })
    } else {
      merged.push({ ...m, _isLive: false })
    }
  }

  // Add Kraken tokens not in mock
  for (const l of live) {
    if (!mockMap.has(l.symbol)) {
      merged.push({
        chain: 'MULTI',
        symbol: l.symbol,
        name: l.symbol,
        price: l.price,
        change24h: l.change24h,
        sparkline7d: [],
        marketCap: 0,
        traders: l.trades24h,
        volume: l.volumeUsd24h,
        liquidity: 0,
        inflows: 0,
        outflows: 0,
        netFlows: 0,
        _isLive: true,
      })
    }
  }

  return merged
}
