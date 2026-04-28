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
  { id: 'blake', name: 'Sample Macro Analyst', role: 'Sample Analyst', methodology: 'Macro / Harmonic', color: '#2A5ADA', initials: 'MA', bio: 'Sample analyst profile for layout preview. Live analyst data requires connected feeds.' },
  { id: 'grega', name: 'Sample Wave Analyst', role: 'Sample Analyst', methodology: 'Elliott Wave', color: '#9945FF', initials: 'WA', bio: 'Sample analyst profile for layout preview. Live analyst data requires connected feeds.' },
  { id: 'dale', name: 'Sample Sentiment Analyst', role: 'Sample Analyst', methodology: 'Sentiment / COT', color: '#3EBD8C', initials: 'SA', bio: 'Sample analyst profile for layout preview. Live analyst data requires connected feeds.' },
  { id: 'joel', name: 'Sample Flow Analyst', role: 'Sample Analyst', methodology: 'Institutional Flow', color: '#D4A042', initials: 'FA', bio: 'Sample analyst profile for layout preview. Live analyst data requires connected feeds.' },
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
    id: 'pip1', analyst_id: 'blake', analyst_name: 'Sample Macro Analyst', analyst_color: '#2A5ADA', analyst_initials: 'MA',
    asset: 'EUR/USD', asset_class: 'forex', direction: 'BULLISH', methodology: 'Harmonic',
    title: 'EUR/USD Sample Harmonic Setup',
    body: 'Sample harmonic completion with macro context. Live PiP levels require connected ForexAnalytix feeds.',
    key_levels: { entry: '<sample>', target: '<sample>', stop: '<sample>' },
    confidence: 82, timestamp: '3h ago', status: 'active',
    crypto_translation: 'Sample translation showing how a currency setup can map to crypto risk conditions.',
  },
  {
    id: 'pip2', analyst_id: 'grega', analyst_name: 'Sample Wave Analyst', analyst_color: '#9945FF', analyst_initials: 'WA',
    asset: 'BTC', asset_class: 'crypto', direction: 'BULLISH', methodology: 'Elliott Wave',
    title: 'BTC Sample Wave Extension',
    body: 'Sample wave-count narrative for layout preview. Live entry, target, and invalidation levels require connected feeds.',
    key_levels: { entry: '<sample>', target: '<sample>', stop: '<sample>' },
    confidence: 74, timestamp: '5h ago', status: 'active',
    crypto_translation: 'Sample crypto PiP translation for preview only.',
  },
  {
    id: 'pip3', analyst_id: 'dale', analyst_name: 'Sample Sentiment Analyst', analyst_color: '#3EBD8C', analyst_initials: 'SA',
    asset: 'GBP/USD', asset_class: 'forex', direction: 'BEARISH', methodology: 'Sentiment',
    title: 'GBP/USD Crowded Long — Fade Setup',
    body: 'COT report shows asset managers net long GBP at 3-year highs. Retail sentiment 78% long. Extreme positioning historically precedes reversals.',
    key_levels: { entry: '<sample>', target: '<sample>', stop: '<sample>' },
    confidence: 68, timestamp: '8h ago', status: 'active',
    crypto_translation: 'GBP weakness typically accompanies risk-off sentiment in European sessions. Watch for ETH/BTC underperformance during London hours.',
  },
  {
    id: 'pip4', analyst_id: 'joel', analyst_name: 'Sample Flow Analyst', analyst_color: '#D4A042', analyst_initials: 'FA',
    asset: 'USD/JPY', asset_class: 'forex', direction: 'BEARISH', methodology: 'Institutional Flow',
    title: 'USD/JPY Breakdown — BoJ Intervention Zone',
    body: 'Real money selling above 152. BoJ intervention risk elevated. Institutional flow data shows heavy hedging activity from Japanese corporates.',
    key_levels: { entry: '<sample>', target: '<sample>', stop: '<sample>' },
    confidence: 71, timestamp: '6h ago', status: 'active',
    crypto_translation: 'JPY carry trade unwind is one of the strongest crypto correlation signals. Last BoJ intervention triggered a 12% BTC selloff in 48 hours.',
  },
  {
    id: 'pip5', analyst_id: 'blake', analyst_name: 'Sample Macro Analyst', analyst_color: '#2A5ADA', analyst_initials: 'MA',
    asset: 'ETH', asset_class: 'crypto', direction: 'BEARISH', methodology: 'Macro',
    title: 'ETH Macro Headwinds — Risk-Off Setup',
    body: 'DXY breaking above 105, risk assets repricing. ETH correlating 0.85 with NASDAQ. Macro headwinds stronger than on-chain support.',
    key_levels: { entry: '<sample>', target: '<sample>', stop: '<sample>' },
    confidence: 65, timestamp: '2h ago', status: 'active',
    crypto_translation: 'Sample crypto PiP. Live confluence requires connected analyst feeds.',
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
  analysts: ['Sample Macro Analyst', 'Sample Sentiment Analyst', 'Sample Flow Analyst'],
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
  title: 'The Day Ahead — Sample Macro Brief',
  episode: 'March 19, 2026',
  duration: '22 min',
  key_points: [
    'Asian session was quiet — JPY positioning is the story. Watch USD/JPY 152 level.',
    'European open: ECB speakers at 8:00 and 10:30 ET. EUR/USD bat pattern still in play.',
    'US session: No major data today but Fed\'s Waller speaks at 2:00 PM ET. Markets will be reactive.',
    'Risk management: Keep stops tight this week. FOMC minutes Thursday will be the real volatility event.',
  ],
  pelican_translation: 'Sample macro takeaway: avoid over-interpreting quiet sessions before major calendar risk. Live commentary requires connected feeds.',
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
  { id: 'bp1', title: 'DXY at the Crossroads: Sample Macro Note', author: 'Sample Macro Analyst', category: 'Macro', excerpt: 'Sample research excerpt for layout preview. Live research requires connected feeds.', timestamp: '4h ago', read_time: '5 min' },
  { id: 'bp2', title: 'Elliott Wave Update: Sample Technical Note', author: 'Sample Wave Analyst', category: 'Technical', excerpt: 'Sample wave-count excerpt for layout preview. Live research requires connected feeds.', timestamp: '8h ago', read_time: '7 min' },
  { id: 'bp3', title: 'COT Report Deep Dive: Sample Sentiment Note', author: 'Sample Sentiment Analyst', category: 'Sentiment', excerpt: 'Sample sentiment excerpt for layout preview. Live research requires connected feeds.', timestamp: '1d ago', read_time: '6 min' },
  { id: 'bp4', title: 'Yen Carry Trade: Sample Cross-Asset Note', author: 'Sample Flow Analyst', category: 'Cross-Asset', excerpt: 'Sample cross-asset excerpt for layout preview. Live research requires connected feeds.', timestamp: '2d ago', read_time: '8 min' },
]
