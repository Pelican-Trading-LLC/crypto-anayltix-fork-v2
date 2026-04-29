'use client'

import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((response) => response.json())

export function DataStatusBadge() {
  const { data } = useSWR<{ dataMode?: 'live' | 'demo' }>('/api/health', fetcher, { refreshInterval: 60_000 })
  const live = data?.dataMode === 'live'

  return (
    <span
      className={[
        'inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wide',
        live ? 'border-green-400/30 bg-green-500/12 text-green-200' : 'border-amber-400/30 bg-amber-500/12 text-amber-100',
      ].join(' ')}
    >
      {live ? 'LIVE DATA' : 'DEMO DATA'}
    </span>
  )
}
