import { NextRequest, NextResponse } from "next/server";
import { submitReview, ReviewValidationError, ProductNotFoundError } from "@/lib/queries/publicReview";
import { isRateLimited, getClientIp } from "@/lib/rateLimit";

const MAX_REVIEWS_PER_WINDOW = 5;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

// POST /api/products/hoodie-jazairi/reviews   body: { customerName, rating, comment? }
// Honeypot: a hidden `website` field the real form never fills in. Any value
// there means a bot filled every field — accept the request silently (so
// the bot doesn't learn to avoid the field) but never actually write it.
export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const body = await req.json();

  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const ip = getClientIp(req);
  if (isRateLimited(`review:${ip}`, MAX_REVIEWS_PER_WINDOW, WINDOW_MS)) {
    return NextResponse.json({ error: "Too many reviews submitted. Please try again later." }, { status: 429 });
  }

  try {
    const review = await submitReview(params.slug, {
      customerName: body.customerName,
      rating: body.rating,
      comment: body.comment,
    });
    return NextResponse.json({ ok: true, id: review.id }, { status: 201 });
  } catch (err) {
    if (err instanceof ReviewValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    if (err instanceof ProductNotFoundError) {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    throw err;
  }
}
