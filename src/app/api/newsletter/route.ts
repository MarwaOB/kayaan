import { NextRequest, NextResponse } from "next/server";
import { subscribeFromStorefront, NewsletterValidationError } from "@/lib/queries/publicNewsletter";
import { isRateLimited, getClientIp } from "@/lib/rateLimit";

const MAX_SIGNUPS_PER_WINDOW = 5;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

// POST /api/newsletter   body: { contact: string, website?: string (honeypot) }
export async function POST(req: NextRequest) {
  const body = await req.json();

  // Honeypot: hidden field the real form never fills in. Pretend success
  // rather than reveal the check to a bot.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const ip = getClientIp(req);
  if (isRateLimited(`newsletter:${ip}`, MAX_SIGNUPS_PER_WINDOW, WINDOW_MS)) {
    return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
  }

  try {
    await subscribeFromStorefront(body.contact);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    if (err instanceof NewsletterValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    throw err;
  }
}
