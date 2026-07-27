"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, useFavorites } from "@/lib/store";
import { SizeGuideModal } from "./SizeGuideModal";
import { discountPercent, formatDZD, sizeLabel } from "@/lib/format";
import { IconHeart, IconTruck } from "@/components/ui/Icon";

type Variant = { id: string; color: string; size: string; stock: number };

/**
 * Spec §7 items 5–9 in one client component, since they share selection state:
 * name + price, short description + size-guide trigger, delivery estimate,
 * colour/size selectors, add to cart.
 *
 * Variant stock — never a product-level flag — gates the button (§3, §5).
 *
 * Two additions over the old panel:
 *
 * - **Colour swatches show the colour.** Arabic colour names were rendered as
 *   text pills, which asks the customer to imagine "بيج". Named colours map to
 *   an actual swatch, with the name kept for assistive tech and for any colour
 *   the map doesn't know.
 * - **A sticky buy bar on mobile**, appearing once the real CTA scrolls out of
 *   view. On a phone the add-to-cart button is off-screen for most of the page;
 *   this is the highest-leverage single element on a commerce PDP.
 */

/**
 * Arabic colour name -> swatch. An unknown name falls back to a text chip, so
 * an admin inventing a colour never produces a blank dot.
 */
const COLOR_SWATCHES: Record<string, string> = {
  أسود: "#1c1917",
  أبيض: "#ffffff",
  بيج: "#e5d2b8",
  رمادي: "#9a8f85",
  كحلي: "#1e293b",
  أخضر: "#3f6f4f",
  أحمر: "#9b2c2c",
  بني: "#654746",
  زيتي: "#5b6236",
};

