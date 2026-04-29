import type { BlakeChartState } from './types'
import { checkAlertDedupe, pushAlert } from './store/redis-store'

export async function evaluateAlerts(ticker: string, state: BlakeChartState): Promise<void> {
  await Promise.all([
    evaluateLevelApproach(ticker, state),
    evaluateInvalidation(ticker, state),
    evaluateSetupConfluence(ticker, state),
  ])
}

async function evaluateLevelApproach(ticker: string, state: BlakeChartState): Promise<void> {
  const approachThreshold = 0.005

  for (const level of state.manualLevels ?? []) {
    if (level.status !== 'active') continue

    const distance = Math.abs((level.price - state.currentPrice) / state.currentPrice)
    if (distance >= approachThreshold) continue

    const dedupeKey = `level_approach:${ticker}:${level.id}`
    if (await checkAlertDedupe(dedupeKey)) continue

    await pushAlert({
      id: crypto.randomUUID(),
      ticker,
      alertType: 'level_approach',
      severity: 'watch',
      headline: `${ticker} approaching ${level.label || `${level.role} at ${level.price}`}`,
      body: `Spot ${state.currentPrice.toFixed(getPrecision(ticker))} is within ${(distance * 100).toFixed(2)}% of Blake's ${level.role} level at ${level.price}. ${level.note ?? ''}`.trim(),
      triggeredPrice: state.currentPrice,
      referenceLevelId: level.id,
      referenceThesisId: null,
      firedAt: new Date().toISOString(),
      acknowledged: false,
    })
  }
}

async function evaluateInvalidation(ticker: string, state: BlakeChartState): Promise<void> {
  for (const level of state.manualLevels ?? []) {
    if (level.status !== 'active' || level.role !== 'invalidation') continue

    const crossed =
      (state.trend === 'up' && state.currentPrice < level.price) ||
      (state.trend === 'down' && state.currentPrice > level.price) ||
      (state.trend === 'sideways' && Math.abs((state.currentPrice - level.price) / state.currentPrice) < 0.001)

    if (!crossed) continue

    const dedupeKey = `invalidation:${ticker}:${level.id}`
    if (await checkAlertDedupe(dedupeKey)) continue

    await pushAlert({
      id: crypto.randomUUID(),
      ticker,
      alertType: 'invalidation_hit',
      severity: 'action',
      headline: `${ticker} invalidation hit at ${level.price}`,
      body: `Price crossed Blake's invalidation level at ${level.price}. Setup is no longer valid. ${level.note ?? ''}`.trim(),
      triggeredPrice: state.currentPrice,
      referenceLevelId: level.id,
      referenceThesisId: null,
      firedAt: new Date().toISOString(),
      acknowledged: false,
    })
  }
}

async function evaluateSetupConfluence(ticker: string, state: BlakeChartState): Promise<void> {
  const nearMajorManual = (state.manualLevels ?? []).find(
    (level) =>
      level.status === 'active' &&
      level.strength === 'major' &&
      Math.abs((level.price - state.currentPrice) / state.currentPrice) < 0.01
  )
  if (!nearMajorManual) return

  const hasRsiSignal = state.indicators.rsiZone !== 'neutral' || state.divergences.length > 0
  if (!hasRsiSignal) return

  const dedupeKey = `setup_confluence:${ticker}:${nearMajorManual.id}`
  if (await checkAlertDedupe(dedupeKey)) return

  await pushAlert({
    id: crypto.randomUUID(),
    ticker,
    alertType: 'setup_confluence',
    severity: 'action',
    headline: `${ticker} confluence at ${nearMajorManual.label || nearMajorManual.price}`,
    body: `Price at Blake's ${nearMajorManual.role} level (${nearMajorManual.price}) with RSI ${state.indicators.rsiZone}${state.divergences.length > 0 ? ' and divergence' : ''}. ${nearMajorManual.note ?? ''}`.trim(),
    triggeredPrice: state.currentPrice,
    referenceLevelId: nearMajorManual.id,
    referenceThesisId: null,
    firedAt: new Date().toISOString(),
    acknowledged: false,
  })
}

export async function fireThesisChangeAlert(ticker: string, thesisText: string, thesisId: string): Promise<void> {
  const dedupeKey = `thesis_change:${ticker}:${thesisId}`
  if (await checkAlertDedupe(dedupeKey)) return

  await pushAlert({
    id: crypto.randomUUID(),
    ticker,
    alertType: 'thesis_change',
    severity: 'info',
    headline: `${ticker} thesis updated`,
    body: thesisText.slice(0, 200) + (thesisText.length > 200 ? '...' : ''),
    triggeredPrice: null,
    referenceLevelId: null,
    referenceThesisId: thesisId,
    firedAt: new Date().toISOString(),
    acknowledged: false,
  })
}

function getPrecision(ticker: string): number {
  if (ticker === 'EURUSD' || ticker === 'GBPUSD') return 5
  return 2
}
