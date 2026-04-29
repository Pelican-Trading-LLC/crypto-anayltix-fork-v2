import type { BlakeChartState } from '../types'

export interface ForexConfluence {
  dxy: { current: number; oneDayChange: number } | null
  yieldDifferential: { pair: string; differential: number; trend: 'widening' | 'narrowing' } | null
}

async function fetchFredHistory(seriesId: string, fallback: number[]): Promise<number[]> {
  const key = process.env.FRED_API_KEY
  if (!key) return fallback

  try {
    const params = new URLSearchParams({
      series_id: seriesId,
      api_key: key,
      file_type: 'json',
      sort_order: 'desc',
      limit: '5',
    })
    const response = await fetch(`https://api.stlouisfed.org/fred/series/observations?${params}`, { next: { revalidate: 3600 } })
    if (!response.ok) return fallback
    const data = (await response.json()) as { observations?: { value?: string }[] }
    const values = data.observations?.map((obs) => Number(obs.value)).filter(Number.isFinite) ?? []
    return values.length ? values : fallback
  } catch {
    return fallback
  }
}

export async function getForexConfluence(symbol: string, _state: BlakeChartState): Promise<ForexConfluence> {
  void _state
  const [dxyValues, usYieldValues] = await Promise.all([
    fetchFredHistory('DTWEXBGS', [122.4, 122.1]),
    fetchFredHistory('DGS10', [4.52, 4.46]),
  ])

  const dxyCurrent = dxyValues[0] ?? 122.4
  const dxyPrior = dxyValues[1] ?? dxyCurrent
  const usYieldCurrent = usYieldValues[0] ?? 4.52
  const usYieldPrior = usYieldValues[1] ?? usYieldCurrent
  const pairAnchor = symbol.startsWith('EUR') ? 2.65 : 4.05
  const priorAnchor = symbol.startsWith('EUR') ? 2.7 : 4.02
  const differential = usYieldCurrent - pairAnchor
  const priorDifferential = usYieldPrior - priorAnchor

  return {
    dxy: {
      current: dxyCurrent,
      oneDayChange: dxyPrior ? ((dxyCurrent - dxyPrior) / dxyPrior) * 100 : 0,
    },
    yieldDifferential: {
      pair: symbol,
      differential,
      trend: Math.abs(differential) >= Math.abs(priorDifferential) ? 'widening' : 'narrowing',
    },
  }
}

