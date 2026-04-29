'use client'

import Link from 'next/link'
import useSWR from 'swr'
import type { TrackRecordStats } from '@/lib/blake-mode/track-record-stats'

const fetcher = (url: string) => fetch(url).then((response) => response.json())

export function TrackRecordCard() {
  const { data } = useSWR<{ stats: TrackRecordStats }>('/api/blake-mode/track-record', fetcher)
  const stats = data?.stats

  return (
    <section className="rounded-md border border-white/10 bg-[#0B1220] p-5 text-white shadow-[0_16px_60px_rgba(0,0,0,0.22)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#2DD4D4]">Pipczar Index</p>
          <h2 className="mt-2 text-lg font-semibold">Blake&apos;s last 90 days</h2>
        </div>
        <Link href="/track-record" className="rounded-md border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/68 hover:text-white">
          View full
        </Link>
      </div>

      <div className="mt-5 grid grid-cols-4 gap-3">
        {[
          ['Calls', stats?.totalCalls ?? 0],
          ['Hit rate', `${(stats?.hitRatePercent ?? 0).toFixed(0)}%`],
          ['Avg R', `${(stats?.averageRMultiple ?? 0).toFixed(2)}R`],
          ['Open', stats?.openCount ?? 0],
        ].map(([label, value]) => (
          <div key={label} className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-3">
            <p className="font-mono text-xl font-semibold text-white">{value}</p>
            <p className="mt-1 text-[10px] uppercase tracking-wide text-white/42">{label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
