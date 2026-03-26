'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MOCK_SECTORS, SectorData } from '@/lib/crypto-mock-data'
import { SectorCard } from '@/components/sector-rotation/sector-card'
import { RotationBriefing } from '@/components/sector-rotation/rotation-briefing'
import { useLiveSectors } from '@/hooks/use-crypto-data'
import { ApiError } from '@/components/ui/api-error'
import { DataFreshness } from '@/components/ui/data-freshness'

const TIMEFRAMES = ['7D', '30D', '90D'] as const

export default function SectorRotationPage() {
  const [timeframe, setTimeframe] = useState<string>('7D')
  const router = useRouter()
  const { data: liveSectorData, error: sectorError, mutate: retrySectors } = useLiveSectors()

  // Merge live data into mock sectors
  const sectors: SectorData[] = MOCK_SECTORS.map(mockSector => {
    const live = liveSectorData?.find(ls => ls.name === mockSector.name)
    if (!live) return mockSector
    return {
      ...mockSector,
      volume: live.volume || mockSector.volume,
      market_cap: live.market_cap || mockSector.market_cap,
      top_tokens: live.top_tokens.length > 0
        ? live.top_tokens.map(t => ({ symbol: t.symbol, change_7d: t.change_7d }))
        : mockSector.top_tokens,
      // Keep mock: velocity, smart_money_flow, sparkline, status
    }
  })

  const sorted = [...sectors].sort((a, b) => b.velocity - a.velocity)

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Sector Rotation Tracker</h1>
          <p className="text-sm text-muted-foreground mt-1">Capital doesn&apos;t leave crypto; it rotates. Track the flow.</p>
          <DataFreshness source="CoinGecko" isLive={!!liveSectorData && !sectorError} />
        </div>
        <div className="flex gap-1 p-1 rounded-lg border bg-card">
          {TIMEFRAMES.map(tf => {
            const disabled = tf !== '7D'
            return (
              <button key={tf}
                onClick={() => { if (!disabled) setTimeframe(tf) }}
                title={disabled ? 'Coming soon' : undefined}
                className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors ${
                  disabled
                    ? 'opacity-50 cursor-not-allowed text-muted-foreground'
                    : timeframe === tf
                      ? 'bg-[#4A90C4]/15 text-[#4A90C4] cursor-pointer'
                      : 'text-muted-foreground hover:text-foreground cursor-pointer'
                }`}>
                {tf}
              </button>
            )
          })}
        </div>
      </div>

      {sectorError && <ApiError message="Live sector data unavailable — showing estimates" onRetry={() => retrySectors()} compact />}

      {/* Two-column: Cards + Briefing */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left: Sector cards grid (3/4) */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sorted.map(sector => (
              <SectorCard
                key={sector.id}
                sector={sector}
                onTokenClick={(symbol) => router.push(`/token-intel?ticker=${symbol}`)}
              />
            ))}
          </div>
        </div>

        {/* Right: Pelican Briefing (1/4) */}
        <div className="lg:col-span-1">
          <RotationBriefing />
        </div>
      </div>
    </div>
  )
}
