'use client'

import { Clock } from '@phosphor-icons/react'
import { MOCK_BRIEF_V2 } from '@/lib/crypto-mock-data'

export function WhatIMissed() {
  const wim = MOCK_BRIEF_V2.what_i_missed

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Clock size={14} weight="fill" className="text-amber-500" />
        <span className="text-[12px] font-semibold">What I Missed</span>
      </div>
      <span className="text-[11px] text-muted-foreground">Since your last login ({wim.hours_away}h ago):</span>

      <div className="mt-3 rounded-lg p-3 bg-red-500/5 border border-red-500/10">
        <p className="text-[13px] leading-relaxed mb-2">{wim.summary}</p>
        <div className="space-y-2">
          <div>
            <span className="text-[11px] font-semibold">What happened:</span>
            <p className="text-[12px] text-muted-foreground">{wim.what_happened}</p>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#1DA1C4]">Action:</span>
            <p className="text-[12px] text-muted-foreground">{wim.action}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
