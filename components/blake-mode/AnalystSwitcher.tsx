'use client'

import { ANALYSTS } from '@/lib/blake-mode/analysts'

export function AnalystSwitcher({ selected = 'blake' }: { selected?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {Object.values(ANALYSTS).map((analyst) => {
        const active = analyst.id === selected
        return (
          <button
            key={analyst.id}
            type="button"
            disabled={!analyst.active}
            title={analyst.active ? analyst.name : `${analyst.name} coming soon`}
            className={[
              'rounded-full border px-2.5 py-1 text-[10px] font-semibold transition',
              active ? 'border-[#2DD4D4] bg-[#2DD4D4]/20 text-[#0F3B3B]' : 'border-black/10 bg-black/[0.03] text-[#1F2937]/45',
              analyst.active ? 'cursor-pointer' : 'cursor-not-allowed opacity-55',
            ].join(' ')}
          >
            {analyst.shortName}
          </button>
        )
      })}
    </div>
  )
}
