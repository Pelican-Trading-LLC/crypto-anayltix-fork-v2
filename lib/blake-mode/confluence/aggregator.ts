import { TICKER_CONFIGS } from '../config'
import type { BlakeChartState } from '../types'
import { getCryptoConfluence, type CryptoConfluence } from './crypto'
import { getEquityConfluence, type EquityConfluence } from './equity'
import { getForexConfluence, type ForexConfluence } from './forex'

export type BlakeConfluence =
  | { type: 'crypto'; data: CryptoConfluence }
  | { type: 'equity'; data: EquityConfluence }
  | { type: 'forex'; data: ForexConfluence }

export async function aggregateConfluence(symbol: string, state: BlakeChartState): Promise<BlakeConfluence> {
  const config = TICKER_CONFIGS[symbol]
  if (!config) throw new Error(`Unknown ticker: ${symbol}`)

  switch (config.assetClass) {
    case 'crypto':
      return { type: 'crypto', data: await getCryptoConfluence(symbol, state) }
    case 'equity':
      return { type: 'equity', data: await getEquityConfluence(symbol, state) }
    case 'forex':
      return { type: 'forex', data: await getForexConfluence(symbol, state) }
  }
}
