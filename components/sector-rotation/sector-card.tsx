'use client'

import { CaretUp, CaretDown } from '@phosphor-icons/react'
import { SectorData, SECTOR_STATUS_CONFIG, formatCompact } from '@/lib/crypto-mock-data'
import dynamic from 'next/dynamic'

const AreaChart = dynamic(() => import('recharts').then(m => m.AreaChart), { ssr: false })
const Area = dynamic(() => import('recharts').then(m => m.Area), { ssr: false })
const ResponsiveContainer = dynamic(() => import('recharts').then(m => m.ResponsiveContainer), { ssr: false })

interface Props {
  sector: SectorData
  onTokenClick: (symbol: string) => void
}

export function SectorCard({ sector, onTokenClick }: Props) {
  const config = SECTOR_STATUS_CONFIG[sector.status]!
  const isPositive = sector.velocity >= 0
  const sparkData = sector.sparkline_7d.map((v, i) => ({ i, v }))

  return (
    <div className="rounded-xl border bg-card p-4 transition-all hover:translate-y-[-1px] hover:shadow-md cursor-default"
      style={{
        borderColor: `${config.color}25`,
        boxShadow: `0 0 20px ${config.glow}`,
      }}>

      {/* Header: Name + Velocity */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[15px] font-semibold">{sector.name}</h3>
        <div className="flex items-center gap-1" style={{ color: config.color }}>
          {isPositive ? <CaretUp size={14} weight="fill" /> : <CaretDown size={14} weight="fill" />}
          <span className="font-mono text-[14px] font-bold">{Math.abs(sector.velocity).toFixed(1)}</span>
        </div>
      </div>

      {/* Mini sparkline */}
      <div className="h-[40px] mb-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparkData}>
            <defs>
              <linearGradient id={`sector-${sector.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={config.color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={config.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke={config.color} strokeWidth={1.5} fill={`url(#sector-${sector.id})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Volume + Smart Money */}
      <div className="flex justify-between mb-3">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">VOLUME</span>
          <span className="font-mono text-[13px] font-medium">{formatCompact(sector.volume)}</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">SMART MONEY</span>
          <span className={`font-mono text-[13px] font-medium ${sector.smart_money_flow >= 0 ? 'text-[#3EBD8C]' : 'text-[#E06565]'}`}>
            {sector.smart_money_flow >= 0 ? '+' : ''}{formatCompact(Math.abs(sector.smart_money_flow))}
          </span>
        </div>
      </div>

      {/* Top tokens */}
      <div className="flex gap-1.5 flex-wrap">
        {sector.top_tokens.map(t => (
          <button key={t.symbol} onClick={() => onTokenClick(t.symbol)}
            className="px-2 py-0.5 rounded-md border border-[var(--border)] text-[11px] font-mono font-medium hover:border-[#4A90C4]/40 hover:text-[#4A90C4] transition-colors cursor-pointer">
            ${t.symbol}
          </button>
        ))}
      </div>
    </div>
  )
}
