import { MOCK_TOKEN_INTEL } from '@/lib/crypto-mock-data'
import { fetchMarkets } from '@/lib/polymarket'
import type { BlakeChartState } from '../types'

export interface CryptoConfluence {
  funding: { symbol: string; current: number; oneDayChange: number; trend: 'positive' | 'negative' | 'flipping' } | null
  liquidations: { upsideClusterPrice: number; upsideAmount: number; downsideClusterPrice: number; downsideAmount: number } | null
  whaleActivity: { activeWallets24h: number; netFlow: 'accumulating' | 'distributing' | 'neutral' } | null
  predictionMarkets: { contract: string; probability: number; oneDayChange: number }[] | null
}

export async function getCryptoConfluence(symbol: string, state: BlakeChartState): Promise<CryptoConfluence> {
  const intel = MOCK_TOKEN_INTEL[symbol]

  const markets = await fetchMarkets({ limit: 80 }).catch(() => [])
  const predictionMarkets = markets
    .filter((market) => {
      const text = `${market.question} ${market.description ?? ''}`.toLowerCase()
      return text.includes(symbol.toLowerCase()) || text.includes(state.displayName.toLowerCase()) || text.includes('crypto')
    })
    .slice(0, 3)
    .map((market) => ({
      contract: market.question,
      probability: Math.round(((market._parsedPrices?.[0] ?? 0.5) * 100) * 10) / 10,
      oneDayChange: 0,
    }))

  if (!intel) {
    return {
      funding: null,
      liquidations: null,
      whaleActivity: null,
      predictionMarkets: predictionMarkets.length ? predictionMarkets : null,
    }
  }

  return {
    funding: {
      symbol,
      current: intel.funding_rate,
      oneDayChange: intel.oi_change_24h / 10000,
      trend: Math.abs(intel.funding_rate) < 0.001 ? 'flipping' : intel.funding_rate > 0 ? 'positive' : 'negative',
    },
    liquidations: {
      upsideClusterPrice: state.currentPrice * 1.035,
      upsideAmount: intel.liquidations_24h.shorts,
      downsideClusterPrice: state.currentPrice * 0.965,
      downsideAmount: intel.liquidations_24h.longs,
    },
    whaleActivity: {
      activeWallets24h: Math.round(intel.active_addresses_7d / 7),
      netFlow: intel.smart_money_flow_7d > 20_000_000 || intel.exchange_netflow_7d < -20_000_000
        ? 'accumulating'
        : intel.smart_money_flow_7d < -20_000_000 || intel.exchange_netflow_7d > 20_000_000
          ? 'distributing'
          : 'neutral',
    },
    predictionMarkets: predictionMarkets.length ? predictionMarkets : null,
  }
}

