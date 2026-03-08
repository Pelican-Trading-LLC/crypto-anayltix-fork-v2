'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { ChatCircle, CaretUp, CaretDown, TrendUp, Bell, Heart } from '@phosphor-icons/react'
import { MOCK_PORTFOLIO, MOCK_POSITIONS, MOCK_SMART_MONEY, ASSET_COLORS, formatUSD, formatPnl, formatPct, formatCompact } from '@/lib/crypto-mock-data'
import dynamic from 'next/dynamic'

const AreaChart = dynamic(() => import('recharts').then(m => m.AreaChart), { ssr: false })
const Area = dynamic(() => import('recharts').then(m => m.Area), { ssr: false })
const XAxis = dynamic(() => import('recharts').then(m => m.XAxis), { ssr: false })
const YAxis = dynamic(() => import('recharts').then(m => m.YAxis), { ssr: false })
const Tooltip = dynamic(() => import('recharts').then(m => m.Tooltip), { ssr: false })
const ResponsiveContainer = dynamic(() => import('recharts').then(m => m.ResponsiveContainer), { ssr: false })
const RadarChart = dynamic(() => import('recharts').then(m => m.RadarChart), { ssr: false })
const PolarGrid = dynamic(() => import('recharts').then(m => m.PolarGrid), { ssr: false })
const PolarAngleAxis = dynamic(() => import('recharts').then(m => m.PolarAngleAxis), { ssr: false })
const Radar = dynamic(() => import('recharts').then(m => m.Radar), { ssr: false })

/* ─── Stat Card ─────────────────────────────────────────────────── */

function StatCard({ title, value, valueColor, subtitle, subtitleColor, icon, healthBar }: {
  title: string; value: string; valueColor?: string; subtitle: string; subtitleColor: string; icon: React.ReactNode; healthBar?: number
}) {
  return (
    <div className="rounded-xl border bg-card p-5 relative overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] uppercase tracking-[1.5px] font-semibold text-muted-foreground">{title}</span>
        <span className="text-muted-foreground">{icon}</span>
      </div>
      <div className={`font-mono text-2xl font-semibold tabular-nums ${valueColor || ''}`}>{value}</div>
      <div className={`font-mono text-xs tabular-nums mt-1 ${subtitleColor}`}>{subtitle}</div>
      {healthBar !== undefined && (
        <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
          <div className="h-full rounded-full bg-[#1DA1C4] transition-all" style={{ width: `${healthBar}%` }} />
        </div>
      )}
    </div>
  )
}

/* ─── Portfolio Chart ───────────────────────────────────────────── */

