import Link from "next/link";

type Category = { slug: string; nameAr: string };

/**
 * Category bar (spec §7 item 2) — a swipeable row at the top of the PDP.
 *
 * The active category is marked with an underline rather than a filled pill:
 * a solid brown pill here competes with the add-to-cart button for the eye,
 * and on a product page nothing should out-shout the CTA.
 */
export function CategoryBar({ categories, activeSlug }: { categories: Category[]; activeSlug: string }) {
  if (categories.length === 0) return null;

  return (
    <nav aria-label="الأقسام">
      <div className="-mx-4 flex gap-6 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
        {categories.map((c) => {
          const isActive = c.slug === activeSlug;
          return (
            <Link
              key={c.slug}
              href={`/categories/${c.slug}`}
              aria-current={isActive ? "page" : undefined}
              className={`shrink-0 border-b-2 py-3 text-body-sm transition-colors duration-fast ease-k ${
                isActive
                  ? "border-brand-700 font-semibold text-ink"
                  : "border-transparent text-ink-muted hover:border-line-strong hover:text-ink"
              }`}
            >
              {c.nameAr}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
