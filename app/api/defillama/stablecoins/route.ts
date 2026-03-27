import { NextResponse } from 'next/server'
export async function GET() {
  try {
    const res = await fetch('https://stablecoins.llama.fi/stablecoins?includePrices=true', { next: { revalidate: 600 } })
    if (!res.ok) return NextResponse.json({ peggedAssets: [] }, { status: res.status })
    const data = await res.json()
    return NextResponse.json(data, { headers: { 'Cache-Control': 'public, s-maxage=600' } })
  } catch { return NextResponse.json({ peggedAssets: [] }, { status: 500 }) }
}
