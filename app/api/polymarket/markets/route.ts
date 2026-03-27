import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const params = searchParams.toString()
  try {
    const res = await fetch(`https://gamma-api.polymarket.com/markets?${params}`, { next: { revalidate: 30 } })
    const data = await res.json()
    return NextResponse.json(data, { headers: { 'Cache-Control': 'public, s-maxage=30' } })
  } catch {
    return NextResponse.json([], { status: 502 })
  }
}
