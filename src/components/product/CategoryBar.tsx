import Link from "next/link";

type Category = { slug: string; nameAr: string };

/** Category bar (§7 item 2) — swipeable row up top of the product page. */
export function CategoryBar({ categories, activeSlug }: { categories: Category[]; activeSlug: string }) {
  if (categories.length === 0) return null;

  return (
    <div className="flex gap-2 overflow-x-auto px-4 pb-3">
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={`/categories/${c.slug}`}
          className={`shrink-0 rounded-full border px-4 py-1.5 text-sm ${
            c.slug === activeSlug
              ? "border-kayaan-brown bg-kayaan-brown text-white"
              : "border-neutral-200 bg-white text-neutral-700"
          }`}
        >
          {c.nameAr}
        </Link>
      ))}
    </div>
  );
}
