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
  token_unlock: '#9945FF', governance: '#4A90C4', fed_meeting: '#D4A042',
  earnings: '#2A5ADA', expiration: '#E06565', halving: '#F7931A', upgrade: '#3EBD8C',
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
  heating_up: { color: '#3EBD8C', glow: 'rgba(34,197,94,0.15)', label: 'Heating Up' },
  stealth_accumulation: { color: '#4A90C4', glow: 'rgba(74,144,196,0.12)', label: 'Stealth Accumulation' },
  stable: { color: '#6B7280', glow: 'transparent', label: 'Stable / Chop' },
  cooling_down: { color: '#E06565', glow: 'rgba(239,68,68,0.12)', label: 'Cooling Down' },
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
  Lending: '#4A90C4', DEX: '#A78BFA', LSD: '#D4A042', Restaking: '#3EBD8C',
  'Yield/Deriv': '#EC4899', 'Perp DEX': '#E06565', 'Stable/Yield': '#6366F1',
  Bridge: '#F97316', L2: '#4A90C4', Oracle: '#8B5CF6', Compute: '#14B8A6', NFT: '#E879F9',
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
  onchain_anomaly: { label: 'ON-CHAIN ANOMALY', color: '#3EBD8C', icon: 'eye' },
  derivatives_warning: { label: 'DERIVATIVES WARNING', color: '#E06565', icon: 'lightning' },
  smart_money: { label: 'SMART MONEY', color: '#4A90C4', icon: 'trend' },
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

// ══════════════════════════════════════════════════════════════
// TOKEN SCREENER DATA — Dashboard token table
// ══════════════════════════════════════════════════════════════

export interface MockToken {
  symbol: string
  name: string
  chain: string
  price: number
  change24h: number
  sparkline7d: number[]
  marketCap: number
  traders: number
  volume: number
  liquidity: number
  inflows: number
  outflows: number
  netFlows: number
}

export const MOCK_TOKENS: MockToken[] = [
  { symbol: 'FAF', name: 'FaF Token', chain: 'SOL', price: 0.0042, change24h: 184.2, sparkline7d: [10, 14, 18, 22, 30, 38, 42], marketCap: 4200000, traders: 8420, volume: 12400000, liquidity: 1800000, inflows: 8200000, outflows: 3100000, netFlows: 5100000 },
  { symbol: 'PUNCH', name: 'PunchSwap', chain: 'SOL', price: 0.0871, change24h: 92.4, sparkline7d: [40, 42, 50, 55, 64, 78, 87], marketCap: 87100000, traders: 14200, volume: 34500000, liquidity: 8900000, inflows: 22000000, outflows: 11200000, netFlows: 10800000 },
  { symbol: 'WOJAK', name: 'Wojak', chain: 'ETH', price: 0.00183, change24h: 45.8, sparkline7d: [8, 9, 10, 11, 14, 16, 18], marketCap: 18300000, traders: 3200, volume: 5600000, liquidity: 2100000, inflows: 3800000, outflows: 1600000, netFlows: 2200000 },
  { symbol: 'JUP', name: 'Jupiter', chain: 'SOL', price: 0.892, change24h: 12.4, sparkline7d: [70, 72, 75, 78, 80, 85, 89], marketCap: 1240000000, traders: 28400, volume: 89000000, liquidity: 42000000, inflows: 48000000, outflows: 38000000, netFlows: 10000000 },
  { symbol: 'RENDER', name: 'Render', chain: 'SOL', price: 7.42, change24h: 8.2, sparkline7d: [620, 640, 660, 680, 700, 720, 742], marketCap: 3800000000, traders: 18900, volume: 142000000, liquidity: 68000000, inflows: 82000000, outflows: 56000000, netFlows: 26000000 },
  { symbol: 'PENGU', name: 'Pudgy Penguins', chain: 'SOL', price: 0.0124, change24h: -18.4, sparkline7d: [18, 17, 16, 15, 14, 13, 12], marketCap: 780000000, traders: 22100, volume: 68000000, liquidity: 14000000, inflows: 18000000, outflows: 42000000, netFlows: -24000000 },
  { symbol: 'ONDO', name: 'Ondo Finance', chain: 'ETH', price: 1.34, change24h: 6.8, sparkline7d: [110, 112, 118, 122, 126, 130, 134], marketCap: 4100000000, traders: 9800, volume: 98000000, liquidity: 52000000, inflows: 64000000, outflows: 32000000, netFlows: 32000000 },
  { symbol: 'FARTCOIN', name: 'Fartcoin', chain: 'SOL', price: 0.00067, change24h: -42.1, sparkline7d: [14, 12, 10, 8, 7, 6.5, 6.7], marketCap: 670000, traders: 4800, volume: 2800000, liquidity: 420000, inflows: 800000, outflows: 1900000, netFlows: -1100000 },
  { symbol: 'PUMP', name: 'PumpFun', chain: 'SOL', price: 0.0234, change24h: 28.6, sparkline7d: [14, 15, 16, 18, 20, 22, 23], marketCap: 23400000, traders: 12800, volume: 18200000, liquidity: 3400000, inflows: 12000000, outflows: 5800000, netFlows: 6200000 },
  { symbol: 'MPLX', name: 'Metaplex', chain: 'SOL', price: 0.342, change24h: -5.2, sparkline7d: [38, 37, 36, 35, 35, 34, 34], marketCap: 342000000, traders: 6200, volume: 24000000, liquidity: 18000000, inflows: 10000000, outflows: 13000000, netFlows: -3000000 },
  { symbol: 'SOL', name: 'Solana', chain: 'SOL', price: 138.50, change24h: -2.46, sparkline7d: [133, 135, 136, 137, 138, 137, 138], marketCap: 64600000000, traders: 142000, volume: 1400000000, liquidity: 890000000, inflows: 680000000, outflows: 720000000, netFlows: -40000000 },
  { symbol: 'ETH', name: 'Ethereum', chain: 'ETH', price: 2180, change24h: -6.84, sparkline7d: [2350, 2320, 2280, 2240, 2220, 2200, 2180], marketCap: 262000000000, traders: 284000, volume: 14500000000, liquidity: 4200000000, inflows: 6800000000, outflows: 7200000000, netFlows: -400000000 },
  { symbol: 'CATFU', name: 'CatFu', chain: 'SOL', price: 0.000089, change24h: 312.4, sparkline7d: [2, 4, 8, 14, 28, 52, 89], marketCap: 890000, traders: 2400, volume: 4200000, liquidity: 180000, inflows: 3600000, outflows: 420000, netFlows: 3180000 },
  { symbol: 'PIGEON', name: 'Pigeon', chain: 'SOL', price: 0.0156, change24h: 22.8, sparkline7d: [10, 11, 12, 13, 14, 15, 16], marketCap: 15600000, traders: 5600, volume: 8400000, liquidity: 2200000, inflows: 5800000, outflows: 2400000, netFlows: 3400000 },
  { symbol: 'BTC', name: 'Bitcoin', chain: 'BTC', price: 84230, change24h: 7.44, sparkline7d: [81000, 81500, 82000, 82800, 83200, 83800, 84230], marketCap: 1660000000000, traders: 480000, volume: 74200000000, liquidity: 28000000000, inflows: 38000000000, outflows: 34000000000, netFlows: 4000000000 },
]

