import { NextRequest, NextResponse } from 'next/server'
import { cached } from '@/lib/redis'
import { fetchEvents } from '@/lib/api/polymarket'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const tag = req.nextUrl.searchParams.get('tag') || undefined
    const limit = Number(req.nextUrl.searchParams.get('limit')) || 10

    const data = await cached(
      `polymarket:events:${tag || 'all'}:${limit}`,
      300,
      () => fetchEvents({ tag, limit, active: true })
    )

    return NextResponse.json(data)
  } catch (error) {
    console.error('[API /polymarket/events]', error)
    return NextResponse.json([])
  }
}
