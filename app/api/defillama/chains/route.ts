import { NextResponse } from 'next/server'
export async function GET() {
  try {
    const res = await fetch('https://api.llama.fi/v2/chains', { next: { revalidate: 300 } })
    if (!res.ok) return NextResponse.json([], { status: res.status })
    const data = await res.json()
    return NextResponse.json(data, { headers: { 'Cache-Control': 'public, s-maxage=300' } })
  } catch { return NextResponse.json([], { status: 500 }) }
}
