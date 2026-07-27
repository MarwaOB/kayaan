import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { LOOKBOOK } from "@/lib/lookbook";
import { IconArrowEnd } from "@/components/ui/Icon";
import { ProtectedImage } from "@/components/ui/ProtectedImage";

export type CollectionCardData = {
  id: string;
  slug: string;
  name: string;
  nameAr: string | null;
  coverImage: string | null;
};

/**
 * Collections (spec §6.9). Not a fixed set — the admin creates these freely, so
 * the rail has to look right with one item or ten.
 *
 * Tall 3:4 frames on a snap rail that bleeds past the gutter. Name and arrow sit
 * over the image rather than under it, so a row of collections with wildly
 * different name lengths still has a flat, even baseline.
 */
export function CollectionsCarousel({ collections }: { collections: CollectionCardData[] }) {
  const visibleCollections =
    collections.length > 0
      ? collections
      : [
          {
            id: "fallback-collection",
            slug: "drop-ramadan-2026",
            name: "Ramadan Drop 2026",
            nameAr: "إطلاقة رمضان 2026",
            coverImage: LOOKBOOK[3]?.image.src ?? null,
          },
        ];

  return (
    <section className="section-k">
      <div className="container-k-wide">
        <SectionHeader
          index={6}
          title="التشكيلات"
          subtitle="إصدارات موسمية ومجموعات مختارة، تتجدد باستمرار."
        />

        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
          {visibleCollections.map((c, i) => {
            const cover = c.coverImage ?? LOOKBOOK[i % Math.max(LOOKBOOK.length, 1)]?.image.src ?? null;
            const label = c.nameAr ?? c.name;
            return (
              <Link
                key={c.id}
                href={`/collections/${c.slug}`}
                className="group relative w-[78vw] shrink-0 snap-start overflow-hidden rounded-md bg-surface-sunken sm:w-[46vw] lg:w-[30vw] xl:w-[24rem]"
              >
                <div className="aspect-[3/4]">
                  {cover ? (
                    <ProtectedImage
                      src={cover}
                      alt={label}
                      className="h-full w-full object-cover transition-transform duration-slow ease-k group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-body-sm text-ink-subtle">{label}</div>
                  )}
                </div>

                <div className="scrim-k absolute inset-0" />

                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
                  <p className="font-display text-h2 text-white">{label}</p>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-pill bg-white/15 text-white backdrop-blur-sm transition duration-base ease-k group-hover:bg-white group-hover:text-brand-800">
                    <IconArrowEnd className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
