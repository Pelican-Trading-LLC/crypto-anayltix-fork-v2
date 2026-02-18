import type { TradingPlan } from '@/types/trading'

export interface BudgetStatus {
  daily: BudgetGauge
  weekly: BudgetGauge
  monthly: BudgetGauge
  tradesToday: number
  maxTradesToday: number | null
  consecutiveLosses: number
  maxConsecutiveLosses: number | null
  overallStatus: 'green' | 'yellow' | 'red' | 'locked'
  warnings: string[]
}

export interface BudgetGauge {
  label: string
  currentLoss: number
  limit: number | null
  usedPct: number
  status: 'green' | 'yellow' | 'red' | 'exceeded'
}

interface BudgetTrade {
  pnl_amount?: number | null
  status: string
}

function sumLosses(trades: BudgetTrade[]): number {
  return trades.reduce((sum, t) => {
    if (t.status !== 'closed') return sum
    const pnl = t.pnl_amount ?? 0
    return pnl < 0 ? sum + Math.abs(pnl) : sum
  }, 0)
}

function gaugeStatus(usedPct: number): 'green' | 'yellow' | 'red' | 'exceeded' {
  if (usedPct >= 100) return 'exceeded'
  if (usedPct >= 75) return 'red'
  if (usedPct >= 50) return 'yellow'
  return 'green'
}

function buildGauge(
  label: string,
  currentLoss: number,
  limit: number | null,
): BudgetGauge {
  const usedPct = limit ? (currentLoss / limit) * 100 : 0
  const capped = Math.min(usedPct, 100)
  return {
    label,
    currentLoss,
    limit,
    usedPct: capped,
    status: gaugeStatus(usedPct),
  }
}

function countConsecutiveLosses(trades: BudgetTrade[]): number {
  const closed = trades.filter((t) => t.status === 'closed')
  let count = 0
  for (let i = closed.length - 1; i >= 0; i--) {
    const pnl = closed[i]!.pnl_amount ?? 0
    if (pnl < 0) {
      count++
    } else {
      break
    }
  }
  return count
}

export function computeBudgetStatus(
  plan: TradingPlan | null,
  todaysTrades: BudgetTrade[],
  weekTrades: BudgetTrade[],
  monthTrades: BudgetTrade[],
): BudgetStatus {
  const dailyLoss = sumLosses(todaysTrades)
  const weeklyLoss = sumLosses(weekTrades)
  const monthlyLoss = sumLosses(monthTrades)

  const dailyLimit = plan?.max_daily_loss ?? null
  const weeklyLimit = plan?.max_weekly_loss ?? null
  const monthlyLimit = plan?.max_monthly_loss ?? null

  const daily = buildGauge('Daily', dailyLoss, dailyLimit)
  const weekly = buildGauge('Weekly', weeklyLoss, weeklyLimit)
  const monthly = buildGauge('Monthly', monthlyLoss, monthlyLimit)

  const tradesToday = todaysTrades.length
  const maxTradesToday = plan?.max_trades_per_day ?? null

  const consecutiveLosses = countConsecutiveLosses(todaysTrades)
  const maxConsecutiveLosses = plan?.max_consecutive_losses_before_stop ?? null

  const warnings: string[] = []

  // Daily loss warnings
  if (dailyLimit) {
    const dailyPct = (dailyLoss / dailyLimit) * 100
    if (dailyPct >= 100) {
      warnings.push(`Daily loss limit ($${dailyLimit.toLocaleString()}) exceeded.`)
    } else if (dailyPct >= 75) {
      const remaining = Math.round(100 - dailyPct)
      warnings.push(`${remaining}% of daily loss budget remaining.`)
    }
  }

  // Weekly loss warnings
  if (weeklyLimit) {
    const weeklyPct = (weeklyLoss / weeklyLimit) * 100
    if (weeklyPct >= 100) {
      warnings.push(
        `Weekly loss limit ($${weeklyLimit.toLocaleString()}) exceeded.`,
      )
    }
  }

  // Consecutive losses warning
  if (
    maxConsecutiveLosses !== null &&
    consecutiveLosses >= maxConsecutiveLosses
  ) {
    warnings.push(
      `${consecutiveLosses} consecutive losses — plan says to stop.`,
    )
  }

  // Trade count warning
  if (maxTradesToday !== null && tradesToday >= maxTradesToday) {
    warnings.push(`Daily trade limit (${maxTradesToday}) reached.`)
  }

  // Overall status
  const gauges = [daily, weekly, monthly]
  const anyExceeded = gauges.some((g) => g.status === 'exceeded')
  const anyRed = gauges.some((g) => g.status === 'red')
  const consecutiveHit =
    maxConsecutiveLosses !== null && consecutiveLosses >= maxConsecutiveLosses
  const anyYellow = gauges.some((g) => g.status === 'yellow')

  let overallStatus: 'green' | 'yellow' | 'red' | 'locked'
  if (anyExceeded) {
    overallStatus = 'locked'
  } else if (anyRed || consecutiveHit) {
    overallStatus = 'red'
  } else if (anyYellow) {
    overallStatus = 'yellow'
  } else {
    overallStatus = 'green'
  }

  return {
    daily,
    weekly,
    monthly,
    tradesToday,
    maxTradesToday,
    consecutiveLosses,
    maxConsecutiveLosses,
    overallStatus,
    warnings,
  }
}
