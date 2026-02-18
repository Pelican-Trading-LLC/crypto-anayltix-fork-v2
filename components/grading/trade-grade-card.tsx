'use client'

import { cn } from '@/lib/utils'
import type { TradeGrade, DimensionGrade } from '@/lib/grading/trade-grader'
import { gradeToColor, gradeToRingColor } from '@/lib/grading/trade-grader'

function dimensionBarColor(grade: string): string {
  if (grade.startsWith('A')) return 'bg-green-400'
  if (grade.startsWith('B')) return 'bg-blue-400'
  if (grade.startsWith('C')) return 'bg-yellow-400'
  if (grade.startsWith('D')) return 'bg-orange-400'
  return 'bg-red-400'
}

function DimensionRow({ label, dim }: { label: string; dim: DimensionGrade }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[var(--text-secondary)]">{label}</span>
        <span
          className={cn(
            'font-mono font-semibold tabular-nums',
            gradeToColor(dim.grade),
          )}
        >
          {dim.grade} ({dim.score})
        </span>
      </div>
      <div className="h-1.5 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            dimensionBarColor(dim.grade),
          )}
          style={{ width: `${dim.score}%` }}
        />
      </div>
      <p className="text-[10px] text-[var(--text-muted)] leading-tight">
        {dim.rationale}
      </p>
    </div>
  )
}

interface TradeGradeCardProps {
  grade: TradeGrade
  className?: string
}

export function TradeGradeCard({ grade, className }: TradeGradeCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4',
        className,
      )}
    >
      {/* Overall */}
      <div className="flex items-start gap-4 mb-4 pb-4 border-b border-[var(--border-subtle)]">
        <div
          className={cn(
            'w-14 h-14 rounded-xl flex items-center justify-center ring-2 font-mono text-2xl font-bold',
            gradeToColor(grade.overall_grade),
            gradeToRingColor(grade.overall_grade),
            'bg-[var(--bg-elevated)]',
          )}
        >
          {grade.overall_grade}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              AI Grade
            </span>
            <span className="text-xs font-mono tabular-nums text-[var(--text-muted)]">
              {grade.overall_score}/100
            </span>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mt-1 leading-relaxed">
            {grade.summary}
          </p>
        </div>
      </div>

      {/* Dimensions */}
      <div className="space-y-3">
        <DimensionRow label="Risk Management" dim={grade.risk_management} />
        <DimensionRow label="Entry Quality" dim={grade.entry_quality} />
        <DimensionRow label="Exit Execution" dim={grade.exit_execution} />
        <DimensionRow label="Plan Adherence" dim={grade.plan_adherence} />
        <DimensionRow label="Thesis Quality" dim={grade.thesis_quality} />
      </div>
    </div>
  )
}

export function GradeBadge({ grade }: { grade: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center w-8 h-6 rounded text-xs font-mono font-bold ring-1',
        gradeToColor(grade),
        gradeToRingColor(grade),
        'bg-[var(--bg-elevated)]',
      )}
    >
      {grade}
    </span>
  )
}
