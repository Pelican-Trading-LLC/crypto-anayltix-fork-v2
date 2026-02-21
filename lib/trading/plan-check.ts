import type { Trade, TradeFormData } from '@/hooks/use-trades'
import type { TradingPlan, PlanViolation, RuleComplianceStat } from '@/types/trading'
import type { TradeStats } from '@/hooks/use-trade-stats'

interface PlanCheckResult {
  violations: PlanViolation[]
  checklistItems: { text: string; checked: boolean }[]
  isCompliant: boolean
}

/**
 * Check a new trade against the user's active trading plan
 * Returns violations and pre-entry checklist status
 */
export function checkTradeAgainstPlan(
  tradeData: TradeFormData,
  plan: TradingPlan,
  existingTrades: Trade[],
  accountSize?: number,
): PlanCheckResult {
  const violations: PlanViolation[] = []

  // ── Risk per trade check ──
  if (plan.max_risk_per_trade_pct && tradeData.stop_loss && accountSize) {
    const riskPerShare = Math.abs(tradeData.entry_price - tradeData.stop_loss)
    const totalRisk = riskPerShare * tradeData.quantity
    const riskPercent = (totalRisk / accountSize) * 100

    if (riskPercent > plan.max_risk_per_trade_pct) {
      violations.push({
        violation_type: 'risk',
        rule_text: `Risk per trade exceeds ${plan.max_risk_per_trade_pct}% limit (current: ${riskPercent.toFixed(1)}%)`,
        severity: 'violation',
      })
    }
  }

  // ── Max position size (%) check ──
  if (plan.max_position_size_pct && accountSize) {
    const positionValue = tradeData.entry_price * tradeData.quantity
    const positionPercent = (positionValue / accountSize) * 100

    if (positionPercent > plan.max_position_size_pct) {
      violations.push({
        violation_type: 'risk',
        rule_text: `Position size exceeds ${plan.max_position_size_pct}% limit (current: ${positionPercent.toFixed(1)}%)`,
        severity: 'violation',
      })
    }
  }

  // ── Max position size ($) check ──
  if (plan.max_position_size_usd) {
    const positionValue = tradeData.entry_price * tradeData.quantity
    if (positionValue > plan.max_position_size_usd) {
      violations.push({
        violation_type: 'risk',
        rule_text: `Position value $${positionValue.toFixed(0)} exceeds $${plan.max_position_size_usd} limit`,
        severity: 'violation',
      })
    }
  }

  // ── Max open positions check ──
  if (plan.max_open_positions) {
    const openCount = existingTrades.filter(t => t.status === 'open').length
    if (openCount >= plan.max_open_positions) {
      violations.push({
        violation_type: 'risk',
        rule_text: `Max open positions reached (${openCount}/${plan.max_open_positions})`,
        severity: 'violation',
      })
    }
  }

  // ── Max trades per day check ──
  if (plan.max_trades_per_day) {
    const today = new Date().toISOString().split('T')[0]!
    const todaysTrades = existingTrades.filter(t =>
      t.entry_date.startsWith(today)
    )
    if (todaysTrades.length >= plan.max_trades_per_day) {
      violations.push({
        violation_type: 'discipline',
        rule_text: `Max daily trades reached (${todaysTrades.length}/${plan.max_trades_per_day})`,
        severity: 'violation',
      })
    }
  }

  // ── Daily loss limit check ──
  if (plan.max_daily_loss) {
    const today = new Date().toISOString().split('T')[0]!
    const todaysClosed = existingTrades.filter(t =>
      t.status === 'closed' && t.exit_date?.startsWith(today)
    )
    const todayPnl = todaysClosed.reduce((sum, t) => sum + (t.pnl_amount ?? 0), 0)

    if (todayPnl < 0 && Math.abs(todayPnl) >= plan.max_daily_loss) {
      violations.push({
        violation_type: 'risk',
        rule_text: `Daily loss limit reached ($${Math.abs(todayPnl).toFixed(2)} / $${plan.max_daily_loss})`,
        severity: 'violation',
      })
    }
  }

  // ── Consecutive losses check ──
  if (plan.max_consecutive_losses_before_stop) {
    const sorted = [...existingTrades]
      .filter(t => t.status === 'closed')
      .sort((a, b) => new Date(b.exit_date || b.entry_date).getTime() - new Date(a.exit_date || a.entry_date).getTime())

    let consecutiveLosses = 0
    for (const trade of sorted) {
      if ((trade.pnl_amount ?? 0) < 0) consecutiveLosses++
      else break
    }

    if (consecutiveLosses >= plan.max_consecutive_losses_before_stop) {
      violations.push({
        violation_type: 'discipline',
        rule_text: `${consecutiveLosses} consecutive losses — plan says stop after ${plan.max_consecutive_losses_before_stop}`,
        severity: 'violation',
      })
    }
  }

  // ── Same ticker after loss ──
  if (plan.no_same_ticker_after_loss) {
    const lastClosed = [...existingTrades]
      .filter(t => t.status === 'closed')
      .sort((a, b) => new Date(b.exit_date || b.entry_date).getTime() - new Date(a.exit_date || a.entry_date).getTime())[0]

    if (lastClosed && (lastClosed.pnl_amount ?? 0) < 0 && lastClosed.ticker === tradeData.ticker.toUpperCase()) {
      violations.push({
        violation_type: 'discipline',
        rule_text: `Last trade on ${tradeData.ticker} was a loss — plan says no re-entry on same ticker`,
        severity: 'warning',
      })
    }
  }

  // ── Allowed asset types check ──
  if (plan.allowed_asset_types && plan.allowed_asset_types.length > 0 && tradeData.asset_type) {
    if (!plan.allowed_asset_types.includes(tradeData.asset_type)) {
      violations.push({
        violation_type: 'general',
        rule_text: `${tradeData.asset_type} is not in your allowed assets (${plan.allowed_asset_types.join(', ')})`,
        severity: 'warning',
      })
    }
  }

  // ── Blocked tickers ──
  if (plan.blocked_tickers && plan.blocked_tickers.length > 0) {
    if (plan.blocked_tickers.includes(tradeData.ticker.toUpperCase())) {
      violations.push({
        violation_type: 'general',
        rule_text: `${tradeData.ticker} is on your blocked tickers list`,
        severity: 'violation',
      })
    }
  }

  // ── Required fields ──
  if (plan.require_stop_loss && !tradeData.stop_loss) {
    violations.push({
      violation_type: 'risk',
      rule_text: 'Your plan requires a stop loss on every trade',
      severity: 'violation',
    })
  }

  if (plan.require_take_profit && !tradeData.take_profit) {
    violations.push({
      violation_type: 'risk',
      rule_text: 'Your plan requires a take profit target on every trade',
      severity: 'warning',
    })
  }

  if (plan.require_thesis && !tradeData.thesis?.trim()) {
    violations.push({
      violation_type: 'entry',
      rule_text: 'Your plan requires a trade thesis',
      severity: 'warning',
    })
  }

  // ── Min risk/reward ratio ──
  if (plan.min_risk_reward_ratio && tradeData.stop_loss && tradeData.take_profit) {
    const risk = Math.abs(tradeData.entry_price - tradeData.stop_loss)
    const reward = Math.abs(tradeData.take_profit - tradeData.entry_price)
    const rr = risk > 0 ? reward / risk : 0

    if (rr < plan.min_risk_reward_ratio) {
      violations.push({
        violation_type: 'risk',
        rule_text: `R:R ratio ${rr.toFixed(1)} is below minimum ${plan.min_risk_reward_ratio}`,
        severity: 'warning',
      })
    }
  }

  // ── Pre-entry checklist ──
  const checklistItems = (plan.pre_entry_checklist || []).map(text => ({
    text,
    checked: false,
  }))

  return {
    violations,
    checklistItems,
    isCompliant: violations.filter(v => v.severity === 'violation').length === 0,
  }
}

