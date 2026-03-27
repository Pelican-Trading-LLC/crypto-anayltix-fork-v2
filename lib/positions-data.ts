// Demo positions and trade history for the Positions tab
// Used when user clicks "Load Demo Portfolio"

export interface DemoPosition {
  symbol: string
  name: string
  quantity: number
  averageCost: number
  currentPrice: number
  marketValue: number
  unrealizedPnl: number
  unrealizedPnlPercent: number
  dayChange: number
  dayChangePercent: number
  exchange: string
}

export const DEMO_POSITIONS: DemoPosition[] = [
  { symbol: 'BTC', name: 'Bitcoin', quantity: 0.45, averageCost: 72400, currentPrice: 84230, marketValue: 37903.50, unrealizedPnl: 5323.50, unrealizedPnlPercent: 16.34, dayChange: 2804.10, dayChangePercent: 7.44, exchange: 'Coinbase' },
  { symbol: 'ETH', name: 'Ethereum', quantity: 4.2, averageCost: 2450, currentPrice: 2180, marketValue: 9156.00, unrealizedPnl: -1134.00, unrealizedPnlPercent: -11.02, dayChange: -672.00, dayChangePercent: -6.84, exchange: 'Coinbase' },
  { symbol: 'SOL', name: 'Solana', quantity: 28, averageCost: 98.50, currentPrice: 138.50, marketValue: 3878.00, unrealizedPnl: 1120.00, unrealizedPnlPercent: 40.61, dayChange: -98.00, dayChangePercent: -2.46, exchange: 'Kraken' },
  { symbol: 'ONDO', name: 'Ondo Finance', quantity: 1500, averageCost: 0.89, currentPrice: 1.34, marketValue: 2010.00, unrealizedPnl: 675.00, unrealizedPnlPercent: 50.56, dayChange: 127.80, dayChangePercent: 6.80, exchange: 'Kraken' },
  { symbol: 'JUP', name: 'Jupiter', quantity: 3200, averageCost: 0.62, currentPrice: 0.892, marketValue: 2854.40, unrealizedPnl: 870.40, unrealizedPnlPercent: 43.87, dayChange: 345.60, dayChangePercent: 12.40, exchange: 'Phantom' },
  { symbol: 'RENDER', name: 'Render', quantity: 420, averageCost: 5.20, currentPrice: 7.42, marketValue: 3116.40, unrealizedPnl: 932.40, unrealizedPnlPercent: 42.69, dayChange: 253.68, dayChangePercent: 8.20, exchange: 'Coinbase' },
  { symbol: 'LINK', name: 'Chainlink', quantity: 180, averageCost: 12.40, currentPrice: 14.80, marketValue: 2664.00, unrealizedPnl: 432.00, unrealizedPnlPercent: 19.35, dayChange: -106.56, dayChangePercent: -3.85, exchange: 'Kraken' },
  { symbol: 'PENDLE', name: 'Pendle', quantity: 800, averageCost: 3.80, currentPrice: 4.62, marketValue: 3696.00, unrealizedPnl: 656.00, unrealizedPnlPercent: 21.58, dayChange: 184.80, dayChangePercent: 5.26, exchange: 'Phantom' },
]

export const DEMO_TRADE_HISTORY = [
  { date: '2026-03-25 14:32', type: 'Buy' as const, symbol: 'BTC', quantity: 0.15, price: 82100, total: 12315, fee: 12.32, exchange: 'Coinbase' },
  { date: '2026-03-24 09:15', type: 'Buy' as const, symbol: 'SOL', quantity: 10, price: 135.20, total: 1352, fee: 1.35, exchange: 'Kraken' },
  { date: '2026-03-23 16:44', type: 'Sell' as const, symbol: 'ETH', quantity: 1.5, price: 2320, total: 3480, fee: 3.48, exchange: 'Coinbase' },
  { date: '2026-03-22 11:20', type: 'Buy' as const, symbol: 'ONDO', quantity: 500, price: 1.18, total: 590, fee: 0.59, exchange: 'Kraken' },
  { date: '2026-03-21 08:05', type: 'Buy' as const, symbol: 'JUP', quantity: 1200, price: 0.78, total: 936, fee: 0.94, exchange: 'Phantom' },
  { date: '2026-03-20 19:30', type: 'Sell' as const, symbol: 'AVAX', quantity: 45, price: 38.50, total: 1732.50, fee: 1.73, exchange: 'Coinbase' },
  { date: '2026-03-19 13:12', type: 'Buy' as const, symbol: 'RENDER', quantity: 200, price: 6.90, total: 1380, fee: 1.38, exchange: 'Coinbase' },
  { date: '2026-03-18 10:45', type: 'Buy' as const, symbol: 'PENDLE', quantity: 400, price: 3.95, total: 1580, fee: 1.58, exchange: 'Phantom' },
  { date: '2026-03-17 15:22', type: 'Sell' as const, symbol: 'DOGE', quantity: 10000, price: 0.142, total: 1420, fee: 1.42, exchange: 'Kraken' },
  { date: '2026-03-16 07:55', type: 'Buy' as const, symbol: 'BTC', quantity: 0.10, price: 79800, total: 7980, fee: 7.98, exchange: 'Coinbase' },
  { date: '2026-03-15 12:30', type: 'Buy' as const, symbol: 'LINK', quantity: 100, price: 13.20, total: 1320, fee: 1.32, exchange: 'Kraken' },
  { date: '2026-03-14 20:18', type: 'Buy' as const, symbol: 'ETH', quantity: 2.0, price: 2280, total: 4560, fee: 4.56, exchange: 'Coinbase' },
]

// Equity curve data points for performance chart
export const DEMO_EQUITY_CURVE = [
  38200, 38900, 37800, 39200, 40100, 39800, 41200, 42500, 41800, 43100,
  42400, 43800, 44200, 43600, 44800, 45200, 44100, 45600, 46000, 45400,
  46100, 46800, 45900, 46423,
]
