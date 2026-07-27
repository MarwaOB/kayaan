import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { formatDZD } from "@/lib/format";
import { LOOKBOOK } from "@/lib/lookbook";
import { IconArrowEnd } from "@/components/ui/Icon";
import { ProtectedImage } from "@/components/ui/ProtectedImage";

export type BundleCardData = {
  id: string;
  slug: string;
  name: string;
  bundlePrice: number;
  coverImage: string | null;
};

/**
 * Bundles / duos (spec §6.8) — its own section, directly under Top Selling.
 *
 * Landscape cards rather than the portrait product crop, because a bundle is
 * two or more garments and a 4:5 frame can only really show one. The wider
 * frame also stops this section reading as another row of product cards.
 *
 * Title in Arabic — the old heading was the literal English "Bundles & Duos",
 * which breaks the Arabic-only rule (brief R1).
 */
export function BundlesSection({ bundles }: { bundles: BundleCardData[] }) {
  const visibleBundles =
    bundles.length > 0
      ? bundles
      : [
          {
            id: "fallback-bundle",
            slug: "duo-hoodie-tshirt",
            name: "ثنائي: هودي + تيشيرت",
            bundlePrice: 6000,
            coverImage: LOOKBOOK[1]?.image.src ?? null,
          },
        ];

  return (
    <section className="section-k bg-surface">
      <div className="container-k-wide">
        <SectionHeader
          index={5}
          title="الثنائيات والعروض"
          subtitle="قطعتان معاً بسعر أفضل — اختيارات جاهزة من كيان."
        />

        {/* Column count follows the item count. A single bundle stretched into
            a 3-column grid leaves two empty cells and reads as a broken page —
            and early on there will often be exactly one. */}
        <div
          className={`grid gap-4 ${
            visibleBundles.length === 1
              ? "md:grid-cols-2"
              : visibleBundles.length === 2
                ? "md:grid-cols-2"
                : "md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {visibleBundles.map((b, i) => {
            // Bundles are frequently created without a cover; fall back to
            // lookbook photography rather than rendering a scrim over nothing.
            const cover = b.coverImage ?? LOOKBOOK[i % Math.max(LOOKBOOK.length, 1)]?.image.src ?? null;
            return (
            <Link
              key={b.id}
              href={`/bundles/${b.slug}`}
              className="group relative block overflow-hidden rounded-md bg-surface-sunken"
            >
              <div className="aspect-[4/3]">
                {cover ? (
                  <ProtectedImage
                    src={cover}
                    alt={b.name}
                    className="h-full w-full object-cover transition-transform duration-slow ease-k group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-body-sm text-ink-subtle">
                    {b.name}
                  </div>
                )}
              </div>

              <div className="scrim-k absolute inset-0" />

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
                <div>
                  <p className="font-display text-h3 text-white">{b.name}</p>
                  <p className="tabular mt-1 text-price text-brand-200">{formatDZD(b.bundlePrice)}</p>
                </div>
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
