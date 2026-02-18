import { Trade } from '@/hooks/use-trades'
import { TradingPlan } from '@/types/trading'

export interface TiltAlert {
  pattern: string
  severity: 'warning' | 'critical'
  title: string
  message: string
  suggestion: string
  supporting_trade_ids: string[]
}

function parseDate(dateStr: string): Date {
  return new Date(dateStr)
}

function minutesBetween(a: string, b: string): number {
  const diff = parseDate(b).getTime() - parseDate(a).getTime()
  return diff / (1000 * 60)
}

function closedWithLoss(trade: Trade): boolean {
  return trade.status === 'closed' && trade.pnl_amount !== null && trade.pnl_amount < 0
}

function positionSize(trade: Trade): number {
  return trade.entry_price * trade.quantity
}

/**
 * Detects 6 behavioral tilt patterns from today's and recent trades.
 */
export function detectTilt(input: {
  todaysTrades: Trade[]
  recentTrades: Trade[]
  plan: TradingPlan | null
}): TiltAlert[] {
  const { todaysTrades, recentTrades, plan } = input
  const alerts: TiltAlert[] = []

  const sortedToday = [...todaysTrades].sort(
    (a, b) => parseDate(a.entry_date).getTime() - parseDate(b.entry_date).getTime()
  )

  const sortedRecent = [...recentTrades].sort(
    (a, b) => parseDate(a.entry_date).getTime() - parseDate(b.entry_date).getTime()
  )

  // 1. Revenge Trading
  // Consecutive trades where previous is a closed loss, same ticker,
  // and gap between prev exit and current entry is 0-60 minutes.
  for (let i = 1; i < sortedRecent.length; i++) {
    const prev = sortedRecent[i - 1]!
    const curr = sortedRecent[i]!

    if (
      closedWithLoss(prev) &&
      prev.exit_date &&
      curr.ticker === prev.ticker
    ) {
      const gap = minutesBetween(prev.exit_date, curr.entry_date)
      if (gap > 0 && gap < 60) {
        alerts.push({
          pattern: 'revenge_trading',
          severity: 'warning',
          title: 'Revenge Trading Detected',
          message: `You re-entered ${curr.ticker} within ${Math.round(gap)} minutes after a loss. Emotional re-entries often compound losses.`,
          suggestion: 'Step away for at least 30 minutes after a losing trade before re-entering the same ticker.',
          supporting_trade_ids: [prev.id, curr.id],
        })
        break
      }
    }
  }

  // 2. Size Escalation After Losses
  // Among closed trades today, 2 consecutive losses followed by a trade
  // with size > 1.5x the average of those 2 losers.
  const closedToday = sortedToday.filter((t) => t.status === 'closed')
  for (let i = 2; i < closedToday.length; i++) {
    const loss1 = closedToday[i - 2]!
    const loss2 = closedToday[i - 1]!
    const next = closedToday[i]!

    if (closedWithLoss(loss1) && closedWithLoss(loss2)) {
      const avgLoserSize = (positionSize(loss1) + positionSize(loss2)) / 2
      const nextSize = positionSize(next)

      if (nextSize > avgLoserSize * 1.5) {
        alerts.push({
          pattern: 'size_escalation',
          severity: 'critical',
          title: 'Size Escalation After Losses',
          message: `After 2 consecutive losses, your next position size ($${nextSize.toLocaleString()}) was ${((nextSize / avgLoserSize) * 100 - 100).toFixed(0)}% larger than your average losing size. This is a dangerous tilt behavior.`,
          suggestion: 'After consecutive losses, reduce position size by 50% or take a break. Never increase size to "make it back."',
          supporting_trade_ids: [loss1.id, loss2.id, next.id],
        })
        break
      }
    }
  }

  // 3. Rapid-Fire Trading
  // 3 trades within 15 minutes.
  for (let i = 2; i < sortedToday.length; i++) {
    const first = sortedToday[i - 2]!
    const third = sortedToday[i]!
    const span = minutesBetween(first.entry_date, third.entry_date)

    if (span >= 0 && span < 15) {
      alerts.push({
        pattern: 'rapid_fire',
        severity: 'warning',
        title: 'Rapid-Fire Trading',
        message: `You entered 3 trades within ${Math.round(span)} minutes. Rapid entries often indicate impulsive decision-making rather than planned setups.`,
        suggestion: 'Enforce a minimum 5-minute cooldown between entries. Review your checklist before each trade.',
        supporting_trade_ids: [
          sortedToday[i - 2]!.id,
          sortedToday[i - 1]!.id,
          sortedToday[i]!.id,
        ],
      })
      break
    }
  }

  // 4. Loss Spiral
  // Count consecutive losses from the most recent closed trade today backwards.
  const closedTodayDesc = [...closedToday].reverse()
  let consecutiveLosses = 0
  const lossSpiralIds: string[] = []

  for (const trade of closedTodayDesc) {
    if (closedWithLoss(trade)) {
      consecutiveLosses++
      lossSpiralIds.push(trade.id)
    } else {
      break
    }
  }

  if (consecutiveLosses >= 3) {
    alerts.push({
      pattern: 'loss_spiral',
      severity: consecutiveLosses >= 5 ? 'critical' : 'warning',
      title: 'Loss Spiral',
      message: `You have ${consecutiveLosses} consecutive losing trades today. ${consecutiveLosses >= 5 ? 'This is a serious tilt state.' : 'A pattern of escalating losses is forming.'}`,
      suggestion: consecutiveLosses >= 5
        ? 'Stop trading immediately. Close your platform and review your journal tomorrow with fresh eyes.'
        : 'Consider stopping for the day. Review what changed in your process that led to 3+ consecutive losses.',
      supporting_trade_ids: lossSpiralIds,
    })
  }

  // 5. Conviction Collapse
  // After a loss, next trade has conviction <= 3.
  for (let i = 1; i < sortedRecent.length; i++) {
    const prev = sortedRecent[i - 1]!
    const curr = sortedRecent[i]!

    if (
      closedWithLoss(prev) &&
      curr.conviction !== null &&
      curr.conviction <= 3
    ) {
      alerts.push({
        pattern: 'conviction_collapse',
        severity: 'warning',
        title: 'Conviction Collapse',
        message: `After a loss on ${prev.ticker}, you entered ${curr.ticker} with a conviction of only ${curr.conviction}/10. Low-conviction trades after losses are often driven by fear or desperation.`,
        suggestion: 'Only take trades with conviction 6+ after a loss. If you cannot find a high-conviction setup, sit on your hands.',
        supporting_trade_ids: [prev.id, curr.id],
      })
      break
    }
  }

  // 6. Budget Breach
  // If plan has max_trades_per_day and today's trades exceed it.
  if (plan?.max_trades_per_day && todaysTrades.length > plan.max_trades_per_day) {
    alerts.push({
      pattern: 'budget_breach',
      severity: 'critical',
      title: 'Daily Trade Limit Exceeded',
      message: `You have taken ${todaysTrades.length} trades today, exceeding your plan limit of ${plan.max_trades_per_day}. Over-trading erodes edge and increases commission drag.`,
      suggestion: 'You set this limit for a reason. Honor your trading plan and stop entering new positions today.',
      supporting_trade_ids: todaysTrades.map((t) => t.id),
    })
  }

  return alerts
}
