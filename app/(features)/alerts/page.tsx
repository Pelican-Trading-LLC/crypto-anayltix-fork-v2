'use client'

import { useState } from 'react'
import type { MouseEvent } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import toast from 'react-hot-toast'
import { Check, CircleAlert, Filter } from 'lucide-react'
import { TICKER_CONFIGS } from '@/lib/blake-mode/config'
import { acknowledgeAlert, getAcknowledgedAlertIds } from '@/lib/blake-mode/store/local-store'
import type { BlakeAlert } from '@/lib/blake-mode/types'

const fetcher = (url: string) => fetch(url).then((response) => response.json())
const SEVERITIES = ['all', 'action', 'watch', 'info'] as const

const severityStyles: Record<BlakeAlert['severity'], string> = {
  action: 'border-red-400/30 bg-red-500/12 text-red-100',
  watch: 'border-yellow-400/30 bg-yellow-500/12 text-yellow-100',
  info: 'border-blue-400/30 bg-blue-500/12 text-blue-100',
}

export default function AlertsPage() {
  const router = useRouter()
  const [severity, setSeverity] = useState<(typeof SEVERITIES)[number]>('all')
  const [ticker, setTicker] = useState('all')
  const [, setAckVersion] = useState(0)
  const query = new URLSearchParams()
  if (severity !== 'all') query.set('severity', severity)
  if (ticker !== 'all') query.set('ticker', ticker)
  query.set('limit', '50')

  const { data, isLoading } = useSWR<{ alerts: BlakeAlert[] }>(`/api/blake-mode/alerts?${query.toString()}`, fetcher, {
    refreshInterval: 30_000,
  })

  const acknowledged = getAcknowledgedAlertIds()
  const alerts = data?.alerts ?? []

  const handleAcknowledge = (event: MouseEvent, alertId: string) => {
    event.stopPropagation()
    acknowledgeAlert(alertId)
    setAckVersion((value) => value + 1)
    toast.success('Acknowledged')
  }

  return (
    <main className="min-h-screen bg-[#0B1220] px-7 py-6 text-white">
      <div className="mb-6 flex items-start justify-between gap-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#2DD4D4]">Blake Mode</p>
          <h1 className="mt-2 text-2xl font-semibold">Live Alerts</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/58">
            Rule-based alerts fired from Blake&apos;s manual levels, thesis changes, and setup confluence.
          </p>
        </div>
        <div className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-right">
          <p className="font-mono text-2xl font-semibold">{alerts.filter((alert) => !acknowledged.has(alert.id)).length}</p>
          <p className="text-[10px] uppercase tracking-wide text-white/45">unacknowledged</p>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3 rounded-md border border-white/10 bg-white/[0.035] p-3">
        <div className="flex items-center gap-2 pr-2 text-xs uppercase tracking-wide text-white/46">
          <Filter className="h-3.5 w-3.5" />
          Filters
        </div>
        {SEVERITIES.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setSeverity(item)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold capitalize transition ${
              severity === item ? 'border-[#2DD4D4] bg-[#2DD4D4]/15 text-[#BFFBFB]' : 'border-white/10 bg-white/[0.03] text-white/58 hover:text-white'
            }`}
          >
            {item === 'all' ? 'All' : item}
          </button>
        ))}
        <select
          value={ticker}
          onChange={(event) => setTicker(event.target.value)}
          className="ml-auto rounded-md border border-white/10 bg-[#101827] px-3 py-2 text-sm text-white outline-none"
        >
          <option value="all">All tickers</option>
          {Object.keys(TICKER_CONFIGS).map((symbol) => (
            <option key={symbol} value={symbol}>
              {symbol}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {isLoading &&
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-md border border-white/10 bg-white/[0.04]" />
          ))}

        {!isLoading && alerts.length === 0 && (
          <div className="rounded-md border border-white/10 bg-white/[0.035] p-8 text-center">
            <CircleAlert className="mx-auto h-8 w-8 text-white/30" />
            <h2 className="mt-3 text-lg font-semibold">No alerts triggered yet.</h2>
            <p className="mt-2 text-sm text-white/54">Drop a manual level near a key price to start.</p>
          </div>
        )}

        {alerts.map((alert) => {
          const isAcknowledged = acknowledged.has(alert.id)
          return (
            <button
              key={alert.id}
              type="button"
              onClick={() => router.push(`/blake-mode?ticker=${alert.ticker}`)}
              className={`block w-full rounded-md border p-4 text-left transition hover:border-[#2DD4D4]/40 hover:bg-white/[0.055] ${
                isAcknowledged ? 'border-white/8 bg-white/[0.025] opacity-70' : 'border-white/10 bg-white/[0.04]'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${severityStyles[alert.severity]}`}>
                      {alert.severity}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-white/60">
                      {alert.alertType.replaceAll('_', ' ')}
                    </span>
                    <span className="font-mono text-sm font-bold text-white">{alert.ticker}</span>
                  </div>
                  <h2 className="mt-3 text-lg font-semibold text-white">{alert.headline}</h2>
                  <p className="mt-2 text-sm leading-6 text-white/64">{alert.body}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-3">
                  <span className="font-mono text-xs text-white/42">
                    {formatDistanceToNow(new Date(alert.firedAt), { addSuffix: true })}
                  </span>
                  {!isAcknowledged ? (
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(event) => handleAcknowledge(event, alert.id)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          acknowledgeAlert(alert.id)
                          setAckVersion((value) => value + 1)
                          toast.success('Acknowledged')
                        }
                      }}
                      className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 hover:border-[#2DD4D4]/40 hover:text-white"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Acknowledge
                    </span>
                  ) : (
                    <span className="rounded-md border border-white/8 px-3 py-1.5 text-xs text-white/35">Acknowledged</span>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </main>
  )
}
