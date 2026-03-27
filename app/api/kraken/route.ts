import { NextResponse } from 'next/server'

/**
 * Proxy for Kraken public API to avoid CORS issues.
 * Usage: /api/kraken?endpoint=Ticker&pair=XXBTZUSD,XETHZUSD
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const endpoint = searchParams.get('endpoint') || 'Ticker'
  const pair = searchParams.get('pair') || ''
  const interval = searchParams.get('interval') || ''

  // Only allow public endpoints
  const allowedEndpoints = ['Ticker', 'OHLC', 'AssetPairs', 'Depth']
  if (!allowedEndpoints.includes(endpoint)) {
    return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 })
  }

  let url = `https://api.kraken.com/0/public/${endpoint}`
  const params = new URLSearchParams()
  if (pair) params.set('pair', pair)
  if (interval) params.set('interval', interval)
  const qs = params.toString()
  if (qs) url += `?${qs}`

  try {
    const res = await fetch(url, { next: { revalidate: 10 } })
    const data = await res.json()
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30' },
    })
  } catch (err) {
    console.error('[Kraken proxy] Error:', err)
    return NextResponse.json({ error: 'Failed to fetch from Kraken' }, { status: 502 })
  }
}
