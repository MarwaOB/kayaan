import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { getHomepageContent, setHomepageContent, HomepageContent } from "@/lib/queries/siteSettings";

// GET /api/admin/settings/homepage
export async function GET(req: NextRequest) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const content = await getHomepageContent();
  return NextResponse.json({ content });
}

// PUT /api/admin/settings/homepage   body: HomepageContent (all five fields together)
export async function PUT(req: NextRequest) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const body = await req.json();

  const errors: string[] = [];
  if (!Array.isArray(body.bannerMessages) || !body.bannerMessages.every((m: unknown) => typeof m === "string")) {
    errors.push("bannerMessages must be an array of strings");
  }
  if (
    !Array.isArray(body.runningBarItems) ||
    !body.runningBarItems.every((i: any) => typeof i?.icon === "string" && typeof i?.label === "string")
  ) {
    errors.push("runningBarItems must be an array of { icon, label }");
  }
  if (typeof body.videoUrl !== "string") {
    errors.push("videoUrl must be a string");
  }
  if (
    !Array.isArray(body.heroSlides) ||
    !body.heroSlides.every((s: any) => typeof s?.imageUrl === "string" && typeof s?.headline === "string")
  ) {
    errors.push("heroSlides must be an array of { imageUrl, headline, ctaLabel?, ctaHref? }");
  }
  if (
    !Array.isArray(body.testimonials) ||
    !body.testimonials.every(
      (t: any) =>
        typeof t?.name === "string" &&
        typeof t?.quote === "string" &&
        Number.isInteger(t?.rating) &&
        t.rating >= 1 &&
        t.rating <= 5
    )
  ) {
    errors.push("testimonials must be an array of { name, quote, rating: 1-5 }");
  }

  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join("; ") }, { status: 400 });
  }

  const content: HomepageContent = {
    bannerMessages: body.bannerMessages,
    runningBarItems: body.runningBarItems,
    videoUrl: body.videoUrl,
    heroSlides: body.heroSlides,
    testimonials: body.testimonials,
  };

  await setHomepageContent(content);
  return NextResponse.json({ ok: true });
}
