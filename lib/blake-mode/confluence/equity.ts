import type { BlakeChartState } from '../types'
import { fetchCandles } from '../data'

export interface EquityConfluence {
  macro: { tenYearYield: number; dxy: number; vix: number } | null
  relativeStrength: { vsSpyPercent30d: number } | null
}

async function fetchFredLatest(seriesId: string, fallback: number): Promise<number> {
  const key = process.env.FRED_API_KEY
  if (!key) return fallback

  try {
    const params = new URLSearchParams({
      series_id: seriesId,
      api_key: key,
      file_type: 'json',
      sort_order: 'desc',
      limit: '1',
    })
    const response = await fetch(`https://api.stlouisfed.org/fred/series/observations?${params}`, { next: { revalidate: 3600 } })
    if (!response.ok) return fallback
    const data = (await response.json()) as { observations?: { value?: string }[] }
    const value = Number(data.observations?.[0]?.value)
    return Number.isFinite(value) ? value : fallback
  } catch {
    return fallback
  }
}

async function fetchPolygonDailyCloses(ticker: string, days = 45): Promise<number[]> {
  const key = process.env.POLYGON_API_KEY
  if (!key) return []

  const to = new Date()
  const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000)
  const url = `https://api.polygon.io/v2/aggs/ticker/${encodeURIComponent(ticker)}/range/1/day/${from.toISOString().slice(0, 10)}/${to.toISOString().slice(0, 10)}?adjusted=true&sort=asc&limit=50000&apiKey=${key}`
  const response = await fetch(url, { next: { revalidate: 300 } })
  if (!response.ok) return []
  const data = (await response.json()) as { results?: { c: number }[] }
  return data.results?.map((bar) => bar.c) ?? []
}

function percentChange(values: number[]): number | null {
  const first = values[0]
  const last = values[values.length - 1]
  if (typeof first !== 'number' || typeof last !== 'number' || first === 0) return null
  return ((last - first) / first) * 100
}

export async function getEquityConfluence(symbol: string, state: BlakeChartState): Promise<EquityConfluence> {
  void state
  const [tenYearYield, dxy, vix, assetCloses, spyCloses] = await Promise.all([
    fetchFredLatest('DGS10', 4.52),
    fetchFredLatest('DTWEXBGS', 122.4),
    fetchFredLatest('VIXCLS', 17.8),
    symbol === 'MAGS' ? fetchCandles(symbol).then((candles) => candles.slice(-31).map((c) => c.close)).catch(() => []) : fetchPolygonDailyCloses(symbol, 45),
    fetchPolygonDailyCloses('SPY', 45),
  ])

  const assetChange = percentChange(assetCloses)
  const spyChange = percentChange(spyCloses)

  return {
    macro: { tenYearYield, dxy, vix },
    relativeStrength: assetChange !== null && spyChange !== null ? { vsSpyPercent30d: assetChange - spyChange } : null,
  }
}
