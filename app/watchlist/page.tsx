'use client'

import useSWR from 'swr'
import { WatchListTile } from '@/components/blake-mode/WatchListTile'
import { Skeleton } from '@/components/ui/skeleton'
import type { WatchListTileProps } from '@/components/blake-mode/WatchListTile'

const fetcher = (url: string) => fetch(url).then((response) => response.json())

interface WatchlistPayload {
  tiles: WatchListTileProps['tile'][]
  generatedAt: string
}

export default function WatchlistPage() {
  const { data, isLoading } = useSWR<WatchlistPayload>('/api/watchlist', fetcher, { refreshInterval: 60000 })
  const tiles = data?.tiles ?? []
  const generatedAt = data?.generatedAt ?? new Date().toISOString()

  return (
    <div className="min-h-screen bg-[#0B1220] px-8 py-6 text-white">
      <header className="mb-6 flex items-end justify-between border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-semibold">Blake Watch List</h1>
          <p className="mt-1 text-sm text-white/52">Eight markets, one analyst level map, always open.</p>
        </div>
        {data?.generatedAt && <div className="font-mono text-xs text-white/38">{new Date(data.generatedAt).toLocaleTimeString()}</div>}
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-[340px] rounded-md bg-white/10" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {tiles.map((tile) => (
            <WatchListTile key={tile.ticker} tile={tile} generatedAt={generatedAt} />
          ))}
        </div>
      )}
    </div>
  )
}
