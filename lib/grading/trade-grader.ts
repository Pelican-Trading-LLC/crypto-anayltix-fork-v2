import type { Trade } from '@/hooks/use-trades'
import type { TradingPlan, TraderSurvey } from '@/types/trading'

// ── Types ──

export interface TradeGrade {
  risk_management: DimensionGrade
  entry_quality: DimensionGrade
  exit_execution: DimensionGrade
  plan_adherence: DimensionGrade
  thesis_quality: DimensionGrade
  overall_score: number
  overall_grade: string
  summary: string
  graded_at: string
  version: number
}

export interface DimensionGrade {
  score: number
  grade: string
  rationale: string
}

// ── Utilities ──

export function scoreToGrade(score: number): string {
  if (score >= 97) return 'A+'
  if (score >= 93) return 'A'
  if (score >= 90) return 'A-'
  if (score >= 87) return 'B+'
  if (score >= 83) return 'B'
  if (score >= 80) return 'B-'
  if (score >= 77) return 'C+'
  if (score >= 73) return 'C'
  if (score >= 70) return 'C-'
  if (score >= 60) return 'D'
  return 'F'
}

export function gradeToColor(grade: string): string {
  if (grade.startsWith('A')) return 'text-[#3EBD8C]'
  if (grade.startsWith('B')) return 'text-blue-400'
  if (grade.startsWith('C')) return 'text-yellow-400'
  if (grade.startsWith('D')) return 'text-orange-400'
  return 'text-[#E06565]'
}

export function gradeToRingColor(grade: string): string {
  if (grade.startsWith('A')) return 'ring-green-400/30'
  if (grade.startsWith('B')) return 'ring-blue-400/30'
  if (grade.startsWith('C')) return 'ring-yellow-400/30'
  if (grade.startsWith('D')) return 'ring-orange-400/30'
  return 'ring-red-400/30'
}

function getAccountEstimate(range: string): number {
  const map: Record<string, number> = {
    under_1k: 750,
    '1k_5k': 3000,
    '5k_25k': 15000,
    '25k_100k': 60000,
    '100k_500k': 250000,
    over_500k: 750000,
  }
  return map[range] || 25000
}

function clamp(v: number): number {
  return Math.max(0, Math.min(100, v))
}

// ── Dimension 1: Risk Management (weight 30%) ──

function gradeRiskManagement(
  trade: Trade,
  survey: TraderSurvey | null,
): DimensionGrade {
  let score = 50
  const reasons: string[] = []

  // Stop loss
  if (trade.stop_loss != null) {
    score += 20
    const distance =
      Math.abs(trade.entry_price - trade.stop_loss) / trade.entry_price
    const distancePct = distance * 100
    if (distancePct >= 0.5 && distancePct <= 5) {
      score += 15
      reasons.push(`Tight stop loss at ${distancePct.toFixed(1)}% distance.`)
    } else if (distancePct > 10) {
      score -= 10
      reasons.push(
        `Stop loss very wide at ${distancePct.toFixed(1)}% distance.`,
      )
    } else {
      reasons.push(`Stop loss set at ${distancePct.toFixed(1)}% distance.`)
    }
  } else {
    score -= 20
    reasons.push('No stop loss set.')
  }

  // Take profit
  if (trade.take_profit != null) {
    score += 10
    reasons.push('Take profit target set.')

    // R:R ratio check (only meaningful if stop loss also set)
    if (trade.stop_loss != null) {
      const risk = Math.abs(trade.entry_price - trade.stop_loss)
      const reward = Math.abs(trade.take_profit - trade.entry_price)
      if (risk > 0) {
        const rr = reward / risk
        if (rr >= 2) {
          score += 10
          reasons.push(`Risk/reward ratio ${rr.toFixed(1)}:1 — excellent.`)
        } else if (rr >= 1.5) {
          score += 5
          reasons.push(`Risk/reward ratio ${rr.toFixed(1)}:1 — acceptable.`)
        } else if (rr < 1) {
          score -= 10
          reasons.push(
            `Risk/reward ratio ${rr.toFixed(1)}:1 — reward less than risk.`,
          )
        }
      }
    }
  }

  // Position sizing
  const positionSizeUsd = trade.entry_price * trade.quantity
  if (positionSizeUsd > 0 && survey?.account_size_range) {
    const accountEst = getAccountEstimate(survey.account_size_range)
    const pct = (positionSizeUsd / accountEst) * 100
    if (pct <= 5) {
      score += 5
      reasons.push(
        `Position size ~${pct.toFixed(1)}% of account — conservative.`,
      )
    } else if (pct > 20) {
      score -= 15
      reasons.push(
        `Position size ~${pct.toFixed(0)}% of account — dangerously large.`,
      )
    } else if (pct > 10) {
      score -= 5
      reasons.push(`Position size ~${pct.toFixed(0)}% of account — elevated.`)
    }
  }

  const clamped = clamp(score)
  return {
    score: clamped,
    grade: scoreToGrade(clamped),
    rationale: reasons.join(' ') || 'Risk parameters evaluated.',
  }
}

