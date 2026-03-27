'use client'

import { useRef, useState, useEffect } from 'react'
import type { PolymarketMarket } from '@/lib/polymarket'

export interface ProbabilityShift {
  market: PolymarketMarket
  previousProb: number
  currentProb: number
  delta: number
  absDelta: number
  direction: 'up' | 'down'
  timeDetected: number
}

export function useProbabilityShifts(markets: PolymarketMarket[]) {
  const previousSnapshot = useRef<Map<string, number>>(new Map())
  const [shifts, setShifts] = useState<ProbabilityShift[]>([])

  useEffect(() => {
    if (markets.length === 0) return
    const currentMap = new Map<string, number>()
    const newShifts: ProbabilityShift[] = []

    for (const market of markets) {
      const prices = market._parsedPrices || []
      const currentProb = prices[0] ? prices[0] * 100 : 50
      const id = market.conditionId || market.id
      currentMap.set(id, currentProb)
      const previousProb = previousSnapshot.current.get(id)
      if (previousProb !== undefined) {
        const delta = currentProb - previousProb
        const absDelta = Math.abs(delta)
        if (absDelta >= 2) {
          newShifts.push({ market, previousProb, currentProb, delta, absDelta, direction: delta > 0 ? 'up' : 'down', timeDetected: Date.now() })
        }
      }
    }

    setShifts(prev => {
      const cutoff = Date.now() - 30 * 60 * 1000
      const combined = [...newShifts, ...prev.filter(s => s.timeDetected > cutoff)]
      const deduped = new Map<string, ProbabilityShift>()
      for (const s of combined) {
        const id = s.market.conditionId || s.market.id
        if (!deduped.has(id) || s.timeDetected > (deduped.get(id)?.timeDetected ?? 0)) deduped.set(id, s)
      }
      return Array.from(deduped.values()).sort((a, b) => b.absDelta - a.absDelta)
    })

    previousSnapshot.current = currentMap
  }, [markets])

  return shifts
}