/**
 * Build a summary of plan compliance for chat context
 */
export function buildPlanComplianceSummary(
  plan: TradingPlan,
  trades: Trade[],
): string {
  const openTrades = trades.filter(t => t.status === 'open')
  const todayStr = new Date().toISOString().split('T')[0]!
  const todaysClosed = trades.filter(t =>
    t.status === 'closed' && t.exit_date?.startsWith(todayStr)
  )
  const todayPnl = todaysClosed.reduce((sum, t) => sum + (t.pnl_amount ?? 0), 0)

  const lines = [
    `Trading Plan: "${plan.name}"`,
    `Open positions: ${openTrades.length}${plan.max_open_positions ? `/${plan.max_open_positions}` : ''}`,
  ]

  if (plan.max_daily_loss) {
    lines.push(`Daily P&L: $${todayPnl.toFixed(2)} (limit: -$${plan.max_daily_loss})`)
  }

  if (plan.max_risk_per_trade_pct) {
    lines.push(`Max risk/trade: ${plan.max_risk_per_trade_pct}%`)
  }

  if (plan.require_stop_loss) {
    lines.push('Stop loss required on all trades')
  }

  return lines.join('\n')
}

/**
 * Map a PlanViolation to a stable rule key for compliance tracking.
 */
function violationToRuleKey(v: PlanViolation): string {
  const text = v.rule_text.toLowerCase()
  if (text.includes('risk per trade exceeds')) return 'max_risk_per_trade'
  if (text.includes('position size') && text.includes('%')) return 'max_position_size_pct'
  if (text.includes('position value') && text.includes('exceeds')) return 'max_position_size_usd'
  if (text.includes('max open positions')) return 'max_open_positions'
  if (text.includes('max daily trades')) return 'max_trades_per_day'
  if (text.includes('daily loss limit')) return 'max_daily_loss'
  if (text.includes('consecutive losses')) return 'max_consecutive_losses'
  if (text.includes('no re-entry on same ticker')) return 'no_same_ticker_after_loss'
  if (text.includes('not in your allowed assets')) return 'allowed_asset_types'
  if (text.includes('blocked tickers')) return 'blocked_tickers'
  if (text.includes('requires a stop loss')) return 'require_stop_loss'
  if (text.includes('requires a take profit')) return 'require_take_profit'
  if (text.includes('requires a trade thesis')) return 'require_thesis'
  if (text.includes('r:r ratio')) return 'min_risk_reward'
  return `unknown_${v.violation_type}`
}

