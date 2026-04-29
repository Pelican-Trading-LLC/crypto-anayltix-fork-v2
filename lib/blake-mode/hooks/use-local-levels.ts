'use client'

import { useCallback, useEffect, useState } from 'react'
import type { BlakeLevel } from '../types'
import { getLocalLevels, saveLocalLevels } from '../store/local-store'

export function useLocalLevels(ticker: string, analyst: string = 'blake') {
  const [levels, setLevels] = useState<BlakeLevel[]>([])

  useEffect(() => {
    const refresh = () => setLevels(getLocalLevels(ticker, analyst))
    const handler = (event: Event) => {
      const detail = (event as CustomEvent).detail
      if (detail?.ticker === ticker && detail?.analyst === analyst) refresh()
    }

    refresh()
    window.addEventListener('blake-mode:levels-changed', handler)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener('blake-mode:levels-changed', handler)
      window.removeEventListener('storage', refresh)
    }
  }, [ticker, analyst])

  const createLevel = useCallback(
    (input: Omit<BlakeLevel, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString()
      const newLevel: BlakeLevel = { ...input, id: crypto.randomUUID(), createdAt: now, updatedAt: now }
      const updated = [...levels, newLevel]
      saveLocalLevels(ticker, updated, analyst)
      setLevels(updated)
      return newLevel
    },
    [levels, ticker, analyst]
  )

  const updateLevel = useCallback(
    (id: string, patch: Partial<BlakeLevel>) => {
      const updated = levels.map((level) => (level.id === id ? { ...level, ...patch, updatedAt: new Date().toISOString() } : level))
      saveLocalLevels(ticker, updated, analyst)
      setLevels(updated)
    },
    [levels, ticker, analyst]
  )

  const deleteLevel = useCallback(
    (id: string) => {
      const updated = levels.filter((level) => level.id !== id)
      saveLocalLevels(ticker, updated, analyst)
      setLevels(updated)
    },
    [levels, ticker, analyst]
  )

  return { levels, createLevel, updateLevel, deleteLevel }
}
