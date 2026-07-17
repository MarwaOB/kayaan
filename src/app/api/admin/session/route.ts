import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin, clearAdminSessionResponse } from "@/lib/adminSession";

export async function GET(req: NextRequest) {
  const user = await authenticateAdmin(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ email: user.email });
}

export async function DELETE() {
  return clearAdminSessionResponse();
}