// ── Dimension 2: Entry Quality (weight 20%) ──

function gradeEntryQuality(trade: Trade): DimensionGrade {
  let score = 60
  const reasons: string[] = []

  // Conviction
  if (trade.conviction != null) {
    if (trade.conviction >= 8) {
      score += 15
      reasons.push(`High conviction (${trade.conviction}/10).`)
    } else if (trade.conviction >= 6) {
      score += 5
      reasons.push(`Moderate conviction (${trade.conviction}/10).`)
    } else if (trade.conviction <= 3) {
      score -= 15
      reasons.push(`Low conviction (${trade.conviction}/10) — impulsive entry?`)
    }
  }

  // Thesis
  const thesis = trade.thesis?.trim() || ''
  if (thesis.length > 20) {
    score += 15
    reasons.push('Detailed thesis documented.')
  } else if (thesis.length > 0) {
    score += 5
    reasons.push('Brief thesis provided.')
  } else {
    score -= 10
    reasons.push('No thesis documented.')
  }

  // Setup tags
  if (trade.setup_tags && trade.setup_tags.length > 0) {
    score += 10
    reasons.push(`Setup tagged: ${trade.setup_tags.join(', ')}.`)
  }

  const clamped = clamp(score)
  return {
    score: clamped,
    grade: scoreToGrade(clamped),
    rationale: reasons.join(' ') || 'Entry quality evaluated.',
  }
}

// ── Dimension 3: Exit Execution (weight 25%) ──

function gradeExitExecution(trade: Trade): DimensionGrade {
  let score = 50
  const reasons: string[] = []

  if (trade.stop_loss != null && trade.r_multiple != null) {
    // Grade by R-multiple when stop loss is set
    const r = trade.r_multiple
    if (r >= 3) {
      score += 30
      reasons.push(`Outstanding ${r.toFixed(1)}R winner.`)
    } else if (r >= 2) {
      score += 25
      reasons.push(`Strong ${r.toFixed(1)}R winner.`)
    } else if (r >= 1) {
      score += 15
      reasons.push(`Solid ${r.toFixed(1)}R gain.`)
    } else if (r >= 0) {
      score += 5
      reasons.push(`Scratched at ${r.toFixed(1)}R — capital preserved.`)
    } else if (r >= -0.5) {
      score += 5
      reasons.push(
        `Small loss at ${r.toFixed(1)}R — disciplined cut.`,
      )
    } else if (r >= -1) {
      // No score change — stopped out as planned
      reasons.push(`Stopped out at ${r.toFixed(1)}R — plan executed.`)
    } else {
      score -= 20
      reasons.push(
        `Exceeded stop at ${r.toFixed(1)}R — held through stop loss.`,
      )
    }
  } else if (trade.pnl_percent != null) {
    // Fallback: grade by P&L %
    const pnl = trade.pnl_percent
    if (pnl >= 5) {
      score += 20
      reasons.push(`Strong ${pnl.toFixed(1)}% gain.`)
    } else if (pnl >= 2) {
      score += 10
      reasons.push(`Decent ${pnl.toFixed(1)}% gain.`)
    } else if (pnl >= 0) {
      score += 5
      reasons.push(`Breakeven at ${pnl.toFixed(1)}%.`)
    } else if (pnl >= -2) {
      score -= 5
      reasons.push(`Small loss of ${pnl.toFixed(1)}%.`)
    } else if (pnl >= -5) {
      score -= 15
      reasons.push(`Moderate loss of ${pnl.toFixed(1)}%.`)
    } else {
      score -= 25
      reasons.push(`Large loss of ${pnl.toFixed(1)}%.`)
    }
  }

  // Check if exit captured target
  if (
    trade.take_profit != null &&
    trade.exit_price != null
  ) {
    const targetMove = Math.abs(trade.take_profit - trade.entry_price)
    const actualMove = Math.abs(trade.exit_price - trade.entry_price)
    if (targetMove > 0 && actualMove / targetMove >= 0.8) {
      score += 10
      reasons.push('Captured 80%+ of profit target.')
    }
  }

  const clamped = clamp(score)
  return {
    score: clamped,
    grade: scoreToGrade(clamped),
    rationale: reasons.join(' ') || 'Exit execution evaluated.',
  }
}

