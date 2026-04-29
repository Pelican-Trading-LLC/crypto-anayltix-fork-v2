'use client'

import { formatDistanceToNow } from 'date-fns'
import { Pencil } from 'lucide-react'
import type { BlakeLevel } from '@/lib/blake-mode/types'

const COLOR_DOT: Record<BlakeLevel['color'], string> = {
  cyan: 'bg-[#2DD4D4]',
  black: 'bg-[#111827]',
  red: 'bg-[#DC2626]',
  blue: 'bg-[#2563EB]',
}

export function ManualLevelsPanel({
  levels,
  currentPrice,
  onEdit,
}: {
  levels: BlakeLevel[]
  currentPrice: number
  onEdit: (level: BlakeLevel) => void
}) {
  const sorted = [...levels].sort((a, b) => Math.abs((a.price - currentPrice) / currentPrice) - Math.abs((b.price - currentPrice) / currentPrice))
  const latest = sorted
    .map((level) => level.updatedAt)
    .sort()
    .at(-1)

  return (
    <div className="rounded-md border border-white/10 bg-[#101827] p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Blake&apos;s Levels</h3>
          <p className="mt-1 text-xs text-white/45">{latest ? `Last updated ${formatDistanceToNow(new Date(latest), { addSuffix: true })}` : 'Manual inputs sync across the demo'}</p>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-md border border-dashed border-white/12 bg-white/[0.03] px-3 py-5 text-sm text-white/52">
          No levels published yet. Toggle Admin Mode to drop your first level.
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((level) => {
            const distance = ((level.price - currentPrice) / currentPrice) * 100
            const useful = distance < 0 ? 'text-[#86EFAC]' : 'text-[#FCA5A5]'
            return (
              <div key={level.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-md border border-white/10 bg-white/[0.035] px-3 py-2">
                <span className={['h-3 w-3 rounded-full', COLOR_DOT[level.color]].join(' ')} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-semibold">{level.price.toLocaleString(undefined, { maximumFractionDigits: 5 })}</span>
                    <span className="rounded-sm border border-white/10 px-1.5 py-0.5 text-[10px] uppercase text-white/55">{level.role}</span>
                    <span className="rounded-sm bg-white/10 px-1.5 py-0.5 text-[10px] uppercase text-white/45">{level.status}</span>
                  </div>
                  <div className="mt-1 truncate text-xs text-white/55">{level.label || 'Untitled Blake level'}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={['font-mono text-xs', useful].join(' ')}>{distance > 0 ? '+' : ''}{distance.toFixed(2)}%</span>
                  <button type="button" onClick={() => onEdit(level)} className="rounded p-1 text-white/45 hover:bg-white/10 hover:text-white" aria-label={`Edit ${level.label || level.role}`}>
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
