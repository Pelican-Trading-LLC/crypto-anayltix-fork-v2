import { TICKER_CONFIGS } from './config'
import { getCachedAnalysis } from './analysis-cache'
import { renderBriefingEmail } from './email-template'
import { setBriefing } from './store/redis-store'
import { buildBlakeChartState } from './ta/engine'
import { computeUrgency, type Urgency } from './urgency'
import type { BlakeBriefing, BlakeChartState } from './types'

interface SetupCandidate {
  ticker: string
  state: BlakeChartState
  urgency: Urgency
  score: number
  thesis: string
}

const BRIEFING_SYSTEM_PROMPT = `You are writing the morning desk briefing in the voice of Blake Morrow (ForexAnalytixPipczar). Your output is a tactical morning note distributed by email at 6am ET to professional and retail traders.

Voice characteristics: direct, structural, level-anchored, conversational, no emojis, no AI references, no emdashes. Tickers prefixed with $. Always names a specific level with its price. Always includes invalidation language.

Format your output as exactly two sections separated by "---":

HEADLINE: A single sentence, 12 words max, capturing the most important macro thread of the day.

BODY: 4 to 6 short paragraphs. Open with macro context. Then walk through each top setup, naming ticker, level, bias, and invalidation. Close with a what would change my mind today risk note.`

function scoreSetup(state: BlakeChartState, urgency: Urgency): number {
  let score = 0
  if (urgency === 'red') score += 100
  if (urgency === 'yellow') score += 50
  if (state.divergences.length > 0) score += 30
  if ((state.manualLevels ?? []).filter((level) => level.status === 'active').length > 0) score += 20
  if (state.recentEvent === 'new_trend_high' || state.recentEvent === 'new_trend_low') score += 25
  if (state.channel) score += 10
  return score
}

function biasFor(state: BlakeChartState): string {
  if (state.trend === 'up') return 'long'
  if (state.trend === 'down') return 'short'
  return 'neutral'
}

function buildBriefingPrompt(setups: SetupCandidate[]): string {
  return `Generate today's morning briefing covering these top 5 setups:\n\n${setups
    .map((setup, index) => {
      const manual = setup.state.manualLevels
        .filter((level) => level.status === 'active')
        .map((level) => `${level.price} (${level.role}, "${level.label ?? 'Blake level'}")`)
        .join(', ')
      return `${index + 1}. ${setup.ticker} (${setup.urgency.toUpperCase()})\n   Current: ${setup.state.currentPrice}, Trend: ${setup.state.trend}, RSI: ${setup.state.indicators.currentRsi.toFixed(1)}\n   Manual levels: ${manual || 'none'}\n   Latest thesis: "${setup.thesis}"`
    })
    .join('\n\n')}`
}

function parseBriefingResponse(text: string): { headline: string; body: string } {
  const parts = text.split('---').map((part) => part.trim())
  const headlineMatch = parts[0]?.match(/HEADLINE:\s*([\s\S]+)/)
  const bodyMatch = parts[1]?.match(/BODY:\s*([\s\S]+)/)
  const fallbackHeadline = parts[0] || 'Dollar tone steady, levels matter across the board.'
  return {
    headline: headlineMatch?.[1]?.trim() || fallbackHeadline,
    body: bodyMatch?.[1]?.trim() || parts[1] || text,
  }
}

function fallbackBriefing(topSetups: SetupCandidate[]): { headline: string; body: string } {
  const lead = topSetups[0]
  const headline = lead ? `${lead.ticker} leads the board, watch the manual levels.` : 'Levels are set, patience matters into the session.'
  const paragraphs = [
    'The morning setup is less about chasing and more about respecting structure. The dollar, crypto beta, and Mag 7 are all sitting close enough to important levels that the first move can be noisy.',
    ...topSetups.map((setup) => {
      const manual = setup.state.manualLevels.find((level) => level.status === 'active')
      const level = manual ? `${manual.label || manual.role} at ${manual.price}` : `spot near ${setup.state.currentPrice.toFixed(setup.state.assetClass === 'forex' ? 5 : 2)}`
      return `$${setup.ticker}: ${level} is the level in play. Bias is ${biasFor(setup.state)} while the ${setup.state.trend} trend holds, and a move back through the nearest invalidation would take the pressure off.`
    }),
    'What would change my mind today: clean breaks through the manual invalidation levels with momentum, not just a wick through support or resistance.',
  ]
  return { headline, body: paragraphs.slice(0, 6).join('\n\n') }
}

async function callAnthropic(setups: SetupCandidate[]): Promise<{ headline: string; body: string } | null> {
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
      max_tokens: 1500,
      system: BRIEFING_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildBriefingPrompt(setups) }],
    }),
  })
  if (!response.ok) return null
  const data = (await response.json()) as { content?: Array<{ type: string; text?: string }> }
  const text = data.content?.find((block) => block.type === 'text')?.text
  return text ? parseBriefingResponse(text) : null
}

export async function generateDailyBriefing(date?: string): Promise<{ briefing: BlakeBriefing }> {
  const briefingDate = date ?? new Date().toISOString().slice(0, 10)
  const candidates = await Promise.all(
    Object.keys(TICKER_CONFIGS).map(async (ticker) => {
      const state = await buildBlakeChartState(ticker)
      const urgency = computeUrgency(state)
      const thesis = await getCachedAnalysis(ticker)
      return { ticker, state, urgency, score: scoreSetup(state, urgency), thesis }
    })
  )
  const topSetups = candidates.sort((a, b) => b.score - a.score).slice(0, 5)
  const generated = (await callAnthropic(topSetups)) ?? fallbackBriefing(topSetups)
  const setups = topSetups.map((setup) => ({
    ticker: setup.ticker,
    bias: biasFor(setup.state),
    level: setup.state.manualLevels.find((level) => level.status === 'active')?.price ?? setup.state.currentPrice,
    thesis: setup.thesis,
  }))
  const briefing: BlakeBriefing = {
    id: crypto.randomUUID(),
    briefingDate,
    analyst: 'blake',
    headline: generated.headline,
    body: generated.body,
    setups,
    emailHtml: renderBriefingEmail(generated.headline, generated.body, setups),
    generatedAt: new Date().toISOString(),
  }
  await setBriefing(briefing)
  return { briefing }
}
