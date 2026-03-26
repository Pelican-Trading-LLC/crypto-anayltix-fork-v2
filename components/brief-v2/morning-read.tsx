'use client'

import { Microphone, Bird } from '@phosphor-icons/react'
import { FA_PODCAST } from '@/lib/forexanalytix-mock-data'
import { FABadge, FAPoweredBy } from '@/components/forexanalytix/fa-badge'

export function MorningRead() {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Microphone size={14} className="text-muted-foreground" />
          <span className="text-[11px] uppercase tracking-[1.5px] font-semibold text-muted-foreground">DAY AHEAD PODCAST</span>
          <FABadge />
        </div>
        <span className="font-mono text-[11px] text-muted-foreground">{FA_PODCAST.timestamp}</span>
      </div>
      <h3 className="text-[14px] font-semibold mb-1">{FA_PODCAST.title}</h3>
      <p className="text-[11px] text-muted-foreground mb-3">{FA_PODCAST.episode} &middot; {FA_PODCAST.duration}</p>
      <ul className="space-y-2 mb-3">
        {FA_PODCAST.key_points.map((p, i) => (
          <li key={i} className="flex gap-2 text-[13px] text-muted-foreground leading-relaxed">
            <span className="text-[#D4A042] flex-shrink-0">&bull;</span>
            {p}
          </li>
        ))}
      </ul>
      <div className="rounded-lg p-2.5" style={{ background: 'linear-gradient(135deg, rgba(74,144,196,0.04) 0%, var(--card) 40%)', border: '1px solid rgba(74,144,196,0.10)' }}>
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[1.5px] font-semibold text-[#4A90C4] mb-1">
          <Bird size={12} weight="fill" className="text-[#4A90C4]" />
          PELICAN TRANSLATION
        </div>
        <p className="text-[13px] text-muted-foreground leading-relaxed">{FA_PODCAST.pelican_translation}</p>
      </div>
      <FAPoweredBy />
    </div>
  )
}
