'use client'

import { cn } from '@/lib/utils'
import type { Trade } from '@/hooks/use-trades'
import { scoreToGrade, gradeToColor } from '@/lib/grading/trade-grader'
import { PelicanCard } from '@/components/ui/pelican'

interface GradeOverviewProps {
  trades: Trade[]
}

export function GradeOverview({ trades }: GradeOverviewProps) {
  const graded = trades.filter(
    (t) =>
      t.ai_grade &&
      (t.ai_grade as Record<string, unknown>).overall_score != null,
  )
  if (graded.length === 0) return null

  const avg =
    graded.reduce(
      (s, t) =>
        s + Number((t.ai_grade as Record<string, unknown>).overall_score),
      0,
    ) / graded.length
  const avgGrade = scoreToGrade(Math.round(avg))

  const dist: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, F: 0 }
  for (const t of graded) {
    const g = String(
      (t.ai_grade as Record<string, unknown>).overall_grade || '',
    )
    const letter = g.charAt(0)
    if (letter in dist) dist[letter] = (dist[letter] ?? 0) + 1
  }

  return (
    <PelicanCard>
      <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
        Trade Grades
      </h3>
      <div className="flex items-end gap-4">
        <div>
          <p
            className={cn(
              'text-3xl font-bold font-mono',
              gradeToColor(avgGrade),
            )}
          >
            {avgGrade}
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Average ({graded.length} trade{graded.length !== 1 ? 's' : ''})
          </p>
        </div>
        <div className="flex gap-3">
          {Object.entries(dist).map(
            ([letter, count]) =>
              count > 0 && (
                <div key={letter} className="text-center">
                  <p className="text-sm font-mono font-medium tabular-nums text-[var(--text-primary)]">
                    {count}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {letter}&apos;s
                  </p>
                </div>
              ),
          )}
        </div>
      </div>
    </PelicanCard>
  )
}
