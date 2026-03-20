// ══════════════════════════════════════════════════════════════
// TOKEN ANALYTIX — Mock Data
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
  { slug: 'spot-vs-futures', title: 'Spot vs Futures in Crypto', category: 'fundamentals', minutes: 4, tradfi: 'Buying BTC spot vs trading BTC-PERP futures' },
  { slug: 'perpetual-swaps', title: 'Perpetual Swaps: Never-Expiring Futures', category: 'derivatives', minutes: 5, tradfi: 'ES futures that auto-roll every 8 hours' },
  { slug: 'funding-rates', title: 'Funding Rates Explained', category: 'derivatives', minutes: 6, tradfi: 'Overnight repo rate, settled 3x daily' },
  { slug: 'custody', title: 'Crypto Custody', category: 'risk', minutes: 5, tradfi: 'Custody vs holding physical gold' },
  { slug: 'exchange-risk', title: 'Exchange Risk', category: 'risk', minutes: 5, tradfi: 'MF Global. Same concept.' },
  { slug: '24-7-trading', title: '24/7 Markets', category: 'fundamentals', minutes: 4, tradfi: 'No gaps, but funding compounds 3x daily' },
  { slug: 'token-selection', title: 'Picking Tokens', category: 'strategy', minutes: 7, tradfi: 'Equity analysis but the company is a protocol' },
]

// ── Formatting Helpers ───────────────────────────────────────

