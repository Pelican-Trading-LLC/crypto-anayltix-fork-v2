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
    id: 'rwa', name: 'RWA', velocity: 2.5,
    volume: 900000000, volume_change_7d: 22,
    smart_money_flow: 78000000, market_cap: 18000000000, mcap_change_7d: 8.6,
    top_tokens: [{ symbol: 'ONDO', change_7d: 12.4 }, { symbol: 'PENDLE', change_7d: 8.8 }, { symbol: 'MKR', change_7d: 5.2 }],
    sparkline_7d: [100, 101, 103, 105, 108, 110, 112],
    status: 'stealth_accumulation',
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
  headline: 'Capital is rotating out of Memecoins and L2s and flooding directly into AI / Compute and GameFi.',
  body: 'GameFi is showing the highest "stealth" velocity. Price action is muted, but smart money inflows have spiked 300% this week. Whales are front-running an upcoming narrative shift — likely tied to the GDC gaming conference announcements next week. AI / Compute continues its 3-week accumulation trend with TAO and AKT leading. L2 tokens seeing consistent smart money outflows as the "L2 summer" narrative fades. Memecoins in full retreat: $310M in smart money exits, volume down 32%, and funding rates on WIF/PEPE still dangerously elevated despite the selloff.',
  flows: [
    { from: 'Memecoins', to: 'AI / Compute', amount: 142000000 },
    { from: 'L2 / L3 Scaling', to: 'GameFi', amount: 85000000 },
    { from: 'Memecoins', to: 'RWA', amount: 64000000 },
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

export const PROTOCOL_CATEGORIES = ['All', 'Lending', 'DEX', 'LSD', 'Restaking', 'Yield/Deriv', 'Perp DEX', 'Stable/Yield', 'Bridge', 'L2', 'Oracle', 'Compute', 'NFT'] as const

export const CATEGORY_COLORS: Record<string, string> = {
  Lending: '#1DA1C4', DEX: '#A78BFA', LSD: '#F59E0B', Restaking: '#22C55E',
  'Yield/Deriv': '#EC4899', 'Perp DEX': '#EF4444', 'Stable/Yield': '#6366F1',
  Bridge: '#F97316', L2: '#06B6D4', Oracle: '#8B5CF6', Compute: '#14B8A6', NFT: '#E879F9',
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
]

// ══════════════════════════════════════════════════════════════
// INTELLIGENCE ALERTS — Contextual notification system
// ══════════════════════════════════════════════════════════════

export type AlertCategory = 'onchain_anomaly' | 'derivatives_warning' | 'smart_money' | 'unlock_vesting' | 'portfolio_relative' | 'cross_asset'

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
}

export const MOCK_ALERTS: IntelAlert[] = [
  { id: 'a1', category: 'onchain_anomaly', severity: 'high', title: '$14M of $LDO just moved to Binance', body: 'Largest single inflow in 90 days. Expect heavy sell pressure. Previous inflows of this size preceded 8-15% drops within 48 hours.', affected_assets: ['LDO', 'ETH'], timestamp: '15m ago', read: false },
  { id: 'a2', category: 'derivatives_warning', severity: 'high', title: 'WIF funding rate hit +150% annualized', body: 'Funding rate for $WIF hit +0.045% per 8h. OI at ATHs. Longs trapped. Liquidation cascade risk extreme. Previous instances at this level saw 20-40% corrections within 72 hours.', affected_assets: ['WIF'], timestamp: '2h ago', read: false },
  { id: 'a3', category: 'smart_money', severity: 'medium', title: '3 Apex Predator wallets entered $AERO', body: 'Combined 71% hit rate on Base ecosystem plays. Average entry-to-peak time: 18 days. These wallets have historically front-run narrative shifts by 1-2 weeks.', affected_assets: ['AERO'], timestamp: '4h ago', read: false },
  { id: 'a4', category: 'unlock_vesting', severity: 'high', title: 'SOL unlock in 5 days — $400M', body: '2.8% of circulating supply from early investor vesting. Previous SOL unlocks of this magnitude caused 12-18% drawdowns followed by recovery within 14 days. Consider hedging or reducing exposure.', affected_assets: ['SOL'], timestamp: '6h ago', read: true },
  { id: 'a5', category: 'portfolio_relative', severity: 'medium', title: 'BTC now 66% of your portfolio', body: 'Your BTC allocation hit 66% due to price appreciation. This is a concentration risk — consider rebalancing if your target allocation is lower. A 10% BTC correction would impact your portfolio by 6.6%.', affected_assets: ['BTC'], timestamp: '8h ago', read: true },
  { id: 'a6', category: 'cross_asset', severity: 'medium', title: 'Blake Morrow flagged risk-off shift', body: 'ForexAnalytix: CPI print came in hot at 3.4%. Fed likely to hold rates higher for longer. DXY breaking 105 support. Pelican Translation: Risk assets about to get repriced. Expect outflows from high-beta sectors like Memecoins and AI. Move to stables or delta-neutral farms until macro settles.', affected_assets: ['BTC', 'ETH', 'SOL'], timestamp: '12h ago', read: true },
  { id: 'a7', category: 'onchain_anomaly', severity: 'low', title: 'Unusual Aave utilization spike on USDC', body: 'USDC utilization on Aave Ethereum hit 92%. Borrow rates spiked to 18% APY. This typically attracts new deposits within 24-48 hours and normalizes rates. Could signal upcoming large borrowing event.', affected_assets: ['AAVE', 'USDC'], timestamp: '14h ago', read: true },
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
