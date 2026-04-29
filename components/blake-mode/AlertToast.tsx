'use client'

import { useEffect, useRef } from 'react'
import useSWR from 'swr'
import toast from 'react-hot-toast'
import type { BlakeAlert } from '@/lib/blake-mode/types'

const fetcher = (url: string) => fetch(url).then((response) => response.json())

export function AlertToast({ ticker }: { ticker: string }) {
  const seenIds = useRef<Set<string>>(new Set())
  const { data } = useSWR<{ alerts: BlakeAlert[] }>(
    ticker ? `/api/blake-mode/alerts?ticker=${ticker}&severity=action&limit=10` : null,
    fetcher,
    { refreshInterval: 30_000 }
  )

  useEffect(() => {
    for (const alert of data?.alerts ?? []) {
      if (seenIds.current.has(alert.id)) continue
      seenIds.current.add(alert.id)
      toast(alert.headline, {
        duration: 8000,
        icon: '!',
        style: {
          background: '#111827',
          border: '1px solid rgba(239,68,68,0.45)',
          color: '#F9FAFB',
        },
      })
    }
  }, [data?.alerts])

  return null
}
