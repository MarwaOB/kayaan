"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/adminClient";

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  salePrice: number;
  discountPrice: number | null;
  trending: boolean;
  category: { name: string };
  variants: { sku: string; stock: number }[];
};

function formatDZD(amount: number) {
  return `${amount.toLocaleString("ar-DZ")} د.ج`;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function load(query?: string) {
    setLoading(true);
    const qs = query ? `?search=${encodeURIComponent(query)}` : "";
    const res = await adminFetch(`/api/admin/products${qs}`);
    const data = await res.json();
    setProducts(data.products ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    load(search.trim() || undefined);
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold">المنتجات</h1>
        <Link href="/admin/products/new" className="rounded-full bg-kayaan-brown px-4 py-2 text-xs font-bold text-white">
          + منتج جديد
        </Link>
      </div>

      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          placeholder="بحث بالاسم أو SKU"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xs rounded-lg border border-neutral-200 px-3 py-2 text-sm"
        />
        <button type="submit" className="rounded-lg bg-neutral-100 px-4 py-2 text-sm font-bold">
          بحث
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-neutral-400">...جاري التحميل</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-neutral-400">لا توجد نتائج.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-neutral-200">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-right text-xs font-bold text-neutral-500">
              <tr>
                <th className="px-4 py-2">المنتج</th>
                <th className="px-4 py-2">القسم</th>
                <th className="px-4 py-2">السعر</th>
                <th className="px-4 py-2">المخزون الكلي</th>
                <th className="px-4 py-2">🔥</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const totalStock = p.variants.reduce((s, v) => s + v.stock, 0);
                return (
                  <tr key={p.id} className="border-t border-neutral-100">
                    <td className="px-4 py-2 font-bold">{p.name}</td>
                    <td className="px-4 py-2 text-neutral-500">{p.category?.name}</td>
                    <td className="px-4 py-2">
                      {p.discountPrice ? (
                        <>
                          <span className="text-red-600">{formatDZD(p.discountPrice)}</span>{" "}
                          <span className="text-xs text-neutral-400 line-through">{formatDZD(p.salePrice)}</span>
                        </>
                      ) : (
                        formatDZD(p.salePrice)
                      )}
                    </td>
                    <td className="px-4 py-2">{totalStock}</td>
                    <td className="px-4 py-2">{p.trending ? "✅" : ""}</td>
                    <td className="px-4 py-2 text-left">
                      <Link href={`/admin/products/${p.id}`} className="text-xs font-bold text-kayaan-brown">
                        تعديل
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
