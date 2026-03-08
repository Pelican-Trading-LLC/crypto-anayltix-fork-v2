'use client'

import { Bird, Shield, Warning, Parachute, Check, X, Wallet } from '@phosphor-icons/react'
import { WalletDNAData, formatCompact, formatUSD, ASSET_COLORS } from '@/lib/crypto-mock-data'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const RadarChart = dynamic(() => import('recharts').then(m => m.RadarChart), { ssr: false })
const PolarGrid = dynamic(() => import('recharts').then(m => m.PolarGrid), { ssr: false })
const PolarAngleAxis = dynamic(() => import('recharts').then(m => m.PolarAngleAxis), { ssr: false })
const Radar = dynamic(() => import('recharts').then(m => m.Radar), { ssr: false })
const ResponsiveContainer = dynamic(() => import('recharts').then(m => m.ResponsiveContainer), { ssr: false })

interface Props { data: WalletDNAData }

export function WalletAnalysis({ data }: Props) {
  const statusColors: Record<string, { bg: string; text: string }> = {
    likely_qualified: { bg: 'bg-green-500/10', text: 'text-green-500' },
    partially_qualified: { bg: 'bg-amber-500/10', text: 'text-amber-500' },
    not_qualified: { bg: 'bg-red-500/10', text: 'text-red-500' },
  }

  return (
    <div className="space-y-4">
      {/* Row 1: Archetype + Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Archetype Card */}
        <div className="rounded-xl border bg-card p-5"
          style={{ background: 'linear-gradient(135deg, rgba(29,161,196,0.04) 0%, var(--card) 50%)' }}>
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[11px] text-muted-foreground truncate">{data.address}</span>
            {data.label && <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#1DA1C4]/10 text-[#1DA1C4]">{data.label}</span>}
          </div>
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1.5 rounded-full text-[13px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #1A6FB5, #25BFDF)' }}>
              {data.archetype}
            </span>
          </div>
          <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">{data.archetype_description}</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Avg Hold', value: `${data.avg_hold_days} days` },
              { label: 'Sharpe', value: data.sharpe_ratio.toFixed(2) },
              { label: 'Win Rate', value: `${data.win_rate}%` },
            ].map(s => (
              <div key={s.label} className="text-center p-2 rounded-lg bg-muted/30">
                <span className="text-[10px] text-muted-foreground uppercase block">{s.label}</span>
                <span className="font-mono text-[14px] font-semibold">{s.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 text-[11px] text-muted-foreground">
            {data.total_transactions.toLocaleString()} txns across {data.chains_active} chains since {data.first_seen}
          </div>
        </div>

        {/* Radar Chart */}
        <div className="rounded-xl border bg-card p-5 flex items-center justify-center">
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={data.radar}>
              <PolarGrid stroke="var(--border)" gridType="polygon" />
              <PolarAngleAxis dataKey="axis" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
              <Radar dataKey="value" stroke="#1DA1C4" fill="#1DA1C4" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: MEV Losses + Airdrop Eligibility + Holdings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* MEV Losses */}
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={14} weight="fill" className="text-red-500" />
            <span className="text-[11px] uppercase tracking-[1.5px] font-semibold text-muted-foreground">MEV LOSSES (90d)</span>
          </div>
          <div className="font-mono text-2xl font-bold text-red-500 mb-1">
            -${data.mev_losses.total_90d.toLocaleString()}
          </div>
          <span className="text-[12px] text-muted-foreground">{data.mev_losses.incidents} sandwich attacks detected</span>
          <div className="mt-3 p-2 rounded-lg bg-red-500/5 border border-red-500/10">
            <span className="text-[10px] text-red-500 font-semibold uppercase">Worst Hit</span>
            <div className="text-[12px] font-mono mt-0.5">
              {data.mev_losses.worst_trade.token} — ${data.mev_losses.worst_trade.loss} lost on {data.mev_losses.worst_trade.date}
            </div>
          </div>
          <div className="mt-3 p-2 rounded-lg bg-[#1DA1C4]/5 border border-[#1DA1C4]/10">
            <div className="flex items-center gap-1 mb-1">
              <Bird size={10} className="text-[#1DA1C4]" />
              <span className="text-[10px] text-[#1DA1C4] font-semibold uppercase">Pelican Recommendation</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">{data.mev_losses.recommendation}</p>
          </div>
        </div>

        {/* Airdrop Eligibility */}
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Parachute size={14} weight="fill" className="text-purple-500" />
            <span className="text-[11px] uppercase tracking-[1.5px] font-semibold text-muted-foreground">AIRDROP ELIGIBILITY</span>
          </div>
          <div className="space-y-3">
            {data.airdrops.map(ad => {
              const sc = statusColors[ad.status]!
              const doneCount = ad.checklist.filter(c => c.done).length
              return (
                <div key={ad.protocol} className="p-2.5 rounded-lg border border-[var(--border)]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[13px] font-medium">{ad.protocol}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${sc.bg} ${sc.text}`}>
                      {ad.status.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-[#1DA1C4]" style={{ width: `${(doneCount / ad.checklist.length) * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">{doneCount}/{ad.checklist.length}</span>
                  </div>
                  {ad.checklist.map((c, ci) => (
                    <div key={ci} className="flex items-center gap-1.5 text-[11px]">
                      {c.done ? <Check size={10} className="text-green-500" /> : <X size={10} className="text-red-500/50" />}
                      <span className={c.done ? 'text-muted-foreground' : 'text-muted-foreground/50'}>{c.item}</span>
                    </div>
                  ))}
                  {ad.estimated_value && (
                    <span className="text-[10px] font-mono text-[#1DA1C4] mt-1 block">Est. value: {ad.estimated_value}</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Holdings */}
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Wallet size={14} weight="fill" className="text-[#1DA1C4]" />
            <span className="text-[11px] uppercase tracking-[1.5px] font-semibold text-muted-foreground">TOP HOLDINGS</span>
          </div>
          <div className="font-mono text-2xl font-bold mb-3">
            {formatCompact(data.holdings.reduce((s, h) => s + h.value, 0))}
          </div>
          <div className="space-y-2">
            {data.holdings.map(h => (
              <div key={h.token} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                  style={{ backgroundColor: ASSET_COLORS[h.token] || '#666' }}>
                  {h.token[0]}
                </div>
                <span className="text-[13px] font-medium flex-1">{h.token}</span>
                <span className="font-mono text-[12px] text-muted-foreground">{h.pct}%</span>
                <span className="font-mono text-[12px]">{formatCompact(h.value)}</span>
              </div>
            ))}
          </div>
          {/* Allocation bar */}
          <div className="flex h-2 rounded-full overflow-hidden mt-3">
            {data.holdings.map(h => (
              <div key={h.token} style={{ width: `${h.pct}%`, backgroundColor: ASSET_COLORS[h.token] || '#666' }} />
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Pelican Deep Dive */}
      <div className="rounded-xl border p-5"
        style={{ background: 'linear-gradient(135deg, rgba(29,161,196,0.04) 0%, var(--card) 40%)', borderColor: 'rgba(29,161,196,0.15)' }}>
        <div className="flex items-center gap-2 mb-3">
          <Bird size={16} weight="fill" className="text-[#1DA1C4]" />
          <span className="text-[12px] font-semibold text-[#1DA1C4] uppercase tracking-wider">PELICAN DEEP DIVE</span>
        </div>
        <p className="text-[14px] leading-[1.75] text-foreground/90 mb-4">{data.pelican_narrative}</p>
        <Link href={`/chat?prompt=${encodeURIComponent(`Analyze the wallet ${data.address} — what should I watch for and is this a wallet worth following?`)}`}
          className="inline-flex items-center gap-2 text-[13px] text-[#1DA1C4] font-medium hover:underline">
          Ask Pelican about this wallet →
        </Link>
      </div>
    </div>
  )
}
