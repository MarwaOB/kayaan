import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/adminSessionToken";

// This is the real fix for "typing a URL gets in without logging in": before
// this file existed, the ONLY thing gating /admin/* pages was a client-side
// React check (AdminAuthGate) that runs after the page has already been sent
// to the browser. Data was still protected (every /api/admin/* route checks
// requireAdmin server-side), but the admin page shell itself had zero
// server-side protection. Middleware runs before any page is rendered, so an
// unauthenticated request never reaches the admin page at all now.
//
// This only checks the signature + expiry (no DB lookup — Prisma can't run
// on the Edge runtime middleware uses). A deleted-but-not-yet-expired admin
// account is still caught by the DB-backed requireAdmin() check on every
// actual API call the page makes, so no real gap there.

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const session = req.cookies.get(SESSION_COOKIE)?.value;
  const verified = session ? await verifySessionToken(session) : null;

  if (!verified) {
    const loginUrl = new URL("/admin/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};