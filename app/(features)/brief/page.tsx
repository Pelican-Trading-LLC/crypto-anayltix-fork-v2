'use client'

import { MarketStrip } from '@/components/brief-v2/market-strip'
import { PelicanSynthesisHero } from '@/components/brief-v2/pelican-synthesis-hero'
import { CrossAssetTranslation } from '@/components/brief-v2/cross-asset-translation'
import { BriefAlertsSidebar } from '@/components/brief-v2/brief-alerts-sidebar'
import { WhatIMissed } from '@/components/brief-v2/what-i-missed'

export default function BriefPage() {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-xl font-semibold">Daily Brief</h1>
        <p className="text-sm text-muted-foreground mt-1">Macro weather, sector rotations, and actionable setups.</p>
      </div>

      {/* Market Strip */}
      <MarketStrip />

      {/* Two-column: Brief + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Pelican Synthesis (2/3) */}
        <div className="lg:col-span-2 space-y-4">
          <PelicanSynthesisHero />
          <CrossAssetTranslation />
        </div>

        {/* Right: Alerts + What I Missed (1/3) */}
        <div className="lg:col-span-1 space-y-4">
          <BriefAlertsSidebar />
          <WhatIMissed />
        </div>
      </div>
    </div>
  )
}
