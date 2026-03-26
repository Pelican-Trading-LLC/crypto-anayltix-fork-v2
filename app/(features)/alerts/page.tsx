'use client'

import { useState, useMemo } from 'react'
import { Bird, Eye, Lightning, TrendUp, Clock, ChartLine, ArrowsLeftRight, Circle } from '@phosphor-icons/react'
import { MOCK_ALERTS, ALERT_CATEGORY_CONFIG, AlertCategory } from '@/lib/crypto-mock-data'
import Link from 'next/link'
import { usePelicanPanelContext } from '@/providers/pelican-panel-provider'

const SEVERITY_STYLES = {
  high: 'bg-[#E06565]/10 text-[#E06565] border-[#E06565]/20',
  medium: 'bg-[#D4A042]/10 text-[#D4A042] border-[#D4A042]/20',
  low: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  eye: <Eye size={14} weight="fill" />,
  lightning: <Lightning size={14} weight="fill" />,
  trend: <TrendUp size={14} weight="fill" />,
  clock: <Clock size={14} weight="fill" />,
  chart: <ChartLine size={14} weight="fill" />,
  arrows: <ArrowsLeftRight size={14} weight="fill" />,
}

const FILTERS = ['All', 'onchain_anomaly', 'derivatives_warning', 'smart_money', 'unlock_vesting', 'portfolio_relative', 'cross_asset'] as const

export default function AlertsPage() {
  const { openWithPrompt } = usePelicanPanelContext()
  const [filter, setFilter] = useState<string>('All')

  const filtered = useMemo(() => {
    if (filter === 'All') return MOCK_ALERTS
    return MOCK_ALERTS.filter(a => a.category === filter)
  }, [filter])

  const unreadCount = MOCK_ALERTS.filter(a => !a.read).length

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">Intelligence Alerts</h1>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#4A90C4]/15 text-[#4A90C4]">
              {unreadCount} New
            </span>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 flex-wrap mb-6 p-1 rounded-xl bg-card border">
        {FILTERS.map(f => {
          const cfg = f === 'All' ? null : ALERT_CATEGORY_CONFIG[f as AlertCategory]
          return (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                filter === f ? 'bg-[#4A90C4]/15 text-[#4A90C4]' : 'text-muted-foreground hover:text-foreground'
              }`}>
              {f === 'All' ? 'All' : cfg?.label}
            </button>
          )
        })}
      </div>

      {/* Alert Cards */}
      <div className="space-y-3">
        {filtered.map(alert => {
          const cfg = ALERT_CATEGORY_CONFIG[alert.category]
          return (
            <div key={alert.id} className={`rounded-xl border bg-card p-4 relative overflow-hidden transition-all ${
              !alert.read ? 'border-l-[3px]' : ''
            }`} style={{ borderLeftColor: !alert.read ? cfg.color : undefined }}>

              {/* Category label + severity + timestamp */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span style={{ color: cfg.color }}>{CATEGORY_ICONS[cfg.icon]}</span>
                  <span className="text-[10px] uppercase tracking-[1.5px] font-bold" style={{ color: cfg.color }}>{cfg.label}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${SEVERITY_STYLES[alert.severity]}`}>
                    {alert.severity.toUpperCase()}
                  </span>
                  {!alert.read && <Circle size={6} weight="fill" className="text-[#4A90C4]" />}
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">{alert.timestamp}</span>
              </div>

              {/* Title + Body */}
              <h3 className="text-[14px] font-semibold mb-1.5">{alert.title}</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">{alert.body}</p>

              {/* Affected assets + Ask Pelican */}
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  {alert.affected_assets.map(a => (
                    <Link key={a} href={`/token-intel?ticker=${a}`}
                      className="px-2 py-0.5 rounded-md border border-[var(--border)] text-[10px] font-mono font-medium hover:border-[#4A90C4]/40 hover:text-[#4A90C4] transition-colors">
                      {a}
                    </Link>
                  ))}
                </div>
                <button onClick={() => openWithPrompt(alert.affected_assets[0] || null, {
                    visibleMessage: `Analyze this alert: ${alert.title}`,
                    fullPrompt: `[ALERT ANALYSIS]\nAlert: ${alert.title}\nCategory: ${alert.category}\nSeverity: ${alert.severity}\nAffected Assets: ${alert.affected_assets.join(', ')}\nDetails: ${alert.body}\n\nAnalyze this alert. What should I do about my positions?`,
                  }, null)}
                  className="flex items-center gap-1 text-[11px] text-[#4A90C4] hover:underline cursor-pointer">
                  <Bird size={12} /> Ask Pelican
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
