import Link from "next/link";

export type BundleCardData = {
  id: string;
  slug: string;
  name: string;
  bundlePrice: number;
  coverImage: string | null;
};

/** Bundles/Duos (§6.8) — confirmed as its own section, directly under Top Selling. */
export function BundlesSection({ bundles }: { bundles: BundleCardData[] }) {
  const visibleBundles = bundles.length > 0 ? bundles : [{ id: "fallback-bundle", slug: "duo-hoodie-tshirt", name: "Duo هوودي + تيشيرت", bundlePrice: 6000, coverImage: "/images/seed/hero-1.svg" }];

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-kayaan-brown">Bundles</p>
          <h2 className="text-xl font-bold text-kayaan-ink">Bundles &amp; Duos</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {visibleBundles.map((b) => (
          <Link key={b.id} href={`/bundles/${b.slug}`} className="group flex flex-col gap-3 rounded-3xl border border-stone-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-kayaan-bg">
              {b.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={b.coverImage} alt={b.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-neutral-400">
                  {b.name}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-kayaan-ink">{b.name}</p>
              <p className="text-sm font-bold text-kayaan-brownDark">
                {b.bundlePrice.toLocaleString("ar-DZ")} د.ج
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
