import Link from "next/link";

export type CollectionCardData = {
  id: string;
  slug: string;
  name: string;
  nameAr: string | null;
  coverImage: string | null;
};

/** Collections carousel (§6.9) — not fixed, admin creates freely (seasonal drops, etc). */
export function CollectionsCarousel({ collections }: { collections: CollectionCardData[] }) {
  const visibleCollections = collections.length > 0 ? collections : [{ id: "fallback-collection", slug: "drop-ramadan-2026", name: "Ramadan Drop 2026", nameAr: "إطلاقة رمضان 2026", coverImage: "/images/seed/hero-2.svg" }];

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-kayaan-brown">Collections</p>
          <h2 className="text-xl font-bold text-kayaan-ink">التشكيلات</h2>
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {visibleCollections.map((c) => (
          <Link key={c.id} href={`/collections/${c.slug}`} className="w-56 shrink-0 rounded-3xl border border-stone-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-kayaan-bg">
              {c.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.coverImage} alt={c.nameAr ?? c.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-neutral-400">
                  {c.nameAr ?? c.name}
                </div>
              )}
            </div>
            <p className="mt-3 text-sm font-semibold text-kayaan-ink">{c.nameAr ?? c.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
