import { NextRequest, NextResponse } from 'next/server'
import { setLevelCache } from '@/lib/blake-mode/store/redis-store'
import { getServerLevels } from '@/lib/blake-mode/store/server-levels'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { ticker?: string; analyst?: string; levels?: unknown }
  const ticker = body.ticker?.toUpperCase()
  const analyst = body.analyst ?? 'blake'
  const levels = Array.isArray(body.levels) ? body.levels : []

  if (!ticker) return NextResponse.json({ error: 'ticker required' }, { status: 400 })

  await setLevelCache(ticker, analyst, levels)
  return NextResponse.json({ ok: true, levels })
}

export async function GET(req: NextRequest) {
  const ticker = req.nextUrl.searchParams.get('ticker')?.toUpperCase()
  const analyst = req.nextUrl.searchParams.get('analyst') ?? 'blake'

  if (!ticker) return NextResponse.json({ levels: [] })

  const levels = await getServerLevels(ticker, analyst)
  return NextResponse.json({ levels })
}
