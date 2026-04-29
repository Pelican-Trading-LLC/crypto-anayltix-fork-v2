export interface VoiceSample {
  id: string
  ticker: string
  state: unknown
  output: string
}

export const DEFAULT_VOICE_SAMPLES: VoiceSample[] = [
  {
    id: 'usdcad-trend-low',
    ticker: 'USDCAD',
    state: {
      ticker: 'USDCAD',
      timeframe: '4H',
      currentPrice: 1.36068,
      trend: 'down',
      recentEvent: 'new_trend_low',
      keyLevels: [
        { type: 'channel_support', price: 1.355, role: 'in_play', distancePercent: -0.4 },
        { type: 'resistance', price: 1.367, role: 'invalidation', distancePercent: 0.7 },
      ],
      channel: { direction: 'descending' },
      rsi: 28,
      rsiZone: 'oversold',
    },
    output:
      'Intraday Update: A fresh new trend low in the $USDCAD which may put channel support near the 1.3550 level in play eventually. A move back above the 1.3670 would take the downside pressure off.',
  },
  {
    id: 'euraud-channel-fib',
    ticker: 'EURAUD',
    state: {
      ticker: 'EURAUD',
      timeframe: '4H',
      trend: 'down',
      channel: { direction: 'descending' },
      keyLevels: [{ type: 'fib_0786', price: 1.6282, role: 'in_play', distancePercent: -0.3 }],
      recentEvent: 'consolidation',
    },
    output: 'Intraday Update: EURAUD is in a descending channel and the 78% retracement test at 1.6282 is possible intraday.',
  },
  {
    id: 'spx-long-term-channel',
    ticker: 'SPX',
    state: {
      ticker: 'SPX',
      timeframe: '1W',
      trend: 'up',
      channel: { direction: 'ascending', timeframe: 'long_term' },
      keyLevels: [{ type: 'channel_resistance', role: 'major_resistance' }],
      recentEvent: 'new_trend_high',
    },
    output:
      'Every couple weeks when we get to major resistance, I have to remind people this is a long term channel in the $SPX. If you chase the market into new highs, it tends to reject. This is a market you buy dips, and sell rips (into resistance).',
  },
]