export function PurchasePanel({
  productId,
  productName,
  slug,
  salePrice,
  discountPrice,
  shortDescription,
  variants,
  imageUrl,
}: {
  productId: string;
  productName: string;
  slug: string;
  salePrice: number;
  discountPrice: number | null;
  shortDescription: string;
  variants: Variant[];
  imageUrl?: string;
}) {
  const colors = useMemo(() => Array.from(new Set(variants.map((v) => v.color))), [variants]);
  const [selectedColor, setSelectedColor] = useState(colors[0] ?? "");
  const sizesForColor = useMemo(
    () => variants.filter((v) => v.color === selectedColor),
    [variants, selectedColor],
  );
  const [selectedSize, setSelectedSize] = useState(sizesForColor[0]?.size ?? "");
  const [added, setAdded] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(true);

  const addLine = useCart((s) => s.addLine);
  const { isFavorite, toggleFavorite } = useFavorites();
  const router = useRouter();
  const ctaRef = useRef<HTMLDivElement>(null);

  const activeVariant = variants.find((v) => v.color === selectedColor && v.size === selectedSize);
  const unitPrice = discountPrice ?? salePrice;
  const discount = discountPercent(salePrice, discountPrice);
  const favorite = isFavorite(productId);
  const soldOut = !activeVariant || activeVariant.stock <= 0;

  // Drives the sticky mobile bar — no scroll listener, no layout thrash.
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setCtaVisible(entry.isIntersecting), {
      rootMargin: "-80px 0px 0px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The floating WhatsApp bubble is a global, fixed to the same corner as the
  // buy bar, and the two overlap once the bar appears. Flagging it on <body>
  // lets globals.css lift the bubble clear — cheaper and more predictable than
  // threading state through the page to a sibling component.
  useEffect(() => {
    if (ctaVisible) {
      document.body.removeAttribute("data-buybar");
    } else {
      document.body.setAttribute("data-buybar", "1");
    }
    return () => document.body.removeAttribute("data-buybar");
  }, [ctaVisible]);

  function selectColor(color: string) {
    setSelectedColor(color);
    setSelectedSize(variants.find((v) => v.color === color)?.size ?? "");
    setAdded(false);
  }

  function handleAddToCart() {
    if (!activeVariant || activeVariant.stock <= 0) return;
    addLine({
      variantId: activeVariant.id,
      productId,
      productName,
      color: activeVariant.color,
      size: activeVariant.size,
      unitPrice,
      imageUrl,
    });
    setAdded(true);
  }

  const ctaLabel = soldOut ? "غير متوفر حالياً" : added ? "تمت الإضافة ✓" : "أضف إلى السلة";

  return (
    <div className="flex flex-col">
      {/* Name + price (§7 item 5) */}
      <div>
        <h1 className="font-display text-display-2 text-ink">{productName}</h1>

        <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          {discountPrice != null ? (
            <>
              <span className="tabular font-display text-h1 text-brand-800">
                {formatDZD(discountPrice)}
              </span>
              <span className="tabular text-body text-ink-subtle line-through">
                {formatDZD(salePrice)}
              </span>
              {discount !== null && (
                <span className="rounded-xs bg-danger px-2 py-1 text-caption text-white">
                  وفّر {discount}%
                </span>
              )}
            </>
          ) : (
            <span className="tabular font-display text-h1 text-brand-800">{formatDZD(salePrice)}</span>
          )}
        </div>
      </div>

      {/* Short description (§7 item 6) */}
      <p className="mt-5 max-w-[46ch] text-body text-ink-muted">{shortDescription}</p>

      {/* Colour (§7 item 8) */}
      {colors.length > 0 && (
        <fieldset className="mt-8">
          <legend className="text-caption text-ink-muted">
            اللون: <span className="font-semibold text-ink">{selectedColor}</span>
          </legend>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {colors.map((color) => {
              const swatch = COLOR_SWATCHES[color.trim()];
              const isSelected = color === selectedColor;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => selectColor(color)}
                  aria-pressed={isSelected}
                  aria-label={color}
                  title={color}
                  className={
                    swatch
                      ? `grid h-10 w-10 place-items-center rounded-pill ring-1 ring-inset transition duration-fast ease-k ${
                          isSelected
                            ? "ring-2 ring-brand-700 ring-offset-2 ring-offset-bg"
                            : "ring-line-strong hover:ring-brand-400"
                        }`
                      : `h-10 rounded-sm border px-4 text-body-sm transition duration-fast ease-k ${
                          isSelected
                            ? "border-brand-700 bg-brand-700 text-white"
                            : "border-line-strong text-ink hover:border-brand-400"
                        }`
                  }
                  style={swatch ? { backgroundColor: swatch } : undefined}
                >
                  {swatch ? <span className="sr-only">{color}</span> : color}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {/* Size (§7 item 8) + size-guide modal (§7 item 6, brief R8) */}
      {sizesForColor.length > 0 && (
        <fieldset className="mt-7">
          <div className="flex items-center justify-between gap-4">
            <legend className="text-caption text-ink-muted">المقاس</legend>
            <SizeGuideModal />
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {sizesForColor.map((v) => {
              const out = v.stock <= 0;
              const isSelected = v.size === selectedSize;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    setSelectedSize(v.size);
                    setAdded(false);
                  }}
                  disabled={out}
                  aria-pressed={isSelected}
                  aria-label={out ? `${sizeLabel(v.size)} — نفدت الكمية` : sizeLabel(v.size)}
                  // A diagonal rule across the whole chip marks sold out —
                  // colour alone is never the only signal (§9). `line-through`
                  // on a one-letter size reads as a broken glyph, not a state.
                  className={`relative h-11 min-w-[3rem] overflow-hidden rounded-sm border px-4 text-body-sm transition duration-fast ease-k ${
                    out
                      ? "cursor-not-allowed border-line text-ink-subtle"
                      : isSelected
                        ? "border-brand-700 bg-brand-700 text-white"
                        : "border-line-strong text-ink hover:border-brand-400"
                  }`}
                >
                  {sizeLabel(v.size)}
                  {out && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top left, transparent calc(50% - 0.5px), var(--k-line-strong) calc(50% - 0.5px), var(--k-line-strong) calc(50% + 0.5px), transparent calc(50% + 0.5px))",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {/* Add to cart (§7 item 9) */}
      <div ref={ctaRef} className="mt-8 flex gap-2">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={soldOut}
          className="h-12 flex-1 rounded-sm bg-brand-700 text-body font-semibold text-white transition duration-fast ease-k hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-ink-subtle"
        >
          {ctaLabel}
        </button>

        <button
          type="button"
          onClick={() => toggleFavorite(productId)}
          aria-pressed={favorite}
          aria-label={favorite ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
          className="grid h-12 w-12 shrink-0 place-items-center rounded-sm border border-line-strong text-ink transition duration-fast ease-k hover:border-brand-400"
        >
          <IconHeart filled={favorite} className={`h-5 w-5 ${favorite ? "text-danger" : ""}`} />
        </button>
      </div>

      {added && (
        <button
          type="button"
          onClick={() => router.push("/cart")}
          className="mt-3 h-11 rounded-sm border border-line-strong text-body-sm font-semibold text-brand-700 transition duration-fast ease-k hover:border-brand-400"
        >
          عرض السلة والدفع
        </button>
      )}

      {/* Approximate delivery (§7 item 7) */}
      <p className="mt-6 flex items-start gap-2.5 border-t border-line pt-6 text-body-sm text-ink-muted">
        <IconTruck className="mt-0.5 h-[18px] w-[18px] shrink-0 text-brand-600" />
        التوصيل التقريبي: من 2 إلى 5 أيام عمل حسب الولاية، مع الدفع عند الاستلام.
      </p>

      {/* Sticky mobile buy bar */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 p-3 backdrop-blur-md transition-transform duration-base ease-k lg:hidden ${
          ctaVisible ? "translate-y-full" : "translate-y-0"
        }`}
        // Hidden from assistive tech while off-screen — the real CTA above is
        // the one in the reading order.
        aria-hidden={ctaVisible}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="line-clamp-1 text-body-sm font-medium text-ink">{productName}</p>
            <p className="tabular text-body-sm font-bold text-brand-800">{formatDZD(unitPrice)}</p>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={soldOut}
            tabIndex={ctaVisible ? -1 : 0}
            className="h-11 shrink-0 rounded-sm bg-brand-700 px-6 text-body-sm font-semibold text-white transition duration-fast ease-k disabled:bg-surface-sunken disabled:text-ink-subtle"
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
