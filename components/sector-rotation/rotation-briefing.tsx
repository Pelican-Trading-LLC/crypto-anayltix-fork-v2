'use client'

import { Bird, ArrowRight } from '@phosphor-icons/react'
import { MOCK_ROTATION_BRIEFING, SECTOR_STATUS_CONFIG, formatCompact } from '@/lib/crypto-mock-data'
import { usePelicanPanelContext } from '@/providers/pelican-panel-provider'

export function RotationBriefing() {
  const { openWithPrompt } = usePelicanPanelContext()

  return (
    <div className="rounded-xl border p-5 sticky top-6"
      style={{
        background: 'linear-gradient(135deg, rgba(74,144,196,0.04) 0%, var(--card) 40%)',
        borderColor: 'rgba(74,144,196,0.15)',
      }}>

      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Bird size={16} weight="fill" className="text-[#4A90C4]" />
        <span className="text-[12px] font-semibold text-[#4A90C4] uppercase tracking-wider">PELICAN BRIEFING</span>
      </div>

      {/* Headline */}
      <p className="text-[14px] font-medium leading-relaxed mb-3">{MOCK_ROTATION_BRIEFING.headline}</p>

      {/* Body */}
      <p className="text-[13px] text-muted-foreground leading-[1.7] mb-4">{MOCK_ROTATION_BRIEFING.body}</p>

      {/* Capital Flow Arrows */}
      <div className="rounded-lg bg-muted/30 p-3 mb-4 space-y-2">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">CAPITAL FLOWS</span>
        {MOCK_ROTATION_BRIEFING.flows.map((f, i) => (
          <div key={i} className="flex items-center gap-2 text-[12px]">
            <span className="text-[#E06565] font-medium">{f.from}</span>
            <ArrowRight size={12} className="text-muted-foreground" />
            <span className="text-[#3EBD8C] font-medium">{f.to}</span>
            <span className="font-mono text-[11px] text-[#4A90C4] ml-auto">{formatCompact(f.amount)}</span>
          </div>
        ))}
      </div>

      {/* Velocity Legend */}
      <div className="rounded-lg border p-3 mb-4">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block mb-2">VELOCITY LEGEND</span>
        {Object.entries(SECTOR_STATUS_CONFIG).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-2 py-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
            <span className="text-[11px] text-muted-foreground">{cfg.label}</span>
          </div>
        ))}
      </div>

      {/* Ask Pelican CTA */}
      <button onClick={() => openWithPrompt(null, {
          visibleMessage: 'What crypto narrative should I position in this week?',
          fullPrompt: `[SECTOR ROTATION]\nHeadline: ${MOCK_ROTATION_BRIEFING.headline}\nCapital Flows: ${MOCK_ROTATION_BRIEFING.flows.map(f => `${f.from} -> ${f.to} (${formatCompact(f.amount)})`).join(', ')}\n\nWhich crypto narrative should I position in this week? Give me specific tokens and entry levels.`,
        }, null)}
        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white text-[13px] font-medium transition-all hover:brightness-110 w-full cursor-pointer"
        style={{ background: 'linear-gradient(135deg, #2C5F8A, #5B4F8A)' }}>
        Ask Pelican: What to position in?
      </button>
    </div>
  )
}
