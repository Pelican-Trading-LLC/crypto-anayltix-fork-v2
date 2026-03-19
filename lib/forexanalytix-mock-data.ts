// ══════════════════════════════════════════════════════════════
// FOREXANALYTIX — Mock Data for Blake Demo
// Analyst profiles, PiPs, traffic light, FACE, podcast, blog
// ══════════════════════════════════════════════════════════════

export interface FAAnalyst {
  id: string
  name: string
  role: string
  methodology: string
  color: string
  initials: string
  bio: string
}

export const FA_ANALYSTS: FAAnalyst[] = [
  { id: 'blake', name: 'Blake Morrow', role: 'CEO & Head Analyst', methodology: 'Macro / Harmonic', color: '#2A5ADA', initials: 'BM', bio: '20+ years FX analysis. Former institutional trader. Specializes in macro-driven harmonic patterns.' },
  { id: 'grega', name: 'Grega Horvat', role: 'Senior Analyst', methodology: 'Elliott Wave', color: '#9945FF', initials: 'GH', bio: 'Elliott Wave specialist with 15+ years experience. Published author on wave theory.' },
  { id: 'dale', name: 'Dale Pinkert', role: 'Sentiment Analyst', methodology: 'Sentiment / COT', color: '#22C55E', initials: 'DP', bio: 'Former FX desk trader. Specializes in COT data and sentiment positioning.' },
  { id: 'joel', name: 'Joel Kruger', role: 'Technical Strategist', methodology: 'Institutional Flow', color: '#F59E0B', initials: 'JK', bio: 'Former currency strategist at major banks. Focuses on institutional order flow.' },
]

// ── PiP Signals (Points in Play) ──────────────────────────────

export interface FAPiP {
  id: string
  analyst_id: string
  analyst_name: string
  analyst_color: string
  analyst_initials: string
  asset: string
  asset_class: 'forex' | 'crypto' | 'commodity' | 'index'
  direction: 'BULLISH' | 'BEARISH'
  methodology: string
  title: string
  body: string
  key_levels: { entry: string; target: string; stop: string }
  confidence: number
  timestamp: string
  status: 'active' | 'hit_target' | 'stopped_out'
  crypto_translation?: string
}

export const FA_PIPS: FAPiP[] = [
  {
    id: 'pip1', analyst_id: 'blake', analyst_name: 'Blake Morrow', analyst_color: '#2A5ADA', analyst_initials: 'BM',
    asset: 'EUR/USD', asset_class: 'forex', direction: 'BULLISH', methodology: 'Harmonic',
    title: 'EUR/USD Bullish Bat at 1.0820',
    body: 'Classic bullish bat completion at the 0.886 XA retracement. ECB rate differential narrowing. Watch for confirmation above 1.0850.',
    key_levels: { entry: '1.0820', target: '1.0980', stop: '1.0760' },
    confidence: 82, timestamp: '3h ago', status: 'active',
    crypto_translation: 'EUR strength = DXY weakness = historically bullish for BTC. Last 3 DXY breakdowns preceded 15-25% BTC rallies within 4 weeks.',
  },
  {
    id: 'pip2', analyst_id: 'grega', analyst_name: 'Grega Horvat', analyst_color: '#9945FF', analyst_initials: 'GH',
    asset: 'BTC', asset_class: 'crypto', direction: 'BULLISH', methodology: 'Elliott Wave',
    title: 'BTC Wave 5 Extension to $92K',
    body: 'Wave 4 correction complete at $81,200. Wave 5 impulse targeting 1.618 extension at $92,000. Invalidation below $79,500.',
    key_levels: { entry: '$83,500', target: '$92,000', stop: '$79,500' },
    confidence: 74, timestamp: '5h ago', status: 'active',
    crypto_translation: 'Direct crypto PiP. If Wave 5 plays out, expect alt rotation to follow 7-10 days after BTC peaks.',
  },
  {
    id: 'pip3', analyst_id: 'dale', analyst_name: 'Dale Pinkert', analyst_color: '#22C55E', analyst_initials: 'DP',
    asset: 'GBP/USD', asset_class: 'forex', direction: 'BEARISH', methodology: 'Sentiment',
    title: 'GBP/USD Crowded Long — Fade Setup',
    body: 'COT report shows asset managers net long GBP at 3-year highs. Retail sentiment 78% long. Extreme positioning historically precedes reversals.',
    key_levels: { entry: '1.2710', target: '1.2520', stop: '1.2790' },
    confidence: 68, timestamp: '8h ago', status: 'active',
    crypto_translation: 'GBP weakness typically accompanies risk-off sentiment in European sessions. Watch for ETH/BTC underperformance during London hours.',
  },
  {
    id: 'pip4', analyst_id: 'joel', analyst_name: 'Joel Kruger', analyst_color: '#F59E0B', analyst_initials: 'JK',
    asset: 'USD/JPY', asset_class: 'forex', direction: 'BEARISH', methodology: 'Institutional Flow',
    title: 'USD/JPY Breakdown — BoJ Intervention Zone',
    body: 'Real money selling above 152. BoJ intervention risk elevated. Institutional flow data shows heavy hedging activity from Japanese corporates.',
    key_levels: { entry: '152.40', target: '149.80', stop: '153.20' },
    confidence: 71, timestamp: '6h ago', status: 'active',
    crypto_translation: 'JPY carry trade unwind is one of the strongest crypto correlation signals. Last BoJ intervention triggered a 12% BTC selloff in 48 hours.',
  },
  {
    id: 'pip5', analyst_id: 'blake', analyst_name: 'Blake Morrow', analyst_color: '#2A5ADA', analyst_initials: 'BM',
    asset: 'ETH', asset_class: 'crypto', direction: 'BEARISH', methodology: 'Macro',
    title: 'ETH Macro Headwinds — Risk-Off Setup',
    body: 'DXY breaking above 105, risk assets repricing. ETH correlating 0.85 with NASDAQ. Macro headwinds stronger than on-chain support.',
    key_levels: { entry: '$2,180', target: '$1,950', stop: '$2,320' },
    confidence: 65, timestamp: '2h ago', status: 'active',
    crypto_translation: 'Direct crypto PiP. Aligns with Grega\'s Elliott Wave 4 correction target. Confluence of two independent methodologies at $1,950.',
  },
]

