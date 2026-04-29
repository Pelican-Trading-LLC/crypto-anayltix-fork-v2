import { NextResponse } from 'next/server'
import { buildBlakeChartState } from '@/lib/blake-mode/ta/engine'
import { aggregateConfluence } from '@/lib/blake-mode/confluence/aggregator'

export const dynamic = 'force-dynamic'

export async function GET(_request: Request, { params }: { params: { ticker: string } }) {
  try {
    const ticker = params.ticker.toUpperCase()
    const state = await buildBlakeChartState(ticker)
    return NextResponse.json(await aggregateConfluence(ticker, state))
  } catch (error) {
    console.error('[Blake Mode] confluence route error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to fetch confluence' },
      { status: 500 }
    )
  }
}

