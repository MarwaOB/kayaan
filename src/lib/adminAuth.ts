import { NextRequest, NextResponse } from "next/server";
import { requireAdmin as requireAdminSession } from "@/lib/adminSession";

export { authenticateAdmin } from "@/lib/adminSession";

export function requireAdmin(req: NextRequest): Promise<NextResponse | null> {
  return requireAdminSession(req);
}
