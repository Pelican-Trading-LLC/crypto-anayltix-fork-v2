'use client'

import { Bird, TrendUp, TrendDown } from '@phosphor-icons/react'
import { FAPiP } from '@/lib/forexanalytix-mock-data'
import { FABadge } from './fa-badge'

const ASSET_CLASS_COLORS: Record<string, string> = {
  forex: '#F59E0B',
  crypto: '#9945FF',
  commodity: '#22C55E',
  index: '#2A5ADA',
}

export function PiPCard({ pip }: { pip: FAPiP }) {
  return (
    <div
      className="rounded-xl border bg-card p-4 relative overflow-hidden"
      style={{ borderLeftWidth: 3, borderLeftColor: pip.analyst_color }}
    >
      {/* Header: Analyst + timestamp */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
            style={{ backgroundColor: pip.analyst_color }}
          >
            {pip.analyst_initials}
          </div>
          <div>
            <span className="text-[13px] font-medium">{pip.analyst_name}</span>
            <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-muted text-muted-foreground">
              {pip.methodology}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-muted-foreground">{pip.timestamp}</span>
          <FABadge />
        </div>
      </div>

      {/* Direction + Asset badges */}
      <div className="flex gap-2 mb-2">
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
            pip.direction === 'BULLISH'
              ? 'bg-green-500/10 text-green-500'
              : 'bg-red-500/10 text-red-500'
          }`}
        >
          {pip.direction === 'BULLISH' ? <TrendUp size={12} weight="bold" /> : <TrendDown size={12} weight="bold" />}
          {pip.direction}
        </span>
        <span
          className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
          style={{ backgroundColor: `${ASSET_CLASS_COLORS[pip.asset_class] || '#666'}15`, color: ASSET_CLASS_COLORS[pip.asset_class] || '#666' }}
        >
          {pip.asset}
        </span>
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
            pip.status === 'active'
              ? 'bg-green-500/10 text-green-500'
              : pip.status === 'hit_target'
                ? 'bg-[#1DA1C4]/10 text-[#1DA1C4]'
                : 'bg-red-500/10 text-red-500'
          }`}
        >
          {pip.status === 'active' ? 'Active' : pip.status === 'hit_target' ? 'Target Hit' : 'Stopped Out'}
        </span>
      </div>

      {/* Title + Body */}
      <h3 className="text-[14px] font-semibold mb-1">{pip.title}</h3>
      <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">{pip.body}</p>

      {/* Key Levels */}
      <div className="flex gap-2 mb-2">
        {Object.entries(pip.key_levels).map(([k, v]) => (
          <span key={k} className="px-2 py-1 rounded-md bg-muted text-[11px] font-mono">
            <span className="uppercase text-muted-foreground">{k}</span>{' '}
            <span className="font-semibold">{v}</span>
          </span>
        ))}
      </div>

      {/* Confidence bar */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${pip.confidence}%`,
              background: 'linear-gradient(90deg, #1A6FB5, #25BFDF)',
            }}
          />
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">{pip.confidence}%</span>
      </div>

      {/* Pelican Crypto Translation */}
      {pip.crypto_translation && (
        <div
          className="rounded-lg p-2.5"
          style={{
            background: 'linear-gradient(135deg, rgba(29,161,196,0.04) 0%, var(--card) 40%)',
            border: '1px solid rgba(29,161,196,0.10)',
          }}
        >
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[1.5px] font-semibold text-[#1DA1C4] mb-1">
            <Bird size={12} weight="fill" className="text-[#1DA1C4]" />
            PELICAN CRYPTO TRANSLATION
          </div>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            {pip.crypto_translation}
          </p>
        </div>
      )}
    </div>
  )
}
