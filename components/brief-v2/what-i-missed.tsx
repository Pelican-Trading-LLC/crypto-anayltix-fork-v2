'use client'

import { Clock } from '@phosphor-icons/react'
import { MOCK_BRIEF_V2 } from '@/lib/crypto-mock-data'

export function WhatIMissed() {
  const wim = MOCK_BRIEF_V2.what_i_missed

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Clock size={14} weight="fill" className="text-[#D4A042]" />
        <span className="text-[12px] font-semibold">What I Missed</span>
      </div>
      <span className="text-[11px] text-muted-foreground">Since your last login ({wim.hours_away}h ago):</span>

      <div className="mt-3 rounded-lg p-3 bg-[#E06565]/5 border border-[#E06565]/10">
        <p className="text-[13px] leading-relaxed mb-2">{wim.summary}</p>
        <div className="space-y-2">
          <div>
            <span className="text-[11px] font-semibold">What happened:</span>
            <p className="text-[12px] text-muted-foreground">{wim.what_happened}</p>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#4A90C4]">Action:</span>
            <p className="text-[12px] text-muted-foreground">{wim.action}</p>
          </div>
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground/60 mt-3 text-center">Sample content — actual alerts require connected data feeds</p>
    </div>
  )
}
