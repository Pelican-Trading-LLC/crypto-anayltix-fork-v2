'use client'

import { Bird, Lightning } from '@phosphor-icons/react'
import { MOCK_BRIEF_V2 } from '@/lib/crypto-mock-data'

export function PelicanSynthesisHero() {
  const synth = MOCK_BRIEF_V2.pelican_synthesis

  return (
    <div className="rounded-xl border p-6"
      style={{
        background: 'linear-gradient(135deg, rgba(29,161,196,0.05) 0%, var(--card) 40%)',
        borderColor: 'rgba(29,161,196,0.15)',
      }}>
      <div className="flex items-center gap-2 mb-4">
        <Bird size={18} weight="fill" className="text-[#1DA1C4]" />
        <span className="text-[13px] font-semibold text-[#1DA1C4]">Pelican Synthesis</span>
      </div>

      {/* Macro Weather */}
      <div className="mb-4">
        <span className="text-[10px] uppercase tracking-[1.5px] font-bold text-muted-foreground">MACRO WEATHER</span>
        <p className="text-[14px] leading-[1.75] text-foreground/90 mt-1.5">{synth.macro_weather}</p>
      </div>

      {/* Sector Rotations */}
      <div className="mb-4">
        <span className="text-[10px] uppercase tracking-[1.5px] font-bold text-muted-foreground">SECTOR ROTATIONS</span>
        <p className="text-[14px] leading-[1.75] text-foreground/90 mt-1.5">{synth.sector_rotations}</p>
      </div>

      {/* THE PLAY — highlighted callout */}
      <div className="rounded-lg p-4"
        style={{
          background: 'linear-gradient(135deg, rgba(29,161,196,0.08) 0%, rgba(29,161,196,0.02) 100%)',
          borderLeft: '3px solid #1DA1C4',
        }}>
        <div className="flex items-center gap-1.5 mb-1.5">
          <Lightning size={14} weight="fill" className="text-[#1DA1C4]" />
          <span className="text-[11px] uppercase tracking-wider font-bold text-[#1DA1C4]">THE PLAY</span>
        </div>
        <p className="text-[14px] font-medium leading-relaxed">{synth.the_play}</p>
      </div>
    </div>
  )
}
