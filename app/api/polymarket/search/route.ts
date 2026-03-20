import { NextRequest, NextResponse } from 'next/server'
import { cached } from '@/lib/redis'
import { searchEvents } from '@/lib/api/polymarket'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams.get('q') || ''

    if (!query) {
      return NextResponse.json([])
    }

    const data = await cached(
      `polymarket:search:${query}`,
      300,
      () => searchEvents(query)
    )

    return NextResponse.json(data)
  } catch (error) {
    console.error('[API /polymarket/search]', error)
    return NextResponse.json([])
  }
}
