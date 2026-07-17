"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/store";
import { SizeGuideModal } from "./SizeGuideModal";

type Variant = { id: string; color: string; size: string; stock: number };

function formatDZD(amount: number) {
  return `${amount.toLocaleString("ar-DZ")} د.ج`;
}

/**
 * §7 items 5-9, bundled into one client component because they share state:
 * name+price, short description + size-guide trigger, approximate delivery
 * time, color/size selectors, add-to-cart button. Selecting a color/size
 * combo resolves to a specific variant, whose own stock gates "add to cart"
 * (never a flat product-level in/out-of-stock flag — §3, §5).
 */
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
    [variants, selectedColor]
  );
  const [selectedSize, setSelectedSize] = useState(sizesForColor[0]?.size ?? "");
  const addLine = useCart((s) => s.addLine);
  const router = useRouter();
  const [added, setAdded] = useState(false);

  const activeVariant = variants.find((v) => v.color === selectedColor && v.size === selectedSize);
  const unitPrice = discountPrice ?? salePrice;

  function selectColor(color: string) {
    setSelectedColor(color);
    const firstSize = variants.find((v) => v.color === color)?.size ?? "";
    setSelectedSize(firstSize);
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

  return (
    <div className="flex flex-col gap-4 rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-kayaan-brown">منتج مميز</p>
        <h1 className="mt-2 text-2xl font-bold text-kayaan-ink">{productName}</h1>
        <div className="mt-3 flex items-center gap-2">
          {discountPrice != null ? (
            <>
              <span className="text-xl font-bold text-kayaan-brownDark">{formatDZD(discountPrice)}</span>
              <span className="text-sm text-neutral-400 line-through">{formatDZD(salePrice)}</span>
            </>
          ) : (
            <span className="text-xl font-bold text-kayaan-brownDark">{formatDZD(salePrice)}</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm leading-7 text-neutral-600">{shortDescription}</p>
        <SizeGuideModal />
      </div>

      <p className="rounded-2xl bg-kayaan-pink px-3 py-3 text-sm text-kayaan-brownDark">
        🚚 التوصيل التقريبي: 2 إلى 5 أيام عمل حسب الولاية
      </p>

      {colors.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-bold text-neutral-700">اللون</p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => selectColor(color)}
                className={`rounded-full border px-3 py-2 text-sm transition ${
                  color === selectedColor
                    ? "border-kayaan-brown bg-kayaan-brown text-white"
                    : "border-neutral-200 bg-white text-neutral-700"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {sizesForColor.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-bold text-neutral-700">المقاس</p>
          <div className="flex flex-wrap gap-2">
            {sizesForColor.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => {
                  setSelectedSize(v.size);
                  setAdded(false);
                }}
                disabled={v.stock <= 0}
                className={`rounded-full border px-3 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${
                  v.size === selectedSize
                    ? "border-kayaan-brown bg-kayaan-brown text-white"
                    : "border-neutral-200 bg-white text-neutral-700"
                }`}
              >
                {v.size}
                {v.stock <= 0 ? " (نفدت)" : ""}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!activeVariant || activeVariant.stock <= 0}
        className="rounded-full bg-kayaan-brown py-3 text-sm font-bold text-white transition hover:bg-kayaan-brownDark disabled:cursor-not-allowed disabled:bg-neutral-300"
      >
        {!activeVariant || activeVariant.stock <= 0 ? "غير متوفر حالياً" : added ? "تمت الإضافة ✓" : "أضف إلى السلة"}
      </button>
      {added && (
        <button
          type="button"
          onClick={() => router.push("/cart")}
          className="text-center text-sm font-semibold text-kayaan-brown underline"
        >
          عرض السلة والدفع
        </button>
      )}
    </div>
  );
}
