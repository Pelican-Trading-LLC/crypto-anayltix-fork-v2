import { NextResponse } from 'next/server'
import { cached } from '@/lib/redis'
import { fetchRWAAssets, getRWASummary } from '@/lib/api/rwa'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const assets = await cached(
      'rwa:assets',
      3600,
      () => fetchRWAAssets()
    )

    return NextResponse.json({ assets, summary: getRWASummary() })
  } catch (error) {
    console.error('[API /rwa]', error)
    return NextResponse.json(
      { error: 'Failed to fetch RWA data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
