'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { formatDistanceToNow } from 'date-fns'
import type { BlakeThesis } from '@/lib/blake-mode/types'

const fetcher = (url: string) => fetch(url).then((response) => response.json())

function biasClass(bias: BlakeThesis['bias']): string {
  if (bias === 'long') return 'border-[#16A34A]/30 bg-[#16A34A]/10 text-[#86EFAC]'
  if (bias === 'short') return 'border-[#DC2626]/30 bg-[#DC2626]/10 text-[#FCA5A5]'
  return 'border-white/10 bg-white/[0.04] text-white/55'
}

function snapshotValue(snapshot: unknown, key: string): unknown {
  return snapshot && typeof snapshot === 'object' ? (snapshot as Record<string, unknown>)[key] : undefined
}

function diffLabel(current: BlakeThesis, previous?: BlakeThesis): string {
  if (!previous) return 'First thesis recorded. Future changes will appear here.'
  if (current.rsi !== previous.rsi) return `RSI shifted to ${current.rsi?.toFixed(1) ?? 'n/a'}`
  if (current.trend !== previous.trend) return `Trend shifted from ${previous.trend ?? 'n/a'} to ${current.trend ?? 'n/a'}`
  if (current.recentEvent !== previous.recentEvent) return `Event changed to ${current.recentEvent?.replaceAll('_', ' ') ?? 'neutral'}`
  const currentLevels = snapshotValue(current.stateSnapshot, 'manualLevels') as unknown[] | undefined
  const previousLevels = snapshotValue(previous.stateSnapshot, 'manualLevels') as unknown[] | undefined
  if ((currentLevels?.length ?? 0) > (previousLevels?.length ?? 0)) return 'New manual level added'
  return 'Structure hash changed'
}

export function ThesisTimeline({ ticker }: { ticker: string }) {
  const { data, isLoading } = useSWR<{ theses: BlakeThesis[] }>(`/api/blake-mode/theses/${ticker}`, fetcher, { refreshInterval: 30000 })
  const [expanded, setExpanded] = useState<string | null>(null)
  const theses = data?.theses ?? []

  return (
    <div className="mt-6 rounded-md border border-white/10 bg-[#101827] p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Thesis History</h3>
          <p className="mt-1 text-xs text-white/42">Recorded when Blake-mode structure changes.</p>
        </div>
        <span className="font-mono text-xs text-white/35">{theses.length} entries</span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <div className="h-20 rounded-md bg-white/10" />
          <div className="h-20 rounded-md bg-white/10" />
        </div>
      ) : theses.length === 0 ? (
        <div className="rounded-md border border-dashed border-white/12 bg-white/[0.03] px-3 py-5 text-sm text-white/52">
          No theses recorded yet. Generate an analysis to start the timeline.
        </div>
      ) : (
        <div className="relative space-y-3 before:absolute before:left-[9px] before:top-2 before:h-[calc(100%-16px)] before:w-px before:bg-[#EAB308]/35">
          {theses.map((thesis, index) => {
            const previous = theses[index + 1]
            const open = expanded === thesis.id
            const text = open || thesis.thesisText.length <= 200 ? thesis.thesisText : `${thesis.thesisText.slice(0, 200)}...`
            return (
              <button
                key={thesis.id}
                type="button"
                onClick={() => setExpanded(open ? null : thesis.id)}
                className={['relative w-full rounded-md border border-white/10 p-3 pl-8 text-left transition hover:border-white/20', index % 2 === 0 ? 'bg-white/[0.035]' : 'bg-white/[0.02]'].join(' ')}
              >
                <span className="absolute left-1 top-4 h-3 w-3 rounded-full border border-[#EAB308] bg-[#101827]" />
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-white/42">{formatDistanceToNow(new Date(thesis.createdAt), { addSuffix: true })}</span>
                  <span className={['rounded-sm border px-2 py-0.5 text-[10px] font-semibold uppercase', biasClass(thesis.bias)].join(' ')}>{thesis.bias ?? 'neutral'}</span>
                </div>
                <p className="mt-2 text-sm leading-5 text-white/72">{text}</p>
                <p className="mt-2 font-mono text-[11px] text-[#EAB308]/75">{diffLabel(thesis, previous)}</p>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
