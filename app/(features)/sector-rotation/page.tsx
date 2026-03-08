'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MOCK_SECTORS } from '@/lib/crypto-mock-data'
import { SectorCard } from '@/components/sector-rotation/sector-card'
import { RotationBriefing } from '@/components/sector-rotation/rotation-briefing'

const TIMEFRAMES = ['7D', '30D', '90D'] as const

export default function SectorRotationPage() {
  const [timeframe, setTimeframe] = useState<string>('7D')
  const router = useRouter()

  const sorted = [...MOCK_SECTORS].sort((a, b) => b.velocity - a.velocity)

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Sector Rotation Tracker</h1>
          <p className="text-sm text-muted-foreground mt-1">Capital doesn&apos;t leave crypto; it rotates. Track the flow.</p>
        </div>
        <div className="flex gap-1 p-1 rounded-lg border bg-card">
          {TIMEFRAMES.map(tf => (
            <button key={tf} onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                timeframe === tf ? 'bg-[#1DA1C4]/15 text-[#1DA1C4]' : 'text-muted-foreground hover:text-foreground'
              }`}>
              {tf}
            </button>
          ))}
        </div>
      </div>

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
