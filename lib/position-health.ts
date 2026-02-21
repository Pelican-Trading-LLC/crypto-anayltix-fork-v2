import type { PortfolioPosition, PortfolioStats } from '@/types/portfolio'
import type { BehavioralInsights, HoldingPeriodInsight } from '@/hooks/use-behavioral-insights'

// ============================================================================
// Types
// ============================================================================

export interface PositionHealth {
  color: 'emerald' | 'amber' | 'red'
  label: 'Healthy' | 'Monitor' | 'At Risk'
  tooltip: string
  issues: string[]
  score: number // 0-100, higher is healthier
}

export interface PositionAlert {
  type:
    | 'tight_stop'
    | 'no_stop'
    | 'no_target'
    | 'no_thesis'
    | 'oversized'
    | 'long_hold'
    | 'low_conviction'
    | 'never_scanned'
  severity: 'info' | 'warning' | 'critical'
  message: string
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Maps days_held to the closest HoldingPeriodInsight bucket.
 */
function matchHoldingPeriod(
  daysHeld: number,
  periods: HoldingPeriodInsight[],
): HoldingPeriodInsight | null {
  const hoursHeld = daysHeld * 24

  // Map hours to period key
  let periodKey: HoldingPeriodInsight['period']
  if (hoursHeld < 1) periodKey = 'under_1h'
  else if (hoursHeld < 4) periodKey = '1h_to_4h'
  else if (hoursHeld < 24) periodKey = '4h_to_1d'
  else if (daysHeld < 3) periodKey = '1d_to_3d'
  else if (daysHeld < 7) periodKey = '3d_to_1w'
  else periodKey = 'over_1w'

  return periods.find((p) => p.period === periodKey) ?? null
}

/**
 * Returns average position size from portfolio stats.
 */
function getAvgPositionSize(stats: PortfolioStats): number {
  if (stats.total_positions === 0) return 0
  return stats.total_exposure / stats.total_positions
}

// ============================================================================
// computePositionHealth
// ============================================================================

export function computePositionHealth(
  position: PortfolioPosition,
  insights: BehavioralInsights | null,
  portfolioStats: PortfolioStats,
): PositionHealth {
  let score = 100
  const issues: string[] = []

  // 1. No stop loss: -25
  if (!position.has_stop_loss) {
    score -= 25
    issues.push('No stop loss — undefined risk')
  }

  // 2. Stop < 1.5% from entry: -10
  if (
    position.has_stop_loss &&
    position.distance_to_stop_pct !== null &&
    Math.abs(position.distance_to_stop_pct) < 1.5
  ) {
    score -= 10
    issues.push(
      `Stop loss only ${Math.abs(position.distance_to_stop_pct).toFixed(1)}% from entry — high probability of being stopped out on noise`,
    )
  }

  // 3. Behavioral intelligence deductions (only with enough data)
  if (insights?.has_enough_data) {
    // 3a. Ticker with <35% win rate and 3+ trades: -20
    const tickerData = insights.ticker_performance.find(
      (t) => t.ticker === position.ticker,
    )
    if (tickerData && tickerData.total_trades >= 3 && tickerData.win_rate < 35) {
      score -= 20
      issues.push(
        `${position.ticker} has a ${tickerData.win_rate.toFixed(0)}% win rate across ${tickerData.total_trades} past trades`,
      )
    }

    // 3b. Holding period with <35% win rate: -15
    const holdingMatch = matchHoldingPeriod(
      position.days_held,
      insights.holding_period,
    )
    if (
      holdingMatch &&
      holdingMatch.total_trades >= 3 &&
      holdingMatch.win_rate < 35
    ) {
      score -= 15
      issues.push(
        `Trades held this long have a ${holdingMatch.win_rate.toFixed(0)}% win rate historically`,
      )
    }

    // 3c. On 2+ trade losing streak: -15
    if (
      insights.streaks.current_streak_type === 'losing' &&
      insights.streaks.current_streak_count >= 2
    ) {
      score -= 15
      issues.push(
        `Currently on a ${insights.streaks.current_streak_count}-trade losing streak — consider reducing size`,
      )
    }
  }

  // 4. Position > 2x average size: -10
  const avgSize = getAvgPositionSize(portfolioStats)
  if (avgSize > 0 && position.position_size_usd > avgSize * 2) {
    score -= 10
    issues.push(
      `Position is ${(position.position_size_usd / avgSize).toFixed(1)}x your average size`,
    )
  }

  // 5. High conviction (>=7) but no thesis: -5
  if (
    position.conviction !== null &&
    position.conviction >= 7 &&
    !position.has_thesis
  ) {
    score -= 5
    issues.push('High conviction without a written thesis — document your reasoning')
  }

  // 6. Held 7+ days with 0 Pelican scans: -5
  if (position.days_held >= 7 && position.pelican_scan_count === 0) {
    score -= 5
    issues.push('Held 7+ days without a Pelican scan — run one to reassess')
  }

  // Clamp score
  score = Math.max(0, Math.min(100, score))

  // Derive color and label
  let color: PositionHealth['color']
  let label: PositionHealth['label']

  if (score >= 70) {
    color = 'emerald'
    label = 'Healthy'
  } else if (score >= 40) {
    color = 'amber'
    label = 'Monitor'
  } else {
    color = 'red'
    label = 'At Risk'
  }

  // Build tooltip
  const tooltip =
    issues.length === 0
      ? 'Position looks healthy — no issues detected'
      : issues.join('. ')

  return { color, label, tooltip, issues, score }
}

// ============================================================================
// computeSmartAlerts
// ============================================================================

export function computeSmartAlerts(
  position: PortfolioPosition,
  portfolioStats: PortfolioStats,
): PositionAlert[] {
  const alerts: PositionAlert[] = []

  // 1. No stop loss (critical)
  if (!position.has_stop_loss) {
    alerts.push({
      type: 'no_stop',
      severity: 'critical',
      message: 'No stop loss set — risk is undefined',
    })
  }

  // 2. Tight stop (warning)
  if (
    position.has_stop_loss &&
    position.distance_to_stop_pct !== null &&
    Math.abs(position.distance_to_stop_pct) < 2
  ) {
    alerts.push({
      type: 'tight_stop',
      severity: 'warning',
      message: `Stop loss is only ${Math.abs(position.distance_to_stop_pct).toFixed(1)}% away — likely to get stopped out on normal volatility`,
    })
  }

  // 3. No take profit (info)
  if (!position.has_take_profit) {
    alerts.push({
      type: 'no_target',
      severity: 'info',
      message: 'No take profit target — consider setting an exit plan',
    })
  }

  // 4. No thesis (warning)
  if (!position.has_thesis) {
    alerts.push({
      type: 'no_thesis',
      severity: 'warning',
      message: 'No thesis documented — you may forget why you entered this trade',
    })
  }

  // 5. Oversized (warning)
  const avgSize = getAvgPositionSize(portfolioStats)
  if (avgSize > 0 && position.position_size_usd > avgSize * 2) {
    alerts.push({
      type: 'oversized',
      severity: 'warning',
      message: `Position is ${(position.position_size_usd / avgSize).toFixed(1)}x your average size — elevated risk`,
    })
  }

  // 6. Long hold (info)
  if (position.days_held > 14) {
    alerts.push({
      type: 'long_hold',
      severity: 'info',
      message: `Held for ${position.days_held} days — review if the original thesis still holds`,
    })
  }

  // 7. Low conviction (info)
  if (position.conviction !== null && position.conviction <= 3) {
    alerts.push({
      type: 'low_conviction',
      severity: 'info',
      message: `Conviction is ${position.conviction}/10 — consider if this trade is worth the capital`,
    })
  }

  // 8. Never scanned (info)
  if (position.pelican_scan_count === 0) {
    alerts.push({
      type: 'never_scanned',
      severity: 'info',
      message: 'Never analyzed with Pelican — run a scan for AI insights',
    })
  }

  return alerts
}
