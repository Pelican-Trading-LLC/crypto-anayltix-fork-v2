export type AssetClass = 'crypto' | 'equity' | 'forex'
export type Timeframe = '4H' | '1D'

export interface TickerConfig {
  symbol: string
  displayName: string
  assetClass: AssetClass
  polygonTicker: string
  timeframe: Timeframe
  lookbackDays: number
}

export interface Candle {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface Pivot {
  index: number
  time: number
  price: number
  type: 'high' | 'low'
}

export interface SwingMove {
  startPivot: Pivot
  endPivot: Pivot
  direction: 'up' | 'down'
  range: number
  rangePercent: number
}

export interface FibLevel {
  ratio: number
  price: number
  type: 'retracement' | 'extension'
  label: string
}

export interface HorizontalLevel {
  price: number
  touchCount: number
  firstTouchTime: number
  lastTouchTime: number
  role: 'support' | 'resistance' | 'pivot'
  strength: 'major' | 'minor'
  source?: 'auto' | 'manual'
  label?: string | null
  color?: 'cyan' | 'black' | 'red' | 'blue'
  manualLevelId?: string
}

export interface Trendline {
  startTime: number
  startPrice: number
  endTime: number
  endPrice: number
  slope: number
  direction: 'ascending' | 'descending'
  touchCount: number
}

export interface Channel {
  upperLine: Trendline
  lowerLine: Trendline
  direction: 'ascending' | 'descending' | 'horizontal'
  width: number
}

export interface IndicatorState {
  ema50: number[]
  ema200: number[]
  rsi14: number[]
  rsiSignal: number[]
  currentRsi: number
  rsiZone: 'overbought' | 'oversold' | 'neutral'
}

export interface DivergenceSignal {
  type: 'bullish' | 'bearish' | 'hidden_bullish' | 'hidden_bearish'
  pricePivot1: Pivot
  pricePivot2: Pivot
  rsiPivot1: { time: number; value: number }
  rsiPivot2: { time: number; value: number }
}

export interface BlakeChartState {
  ticker: string
  displayName: string
  assetClass: AssetClass
  timeframe: Timeframe
  candles: Candle[]
  currentPrice: number
  priceChange24h: number
  priceChangePercent24h: number
  majorSwing: SwingMove | null
  fibLevels: FibLevel[]
  horizontalLevels: HorizontalLevel[]
  manualLevels: BlakeLevel[]
  trendlines: Trendline[]
  channel: Channel | null
  indicators: IndicatorState
  divergences: DivergenceSignal[]
  trend: 'up' | 'down' | 'sideways'
  recentEvent: 'new_trend_high' | 'new_trend_low' | 'breakout' | 'breakdown' | 'rejection' | 'consolidation' | null
}

export interface VoiceSample {
  id: string
  ticker: string
  state: unknown
  output: string
}

export interface BlakeLevel {
  id: string
  ticker: string
  price: number
  label: string | null
  role: 'support' | 'resistance' | 'target' | 'invalidation' | 'pivot'
  strength: 'major' | 'minor'
  color: 'cyan' | 'black' | 'red' | 'blue'
  note: string | null
  analyst: string
  status: 'active' | 'invalidated' | 'hit' | 'archived'
  createdAt: string
  updatedAt: string
}

export interface BlakeThesis {
  id: string
  ticker: string
  analyst: string
  thesisText: string
  structuralHash: string
  bias: 'long' | 'short' | 'neutral' | null
  keyLevelPrice: number | null
  invalidationPrice: number | null
  rsi: number | null
  trend: string | null
  recentEvent: string | null
  stateSnapshot: unknown
  createdAt: string
}

export interface BlakeBriefing {
  id: string
  briefingDate: string
  analyst: string
  headline: string
  body: string
  setups: Array<{ ticker: string; bias: string; level: number; thesis: string }>
  emailHtml: string | null
  generatedAt: string
}

export interface BlakeAlert {
  id: string
  ticker: string
  alertType: 'level_approach' | 'thesis_change' | 'setup_confluence' | 'invalidation_hit'
  severity: 'info' | 'watch' | 'action'
  headline: string
  body: string
  triggeredPrice: number | null
  referenceLevelId: string | null
  referenceThesisId: string | null
  firedAt: string
  acknowledged: boolean
}

export interface BlakeTrackRecordEntry {
  id: string
  analyst: string
  ticker: string
  callDate: string
  callType: 'long' | 'short' | 'level_test' | 'macro_view'
  bias: 'long' | 'short' | 'neutral'
  callText: string
  entryPrice: number | null
  targetPrice: number | null
  invalidationPrice: number | null
  currentStatus: 'open' | 'hit_target' | 'invalidated' | 'partial' | 'closed_early'
  outcomePrice: number | null
  outcomeDate: string | null
  rMultiple: number | null
  sourceUrl: string | null
}
