import { NextRequest, NextResponse } from 'next/server'
import { cached } from '@/lib/redis'
import { fetchEvents } from '@/lib/api/polymarket'

export const dynamic = 'force-dynamic'

const TAG_PATTERN = /^[a-z0-9-]{1,32}$/i

function clampLimit(value: string | null) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return 10
  return Math.min(Math.max(Math.trunc(parsed), 1), 100)
}

export async function GET(req: NextRequest) {
  try {
    const rawTag = req.nextUrl.searchParams.get('tag')
    if (rawTag && !TAG_PATTERN.test(rawTag)) {
      return NextResponse.json({ error: 'Invalid tag' }, { status: 400 })
    }

    const tag = rawTag || undefined
    const limit = clampLimit(req.nextUrl.searchParams.get('limit'))

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
