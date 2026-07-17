"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminClient";

type Product = { id: string; name: string };
type Collection = {
  id: string;
  name: string;
  nameAr: string | null;
  slug: string;
  description: string | null;
  visible: boolean;
  products: { product: Product }[];
};

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [editingProductsFor, setEditingProductsFor] = useState<string | null>(null);
  const [pickedProductIds, setPickedProductIds] = useState<Set<string>>(new Set());

  const [form, setForm] = useState({ name: "", nameAr: "", slug: "", description: "" });

  async function load() {
    setLoading(true);
    const [collectionsRes, productsRes] = await Promise.all([
      adminFetch("/api/admin/collections"),
      adminFetch("/api/admin/products"),
    ]);
    const collectionsData = await collectionsRes.json();
    const productsData = await productsRes.json();
    setCollections(collectionsData.collections ?? []);
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
      const res = await adminFetch("/api/admin/collections", { method: "POST", body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "فشل إنشاء التشكيلة");
        return;
      }
      setForm({ name: "", nameAr: "", slug: "", description: "" });
      await load();
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleVisible(id: string, visible: boolean) {
    await adminFetch(`/api/admin/collections/${id}`, { method: "PATCH", body: JSON.stringify({ visible }) });
    await load();
  }

  async function remove(id: string) {
    await adminFetch(`/api/admin/collections/${id}`, { method: "DELETE" });
    await load();
  }

  function startEditingProducts(collection: Collection) {
    setEditingProductsFor(collection.id);
    setPickedProductIds(new Set(collection.products.map((cp) => cp.product.id)));
  }

  async function saveProducts(id: string) {
    await adminFetch(`/api/admin/collections/${id}/products`, {
      method: "PUT",
      body: JSON.stringify({ productIds: Array.from(pickedProductIds) }),
    });
    setEditingProductsFor(null);
    await load();
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">التشكيلات (Collections)</h1>

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
          <label className="mb-1 block text-xs font-bold text-neutral-500">الاسم بالعربية (اختياري)</label>
          <input
            value={form.nameAr}
            onChange={(e) => setForm((f) => ({ ...f, nameAr: e.target.value }))}
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
        <div className="w-full">
          <label className="mb-1 block text-xs font-bold text-neutral-500">الوصف (اختياري)</label>
          <input
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-kayaan-brown px-5 py-2 text-sm font-bold text-white disabled:opacity-60"
        >
          {submitting ? "جاري الإنشاء..." : "إنشاء تشكيلة"}
        </button>
        {error && <p className="w-full text-xs text-red-600">{error}</p>}
      </form>

      {loading ? (
        <p className="text-sm text-neutral-400">...جاري التحميل</p>
      ) : collections.length === 0 ? (
        <p className="text-sm text-neutral-400">لا توجد تشكيلات بعد.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {collections.map((c) => (
            <div key={c.id} className="rounded-xl border border-neutral-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">{c.name}</p>
                  <p className="text-xs text-neutral-500">
                    /collections/{c.slug} — {c.products.length} منتج
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleVisible(c.id, !c.visible)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                      c.visible ? "bg-green-100 text-green-700" : "bg-neutral-200 text-neutral-500"
                    }`}
                  >
                    {c.visible ? "ظاهرة" : "مخفية"}
                  </button>
                  <button
                    onClick={() => startEditingProducts(c)}
                    className="text-xs font-bold text-kayaan-brownDark"
                  >
                    إدارة المنتجات
                  </button>
                  <button onClick={() => remove(c.id)} className="text-xs font-bold text-red-600">
                    حذف
                  </button>
                </div>
              </div>

              {editingProductsFor === c.id && (
                <div className="mt-3 border-t border-neutral-100 pt-3">
                  <div className="grid max-h-52 grid-cols-2 gap-1 overflow-y-auto sm:grid-cols-3">
                    {products.map((p) => (
                      <label key={p.id} className="flex items-center gap-1.5 text-xs">
                        <input
                          type="checkbox"
                          checked={pickedProductIds.has(p.id)}
                          onChange={(e) => {
                            const next = new Set(pickedProductIds);
                            if (e.target.checked) next.add(p.id);
                            else next.delete(p.id);
                            setPickedProductIds(next);
                          }}
                        />
                        {p.name}
                      </label>
                    ))}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => saveProducts(c.id)}
                      className="rounded-full bg-kayaan-brown px-4 py-1.5 text-xs font-bold text-white"
                    >
                      حفظ
                    </button>
                    <button
                      onClick={() => setEditingProductsFor(null)}
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
