import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const params = searchParams.toString()
  try {
    // Price history lives on clob.polymarket.com, NOT gamma-api
    const res = await fetch(`https://clob.polymarket.com/prices-history?${params}`, {
      next: { revalidate: 300 },
    })
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ history: [] }, { status: 502 })
  }
}
