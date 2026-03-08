// ══════════════════════════════════════════════════════════════
// CRYPTO ANALYTIX — Mock Data
// Single source of truth. Every component imports from here.
// ══════════════════════════════════════════════════════════════

export const ASSET_COLORS: Record<string, string> = {
  BTC: '#F7931A', ETH: '#627EEA', SOL: '#9945FF', AVAX: '#E84142',
  LINK: '#2A5ADA', DOT: '#E6007A', MATIC: '#8247E5', ADA: '#0033AD',
  DOGE: '#C3A634', XRP: '#23292F', BNB: '#F3BA2F', ATOM: '#2E3148',
  UNI: '#FF007A', AAVE: '#B6509E', ARB: '#28A0F0', OP: '#FF0420',
}

// ── Portfolio ────────────────────────────────────────────────

export interface MockPosition {
  asset: string
  name: string
  quantity: number
  avg_entry_price: number
  current_price: number
  price_change_24h: number
  price_change_7d: number
  unrealized_pnl: number
  unrealized_pnl_pct: number
  allocation_pct: number
  funding_rate: { rate: number; exchange: string }
  volume_24h: number
  pelican_signal: string
}

export const MOCK_POSITIONS: MockPosition[] = [
  { asset: 'BTC', name: 'Bitcoin', quantity: 0.52, avg_entry_price: 78400, current_price: 84230, price_change_24h: 7.44, price_change_7d: 2.1, unrealized_pnl: 3031.60, unrealized_pnl_pct: 7.44, allocation_pct: 66, funding_rate: { rate: 0.0082, exchange: 'Binance' }, volume_24h: 74200000000, pelican_signal: 'Accumulation Zone' },
  { asset: 'ETH', name: 'Ethereum', quantity: 4.2, avg_entry_price: 2340, current_price: 2180, price_change_24h: -6.84, price_change_7d: -3.2, unrealized_pnl: -672, unrealized_pnl_pct: -6.84, allocation_pct: 14, funding_rate: { rate: 0.012, exchange: 'Binance' }, volume_24h: 14500000000, pelican_signal: 'Momentum Breakout' },
  { asset: 'SOL', name: 'Solana', quantity: 48, avg_entry_price: 142, current_price: 138.50, price_change_24h: -2.46, price_change_7d: 1.8, unrealized_pnl: -168, unrealized_pnl_pct: -2.46, allocation_pct: 10, funding_rate: { rate: 0.025, exchange: 'Bybit' }, volume_24h: 1400000000, pelican_signal: 'Distribution' },
  { asset: 'AVAX', name: 'Avalanche', quantity: 95, avg_entry_price: 35.50, current_price: 34.80, price_change_24h: -1.97, price_change_7d: -4.1, unrealized_pnl: -66.50, unrealized_pnl_pct: -1.97, allocation_pct: 5, funding_rate: { rate: -0.003, exchange: 'Binance' }, volume_24h: 310000000, pelican_signal: 'Whale Alert' },
  { asset: 'LINK', name: 'Chainlink', quantity: 180, avg_entry_price: 14.20, current_price: 16.85, price_change_24h: 18.66, price_change_7d: 12.3, unrealized_pnl: 477, unrealized_pnl_pct: 18.66, allocation_pct: 5, funding_rate: { rate: 0.005, exchange: 'Binance' }, volume_24h: 780000000, pelican_signal: 'Smart Money Inflow' },
]

export const MOCK_PORTFOLIO = {
  total_value: 65942.60,
  total_pnl: 2602.10,
  total_pnl_pct: 4.11,
  btc_correlation: 0.78,
  top_performer: { asset: 'LINK', change_24h: 18.66 },
}

// ── Market Overview ──────────────────────────────────────────

export const MOCK_MARKET = {
  fear_greed: 71,
  fear_greed_label: 'Greed',
  eth_btc: 0.0259,
  sectors: [
    { name: 'Layer 1s', change: 2.3 },
    { name: 'DeFi', change: -1.8 },
    { name: 'Layer 2s', change: 5.1 },
    { name: 'AI & Data', change: 8.4 },
  ],
}

// ── Smart Money ──────────────────────────────────────────────

export interface SmartMoneyEntry {
  id: string; time: string; wallet_label: string; archetype: string
  action: string; token: string; amount: string; pelican_commentary: string
}