// ══════════════════════════════════════════════════════════════
// MOST PROFITABLE ADDRESSES — Dashboard wallet table
// ══════════════════════════════════════════════════════════════

export interface MockWallet {
  emoji: string
  label: string
  address: string
  realizedPnl: number
  roi: number
  winRate: number
}

export const MOCK_WALLETS: MockWallet[] = [
  { emoji: '\u{1F98B}', label: 'Wintermute', address: '0x7a3b...4c5d', realizedPnl: 14200000, roi: 342, winRate: 82 },
  { emoji: '\u{1F40B}', label: 'Jump Trading', address: '0x2e1f...8a9b', realizedPnl: 8900000, roi: 218, winRate: 76 },
  { emoji: '\u{1F525}', label: 'Smart Money Alpha', address: '0x9c4d...3e7f', realizedPnl: 6400000, roi: 485, winRate: 71 },
  { emoji: '\u{1F680}', label: 'Degen Whale', address: '0x1b8e...6d2a', realizedPnl: 5200000, roi: 892, winRate: 58 },
  { emoji: '\u{1F3AF}', label: 'Apex Predator', address: '0x4f7c...9a1b', realizedPnl: 4800000, roi: 264, winRate: 78 },
  { emoji: '\u{2728}', label: 'Galaxy Digital', address: '0x6e2d...5c8f', realizedPnl: 3900000, roi: 156, winRate: 84 },
  { emoji: '\u{1F4A1}', label: 'Narrative Surfer', address: '0x8b3a...2d4e', realizedPnl: 3100000, roi: 428, winRate: 65 },
  { emoji: '\u{1F30A}', label: 'Flow Trader', address: '0x5d9e...7f1c', realizedPnl: 2800000, roi: 194, winRate: 72 },
  { emoji: '\u{1F9E0}', label: 'MEV Strategist', address: '0x3c1f...8e4d', realizedPnl: 2400000, roi: 312, winRate: 88 },
  { emoji: '\u{1F48E}', label: 'Diamond Hands', address: '0xa2b7...4f6e', realizedPnl: 1800000, roi: 145, winRate: 62 },
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

// ══════════════════════════════════════════════════════════════
// ANALYST SETUPS
// ══════════════════════════════════════════════════════════════

export interface AnalystSetup {
  analyst: string; initials: string; color: string; token: string; pattern: string
  direction: 'Bullish' | 'Bearish'; entry: string; target: string; stop: string
  timeframe: string; description: string
}

export const MOCK_ANALYST_SETUPS: AnalystSetup[] = [
  { analyst: 'Blake Morrow', initials: 'BM', color: '#2C5F8A', token: 'BTC', pattern: 'Bat Pattern', direction: 'Bullish', entry: '$82,400', target: '$92,000', stop: '$79,500', timeframe: '4H', description: 'Classic bullish bat completion at the 0.886 XA retracement. The PRZ sits right at a confluence zone with the 200 EMA on the 4H and historical volume support. What makes this particularly interesting is the declining volume into point D — exactly what you want to see in a harmonic reversal. The risk/reward ratio of 3.3:1 makes this a high-conviction setup. I\'m scaling in with 50% at $82,400 and adding the other 50% on a confirmed 4H close above $83,500. If BTC loses $79,500 on a closing basis, I\'m flat — no questions asked.' },
  { analyst: 'Nick Groves', initials: 'NG', color: '#5B4F8A', token: 'SOL', pattern: 'Bull Flag', direction: 'Bullish', entry: '$134.50', target: '$158.00', stop: '$128.00', timeframe: '1D', description: 'SOL forming a textbook bull flag after a 40% impulse move from $96 to $140. Volume declining on the pullback confirms this is consolidation, not distribution — exactly the pattern you want to see before the next leg. The flag channel is tight, holding above the 21 EMA on the daily. Breakout above $140 triggers the measured move to $158. I\'m watching Solana DEX volume as a secondary confirmation — if Jupiter volume spikes above $2B on the breakout day, that\'s the green light. The SOL ecosystem narrative is strong with memecoin flows and Firedancer on the horizon.' },
  { analyst: 'Grega Horvat', initials: 'GH', color: '#5B4F8A', token: 'GOLD', pattern: 'Elliott Wave', direction: 'Bullish', entry: '$2,180', target: '$2,450', stop: '$2,120', timeframe: '1W', description: 'Gold is in wave 3 of the primary impulse from the October 2023 low at $1,810. Wave 1 completed at $2,080, wave 2 pulled back to $1,980, and now wave 3 is underway. The key principle here is that wave 3 typically extends 1.618x wave 1 — that projects a target of $2,450. We\'re seeing strong momentum divergence on the weekly RSI, and the commercials (COT data) have been reducing shorts for 6 consecutive weeks. Central bank buying from China, India, and Turkey continues to provide structural support. Invalidation is clean: below $2,120 (wave 1 high) and the count is wrong. Until then, this is one of the cleanest impulse structures I\'ve seen in commodities this year.' },
  { analyst: 'Jack Marshall', initials: 'JM', color: '#4A90C4', token: 'ONDO', pattern: 'Cup & Handle', direction: 'Bullish', entry: '$1.38', target: '$1.85', stop: '$1.25', timeframe: '4H', description: 'ONDO completing a textbook cup and handle on the 4H chart. The cup formed over 3 weeks with the left lip at $1.42, the base at $1.10, and the right lip recovering to $1.40. The handle is now forming with a 38.2% retracement of the cup depth — that\'s the ideal Fibonacci pullback for handles. What gives me extra confidence here is the fundamental backdrop: BlackRock BUIDL crossing $2B AUM and the broader RWA tokenization narrative accelerating. Ondo is the category leader. Breakout above $1.42 on volume confirms the pattern with a measured move to $1.85. I\'m placing my stop at $1.25 — below the handle low and the 200 EMA support.' },
  { analyst: 'Grega Horvat', initials: 'GH', color: '#5B4F8A', token: 'ETH', pattern: 'Elliott Wave', direction: 'Bearish', entry: '$2,180', target: '$1,850', stop: '$2,420', timeframe: '4H', description: 'ETH has entered a wave 4 corrective structure after the impulse wave 3 completed near $2,400. The corrective pattern appears to be an ABC zigzag with wave A completing at $2,050, wave B bouncing to $2,180, and wave C targeting the 0.382 Fib retracement at $1,950-$2,000. On-chain data supports the bearish thesis: Jump Trading just moved $24M ETH to Binance, and the ETH/BTC ratio is at multi-year lows. The Pectra upgrade is still weeks away and unlikely to provide near-term catalyst. I\'m shorting $2,180 with a stop above $2,420 — if wave 3 high is exceeded, the corrective count is invalidated. Target zone is $1,850-$1,950 where the 0.5 Fib and a prior support shelf converge.' },
  { analyst: 'Blake Morrow', initials: 'BM', color: '#2C5F8A', token: 'DXY', pattern: 'Head & Shoulders', direction: 'Bearish', entry: '104.20', target: '101.50', stop: '105.80', timeframe: '1D', description: 'DXY completing a head and shoulders on the daily — one of the most reliable reversal patterns in FX. The left shoulder formed at 104.80, head peaked at 106.20, and the right shoulder is now forming at 104.20. The neckline sits at 103.80. What makes this setup particularly compelling for crypto traders is the macro context: a weakening dollar has historically been the #1 tailwind for risk assets including BTC and crypto broadly. Core PCE comes out Friday — if it prints below 2.6%, the neckline breaks and we get a measured move to 101.50. I\'m positioned short at 104.20 with a stop at 105.80 above the right shoulder. If DXY breaks down, expect BTC to push toward $90K and alts to catch a serious bid.' },
]

export const ANALYST_PERFORMANCE: Record<string, { cumPnl: number[]; trend: string }> = {
  'Blake Morrow': { cumPnl: [0, 220, 180, 420, 650, 580, 810, 1050, 980, 1240], trend: 'up' },
  'Nick Groves': { cumPnl: [0, -80, 120, 350, 280, 510, 680, 720, 890, 1100], trend: 'up' },
  'Grega Horvat': { cumPnl: [0, 150, 310, 280, 180, 340, 290, 420, 380, 450], trend: 'mixed' },
  'Jack Marshall': { cumPnl: [0, -120, -80, 150, 320, 280, 480, 650, 820, 960], trend: 'up' },
}

// ══════════════════════════════════════════════════════════════
// RESEARCH FEED
// ══════════════════════════════════════════════════════════════

export interface ResearchArticle {
  source: string; author: string; title: string; summary: string; body: string
  tokens: string[]; time: string; url: string; readTime: string; pelicanSummary: string
}

export const MOCK_RESEARCH_FEED: ResearchArticle[] = [
  { source: 'The Block', author: 'Frank Chaparro', title: 'Solana DEX volume surpasses Ethereum for third consecutive week amid memecoin surge', summary: 'Solana-based DEXs processed $18.2B in volume last week, outpacing Ethereum DEXs by 34%. Jupiter led with $8.9B.', body: 'Solana-based decentralized exchanges processed $18.2 billion in trading volume last week, outpacing Ethereum-based DEXs by 34% for the third consecutive week, according to data from DefiLlama. Jupiter, the leading Solana DEX aggregator, accounted for $8.9 billion of that total.\n\n"We\'re seeing a structural shift in where retail trading activity happens," said Meow, co-founder of Jupiter. "The combination of sub-cent fees and 400ms finality makes Solana the natural home for high-frequency retail trading."\n\nThe surge has been driven primarily by memecoin activity, with tokens like FAF, Punch Cat, and My Knife Shop generating billions in cumulative volume. Raydium saw its daily active users climb 180% month-over-month.\n\nAnalysts note that while Ethereum still dominates in TVL and institutional DeFi, the trading volume metric signals a meaningful shift in user behavior.', tokens: ['SOL', 'JUP'], time: '2h ago', url: 'https://theblock.co/post/solana-dex-volume', readTime: '4 min', pelicanSummary: 'Solana DEXs processed $18.2B last week vs Ethereum\'s $13.6B — third consecutive week of dominance. Jupiter alone did $7.8B. The driver is memecoin trading on cheap, fast infrastructure. SOL ecosystem tokens (JUP, RAY) benefit from the volume flywheel.' },
  { source: 'Blockworks', author: 'Casey Wagner', title: 'BlackRock BUIDL fund crosses $2B AUM as institutional demand for tokenized treasuries accelerates', summary: 'BlackRock\'s tokenized treasury fund BUIDL has crossed $2B in AUM, making it the largest tokenized real-world asset fund.', body: 'BlackRock\'s BUIDL fund, a tokenized representation of short-term U.S. Treasury bills built on Ethereum, has crossed $2 billion in assets under management, according to on-chain data tracked by RWA.xyz.\n\nThe fund, launched in March 2024 with Securitize, has seen accelerating inflows since the start of 2026. "Institutional demand for on-chain treasuries has exceeded our most optimistic projections," said Robert Mitchnick, BlackRock\'s head of digital assets.\n\nOndo Finance has been a primary beneficiary. ONDO tokens rallied 42% year-to-date as TVL climbed to $890M. "We\'re building the rails for a $30 trillion addressable market," said founder Nathan Allman.\n\nTotal RWA on-chain value has reached $12.8 billion across all categories.', tokens: ['ONDO', 'ETH'], time: '4h ago', url: 'https://blockworks.co/news/blackrock-buidl-fund', readTime: '5 min', pelicanSummary: 'BlackRock BUIDL crossed $2B AUM, growing $200M/month. The real story isn\'t yield (4.8% APY) — it\'s settlement speed and DeFi composability. T-bills as collateral in lending protocols at any hour. Bullish for ONDO and tokenization sector broadly.' },
  { source: 'Messari', author: 'Kunal Goel', title: 'Q1 2026 DeFi report: lending protocols see 340% TVL growth driven by restaking narratives', summary: 'DeFi lending TVL surged 340% in Q1, with EigenLayer and liquid restaking driving the majority of new capital inflows.', body: 'The DeFi lending sector experienced explosive growth in Q1 2026, with TVL surging 340% from $8.2B to $36.1B. The growth was driven almost entirely by restaking narratives centered around EigenLayer.\n\nEigenLayer\'s TVL alone grew from $2.1B to $18.4B during the quarter. Liquid restaking protocols like EtherFi and Renzo captured significant market share.\n\n"Restaking has created a new yield primitive," wrote analyst Kunal Goel. "The compounding effect of staking yield plus restaking rewards has created a flywheel attracting capital from traditional DeFi lending markets."\n\nCritics warn about recursive leverage risks, noting parallels to Terra/Luna. Proponents argue restaking is backed by real economic security.', tokens: ['ETH', 'SOL'], time: '6h ago', url: 'https://messari.io/report/q1-2026-defi', readTime: '8 min', pelicanSummary: 'DeFi lending TVL grew 340% in Q1 2026 to $36.1B, driven almost entirely by restaking. EigenLayer TVL alone hit $18.4B. Risk: recursive restaking is leveraged yield — any disruption to ETH staking rewards could cascade.' },
  { source: 'Delphi Digital', author: 'Ceteris', title: 'Prediction markets reach $4.2B in open interest — Polymarket dominates with 78% market share', summary: 'Prediction market OI hit an all-time high of $4.2B, with Polymarket controlling 78% following expansion into financial contracts.', body: 'The prediction market sector has reached $4.2 billion in total open interest, a new ATH, driven by Polymarket\'s expansion into financial and macroeconomic contracts. The platform commands 78% market share, up from 62% at end of 2025.\n\n"Prediction markets are becoming the de facto price discovery mechanism for probabilistic events," wrote Delphi researcher Ceteris. "Traders increasingly look at Polymarket before traditional derivatives markets."\n\nThe financial contracts vertical, launched January 2026, has been the primary growth driver. Contracts on Fed decisions, stock price targets, and crypto milestones now account for 45% of total volume.\n\nCompetitors including Kalshi have struggled to keep pace, though Kalshi\'s regulatory status gives it an edge with institutional participants.', tokens: ['ETH'], time: '8h ago', url: 'https://members.delphidigital.io/prediction-markets', readTime: '6 min', pelicanSummary: 'Prediction market OI hit $4.2B. Polymarket controls 78% with $3.28B. Financial contracts (Fed decisions, stock targets) now 45% of volume. For traders: Polymarket probabilities are becoming a leading indicator — track extreme readings as contrarian signals.' },
  { source: 'Arkham Intel', author: 'Arkham Research', title: 'Whale alert: Jump Trading moves 12,400 ETH ($24.2M) to Binance — potential distribution event', summary: 'Jump Trading transferred 12,400 ETH worth $24.2M to Binance. Historical patterns suggest potential selling pressure.', body: 'Jump Trading moved 12,400 ETH ($24.2M) to Binance in a single transaction at 2:14 PM UTC today, according to Arkham Intelligence tracking.\n\nThe transfer originated from Jump\'s primary treasury wallet (0x2e1f...8a9b), which still holds ~48,200 ETH ($93.6M). Historical analysis shows 7 of their last 10 major Binance deposits preceded selling within 24-48 hours.\n\n"This is a significant deposit relative to Jump\'s recent activity," noted Arkham\'s research team. "Their last deposit of this size in February preceded a 3.2% ETH price decline over 48 hours."\n\nNot all deposits indicate selling intent, but the size and timing during elevated ETH volatility warrants close monitoring.', tokens: ['ETH'], time: '1h ago', url: 'https://intel.arkm.com/whale-alert-jump', readTime: '3 min', pelicanSummary: 'Jump Trading deposited $24.2M ETH to Binance. Historical pattern: Jump exchange deposits precede selling within 24-48h with 70% accuracy. Average post-deposit price impact is -2-3% within 24 hours. Monitor ETH closely in the next 48 hours.' },
  { source: 'CoinDesk', author: 'Sam Reynolds', title: 'Bitcoin mining difficulty hits all-time high as hashrate surges 23% post-halving adjustment', summary: 'Bitcoin mining difficulty reached a record 92.4T after hashrate surged 23% from the post-halving low.', body: 'Bitcoin mining difficulty has reached an all-time high of 92.4 trillion, marking a 23% increase from the post-halving low as miners bring new-generation ASIC hardware online.\n\nThe hashrate surge has been driven by next-generation rigs from Bitmain and MicroBT. "The S21 Pro delivers 2.5x the hashrate per watt compared to previous gen," said Jihan Wu, Bitmain co-founder.\n\nDespite the difficulty increase, mining profitability remains attractive due to Bitcoin\'s price recovery above $84,000. Marathon Digital and Riot Platforms both reported positive mining margins.\n\n"Miners are making massive capital investments in new hardware, signaling long-term confidence," said Luxor Technology\'s Colin Harper.', tokens: ['BTC'], time: '3h ago', url: 'https://coindesk.com/mining-difficulty-ath', readTime: '4 min', pelicanSummary: 'Bitcoin mining difficulty hit ATH at 92.4T, hashrate up 23% post-halving. Miners deploying massive capex in new ASIC hardware despite halved rewards — they\'re pricing in BTC well above $100K. Marathon and Riot both reporting positive margins.' },
]

// ══════════════════════════════════════════════════════════════
// X FEED
// ══════════════════════════════════════════════════════════════

export interface XPost {
  handle: string; displayName: string; verified: boolean; profileHue: number
  text: string; likes: number; retweets: number; replies: number; time: string; tweetUrl: string
}

export const MOCK_X_FEED: XPost[] = [
  { handle: 'CryptoHayes', displayName: 'Arthur Hayes', verified: true, profileHue: 35, text: '$BTC at 84K and people are still bearish? The yield curve disinversion + weakening DXY is the exact setup that preceded every major crypto bull run since 2016. We\'re going to 150K.', likes: 8420, retweets: 2890, replies: 1820, time: '45m', tweetUrl: 'https://x.com/CryptoHayes/status/1903842156789' },
  { handle: 'Pentosh1', displayName: 'Pentoshi', verified: true, profileHue: 220, text: '$SOL weekly chart is one of the cleanest bull flags I\'ve ever seen. 12 weeks of consolidation after a 340% run. When this breaks out, $200 is conservative.', likes: 4210, retweets: 1340, replies: 890, time: '1h', tweetUrl: 'https://x.com/Pentosh1/status/1903841289456' },
  { handle: 'HsakaTrades', displayName: 'Hsaka', verified: true, profileHue: 180, text: 'The $ETH / $BTC ratio is at levels not seen since 2020. Either ETH is criminally undervalued or the market is telling us something about L1 dominance. Accumulating here.', likes: 3890, retweets: 1120, replies: 745, time: '2h', tweetUrl: 'https://x.com/HsakaTrades/status/1903840234567' },
  { handle: 'GCRClassic', displayName: 'GCR', verified: false, profileHue: 280, text: 'prediction markets pricing fed at 96% no change in april. the 4% tail risk is where the alpha is. what happens if cpi comes in hot and they hike? nobody is positioned for this.', likes: 6720, retweets: 2340, replies: 1560, time: '3h', tweetUrl: 'https://x.com/GCRClassic/status/1903839178901' },
  { handle: 'inversebrah', displayName: 'inversebrah', verified: false, profileHue: 120, text: 'local top signal: my uber driver asked me about $FAF token. time to start scaling out of memecoins into majors. this is not a drill.', likes: 9100, retweets: 3200, replies: 1800, time: '4h', tweetUrl: 'https://x.com/inversebrah/status/1903838067890' },
  { handle: 'EmperorBTC', displayName: 'Emperor', verified: true, profileHue: 45, text: 'Volume profile on $BTC daily: massive low volume node between 86K-89K. Once we break 85K, there\'s almost no resistance until 90K. This is a vacuum.', likes: 3420, retweets: 980, replies: 620, time: '5h', tweetUrl: 'https://x.com/EmperorBTC/status/1903837012345' },
  { handle: 'MustStopMurad', displayName: 'Murad', verified: true, profileHue: 340, text: 'memecoins are not a phase. they are the financialization of culture itself. $WOJAK $PUNCH $FAF — these are not tokens, they are communities with a cap table.', likes: 5670, retweets: 1890, replies: 1230, time: '6h', tweetUrl: 'https://x.com/MustStopMurad/status/1903836098765' },
  { handle: 'Rewkang', displayName: 'Andrew Kang', verified: true, profileHue: 200, text: '$ONDO is the best risk/reward in crypto right now. Tokenized treasuries are a $30T addressable market. BlackRock just crossed $2B AUM in BUIDL. $10 is programmed.', likes: 4890, retweets: 1670, replies: 980, time: '8h', tweetUrl: 'https://x.com/Rewkang/status/1903835087654' },
  { handle: 'CryptoKaleo', displayName: 'Kaleo', verified: true, profileHue: 160, text: 'My $SOL long from $92 is the best trade I\'ve made this cycle. Still holding. Target remains $250. If you\'re not in SOL ecosystem you\'re ngmi.', likes: 2890, retweets: 780, replies: 540, time: '10h', tweetUrl: 'https://x.com/CryptoKaleo/status/1903834076543' },
  { handle: 'zaborack', displayName: 'Nick Groves', verified: true, profileHue: 260, text: 'Published new $SOL bull flag setup on Token Analytix. Entry at $134.50, target $158. The Pelican AI synthesis is honestly better than most analyst reports. Go check it.', likes: 1240, retweets: 340, replies: 210, time: '12h', tweetUrl: 'https://x.com/zaborack/status/1903833065432' },
]

// ══════════════════════════════════════════════════════════════
// PREDICTION CARDS
// ══════════════════════════════════════════════════════════════

export interface PredictionCard {
  id: string; icon: string; question: string
  outcomes: { label: string; probability: number }[]
  volume: string; expiry: string; resolution: string; category: string; isContrarian: boolean
}

export const MOCK_PREDICTION_CARDS: PredictionCard[] = [
  { id: 'pred-1', icon: 'B', question: 'Will BTC close above $90K end of March?', outcomes: [{ label: '$85K', probability: 89 }, { label: '$90K', probability: 72 }], volume: '$14.2M', expiry: 'Mar 31', resolution: 'Monthly', category: 'crypto', isContrarian: false },
  { id: 'pred-2', icon: 'F', question: 'Fed decision in April?', outcomes: [{ label: 'No change', probability: 96 }, { label: '25bp cut', probability: 4 }], volume: '$8.9M', expiry: 'Apr 30', resolution: 'Monthly', category: 'macro', isContrarian: false },
  { id: 'pred-3', icon: 'A', question: 'Will AAPL close above $220 end of March?', outcomes: [{ label: '$220', probability: 58 }, { label: '$210', probability: 81 }], volume: '$5.1M', expiry: 'Mar 31', resolution: 'Monthly', category: 'stocks', isContrarian: false },
  { id: 'pred-4', icon: 'B', question: 'BTC drop below $65K in March?', outcomes: [{ label: 'Yes', probability: 41 }, { label: 'No', probability: 59 }], volume: '$3.8M', expiry: 'Mar 31', resolution: 'Monthly', category: 'crypto', isContrarian: true },
  { id: 'pred-5', icon: 'S', question: 'SEC approve SOL ETF by June?', outcomes: [{ label: 'Yes', probability: 28 }, { label: 'No', probability: 72 }], volume: '$2.4M', expiry: 'Jun 30', resolution: 'Monthly', category: 'regulatory', isContrarian: false },
  { id: 'pred-6', icon: 'N', question: 'What will NVDA hit in March 2026?', outcomes: [{ label: '$200+', probability: 24 }, { label: '$164', probability: 62 }], volume: '$6.7M', expiry: 'Mar 31', resolution: 'Monthly', category: 'stocks', isContrarian: false },
  { id: 'pred-7', icon: 'G', question: 'Will Google close above $260 end of March?', outcomes: [{ label: '$260', probability: 44 }, { label: '$250', probability: 71 }], volume: '$4.2M', expiry: 'Mar 31', resolution: 'Monthly', category: 'stocks', isContrarian: false },
  { id: 'pred-8', icon: 'E', question: 'ETH hit $2,400 in March?', outcomes: [{ label: 'Yes', probability: 32 }, { label: 'No', probability: 68 }], volume: '$3.1M', expiry: 'Mar 31', resolution: 'Monthly', category: 'crypto', isContrarian: true },
  { id: 'pred-9', icon: 'S', question: 'What will S&P 500 hit by end of March?', outcomes: [{ label: '$6,400+', probability: 35 }, { label: '$6,300', probability: 56 }], volume: '$9.4M', expiry: 'Mar 31', resolution: 'Monthly', category: 'macro', isContrarian: false },
  { id: 'pred-10', icon: 'M', question: 'Will MSFT finish week above $340?', outcomes: [{ label: '$340', probability: 99 }, { label: '$330', probability: 99 }], volume: '$1.2M', expiry: 'Mar 28', resolution: 'Weekly', category: 'stocks', isContrarian: false },
  { id: 'pred-11', icon: 'F', question: 'Fed rate hike in 2026?', outcomes: [{ label: 'Yes', probability: 18 }, { label: 'No', probability: 82 }], volume: '$7.8M', expiry: 'Dec 31', resolution: 'Monthly', category: 'macro', isContrarian: false },
  { id: 'pred-12', icon: 'T', question: 'Trump crypto executive order Q2?', outcomes: [{ label: 'Yes', probability: 64 }, { label: 'No', probability: 36 }], volume: '$11.3M', expiry: 'Jun 30', resolution: 'Monthly', category: 'geopolitical', isContrarian: false },
]

// ══════════════════════════════════════════════════════════════
// SMART ALERTS
// ══════════════════════════════════════════════════════════════

export interface AlertRow {
  token: string; type: 'Price' | 'On-Chain' | 'Technical' | 'Prediction' | 'Convergence'
  condition: string; status: 'Armed' | 'Triggered'; severity: 'High' | 'Medium' | 'Low'
  created: string; triggeredAt?: string; postTriggerAnalysis?: string
}

export const MOCK_SMART_ALERTS: AlertRow[] = [
  { token: 'BTC', type: 'Price', condition: 'BTC crosses above $85,000', status: 'Armed', severity: 'High', created: 'Mar 24' },
  { token: 'ETH', type: 'On-Chain', condition: 'Jump Trading deposits >10K ETH to exchange', status: 'Triggered', severity: 'High', created: 'Mar 22', triggeredAt: 'Mar 25, 2:14 PM', postTriggerAnalysis: 'Jump Trading deposited 12,400 ETH ($24.2M) to Binance. Historically, Jump exchange deposits precede selling within 24-48h. ETH price dropped 2.1% in the hour following.' },
  { token: 'SOL', type: 'Technical', condition: 'SOL 50 EMA crosses above 200 EMA (Golden Cross)', status: 'Armed', severity: 'Medium', created: 'Mar 23' },
  { token: 'BTC', type: 'Prediction', condition: 'BTC $90K March probability drops below 65%', status: 'Armed', severity: 'Medium', created: 'Mar 24' },
  { token: 'ONDO', type: 'Price', condition: 'ONDO breaks above $1.50 with volume >$200M', status: 'Armed', severity: 'High', created: 'Mar 25' },
  { token: 'ETH', type: 'Convergence', condition: '3+ smart money wallets buying ETH within 4 hours', status: 'Triggered', severity: 'High', created: 'Mar 21', triggeredAt: 'Mar 24, 8:42 AM', postTriggerAnalysis: 'Galaxy Digital, Wintermute, and an unnamed whale accumulated ETH within 3 hours totaling $62M. ETH rallied 4.2% over 12 hours before pulling back.' },
  { token: 'SOL', type: 'On-Chain', condition: 'New SOL wallet accumulates >$5M in 24h', status: 'Armed', severity: 'Low', created: 'Mar 25' },
  { token: 'FAF', type: 'Price', condition: 'FAF market cap exceeds $1M', status: 'Armed', severity: 'Low', created: 'Mar 25' },
  { token: 'BTC', type: 'Technical', condition: 'BTC RSI(14) enters overbought >70 on 4H', status: 'Triggered', severity: 'Medium', created: 'Mar 20', triggeredAt: 'Mar 25, 11:30 AM', postTriggerAnalysis: 'BTC RSI hit 72.4 on 4H during push to $84,230. Previous overbought readings led to 3-5% pullbacks within 48h in 7 of 10 occurrences.' },
  { token: 'DXY', type: 'Technical', condition: 'DXY breaks below 103.80 support', status: 'Armed', severity: 'High', created: 'Mar 25' },
]

// ══════════════════════════════════════════════════════════════
// SMART MONEY — TOP TOKENS & TRADES
// ══════════════════════════════════════════════════════════════

export interface TopTokenTrading {
  chain: string; symbol: string; name: string; flows24h: number; flows7d: number
  flows30d: number; traders: number; tokenAge: number; mcap: number
}
export interface TopTokenHolding {
  chain: string; symbol: string; name: string; balance: number; balanceChange24h: number
  shareOfHoldings: number; holders: number; mcap: number
}
export interface SmartMoneyTrade {
  walletLabel: string; walletAddress: string; direction: 'Buy' | 'Sell'
  token: string; amount: string; price: string; time: string
}

export const MOCK_TOP_TOKENS_TRADING: TopTokenTrading[] = [
  { chain: 'SOL', symbol: 'JUP', name: 'Jupiter', flows24h: 52000000, flows7d: 180000000, flows30d: 420000000, traders: 12450, tokenAge: 420, mcap: 1720000000 },
  { chain: 'SOL', symbol: 'FAF', name: 'FAF Token', flows24h: 1450000, flows7d: 8200000, flows30d: -2100000, traders: 1842, tokenAge: 14, mcap: 390000 },
  { chain: 'SOL', symbol: 'KNIFE', name: 'My Knife Shop', flows24h: 8900000, flows7d: 21000000, flows30d: 21000000, traders: 4521, tokenAge: 3, mcap: 89000 },
  { chain: 'SOL', symbol: 'PIGEON', name: 'Pigeon', flows24h: 3200000, flows7d: 12000000, flows30d: 28000000, traders: 2156, tokenAge: 45, mcap: 8900000 },
  { chain: 'SOL', symbol: 'LAYOFF', name: 'Layoff', flows24h: 4500000, flows7d: 15000000, flows30d: -8900000, traders: 2890, tokenAge: 7, mcap: 230000 },
  { chain: 'ETH', symbol: 'ONDO', name: 'Ondo Finance', flows24h: 78000000, flows7d: 210000000, flows30d: 560000000, traders: 8920, tokenAge: 890, mcap: 2140000000 },
  { chain: 'SOL', symbol: 'PUNCH', name: 'Punch Cat', flows24h: 890000, flows7d: -4200000, flows30d: -12000000, traders: 3214, tokenAge: 28, mcap: 1230000 },
  { chain: 'SOL', symbol: 'MS2', name: 'MS2', flows24h: 2100000, flows7d: 9800000, flows30d: 14000000, traders: 1678, tokenAge: 12, mcap: 1560000 },
  { chain: 'SOL', symbol: 'VNUT', name: 'Virtual Nut', flows24h: 1200000, flows7d: 5400000, flows30d: 8200000, traders: 1203, tokenAge: 21, mcap: 670000 },
  { chain: 'SOL', symbol: 'SAMBA', name: 'Samba', flows24h: 1100000, flows7d: 4800000, flows30d: 11000000, traders: 934, tokenAge: 35, mcap: 5670000 },
  { chain: 'SOL', symbol: 'WOJAK', name: 'Wojak', flows24h: 420000, flows7d: 2100000, flows30d: 5600000, traders: 892, tokenAge: 180, mcap: 4580000 },
  { chain: 'SOL', symbol: 'VDOR', name: 'Vendoor', flows24h: 680000, flows7d: 3200000, flows30d: 7800000, traders: 789, tokenAge: 42, mcap: 1890000 },
]

export const MOCK_TOP_TOKENS_HOLDING: TopTokenHolding[] = [
  { chain: 'SOL', symbol: 'JUP', name: 'Jupiter', balance: 42000000, balanceChange24h: 2.4, shareOfHoldings: 18.2, holders: 4520, mcap: 1720000000 },
  { chain: 'SOL', symbol: 'PENGU', name: 'Pudgy Penguins', balance: 28000000, balanceChange24h: -1.8, shareOfHoldings: 12.1, holders: 3210, mcap: 890000000 },
  { chain: 'ETH', symbol: 'META', name: 'Meta Protocol', balance: 19000000, balanceChange24h: 5.2, shareOfHoldings: 8.2, holders: 1890, mcap: 450000000 },
  { chain: 'SOL', symbol: 'RENDER', name: 'Render Network', balance: 15000000, balanceChange24h: 0.8, shareOfHoldings: 6.5, holders: 2340, mcap: 3200000000 },
  { chain: 'SOL', symbol: 'PUMP', name: 'PumpFun', balance: 12000000, balanceChange24h: 12.4, shareOfHoldings: 5.2, holders: 5670, mcap: 120000000 },
  { chain: 'SOL', symbol: 'FARTCOIN', name: 'Fartcoin', balance: 8900000, balanceChange24h: -4.2, shareOfHoldings: 3.8, holders: 8920, mcap: 340000000 },
  { chain: 'SOL', symbol: 'MPLX', name: 'Metaplex', balance: 7200000, balanceChange24h: 1.1, shareOfHoldings: 3.1, holders: 1560, mcap: 210000000 },
  { chain: 'SOL', symbol: 'WOJAK', name: 'Wojak', balance: 5400000, balanceChange24h: 8.6, shareOfHoldings: 2.3, holders: 892, mcap: 4580000 },
  { chain: 'ETH', symbol: 'ONDO', name: 'Ondo Finance', balance: 4800000, balanceChange24h: 3.2, shareOfHoldings: 2.1, holders: 3450, mcap: 2140000000 },
  { chain: 'SOL', symbol: 'PIGEON', name: 'Pigeon', balance: 3200000, balanceChange24h: 6.8, shareOfHoldings: 1.4, holders: 1240, mcap: 8900000 },
]

export const MOCK_RECENT_TRADES: SmartMoneyTrade[] = [
  { walletLabel: '30D Smart Trader', walletAddress: '7xKp...4mNd', direction: 'Buy', token: 'JUP', amount: '$142,000', price: '$1.24', time: '2m ago' },
  { walletLabel: 'DEX Whale', walletAddress: '3bRt...9hYz', direction: 'Sell', token: 'FAF', amount: '$89,000', price: '$0.000390', time: '5m ago' },
  { walletLabel: 'Sniper Bot', walletAddress: '5nPq...8wXy', direction: 'Buy', token: 'KNIFE', amount: '$45,000', price: '$0.000089', time: '8m ago' },
  { walletLabel: 'Early Adopter', walletAddress: '9fGh...2kLm', direction: 'Buy', token: 'PIGEON', amount: '$67,000', price: '$0.008900', time: '12m ago' },
  { walletLabel: 'MEV Hunter', walletAddress: '6kLi...3sTx', direction: 'Sell', token: 'PUNCH', amount: '$23,000', price: '$0.001230', time: '15m ago' },
  { walletLabel: 'Degen King', walletAddress: '2cFe...6jRs', direction: 'Buy', token: 'LAYOFF', amount: '$34,000', price: '$0.000230', time: '18m ago' },
  { walletLabel: '30D Smart Trader', walletAddress: '7xKp...4mNd', direction: 'Sell', token: 'WOJAK', amount: '$28,000', price: '$0.004580', time: '22m ago' },
  { walletLabel: 'Copy Trader Alpha', walletAddress: '8mBa...1pQu', direction: 'Buy', token: 'ONDO', amount: '$180,000', price: '$1.42', time: '25m ago' },
  { walletLabel: 'Quiet Accumulator', walletAddress: '1aNc...5uRw', direction: 'Buy', token: 'JUP', amount: '$95,000', price: '$1.24', time: '31m ago' },
  { walletLabel: 'NFT Flipper', walletAddress: '4hDg...7nWv', direction: 'Sell', token: 'VNUT', amount: '$12,000', price: '$0.000670', time: '35m ago' },
  { walletLabel: 'Sniper Bot', walletAddress: '5nPq...8wXy', direction: 'Buy', token: 'MS2', amount: '$56,000', price: '$0.001560', time: '42m ago' },
  { walletLabel: 'Momentum Rider', walletAddress: '3gMf...2xQz', direction: 'Sell', token: 'SAMBA', amount: '$19,000', price: '$0.005670', time: '48m ago' },
  { walletLabel: 'DEX Whale', walletAddress: '3bRt...9hYz', direction: 'Buy', token: 'PIGEON', amount: '$210,000', price: '$0.008900', time: '55m ago' },
  { walletLabel: 'Airdrop Farmer', walletAddress: '0eJb...9vPy', direction: 'Sell', token: 'SPAWN', amount: '$8,500', price: '$0.003210', time: '1h ago' },
  { walletLabel: 'Diamond Hands', walletAddress: '7iOh...4zSa', direction: 'Buy', token: 'BTC', amount: '$420,000', price: '$84,230', time: '1h ago' },
]

// ══════════════════════════════════════════════════════════════
// CALENDAR EVENTS
// ══════════════════════════════════════════════════════════════

export interface CalendarEvent {
  date: string; dayOfWeek: string; type: 'macro' | 'crypto' | 'prediction' | 'tokenization'
  title: string; time: string; impact: 'High' | 'Medium' | 'Low'
  pelicanBrief: string
}

export const CALENDAR_EVENTS: CalendarEvent[] = [
  { date: '2026-03-27', dayOfWeek: 'THU', type: 'macro', title: 'FOMC Meeting Minutes', time: '2:00 PM ET', impact: 'High', pelicanBrief: 'Markets looking for balance sheet language. Hawkish surprise could push 10Y above 4.50%.' },
  { date: '2026-03-28', dayOfWeek: 'FRI', type: 'macro', title: 'Core PCE Inflation (Feb)', time: '8:30 AM ET', impact: 'High', pelicanBrief: 'Consensus 2.7% YoY. Hot >2.8% = repriced rate odds. Cool <2.6% = risk-on accelerates.' },
  { date: '2026-03-29', dayOfWeek: 'SAT', type: 'crypto', title: 'Arbitrum ARB Token Unlock — 92.6M tokens', time: '12:00 UTC', impact: 'Medium', pelicanBrief: 'Large unlock vs daily volume. Historically 5-8% dip in first 48h.' },
  { date: '2026-03-31', dayOfWeek: 'MON', type: 'prediction', title: 'BTC $65K March Contract Expires', time: '11:59 PM UTC', impact: 'High', pelicanBrief: '$57M volume resolving. Watch for new April/May contracts.' },
  { date: '2026-04-01', dayOfWeek: 'TUE', type: 'tokenization', title: 'Nasdaq Tokenized Stock Trading Begins', time: 'Market Open', impact: 'High', pelicanBrief: 'First regulated exchange with tokenized equities. Watch ONDO, MKR.' },
  { date: '2026-04-04', dayOfWeek: 'FRI', type: 'macro', title: 'Non-Farm Payrolls (March)', time: '8:30 AM ET', impact: 'High', pelicanBrief: 'Consensus +185K. Hot = bearish risk. Weak = cuts back on table.' },
  { date: '2026-04-10', dayOfWeek: 'THU', type: 'macro', title: 'CPI Inflation (March)', time: '8:30 AM ET', impact: 'High', pelicanBrief: 'Consensus 2.9% YoY. Above 3% devastating. Below 2.7% reprices cut odds.' },
  { date: '2026-04-15', dayOfWeek: 'TUE', type: 'crypto', title: 'Ethereum Pectra Upgrade', time: 'TBD', impact: 'Medium', pelicanBrief: 'Account abstraction and validator improvements. Could catalyze ETH momentum.' },
]

// ══════════════════════════════════════════════════════════════
// PELICAN SYNTHESES
// ══════════════════════════════════════════════════════════════

export const PELICAN_SYNTHESES = {
  tokenAnalysis: (symbol: string) => `Analyzing ${symbol} across on-chain metrics, smart money flows, and technical indicators. This token has seen significant activity from tracked wallets in the past 24 hours. The flow data suggests accumulation patterns consistent with early-stage positioning by informed traders.`,
  walletAnalysis: (label: string) => `${label} has demonstrated consistent alpha generation over the trailing 30-day period. Trading patterns suggest a systematic approach with defined risk parameters. Recent activity shows concentration in Solana ecosystem tokens.`,
  setupAnalysis: (analyst: string, pattern: string) => `${analyst}'s ${pattern} setup aligns with the current market structure. Historical backtesting shows a 68% success rate over 12 months. The risk/reward ratio exceeds the minimum 2:1 threshold for institutional consideration.`,
  predictionAnalysis: (question: string) => `Market participants are pricing this outcome with moderate conviction. Historical accuracy of prediction markets for similar questions sits at approximately 74%. Key catalysts that could shift probabilities include macro data releases and regulatory announcements.`,
  triggeredAlert: (condition: string) => `Alert condition met: ${condition}. Post-trigger analysis shows this event has historically preceded a 2-4% price movement within 24-48 hours in 7 of the last 10 occurrences.`,
}
