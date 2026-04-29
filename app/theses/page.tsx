'use client'

import { formatDistanceToNow } from 'date-fns'
import useSWR from 'swr'
import { TICKER_CONFIGS } from '@/lib/blake-mode/config'
import type { BlakeThesis } from '@/lib/blake-mode/types'

const fetcher = (url: string) => fetch(url).then((response) => response.json())
const TICKERS = Object.keys(TICKER_CONFIGS)

export default function ThesesPage() {
  return (
    <main className="min-h-screen bg-[#0B1220] px-7 py-6 text-white">
      <div className="mb-6">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#2DD4D4]">Intelligence</p>
        <h1 className="mt-2 text-2xl font-semibold">Cross-Ticker Thesis History</h1>
        <p className="mt-2 text-sm text-white/58">Latest Blake-mode thesis shifts across the eight-ticker universe.</p>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {TICKERS.map((ticker) => (
          <TickerThesisColumn key={ticker} ticker={ticker} />
        ))}
      </div>
    </main>
  )
}

function TickerThesisColumn({ ticker }: { ticker: string }) {
  const { data, isLoading } = useSWR<{ theses: BlakeThesis[] }>(`/api/blake-mode/theses/${ticker}`, fetcher, {
    refreshInterval: 60_000,
  })
  const theses = (data?.theses ?? []).slice(0, 5)

  return (
    <section className="min-h-[420px] rounded-md border border-white/10 bg-white/[0.035] p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-mono text-lg font-bold">{ticker}</h2>
          <p className="text-xs text-white/42">{TICKER_CONFIGS[ticker]?.displayName}</p>
        </div>
        <span className="h-2.5 w-2.5 rounded-full bg-[#2DD4D4]" />
      </div>

      {isLoading && <div className="h-28 animate-pulse rounded-md bg-white/[0.05]" />}
      {!isLoading && theses.length === 0 && <p className="rounded-md border border-white/10 p-4 text-sm text-white/42">No thesis history yet.</p>}
      <div className="space-y-3">
        {theses.map((thesis) => (
          <article key={thesis.id} className="rounded-md border border-white/10 bg-[#07101D] p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                thesis.bias === 'long' ? 'bg-green-500/15 text-green-200' : thesis.bias === 'short' ? 'bg-red-500/15 text-red-200' : 'bg-white/10 text-white/55'
              }`}>
                {thesis.bias ?? 'neutral'}
              </span>
              <span className="font-mono text-[10px] text-white/36">{formatDistanceToNow(new Date(thesis.createdAt), { addSuffix: true })}</span>
            </div>
            <p className="line-clamp-4 text-xs leading-5 text-white/70">{thesis.thesisText}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
