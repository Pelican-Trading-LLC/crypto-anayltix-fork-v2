import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

const PROTECTED_PATHS = [
  "/admin",
  "/chat",
  "/dashboard",
  "/signals",
  "/alerts",
  "/screener",
  "/calendar",
  "/smart-money",
  "/forexanalytix",
  "/knowledge-base",
  "/wallet-dna",
  "/positions",
  "/token-intel",
  "/sector-rotation",
  "/defi",
  "/heatmap",
  "/journal",
  "/earnings",
  "/predictions",
]

function isProtectedPath(pathname: string) {
  return PROTECTED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))
}

export async function middleware(request: NextRequest) {
  // Local dev: skip marketing landing and open the app shell on /dashboard.
  if (process.env.NODE_ENV === "development" && request.nextUrl.pathname === "/") {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  // Local demo mode: keep the platform browsable without requiring Supabase auth.
  // Blake Mode is a partner demo surface, so localhost should open directly.
  if (process.env.NODE_ENV === "development" && isProtectedPath(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  if (isProtectedPath(request.nextUrl.pathname)) {
    return updateSession(request)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
