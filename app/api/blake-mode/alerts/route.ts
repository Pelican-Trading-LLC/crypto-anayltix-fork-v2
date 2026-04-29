import { getRecentAlerts } from '@/lib/blake-mode/store/redis-store'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const ticker = url.searchParams.get('ticker') ?? undefined
  const severity = url.searchParams.get('severity') ?? undefined
  const limit = Number(url.searchParams.get('limit') ?? 50)
  const alerts = await getRecentAlerts({ ticker, severity, limit })
  return Response.json({ alerts })
}