export function formatCompact(n: number | null | undefined): string {
  if (n == null || isNaN(n)) return '--'
  if (n >= 1e12) return `${(n / 1e12).toFixed(1)}T`
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`
  return `${n.toFixed(0)}`
}

export function formatUSD(n: number | null | undefined): string {
  if (n == null || isNaN(n)) return '$--'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
}

export function formatPct(n: number | null | undefined, sign = true): string {
  if (n == null || isNaN(n)) return '--%'
  const s = sign && n > 0 ? '+' : ''
  return `${s}${n.toFixed(2)}%`
}

export function formatPnl(n: number | null | undefined): string {
  if (n == null || isNaN(n)) return '$--'
  if (Object.is(n, -0)) n = 0
  const sign = n >= 0 ? '+' : '\u2212' // proper minus sign
  return `${sign}${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// ══════════════════════════════════════════════════════════════
// TOKEN INTELLIGENCE — Per-token deep dive data
// ══════════════════════════════════════════════════════════════

export interface TokenIntelData {
  symbol: string
  name: string
  // Price Action
  price: number
  price_change_24h: number
  price_change_7d: number
  price_change_30d: number
  market_cap: number
  fdv: number
  volume_24h: number
  vol_mcap_ratio: number
  ath: number
  ath_date: string
  sparkline_7d: number[] // 168 points (hourly for 7d)
  // Derivatives
  funding_rate: number
  funding_annualized: number
  open_interest: number
  oi_change_24h: number
  long_short_ratio: number
  liquidations_24h: { longs: number; shorts: number }
  // On-Chain & Risk
  top_10_holders_pct: number
  holder_count: number
  active_addresses_7d: number
  active_addresses_change: number
  smart_money_flow_7d: number
  exchange_netflow_7d: number
  next_unlock: { days: number; pct_supply: number; recipient: string } | null
  tvl: number | null
  tvl_change_30d: number | null
  // Risk Score
  risk_score: number // 1-10 (1 = safest, 10 = extreme risk)
  risk_factors: string[]
  // Pelican Synthesis
  pelican_synthesis: string
  pelican_verdict: 'BULLISH' | 'BEARISH' | 'NEUTRAL' | 'CAUTION'
  pelican_confidence: number
  pelican_checked_at: string
  pelican_sources: string[]
}

export const MOCK_TOKEN_INTEL: Record<string, TokenIntelData> = {
  BTC: {
    symbol: 'BTC', name: 'Bitcoin',
    price: 84230, price_change_24h: 7.44, price_change_7d: 2.1, price_change_30d: 14.8,
    market_cap: 1660000000000, fdv: 1770000000000, volume_24h: 74200000000, vol_mcap_ratio: 0.045,
    ath: 108000, ath_date: '2025-12-17',
    sparkline_7d: Array.from({ length: 168 }, (_, i) => 81000 + Math.sin(i / 12) * 2000 + (i / 168) * 3000 + (Math.random() - 0.5) * 800),
    funding_rate: 0.0082, funding_annualized: 10.72, open_interest: 18400000000, oi_change_24h: 15.4,
    long_short_ratio: 1.24, liquidations_24h: { longs: 45000000, shorts: 120000000 },
    top_10_holders_pct: 5.8, holder_count: 54200000, active_addresses_7d: 890000, active_addresses_change: 12.4,
    smart_money_flow_7d: 142000000, exchange_netflow_7d: -340000000,
    next_unlock: null, tvl: null, tvl_change_30d: null,
    risk_score: 3, risk_factors: ['Whale concentration in top 100 wallets rising', 'Options max pain at $82,000 Friday'],
    pelican_synthesis: 'BTC is grinding higher in a low-volatility regime with funding reset to baseline after the $120M short squeeze overnight. Dominance at 58.4% signals capital consolidation — alts are bleeding into BTC. Exchange outflows of $340M this week suggest conviction buying, not speculation. Risk: $4.2B options expiry Friday with max pain at $82K could create a gravity pull. Smart money is net long but positioning is getting crowded — long/short ratio at 1.24 is elevated. Hold existing longs, but size new entries small until post-expiry clarity.',
    pelican_verdict: 'BULLISH', pelican_confidence: 82,
    pelican_checked_at: '2 min ago',
    pelican_sources: ['CoinGecko (price)', 'Coinalyze (derivatives)', 'Arkham (whale flows)', 'Dune (exchange netflow)', 'DeFiLlama (N/A for BTC)'],
  },
  ETH: {
    symbol: 'ETH', name: 'Ethereum',
    price: 2180, price_change_24h: -6.84, price_change_7d: -3.2, price_change_30d: -11.2,
    market_cap: 262000000000, fdv: 262000000000, volume_24h: 14500000000, vol_mcap_ratio: 0.055,
    ath: 4878, ath_date: '2024-11-10',
    sparkline_7d: Array.from({ length: 168 }, (_, i) => 2350 - Math.sin(i / 15) * 80 - (i / 168) * 170 + (Math.random() - 0.5) * 40),
    funding_rate: -0.0045, funding_annualized: -5.84, open_interest: 8900000000, oi_change_24h: -8.2,
    long_short_ratio: 0.87, liquidations_24h: { longs: 89000000, shorts: 23000000 },
    top_10_holders_pct: 34.2, holder_count: 122000000, active_addresses_7d: 420000, active_addresses_change: -6.8,
    smart_money_flow_7d: -52000000, exchange_netflow_7d: 180000000,
    next_unlock: null, tvl: 52000000000, tvl_change_30d: -8.4,
    risk_score: 6, risk_factors: ['Negative funding — bears in control', 'Smart money selling $52M this week', 'ETH/BTC ratio at multi-year low', 'Exchange inflows suggest distribution'],
    pelican_synthesis: 'ETH is in trouble. Funding flipped negative (-0.0045), OI dropping 8.2%, and smart money wallets are net sellers of $52M this week. The ETH/BTC ratio at 0.0259 is a multi-year low — capital is actively rotating out of ETH into BTC and altcoins. Exchange inflows of $180M signal distribution, not accumulation. TVL on Ethereum is down 8.4% in 30 days as protocols bleed users to Solana and L2s. The $2,100 level is critical support — below that opens $1,950 which was the Grega Horvat Elliott Wave 4 target. Not a buy here. Wait for funding to reset and smart money to stop selling.',
    pelican_verdict: 'BEARISH', pelican_confidence: 74,
    pelican_checked_at: '5 min ago',
    pelican_sources: ['CoinGecko (price)', 'Coinalyze (derivatives)', 'Arkham (smart money)', 'DeFiLlama (TVL)', 'Dune (exchange flow)'],
  },
  SOL: {
    symbol: 'SOL', name: 'Solana',
    price: 138.50, price_change_24h: -2.46, price_change_7d: 1.8, price_change_30d: 22.5,
    market_cap: 64600000000, fdv: 80200000000, volume_24h: 1400000000, vol_mcap_ratio: 0.022,
    ath: 264, ath_date: '2025-01-19',
    sparkline_7d: Array.from({ length: 168 }, (_, i) => 133 + Math.sin(i / 20) * 4 + (i / 168) * 5 + (Math.random() - 0.5) * 3),
    funding_rate: 0.025, funding_annualized: 32.85, open_interest: 3200000000, oi_change_24h: 4.8,
    long_short_ratio: 1.58, liquidations_24h: { longs: 12000000, shorts: 34000000 },
    top_10_holders_pct: 28.4, holder_count: 8900000, active_addresses_7d: 1850000, active_addresses_change: 18.2,
    smart_money_flow_7d: -18000000, exchange_netflow_7d: 42000000,
    next_unlock: { days: 5, pct_supply: 2.8, recipient: 'Early investors' },
    tvl: 8200000000, tvl_change_30d: 15.4,
    risk_score: 7, risk_factors: ['Funding rate 0.025% — 33% annualized carry cost', 'Token unlock in 5 days (2.8% supply)', 'Long/short ratio 1.58 — overcrowded longs', 'Smart money net selling despite price stability'],
    pelican_synthesis: 'SOL is a ticking time bomb wrapped in good fundamentals. On-chain metrics are strong — 1.85M active addresses (up 18%), TVL growing 15% monthly, ecosystem thriving. But the derivatives setup is dangerous: funding at 0.025% per 8h costs 33% annualized to hold longs. That means overcrowded longs paying through the nose. Long/short ratio at 1.58 confirms this. Add a $400M token unlock in 5 days from early investors who are sitting on 50x+ gains, and you have a recipe for a short-term flush even if the longer-term thesis is intact. If you are long, hedge or reduce before the unlock. If looking to enter, wait for the unlock dump — historically SOL drops 12-18% around large unlocks then recovers within 2 weeks.',
    pelican_verdict: 'CAUTION', pelican_confidence: 71,
    pelican_checked_at: '3 min ago',
    pelican_sources: ['CoinGecko (price)', 'Coinalyze (derivatives)', 'Helius (on-chain)', 'DeFiLlama (TVL)', 'TokenUnlocks (vesting)'],
  },
  AAVE: {
    symbol: 'AAVE', name: 'Aave',
    price: 287.42, price_change_24h: 3.2, price_change_7d: -1.8, price_change_30d: 8.6,
    market_cap: 4300000000, fdv: 4600000000, volume_24h: 420000000, vol_mcap_ratio: 0.098,
    ath: 665, ath_date: '2024-12-02',
    sparkline_7d: Array.from({ length: 168 }, (_, i) => 282 + Math.sin(i / 18) * 6 + (Math.random() - 0.5) * 4),
    funding_rate: 0.003, funding_annualized: 3.94, open_interest: 280000000, oi_change_24h: 2.1,
    long_short_ratio: 1.08, liquidations_24h: { longs: 1200000, shorts: 800000 },
    top_10_holders_pct: 61, holder_count: 185000, active_addresses_7d: 12400, active_addresses_change: 4.2,
    smart_money_flow_7d: 8400000, exchange_netflow_7d: -14000000,
    next_unlock: { days: 18, pct_supply: 2.1, recipient: 'Ecosystem fund' },
    tvl: 12800000000, tvl_change_30d: 34,
    risk_score: 5, risk_factors: ['Top 10 holders own 61% (normal for governance tokens)', 'TVL up 34% but check if organic or incentivized', 'Unlock in 18 days — ecosystem fund, low dump risk'],
    pelican_synthesis: 'AAVE is the poster child for "looks good, verify the details." TVL up 34% this month sounds great until you dig in — 72% of new deposits came from 3 wallets recycling liquidity between Aave markets on different chains. Real organic growth is closer to 9%. Still solid, just not the headline number. Top 10 holders at 61% is normal for a governance token (treasury + team + early VCs). Utilization rate above 80% on USDC and USDT pools — this spikes borrow rates and attracts more deposits, creating a positive loop. Upcoming unlock in 18 days is ecosystem fund, historically low sell pressure. Smart money accumulating $8.4M this week. Moderate buy — the V4 governance vote could be a catalyst.',
    pelican_verdict: 'BULLISH', pelican_confidence: 68,
    pelican_checked_at: '8 min ago',
    pelican_sources: ['CoinGecko (price)', 'DeFiLlama (TVL)', 'Moralis (holders)', 'Arkham (smart money)', 'TokenUnlocks (vesting)'],
  },
  WIF: {
    symbol: 'WIF', name: 'dogwifhat',
    price: 0.82, price_change_24h: -12.4, price_change_7d: -28.6, price_change_30d: -45.2,
    market_cap: 820000000, fdv: 820000000, volume_24h: 680000000, vol_mcap_ratio: 0.829,
    ath: 4.83, ath_date: '2024-03-31',
    sparkline_7d: Array.from({ length: 168 }, (_, i) => 1.15 - (i / 168) * 0.33 + (Math.random() - 0.5) * 0.08),
    funding_rate: 0.045, funding_annualized: 59.13, open_interest: 420000000, oi_change_24h: 22.8,
    long_short_ratio: 2.14, liquidations_24h: { longs: 34000000, shorts: 5000000 },
    top_10_holders_pct: 42, holder_count: 145000, active_addresses_7d: 28000, active_addresses_change: -32.4,
    smart_money_flow_7d: -45000000, exchange_netflow_7d: 62000000,
    next_unlock: null, tvl: null, tvl_change_30d: null,
    risk_score: 9, risk_factors: ['Funding rate 0.045% — 59% annualized carry', 'Long/short ratio 2.14 — extreme overcrowding', 'Volume/MCap ratio 0.83 — mostly speculation', 'Smart money dumping $45M', 'Active addresses down 32%', 'Exchange inflows $62M — heavy distribution'],
    pelican_synthesis: 'WIF is a dumpster fire with a cute dog on it. Funding at 0.045% per 8h means longs are paying 59% annualized to hold — that is financial self-harm. Long/short ratio at 2.14 means degens are piled in long while smart money dumps $45M worth. Active addresses cratering 32% tells you retail is leaving. Exchange inflows of $62M scream "everyone is trying to sell." The vol/mcap ratio of 0.83 means this token trades its entire market cap in volume nearly daily — it is pure speculation, no fundamental value. The only question is when, not if, the liquidation cascade hits. At current OI levels, a 15% drop triggers $60M+ in long liquidations which cascade into more selling. Do not touch this. If you are long, exit now.',
    pelican_verdict: 'BEARISH', pelican_confidence: 91,
    pelican_checked_at: '1 min ago',
    pelican_sources: ['CoinGecko (price)', 'Coinalyze (derivatives)', 'Helius (on-chain)', 'Arkham (smart money)'],
  },
}

// Helper to search tokens
export function searchTokenIntel(query: string): TokenIntelData | null {
  const q = query.toUpperCase().replace(/\s/g, '')
  return MOCK_TOKEN_INTEL[q] || null
}

// Available tickers for search autocomplete
export const AVAILABLE_TICKERS = Object.keys(MOCK_TOKEN_INTEL).map(k => ({
  symbol: k,
  name: MOCK_TOKEN_INTEL[k]!.name,
}))

// ════════════════════════════════════════════════════════════
// SECTOR ROTATION DATA
// ════════════════════════════════════════════════════════════

export interface SectorData {
  id: string
  name: string
  velocity: number        // rate of change score, negative = cooling
  volume: number          // aggregate 24h volume
  volume_change_7d: number // % change vs prior week
  smart_money_flow: number // net $ flow from labeled wallets
  market_cap: number
  mcap_change_7d: number
  top_tokens: { symbol: string; change_7d: number }[]
  sparkline_7d: number[]  // 7 data points (daily)
  status: 'heating_up' | 'stealth_accumulation' | 'stable' | 'cooling_down'
}

export const MOCK_SECTORS: SectorData[] = [
  {
    id: 'gamefi', name: 'GameFi', velocity: 4.1,
    volume: 600000000, volume_change_7d: 45,
    smart_money_flow: 110000000, market_cap: 12000000000, mcap_change_7d: 18.4,
    top_tokens: [{ symbol: 'GALA', change_7d: 34.2 }, { symbol: 'IMX', change_7d: 22.8 }, { symbol: 'RON', change_7d: 28.1 }],
    sparkline_7d: [100, 105, 108, 115, 122, 130, 141],
    status: 'heating_up',
  },
  {
    id: 'ai', name: 'AI / Compute', velocity: 3.8,
    volume: 4200000000, volume_change_7d: 38,
    smart_money_flow: 142000000, market_cap: 42000000000, mcap_change_7d: 15.2,
    top_tokens: [{ symbol: 'TAO', change_7d: 28.4 }, { symbol: 'RNDR', change_7d: 18.9 }, { symbol: 'AKT', change_7d: 32.1 }],
    sparkline_7d: [100, 103, 107, 112, 118, 125, 132],
    status: 'heating_up',
  },
  {
    id: 'rwa', name: 'RWA', velocity: 3.9,
    volume: 2400000000, volume_change_7d: 68,
    smart_money_flow: 890000000, market_cap: 24000000000, mcap_change_7d: 18.4,
    top_tokens: [{ symbol: 'ONDO', change_7d: 22.4 }, { symbol: 'CFG', change_7d: 34.8 }, { symbol: 'MPL', change_7d: 28.2 }, { symbol: 'LINK', change_7d: 14.6 }],
    sparkline_7d: [100, 108, 118, 126, 132, 138, 148],
    status: 'heating_up',
  },
  {
    id: 'depin', name: 'DePIN', velocity: 1.8,
    volume: 400000000, volume_change_7d: 15,
    smart_money_flow: 25000000, market_cap: 8500000000, mcap_change_7d: 6.2,
    top_tokens: [{ symbol: 'HNT', change_7d: 8.2 }, { symbol: 'MOBILE', change_7d: 14.5 }, { symbol: 'FIL', change_7d: 3.8 }],
    sparkline_7d: [100, 99, 101, 103, 105, 107, 108],
    status: 'stealth_accumulation',
  },
  {
    id: 'defi', name: 'DeFi Bluechips', velocity: 1.2,
    volume: 2100000000, volume_change_7d: 8,
    smart_money_flow: 45000000, market_cap: 38000000000, mcap_change_7d: 3.4,
    top_tokens: [{ symbol: 'UNI', change_7d: 4.2 }, { symbol: 'AAVE', change_7d: -1.8 }, { symbol: 'MKR', change_7d: 5.2 }],
    sparkline_7d: [100, 100, 101, 101, 102, 102, 103],
    status: 'stable',
  },
  {
    id: 'restaking', name: 'Restaking', velocity: 0.5,
    volume: 1200000000, volume_change_7d: -5,
    smart_money_flow: 12000000, market_cap: 14000000000, mcap_change_7d: 1.2,
    top_tokens: [{ symbol: 'EIGEN', change_7d: -2.4 }, { symbol: 'ETHFI', change_7d: 1.8 }, { symbol: 'REZ', change_7d: -4.2 }],
    sparkline_7d: [100, 101, 100, 99, 100, 100, 101],
    status: 'stable',
  },
  {
    id: 'l2', name: 'L2 / L3 Scaling', velocity: -1.8,
    volume: 1800000000, volume_change_7d: -18,
    smart_money_flow: -85000000, market_cap: 28000000000, mcap_change_7d: -6.8,
    top_tokens: [{ symbol: 'ARB', change_7d: -8.4 }, { symbol: 'OP', change_7d: -5.2 }, { symbol: 'STRK', change_7d: -12.8 }],
    sparkline_7d: [100, 98, 96, 95, 94, 93, 92],
    status: 'cooling_down',
  },
  {
    id: 'meme', name: 'Memecoins', velocity: -2.4,
    volume: 8100000000, volume_change_7d: -32,
    smart_money_flow: -310000000, market_cap: 62000000000, mcap_change_7d: -14.2,
    top_tokens: [{ symbol: 'DOGE', change_7d: -8.8 }, { symbol: 'WIF', change_7d: -28.6 }, { symbol: 'PEPE', change_7d: -18.4 }],
    sparkline_7d: [100, 95, 92, 88, 85, 83, 80],
    status: 'cooling_down',
  },
]

export const SECTOR_STATUS_CONFIG: Record<string, { color: string; glow: string; label: string }> = {
  heating_up: { color: '#22C55E', glow: 'rgba(34,197,94,0.15)', label: 'Heating Up' },
  stealth_accumulation: { color: '#1DA1C4', glow: 'rgba(29,161,196,0.12)', label: 'Stealth Accumulation' },
  stable: { color: '#6B7280', glow: 'transparent', label: 'Stable / Chop' },
  cooling_down: { color: '#EF4444', glow: 'rgba(239,68,68,0.12)', label: 'Cooling Down' },
}

export const MOCK_ROTATION_BRIEFING = {
  headline: 'Capital is rotating out of Memecoins and L2s into AI / Compute, GameFi, and RWA — institutional money is pouring into tokenized treasuries.',
  body: 'GameFi is showing the highest "stealth" velocity. Price action is muted, but smart money inflows have spiked 300% this week. Whales are front-running an upcoming narrative shift — likely tied to the GDC gaming conference announcements next week. AI / Compute continues its 3-week accumulation trend with TAO and AKT leading. L2 tokens seeing consistent smart money outflows as the "L2 summer" narrative fades. Memecoins in full retreat: $310M in smart money exits, volume down 32%, and funding rates on WIF/PEPE still dangerously elevated despite the selloff. RWA is the stealth winner this cycle — BlackRock BUIDL just crossed $1.7B, and institutional smart money inflows hit $890M this week. This isn\'t retail speculation; it\'s TradFi infrastructure being built on-chain. ONDO, CFG, and MPL are the plays.',
  flows: [
    { from: 'Memecoins', to: 'AI / Compute', amount: 142000000 },
    { from: 'L2 / L3 Scaling', to: 'GameFi', amount: 85000000 },
    { from: 'Memecoins', to: 'RWA', amount: 64000000 },
    { from: 'L2 / L3 Scaling', to: 'RWA', amount: 120000000 },
  ],
}

// ══════════════════════════════════════════════════════════════
// WALLET DNA & INTELLIGENCE
// ══════════════════════════════════════════════════════════════

export interface WalletDNAData {
  address: string
  label: string | null
  archetype: string
  archetype_description: string
  radar: { axis: string; value: number }[]
  total_transactions: number
  chains_active: number
  first_seen: string
  avg_hold_days: number
  sharpe_ratio: number
  win_rate: number
  total_pnl: number
  mev_losses: {
    total_90d: number
    incidents: number
    worst_trade: { token: string; loss: number; date: string }
    recommendation: string
  }
  airdrops: {
    protocol: string
    status: 'likely_qualified' | 'partially_qualified' | 'not_qualified'
    checklist: { item: string; done: boolean }[]
    estimated_value: string | null
  }[]
  holdings: { token: string; value: number; pct: number }[]
  pelican_narrative: string
}

export const MOCK_WALLET_DNA: Record<string, WalletDNAData> = {
  '0x7a3...apex': {
    address: '0x7a3b4c8d9e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b',
    label: 'Accumulation Whale',
    archetype: 'Apex Predator',
    archetype_description: 'Consistently early to tokens that 5-10x. High hit rate, short hold times. This wallet identifies undervalued assets before the crowd and exits near peaks.',
    radar: [
      { axis: 'Risk', value: 85 }, { axis: 'Yield', value: 62 },
      { axis: 'Frequency', value: 78 }, { axis: 'Diversity', value: 45 },
      { axis: 'Holding', value: 30 }, { axis: 'Activity', value: 90 },
    ],
    total_transactions: 847, chains_active: 3, first_seen: '2022-04-12',
    avg_hold_days: 14.2, sharpe_ratio: 2.94, win_rate: 78, total_pnl: 2840000,
    mev_losses: {
      total_90d: 847, incidents: 12,
      worst_trade: { token: 'PEPE', loss: 234, date: '2026-03-03' },
      recommendation: 'Use Flashbots Protect RPC for Ethereum swaps. 73% of your MEV losses came from swaps under $5,000 — for small swaps, use a private mempool aggregator like MEV Blocker.',
    },
    airdrops: [
      { protocol: 'LayerZero V2', status: 'likely_qualified', checklist: [
        { item: '10+ cross-chain transactions', done: true },
        { item: 'Used 3+ source chains', done: true },
        { item: 'Volume > $10,000', done: true },
        { item: 'Active in last 30 days', done: true },
      ], estimated_value: '$1,200-$4,800' },
      { protocol: 'Scroll', status: 'partially_qualified', checklist: [
        { item: 'Bridged to Scroll', done: true },
        { item: '5+ transactions on Scroll', done: true },
        { item: 'Used 3+ dApps', done: false },
        { item: 'Provided liquidity', done: false },
      ], estimated_value: '$400-$1,500' },
      { protocol: 'Berachain', status: 'not_qualified', checklist: [
        { item: 'Participated in testnet', done: false },
        { item: 'Deposited to vaults', done: false },
        { item: 'Governance participation', done: false },
      ], estimated_value: null },
    ],
    holdings: [
      { token: 'ETH', value: 1240000, pct: 38 },
      { token: 'BTC', value: 890000, pct: 27 },
      { token: 'SOL', value: 420000, pct: 13 },
      { token: 'LINK', value: 340000, pct: 10 },
      { token: 'Others', value: 390000, pct: 12 },
    ],
    pelican_narrative: 'This wallet has an Apex Predator profile — it entered 23 tokens in the last 6 months, 17 of which did 3x+ within 30 days of entry. The pattern is consistent: accumulate during low-volume periods, exit within 2 weeks of significant price appreciation. Currently holding concentrated positions in ETH and BTC with a SOL allocation that was added 11 days ago — given the upcoming unlock, this is either a hedge or a short-term momentum play. MEV exposure is minimal ($847 in 90 days) but could be reduced further with a private RPC. Airdrop positioning is strong for LayerZero V2.',
  },
}

export const FEATURED_WALLETS = [
  { label: 'Top Smart Money Wallet This Week', address: '0x7a3...apex', archetype: 'Apex Predator', stat: '78% win rate' },
  { label: 'Biggest MEV Victim (30d)', address: '0xmev...demo', archetype: 'Degen Gambler', stat: '$12,400 lost' },
  { label: 'Most Active Airdrop Farmer', address: '0xfarm...demo', archetype: 'Airdrop Farmer', stat: '23 protocols' },
  { label: 'Diamond Hands Champion', address: '0xhold...demo', archetype: 'Diamond Hands', stat: '847 day avg hold' },
]

// ══════════════════════════════════════════════════════════════
// KNOWLEDGE BASE — Protocol reference schema
// ══════════════════════════════════════════════════════════════

export interface ProtocolEntry {
  id: string
  name: string
  category: string
  mechanics: string
  critical_risks: string
  data_quirks: string
  last_updated: string
}

export const PROTOCOL_CATEGORIES = ['All', 'Lending', 'DEX', 'LSD', 'Restaking', 'Yield/Deriv', 'Perp DEX', 'Stable/Yield', 'Bridge', 'L2', 'Oracle', 'Compute', 'NFT', 'Tokenized Assets'] as const

export const CATEGORY_COLORS: Record<string, string> = {
  Lending: '#1DA1C4', DEX: '#A78BFA', LSD: '#F59E0B', Restaking: '#22C55E',
  'Yield/Deriv': '#EC4899', 'Perp DEX': '#EF4444', 'Stable/Yield': '#6366F1',
  Bridge: '#F97316', L2: '#06B6D4', Oracle: '#8B5CF6', Compute: '#14B8A6', NFT: '#E879F9',
  'Tokenized Assets': '#14B8A6',
}

export const MOCK_KNOWLEDGE_BASE: ProtocolEntry[] = [
  { id: 'aave', name: 'Aave', category: 'Lending', mechanics: 'Over-collateralized lending. AAVE is governance/backstop.', critical_risks: 'Bad debt from oracle failure; illiquid collateral loops.', data_quirks: 'Utilization rate >90% spikes borrow rates; watch for whale liquidation walls.', last_updated: '2026-03-06' },
  { id: 'uniswap', name: 'Uniswap', category: 'DEX', mechanics: 'AMM (V3 concentrated). UNI is purely governance.', critical_risks: 'Regulatory (SEC), fee-switch governance gridlock.', data_quirks: 'V3 volume/TVL ratio is massive compared to V2. High TVL isn\'t needed for high volume.', last_updated: '2026-03-05' },
  { id: 'lido', name: 'Lido', category: 'LSD', mechanics: 'Liquid staking ETH. LDO governs node operators.', critical_risks: 'Smart contract risk; slashing; centralization heat.', data_quirks: 'TVL is strictly tied to ETH price. Track net new ETH staked, not USD TVL.', last_updated: '2026-03-07' },
  { id: 'eigenlayer', name: 'EigenLayer', category: 'Restaking', mechanics: 'Re-uses staked ETH to secure AVSs.', critical_risks: 'Cascading slashing risks across multiple AVSs.', data_quirks: 'TVL cap raises cause artificial spikes. Look at active AVS utilization.', last_updated: '2026-03-04' },
  { id: 'pendle', name: 'Pendle', category: 'Yield/Deriv', mechanics: 'Splits yield into PT/YT. PENDLE captures fees.', critical_risks: 'Complex math pricing errors; underlying protocol failure.', data_quirks: 'APY spikes attract mercenary capital. Watch PT vs YT ratios for market sentiment.', last_updated: '2026-03-06' },
  { id: 'gmx', name: 'GMX', category: 'Perp DEX', mechanics: 'GLP/GM pool acts as counterparty. GMX = gov/fee share.', critical_risks: 'Toxic flow (traders winning too much drains the pool).', data_quirks: 'High volume is good, but if traders are consistently winning, LP yields go negative.', last_updated: '2026-03-05' },
  { id: 'ethena', name: 'Ethena', category: 'Stable/Yield', mechanics: 'Delta-neutral synthetic dollar (USDe).', critical_risks: 'Funding rates going negative for extended periods.', data_quirks: 'If funding flips negative, the protocol bleeds money to maintain the peg. High risk.', last_updated: '2026-03-07' },
  { id: 'hyperliquid', name: 'Hyperliquid', category: 'Perp DEX', mechanics: 'L1 Appchain for orderbooks.', critical_risks: 'Bridge risk; centralization of sequencers.', data_quirks: 'Organic volume leader; no token yet, track points/volume.', last_updated: '2026-03-07' },
  { id: 'jupiter', name: 'Jupiter', category: 'DEX', mechanics: 'Solana DEX aggregator + perps. JUP is governance.', critical_risks: 'Solana congestion affects execution; competition from Raydium.', data_quirks: 'Volume spikes don\'t always mean organic — check unique wallets vs total volume.', last_updated: '2026-03-06' },
  { id: 'morpho', name: 'Morpho', category: 'Lending', mechanics: 'Peer-to-peer lending matching on top of Aave/Compound.', critical_risks: 'Smart contract composability risk (protocol on protocol).', data_quirks: 'Match rate is the key metric — unmatched deposits earn base Aave rates.', last_updated: '2026-03-05' },
  { id: 'layerzero', name: 'LayerZero', category: 'Bridge', mechanics: 'Cross-chain messaging protocol. Powers OFT tokens.', critical_risks: 'Oracle/relayer collusion; bridge exploits.', data_quirks: 'Message count is vanity — track unique senders and value bridged.', last_updated: '2026-03-04' },
  { id: 'arbitrum', name: 'Arbitrum', category: 'L2', mechanics: 'Optimistic rollup. ARB is governance token.', critical_risks: 'Centralized sequencer; governance treasury raids.', data_quirks: 'TVL includes bridged assets — track native dApp TVL separately.', last_updated: '2026-03-06' },
  { id: 'chainlink', name: 'Chainlink', category: 'Oracle', mechanics: 'Decentralized oracle network. LINK is node payment.', critical_risks: 'Single point of failure for DeFi pricing.', data_quirks: 'Revenue from feeds is tiny vs token valuation. Track integration count growth.', last_updated: '2026-03-05' },
  { id: 'render', name: 'Render', category: 'Compute', mechanics: 'Decentralized GPU rendering. RNDR pays for compute.', critical_risks: 'Compute demand is speculative; competition from centralized cloud.', data_quirks: 'Track active jobs and GPU utilization, not just token price.', last_updated: '2026-03-04' },
  { id: 'blur', name: 'Blur', category: 'NFT', mechanics: 'NFT marketplace with lending via Blend.', critical_risks: 'NFT volume is cyclical and speculative.', data_quirks: 'Wash trading inflates volume. Track unique buyers, not total volume.', last_updated: '2026-03-03' },
  { id: 'buidl', name: 'BlackRock BUIDL', category: 'Tokenized Assets', mechanics: 'Tokenized US Treasury fund on Ethereum via Securitize. Institutional-only ($5M min). BUIDL tokens represent shares in a fund holding short-term Treasuries.', critical_risks: 'Counterparty risk (BlackRock/Securitize), regulatory reclassification, smart contract risk on Securitize platform.', data_quirks: 'TVL spikes correlate with Treasury yield changes. Track AUM growth rate, not absolute TVL — institutional adoption velocity matters more.', last_updated: '2026-03-18' },
  { id: 'usdy', name: 'Ondo USDY', category: 'Tokenized Assets', mechanics: 'Tokenized note backed by US Treasuries and bank deposits. Yield-bearing stablecoin alternative. Available on multiple chains via LayerZero.', critical_risks: 'Regulatory uncertainty on yield-bearing tokens, redemption delays, Ondo counterparty risk.', data_quirks: 'Cross-chain deployment inflates apparent TVL. Track net new mints on Ethereum mainnet for real demand signal.', last_updated: '2026-03-17' },
  { id: 'paxg', name: 'Paxos Gold (PAXG)', category: 'Tokenized Assets', mechanics: 'Each PAXG = 1 troy oz of London Good Delivery gold held in Brink\'s vaults. Fully redeemable. Regulated by NYDFS.', critical_risks: 'Gold price volatility, regulatory changes, custodial risk at Brink\'s.', data_quirks: 'Premium/discount to spot gold is the key metric. During crypto crashes, PAXG often trades at 1-3% premium as flight-to-safety.', last_updated: '2026-03-16' },
  { id: 'maple-kb', name: 'Maple Finance', category: 'Tokenized Assets', mechanics: 'Institutional lending protocol. Pool delegates underwrite loans to crypto-native institutions. MPL token governs and captures fees.', critical_risks: 'Credit risk on borrowers (learned the hard way in 2022 with Orthogonal Trading default). Under-collateralized by design.', data_quirks: 'Default rate is THE metric. Post-2022 restructuring focused on over-collateralized pools. Track active loan book size vs historical defaults.', last_updated: '2026-03-15' },
  { id: 'centrifuge-kb', name: 'Centrifuge', category: 'Tokenized Assets', mechanics: 'Brings real-world assets on-chain as NFTs used as collateral. CFG token for governance. Tinlake pools for various asset types.', critical_risks: 'Underlying asset quality varies wildly. Legal enforceability of on-chain claims on real-world assets untested in court.', data_quirks: 'Pool-level analysis required — aggregate TVL is misleading. Some pools have 0% default, others have significant write-downs.', last_updated: '2026-03-14' },
]

// ══════════════════════════════════════════════════════════════
// INTELLIGENCE ALERTS — Contextual notification system
// ══════════════════════════════════════════════════════════════

export type AlertCategory = 'onchain_anomaly' | 'derivatives_warning' | 'smart_money' | 'unlock_vesting' | 'portfolio_relative' | 'cross_asset' | 'prediction_market' | 'rwa_event'

export interface IntelAlert {
  id: string
  category: AlertCategory
  severity: 'high' | 'medium' | 'low'
  title: string
  body: string
  affected_assets: string[]
  timestamp: string
  read: boolean
}

export const ALERT_CATEGORY_CONFIG: Record<AlertCategory, { label: string; color: string; icon: string }> = {
  onchain_anomaly: { label: 'ON-CHAIN ANOMALY', color: '#22C55E', icon: 'eye' },
  derivatives_warning: { label: 'DERIVATIVES WARNING', color: '#EF4444', icon: 'lightning' },
  smart_money: { label: 'SMART MONEY', color: '#1DA1C4', icon: 'trend' },
  unlock_vesting: { label: 'UNLOCK ALERT', color: '#A78BFA', icon: 'clock' },
  portfolio_relative: { label: 'PORTFOLIO', color: '#6366F1', icon: 'chart' },
  cross_asset: { label: 'CROSS-ASSET', color: '#EC4899', icon: 'arrows' },
  prediction_market: { label: 'PREDICTION MARKET', color: '#8B5CF6', icon: 'chart' },
  rwa_event: { label: 'RWA EVENT', color: '#14B8A6', icon: 'bank' },
}

export const MOCK_ALERTS: IntelAlert[] = [
  { id: 'a1', category: 'onchain_anomaly', severity: 'high', title: '$14M of $LDO just moved to Binance', body: 'Largest single inflow in 90 days. Expect heavy sell pressure. Previous inflows of this size preceded 8-15% drops within 48 hours.', affected_assets: ['LDO', 'ETH'], timestamp: '15m ago', read: false },
  { id: 'a2', category: 'derivatives_warning', severity: 'high', title: 'WIF funding rate hit +150% annualized', body: 'Funding rate for $WIF hit +0.045% per 8h. OI at ATHs. Longs trapped. Liquidation cascade risk extreme. Previous instances at this level saw 20-40% corrections within 72 hours.', affected_assets: ['WIF'], timestamp: '2h ago', read: false },
  { id: 'a3', category: 'smart_money', severity: 'medium', title: '3 Apex Predator wallets entered $AERO', body: 'Combined 71% hit rate on Base ecosystem plays. Average entry-to-peak time: 18 days. These wallets have historically front-run narrative shifts by 1-2 weeks.', affected_assets: ['AERO'], timestamp: '4h ago', read: false },
  { id: 'a4', category: 'unlock_vesting', severity: 'high', title: 'SOL unlock in 5 days — $400M', body: '2.8% of circulating supply from early investor vesting. Previous SOL unlocks of this magnitude caused 12-18% drawdowns followed by recovery within 14 days. Consider hedging or reducing exposure.', affected_assets: ['SOL'], timestamp: '6h ago', read: true },
  { id: 'a5', category: 'portfolio_relative', severity: 'medium', title: 'BTC now 66% of your portfolio', body: 'Your BTC allocation hit 66% due to price appreciation. This is a concentration risk — consider rebalancing if your target allocation is lower. A 10% BTC correction would impact your portfolio by 6.6%.', affected_assets: ['BTC'], timestamp: '8h ago', read: true },
  { id: 'a6', category: 'cross_asset', severity: 'medium', title: 'Blake Morrow flagged risk-off shift', body: 'ForexAnalytix: CPI print came in hot at 3.4%. Fed likely to hold rates higher for longer. DXY breaking 105 support. Pelican Translation: Risk assets about to get repriced. Expect outflows from high-beta sectors like Memecoins and AI. Move to stables or delta-neutral farms until macro settles.', affected_assets: ['BTC', 'ETH', 'SOL'], timestamp: '12h ago', read: true },
  { id: 'a7', category: 'onchain_anomaly', severity: 'low', title: 'Unusual Aave utilization spike on USDC', body: 'USDC utilization on Aave Ethereum hit 92%. Borrow rates spiked to 18% APY. This typically attracts new deposits within 24-48 hours and normalizes rates. Could signal upcoming large borrowing event.', affected_assets: ['AAVE', 'USDC'], timestamp: '14h ago', read: true },
  { id: 'a_fa1', category: 'cross_asset', severity: 'high', title: 'Blake Morrow: DXY breaking critical 104 support', body: 'ForexAnalytix: DXY testing 104 support for the 3rd time this week. Previous breakdowns at this level preceded 15-25% BTC rallies within 4 weeks. Blake\'s harmonic analysis shows EUR/USD bullish bat completion — if DXY breaks, crypto gets a tailwind. Pelican Translation: This is the macro signal crypto traders wait for. Position for BTC strength, reduce stablecoin allocation.', affected_assets: ['BTC', 'ETH', 'SOL'], timestamp: '1h ago', read: false },
  { id: 'a_fa2', category: 'cross_asset', severity: 'medium', title: 'FA FACE Webinar: Risk-off regime developing in bonds', body: 'ForexAnalytix FACE panel (Blake Morrow, Dale Pinkert, Joel Kruger) flagged rising US10Y yields as the dominant risk. 4.32% and climbing. COT data shows institutional shorts building in Treasuries. Pelican Translation: Rising yields historically crush altcoins first, then BTC. If US10Y breaks 4.50%, expect a 10-15% drawdown in high-beta crypto. Reduce leverage now.', affected_assets: ['ETH', 'SOL', 'AVAX'], timestamp: '3h ago', read: false },
  { id: 'a_pm1', category: 'prediction_market', severity: 'high', title: 'BTC $100K by June odds surged to 68%', body: 'Polymarket prediction market for BTC reaching $100K by June 2026 jumped from 42% to 68% in 24 hours. Volume spiked to $12M. This aligns with spot ETF inflow acceleration and historically bullish Q2 seasonality. Smart money positioning suggests institutional conviction is building.', affected_assets: ['BTC'], timestamp: '30m ago', read: false },
  { id: 'a_pm2', category: 'prediction_market', severity: 'medium', title: 'Fed rate cut probability dropped to 22%', body: 'Polymarket odds for a June FOMC rate cut fell from 45% to 22% after hotter-than-expected jobs data. This repricing removes a key bullish catalyst for risk assets. Historically, when rate cut odds drop >20% in a week, crypto sees 5-10% pullbacks within 2 weeks.', affected_assets: ['BTC', 'ETH', 'SOL'], timestamp: '2h ago', read: false },
  { id: 'a_rwa1', category: 'rwa_event', severity: 'medium', title: 'BlackRock BUIDL crossed $1.7B TVL', body: 'BlackRock\'s tokenized Treasury fund BUIDL hit $1.7B in total value, up 12.4% in 30 days. This is the largest single tokenized asset and signals accelerating institutional adoption of on-chain treasuries. RWA sector velocity has increased from 2.5 to 3.9 this month.', affected_assets: ['ONDO', 'LINK'], timestamp: '4h ago', read: false },
]

// ══════════════════════════════════════════════

export const MOCK_BRIEF_V2 = {
  pelican_synthesis: {
    macro_weather: 'Good morning. BTC is chop-city, rangebound between $82k and $84k. Funding rates have finally reset to baseline. While the majors sleep, smart money is quietly accumulating RWA tokens — ONDO and PENDLE saw $12M in net inflows overnight.',
    sector_rotations: 'Capital is rotating out of L2s (down 8% with $40M outflows) and flooding directly into AI tokens for the 3rd consecutive week. Smart money is positioning heavily in TAO and AKT.',
    the_play: 'Sell covered calls on your ETH bags, volatility is dead. Accumulate AI beta on dips.',
  },
  cross_asset: {
    analyst_quote: 'ForexAnalytix: CPI print came in hot at 3.4%. Fed likely to hold rates higher for longer. DXY breaking 105 support.',
    pelican_translation: 'Risk assets are about to get repriced. Expect immediate outflows from high-bees or delta-neutral farms (like Ethena) until the macro dust settles.',
    analyst_name: 'Blake Morrow',
    analyst_methodology: 'Macro',
  },
  what_i_missed: {
    hours_away: 8,
    portfolio_change: -4200,
    portfolio_change_pct: -6.4,
    summary: 'You went to sleep and the market dumped 12%. Your portfolio is down $4,200.',
    what_happened: 'A fake ETF rejection rumor triggered cascading liquidations. $890M in longs liquidated across major exchanges in 4 hours.',
    action: 'The rumor was debunked 20 mins ago. Expect a V-shaped recovery. Smart money is already buying the dip — 3 Apex Predator wallets accumulated $22M in ETH in the last hour.',
  },
  market_strip: [
    { symbol: 'BTC', price: 84230, change: 7.44 },
    { symbol: 'ETH', price: 2180, change: -6.84 },
    { symbol: 'SOL', price: 138.50, change: -2.46 },
    { symbol: 'BTC.D', price: 58.4, change: 0.8, suffix: '%' },
    { symbol: 'F&G', price: 72, change: 0, label: 'Greed' },
  ],
}

// ═══════════════════════════════════════════
// TOKEN ANALYTIX — NEW UNIFIED DATA
// ═══════════════════════════════════════════

export interface UnifiedAsset {
  symbol: string;
  name: string;
  category: 'crypto' | 'equity' | 'etf' | 'rwa' | 'defi' | 'commodity' | 'stablecoin';
  price: number;
  change24h: number;
  marketCap: string;
  volume: string;
  pelicanInsight: string;
  correlations: Record<string, number>;
}

export interface MacroInstrument {
  symbol: string;
  label: string;
  value: string;
  sublabel: string;
  direction: 'Bullish' | 'Bearish' | 'Neutral';
  insight: string;
}

export interface PredictionContract {
  id: string;
  question: string;
  leadingOutcome: string;
  probability: number;
  volume: string;
  category: 'macro' | 'crypto' | 'geopolitical' | 'regulatory';
  signal: string;
  isContrarian: boolean;
}

export interface XPost {
  user: string;
  verified: boolean;
  time: string;
  text: string;
}

export interface AnalystProfile {
  name: string;
  initials: string;
  specialty: string;
  instruments: string;
  crypto: string;
  winRate: string;
  pips: string;
  color: string;
}

export interface AnalystCall {
  analyst: string;
  instrument: string;
  direction: 'Bullish' | 'Bearish' | 'Neutral';
  quote: string;
  time: string;
}

export interface Signal {
  type: 'Convergence' | 'Contrarian' | 'On-Chain' | 'Analyst' | 'Macro' | 'Tokenization' | 'Technical';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  tokens: string[];
  action: 'Position' | 'Watch' | 'Hedge' | 'Confirm';
  confidence: string;
  time: string;
  color: string;
}

export interface CalendarEvent {
  date: string;
  dayOfWeek: string;
  type: 'macro' | 'crypto' | 'prediction' | 'tokenization' | 'webinar';
  title: string;
  time: string;
  impact: 'High' | 'Medium' | 'Low' | null;
  pelicanBrief: string | null;
}

export interface TokenizationSector {
  category: string;
  totalValue: string;
  growth: string;
  items: { name: string; value: string; yield?: string }[];
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  totalLessons: number;
  completedLessons: number;
  color: string;
  modules: { title: string; completed: boolean }[];
}

// ═══════════════════════════════════════════
// UNIFIED ASSET UNIVERSE
// ═══════════════════════════════════════════

export const UNIFIED_ASSETS: UnifiedAsset[] = [
  { symbol: 'BTC', name: 'Bitcoin', category: 'crypto', price: 84230, change24h: 7.44, marketCap: '1.65T', volume: '42.8B', pelicanInsight: 'DXY breakdown fueling rally. H&S target 101.50 on dollar = 15-45% historical BTC upside. Bull flag on weekly.', correlations: { SPX: 0.72, GOLD: 0.45, DXY: -0.68, AAPL: 0.58 } },
  { symbol: 'ETH', name: 'Ethereum', category: 'crypto', price: 2180, change24h: -6.84, marketCap: '262B', volume: '18.2B', pelicanInsight: 'Underperforming BTC as dominance rises. Grega sees Wave 4 correction. Support at $2,050 critical. ETH/BTC ratio at cycle lows.', correlations: { SPX: 0.68, GOLD: 0.38, DXY: -0.61, BTC: 0.91 } },
  { symbol: 'SOL', name: 'Solana', category: 'crypto', price: 138.50, change24h: -2.46, marketCap: '64B', volume: '3.8B', pelicanInsight: 'ETF approval probability at 28% on Polymarket. Network TPS leading all L1s. Consolidating above 200MA.', correlations: { SPX: 0.61, BTC: 0.88 } },
  { symbol: 'LINK', name: 'Chainlink', category: 'crypto', price: 14.20, change24h: 3.10, marketCap: '8.9B', volume: '580M', pelicanInsight: 'Oracle infrastructure for tokenized assets. CCIP cross-chain protocol gaining institutional adoption.', correlations: { BTC: 0.82, ETH: 0.85 } },
  { symbol: 'AAVE', name: 'Aave', category: 'defi', price: 92.40, change24h: 1.80, marketCap: '1.4B', volume: '120M', pelicanInsight: 'Largest DeFi lending protocol. Now supports USDY and other yield-bearing stablecoins as collateral.', correlations: { ETH: 0.78, BTC: 0.65 } },
  { symbol: 'AAPL', name: 'Apple (Tokenized)', category: 'equity', price: 178.22, change24h: 1.20, marketCap: '2.75T', volume: '8.1B', pelicanInsight: 'Tokenized on Kraken. Identical exposure to NYSE AAPL with 24/7 settlement and T+0 clearing.', correlations: { SPX: 0.85, BTC: 0.58, QQQ: 0.91 } },
  { symbol: 'NVDA', name: 'Nvidia (Tokenized)', category: 'equity', price: 892.40, change24h: 3.10, marketCap: '2.21T', volume: '14.2B', pelicanInsight: 'AI capex cycle intact. Tokenized version settles T+0 vs T+1 on Nasdaq. Same fundamentals, better rails.', correlations: { SPX: 0.79, BTC: 0.52, QQQ: 0.94 } },
  { symbol: 'TSLA', name: 'Tesla (Tokenized)', category: 'equity', price: 172.80, change24h: -1.30, marketCap: '551B', volume: '9.4B', pelicanInsight: 'High-vol tokenized equity. 24/7 trading captures Asia session moves that NYSE misses.', correlations: { SPX: 0.71, BTC: 0.48 } },
  { symbol: 'MSFT', name: 'Microsoft (Tokenized)', category: 'equity', price: 415.60, change24h: 0.80, marketCap: '3.09T', volume: '6.2B', pelicanInsight: 'Largest company by market cap, now tradeable 24/7 as a token on Kraken.', correlations: { SPX: 0.88, QQQ: 0.93 } },
  { symbol: 'SPY', name: 'S&P 500 ETF (Tokenized)', category: 'etf', price: 528.40, change24h: 0.45, marketCap: '520B', volume: '28B', pelicanInsight: 'Tokenized SPY on Kraken. Trade the index 24/7 including weekends. Bull flag breakout targeting 5,400.', correlations: { BTC: 0.72, GOLD: 0.31, DXY: -0.52 } },
  { symbol: 'QQQ', name: 'Nasdaq 100 ETF (Tokenized)', category: 'etf', price: 448.90, change24h: 0.62, marketCap: '260B', volume: '15B', pelicanInsight: 'Tech-heavy index, AI sector weight at ATH. Tokenized = weekend exposure.', correlations: { BTC: 0.69, SPY: 0.96 } },
  { symbol: 'ONDO', name: 'Ondo Finance', category: 'rwa', price: 1.82, change24h: 12.30, marketCap: '2.4B', volume: '890M', pelicanInsight: 'Leading RWA protocol. USDY yield-bearing stablecoin at 4.85% APY. Surging on Nasdaq tokenization news.', correlations: { SPX: 0.42 } },
  { symbol: 'MKR', name: 'Maker', category: 'defi', price: 1420, change24h: 2.80, marketCap: '1.2B', volume: '45M', pelicanInsight: 'MakerDAO holds $2.1B in RWAs as collateral. Largest DeFi protocol with real-world asset exposure.', correlations: { SPX: 0.38 } },
  { symbol: 'PAXG', name: 'Pax Gold', category: 'commodity', price: 2338, change24h: 1.08, marketCap: '680M', volume: '24M', pelicanInsight: 'Each PAXG = 1oz LBMA-vaulted physical gold. Digital gold alternative to GLD ETF with no expense ratio.', correlations: { GOLD: 0.95, BTC: 0.45, DXY: -0.78 } },
  { symbol: 'USDY', name: 'Ondo US Dollar Yield', category: 'stablecoin', price: 1.049, change24h: 0.01, marketCap: '548M', volume: '12M', pelicanInsight: 'Yield-bearing stablecoin at 4.85% APY. Backed by tokenized T-bills. The money market fund of crypto.', correlations: {} },
];

export const TICKER_DATA = [
  { symbol: 'BTC', price: '$84,230', change: '+7.44%', up: true },
  { symbol: 'ETH', price: '$2,180', change: '-6.84%', up: false },
  { symbol: 'SOL', price: '$138.50', change: '-2.46%', up: false },
  { symbol: 'AAPL', price: '$178.22', change: '+1.20%', up: true },
  { symbol: 'SPY', price: '$528.40', change: '+0.45%', up: true },
  { symbol: 'ONDO', price: '$1.82', change: '+12.3%', up: true },
  { symbol: 'BTC.D', price: '58.4%', change: '+0.80%', up: true },
  { symbol: 'DXY', price: '104.00', change: '-0.32%', up: false },
  { symbol: 'GOLD', price: '$2,340', change: '+1.12%', up: true },
  { symbol: 'F&G', price: '72', change: null, badge: 'GREED' },
] as const;

// ═══════════════════════════════════════════
// MACRO REGIME
// ═══════════════════════════════════════════

export const MACRO_REGIME = {
  overall: { direction: 'Risk-On' as const, confidence: 85, signalsAligned: 4, signalsTotal: 5 },
  instruments: [
    { symbol: 'DXY', label: 'DXY', value: '104.00', sublabel: 'Head & shoulders breakdown', direction: 'Bearish' as const, insight: 'Dollar weakness = crypto strength. BTC rallies 15-45% historically when DXY breaks below 104.' },
    { symbol: 'GOLD', label: 'Gold (XAU)', value: '$2,340', sublabel: 'Wave 5 extension targeting $2,520', direction: 'Bullish' as const, insight: 'Gold leads BTC by 2-4 weeks. Digital gold narrative strengthens.' },
    { symbol: 'SPX', label: 'SPX', value: '5,280', sublabel: 'Bull flag confirmed', direction: 'Bullish' as const, insight: 'BTC-SPX correlation at 0.72. Risk-on equities = risk-on crypto.' },
    { symbol: '10Y', label: '10Y UST', value: '4.25%', sublabel: 'Post-CPI sell-off', direction: 'Bearish' as const, insight: 'Rising yields compete with risk assets. Watch 4.50% as the danger level.' },
    { symbol: 'VIX', label: 'VIX', value: '14.2', sublabel: 'Complacency zone', direction: 'Neutral' as const, insight: 'Low VIX = calm markets. Watch for vol expansion above 20.' },
  ] as MacroInstrument[],
};

// ═══════════════════════════════════════════
// PREDICTION MARKETS
// ═══════════════════════════════════════════

export const PREDICTION_MARKETS: PredictionContract[] = [
  { id: 'fed-april', question: 'Fed decision in April?', leadingOutcome: 'No change', probability: 96, volume: '$13M', category: 'macro', signal: 'Neutral', isContrarian: false },
  { id: 'btc-65k', question: 'BTC above $65K in March?', leadingOutcome: 'Yes', probability: 43, volume: '$2.1M', category: 'crypto', signal: 'Contrarian Buy', isContrarian: true },
  { id: 'eth-2400', question: 'ETH hit $2,400 in March?', leadingOutcome: 'Yes', probability: 32, volume: '$890K', category: 'crypto', signal: 'Contrarian Buy', isContrarian: true },
  { id: 'fed-hike', question: 'Fed rate hike in 2026?', leadingOutcome: 'No', probability: 82, volume: '$246K', category: 'macro', signal: 'Bullish', isContrarian: false },
  { id: 'sol-etf', question: 'SEC approve spot SOL ETF by June?', leadingOutcome: 'Yes', probability: 28, volume: '$1.4M', category: 'regulatory', signal: 'Watch', isContrarian: false },
  { id: 'btc-100k', question: 'BTC above $100K by June?', leadingOutcome: 'Yes', probability: 38, volume: '$4.8M', category: 'crypto', signal: 'Contrarian Buy', isContrarian: true },
  { id: 'us-recession', question: 'US recession by Dec 2026?', leadingOutcome: 'No', probability: 74, volume: '$8.2M', category: 'macro', signal: 'Bullish', isContrarian: false },
];

export const CONTRARIAN_SPOTLIGHT = {
  question: 'Will BTC drop below $65K before March expiry?',
  currentProbability: 41,
  volume: '$57M',
  moveRequired: '-7.4%',
  history: [
    { date: 'Mar 8', probability: 80, btcPrice: 66500, label: 'BTC BOTTOM — rallied 14.3% over next week' },
    { date: 'Mar 15', probability: 20, btcPrice: 76000, label: 'BTC TOP — fell 7.6% from this level' },
  ],
  pelicanAnalysis: 'Extreme readings on this contract act as contrarian mean-reversion signals. 80% probability marked the BTC bottom on March 8 (BTC rallied 14.3%). 20% marked the top on March 15 (BTC fell 7.6%). This behaves like RSI for macro sentiment. At 41%, neutral — watch for 60%+ as a buy signal. $57M volume makes this the most liquid crypto prediction contract active.',
};

// ═══════════════════════════════════════════
// X FEED
// ═══════════════════════════════════════════

export const X_FEED: XPost[] = [
  { user: '@zaborack', verified: true, time: '4m', text: '$57M in volume on a single contract: Will BTC drop below $65K? 80% probability marked the bottom. 20% marked the top. Prediction market data is becoming a leading indicator.' },
  { user: '@WatcherGuru', verified: true, time: '12m', text: 'BREAKING: Nasdaq receives SEC approval to list tokenized stock securities. Trading begins April 2026.' },
  { user: '@CryptoHayes', verified: true, time: '28m', text: 'DXY breaking the head & shoulders neckline. If 101 goes, risk assets go parabolic. Digital gold + equities + crypto all benefit.' },
  { user: '@BlakeMorrow_FA', verified: true, time: '41m', text: 'Most important chart in the world right now is DXY. H&S target 101.50. If that hits, every risk asset on the planet benefits.' },
  { user: '@DegenSpartan', verified: false, time: '1h', text: 'ICE investing $2B in Polymarket. NYSE parent company betting on prediction markets. This is not a drill.' },
  { user: '@Pentosh1', verified: true, time: '1h', text: 'BTC weekly close above $83K is massive. Higher high on the weekly. Monthly trend intact. Bears running out of time.' },
  { user: '@inversebrah', verified: true, time: '2h', text: 'Tokenized AAPL on Kraken trades 24/7. I can buy Apple stock at 3am on a Sunday. The future is here and nobody is talking about it.' },
  { user: '@CredibleCrypto', verified: true, time: '2h', text: 'Gold wave 5 extension in play. $2,520 target. If gold leads BTC by 2-4 weeks like the last 3 cycles, new ATH attempt incoming.' },
];

// ═══════════════════════════════════════════
// FOREXANALYTIX ANALYST DATA
// ═══════════════════════════════════════════

export const FA_ANALYSTS: AnalystProfile[] = [
  { name: 'Blake Morrow', initials: 'BM', specialty: 'MACRO + HARMONICS', instruments: 'DXY, EUR/USD, Gold, SPX, BTC', crypto: 'BTC, ETH', winRate: '74%', pips: '312 PIPs', color: '#3B82F6' },
  { name: 'Grega Horvat', initials: 'GH', specialty: 'ELLIOTT WAVE', instruments: 'EUR/USD, GBP/USD, Gold, Oil, ETH', crypto: 'ETH, SOL', winRate: '68%', pips: '287 PIPs', color: '#8B5CF6' },
  { name: 'Steve Voulgaridis', initials: 'SV', specialty: 'CANDLESTICK + TECHNICAL', instruments: 'USD/JPY, AUD/USD, DAX, BTC', crypto: 'BTC', winRate: '71%', pips: '245 PIPs', color: '#EF4444' },
  { name: 'Dale Pinkert', initials: 'DP', specialty: 'MACRO + INTERMARKET', instruments: 'DXY, SPX, 10Y UST, Gold', crypto: '\u2014', winRate: 'FACE Host', pips: '', color: '#F59E0B' },
];

export const ANALYST_CALLS: AnalystCall[] = [
  { analyst: 'Blake Morrow', instrument: 'DXY', direction: 'Bearish', quote: 'H&S target 101.50. Most important chart in the world right now.', time: '2h ago' },
  { analyst: 'Blake Morrow', instrument: 'BTC', direction: 'Bullish', quote: 'Adding to bat pattern position at $82,400.', time: '2h ago' },
  { analyst: 'Grega Horvat', instrument: 'Gold', direction: 'Bullish', quote: 'Wave 5 extension. Target $2,520.', time: '3h ago' },
  { analyst: 'Grega Horvat', instrument: 'ETH', direction: 'Bearish', quote: 'Wave 4 correction before 3,000.', time: '3h ago' },
  { analyst: 'Steve Voulgaridis', instrument: 'SPX', direction: 'Bullish', quote: 'Bull flag breakout confirmed. 5,400 target.', time: '5h ago' },
  { analyst: 'Dale Pinkert', instrument: 'DXY', direction: 'Bearish', quote: 'Real yields declining. Financial conditions loosening. Dollar has more room to fall.', time: '6h ago' },
];

export const ANALYST_CONSENSUS = [
  { instrument: 'DXY', views: { blake: 'Bearish', grega: 'Bearish', steve: 'Bearish', dale: 'Bearish' }, consensus: 'UNANIMOUS BEARISH' },
  { instrument: 'Gold', views: { blake: 'Bullish', grega: 'Bullish', steve: 'Neutral', dale: 'Bullish' }, consensus: '3/4 BULLISH' },
  { instrument: 'BTC', views: { blake: 'Bullish', grega: 'Neutral', steve: 'Bullish', dale: 'Neutral' }, consensus: '2/4 BULLISH' },
  { instrument: 'ETH', views: { blake: 'Neutral', grega: 'Bearish', steve: 'Neutral', dale: 'Neutral' }, consensus: 'LEAN BEARISH' },
  { instrument: 'SPX', views: { blake: 'Bullish', grega: 'Neutral', steve: 'Bullish', dale: 'Bullish' }, consensus: '3/4 BULLISH' },
];

// ═══════════════════════════════════════════
// TOKENIZATION DATA
// ═══════════════════════════════════════════

export const TOKENIZATION_PULSE: TokenizationSector[] = [
  { category: 'Tokenized US Treasuries', totalValue: '$11.59B', growth: '+3.93% this week', items: [
    { name: 'BlackRock BUIDL', value: '$1.9B', yield: '4.8% APY' },
    { name: 'Ondo USDY', value: '$548M', yield: '4.85% APY' },
    { name: 'Franklin OnChain FOBXX', value: '$425M', yield: '4.6% APY' },
  ]},
  { category: 'Private Credit', totalValue: '$3.2B', growth: '+180% YoY', items: [
    { name: 'Maple Finance', value: '' },
    { name: 'Centrifuge', value: '' },
    { name: 'Goldfinch', value: '', yield: '8-12% APY' },
  ]},
  { category: 'Tokenized Stocks', totalValue: '$1.05B', growth: '+10.29% this month', items: [
    { name: 'Circle Internet Group (via Ondo)', value: '$91M' },
    { name: 'Exodus Movement (via Securitize)', value: '$73M' },
    { name: 'Alphabet Class A (via Ondo)', value: '$54M' },
  ]},
  { category: 'Commodities', totalValue: '$1.27B', growth: '+7.2% this month', items: [
    { name: 'Pax Gold (PAXG)', value: '$680M', yield: 'Physical gold in LBMA vaults' },
    { name: 'Tether Gold (XAUT)', value: '$590M', yield: 'Physical gold in Swiss vaults' },
  ]},
];

export const TOKENIZATION_MILESTONES = [
  { title: 'SEC approves tokenized stocks on Nasdaq', description: 'Listed securities can now trade as tokens under existing regulatory framework. First trades expected April 2026.', impact: 'High' as const, time: '2d ago' },
  { title: 'ICE (NYSE parent) invests $2B in Polymarket', description: 'Largest traditional exchange operator making a massive bet on prediction markets as financial infrastructure.', impact: 'High' as const, time: '3d ago' },
  { title: 'BlackRock BUIDL crosses $1.9B TVL', description: 'Largest tokenized money market fund. Growing $200M/month. Institutional demand for on-chain T-bill exposure accelerating.', impact: 'Medium' as const, time: '5d ago' },
  { title: 'Ondo USDY integrates with 4 new DeFi protocols', description: 'Yield-bearing stablecoin expanding composability. Now collateral on Aave, Compound, Morpho, and Euler.', impact: 'Medium' as const, time: '1w ago' },
];

export const TRADFI_EQUIVALENTS = [
  { traditional: 'Money market fund', tokenized: 'BUIDL / USDY / FOBXX', advantage: '24/7 yield + DeFi composability' },
  { traditional: 'Stock certificate (AAPL)', tokenized: 'Tokenized AAPL on Kraken', advantage: 'T+0 settlement, 24/7 trading' },
  { traditional: 'Gold ETF (GLD)', tokenized: 'PAXG / XAUT', advantage: 'Direct ownership, no expense ratio' },
  { traditional: 'Futures contract', tokenized: 'Polymarket prediction contract', advantage: 'No margin calls, binary outcome' },
  { traditional: 'S&P 500 Index fund', tokenized: 'Tokenized SPY on Kraken', advantage: 'Weekend trading, fractional' },
  { traditional: 'Corporate bond', tokenized: 'Maple Finance / Centrifuge', advantage: '8-12% yield, transparent default data' },
];

export const TRADFI_BRIDGE_PREDICTIONS = [
  { traditional: 'Options IV / Put-Call Ratio', tokenized: 'Prediction market probability extremes' },
  { traditional: 'RSI overbought / oversold', tokenized: 'Contract probability at 80%+ or sub-20%' },
  { traditional: 'VIX as fear gauge', tokenized: 'Polymarket volume spikes on tail-risk contracts' },
  { traditional: 'Fed Funds Futures', tokenized: 'Polymarket rate decision contracts' },
  { traditional: 'CME Open Interest', tokenized: 'Prediction market volume + liquidity depth' },
];

// ═══════════════════════════════════════════
// SIGNALS
// ═══════════════════════════════════════════

export const SIGNALS_DATA: Signal[] = [
  { type: 'Convergence', severity: 'HIGH', title: '5-Signal Macro Convergence Detected', description: 'DXY broke key support + Gold ATH + SPX breakout + FA team unanimous bearish USD + Prediction markets repriced rate expectations. 5 independent signals pointing same direction.', tokens: ['BTC', 'ETH', 'SPY'], action: 'Position', confidence: '92%', time: '14m ago', color: '#8B5CF6' },
  { type: 'Contrarian', severity: 'HIGH', title: 'Polymarket BTC $65K contract at contrarian zone', description: 'Contract probability rising toward 60%. Last two instances of 60%+ marked local BTC bottoms within 48 hours.', tokens: ['BTC'], action: 'Watch', confidence: '78%', time: '1h ago', color: '#8B5CF6' },
  { type: 'On-Chain', severity: 'HIGH', title: 'Whale accumulation spike \u2014 BTC', description: '3 wallets with >1,000 BTC added 4,200 BTC ($354M) in 6 hours. Same addresses accumulated before Oct 2023 rally.', tokens: ['BTC'], action: 'Position', confidence: '85%', time: '2h ago', color: '#06B6D4' },
  { type: 'Analyst', severity: 'MEDIUM', title: 'Analyst alignment: 4/4 bearish DXY', description: 'Blake, Grega, Steve, and Dale all bearish dollar. Unanimous bearish DXY preceded 78% avg BTC rally previously.', tokens: ['BTC', 'ETH', 'SOL'], action: 'Position', confidence: '88%', time: '3h ago', color: '#3B82F6' },
  { type: 'Macro', severity: 'MEDIUM', title: 'Risk-On regime confirmed (85% confidence)', description: '4 of 5 macro indicators aligned: DXY bearish, Gold bullish, SPX bullish, VIX low. Only 10Y yield is warning.', tokens: ['BTC', 'SPY', 'ONDO'], action: 'Position', confidence: '85%', time: '4h ago', color: '#10B981' },
  { type: 'Tokenization', severity: 'MEDIUM', title: 'Nasdaq tokenized stock listing approved by SEC', description: 'First regulated exchange approved for tokenized equities. Structural tailwind for RWA sector.', tokens: ['ONDO', 'MKR', 'CFG'], action: 'Watch', confidence: 'N/A', time: '1d ago', color: '#F59E0B' },
  { type: 'Technical', severity: 'LOW', title: 'BTC golden cross on daily (50/200 MA)', description: '50-day crossed above 200-day. Historically bullish but mixed reliability. Combined with macro setup, adds confirmation.', tokens: ['BTC'], action: 'Confirm', confidence: '62%', time: '1d ago', color: '#64748B' },
];

// ═══════════════════════════════════════════
// CALENDAR
// ═══════════════════════════════════════════

export const CALENDAR_EVENTS: CalendarEvent[] = [
  { date: '2026-03-20', dayOfWeek: 'THU', type: 'webinar', title: 'FACE Daily Webinar', time: '8:30 AM ET', impact: null, pelicanBrief: null },
  { date: '2026-03-21', dayOfWeek: 'FRI', type: 'prediction', title: 'Polymarket Situation Room opens in DC', time: 'All Day', impact: 'Medium', pelicanBrief: 'Physical prediction market venue. Watch for PR-driven volume spikes on Polymarket this weekend.' },
  { date: '2026-03-24', dayOfWeek: 'MON', type: 'crypto', title: 'Arbitrum unlock \u2014 92.6M ARB ($98M)', time: '12:00 PM UTC', impact: 'Medium', pelicanBrief: 'Large unlock vs daily volume. Historically causes 5-8% dip in first 48h. Watch $0.95 support.' },
  { date: '2026-03-26', dayOfWeek: 'WED', type: 'macro', title: 'FOMC Meeting Minutes Released', time: '2:00 PM ET', impact: 'High', pelicanBrief: 'Markets looking for balance sheet language. Any hawkish surprise could push 10Y above 4.50% danger level. Reduce leverage beforehand.' },
  { date: '2026-03-28', dayOfWeek: 'FRI', type: 'macro', title: 'Core PCE Inflation (Feb)', time: '8:30 AM ET', impact: 'High', pelicanBrief: 'Fed preferred inflation measure. Consensus 2.7% YoY. Hot (>2.8%) = repriced rate odds. Cool (<2.6%) = risk-on accelerates. BTC vol \u00b14%.' },
  { date: '2026-03-31', dayOfWeek: 'MON', type: 'prediction', title: 'BTC $65K March contract expires', time: '11:59 PM UTC', impact: 'High', pelicanBrief: '$57M volume contract resolving. Watch for new April/May contracts to gauge forward sentiment.' },
  { date: '2026-04-01', dayOfWeek: 'TUE', type: 'tokenization', title: 'Nasdaq tokenized stock trading begins', time: 'Market Open', impact: 'High', pelicanBrief: 'First regulated exchange listing tokenized equities. Historic. Watch ONDO, MKR for RWA sector sympathy. Compare volumes to Kraken tokenized stocks.' },
  { date: '2026-04-02', dayOfWeek: 'WED', type: 'macro', title: 'ISM Manufacturing PMI', time: '10:00 AM ET', impact: 'Medium', pelicanBrief: 'Leading indicator. Above 50 = expansion = risk-on. Below 49 = recession fears. Watch DXY reaction first.' },
  { date: '2026-04-04', dayOfWeek: 'FRI', type: 'macro', title: 'Non-Farm Payrolls (March)', time: '8:30 AM ET', impact: 'High', pelicanBrief: 'Consensus +185K. Hot = higher rates = bearish. Weak = cuts back on table = bullish. Prediction markets pricing 96% no April cut regardless.' },
  { date: '2026-04-10', dayOfWeek: 'THU', type: 'macro', title: 'CPI Inflation (March)', time: '8:30 AM ET', impact: 'High', pelicanBrief: 'The big one. Consensus 2.9% YoY. Above 3% devastating for risk. Below 2.7% could reprice cut odds from 0% to 20%+. Maximum vol event.' },
];

// ═══════════════════════════════════════════
// KNOWLEDGE BASE / LEARNING PATHS
// ═══════════════════════════════════════════

export const LEARNING_PATHS: LearningPath[] = [
  { id: 'equities', title: 'I Trade Equities', description: 'Options, stocks, ETFs \u2192 tokenized equivalents, 24/7 markets, on-chain settlement', totalLessons: 12, completedLessons: 4, color: '#3B82F6', modules: [
    { title: 'What is a tokenized stock? (Same equity, new rails)', completed: true },
    { title: 'Kraken setup: buying tokenized AAPL', completed: true },
    { title: 'Settlement comparison: T+1 vs T+0', completed: true },
    { title: 'Why 24/7 trading matters for risk management', completed: true },
    { title: 'Yield-bearing stablecoins as cash management', completed: false },
    { title: 'Portfolio migration: what moves on-chain first', completed: false },
    { title: 'Understanding on-chain order books', completed: false },
    { title: 'DeFi composability for equity traders', completed: false },
    { title: 'Tax implications of tokenized securities', completed: false },
    { title: 'Custody options: exchange vs self-custody', completed: false },
    { title: 'Cross-margin with tokenized assets', completed: false },
    { title: 'Building a hybrid TradFi + token portfolio', completed: false },
  ]},
  { id: 'futures', title: 'I Trade Futures/Options', description: 'Derivatives \u2192 prediction markets, DeFi options, perpetual contracts', totalLessons: 10, completedLessons: 2, color: '#8B5CF6', modules: [
    { title: 'Prediction markets as binary options', completed: true },
    { title: 'Reading Polymarket like an options chain', completed: true },
    { title: 'Contrarian signals: probability extremes as RSI', completed: false },
    { title: 'DeFi perpetuals vs CME futures', completed: false },
    { title: 'Funding rates as sentiment indicators', completed: false },
    { title: 'Building multi-leg strategies with prediction contracts', completed: false },
    { title: 'Polymarket volume analysis techniques', completed: false },
    { title: 'On-chain derivatives protocols (dYdX, GMX)', completed: false },
    { title: 'Cross-exchange basis trading', completed: false },
    { title: 'Automated prediction market strategies', completed: false },
  ]},
  { id: 'forex', title: 'I Trade Forex', description: 'Currency pairs \u2192 stablecoins, DXY-crypto correlation, macro regime trading', totalLessons: 8, completedLessons: 0, color: '#10B981', modules: [
    { title: 'Stablecoins are currency pairs (USDC/USDT \u2248 EUR/USD)', completed: false },
    { title: 'DXY as the crypto macro driver', completed: false },
    { title: 'Carry trade: yield-bearing stablecoins vs FX carry', completed: false },
    { title: 'How ForexAnalytix macro analysis applies to crypto', completed: false },
    { title: 'Cross-asset correlation trading', completed: false },
    { title: 'Macro regime identification for crypto positioning', completed: false },
    { title: 'Central bank policy \u2192 crypto flow analysis', completed: false },
    { title: 'Building a macro-driven crypto strategy', completed: false },
  ]},
  { id: 'new', title: 'New to Tokenization', description: 'Start from zero \u2192 understand why all assets are moving on-chain', totalLessons: 15, completedLessons: 0, color: '#F59E0B', modules: [
    { title: 'What is tokenization? (No jargon version)', completed: false },
    { title: 'Why BlackRock is tokenizing T-bills', completed: false },
    { title: 'The settlement revolution explained', completed: false },
    { title: 'SEC approvals and what they mean', completed: false },
    { title: 'Your first Kraken account + tokenized trade', completed: false },
    { title: 'Wallets, keys, and self-custody basics', completed: false },
    { title: 'Understanding stablecoins as infrastructure', completed: false },
    { title: 'DeFi 101: lending, borrowing, yield', completed: false },
    { title: 'Prediction markets explained', completed: false },
    { title: 'On-chain transparency vs TradFi opacity', completed: false },
    { title: 'Risk management in 24/7 markets', completed: false },
    { title: 'Reading on-chain data (block explorers)', completed: false },
    { title: 'Gas fees and transaction costs', completed: false },
    { title: 'Cross-chain bridges and interoperability', completed: false },
    { title: 'Building your first tokenized portfolio', completed: false },
  ]},
];

export const TRADFI_GLOSSARY = [
  { traditional: 'Brokerage account', tokenized: 'Kraken / self-custody wallet' },
  { traditional: 'Stock certificate', tokenized: 'ERC-20 tokenized equity' },
  { traditional: 'Money market fund', tokenized: 'Yield-bearing stablecoin (USDY, BUIDL)' },
  { traditional: 'Options contract', tokenized: 'Prediction market contract' },
  { traditional: 'SWIFT transfer', tokenized: 'Stablecoin transfer (USDC)' },
  { traditional: 'Clearing house (DTCC)', tokenized: 'Smart contract settlement' },
  { traditional: 'Margin account', tokenized: 'DeFi lending position (Aave, Compound)' },
  { traditional: 'Market maker', tokenized: 'Automated market maker (AMM)' },
];

// ═══════════════════════════════════════════
// PELICAN SYNTHESIS STRINGS
// ═══════════════════════════════════════════

export const PELICAN_SYNTHESES = {
  morningBrief: `While you slept: DXY broke the head-and-shoulders neckline (104.00), Gold extended to $2,340 on wave 5 targeting $2,520, and SPX confirmed a bull flag breakout above 5,280. BTC rallied 7.4% to $84,230 on the dollar weakness. Prediction markets pricing 96% chance of no April rate cut. The macro regime is Risk-On at 85% confidence \u2014 4 of 5 signals aligned for crypto strength. One risk to monitor: 10Y yield at 4.25% post-CPI; a move above 4.50% would pressure all risk assets. Nasdaq's SEC approval for tokenized stock listings is the structural story \u2014 this accelerates the convergence thesis. Your portfolio is up $2,602 overnight (+4.11%).`,

  macroRegime: `4 of 5 macro signals aligned for crypto strength. DXY breakdown + Gold ATH + SPX breakout = most bullish macro backdrop since October 2023. Only risk: JPY carry trade unwind could cause short-term volatility. Prediction markets pricing 96% chance of no April rate cut \u2014 upside depends entirely on dollar weakness and risk appetite, not monetary policy catalysts.`,

  marketPulse: `ONDO +12.3% on Nasdaq tokenization approval. BTC +7.4% on DXY breakdown \u2014 dollar weakness is the dominant driver. Tokenized equities (AAPL, NVDA) tracking NYSE counterparts with identical returns but 24/7 settlement. USDY yield at 4.85% beating traditional money markets by 60 bps. ETH lagging as BTC dominance pushes higher \u2014 rotation into majors typical of early risk-on.`,

  tokenization: `In TradFi terms: $11.5B in T-bills are now trading 24/7 on-chain with instant settlement. BlackRock's BUIDL yields 4.8% \u2014 60 bps above average money market funds. The arbitrage isn't yield, it's settlement speed and DeFi composability. Your T-bill can be used as collateral in a lending protocol at 3 AM on a Sunday. That's a structural advantage traditional custody can't match. The SEC's Nasdaq approval means this isn't crypto-native anymore \u2014 it's regulated financial infrastructure.`,

  analystConsensus: `The entire team is bearish DXY \u2014 unanimous. If Blake's H&S target of 101.50 hits, BTC historically rallies 15-45%. That's $97K-$122K from current levels. Gold consensus is 3/4 bullish with Grega's $2,520 target. Gold leads BTC by 2-4 weeks, so if Gold hits target, expect BTC ATH attempt within a month. ETH is the divergence \u2014 Grega is outright bearish (Wave 4 correction). ETH underperformance vs BTC may continue until dominance peaks. Actionable: overweight BTC, neutral ETH, wait for Wave 4 completion signal from Grega before adding ETH exposure.`,

  webinarRecap: `Analyst unanimity on DXY weakness is rare. Last time all four were bearish simultaneously (Oct 2023), BTC rallied 78% over the following 4 months. Key disagreement is on ETH \u2014 Grega's Wave 4 target of $1,950 is 10% below current price. If correct, wait. If the correction is shallow (hold $2,050), the risk/reward favors early entry. Dale's point about the rally being liquidity-driven, not policy-driven, is the most underappreciated insight \u2014 the Fed doesn't need to cut for crypto to rally. Dollar weakness alone is sufficient fuel.`,
};

// ═══════════════════════════════════════════
// ASK PELICAN SUGGESTED PROMPTS
// ═══════════════════════════════════════════

export const PELICAN_SUGGESTED_PROMPTS = [
  { category: 'Macro', prompt: 'Analyze BTC\'s macro setup using ForexAnalytix views, prediction market odds, and on-chain flows' },
  { category: 'Scenario', prompt: 'If the Fed cuts in June, model how my portfolio performs based on historical rate-cut cycles' },
  { category: 'Bridge', prompt: 'Compare risk/reward of AAPL stock at Schwab vs tokenized AAPL on Kraken \u2014 yield, settlement, 24/7 access' },
  { category: 'Contrarian', prompt: 'Scan Polymarket for contracts where probability diverges from implied options volatility' },
  { category: 'Portfolio', prompt: 'Which of my holdings have tokenized equivalents with better yield or settlement?' },
  { category: 'Education', prompt: 'Explain prediction markets as options contracts to someone who trades SPX options' },
  { category: 'On-Chain', prompt: 'Show me whale wallet movements for BTC in the last 24 hours and what they signal' },
  { category: 'Analyst', prompt: 'Summarize where Blake, Grega, Steve, and Dale disagree and who to follow for ETH' },
];