/**
 * Given the active plan, violations from checkTradeAgainstPlan,
 * and the user's checklist checkbox state, compute compliance arrays
 * for saving with the trade.
 */
export function deriveComplianceData(
  plan: TradingPlan,
  violations: PlanViolation[],
  checklistItems: { text: string; checked: boolean }[],
  checklistChecked: boolean[],
): {
  followed: string[]
  violated: string[]
  checklistCompleted: Record<string, boolean>
} {
  const followed: string[] = []
  const violated: string[] = []
  const checklistCompleted: Record<string, boolean> = {}

  // Track which rule keys have violations
  const violatedKeys = new Set(violations.map(violationToRuleKey))

  // Determine all applicable auto-check rule keys from the plan
  const applicableRules: string[] = []
  if (plan.require_stop_loss) applicableRules.push('require_stop_loss')
  if (plan.require_take_profit) applicableRules.push('require_take_profit')
  if (plan.require_thesis) applicableRules.push('require_thesis')
  if (plan.min_risk_reward_ratio) applicableRules.push('min_risk_reward')
  if (plan.max_position_size_usd) applicableRules.push('max_position_size_usd')
  if (plan.max_position_size_pct) applicableRules.push('max_position_size_pct')
  if (plan.max_risk_per_trade_pct) applicableRules.push('max_risk_per_trade')
  if (plan.max_open_positions) applicableRules.push('max_open_positions')
  if (plan.max_trades_per_day) applicableRules.push('max_trades_per_day')
  if (plan.max_daily_loss) applicableRules.push('max_daily_loss')
  if (plan.max_consecutive_losses_before_stop) applicableRules.push('max_consecutive_losses')
  if (plan.no_same_ticker_after_loss) applicableRules.push('no_same_ticker_after_loss')
  if (plan.allowed_asset_types?.length) applicableRules.push('allowed_asset_types')
  if (plan.blocked_tickers?.length) applicableRules.push('blocked_tickers')

  // For each applicable rule, check if there's a violation
  for (const key of applicableRules) {
    if (violatedKeys.has(key)) {
      violated.push(key)
      checklistCompleted[key] = false
    } else {
      followed.push(key)
      checklistCompleted[key] = true
    }
  }

  // Process manual checklist items
  checklistItems.forEach((item, i) => {
    const sanitizedKey = `checklist_${item.text.slice(0, 40).replace(/\s+/g, '_').toLowerCase()}`
    const isChecked = checklistChecked[i] ?? false
    checklistCompleted[sanitizedKey] = isChecked
    if (isChecked) {
      followed.push(sanitizedKey)
    } else {
      violated.push(sanitizedKey)
    }
  })

  return { followed, violated, checklistCompleted }
}

/**
 * Build a comprehensive prompt for Pelican to review the trading plan
 * with compliance data and trading stats.
 */
