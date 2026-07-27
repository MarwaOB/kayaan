"use client";

import Link from "next/link";
import { useFavorites } from "@/lib/store";
import { discountPercent, formatDZD } from "@/lib/format";
import { IconHeart } from "@/components/ui/Icon";
import { ProtectedImage } from "@/components/ui/ProtectedImage";

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  salePrice: number;
  discountPrice: number | null;
  trending: boolean;
  inStock: boolean;
  images: { url: string; altText: string | null }[];
};

/**
 * Product card (spec §5) — Home, Collections, Top Selling, category grids.
 *
 * Deliberately without chrome: no border, no shadow, no card background. The
 * garment sits on the cream canvas the way work hangs on a gallery wall, and
 * separation comes from the grid gutter alone (docs/DESIGN-SYSTEM.md §4.3 and
 * §6.2). The old card had `rounded-xl` + `shadow-sm` + an inline `style={{ top: 8 }}`
 * fighting its own Tailwind positioning.
 *
 * Hover moves the image and nothing else — no lift, no shadow bloom.
 *
 * Out-of-stock products still render in full (§5): they are marked, never
 * hidden and never dimmed into illegibility.
 */
export function ProductCard({
  product,
  priority = false,
}: {
  product: ProductCardData;
  /** Set on the first row of an above-the-fold grid. */
  priority?: boolean;
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(product.id);
  const cover = product.images[0];
  const discount = discountPercent(product.salePrice, product.discountPrice);

  return (
    <article className="group relative flex flex-col">
      <Link
        href={`/products/${product.slug}`}
        className="relative block overflow-hidden rounded-md bg-surface-sunken"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="aspect-product">
          {cover ? (
            // alt="" because the card's accessible name comes from the product
            // title link below — otherwise every card announces twice.
            <ProtectedImage
              src={cover.url}
              alt=""
              priority={priority}
              sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 46vw"
              className="h-full w-full object-cover transition-transform duration-slow ease-k group-hover:scale-[1.03]"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-body-sm text-ink-subtle">
              لا توجد صورة
            </div>
          )}
        </div>

        {/* Badges use logical inset properties so they follow `dir` (§8). */}
        <div className="pointer-events-none absolute start-0 top-0 flex flex-col items-start gap-1.5 p-2.5">
          {discount !== null && (
            <span className="rounded-xs bg-danger px-2 py-1 text-caption text-white">
              -{discount}%
            </span>
          )}
          {product.trending && (
            <span className="rounded-xs bg-brand-900/85 px-2 py-1 text-caption text-brand-100">
              الأكثر رواجاً
            </span>
          )}
        </div>

        {!product.inStock && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-2.5">
            <span className="inline-block rounded-xs bg-brand-900/85 px-2 py-1 text-caption text-white">
              نفدت الكمية
            </span>
          </div>
        )}
      </Link>

      <button
        type="button"
        onClick={() => toggleFavorite(product.id)}
        aria-pressed={favorite}
        aria-label={favorite ? `إزالة ${product.name} من المفضلة` : `إضافة ${product.name} إلى المفضلة`}
        className="absolute end-2.5 top-2.5 grid h-9 w-9 place-items-center rounded-pill bg-surface/90 text-ink backdrop-blur-sm transition duration-fast ease-k hover:bg-surface"
      >
        <IconHeart filled={favorite} className={`h-[18px] w-[18px] ${favorite ? "text-danger" : ""}`} />
      </button>

      <div className="mt-3 flex flex-col gap-1">
        <h3 className="text-body-sm">
          {/* The real link — the image above is aria-hidden so the card is one
              tab stop with one accessible name, not two. */}
          <Link
            href={`/products/${product.slug}`}
            className="line-clamp-1 font-medium text-ink transition-colors duration-fast ease-k hover:text-brand-700"
          >
            {product.name}
          </Link>
        </h3>

        <div className="flex items-baseline gap-2">
          {product.discountPrice != null ? (
            <>
              <span className="tabular text-price text-brand-800">{formatDZD(product.discountPrice)}</span>
              <span className="tabular text-body-sm text-ink-subtle line-through">
                {formatDZD(product.salePrice)}
              </span>
            </>
          ) : (
            <span className="tabular text-price text-brand-800">{formatDZD(product.salePrice)}</span>
          )}
        </div>
      </div>
    </article>
  );
}
