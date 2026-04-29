'use client'

import { useMemo, useState } from 'react'
import useSWR from 'swr'
import toast, { Toaster } from 'react-hot-toast'
import type { BlakeBriefing } from '@/lib/blake-mode/types'

const fetcher = (url: string) => fetch(url).then((response) => response.json())

export default function BriefingsPage() {
  const { data, mutate, isLoading } = useSWR<{ today: BlakeBriefing | null; archive: BlakeBriefing[] }>('/api/blake-mode/briefings', fetcher)
  const briefings = data?.archive ?? []
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = useMemo(() => briefings.find((briefing) => briefing.id === selectedId) ?? data?.today ?? briefings[0] ?? null, [briefings, data?.today, selectedId])

  const generate = async () => {
    await fetch('/api/blake-mode/briefings', { method: 'POST' })
    toast.success("Today's briefing is live")
    mutate()
  }

  return (
    <div className="min-h-screen bg-[#0B1220] px-8 py-6 text-white">
      <Toaster position="top-right" />
      <header className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-semibold">Briefings</h1>
          <p className="mt-1 text-sm text-white/52">Morning desk notes generated from Blake&apos;s levels.</p>
        </div>
        <button type="button" onClick={generate} className="rounded-md bg-[#2DD4D4] px-4 py-2 text-sm font-bold text-[#062326]">
          Generate today&apos;s briefing
        </button>
      </header>

      {isLoading ? (
        <div className="h-72 rounded-md bg-white/10" />
      ) : !selected ? (
        <div className="rounded-md border border-dashed border-white/12 bg-white/[0.03] p-8 text-white/60">
          No briefings yet. Generate today&apos;s briefing from the admin panel.
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-5">
          <aside className="col-span-3 space-y-2">
            {briefings.map((briefing) => (
              <button key={briefing.id} type="button" onClick={() => setSelectedId(briefing.id)} className="w-full rounded-md border border-white/10 bg-white/[0.03] p-3 text-left hover:border-white/20">
                <div className="font-mono text-xs text-[#2DD4D4]">{briefing.briefingDate}</div>
                <div className="mt-1 text-sm text-white/72">{briefing.headline}</div>
              </button>
            ))}
          </aside>
          <main className="col-span-5 rounded-md border border-white/10 bg-[#101827] p-5">
            <p className="font-mono text-xs uppercase tracking-wide text-[#2DD4D4]">{selected.briefingDate}</p>
            <h2 className="mt-3 text-2xl font-semibold leading-tight">{selected.headline}</h2>
            <div className="mt-5 space-y-4 text-sm leading-6 text-white/68">
              {selected.body.split('\n\n').map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {selected.setups.map((setup) => <span key={setup.ticker} className="rounded-sm border border-white/10 px-2 py-1 font-mono text-xs text-white/55">{setup.ticker} {setup.bias}</span>)}
            </div>
          </main>
          <aside className="col-span-4 rounded-md border border-white/10 bg-white/[0.03] p-3">
            <div className="mb-2 font-mono text-xs uppercase tracking-wide text-white/40">Email preview</div>
            <iframe title="Email preview" srcDoc={selected.emailHtml ?? ''} className="h-[620px] w-full rounded bg-white" />
          </aside>
        </div>
      )}
    </div>
  )
}
