'use client'

import { useMemo } from 'react'
import { CaretUp, CaretDown, Lightning, Shield, Warning, Clock } from '@phosphor-icons/react'
import { TokenIntelData, formatUSD, formatCompact, formatPct } from '@/lib/crypto-mock-data'
import dynamic from 'next/dynamic'

const AreaChart = dynamic(() => import('recharts').then(m => m.AreaChart), { ssr: false })
const Area = dynamic(() => import('recharts').then(m => m.Area), { ssr: false })
const ResponsiveContainer = dynamic(() => import('recharts').then(m => m.ResponsiveContainer), { ssr: false })
const XAxis = dynamic(() => import('recharts').then(m => m.XAxis), { ssr: false })
const Tooltip = dynamic(() => import('recharts').then(m => m.Tooltip), { ssr: false })

interface Props { data: TokenIntelData }

export function PriceActionCard({ data }: Props) {
  const sparkData = useMemo(() =>
    data.sparkline_7d.filter((_, i) => i % 4 === 0).map((v, i) => ({ i, v })),
    [data.sparkline_7d]
  )
  const isUp = data.price_change_7d >= 0
  const gradientColor = isUp ? '#3EBD8C' : '#E06565'

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Lightning size={14} weight="fill" className="text-[#4A90C4]" />
        <span className="text-[11px] uppercase tracking-[1.5px] font-semibold text-muted-foreground">PRICE ACTION</span>
      </div>

      {/* Price + change badges */}
      <div className="flex items-baseline gap-3 mb-1">
        <span className="font-mono text-3xl font-bold tabular-nums">{formatUSD(data.price)}</span>
      </div>
      <div className="flex gap-2 mb-4">
        {[
          { label: '24h', value: data.price_change_24h },
          { label: '7d', value: data.price_change_7d },
          { label: '30d', value: data.price_change_30d },
        ].map(p => (
          <span key={p.label} className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold ${
            p.value >= 0 ? 'bg-[#3EBD8C]/10 text-[#3EBD8C]' : 'bg-[#E06565]/10 text-[#E06565]'
          }`}>
            {p.value >= 0 ? <CaretUp size={10} weight="fill" /> : <CaretDown size={10} weight="fill" />}
            {p.label} {formatPct(p.value)}
          </span>
        ))}
      </div>

      {/* 7d Sparkline */}
      <div className="h-[80px] mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparkData}>
            <defs>
              <linearGradient id={`spark-${data.symbol}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={gradientColor} stopOpacity={0.25} />
                <stop offset="100%" stopColor={gradientColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="i" hide />
            <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }}
              formatter={(value) => [formatUSD(Number(value ?? 0)), 'Price']} labelFormatter={() => ''} />
            <Area type="monotone" dataKey="v" stroke={gradientColor} strokeWidth={1.5} fill={`url(#spark-${data.symbol})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Key metrics grid */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        {[
          { label: 'Market Cap', value: formatCompact(data.market_cap) },
          { label: 'FDV', value: formatCompact(data.fdv) },
          { label: 'Volume (24h)', value: formatCompact(data.volume_24h) },
          { label: 'Vol/MCap', value: data.vol_mcap_ratio.toFixed(3) },
          { label: 'ATH', value: formatUSD(data.ath) },
          { label: 'ATH Date', value: data.ath_date },
        ].map(m => (
          <div key={m.label} className="flex justify-between py-1.5 border-b border-[var(--border)] last:border-0">
            <span className="text-[12px] text-muted-foreground">{m.label}</span>
            <span className="font-mono text-[12px] tabular-nums font-medium">{m.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DerivativesCard({ data }: Props) {
  // Funding rate gauge position: map -0.1 to +0.1 range to 0-100%
  const fundingPct = Math.min(100, Math.max(0, ((data.funding_rate + 0.05) / 0.1) * 100))
  const fundingColor = data.funding_rate > 0.01 ? '#E06565' : data.funding_rate < -0.01 ? '#3EBD8C' : '#D4A042'

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Lightning size={14} weight="fill" className="text-[#D4A042]" />
        <span className="text-[11px] uppercase tracking-[1.5px] font-semibold text-muted-foreground">DERIVATIVES</span>
      </div>

      {/* Funding Rate Gauge */}
      <div className="mb-4">
        <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
          <span>Shorts Pay</span>
          <span>Neutral</span>
          <span>Longs Pay</span>
        </div>
        <div className="relative h-2 rounded-full overflow-hidden" style={{ background: 'linear-gradient(90deg, #3EBD8C, #D4A042 50%, #E06565)' }}>
          <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 shadow-md"
            style={{ left: `calc(${fundingPct}% - 6px)`, borderColor: fundingColor }} />
        </div>
        <div className="flex justify-between items-baseline mt-2">
          <span className="text-[12px] text-muted-foreground">Funding Rate</span>
          <span className="font-mono text-sm font-semibold" style={{ color: fundingColor }}>
            {data.funding_rate >= 0 ? '+' : ''}{(data.funding_rate * 100).toFixed(4)}%
            <span className="text-[10px] text-muted-foreground ml-1">({data.funding_annualized.toFixed(1)}% ann.)</span>
          </span>
        </div>
      </div>

      {/* OI + L/S + Liquidations */}
      <div className="space-y-2">
        {[
          { label: 'Open Interest', value: formatCompact(data.open_interest), change: data.oi_change_24h },
          { label: 'Long/Short Ratio', value: data.long_short_ratio.toFixed(2), change: null },
        ].map(m => (
          <div key={m.label} className="flex justify-between py-1.5 border-b border-[var(--border)]">
            <span className="text-[12px] text-muted-foreground">{m.label}</span>
            <span className="font-mono text-[12px] tabular-nums font-medium">
              {m.value}
              {m.change !== null && (
                <span className={`ml-1.5 ${m.change >= 0 ? 'text-[#3EBD8C]' : 'text-[#E06565]'}`}>
                  {m.change >= 0 ? '+' : ''}{m.change.toFixed(1)}%
                </span>
              )}
            </span>
          </div>
        ))}

        {/* Liquidation bar */}
        <div className="pt-2">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">24h Liquidations</span>
          <div className="flex h-2 rounded-full overflow-hidden mt-1.5">
            <div className="bg-[#E06565] h-full" style={{ width: `${(data.liquidations_24h.longs / (data.liquidations_24h.longs + data.liquidations_24h.shorts)) * 100}%` }} />
            <div className="bg-[#3EBD8C] h-full flex-1" />
          </div>
          <div className="flex justify-between mt-1 text-[10px] font-mono">
            <span className="text-[#E06565]">Longs: {formatCompact(data.liquidations_24h.longs)}</span>
            <span className="text-[#3EBD8C]">Shorts: {formatCompact(data.liquidations_24h.shorts)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function OnChainRiskCard({ data }: Props) {
  const riskColor = data.risk_score <= 3 ? '#3EBD8C' : data.risk_score <= 6 ? '#D4A042' : '#E06565'

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield size={14} weight="fill" className="text-[#4A90C4]" />
          <span className="text-[11px] uppercase tracking-[1.5px] font-semibold text-muted-foreground">ON-CHAIN &amp; RISK</span>
        </div>
        {/* Risk Score Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: `${riskColor}15`, border: `1px solid ${riskColor}30` }}>
          <span className="text-[11px] font-semibold" style={{ color: riskColor }}>Risk: {data.risk_score}/10</span>
        </div>
      </div>

      {/* Holder Concentration Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
          <span>Holder Concentration</span>
          <span>Top 10: {data.top_10_holders_pct}%</span>
        </div>
        <div className="flex h-3 rounded-full overflow-hidden bg-muted">
          <div className="rounded-full" style={{
            width: `${data.top_10_holders_pct}%`,
            background: data.top_10_holders_pct > 50 ? '#E06565' : data.top_10_holders_pct > 30 ? '#D4A042' : '#3EBD8C'
          }} />
        </div>
      </div>

      {/* Metrics */}
      <div className="space-y-2">
        {[
          { label: 'Smart Money (7d)', value: `${data.smart_money_flow_7d >= 0 ? '+' : ''}${formatCompact(Math.abs(data.smart_money_flow_7d))}`, color: data.smart_money_flow_7d >= 0 ? 'text-[#3EBD8C]' : 'text-[#E06565]' },
          { label: 'Exchange Netflow (7d)', value: `${data.exchange_netflow_7d >= 0 ? '+' : ''}${formatCompact(Math.abs(data.exchange_netflow_7d))}`, color: data.exchange_netflow_7d <= 0 ? 'text-[#3EBD8C]' : 'text-[#E06565]' },
          { label: 'Active Addresses (7d)', value: `${(data.active_addresses_7d / 1000).toFixed(0)}K`, color: data.active_addresses_change >= 0 ? 'text-[#3EBD8C]' : 'text-[#E06565]', change: data.active_addresses_change },
          { label: 'Holders', value: data.holder_count.toLocaleString(), color: '' },
        ].map(m => (
          <div key={m.label} className="flex justify-between py-1.5 border-b border-[var(--border)]">
            <span className="text-[12px] text-muted-foreground">{m.label}</span>
            <span className={`font-mono text-[12px] tabular-nums font-medium ${m.color}`}>
              {m.value}
              {'change' in m && m.change !== undefined && <span className="text-[10px] ml-1">({(m.change as number) >= 0 ? '+' : ''}{(m.change as number).toFixed(1)}%)</span>}
            </span>
          </div>
        ))}
        {data.tvl !== null && (
          <div className="flex justify-between py-1.5 border-b border-[var(--border)]">
            <span className="text-[12px] text-muted-foreground">TVL</span>
            <span className="font-mono text-[12px] tabular-nums font-medium">
              {formatCompact(data.tvl)}
              <span className={`text-[10px] ml-1 ${(data.tvl_change_30d || 0) >= 0 ? 'text-[#3EBD8C]' : 'text-[#E06565]'}`}>
                ({(data.tvl_change_30d || 0) >= 0 ? '+' : ''}{data.tvl_change_30d}%)
              </span>
            </span>
          </div>
        )}
      </div>

      {/* Next Unlock */}
      {data.next_unlock && (
        <div className="mt-4 p-3 rounded-lg bg-[#D4A042]/5 border border-[#D4A042]/15">
          <div className="flex items-center gap-1.5 mb-1">
            <Clock size={12} className="text-[#D4A042]" />
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#D4A042]">UNLOCK ALERT</span>
          </div>
          <span className="text-[12px] font-mono font-medium text-[#D4A042]">
            {data.next_unlock.days} days — {data.next_unlock.pct_supply}% of supply
          </span>
          <span className="text-[11px] text-muted-foreground block mt-0.5">Recipient: {data.next_unlock.recipient}</span>
        </div>
      )}

      {/* Risk Factors */}
      {data.risk_factors.length > 0 && (
        <div className="mt-4 space-y-1.5">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">RISK FLAGS</span>
          {data.risk_factors.map((f, i) => (
            <div key={i} className="flex items-start gap-2">
              <Warning size={12} className="text-[#D4A042] mt-0.5 shrink-0" />
              <span className="text-[11px] text-muted-foreground leading-relaxed">{f}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
