"use client";

import Link from "next/link";
import { useCart } from "@/lib/store";

function formatDZD(amount: number) {
  return `${amount.toLocaleString("ar-DZ")} د.ج`;
}

/**
 * Cart page — no customer accounts (§8), so this reads straight from the
 * locally persisted `useCart` store. Quantities/removals happen client-side;
 * the actual price/stock re-validation happens server-side at checkout
 * (§14.2, §14.6), never trusted from this page alone.
 */
export default function CartPage() {
  const { lines, removeLine, setQuantity, totalPrice } = useCart();

  if (lines.length === 0) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-5xl">🛍️</p>
        <p className="text-lg font-bold">السلة فارغة</p>
        <Link href="/" className="rounded-full bg-kayaan-brown px-6 py-2.5 text-sm font-bold text-white">
          تصفح المنتجات
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-xl font-bold">السلة</h1>

      <div className="flex flex-col gap-4">
        {lines.map((line) => (
          <div key={line.variantId} className="flex gap-3 rounded-xl bg-white p-3">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-kayaan-bg">
              {line.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={line.imageUrl} alt={line.productName} className="h-full w-full object-cover" />
              )}
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <p className="text-sm font-medium">{line.productName}</p>
                <p className="text-xs text-neutral-500">
                  {line.color} / {line.size}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(line.variantId, Math.max(1, line.quantity - 1))}
                    className="grid h-7 w-7 place-items-center rounded-full border border-neutral-200 text-sm"
                  >
                    −
                  </button>
                  <span className="w-5 text-center text-sm">{line.quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(line.variantId, line.quantity + 1)}
                    className="grid h-7 w-7 place-items-center rounded-full border border-neutral-200 text-sm"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm font-bold text-kayaan-brownDark">{formatDZD(line.unitPrice * line.quantity)}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeLine(line.variantId)}
              aria-label="إزالة"
              className="self-start text-neutral-400"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-neutral-200 pt-4">
        <span className="font-bold">الإجمالي</span>
        <span className="text-lg font-bold text-kayaan-brownDark">{formatDZD(totalPrice())}</span>
      </div>

      <Link
        href="/checkout"
        className="mt-4 block rounded-full bg-kayaan-brown py-3 text-center text-sm font-bold text-white"
      >
        إتمام الطلب
      </Link>
    </main>
  );
}
