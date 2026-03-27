'use client'

import { MarketStrip } from '@/components/brief-v2/market-strip'
import { PelicanSynthesisHero } from '@/components/brief-v2/pelican-synthesis-hero'
import { CrossAssetTranslation } from '@/components/brief-v2/cross-asset-translation'
import { BriefAlertsSidebar } from '@/components/brief-v2/brief-alerts-sidebar'
import { WhatIMissed } from '@/components/brief-v2/what-i-missed'
import { FACESummary } from '@/components/brief-v2/face-summary'
import { MorningRead } from '@/components/brief-v2/morning-read'
import { FABlogPosts } from '@/components/brief-v2/fa-blog-posts'
import { BriefPredictionMarkets } from '@/components/brief-v2/brief-prediction-markets'
import { BriefTokenizationPulse } from '@/components/brief-v2/brief-tokenization-pulse'
import { ResearchFeed } from '@/components/shared/research-feed'
import { XFeed } from '@/components/shared/x-feed'

export default function BriefPage() {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div className="p-6 w-full">
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
          <BriefPredictionMarkets />
          <BriefTokenizationPulse />
          <FACESummary />
          <MorningRead />
          <FABlogPosts />

          {/* Research Feed */}
          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--border-subtle)]">
              <span className="text-[11px] uppercase tracking-[1.5px] font-semibold text-muted-foreground">RESEARCH FEED</span>
            </div>
            <ResearchFeed />
          </div>
        </div>

        {/* Right: Alerts + What I Missed + X Feed (1/3) */}
        <div className="lg:col-span-1 space-y-4">
          <BriefAlertsSidebar />
          <WhatIMissed />

          {/* X Feed */}
          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--border-subtle)]">
              <span className="text-[11px] uppercase tracking-[1.5px] font-semibold text-muted-foreground">CRYPTO X</span>
            </div>
            <XFeed />
          </div>
        </div>
      </div>
    </div>
  )
}
