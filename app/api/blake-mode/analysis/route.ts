import { NextResponse } from 'next/server'
import { buildBlakeChartState } from '@/lib/blake-mode/ta/engine'
import { aggregateConfluence } from '@/lib/blake-mode/confluence/aggregator'
import { DEFAULT_VOICE_SAMPLES, type VoiceSample } from '@/lib/blake-mode/voice/fewShotSamples'
import { buildSystemPrompt } from '@/lib/blake-mode/voice/systemPrompt'
import type { BlakeLevel } from '@/lib/blake-mode/types'
import { computeStructuralHash, deriveBias } from '@/lib/blake-mode/thesis-hash'
import { getLatestThesis, pushThesis } from '@/lib/blake-mode/store/redis-store'
import { evaluateAlerts, fireThesisChangeAlert } from '@/lib/blake-mode/alert-engine'

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

function formatLevelType(type: string): string {
  if (!type.startsWith('fib_')) return type.replaceAll('_', ' ')

  const raw = type.replace('fib_', '')
  const numeric = raw.startsWith('1') ? Number(`${raw[0]}.${raw.slice(1)}`) : Number(`0.${raw.replace(/^0/, '')}`)
  if (!Number.isFinite(numeric)) return 'Fib level'

  const percent = numeric >= 1 ? (numeric * 100).toFixed(1) : (numeric * 100).toFixed(numeric === 0.5 ? 0 : 1)
  return `${percent.replace('.0', '')}% ${numeric > 1 ? 'extension' : 'retracement'}`
}

function localFallbackAnalysis(slimState: {
  ticker: string
  currentPrice: number
  trend: string
  recentEvent: string | null
  keyLevels: { type: string; price: number; distancePercent: number; label?: string | null; source?: string }[]
  channel: { direction: string } | null
  rsiZone: string
}, samples: VoiceSample[]): string {
  const closest = slimState.keyLevels
    .slice()
    .sort((a, b) => Math.abs(a.distancePercent) - Math.abs(b.distancePercent))[0]
  const invalidation =
    slimState.trend === 'up'
      ? slimState.keyLevels
          .filter((level) => level.distancePercent < 0)
          .sort((a, b) => Math.abs(a.distancePercent) - Math.abs(b.distancePercent))[0]
      : slimState.trend === 'down'
        ? slimState.keyLevels
            .filter((level) => level.distancePercent > 0)
            .sort((a, b) => Math.abs(a.distancePercent) - Math.abs(b.distancePercent))[0]
        : closest
  const level = closest ? formatLevel(closest.price, slimState.ticker) : formatLevel(slimState.currentPrice, slimState.ticker)
  const invalidationLevel = invalidation ? formatLevel(invalidation.price, slimState.ticker) : level
  const structure = slimState.channel ? `${slimState.channel.direction} channel` : `${slimState.trend} trend`
  const event = slimState.recentEvent?.replaceAll('_', ' ') ?? 'structure test'
  const samplePrefix = samples[0]?.output.includes(':') ? samples[0].output.split(':')[0] : 'Intraday Update'
  const prefix = samplePrefix?.trim() || 'Intraday Update'
  const levelDescription = closest?.label ? `${closest.label} near ${level}` : `${closest ? formatLevelType(closest.type) : 'pivot'} near ${level}`
  const pressure =
    slimState.trend === 'down'
      ? `A move back above ${invalidationLevel} would take the downside pressure off.`
      : slimState.trend === 'up'
        ? `A move back below ${invalidationLevel} would take the upside pressure off.`
        : `A move back through ${invalidationLevel} would take the range pressure off.`

  return `${prefix}: $${slimState.ticker} is working through a ${event} inside the ${structure}, and ${levelDescription} is in play. ${pressure} RSI is still ${slimState.rsiZone}.`
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
    const body = (await req.json()) as { ticker?: string; voiceSamples?: VoiceSample[]; manualLevels?: BlakeLevel[] }
    const ticker = (body.ticker ?? 'BTC').toUpperCase()
    const samples = body.voiceSamples?.length ? body.voiceSamples : DEFAULT_VOICE_SAMPLES
    const state = await buildBlakeChartState(ticker, { manualLevels: body.manualLevels })
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
        ...state.manualLevels
          .filter((level) => level.status === 'active' && Math.abs((level.price - state.currentPrice) / state.currentPrice) < 0.03)
          .map((level) => ({
            type: level.role,
            price: level.price,
            label: level.label,
            note: level.note,
            source: 'blake_manual',
            distancePercent: ((level.price - state.currentPrice) / state.currentPrice) * 100,
          })),
        ...state.horizontalLevels
          .filter((level) => level.source !== 'manual' && level.strength === 'major')
          .slice(0, 4)
          .map((level) => ({
            type: level.role,
            price: level.price,
            source: 'auto',
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
      manualLevels: state.manualLevels.filter((level) => level.status === 'active'),
      confluence,
    }

    const generated = await callAnthropic(buildSystemPrompt(samples), slimState)
    const text = generated ?? localFallbackAnalysis(slimState, samples)
    const structuralHash = computeStructuralHash(state)
    const latest = await getLatestThesis(ticker, 'blake')

    if (!latest || latest.structuralHash !== structuralHash) {
      const thesis = {
        id: crypto.randomUUID(),
        ticker,
        analyst: 'blake',
        thesisText: text,
        structuralHash,
        bias: deriveBias(state),
        keyLevelPrice: state.manualLevels.find((level) => level.status === 'active')?.price ?? null,
        invalidationPrice: state.manualLevels.find((level) => level.role === 'invalidation' && level.status === 'active')?.price ?? null,
        rsi: state.indicators.currentRsi,
        trend: state.trend,
        recentEvent: state.recentEvent,
        stateSnapshot: slimState,
        createdAt: new Date().toISOString(),
      }
      await pushThesis(thesis)
      await fireThesisChangeAlert(ticker, text, thesis.id)
    }

    await evaluateAlerts(ticker, state)

    return NextResponse.json({
      analysis: text,
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