// ── Traffic Light Macro Regime ────────────────────────────────

export interface TrafficLightSignal {
  indicator: string
  value: string
  signal: 'green' | 'amber' | 'red'
  note: string
}

export const FA_TRAFFIC_LIGHT: {
  signals: TrafficLightSignal[]
  regime: string
  regime_score: number
  pelican_translation: string
  updated: string
} = {
  signals: [
    { indicator: 'DXY', value: '104.2', signal: 'amber', note: 'Testing 104 support — breakdown bullish for risk' },
    { indicator: 'US10Y', value: '4.32%', signal: 'red', note: 'Rising yields pressuring risk assets' },
    { indicator: 'SPX', value: '5,180', signal: 'green', note: 'Holding above 200-DMA, risk appetite intact' },
    { indicator: 'VIX', value: '18.4', signal: 'amber', note: 'Elevated but not panicking — watch 20 level' },
  ],
  regime: 'Cautious Risk-On',
  regime_score: 6,
  pelican_translation: 'Mixed signals. Equities say "buy" but bonds say "careful." DXY at a pivot — if it breaks below 104, expect crypto to rally hard. If yields keep climbing, altcoins get crushed first. BTC holds up better in rate-hiking environments.',
  updated: '45m ago',
}

// ── FACE Webinar Summary ──────────────────────────────────────

export const FA_FACE_SUMMARY = {
  title: 'FACE Webinar — March 19, 2026',
  duration: '58 min',
  analysts: ['Blake Morrow', 'Dale Pinkert', 'Joel Kruger'],
  key_takeaways: [
    'DXY at critical inflection point — 104 support being tested. Break below opens 102 and is bullish for all risk assets.',
    'EUR/USD harmonic pattern completion suggests 200+ pip rally if 1.0850 holds.',
    'COT data shows extreme positioning in GBP and JPY — mean reversion setups developing.',
    'Fed speakers next week likely to maintain hawkish tone — don\'t front-run rate cut expectations.',
  ],
  pelican_translation: 'The FACE panel is cautiously bullish risk. If DXY breaks 104, that\'s the "green light" for crypto. BTC could test $90K+ in that scenario. Until then, keep position sizes modest and focus on BTC over alts.',
  timestamp: '2h ago',
}

// ── Day Ahead Podcast ─────────────────────────────────────────

export const FA_PODCAST = {
  title: 'The Day Ahead with Blake Morrow',
  episode: 'March 19, 2026',
  duration: '22 min',
  key_points: [
    'Asian session was quiet — JPY positioning is the story. Watch USD/JPY 152 level.',
    'European open: ECB speakers at 8:00 and 10:30 ET. EUR/USD bat pattern still in play.',
    'US session: No major data today but Fed\'s Waller speaks at 2:00 PM ET. Markets will be reactive.',
    'Risk management: Keep stops tight this week. FOMC minutes Thursday will be the real volatility event.',
  ],
  pelican_translation: 'Blake\'s key message: don\'t chase anything before Thursday\'s FOMC minutes. For crypto, this means reduced leverage and wider stops. Smart money is waiting — you should too.',
  timestamp: '6h ago',
}

// ── Blog Posts ─────────────────────────────────────────────────

export interface FABlogPost {
  id: string
  title: string
  author: string
  category: string
  excerpt: string
  timestamp: string
  read_time: string
}

export const FA_BLOG_POSTS: FABlogPost[] = [
  { id: 'bp1', title: 'DXY at the Crossroads: What a Break Below 104 Means for All Markets', author: 'Blake Morrow', category: 'Macro', excerpt: 'The US Dollar Index is testing its most important support level of 2026. Here\'s why this matters for forex, crypto, and equities.', timestamp: '4h ago', read_time: '5 min' },
  { id: 'bp2', title: 'Elliott Wave Update: BTC, ETH, and the Altcoin Complex', author: 'Grega Horvat', category: 'Technical', excerpt: 'Wave counts across the crypto complex suggest we\'re in the early stages of an impulse move higher — if key levels hold.', timestamp: '8h ago', read_time: '7 min' },
  { id: 'bp3', title: 'COT Report Deep Dive: Where Smart Money is Really Positioned', author: 'Dale Pinkert', category: 'Sentiment', excerpt: 'This week\'s Commitment of Traders report reveals extreme positioning in 3 currency pairs. Here\'s how to trade it.', timestamp: '1d ago', read_time: '6 min' },
  { id: 'bp4', title: 'Yen Carry Trade: The Hidden Risk Crypto Traders Ignore', author: 'Joel Kruger', category: 'Cross-Asset', excerpt: 'The JPY carry trade unwind is one of the most underappreciated risks in crypto. Here\'s the correlation and the trigger levels.', timestamp: '2d ago', read_time: '8 min' },
]
