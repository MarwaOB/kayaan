"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminClient";

type Product = { id: string; name: string };
type Bundle = {
  id: string;
  name: string;
  slug: string;
  bundlePrice: number;
  visible: boolean;
  items: { product: Product; quantity: number }[];
};

export default function AdminBundlesPage() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [editingItemsFor, setEditingItemsFor] = useState<string | null>(null);
  const [pickedItems, setPickedItems] = useState<Map<string, number>>(new Map());

  const [form, setForm] = useState({ name: "", slug: "", bundlePrice: "" });

  async function load() {
    setLoading(true);
    const [bundlesRes, productsRes] = await Promise.all([
      adminFetch("/api/admin/bundles"),
      adminFetch("/api/admin/products"),
    ]);
    const bundlesData = await bundlesRes.json();
    const productsData = await productsRes.json();
    setBundles(bundlesData.bundles ?? []);
    setProducts((productsData.products ?? []).map((p: any) => ({ id: p.id, name: p.name })));
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await adminFetch("/api/admin/bundles", {
        method: "POST",
        body: JSON.stringify({ ...form, bundlePrice: Number(form.bundlePrice) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "فشل إنشاء الحزمة");
        return;
      }
      setForm({ name: "", slug: "", bundlePrice: "" });
      await load();
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleVisible(id: string, visible: boolean) {
    await adminFetch(`/api/admin/bundles/${id}`, { method: "PATCH", body: JSON.stringify({ visible }) });
    await load();
  }

  async function remove(id: string) {
    await adminFetch(`/api/admin/bundles/${id}`, { method: "DELETE" });
    await load();
  }

  function startEditingItems(bundle: Bundle) {
    setEditingItemsFor(bundle.id);
    setPickedItems(new Map(bundle.items.map((i) => [i.product.id, i.quantity])));
  }

  async function saveItems(id: string) {
    const items = Array.from(pickedItems.entries()).map(([productId, quantity]) => ({ productId, quantity }));
    await adminFetch(`/api/admin/bundles/${id}/items`, { method: "PUT", body: JSON.stringify({ items }) });
    setEditingItemsFor(null);
    await load();
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">الحزم (Bundles / Duos)</h1>

      <form onSubmit={handleCreate} className="mb-6 flex flex-wrap items-end gap-2 rounded-xl border border-neutral-200 p-4">
        <div>
          <label className="mb-1 block text-xs font-bold text-neutral-500">الاسم</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold text-neutral-500">Slug</label>
          <input
            required
            dir="ltr"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold text-neutral-500">سعر الحزمة</label>
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={form.bundlePrice}
            onChange={(e) => setForm((f) => ({ ...f, bundlePrice: e.target.value }))}
            className="w-32 rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-kayaan-brown px-5 py-2 text-sm font-bold text-white disabled:opacity-60"
        >
          {submitting ? "جاري الإنشاء..." : "إنشاء حزمة"}
        </button>
        {error && <p className="w-full text-xs text-red-600">{error}</p>}
      </form>

      {loading ? (
        <p className="text-sm text-neutral-400">...جاري التحميل</p>
      ) : bundles.length === 0 ? (
        <p className="text-sm text-neutral-400">لا توجد حزم بعد.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {bundles.map((b) => (
            <div key={b.id} className="rounded-xl border border-neutral-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">{b.name}</p>
                  <p className="text-xs text-neutral-500">
                    {b.bundlePrice} د.ج — {b.items.length} منتج
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleVisible(b.id, !b.visible)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                      b.visible ? "bg-green-100 text-green-700" : "bg-neutral-200 text-neutral-500"
                    }`}
                  >
                    {b.visible ? "ظاهرة" : "مخفية"}
                  </button>
                  <button onClick={() => startEditingItems(b)} className="text-xs font-bold text-kayaan-brownDark">
                    إدارة المنتجات
                  </button>
                  <button onClick={() => remove(b.id)} className="text-xs font-bold text-red-600">
                    حذف
                  </button>
                </div>
              </div>

              {editingItemsFor === b.id && (
                <div className="mt-3 border-t border-neutral-100 pt-3">
                  <div className="flex max-h-52 flex-col gap-1.5 overflow-y-auto">
                    {products.map((p) => {
                      const checked = pickedItems.has(p.id);
                      return (
                        <div key={p.id} className="flex items-center gap-2 text-xs">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              const next = new Map(pickedItems);
                              if (e.target.checked) next.set(p.id, 1);
                              else next.delete(p.id);
                              setPickedItems(next);
                            }}
                          />
                          <span className="flex-1">{p.name}</span>
                          {checked && (
                            <input
                              type="number"
                              min="1"
                              value={pickedItems.get(p.id)}
                              onChange={(e) => {
                                const next = new Map(pickedItems);
                                next.set(p.id, Number(e.target.value) || 1);
                                setPickedItems(next);
                              }}
                              className="w-14 rounded border border-neutral-200 px-1.5 py-0.5"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => saveItems(b.id)}
                      className="rounded-full bg-kayaan-brown px-4 py-1.5 text-xs font-bold text-white"
                    >
                      حفظ
                    </button>
                    <button
                      onClick={() => setEditingItemsFor(null)}
                      className="rounded-full bg-neutral-100 px-4 py-1.5 text-xs font-bold text-neutral-500"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
