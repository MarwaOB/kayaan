import { NextRequest } from "next/server";
import { loginAdmin, createAdminSessionResponse } from "@/lib/adminSession";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = body?.email?.trim();
  const password = body?.password;

  if (!email || !password) {
    return new Response(JSON.stringify({ error: "Email and password are required." }), { status: 400 });
  }

  const user = await loginAdmin(email, password);
  if (!user) {
    return new Response(JSON.stringify({ error: "Invalid email or password." }), { status: 401 });
  }

  return createAdminSessionResponse(user.id);
}