export const MOCK_SMART_MONEY: SmartMoneyEntry[] = [
  { id: 'sm1', time: '08:58 PM', wallet_label: 'Wintermute', archetype: 'Market Maker', action: 'Accumulated', token: 'UNI', amount: '250k UNI ($1.2M)', pelican_commentary: 'Strategic positioning ahead of v4 launch.' },
  { id: 'sm2', time: '08:53 PM', wallet_label: 'Wintermute', archetype: 'Market Maker', action: 'Accumulated', token: 'BNB', amount: '250k BNB ($15.5M)', pelican_commentary: 'Continued accumulation pattern over 3 weeks.' },
  { id: 'sm3', time: '08:12 PM', wallet_label: 'Jump Trading', archetype: 'Prop Desk', action: 'Transferred', token: 'ETH', amount: '5k ETH ($19.8M) to Binance', pelican_commentary: 'Likely liquidity provision for new pair.' },
  { id: 'sm4', time: '07:31 PM', wallet_label: 'Smart Money Fund', archetype: 'Narrative Surfer', action: 'Sold', token: 'SOL', amount: '$1.8M SOL', pelican_commentary: 'Profit-taking after 340% run. Still holds 40%.' },
  { id: 'sm5', time: '06:15 PM', wallet_label: 'Galaxy Digital', archetype: 'Institutional', action: 'Accumulated', token: 'BTC', amount: '420 BTC ($35.4M)', pelican_commentary: '12th consecutive week of DCA accumulation.' },
]

// ── Signals ──────────────────────────────────────────────────

export const MOCK_ANALYST_POSTS = [
  { id: 'ap1', type: 'analyst' as const, asset: 'BTC', analyst_name: 'Blake Morrow', analyst_color: '#2A5ADA', methodology: 'HARMONIC', direction: 'BULLISH' as const, title: 'BTC Bullish Bat Pattern at $82,400', body: 'Classic bullish bat completion at the 0.886 XA retracement. Entry at $82,400 with tight stop below $80,800. R/R: 2.8:1.', key_levels: { entry: '$82,400', target: '$89,500', stop: '$80,800' }, confidence: 78, timestamp: '2h ago', in_portfolio: true },
  { id: 'ap2', type: 'analyst' as const, asset: 'ETH', analyst_name: 'Grega Horvat', analyst_color: '#9945FF', methodology: 'ELLIOTT WAVE', direction: 'BEARISH' as const, title: 'ETH Wave 4 Correction to $1,950', body: 'Wave 4 corrective structure after impulse wave 3 near $2,400. 0.382 Fib targets $1,950-$2,000.', key_levels: { entry: '$2,150', target: '$1,950', stop: '$2,420' }, confidence: 65, timestamp: '4h ago', in_portfolio: true },
]

export const MOCK_CT_SIGNALS = [
  { id: 'ct1', type: 'ct' as const, asset: 'ETH', author: '@CryptoHayes', original_tweet: '"ETH is cooked below 2.2k. Funding negative, OI dropping, no bid. Next stop 1.8k."', pelican_translation: 'Bearish on ETH below $2,200. Derivatives confirm weak positioning: funding negative, OI declining, limited support. Target: $1,800.', engagement: { likes: 4200, retweets: 890 }, timestamp: '1h ago' },
  { id: 'ct2', type: 'ct' as const, asset: 'SOL', author: '@DegenSpartan', original_tweet: '"SOL funding at 0.025% lmao shorts getting rekt soon. This is the setup."', pelican_translation: 'SOL funding elevated at 0.025% per 8h (~34% annualized). Extremes often precede a squeeze or flush.', engagement: { likes: 2100, retweets: 445 }, timestamp: '3h ago' },
]

export const MOCK_WALLET_SIGNALS = [
  { id: 'ws1', type: 'onchain' as const, asset: 'ETH', wallet_label: 'Accumulation Whale', archetype: 'APEX PREDATOR', action: 'Bought', amount: '$4.2M ETH', timestamp: '51m ago' },
  { id: 'ws2', type: 'onchain' as const, asset: 'SOL', wallet_label: 'Smart Money Fund', archetype: 'NARRATIVE SURFER', action: 'Sold', amount: '$1.8M SOL', timestamp: '2h ago' },
]

export const MOCK_MACRO_SIGNALS = [
  { id: 'mt1', type: 'macro' as const, source: 'ForexAnalytix', analyst: 'Blake Morrow', title: 'DXY Breaking Below 104 Support', body: 'US Dollar breaking below 104. Historically, DXY weakness correlates with crypto strength. Last time BTC rallied 45% over 8 weeks.', affected_assets: ['BTC', 'ETH', 'SOL'], timestamp: '5h ago' },
]

// ── Brief ────────────────────────────────────────────────────

