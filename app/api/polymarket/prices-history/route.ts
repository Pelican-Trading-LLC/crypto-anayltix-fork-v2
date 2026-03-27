import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const params = searchParams.toString()
  try {
    const res = await fetch(`https://gamma-api.polymarket.com/prices-history?${params}`, { next: { revalidate: 300 } })
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ history: [] }, { status: 502 })
  }
}
