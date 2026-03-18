import { NextResponse } from 'next/server'
import { searchCoins } from '@/lib/api/coingecko'
import { cached } from '@/lib/redis'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')
    if (!q || q.length < 2) {
      return NextResponse.json({ data: [] })
    }

    const data = await cached(`cg:search:${q.toLowerCase()}`, 3600, async () => {
      const result = await searchCoins(q)
      return result.coins.slice(0, 10).map((c: { id: string; name: string; symbol: string; market_cap_rank: number; thumb: string }) => ({
        id: c.id,
        symbol: c.symbol,
        name: c.name,
        rank: c.market_cap_rank,
        thumb: c.thumb,
      }))
    })

    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ data: [] })
  }
}
