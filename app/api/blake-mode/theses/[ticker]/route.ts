import { NextResponse } from 'next/server'
import { getRecentTheses } from '@/lib/blake-mode/store/redis-store'

export const dynamic = 'force-dynamic'

export async function GET(_req: Request, { params }: { params: { ticker: string } }) {
  const theses = await getRecentTheses(params.ticker.toUpperCase(), 'blake', 20)
  return NextResponse.json({ theses })
}
