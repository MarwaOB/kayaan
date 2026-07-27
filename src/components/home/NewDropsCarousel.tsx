import { ProductCard, type ProductCardData } from "@/components/shared/ProductCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

/**
 * New drops (spec §6.4).
 *
 * The spec asks for a two-row grid; the brief (R6) says mobile must not become
 * "small rectangles". Both hold: two rows from `md` up where there is width for
 * them, and a single rail of large 72vw cards on phones — the old version put
 * two rows of 45%-wide cards on a 360px screen, which is exactly the complaint.
 *
 * The rail bleeds past the gutter so the last card is visibly cut off — the
 * cheapest honest signal that a row scrolls.
 */
export function NewDropsCarousel({ products }: { products: ProductCardData[] }) {
  if (products.length === 0) return null;

  return (
    <section className="section-k">
      <div className="container-k-wide">
        <SectionHeader
          index={1}
          title="أحدث الإصدارات"
          subtitle="القطع التي وصلت للتو إلى المتجر."
          actionHref="/top-selling"
          actionLabel="تصفّح الكل"
        />

        {/* A plain row-flow grid, not `grid-flow-col` with fixed rows: with 8
            products it lands on two rows of four exactly as the spec asks, and
            with 3 it degrades to one tidy row instead of stacking everything
            into the first column and leaving the rest of the width empty. */}
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-4 md:gap-x-5 md:gap-y-10 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden">
          {products.map((p, i) => (
            <div key={p.id} className="w-[72vw] shrink-0 snap-start sm:w-[46vw] md:w-auto">
              <ProductCard product={p} priority={i < 4} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