// ── Dimension 4: Plan Adherence (weight 15%) ──

function gradePlanAdherence(
  trade: Trade,
  plan: TradingPlan | null,
): DimensionGrade {
  if (!plan) {
    return {
      score: 70,
      grade: 'C+',
      rationale: 'No trading plan set.',
    }
  }

  let score = 100
  const violations: string[] = []

  const enabled = plan.rules_enabled ?? {}
  const isRuleEnabled = (key: string): boolean => {
    // If rules_enabled is empty, all rules are considered on
    if (Object.keys(enabled).length === 0) return true
    return enabled[key] !== false
  }

  // Require stop loss
  if (
    plan.require_stop_loss &&
    isRuleEnabled('require_stop_loss') &&
    trade.stop_loss == null
  ) {
    score -= 25
    violations.push('Missing required stop loss.')
  }

  // Require take profit
  if (
    plan.require_take_profit &&
    isRuleEnabled('require_take_profit') &&
    trade.take_profit == null
  ) {
    score -= 15
    violations.push('Missing required take profit.')
  }

  // Require thesis
  if (
    plan.require_thesis &&
    isRuleEnabled('require_thesis') &&
    !trade.thesis?.trim()
  ) {
    score -= 20
    violations.push('Missing required thesis.')
  }

  // Allowed asset types
  if (
    plan.allowed_asset_types &&
    plan.allowed_asset_types.length > 0 &&
    isRuleEnabled('allowed_asset_types') &&
    !plan.allowed_asset_types.includes(trade.asset_type)
  ) {
    score -= 20
    violations.push(
      `Asset type "${trade.asset_type}" not in allowed types.`,
    )
  }

  // Blocked tickers
  if (
    plan.blocked_tickers &&
    plan.blocked_tickers.length > 0 &&
    isRuleEnabled('blocked_tickers') &&
    plan.blocked_tickers.includes(trade.ticker)
  ) {
    score -= 30
    violations.push(`Ticker ${trade.ticker} is on the blocked list.`)
  }

  // Min risk/reward ratio
  if (
    plan.min_risk_reward_ratio != null &&
    isRuleEnabled('min_risk_reward_ratio') &&
    trade.stop_loss != null &&
    trade.take_profit != null
  ) {
    const risk = Math.abs(trade.entry_price - trade.stop_loss)
    const reward = Math.abs(trade.take_profit - trade.entry_price)
    if (risk > 0) {
      const rr = reward / risk
      if (rr < plan.min_risk_reward_ratio) {
        score -= 15
        violations.push(
          `R:R ${rr.toFixed(1)} below minimum ${plan.min_risk_reward_ratio}.`,
        )
      }
    }
  }

  // Max position size USD
  if (
    plan.max_position_size_usd != null &&
    isRuleEnabled('max_position_size_usd')
  ) {
    const positionSizeUsd = trade.entry_price * trade.quantity
    if (positionSizeUsd > plan.max_position_size_usd) {
      score -= 20
      violations.push(
        `Position $${positionSizeUsd.toLocaleString()} exceeds max $${plan.max_position_size_usd.toLocaleString()}.`,
      )
    }
  }

  const clamped = clamp(score)
  return {
    score: clamped,
    grade: scoreToGrade(clamped),
    rationale:
      violations.length > 0
        ? violations.join(' ')
        : 'All plan rules followed.',
  }
}

