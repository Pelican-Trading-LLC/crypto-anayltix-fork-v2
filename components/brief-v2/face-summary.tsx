'use client'

import { Bird } from '@phosphor-icons/react'
import { FA_FACE_SUMMARY } from '@/lib/forexanalytix-mock-data'
import { FABadge, FAPoweredBy } from '@/components/forexanalytix/fa-badge'

export function FACESummary() {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-[1.5px] font-semibold text-muted-foreground">FACE WEBINAR</span>
          <FABadge />
        </div>
        <span className="font-mono text-[11px] text-muted-foreground">{FA_FACE_SUMMARY.timestamp}</span>
      </div>
      <h3 className="text-[14px] font-semibold mb-1">{FA_FACE_SUMMARY.title}</h3>
      <p className="text-[11px] text-muted-foreground mb-3">
        {FA_FACE_SUMMARY.duration} &middot; {FA_FACE_SUMMARY.analysts.join(', ')}
      </p>
      <ul className="space-y-2 mb-3">
        {FA_FACE_SUMMARY.key_takeaways.map((t, i) => (
          <li key={i} className="flex gap-2 text-[13px] text-muted-foreground leading-relaxed">
            <span className="text-[#4A90C4] font-semibold mt-0.5 flex-shrink-0">{i + 1}.</span>
            {t}
          </li>
        ))}
      </ul>
      <div className="rounded-lg p-2.5" style={{ background: 'linear-gradient(135deg, rgba(74,144,196,0.04) 0%, var(--card) 40%)', border: '1px solid rgba(74,144,196,0.10)' }}>
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[1.5px] font-semibold text-[#4A90C4] mb-1">
          <Bird size={12} weight="fill" className="text-[#4A90C4]" />
          PELICAN TRANSLATION
        </div>
        <p className="text-[13px] text-muted-foreground leading-relaxed">{FA_FACE_SUMMARY.pelican_translation}</p>
      </div>
      <FAPoweredBy />
    </div>
  )
}
