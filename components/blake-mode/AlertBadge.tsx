'use client'

import { useState } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import type { BlakeAlert } from '@/lib/blake-mode/types'
import { getAcknowledgedAlertIds } from '@/lib/blake-mode/store/local-store'

const fetcher = (url: string) => fetch(url).then((response) => response.json())

export function AlertBadge() {
  const [, setAckVersion] = useState(0)
  const { data } = useSWR<{ alerts: BlakeAlert[] }>('/api/blake-mode/alerts?severity=action&limit=50', fetcher, {
    refreshInterval: 30_000,
    onSuccess: () => setAckVersion((value) => value + 1),
  })

  const acknowledged = getAcknowledgedAlertIds()
  const count = (data?.alerts ?? []).filter((alert) => !acknowledged.has(alert.id)).length

  return (
    <Link
      href="/alerts"
      className="inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-100"
    >
      Live Alerts
      <span className="rounded-full bg-red-500 px-1.5 py-0.5 font-mono text-[10px] text-white">{count}</span>
    </Link>
  )
}
