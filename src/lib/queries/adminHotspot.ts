import { prisma } from "@/lib/db";

/**
 * ADMIN HOTSPOT QUERIES
 * ---------------------
 * Hotspots (tappable points on a product image linking to another product)
 * are fully rendered on the storefront (/products/[slug]) but had NO admin
 * management surface until now.
 */
export async function listHotspotsForImage(imageId: string) {
  return prisma.hotspot.findMany({
    where: { imageId },
    include: { linkedProduct: true },
  });
}

export type HotspotInput = {
  imageId: string;
  xPercent: number;
  yPercent: number;
  linkedProductId: string;
};

export async function createHotspot(input: HotspotInput) {
  return prisma.hotspot.create({ data: input });
}

export async function deleteHotspot(id: string) {
  return prisma.hotspot.delete({ where: { id } });
}
