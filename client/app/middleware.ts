import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Publicly accessible routes
const PUBLIC_ROUTES = ["/", "/privacy-policy", "/about", "/login"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes always allowed
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next()
  }

  // Get token from cookies (either access_token or acccessToken)
  const token =
    request.cookies.get("acccessToken")?.value ||
    request.cookies.get("access_token")?.value

  // If token not present, redirect to /login
  if (!token) {
    const loginUrl = new URL("/login", request.url)
    return NextResponse.redirect(loginUrl)
  }

  // If token present, allow access
  return NextResponse.next()
}

// Only apply middleware to routes except public pages, static, and API
export const config = {
  matcher: [
    "/((?!_next|api|privacy-policy|about|login|$).*)",
  ],
}