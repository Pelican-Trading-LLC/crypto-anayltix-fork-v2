import { TICKER_CONFIGS } from './config'
import { TRACK_RECORD_SEED } from './seeds/track-record-seed'
import type { BlakeTrackRecordEntry } from './types'

export interface TrackRecordStats {
  totalCalls: number
  hitCount: number
  invalidatedCount: number
  openCount: number
  hitRatePercent: number
  averageRMultiple: number
  bestTrade: BlakeTrackRecordEntry | null
  worstTrade: BlakeTrackRecordEntry | null
  byAssetClass: Record<string, { count: number; hitRate: number }>
}

export function computeTrackRecordStats(filters?: { since?: Date; assetClass?: string }): TrackRecordStats {
  const calls = filterBase(filters)
  const closedCalls = calls.filter((call) => call.currentStatus === 'hit_target' || call.currentStatus === 'invalidated')
  const hitCount = calls.filter((call) => call.currentStatus === 'hit_target').length
  const invalidatedCount = calls.filter((call) => call.currentStatus === 'invalidated').length
  const openCount = calls.filter((call) => call.currentStatus === 'open').length
  const rMultiples = calls.filter((call) => call.rMultiple !== null).map((call) => call.rMultiple!)
  const averageRMultiple = rMultiples.length === 0 ? 0 : rMultiples.reduce((sum, value) => sum + value, 0) / rMultiples.length
  const sortedByR = [...calls].filter((call) => call.rMultiple !== null).sort((a, b) => (b.rMultiple ?? 0) - (a.rMultiple ?? 0))

  const byAssetClass: Record<string, { count: number; hitRate: number }> = {}
  for (const assetClass of ['crypto', 'equity', 'forex']) {
    const assetCalls = calls.filter((call) => TICKER_CONFIGS[call.ticker]?.assetClass === assetClass)
    const closed = assetCalls.filter((call) => call.currentStatus === 'hit_target' || call.currentStatus === 'invalidated')
    const hits = assetCalls.filter((call) => call.currentStatus === 'hit_target').length
    byAssetClass[assetClass] = {
      count: assetCalls.length,
      hitRate: closed.length === 0 ? 0 : (hits / closed.length) * 100,
    }
  }

  return {
    totalCalls: calls.length,
    hitCount,
    invalidatedCount,
    openCount,
    hitRatePercent: closedCalls.length === 0 ? 0 : (hitCount / closedCalls.length) * 100,
    averageRMultiple,
    bestTrade: sortedByR[0] ?? null,
    worstTrade: sortedByR[sortedByR.length - 1] ?? null,
    byAssetClass,
  }
}

export function filterTrackRecord(filters?: { since?: Date; assetClass?: string; status?: string }): BlakeTrackRecordEntry[] {
  let calls = filterBase(filters)
  if (filters?.status) calls = calls.filter((call) => call.currentStatus === filters.status)
  return calls.sort((a, b) => new Date(b.callDate).getTime() - new Date(a.callDate).getTime())
}

function filterBase(filters?: { since?: Date; assetClass?: string }): BlakeTrackRecordEntry[] {
  let calls = [...TRACK_RECORD_SEED]
  if (filters?.since) calls = calls.filter((call) => new Date(call.callDate) >= filters.since!)
  if (filters?.assetClass) calls = calls.filter((call) => TICKER_CONFIGS[call.ticker]?.assetClass === filters.assetClass)
  return calls
}
