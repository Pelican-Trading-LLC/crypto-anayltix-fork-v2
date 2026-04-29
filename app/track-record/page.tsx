'use client'

import { useMemo, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { motion } from 'framer-motion'
import useSWR from 'swr'
import type { BlakeTrackRecordEntry } from '@/lib/blake-mode/types'
import type { TrackRecordStats } from '@/lib/blake-mode/track-record-stats'

const fetcher = (url: string) => fetch(url).then((response) => response.json())

const statusOptions = [
  { label: 'All', value: 'all' },
  { label: 'Hit', value: 'hit_target' },
  { label: 'Invalidated', value: 'invalidated' },
  { label: 'Open', value: 'open' },
]

function formatPrice(value: number | null, ticker: string): string {
  if (value === null) return 'n/a'
  if (ticker === 'EURUSD' || ticker === 'GBPUSD') return value.toFixed(5)
  return value >= 1000 ? value.toLocaleString(undefined, { maximumFractionDigits: 0 }) : value.toFixed(2)
}

export default function TrackRecordPage() {
  const [assetClass, setAssetClass] = useState('all')
  const [status, setStatus] = useState('all')
  const [days, setDays] = useState(90)
  const query = useMemo(() => {
    const params = new URLSearchParams()
    params.set('since', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
    if (assetClass !== 'all') params.set('assetClass', assetClass)
    if (status !== 'all') params.set('status', status)
    return params.toString()
  }, [assetClass, days, status])
  const { data, isLoading } = useSWR<{ stats: TrackRecordStats; calls: BlakeTrackRecordEntry[] }>(`/api/blake-mode/track-record?${query}`, fetcher)
  const stats = data?.stats
  const calls = data?.calls ?? []

  return (
    <main className="min-h-screen bg-[#0B1220] px-8 py-7 text-white">
      <section className="mb-7">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#2DD4D4]">Pipczar Index</p>
        <h1 className="mt-2 text-3xl font-semibold">Blake&apos;s last {days} days</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/58">
          Seeded demo track record showing how manual analyst calls become a public scoreboard.
        </p>
      </section>

      <section className="mb-6 grid grid-cols-4 gap-4">
        {[
          ['Total calls', stats?.totalCalls ?? 0],
          ['Hit rate', `${(stats?.hitRatePercent ?? 0).toFixed(0)}%`],
          ['Average R', `${(stats?.averageRMultiple ?? 0).toFixed(2)}R`],
          ['Open positions', stats?.openCount ?? 0],
        ].map(([label, value]) => (
          <div key={label} className="rounded-md border border-white/10 bg-white/[0.04] p-4">
            <p className="font-mono text-3xl font-semibold">{value}</p>
            <p className="mt-2 text-xs uppercase tracking-wide text-white/42">{label}</p>
          </div>
        ))}
      </section>

      <section className="mb-6 flex flex-wrap items-center gap-3 rounded-md border border-white/10 bg-white/[0.035] p-3">
        {['all', 'crypto', 'equity', 'forex'].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setAssetClass(item)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold capitalize transition ${
              assetClass === item ? 'border-[#2DD4D4] bg-[#2DD4D4]/15 text-[#BFFBFB]' : 'border-white/10 bg-white/[0.03] text-white/58 hover:text-white'
            }`}
          >
            {item === 'all' ? 'All assets' : item}
          </button>
        ))}
        <span className="h-5 w-px bg-white/10" />
        {statusOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setStatus(option.value)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
              status === option.value ? 'border-[#EAB308] bg-[#EAB308]/15 text-[#FEF3C7]' : 'border-white/10 bg-white/[0.03] text-white/58 hover:text-white'
            }`}
          >
            {option.label}
          </button>
        ))}
        <select value={days} onChange={(event) => setDays(Number(event.target.value))} className="ml-auto rounded-md border border-white/10 bg-[#101827] px-3 py-2 text-sm">
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
          <option value={180}>Last 180 days</option>
        </select>
      </section>

      <section className="space-y-4">
        {isLoading &&
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-40 animate-pulse rounded-md border border-white/10 bg-white/[0.04]" />
          ))}

        {!isLoading && calls.length === 0 && (
          <div className="rounded-md border border-white/10 bg-white/[0.035] p-8 text-center text-white/58">No calls match these filters.</div>
        )}

        {calls.map((call, index) => {
          const closed = call.currentStatus === 'hit_target' || call.currentStatus === 'invalidated'
          return (
            <motion.article
              key={call.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, delay: index * 0.035 }}
              className="rounded-md border border-white/10 bg-white/[0.04] p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-lg font-bold">{call.ticker}</span>
                    <span className="rounded-full border border-white/10 bg-white/[0.05] px-2 py-1 text-[10px] uppercase tracking-wide text-white/56">
                      {call.callType.replaceAll('_', ' ')}
                    </span>
                    <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${
                      call.bias === 'long' ? 'bg-green-500/15 text-green-200' : call.bias === 'short' ? 'bg-red-500/15 text-red-200' : 'bg-white/10 text-white/58'
                    }`}>
                      {call.bias}
                    </span>
                  </div>
                  <p className="mt-3 max-w-4xl text-base italic leading-7 text-white/78">{call.callText}</p>
                </div>
                <span className="font-mono text-xs text-white/42">{formatDistanceToNow(new Date(call.callDate), { addSuffix: true })}</span>
              </div>

              <div className="mt-5 grid grid-cols-4 gap-3">
                <Metric label="Entry" value={formatPrice(call.entryPrice, call.ticker)} />
                <Metric label="Target" value={formatPrice(call.targetPrice, call.ticker)} />
                <Metric label="Invalidation" value={formatPrice(call.invalidationPrice, call.ticker)} />
                <Metric label={closed ? 'Outcome' : 'Current'} value={closed ? formatPrice(call.outcomePrice, call.ticker) : 'live watch'} />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-white/50">
                <span className={`rounded-full px-2 py-1 font-semibold uppercase tracking-wide ${
                  call.currentStatus === 'hit_target'
                    ? 'bg-green-500/15 text-green-200'
                    : call.currentStatus === 'invalidated'
                      ? 'bg-red-500/15 text-red-200'
                      : 'bg-[#2DD4D4]/15 text-[#BFFBFB]'
                }`}>
                  {call.currentStatus.replaceAll('_', ' ')}
                </span>
                {closed && call.outcomeDate && <span>Closed {formatDistanceToNow(new Date(call.outcomeDate), { addSuffix: true })}</span>}
                {call.rMultiple !== null && <span className="font-mono">{call.rMultiple.toFixed(2)}R</span>}
                {call.sourceUrl && <a href={call.sourceUrl} className="text-[#2DD4D4]">Originally posted on X</a>}
              </div>
            </motion.article>
          )
        })}
      </section>

      <section className="mt-8 rounded-md border border-[#2DD4D4]/20 bg-[#2DD4D4]/8 p-5">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#BFFBFB]">Pelican Blake-mode coverage extension</p>
        <h2 className="mt-2 text-xl font-semibold">15 manual calls expanded to thesis-tracked setups across 8 tickers.</h2>
        <p className="mt-2 text-sm text-white/60">The demo layer turns Blake&apos;s levels into watchlist status, alerts, briefings, thesis history, and public proof points.</p>
      </section>
    </main>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-[#07101D] px-3 py-3">
      <p className="font-mono text-sm font-semibold text-white">{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-wide text-white/38">{label}</p>
    </div>
  )
}
