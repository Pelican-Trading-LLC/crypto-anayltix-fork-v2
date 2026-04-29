import type { BlakeLevel, VoiceSample } from '../types'

const NAMESPACE = 'token-analytix:blake-mode'

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function syncLevelsToRedis(ticker: string, levels: BlakeLevel[], analyst: string): void {
  fetch('/api/blake-mode/levels/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ticker, analyst, levels }),
  }).catch(() => undefined)
}

export function getLocalLevels(ticker: string, analyst: string = 'blake'): BlakeLevel[] {
  if (typeof window === 'undefined') return []
  return safeParse<BlakeLevel[]>(localStorage.getItem(`${NAMESPACE}:levels:${ticker}:${analyst}`), [])
}

export function saveLocalLevels(ticker: string, levels: BlakeLevel[], analyst: string = 'blake'): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(`${NAMESPACE}:levels:${ticker}:${analyst}`, JSON.stringify(levels))
  syncLevelsToRedis(ticker, levels, analyst)
  window.dispatchEvent(new CustomEvent('blake-mode:levels-changed', { detail: { ticker, analyst } }))
}

export function getAllLocalLevels(analyst: string = 'blake'): Record<string, BlakeLevel[]> {
  if (typeof window === 'undefined') return {}
  const result: Record<string, BlakeLevel[]> = {}
  const prefix = `${NAMESPACE}:levels:`

  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index)
    if (!key?.startsWith(prefix) || !key.endsWith(`:${analyst}`)) continue
    const ticker = key.slice(prefix.length).split(':')[0]
    if (ticker) result[ticker] = safeParse<BlakeLevel[]>(localStorage.getItem(key), [])
  }

  return result
}

export function getLocalVoiceSamples(): VoiceSample[] | null {
  if (typeof window === 'undefined') return null
  return safeParse<VoiceSample[] | null>(localStorage.getItem(`${NAMESPACE}:voice-samples`), null)
}

export function saveLocalVoiceSamples(samples: VoiceSample[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(`${NAMESPACE}:voice-samples`, JSON.stringify(samples))
}

export function getAcknowledgedAlertIds(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  return new Set(safeParse<string[]>(localStorage.getItem(`${NAMESPACE}:ack-alerts`), []))
}

export function acknowledgeAlert(alertId: string): void {
  if (typeof window === 'undefined') return
  const ids = Array.from(getAcknowledgedAlertIds()).filter((id) => id !== alertId)
  ids.push(alertId)
  localStorage.setItem(`${NAMESPACE}:ack-alerts`, JSON.stringify(ids.slice(-500)))
}
