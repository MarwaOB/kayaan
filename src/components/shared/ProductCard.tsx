"use client";

import Link from "next/link";
import { useFavorites } from "@/lib/store";

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

function formatDZD(amount: number) {
  return `${amount.toLocaleString("ar-DZ")} د.ج`;
}

/**
 * Product Card (§5) — used on Home, Collections, Top Selling, category grids.
 * Shows: image, discount badge, trending badge, favorite toggle, name, price.
 * Out-of-stock products still render (never hidden), just tagged (§5 new requirement).
 */
export function ProductCard({ product }: { product: ProductCardData }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(product.id);
  const cover = product.images[0];
  const discountPct =
    product.discountPrice != null
      ? Math.round(((product.salePrice - product.discountPrice) / product.salePrice) * 100)
      : null;

  return (
    <div className="group relative flex flex-col">
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden rounded-xl bg-white">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover.url}
            alt={cover.altText ?? product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-neutral-400">لا توجد صورة</div>
        )}

        {discountPct !== null && (
          <span className="absolute top-2 start-2 rounded-full bg-kayaan-brown px-2 py-1 text-xs font-bold text-white">
            -{discountPct}%
          </span>
        )}
        {product.trending && (
          <span className="absolute top-2 end-2 rounded-full bg-white/90 px-2 py-1 text-xs font-bold">🔥</span>
        )}
        {!product.inStock && (
          <span className="absolute bottom-2 start-2 rounded-full bg-neutral-900/85 px-2 py-1 text-xs font-bold text-white">
            نفدت الكمية
          </span>
        )}
      </Link>

      <button
        type="button"
        onClick={() => toggleFavorite(product.id)}
        aria-label="إضافة إلى المفضلة"
        className="absolute top-2 end-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-lg shadow-sm"
        style={{ top: 8 }}
      >
        {favorite ? "❤️" : "🤍"}
      </button>

      <div className="mt-2 flex flex-col gap-0.5 px-1">
        <Link href={`/products/${product.slug}`} className="line-clamp-1 text-sm font-medium">
          {product.name}
        </Link>
        <div className="flex items-center gap-2 text-sm">
          {product.discountPrice != null ? (
            <>
              <span className="font-bold text-kayaan-brownDark">{formatDZD(product.discountPrice)}</span>
              <span className="text-neutral-400 line-through">{formatDZD(product.salePrice)}</span>
            </>
          ) : (
            <span className="font-bold text-kayaan-brownDark">{formatDZD(product.salePrice)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
