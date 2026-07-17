import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { listHotspotsForImage, createHotspot } from "@/lib/queries/adminHotspot";

// GET  /api/admin/hotspots?imageId=xxx
// POST /api/admin/hotspots   body: { imageId, xPercent, yPercent, linkedProductId }
export async function GET(req: NextRequest) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const imageId = req.nextUrl.searchParams.get("imageId");
  if (!imageId) {
    return NextResponse.json({ error: "imageId query param required" }, { status: 400 });
  }

  const hotspots = await listHotspotsForImage(imageId);
  return NextResponse.json({ hotspots });
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const body = await req.json();
  const { imageId, xPercent, yPercent, linkedProductId } = body;
  if (
    typeof imageId !== "string" ||
    typeof xPercent !== "number" ||
    xPercent < 0 ||
    xPercent > 100 ||
    typeof yPercent !== "number" ||
    yPercent < 0 ||
    yPercent > 100 ||
    typeof linkedProductId !== "string"
  ) {
    return NextResponse.json(
      { error: "imageId, linkedProductId (strings) and xPercent/yPercent (0-100) are required" },
      { status: 400 }
    );
  }

  const hotspot = await createHotspot({ imageId, xPercent, yPercent, linkedProductId });
  return NextResponse.json({ hotspot }, { status: 201 });
}