export const MOCK_BRIEF = {
  market_snapshot: { btc_price: 84230, btc_change_24h: 7.44, eth_price: 2180, eth_change_24h: -6.84, total_market_cap: '2.87T', btc_dominance: 58.4 },
  overnight_summary: 'Bitcoin pushed above $84,000 overnight on risk-on sentiment after a weaker CPI print. BTC dominance at 58.4% — capital consolidating into BTC over alts. ETH down 6.8% as funding turned negative. SOL stable despite $400M unlock in 5 days.',
  portfolio_impact: 'Portfolio up 4.1% today. BTC (+7.4%) driving at 66% allocation. ETH dragging at -6.8%. LINK standout at +18.7% on staking expansion news. SOL funding on Bybit at 0.025% per 8h — costing ~$1.66/day carry.',
  key_levels: [
    { asset: 'BTC', level: '$82,000', type: 'support' as const, note: 'Previous breakout level. Must hold.' },
    { asset: 'BTC', level: '$87,500', type: 'resistance' as const, note: 'January highs. Break above triggers $90K+.' },
    { asset: 'ETH', level: '$2,100', type: 'support' as const, note: 'Key support. Below opens $1,950.' },
    { asset: 'SOL', level: '$130', type: 'support' as const, note: 'Critical ahead of token unlock.' },
  ],
  one_thing_to_learn: { topic: 'Funding Rates', content: 'Your SOL position has 0.025% funding per 8h — ~34% annualized carry. Like paying 34% to hold a leveraged futures position. When this elevated, it signals overcrowded longs.' },
}

// ── Calendar ─────────────────────────────────────────────────

export const MOCK_CALENDAR = [
  { id: 'ce1', title: 'ARB Governance Vote — Treasury Allocation', type: 'governance', impact: 'medium' as const, asset: 'ARB', date: '2026-03-12', description: '$50M treasury allocation vote. Governance votes create 5-10% moves.' },
  { id: 'ce2', title: 'ETH Dencun Anniversary', type: 'upgrade', impact: 'low' as const, asset: 'ETH', date: '2026-03-13', description: 'Proto-danksharding anniversary. L2 costs dropped 95%.' },
  { id: 'ce3', title: 'BTC Options Expiry — $4.2B Notional', type: 'expiration', impact: 'high' as const, asset: 'BTC', date: '2026-03-14', description: '$4.2B options expire. Max pain $82,000.' },
  { id: 'ce4', title: 'SOL Token Unlock — $400M', type: 'token_unlock', impact: 'high' as const, asset: 'SOL', date: '2026-03-15', description: '$400M SOL from early investor vesting.' },
  { id: 'ce5', title: 'FOMC Meeting Minutes', type: 'fed_meeting', impact: 'high' as const, asset: 'BTC', date: '2026-03-19', description: 'March FOMC minutes release.' },
  { id: 'ce6', title: 'AAVE V4 Governance', type: 'governance', impact: 'medium' as const, asset: 'AAVE', date: '2026-03-20', description: 'V4 architecture vote.' },
  { id: 'ce7', title: 'ETH Futures Quarterly Expiry', type: 'expiration', impact: 'medium' as const, asset: 'ETH', date: '2026-03-21', description: 'CME quarterly expiry.' },
  { id: 'ce8', title: 'BTC Halving — 180 Days', type: 'halving', impact: 'low' as const, asset: 'BTC', date: '2026-03-25', description: '180 days to next halving.' },
]

export const EVENT_COLORS: Record<string, string> = {
  token_unlock: '#9945FF', governance: '#1DA1C4', fed_meeting: '#F59E0B',
  earnings: '#2A5ADA', expiration: '#EF4444', halving: '#F7931A', upgrade: '#22C55E',
}

// ── Education ────────────────────────────────────────────────

export const MOCK_EDUCATION = [
  { slug: 'spot-vs-futures', title: 'Spot vs Futures in Crypto', category: 'fundamentals', minutes: 4, tradfi: 'Buying AAPL shares vs trading ES futures' },
  { slug: 'perpetual-swaps', title: 'Perpetual Swaps: Never-Expiring Futures', category: 'derivatives', minutes: 5, tradfi: 'ES futures that auto-roll every 8 hours' },
  { slug: 'funding-rates', title: 'Funding Rates Explained', category: 'derivatives', minutes: 6, tradfi: 'Overnight repo rate, settled 3x daily' },
  { slug: 'custody', title: 'Crypto Custody', category: 'risk', minutes: 5, tradfi: 'Custody vs holding physical gold' },
  { slug: 'exchange-risk', title: 'Exchange Risk', category: 'risk', minutes: 5, tradfi: 'MF Global. Same concept.' },
  { slug: '24-7-trading', title: '24/7 Markets', category: 'fundamentals', minutes: 4, tradfi: 'No gaps, but funding compounds 3x daily' },
  { slug: 'token-selection', title: 'Picking Tokens', category: 'strategy', minutes: 7, tradfi: 'Equity analysis but the company is a protocol' },
]

// ── Formatting Helpers ───────────────────────────────────────

export function formatCompact(n: number): string {
  if (n >= 1e12) return `${(n / 1e12).toFixed(1)}T`
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`
  return `${n.toFixed(0)}`
}

export function formatUSD(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
}

export function formatPct(n: number, sign = true): string {
  const s = sign && n > 0 ? '+' : ''
  return `${s}${n.toFixed(2)}%`
}

export function formatPnl(n: number): string {
  const sign = n >= 0 ? '+' : '\u2212' // proper minus sign
  return `${sign}${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
