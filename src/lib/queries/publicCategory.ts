import { prisma } from "@/lib/db";

/** Storefront nav/footer/category tiles only ever see unmasked categories (§4). */
export async function getPublicCategories() {
  return prisma.category.findMany({
    where: { visible: true },
    select: { id: true, name: true, nameAr: true, slug: true, position: true },
    orderBy: { position: "asc" },
  });
}

/** Used by the category page to resolve a visible category by slug. */
export async function getPublicCategoryBySlug(slug: string) {
  return prisma.category.findFirst({
    where: { slug, visible: true },
    select: { id: true, name: true, nameAr: true, slug: true },
  });
}
