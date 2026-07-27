import Link from "next/link";

type RailCategory = { slug: string; nameAr: string; name: string };

/**
 * Sibling wayfinding under a listing masthead.
 *
 * The old category page was a cul-de-sac: having landed on "هووديز" the only
 * route to "تيشيرتات" was back up to the header rail (desktop) or into the
 * mega-menu (mobile). Browsing a clothing shop is lateral — you compare
 * sections — so the sections travel with the page.
 *
 * The strip bleeds into the gutter on both sides so the last chip is visibly
 * clipped; that cut edge is the only reliable affordance for "this scrolls".
 */
export function CategoryRail({
  categories,
  activeSlug,
}: {
  categories: RailCategory[];
  /** Slug of the category being viewed, or "top-selling" / undefined. */
  activeSlug?: string;
}) {
  const items = [
    ...categories.map((c) => ({ key: c.slug, label: c.nameAr, href: `/categories/${c.slug}` })),
    { key: "top-selling", label: "الأكثر مبيعاً", href: "/top-selling" },
  ];

  if (items.length < 2) return null;

  return (
    // Not "الأقسام": the header already has a nav by that name (and the
    // mega-menu a third), and two landmarks sharing an accessible name are
    // indistinguishable in a screen reader's landmark list.
    <nav aria-label="تصفّح الأقسام" className="border-b border-line">
      <div className="container-k-wide">
        <ul className="-ms-4 -me-4 flex snap-x gap-2 overflow-x-auto ps-4 pe-4 py-4 md:-ms-6 md:-me-6 md:ps-6 md:pe-6 xl:-ms-8 xl:-me-8 xl:ps-8 xl:pe-8">
          {items.map((item) => {
            const active = item.key === activeSlug;
            return (
              <li key={item.key} className="snap-start">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={
                    active
                      ? "flex h-11 items-center whitespace-nowrap rounded-sm bg-brand-700 px-4 text-body-sm font-semibold text-white"
                      : "flex h-11 items-center whitespace-nowrap rounded-sm border border-line-strong px-4 text-body-sm text-ink-muted transition-colors duration-fast ease-k hover:border-brand-400 hover:text-ink"
                  }
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
