import { clearAdminSessionResponse } from "@/lib/adminSession";

export async function POST() {
  return clearAdminSessionResponse();
}
