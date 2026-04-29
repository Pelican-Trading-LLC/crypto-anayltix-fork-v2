import { getRecentGenerations } from '@/lib/blake-mode/store/redis-store'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const limit = Number(url.searchParams.get('limit') ?? 20)
  const generations = await getRecentGenerations(limit)
  return Response.json({ generations })
}
