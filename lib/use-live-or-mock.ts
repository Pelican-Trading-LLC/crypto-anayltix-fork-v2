/**
 * Utility to merge live API data with mock data.
 * Live data overrides mock fields where available.
 * Mock data fills in fields the API doesn't cover yet (derivatives, smart money, etc.)
 */

import { LiveMarketData, LiveTokenData } from '@/hooks/use-crypto-data'
import { TokenIntelData, MOCK_TOKEN_INTEL, MockPosition, MOCK_POSITIONS } from '@/lib/crypto-mock-data'

/**
 * Merge live token data into mock TokenIntelData.
 * Live data replaces: price, market cap, FDV, volume, sparkline, TVL
 * Mock data stays for: derivatives, on-chain, risk, pelican synthesis
 */
export function mergeTokenIntel(
  symbol: string,
  liveData: LiveTokenData | undefined
): TokenIntelData | null {
  const mock = MOCK_TOKEN_INTEL[symbol.toUpperCase()]
  if (!mock) return null

  if (!liveData) return mock

  return {
    ...mock,
    price: liveData.price,
    price_change_24h: liveData.price_change_24h,
    price_change_7d: liveData.price_change_7d,
    price_change_30d: liveData.price_change_30d,
    market_cap: liveData.market_cap,
    fdv: liveData.fdv,
    volume_24h: liveData.volume_24h,
    vol_mcap_ratio: liveData.vol_mcap_ratio,
    ath: liveData.ath,
    ath_date: liveData.ath_date,
    sparkline_7d: liveData.sparkline_7d.length > 0 ? liveData.sparkline_7d : mock.sparkline_7d,
    tvl: liveData.tvl ?? mock.tvl,
    tvl_change_30d: liveData.tvl_change_30d ?? mock.tvl_change_30d,
  }
}

/**
 * Merge live prices into mock positions.
 * Updates current_price and recalculates P&L.
 */
export function mergePositions(
  livePrices: { symbol: string; price: number; price_change_24h: number }[] | undefined
): MockPosition[] {
  if (!livePrices || livePrices.length === 0) return MOCK_POSITIONS

  const priceMap = new Map(livePrices.map(p => [p.symbol, p]))

  return MOCK_POSITIONS.map(pos => {
    const live = priceMap.get(pos.asset)
    if (!live) return pos

    const newPrice = live.price
    const newPnl = (newPrice - pos.avg_entry_price) * pos.quantity
    const newPnlPct = ((newPrice - pos.avg_entry_price) / pos.avg_entry_price) * 100

    return {
      ...pos,
      current_price: newPrice,
      price_change_24h: live.price_change_24h,
      unrealized_pnl: Math.round(newPnl * 100) / 100,
      unrealized_pnl_pct: Math.round(newPnlPct * 100) / 100,
    }
  })
}
