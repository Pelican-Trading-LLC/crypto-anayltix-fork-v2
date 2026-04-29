import { redis } from '@/lib/redis'
import type { BlakeAlert, BlakeBriefing, BlakeThesis } from '../types'

const memoryLists = new Map<string, unknown[]>()
const memoryValues = new Map<string, unknown>()

function parseStored<T>(value: unknown): T {
  if (typeof value === 'string') return JSON.parse(value) as T
  return value as T
}

async function listPush(key: string, value: unknown, cap: number, ttlSeconds: number): Promise<void> {
  if (!redis) {
    const current = memoryLists.get(key) ?? []
    memoryLists.set(key, [value, ...current].slice(0, cap))
    return
  }

  await redis.lpush(key, JSON.stringify(value))
  await redis.ltrim(key, 0, cap - 1)
  await redis.expire(key, ttlSeconds)
}

async function listRange<T>(key: string, start: number, end: number): Promise<T[]> {
  if (!redis) return (memoryLists.get(key) ?? []).slice(start, end + 1).map(parseStored<T>)

  const items = await redis.lrange<unknown>(key, start, end)
  return items.map(parseStored<T>)
}

async function setValue(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
  if (!redis) {
    memoryValues.set(key, value)
    return
  }

  if (ttlSeconds) await redis.set(key, value, { ex: ttlSeconds })
  else await redis.set(key, value)
}

async function getValue<T>(key: string): Promise<T | null> {
  if (!redis) return (memoryValues.get(key) as T | undefined) ?? null

  const value = await redis.get<unknown>(key)
  if (value === null || value === undefined) return null
  return parseStored<T>(value)
}

export async function pushThesis(thesis: BlakeThesis): Promise<void> {
  await listPush(`blake-mode:theses:${thesis.ticker}:${thesis.analyst}`, thesis, 50, 60 * 60 * 24 * 30)
}

export async function getRecentTheses(ticker: string, analyst: string = 'blake', limit: number = 20): Promise<BlakeThesis[]> {
  return listRange<BlakeThesis>(`blake-mode:theses:${ticker}:${analyst}`, 0, limit - 1)
}

export async function getLatestThesis(ticker: string, analyst: string = 'blake'): Promise<BlakeThesis | null> {
  const items = await getRecentTheses(ticker, analyst, 1)
  return items[0] ?? null
}

export async function pushAlert(alert: BlakeAlert): Promise<void> {
  await listPush('blake-mode:alerts:global', alert, 200, 60 * 60 * 24 * 7)
}

export async function getRecentAlerts(opts: { limit?: number; ticker?: string; severity?: string } = {}): Promise<BlakeAlert[]> {
  let alerts = await listRange<BlakeAlert>('blake-mode:alerts:global', 0, 199)
  if (opts.ticker) alerts = alerts.filter((alert) => alert.ticker === opts.ticker)
  if (opts.severity) alerts = alerts.filter((alert) => alert.severity === opts.severity)
  return alerts.slice(0, opts.limit ?? 50)
}

export async function checkAlertDedupe(dedupeKey: string): Promise<boolean> {
  const key = `blake-mode:alert-dedupe:${dedupeKey}`
  const existing = await getValue<string>(key)
  if (existing) return true
  await setValue(key, '1', 60 * 60)
  return false
}

export async function setBriefing(briefing: BlakeBriefing): Promise<void> {
  const key = `blake-mode:briefings:${briefing.briefingDate}:${briefing.analyst}`
  await setValue(key, briefing, 60 * 60 * 24 * 90)
  await listPush('blake-mode:briefings:index', `${briefing.briefingDate}:${briefing.analyst}`, 90, 60 * 60 * 24 * 90)
}

export async function getBriefing(date: string, analyst: string = 'blake'): Promise<BlakeBriefing | null> {
  return getValue<BlakeBriefing>(`blake-mode:briefings:${date}:${analyst}`)
}

export async function getBriefingArchive(limit: number = 30): Promise<BlakeBriefing[]> {
  const indexEntries = await listRange<string>('blake-mode:briefings:index', 0, limit - 1)
  const seen = new Set<string>()
  const briefings = await Promise.all(
    indexEntries
      .filter((entry) => {
        if (seen.has(entry)) return false
        seen.add(entry)
        return true
      })
      .map(async (entry) => {
        const [date, analyst] = entry.split(':')
        if (!date) return null
        return getBriefing(date, analyst || 'blake')
      })
  )
  return briefings.filter((briefing): briefing is BlakeBriefing => briefing !== null)
}

export async function setLevelCache(ticker: string, analyst: string, levels: unknown): Promise<void> {
  await setValue(`blake-mode:levels:cache:${ticker}:${analyst}`, levels)
}

export async function getLevelCache<T>(ticker: string, analyst: string): Promise<T | null> {
  return getValue<T>(`blake-mode:levels:cache:${ticker}:${analyst}`)
}
