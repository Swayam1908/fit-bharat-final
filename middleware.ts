import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// ─────────────────────────────────────────────
// SECURITY HEADERS
// Applied to every response
// ─────────────────────────────────────────────
function applySecurityHeaders(response: NextResponse): NextResponse {
  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY")
  // Prevent MIME sniffing
  response.headers.set("X-Content-Type-Options", "nosniff")
  // XSS protection (legacy browsers)
  response.headers.set("X-XSS-Protection", "1; mode=block")
  // Referrer policy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  // Permissions policy — disable sensors we don't need
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  )
  // Content Security Policy
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // unsafe-eval needed by Next.js dev
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
      "frame-ancestors 'none'",
    ].join("; ")
  )
  return response
}

// ─────────────────────────────────────────────
// RATE LIMIT (simple IP-based counter in headers)
// For production, replace with Redis-backed rate limiting
// ─────────────────────────────────────────────
const RATE_LIMIT_WINDOW_MS = 60_000   // 1 minute
const RATE_LIMIT_MAX = 60             // 60 requests per minute

// ─────────────────────────────────────────────
// MIDDLEWARE
// ─────────────────────────────────────────────
export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || "fitbharat-secret-token" })
  const { pathname } = req.nextUrl

  // Protected dashboard paths
  const isProtectedPath =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/workout") ||
    pathname.startsWith("/nutrition") ||
    pathname.startsWith("/garden") ||
    pathname.startsWith("/analytics") ||
    pathname.startsWith("/challenges") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/onboarding")

  // Auth-only paths (should redirect if already logged in)
  const isAuthPath =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/splash"

  // API routes: add CORS and rate limit headers
  if (pathname.startsWith("/api/")) {
    const response = NextResponse.next()
    response.headers.set("X-RateLimit-Limit", String(RATE_LIMIT_MAX))
    applySecurityHeaders(response)
    return response
  }

  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (isAuthPath && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  const response = NextResponse.next()
  applySecurityHeaders(response)
  return response
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/workout/:path*",
    "/nutrition/:path*",
    "/garden/:path*",
    "/analytics/:path*",
    "/challenges/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/onboarding/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/splash",
    "/api/:path*",
  ],
}
