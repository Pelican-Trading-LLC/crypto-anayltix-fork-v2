'use client'

import { Bell, Eye, Lightning, TrendUp, Clock } from '@phosphor-icons/react'
import { MOCK_ALERTS, ALERT_CATEGORY_CONFIG } from '@/lib/crypto-mock-data'
import Link from 'next/link'

export function BriefAlertsSidebar() {
  const recentAlerts = MOCK_ALERTS.slice(0, 4) // Show top 4

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <Bell size={14} weight="fill" className="text-[#D4A042]" />
        <span className="text-[12px] font-semibold">Intelligence Alerts</span>
      </div>
      <div className="space-y-3">
        {recentAlerts.map(alert => {
          const cfg = ALERT_CATEGORY_CONFIG[alert.category]
          return (
            <div key={alert.id} className="rounded-lg p-3" style={{ background: `${cfg.color}08`, borderLeft: `2px solid ${cfg.color}` }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] uppercase tracking-wider font-bold" style={{ color: cfg.color }}>{cfg.label}</span>
                <span className="font-mono text-[10px] text-muted-foreground">{alert.timestamp}</span>
              </div>
              <p className="text-[12px] font-medium leading-relaxed">{alert.title}</p>
            </div>
          )
        })}
      </div>
      <Link href="/alerts" className="block text-center text-[12px] text-[#4A90C4] font-medium mt-3 hover:underline">
        View all alerts →
      </Link>
    </div>
  )
}
