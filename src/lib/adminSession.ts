import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { SESSION_COOKIE, SESSION_MAX_AGE, buildSessionToken, verifySessionToken } from "@/lib/adminSessionToken";

export async function authenticateAdmin(req: NextRequest) {
  const session = req.cookies.get(SESSION_COOKIE)?.value;
  if (!session) return null;
  const verified = await verifySessionToken(session);
  if (!verified) return null;
  const user = await prisma.adminUser.findUnique({ where: { id: verified.userId } });
  return user ?? null;
}

export async function requireAdmin(req: NextRequest) {
  const user = await authenticateAdmin(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function loginAdmin(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.adminUser.findUnique({ where: { email: normalizedEmail } });
  if (!user) return null;
  const valid = verifyPassword(password, user.passwordHash);
  if (!valid) return null;
  return user;
}

export async function createAdminSessionResponse(userId: string) {
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: SESSION_COOKIE,
    value: await buildSessionToken(userId),
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}

export function clearAdminSessionResponse() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: SESSION_COOKIE,
    value: "",
    path: "/",
    maxAge: 0,
  });
  return res;
}