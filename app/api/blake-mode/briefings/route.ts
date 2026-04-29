import { NextResponse } from 'next/server'
import { generateDailyBriefing } from '@/lib/blake-mode/briefing-engine'
import { getBriefing, getBriefingArchive } from '@/lib/blake-mode/store/redis-store'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const date = url.searchParams.get('date')
  if (date) return NextResponse.json({ briefing: await getBriefing(date) })

  const today = new Date().toISOString().slice(0, 10)
  const todayBriefing = await getBriefing(today)
  const archive = await getBriefingArchive(30)
  return NextResponse.json({ today: todayBriefing, archive })
}

export async function POST() {
  return NextResponse.json(await generateDailyBriefing())
}
