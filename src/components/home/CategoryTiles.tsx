import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { categoryShot } from "@/lib/lookbook";
import { toSrcSet } from "@/lib/media";
import { IconArrowEnd } from "@/components/ui/Icon";
import { ProtectedImage } from "@/components/ui/ProtectedImage";

type Category = { slug: string; name: string; nameAr: string };

/**
 * Shop by category (spec §6.6). Only unmasked categories reach this (§4).
 *
 * Now photographic. The old tiles were a 👕 emoji on a white rounded square,
 * which told a customer nothing and rendered differently on every platform —
 * the brand has a full shoot and none of it was on the page.
 *
 * Tiles butt together with a 2px seam so the row reads as one strip of imagery
 * rather than a set of floating cards, which is the "no gap between images"
 * instinct from the brief applied at grid scale.
 */
export function CategoryTiles({ categories }: { categories: Category[] }) {
  const safeCategories =
    categories.length > 0
      ? categories
      : [
          { slug: "t-shirts", name: "T-shirts", nameAr: "أقمصة" },
          { slug: "hoodies", name: "Hoodies", nameAr: "هووديز" },
          { slug: "totebags", name: "Totebags", nameAr: "توت باغز" },
        ];

  return (
    <section className="section-k bg-surface">
      <div className="container-k-wide">
        <SectionHeader index={3} title="تسوّق حسب القسم" subtitle="اختر فئتك وابدأ التصفح." />
      </div>

      <div className="container-k-wide">
        <div className="grid grid-cols-2 gap-0.5 overflow-hidden rounded-md lg:grid-cols-3">
          {safeCategories.map((c, i) => {
            const shot = categoryShot(c.slug, i);
            return (
              <Link
                key={c.slug}
                href={`/categories/${c.slug}`}
                className="group relative block aspect-[3/4] overflow-hidden bg-surface-sunken sm:aspect-product"
              >
                {shot ? (
                  <ProtectedImage
                    src={shot.image.src}
                    srcSet={toSrcSet(shot.image)}
                    sizes="(min-width: 1024px) 33vw, 50vw"
                    alt={shot.alt}
                    className="h-full w-full object-cover transition-transform duration-slow ease-k group-hover:scale-[1.04]"
                  />
                ) : null}

                <div className="scrim-k absolute inset-0" />

                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-4 md:p-5">
                  <span className="font-display text-h2 text-white">{c.nameAr}</span>
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
