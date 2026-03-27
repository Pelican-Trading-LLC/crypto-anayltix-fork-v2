import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Auth disabled — pass everything through
export const updateSession = async (request: NextRequest) => {
  return NextResponse.next({ request: { headers: request.headers } })
}
