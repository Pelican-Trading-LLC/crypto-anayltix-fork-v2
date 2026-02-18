'use client'

import type { BudgetStatus, BudgetGauge } from '@/lib/risk-budget/budget-tracker'

function gaugeColor(status: string): string {
  if (status === 'green') return '#22c55e'
  if (status === 'yellow') return '#eab308'
  return '#ef4444'
}

function CircularGauge({ gauge }: { gauge: BudgetGauge }) {
  if (!gauge.limit) {
    return (
      <div className="text-center p-3">
        <p className="text-xs text-[var(--text-muted)]">{gauge.label}</p>
        <p className="text-[10px] text-[var(--text-disabled)] mt-1">No limit set</p>
      </div>
    )
  }

  const color = gaugeColor(gauge.status)
  const circumference = 2 * Math.PI * 15.5
  const dashArray = `${(gauge.usedPct / 100) * circumference} ${circumference}`

  return (
    <div className="text-center p-3">
      <p className="text-xs text-[var(--text-muted)] mb-2">{gauge.label}</p>
      <div className="relative w-16 h-16 mx-auto">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" opacity="0.2" />
          <circle
            cx="18" cy="18" r="15.5" fill="none"
            stroke={color}
            strokeWidth="3"
            strokeDasharray={dashArray}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-mono font-bold text-[var(--text-primary)]">
          {gauge.usedPct.toFixed(0)}%
        </span>
      </div>
      <p className="text-[10px] text-[var(--text-muted)] mt-1 font-mono tabular-nums">
        ${gauge.currentLoss.toFixed(0)} / ${gauge.limit.toFixed(0)}
      </p>
    </div>
  )
}

export function BudgetGauges({ budget }: { budget: BudgetStatus }) {
  return (
    <div className="flex items-center justify-around">
      <CircularGauge gauge={budget.daily} />
      <CircularGauge gauge={budget.weekly} />
      <CircularGauge gauge={budget.monthly} />
    </div>
  )
}
