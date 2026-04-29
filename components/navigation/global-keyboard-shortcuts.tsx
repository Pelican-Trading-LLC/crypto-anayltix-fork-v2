'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const ROUTES: Record<string, string> = {
  w: '/watchlist',
  b: '/briefings',
  a: '/alerts',
  t: '/track-record',
  h: '/dashboard',
}

export function GlobalKeyboardShortcuts() {
  const router = useRouter()
  const awaitingRouteKey = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const reset = () => {
      awaitingRouteKey.current = false
      if (timer.current) clearTimeout(timer.current)
      timer.current = null
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const tagName = target?.tagName?.toLowerCase()
      if (tagName === 'input' || tagName === 'textarea' || target?.isContentEditable) return

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        window.dispatchEvent(new CustomEvent('token-analytix:open-command-palette'))
        return
      }

      const key = event.key.toLowerCase()
      if (!awaitingRouteKey.current && key === 'g') {
        awaitingRouteKey.current = true
        timer.current = setTimeout(reset, 1200)
        return
      }

      if (awaitingRouteKey.current) {
        const route = ROUTES[key]
        reset()
        if (route) {
          event.preventDefault()
          router.push(route)
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      reset()
    }
  }, [router])

  return null
}