// ── Dimension 5: Thesis Quality (weight 10%) ──

function gradeThesisQuality(trade: Trade): DimensionGrade {
  const thesis = trade.thesis?.trim() || ''

  if (!thesis) {
    return {
      score: 20,
      grade: scoreToGrade(20),
      rationale: 'No thesis provided.',
    }
  }

  let score = 30
  const reasons: string[] = []

  // Word count
  const wordCount = thesis.split(/\s+/).filter(Boolean).length
  if (wordCount >= 30) {
    score += 25
    reasons.push(`Detailed thesis (${wordCount} words).`)
  } else if (wordCount >= 15) {
    score += 15
    reasons.push(`Moderate thesis (${wordCount} words).`)
  } else if (wordCount >= 5) {
    score += 5
    reasons.push(`Brief thesis (${wordCount} words).`)
  }

  // Contains price numbers (e.g., $123, 123.45)
  const pricePattern = /\$?\d+\.?\d*/
  if (pricePattern.test(thesis)) {
    score += 15
    reasons.push('Includes price levels.')
  }

  // Contains trading catalysts
  const catalystPattern =
    /\b(earnings|catalyst|breakout|support|resistance|volume|momentum|trend|reversal|news|FDA|upgrade|downgrade|guidance)\b/i
  if (catalystPattern.test(thesis)) {
    score += 15
    reasons.push('References trading catalysts.')
  }

  // Contains risk words
  const riskPattern =
    /\b(risk|stop|downside|hedge|protect|worst.?case|max.?loss|if.?wrong)\b/i
  if (riskPattern.test(thesis)) {
    score += 10
    reasons.push('Considers risk factors.')
  }

  const clamped = clamp(score)
  return {
    score: clamped,
    grade: scoreToGrade(clamped),
    rationale: reasons.join(' ') || 'Thesis evaluated.',
  }
}

// ── Composite Grade ──

export function computeTradeGrade(
  trade: Trade,
  survey: TraderSurvey | null,
  plan: TradingPlan | null,
): TradeGrade {
  const risk_management = gradeRiskManagement(trade, survey)
  const entry_quality = gradeEntryQuality(trade)
  const exit_execution = gradeExitExecution(trade)
  const plan_adherence = gradePlanAdherence(trade, plan)
  const thesis_quality = gradeThesisQuality(trade)

  const overall_score = Math.round(
    risk_management.score * 0.3 +
      entry_quality.score * 0.2 +
      exit_execution.score * 0.25 +
      plan_adherence.score * 0.15 +
      thesis_quality.score * 0.1,
  )

  const overall_grade = scoreToGrade(overall_score)

  // Find best and worst dimensions for summary
  const dimensions = [
    { name: 'Risk Management', score: risk_management.score },
    { name: 'Entry Quality', score: entry_quality.score },
    { name: 'Exit Execution', score: exit_execution.score },
    { name: 'Plan Adherence', score: plan_adherence.score },
    { name: 'Thesis Quality', score: thesis_quality.score },
  ]
  dimensions.sort((a, b) => b.score - a.score)
  const best = dimensions[0]!
  const worst = dimensions[dimensions.length - 1]!

  let summary: string
  if (overall_score >= 90) {
    summary = `Excellent trade. Strongest area: ${best.name}. Keep executing at this level.`
  } else if (overall_score >= 80) {
    summary = `Solid trade. ${best.name} was strong. Focus on improving ${worst.name} to reach the next level.`
  } else if (overall_score >= 70) {
    summary = `Decent trade with room to grow. ${worst.name} needs the most attention.`
  } else if (overall_score >= 60) {
    summary = `Below average. Key weakness: ${worst.name}. Review your process before the next trade.`
  } else {
    summary = `Poor execution. Multiple areas need work, especially ${worst.name}. Consider reducing size until fundamentals improve.`
  }

  return {
    risk_management,
    entry_quality,
    exit_execution,
    plan_adherence,
    thesis_quality,
    overall_score,
    overall_grade,
    summary,
    graded_at: new Date().toISOString(),
    version: 1,
  }
}
