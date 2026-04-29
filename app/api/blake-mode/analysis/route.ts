import { NextResponse } from 'next/server'
import { buildBlakeChartState } from '@/lib/blake-mode/ta/engine'
import { aggregateConfluence } from '@/lib/blake-mode/confluence/aggregator'
import { DEFAULT_VOICE_SAMPLES, type VoiceSample } from '@/lib/blake-mode/voice/fewShotSamples'
import { buildSystemPrompt } from '@/lib/blake-mode/voice/systemPrompt'

export const dynamic = 'force-dynamic'

interface AnthropicTextBlock {
  type: 'text'
  text: string
}

interface AnthropicResponse {
  content?: AnthropicTextBlock[]
}

function formatLevel(price: number, ticker: string): string {
  return ticker.endsWith('USD') && ticker.length === 6 ? price.toFixed(5) : price.toFixed(price >= 100 ? 2 : 4)
}

function localFallbackAnalysis(slimState: {
  ticker: string
  currentPrice: number
  trend: string
  recentEvent: string | null
  keyLevels: { type: string; price: number; distancePercent: number }[]
  channel: { direction: string } | null
  rsiZone: string
}, samples: VoiceSample[]): string {
  const closest = slimState.keyLevels
    .slice()
    .sort((a, b) => Math.abs(a.distancePercent) - Math.abs(b.distancePercent))[0]
  const level = closest ? formatLevel(closest.price, slimState.ticker) : formatLevel(slimState.currentPrice, slimState.ticker)
  const pressure = slimState.trend === 'down' ? 'downside pressure' : slimState.trend === 'up' ? 'upside pressure' : 'range pressure'
  const structure = slimState.channel ? `${slimState.channel.direction} channel` : `${slimState.trend} trend`
  const event = slimState.recentEvent?.replaceAll('_', ' ') ?? 'structure test'
  const samplePrefix = samples[0]?.output.includes(':') ? samples[0].output.split(':')[0] : 'Intraday Update'
  const prefix = samplePrefix?.trim() || 'Intraday Update'

  return `${prefix}: $${slimState.ticker} is working through a ${event} inside the ${structure}, and the ${closest?.type ?? 'pivot'} near ${level} is in play. A move back through that level would take the ${pressure} off, especially with RSI still ${slimState.rsiZone}.`
}

async function callAnthropic(system: string, payload: unknown): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return null

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 400,
      system,
      messages: [{ role: 'user', content: `CHART STATE:\n${JSON.stringify(payload, null, 2)}\n\nUPDATE:` }],
    }),
  })

  if (!response.ok) {
    console.error('[Blake Mode] Anthropic error:', response.status, await response.text())
    return null
  }

  const data = (await response.json()) as AnthropicResponse
  return data.content?.find((block) => block.type === 'text')?.text.trim() ?? null
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { ticker?: string; voiceSamples?: VoiceSample[] }
    const ticker = (body.ticker ?? 'BTC').toUpperCase()
    const samples = body.voiceSamples?.length ? body.voiceSamples : DEFAULT_VOICE_SAMPLES
    const state = await buildBlakeChartState(ticker)
    const confluence = await aggregateConfluence(ticker, state)

    const slimState = {
      ticker: state.ticker,
      timeframe: state.timeframe,
      currentPrice: state.currentPrice,
      priceChangePercent24h: state.priceChangePercent24h,
      trend: state.trend,
      recentEvent: state.recentEvent,
      majorSwing: state.majorSwing
        ? {
            direction: state.majorSwing.direction,
            rangePercent: state.majorSwing.rangePercent,
          }
        : null,
      keyLevels: [
        ...state.horizontalLevels
          .filter((level) => level.strength === 'major')
          .slice(0, 4)
          .map((level) => ({
            type: level.role,
            price: level.price,
            touchCount: level.touchCount,
            distancePercent: ((level.price - state.currentPrice) / state.currentPrice) * 100,
          })),
        ...state.fibLevels
          .filter((fib) => Math.abs((fib.price - state.currentPrice) / state.currentPrice) < 0.05)
          .map((fib) => ({
            type: `fib_${fib.label.replace('.', '')}`,
            price: fib.price,
            distancePercent: ((fib.price - state.currentPrice) / state.currentPrice) * 100,
          })),
      ],
      channel: state.channel ? { direction: state.channel.direction } : null,
      rsi: state.indicators.currentRsi,
      rsiZone: state.indicators.rsiZone,
      divergences: state.divergences.map((divergence) => divergence.type),
      confluence,
    }

    const generated = await callAnthropic(buildSystemPrompt(samples), slimState)
    return NextResponse.json({
      analysis: generated ?? localFallbackAnalysis(slimState, samples),
      state: slimState,
      fullState: state,
      confluence,
    })
  } catch (error) {
    console.error('[Blake Mode] analysis route error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to generate Blake Mode analysis' },
      { status: 500 }
    )
  }
}