function PortfolioChart() {
  const data = useMemo(() => {
    const base = 65942
    const result: { date: string; value: number }[] = []
    let prev = base * 0.94
    for (let i = 29; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i)
      prev += (Math.random() - 0.44) * base * 0.012
      result.push({ date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), value: Math.round(prev * 100) / 100 })
    }
    return result
  }, [])

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] uppercase tracking-[1.5px] font-semibold text-muted-foreground flex items-center gap-2">
          <TrendUp size={14} /> PORTFOLIO PERFORMANCE
        </span>
        <div className="flex gap-1">
          {['24H', '7D', '30D', '90D', 'YTD', 'ALL'].map(period => (
            <button key={period} className={`px-2.5 py-1 rounded-md text-[11px] font-medium ${period === '30D' ? 'bg-[#1DA1C4]/15 text-[#1DA1C4]' : 'text-muted-foreground hover:text-foreground'}`}>
              {period}
            </button>
          ))}
        </div>
      </div>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1DA1C4" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#1DA1C4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v / 1000).toFixed(1)}K`} domain={['auto', 'auto']} />
            <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} formatter={(value) => [formatUSD(Number(value ?? 0)), 'Value']} />
            <Area type="monotone" dataKey="value" stroke="#1DA1C4" strokeWidth={2} fill="url(#portfolioGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Asset Allocation Bar */}
      <div className="mt-4">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">ASSET ALLOCATION</span>
        <div className="flex h-3 rounded-full overflow-hidden mt-2">
          {MOCK_POSITIONS.map(p => (
            <div key={p.asset} style={{ width: `${p.allocation_pct}%`, backgroundColor: ASSET_COLORS[p.asset] }} />
          ))}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
          {MOCK_POSITIONS.map(p => (
            <span key={p.asset} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ASSET_COLORS[p.asset] }} />
              {p.asset} {p.allocation_pct}%
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Market Pulse ──────────────────────────────────────────────── */

function MarketPulse() {
  return (
    <div className="rounded-xl border bg-card p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] uppercase tracking-[1.5px] font-semibold text-muted-foreground">PELICAN AI MARKET PULSE</span>
        <span className="font-mono text-[11px]">Confidence: <span className="text-[#1DA1C4] font-semibold">94%</span></span>
      </div>
      <div className="flex-1 text-sm text-muted-foreground leading-relaxed space-y-3">
        <p>Bitcoin dominance shows signs of exhaustion at 58.4%. We observe significant rotation of smart money into Layer 2 infrastructure and AI-agent protocols. Volatility expected around Thursday&apos;s FOMC minutes.</p>
        <p>Dormant whale movements of 14,200 BTC detected, suggesting potential sell pressure or OTC deals. Further monitoring required.</p>
      </div>
      <div className="flex gap-2 mt-4">
        {['On-Chain', 'Macro', 'DeFi'].map((tab, i) => (
          <button key={tab} className={`px-3 py-1.5 rounded-lg text-[11px] font-medium ${i === 0 ? 'bg-[#1DA1C4]/15 text-[#1DA1C4]' : 'text-muted-foreground hover:text-foreground'}`}>
            {tab}
          </button>
        ))}
      </div>
      <Link href="/chat?prompt=Give+me+a+full+crypto+market+analysis" className="text-[#1DA1C4] text-sm font-medium mt-3 hover:underline">
        Read Full Analysis →
      </Link>
    </div>
  )
}

/* ─── Top Movers Table ──────────────────────────────────────────── */

function TopMoversTable() {
  return (
    <div className="rounded-xl border bg-card p-5">
      <span className="text-[11px] uppercase tracking-[1.5px] font-semibold text-muted-foreground flex items-center gap-2 mb-4">
        <TrendUp size={14} /> TOP MOVERS
      </span>
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--border)]">
            {['TOKEN', 'PRICE', '24H %', '7D %', 'VOLUME (24H)', 'PELICAN SIGNAL'].map(h => (
              <th key={h} className={`pb-3 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground ${h !== 'TOKEN' ? 'text-right' : 'text-left'}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MOCK_POSITIONS.map(p => {
            const signalColors: Record<string, string> = {
              'Accumulation Zone': 'bg-green-500/10 text-green-500 border-green-500/20',
              'Momentum Breakout': 'bg-[#1DA1C4]/10 text-[#1DA1C4] border-[#1DA1C4]/20',
              'Distribution': 'bg-red-500/10 text-red-500 border-red-500/20',
              'Whale Alert': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
              'Smart Money Inflow': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
            }
            return (
              <tr key={p.asset} className="border-b border-[var(--border)] last:border-0 hover:bg-accent/5 cursor-pointer transition-colors"
                onClick={() => window.location.href = `/chat?prompt=${encodeURIComponent(`Analyze ${p.asset} at ${p.current_price} — 24h change ${p.price_change_24h}%`)}`}>
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white" style={{ backgroundColor: ASSET_COLORS[p.asset] }}>
                      {p.asset[0]}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{p.asset}</div>
                      <div className="text-[11px] text-muted-foreground">{p.name}</div>
                    </div>
                  </div>
                </td>
                <td className="text-right font-mono text-[13px] tabular-nums">{formatUSD(p.current_price)}</td>
                <td className="text-right">
                  <span className={`font-mono text-[13px] tabular-nums inline-flex items-center gap-0.5 ${p.price_change_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {p.price_change_24h >= 0 ? <CaretUp size={12} weight="fill" /> : <CaretDown size={12} weight="fill" />}
                    {formatPct(p.price_change_24h)}
                  </span>
                </td>
                <td className="text-right">
                  <span className={`font-mono text-[13px] tabular-nums inline-flex items-center gap-0.5 ${p.price_change_7d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {p.price_change_7d >= 0 ? <CaretUp size={12} weight="fill" /> : <CaretDown size={12} weight="fill" />}
                    {formatPct(p.price_change_7d)}
                  </span>
                </td>
                <td className="text-right font-mono text-[13px] tabular-nums text-muted-foreground">{formatCompact(p.volume_24h)}</td>
                <td className="text-right">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${signalColors[p.pelican_signal] || ''}`}>
                    {p.pelican_signal}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/* ─── Wallet DNA ────────────────────────────────────────────────── */

function WalletDNA() {
  const dnaData = [
    { axis: 'Risk', value: 85 }, { axis: 'Yield', value: 62 },
    { axis: 'Frequency', value: 78 }, { axis: 'Diversity', value: 45 },
    { axis: 'Holding', value: 30 }, { axis: 'Activity', value: 90 },
  ]

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] uppercase tracking-[1.5px] font-semibold text-muted-foreground">WALLET DNA</span>
        <span className="px-3 py-1 rounded-full text-[11px] font-semibold text-white" style={{ background: 'linear-gradient(135deg, #1A6FB5, #25BFDF)' }}>
          Apex Predator
        </span>
      </div>
      <div className="h-[220px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={dnaData}>
            <PolarGrid stroke="var(--border)" gridType="polygon" />
            <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
            <Radar dataKey="value" stroke="#1DA1C4" fill="#1DA1C4" fillOpacity={0.2} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between mt-2 text-[12px] font-mono text-muted-foreground">
        <span>Avg Hold: <span className="text-foreground font-semibold">14.2 Days</span></span>
        <span>Sharpe: <span className="text-foreground font-semibold">2.94</span></span>
        <span>Win Rate: <span className="text-foreground font-semibold">78%</span></span>
      </div>
    </div>
  )
}

/* ─── Smart Money Feed ──────────────────────────────────────────── */

function SmartMoneyFeed() {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendUp size={14} className="text-muted-foreground" />
        <span className="text-[11px] uppercase tracking-[1.5px] font-semibold text-muted-foreground">SMART MONEY ACTIVITY</span>
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        <span className="text-[11px] text-green-500">Live</span>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--border)]">
            {['TIME', 'WALLET', 'ACTION', 'TOKEN', 'AMOUNT', 'PELICAN COMMENTARY'].map(h => (
              <th key={h} className="pb-3 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground text-left">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MOCK_SMART_MONEY.map(e => (
            <tr key={e.id} className="border-b border-[var(--border)] last:border-0">
              <td className="py-3 font-mono text-[11px] text-muted-foreground whitespace-nowrap">{e.time}</td>
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium">{e.wallet_label}</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-[#1DA1C4]/10 text-[#1DA1C4]">{e.archetype}</span>
                </div>
              </td>
              <td className="py-3 text-[13px] text-muted-foreground">{e.action}</td>
              <td className="py-3 text-[13px] font-semibold">{e.token}</td>
              <td className="py-3 font-mono text-[13px] text-[#1DA1C4]">{e.amount}</td>
              <td className="py-3 text-[12px] italic text-muted-foreground max-w-[300px] truncate">&ldquo;{e.pelican_commentary}&rdquo;</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ─── Dashboard Page ────────────────────────────────────────────── */

export default function DashboardPage() {
  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-4">
      {/* Row 1: 4 stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="PORTFOLIO VALUE" value={formatUSD(MOCK_PORTFOLIO.total_value)} subtitle={`${formatPnl(MOCK_PORTFOLIO.total_pnl)} (${formatPct(MOCK_PORTFOLIO.total_pnl_pct)})`} subtitleColor="text-green-500" icon={<TrendUp size={16} />} />
        <StatCard title="24H P&L" value={formatPnl(MOCK_PORTFOLIO.total_pnl)} valueColor="text-green-500" subtitle={formatPct(MOCK_PORTFOLIO.total_pnl_pct)} subtitleColor="text-green-500" icon={<CaretUp size={16} />} />
        <StatCard title="AI ALERTS TODAY" value="7" subtitle="3 High Impact" subtitleColor="text-amber-500" icon={<Bell size={16} />} />
        <StatCard title="WALLET HEALTH" value="82/100" subtitle="Strong" subtitleColor="text-green-500" icon={<Heart size={16} />} healthBar={82} />
      </div>

      {/* Row 2: Chart + Market Pulse */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <PortfolioChart />
        </div>
        <div className="lg:col-span-1">
          <MarketPulse />
        </div>
      </div>

      {/* Row 3: Top Movers + Wallet DNA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TopMoversTable />
        <WalletDNA />
      </div>

      {/* Row 4: Smart Money Feed */}
      <SmartMoneyFeed />

      {/* Ask Pelican FAB */}
      <Link href="/chat" className="fixed bottom-6 right-6 z-50">
        <button className="flex items-center gap-2 px-5 py-3 rounded-full text-white text-sm font-medium shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
          style={{ background: 'linear-gradient(135deg, #1A6FB5, #25BFDF)', boxShadow: '0 4px 20px rgba(29,161,196,0.3)' }}>
          <ChatCircle size={18} weight="fill" />
          Ask Pelican
        </button>
      </Link>
    </div>
  )
}
