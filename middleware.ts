import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. High-throughput public endpoints: bypass auth lookup completely
  // Saves 100-300ms network roundtrips on webhook ingestion and public forms
  const isBypassRoute =
    pathname.startsWith("/api/webhooks") ||
    pathname.startsWith("/f/");

  if (isBypassRoute) {
    return NextResponse.next();
  }

  // 2. Define auth & public routes
  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/forgot-password");

  const isMarketingRoute =
    pathname === "/" ||
    pathname.startsWith("/pricing") ||
    pathname.startsWith("/features") ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/privacy") ||
    pathname.startsWith("/terms");

  const isPublicRoute =
    isAuthRoute ||
    isMarketingRoute ||
    pathname.startsWith("/api/auth");

  // 3. Single session update and auth resolution (eliminates duplicate getUser calls)
  const { response, user } = await updateSession(request);

  // Not logged in and trying to access protected route -> Redirect to login
  if (!isPublicRoute && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Logged in and trying to access auth routes -> Redirect to dashboard
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
