import Link from "next/link";
import type { BundleCardData } from "@/components/home/BundlesSection";
import { formatDZD } from "@/lib/format";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { LOOKBOOK } from "@/lib/lookbook";
import { ProtectedImage } from "@/components/ui/ProtectedImage";
import { IconArrowEnd } from "@/components/ui/Icon";

/**
 * Related bundles (spec §7 item 12) — its own section, separate from the
 * contact form. Uses the same card as the home page's bundle section, so a
 * customer meets one design for the idea rather than two.
 */
export function RelatedBundles({ bundles }: { bundles: BundleCardData[] }) {
  if (bundles.length === 0) return null;

  return (
    <section className="section-k">
      <div className="container-k-wide">
        <SectionHeader
          index={2}
          title="متوفر ضمن هذه الثنائيات"
          subtitle="اجمع هذه القطعة مع أخرى بسعر أفضل."
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bundles.map((b, i) => {
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
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
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
