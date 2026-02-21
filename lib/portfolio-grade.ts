import type { PortfolioStats, RiskSummary, PlanCompliance, PortfolioPosition } from '@/types/portfolio'

// ============================================================================
// Types
// ============================================================================

export interface GradeFactor {
  name: string
  score: number   // 0-100
  weight: number  // 0-1
  detail: string
}

export interface PortfolioGrade {
  letter: 'A' | 'B' | 'C' | 'D' | 'F'
  score: number          // 0-100
  color: string          // CSS color var
  summary: string        // One-line
  factors: GradeFactor[]
}

// ============================================================================
// Scoring helpers
// ============================================================================

function scoreRR(rr: number | null): { score: number; detail: string } {
  if (rr === null) return { score: 0, detail: 'No risk defined' }
  if (rr >= 3) return { score: 100, detail: `${rr.toFixed(1)}:1 — excellent` }
  if (rr >= 2) return { score: 85, detail: `${rr.toFixed(1)}:1 — good` }
  if (rr >= 1.5) return { score: 70, detail: `${rr.toFixed(1)}:1 — acceptable` }
  if (rr >= 1) return { score: 50, detail: `${rr.toFixed(1)}:1 — marginal` }
  if (rr >= 0.5) return { score: 25, detail: `${rr.toFixed(1)}:1 — poor` }
  return { score: 10, detail: `${rr.toFixed(1)}:1 — terrible` }
}

function scoreStopCoverage(withRisk: number, withoutRisk: number): { score: number; detail: string } {
  const total = withRisk + withoutRisk
  if (total === 0) return { score: 100, detail: 'No positions' }
  const pct = (withRisk / total) * 100
  if (pct === 100) return { score: 100, detail: 'All stops set' }
  if (pct >= 80) return { score: 75, detail: `${withoutRisk} missing stops` }
  if (pct >= 50) return { score: 40, detail: `${withoutRisk} missing stops` }
  return { score: 15, detail: `${withoutRisk} of ${total} missing stops` }
}

function scoreConcentration(breakdown: PortfolioStats['asset_breakdown']): { score: number; detail: string } {
  if (breakdown.length === 0) return { score: 100, detail: 'No positions' }
  const maxPct = Math.max(...breakdown.map(b => b.pct_of_portfolio))
  if (breakdown.length >= 3 && maxPct <= 50) return { score: 100, detail: 'Well diversified' }
  if (breakdown.length >= 2 && maxPct <= 60) return { score: 75, detail: 'Moderately diversified' }
  if (maxPct <= 75) return { score: 50, detail: 'Concentrated' }
  return { score: 20, detail: `${maxPct.toFixed(0)}% in one asset class` }
}

function scoreThesis(positions: PortfolioPosition[]): { score: number; detail: string } {
  if (positions.length === 0) return { score: 100, detail: 'No positions' }
  const withThesis = positions.filter(p => p.has_thesis).length
  const pct = (withThesis / positions.length) * 100
  if (pct === 100) return { score: 100, detail: 'All have thesis' }
  if (pct >= 75) return { score: 70, detail: `${positions.length - withThesis} missing thesis` }
  if (pct >= 50) return { score: 40, detail: `${positions.length - withThesis} missing thesis` }
  return { score: 15, detail: `${positions.length - withThesis} of ${positions.length} missing thesis` }
}

function scorePlanCompliance(plan: PlanCompliance): { score: number; detail: string } {
  if (!plan.has_active_plan) return { score: 50, detail: 'No active plan' }
  let violations = 0
  if (plan.over_position_limit) violations++
  if (plan.require_stop_loss && plan.positions_missing_stop > 0) violations++
  if (plan.require_thesis && plan.positions_missing_thesis > 0) violations++
  if (violations === 0) return { score: 100, detail: 'Fully compliant' }
  if (violations === 1) return { score: 60, detail: '1 violation' }
  return { score: 20, detail: `${violations} violations` }
}

function letterFromScore(score: number): PortfolioGrade['letter'] {
  if (score >= 85) return 'A'
  if (score >= 70) return 'B'
  if (score >= 55) return 'C'
  if (score >= 40) return 'D'
  return 'F'
}

function colorFromLetter(letter: PortfolioGrade['letter']): string {
  switch (letter) {
    case 'A': return 'var(--data-positive)'
    case 'B': return 'var(--data-positive)'
    case 'C': return 'var(--data-warning)'
    case 'D': return 'var(--data-negative)'
    case 'F': return 'var(--data-negative)'
  }
}

function summaryFromLetter(letter: PortfolioGrade['letter']): string {
  switch (letter) {
    case 'A': return 'Portfolio is well-managed'
    case 'B': return 'Good shape, minor improvements possible'
    case 'C': return 'Some areas need attention'
    case 'D': return 'Significant issues to address'
    case 'F': return 'Portfolio needs immediate attention'
  }
}

// ============================================================================
// Main
// ============================================================================

export function computePortfolioGrade(
  stats: PortfolioStats,
  risk: RiskSummary,
  plan: PlanCompliance,
  positions: PortfolioPosition[],
): PortfolioGrade {
  const rr = scoreRR(risk.portfolio_rr_ratio)
  const stops = scoreStopCoverage(risk.positions_with_defined_risk, risk.positions_without_risk)
  const conc = scoreConcentration(stats.asset_breakdown)
  const thesis = scoreThesis(positions)
  const compliance = scorePlanCompliance(plan)

  const factors: GradeFactor[] = [
    { name: 'R:R Quality', score: rr.score, weight: 0.25, detail: rr.detail },
    { name: 'Stop Coverage', score: stops.score, weight: 0.25, detail: stops.detail },
    { name: 'Diversification', score: conc.score, weight: 0.20, detail: conc.detail },
    { name: 'Thesis Coverage', score: thesis.score, weight: 0.15, detail: thesis.detail },
    { name: 'Plan Compliance', score: compliance.score, weight: 0.15, detail: compliance.detail },
  ]

  const weightedScore = Math.round(
    factors.reduce((sum, f) => sum + f.score * f.weight, 0)
  )

  const letter = letterFromScore(weightedScore)

  return {
    letter,
    score: weightedScore,
    color: colorFromLetter(letter),
    summary: summaryFromLetter(letter),
    factors,
  }
}
