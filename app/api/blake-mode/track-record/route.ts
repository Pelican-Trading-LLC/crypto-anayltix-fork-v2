import { computeTrackRecordStats, filterTrackRecord } from '@/lib/blake-mode/track-record-stats'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const since = url.searchParams.get('since')
  const assetClass = url.searchParams.get('assetClass') ?? undefined
  const status = url.searchParams.get('status') ?? undefined
  const sinceDate = since ? new Date(since) : undefined
  const stats = computeTrackRecordStats({ since: sinceDate, assetClass })
  const calls = filterTrackRecord({ since: sinceDate, assetClass, status })
  return Response.json({ stats, calls })
}
