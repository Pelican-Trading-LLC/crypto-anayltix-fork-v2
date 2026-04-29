import { EMA, RSI, SMA } from 'technicalindicators'
import type { Candle, IndicatorState } from '../types'

export function computeIndicators(candles: Candle[]): IndicatorState {
  const closes = candles.map((c) => c.close)
  const ema50 = EMA.calculate({ period: 50, values: closes })
  const ema200 = EMA.calculate({ period: 200, values: closes })
  const rsi14 = RSI.calculate({ period: 14, values: closes })
  const rsiSignal = SMA.calculate({ period: 14, values: rsi14 })
  const currentRsi = rsi14[rsi14.length - 1] ?? 50
  const rsiZone = currentRsi >= 70 ? 'overbought' : currentRsi <= 30 ? 'oversold' : 'neutral'

  return { ema50, ema200, rsi14, rsiSignal, currentRsi, rsiZone }
}

