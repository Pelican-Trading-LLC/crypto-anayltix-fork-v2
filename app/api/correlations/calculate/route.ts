import { NextResponse } from 'next/server'
import { requireAdmin, getServiceClient } from '@/lib/admin'
import { calculateCorrelations } from '@/lib/correlations/calculate'

export async function POST() {
  const auth = await requireAdmin()
  if ('error' in auth && auth.error) return auth.error

  const serviceClient = getServiceClient()

  try {
    const result = await calculateCorrelations(serviceClient)
    return NextResponse.json(result)
  } catch (error: unknown) {
    const message = process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : (error instanceof Error ? error.message : String(error))
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