export function buildPlanReviewPrompt(
  plan: TradingPlan,
  complianceStats: RuleComplianceStat[] | null,
  tradeStats: TradeStats | null,
): string {
  let prompt = 'Review my trading plan and tell me what\'s working, what\'s not, and what to change.\n\n'

  prompt += '=== MY TRADING PLAN ===\n'
  prompt += `Name: "${plan.name}"\n`

  if (plan.max_trades_per_day) prompt += `Max trades/day: ${plan.max_trades_per_day}\n`
  if (plan.max_open_positions) prompt += `Max open positions: ${plan.max_open_positions}\n`
  if (plan.max_position_size_usd) prompt += `Max position size: $${plan.max_position_size_usd.toLocaleString()}\n`
  if (plan.min_risk_reward_ratio) prompt += `Min R:R: ${plan.min_risk_reward_ratio}:1\n`
  if (plan.max_risk_per_trade_pct) prompt += `Max risk/trade: ${plan.max_risk_per_trade_pct}%\n`
  if (plan.max_daily_loss) prompt += `Max daily loss: $${plan.max_daily_loss}\n`
  if (plan.max_weekly_loss) prompt += `Max weekly loss: $${plan.max_weekly_loss}\n`
  if (plan.max_monthly_loss) prompt += `Max monthly loss: $${plan.max_monthly_loss}\n`
  if (plan.require_stop_loss) prompt += 'Rule: Every trade must have a stop loss\n'
  if (plan.require_take_profit) prompt += 'Rule: Every trade must have a take profit\n'
  if (plan.require_thesis) prompt += 'Rule: Every trade must have a thesis\n'
  if (plan.avoid_first_15_min) prompt += 'Rule: Avoid first 15 minutes\n'
  if (plan.first_hour_only) prompt += 'Rule: First hour only\n'
  if (!plan.friday_trading_allowed) prompt += 'Rule: No Friday trading\n'
  if (plan.max_consecutive_losses_before_stop) prompt += `Stop after ${plan.max_consecutive_losses_before_stop} consecutive losses\n`
  if (plan.no_same_ticker_after_loss) prompt += 'Rule: No re-entry on same ticker after loss\n'
  if (plan.cooldown_after_max_loss_hours) prompt += `Cooldown after max loss: ${plan.cooldown_after_max_loss_hours} hours\n`

  if (plan.pre_entry_checklist?.length) {
    prompt += '\nPre-entry checklist:\n'
    plan.pre_entry_checklist.forEach(item => { prompt += `- ${item}\n` })
  }

  if (tradeStats) {
    prompt += '\n=== MY TRADING STATS ===\n'
    prompt += `Total closed trades: ${tradeStats.closed_trades}\n`
    prompt += `Win rate: ${tradeStats.win_rate?.toFixed(1)}%\n`
    prompt += `Profit factor: ${tradeStats.profit_factor?.toFixed(2)}\n`
    prompt += `Avg R: ${tradeStats.avg_r_multiple?.toFixed(2)}\n`
    prompt += `Total P&L: $${tradeStats.total_pnl?.toLocaleString()}\n`
    prompt += `Largest win: $${tradeStats.largest_win?.toLocaleString()}\n`
    prompt += `Largest loss: $${tradeStats.largest_loss?.toLocaleString()}\n`
  }

  if (complianceStats?.length) {
    prompt += '\n=== RULE COMPLIANCE DATA ===\n'
    prompt += '(Follow = I obeyed the rule. Violate = I broke it.)\n\n'

    complianceStats.forEach(r => {
      const total = r.times_followed + r.times_violated
      if (total === 0) return
      prompt += `Rule: "${r.rule_key}"\n`
      prompt += `  Followed ${r.times_followed}x: ${r.wr_when_followed}% WR, $${r.pnl_when_followed.toLocaleString()} P&L\n`
      prompt += `  Violated ${r.times_violated}x: ${r.wr_when_violated}% WR, $${r.pnl_when_violated.toLocaleString()} P&L\n`
      prompt += `  Follow rate: ${r.follow_rate}% | Edge: ${r.edge > 0 ? '+' : ''}${r.edge}%\n\n`
    })
  }

  prompt += '\n=== WHAT I NEED FROM YOU ===\n'
  prompt += '1. Which rules are clearly making me money? (keep these, maybe tighten them)\n'
  prompt += '2. Which rules am I breaking that are costing me? (be honest)\n'
  prompt += '3. Which rules don\'t have enough data or don\'t seem to matter? (consider removing)\n'
  prompt += '4. What rules am I MISSING that my stats suggest I need?\n'
  prompt += '5. Rate my plan A through F and tell me the single most impactful change I could make.\n'

  return prompt
}
