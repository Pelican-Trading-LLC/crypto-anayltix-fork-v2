import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const polygonConfigured = Boolean(process.env.POLYGON_API_KEY)
  const status: "ok" | "degraded" = polygonConfigured ? "ok" : "degraded"

  return NextResponse.json(
    {
      status,
      dataMode: polygonConfigured ? "live" : "demo",
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: { "Cache-Control": "no-cache" },
    }
  )
}
