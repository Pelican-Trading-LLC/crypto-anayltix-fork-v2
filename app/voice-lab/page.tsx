'use client'

import { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import useSWR from 'swr'
import toast, { Toaster } from 'react-hot-toast'
import { DEFAULT_VOICE_SAMPLES } from '@/lib/blake-mode/voice/fewShotSamples'
import { getLocalVoiceSamples, saveLocalVoiceSamples } from '@/lib/blake-mode/store/local-store'
import type { VoiceSample } from '@/lib/blake-mode/types'

interface RecentGeneration {
  id: string
  ticker: string
  text: string
  createdAt: string
}

const fetcher = (url: string) => fetch(url).then((response) => response.json())

export default function VoiceLabPage() {
  const [samples, setSamples] = useState<VoiceSample[]>(DEFAULT_VOICE_SAMPLES)
  const { data } = useSWR<{ generations: RecentGeneration[] }>('/api/blake-mode/generations?limit=20', fetcher, {
    refreshInterval: 30_000,
  })

  useEffect(() => {
    setSamples(getLocalVoiceSamples() ?? DEFAULT_VOICE_SAMPLES)
  }, [])

  const saveSamples = (nextSamples: VoiceSample[]) => {
    setSamples(nextSamples)
    saveLocalVoiceSamples(nextSamples)
    toast.success('Voice samples saved')
  }

  const addGeneration = (generation: RecentGeneration) => {
    saveSamples([
      ...samples,
      {
        id: `generation-${generation.id}`,
        ticker: generation.ticker,
        state: {},
        output: generation.text,
      },
    ])
  }

  return (
    <main className="min-h-screen bg-[#0B1220] px-8 py-7 text-white">
      <Toaster position="top-right" />
      <div className="mb-6">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#2DD4D4]">Admin</p>
        <h1 className="mt-2 text-2xl font-semibold">Voice Lab</h1>
        <p className="mt-2 text-sm text-white/58">Tune Blake&apos;s few-shot examples and harvest recent Pelican generations.</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-7 rounded-md border border-white/10 bg-white/[0.035] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Current Voice Samples</h2>
            <button type="button" onClick={() => saveSamples(samples)} className="rounded-md bg-[#2DD4D4] px-3 py-2 text-sm font-bold text-[#062326]">
              Save samples
            </button>
          </div>
          <div className="space-y-4">
            {samples.map((sample, index) => (
              <label key={sample.id} className="block">
                <span className="mb-2 block font-mono text-xs uppercase tracking-wide text-white/45">
                  {sample.ticker} sample {index + 1}
                </span>
                <textarea
                  value={sample.output}
                  onChange={(event) => setSamples(samples.map((item) => (item.id === sample.id ? { ...item, output: event.target.value } : item)))}
                  className="min-h-28 w-full rounded-md border border-white/10 bg-[#07101D] p-3 text-sm leading-6 text-white outline-none"
                />
              </label>
            ))}
          </div>
        </section>

        <section className="col-span-5 rounded-md border border-white/10 bg-white/[0.035] p-5">
          <h2 className="mb-4 text-lg font-semibold">Recent Pelican Generations</h2>
          <div className="space-y-3">
            {(data?.generations ?? []).length === 0 && <p className="rounded-md border border-white/10 p-4 text-sm text-white/45">No recent generations yet.</p>}
            {(data?.generations ?? []).map((generation) => (
              <article key={generation.id} className="rounded-md border border-white/10 bg-[#07101D] p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-mono text-sm font-bold">{generation.ticker}</span>
                  <span className="font-mono text-[10px] text-white/38">{formatDistanceToNow(new Date(generation.createdAt), { addSuffix: true })}</span>
                </div>
                <p className="text-sm leading-6 text-white/68">{generation.text}</p>
                <button type="button" onClick={() => addGeneration(generation)} className="mt-3 rounded-md border border-[#2DD4D4]/30 px-3 py-1.5 text-xs font-semibold text-[#BFFBFB]">
                  Add to voice samples
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
