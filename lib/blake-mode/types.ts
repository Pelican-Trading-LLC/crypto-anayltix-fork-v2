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
  trendlines: Trendline[]
  channel: Channel | null
  indicators: IndicatorState
  divergences: DivergenceSignal[]
  trend: 'up' | 'down' | 'sideways'
  recentEvent: 'new_trend_high' | 'new_trend_low' | 'breakout' | 'breakdown' | 'rejection' | 'consolidation' | null
}

