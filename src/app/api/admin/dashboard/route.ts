import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { getAdminDashboardStats } from "@/lib/queries/adminDashboard";

export async function GET(req: NextRequest) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const stats = await getAdminDashboardStats();
  return NextResponse.json(stats);
}
