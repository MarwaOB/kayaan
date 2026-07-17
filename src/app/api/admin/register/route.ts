import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { requireAdmin } from "@/lib/adminAuth";
import { createAdminSessionResponse } from "@/lib/adminSession";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = body?.email?.trim().toLowerCase();
  const password = body?.password;
  const confirmPassword = body?.confirmPassword;

  if (!email || !password || !confirmPassword) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
  }

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "This admin email already exists." }, { status: 409 });
  }

  const adminCount = await prisma.adminUser.count();
  if (adminCount > 0) {
    const unauthorized = await requireAdmin(req);
    if (unauthorized) return unauthorized;
  }

  const user = await prisma.adminUser.create({
    data: {
      email,
      passwordHash: hashPassword(password),
    },
  });

  return createAdminSessionResponse(user.id);
}
