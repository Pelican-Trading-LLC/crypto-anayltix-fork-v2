import { NextRequest, NextResponse } from 'next/server'
import { fetchCandles } from '@/lib/blake-mode/data'
import { buildBlakeChartState } from '@/lib/blake-mode/ta/engine'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { ticker: string } }
) {
  try {
    const ticker = params.ticker.toUpperCase()
    if (request.nextUrl.searchParams.get('state') === '1') {
      return NextResponse.json(await buildBlakeChartState(ticker))
    }

    return NextResponse.json(await fetchCandles(ticker))
  } catch (error) {
    console.error('[Blake Mode] data route error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to fetch Blake Mode data' },
      { status: 500 }
    )
  }
}
