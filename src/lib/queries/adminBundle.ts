import { prisma } from "@/lib/db";

/**
 * ADMIN BUNDLE QUERIES
 * --------------------
 * Bundles ("Duos", §6 item 8) are fully live on the storefront
 * (/bundles/[slug], orderable at checkout) but had NO admin management
 * surface until now.
 */
export async function listBundles() {
  return prisma.bundle.findMany({
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export type BundleInput = {
  name: string;
  slug: string;
  description?: string;
  bundlePrice: number;
  coverImage?: string;
  visible?: boolean;
};

export async function createBundle(input: BundleInput) {
  return prisma.bundle.create({ data: input });
}

export async function updateBundle(id: string, input: Partial<BundleInput>) {
  return prisma.bundle.update({ where: { id }, data: input });
}

export async function deleteBundle(id: string) {
  return prisma.bundle.delete({ where: { id } });
}

/** Replaces the full item list for a bundle. */
export async function setBundleItems(id: string, items: { productId: string; quantity: number }[]) {
  return prisma.$transaction([
    prisma.bundleItem.deleteMany({ where: { bundleId: id } }),
    prisma.bundleItem.createMany({
      data: items.map((i) => ({ bundleId: id, productId: i.productId, quantity: i.quantity })),
    }),
  ]);
}
