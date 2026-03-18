'use client'

import { Bird, ArrowBendRightDown } from '@phosphor-icons/react'
import { MOCK_BRIEF_V2 } from '@/lib/crypto-mock-data'

export function CrossAssetTranslation() {
  const ca = MOCK_BRIEF_V2.cross_asset

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <ArrowBendRightDown size={16} className="text-[#1DA1C4]" />
        <span className="text-[13px] font-semibold">Cross-Asset Translation</span>
      </div>

      {/* ForexAnalytix quote — looks like a quoted message */}
      <div className="rounded-lg bg-muted/40 p-3 mb-3 border-l-2 border-muted-foreground/20">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[11px] font-semibold">{ca.analyst_name}</span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-muted text-muted-foreground">{ca.analyst_methodology}</span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber-500/10 text-amber-500">ForexAnalytix</span>
        </div>
        <p className="text-[12px] font-mono text-muted-foreground leading-relaxed">{ca.analyst_quote}</p>
      </div>

      {/* Pelican Translation */}
      <div className="flex items-center gap-1.5 mb-2">
        <Bird size={14} weight="fill" className="text-[#1DA1C4]" />
        <span className="text-[11px] uppercase tracking-wider font-bold text-[#1DA1C4]">PELICAN TRANSLATION</span>
      </div>
      <p className="text-[14px] leading-[1.75] text-foreground/90">{ca.pelican_translation}</p>
      <p className="text-[10px] text-muted-foreground/60 mt-4 text-center">Sample content — live cross-asset data not yet connected</p>
    </div>
  )
}
