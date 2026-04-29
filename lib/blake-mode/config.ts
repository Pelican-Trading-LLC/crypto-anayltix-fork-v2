import type { TickerConfig } from './types'

export const TICKER_CONFIGS: Record<string, TickerConfig> = {
  BTC: { symbol: 'BTC', displayName: 'Bitcoin', assetClass: 'crypto', polygonTicker: 'X:BTCUSD', timeframe: '4H', lookbackDays: 90 },
  ETH: { symbol: 'ETH', displayName: 'Ethereum', assetClass: 'crypto', polygonTicker: 'X:ETHUSD', timeframe: '4H', lookbackDays: 90 },
  SOL: { symbol: 'SOL', displayName: 'Solana', assetClass: 'crypto', polygonTicker: 'X:SOLUSD', timeframe: '4H', lookbackDays: 90 },
  MAGS: { symbol: 'MAGS', displayName: 'Magnificent 7', assetClass: 'equity', polygonTicker: 'MAGS', timeframe: '1D', lookbackDays: 365 },
  AAPL: { symbol: 'AAPL', displayName: 'Apple', assetClass: 'equity', polygonTicker: 'AAPL', timeframe: '1D', lookbackDays: 365 },
  AMZN: { symbol: 'AMZN', displayName: 'Amazon', assetClass: 'equity', polygonTicker: 'AMZN', timeframe: '1D', lookbackDays: 365 },
  EURUSD: { symbol: 'EURUSD', displayName: 'EUR / USD', assetClass: 'forex', polygonTicker: 'C:EURUSD', timeframe: '4H', lookbackDays: 90 },
  GBPUSD: { symbol: 'GBPUSD', displayName: 'GBP / USD', assetClass: 'forex', polygonTicker: 'C:GBPUSD', timeframe: '4H', lookbackDays: 90 },
}

export function getTickerConfig(symbol: string): TickerConfig {
  const config = TICKER_CONFIGS[symbol.toUpperCase()]
  if (!config) throw new Error(`Unknown ticker: ${symbol}`)
  return config
}
