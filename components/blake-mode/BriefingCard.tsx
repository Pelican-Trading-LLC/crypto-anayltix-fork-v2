'use client'

import useSWR from 'swr'
import toast from 'react-hot-toast'
import type { BlakeBriefing } from '@/lib/blake-mode/types'

const fetcher = (url: string) => fetch(url).then((response) => response.json())

export function BriefingCard() {
  const { data, mutate, isLoading } = useSWR<{ today: BlakeBriefing | null; archive: BlakeBriefing[] }>('/api/blake-mode/briefings', fetcher)
  const briefing = data?.today

  const generate = async () => {
    const response = await fetch('/api/blake-mode/briefings', { method: 'POST' })
    await response.json()
    toast.success("Today's briefing is live")
    mutate()
  }

  return (
    <div className="rounded-md border border-white/10 bg-[#101827] p-5 text-white">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-[#2DD4D4]">Today&apos;s Briefing</p>
          <p className="mt-1 text-xs text-white/45">by Blake Morrow</p>
        </div>
        {briefing && <span className="font-mono text-xs text-white/40">{briefing.briefingDate}</span>}
      </div>

      {isLoading ? (
        <div className="h-24 rounded-md bg-white/10" />
      ) : briefing ? (
        <>
          <h2 className="text-2xl font-semibold leading-tight text-white">{briefing.headline}</h2>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/62">{briefing.body.split('\n\n')[0]}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {briefing.setups.map((setup) => (
              <span key={setup.ticker} className="rounded-sm border border-white/10 px-2 py-1 font-mono text-xs text-white/62">
                {setup.ticker} {setup.bias}
              </span>
            ))}
          </div>
          <a href={`/briefings?date=${briefing.briefingDate}`} className="mt-4 inline-flex text-sm font-semibold text-[#2DD4D4]">
            Read full briefing
          </a>
        </>
      ) : (
        <div className="rounded-md border border-dashed border-white/12 bg-white/[0.03] p-4">
          <p className="text-sm text-white/60">No briefings yet. Generate today&apos;s briefing from the admin panel.</p>
          <button type="button" onClick={generate} className="mt-3 rounded-md bg-[#2DD4D4] px-3 py-2 text-sm font-bold text-[#062326]">
            Generate today&apos;s briefing
          </button>
        </div>
      )}
    </div>
  )
}
