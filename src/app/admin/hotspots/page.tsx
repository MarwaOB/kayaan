"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminClient";

type ProductImage = { id: string; url: string; isLifestyle: boolean };
type Product = { id: string; name: string; images: ProductImage[] };
type Hotspot = { id: string; xPercent: number; yPercent: number; linkedProduct: { id: string; name: string } };

export default function AdminHotspotsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedImageId, setSelectedImageId] = useState("");
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({ xPercent: "50", yPercent: "50", linkedProductId: "" });

  useEffect(() => {
    adminFetch("/api/admin/products")
      .then((r) => r.json())
      .then((data) => setProducts(data.products ?? []))
      .finally(() => setLoading(false));
  }, []);

  async function loadHotspots(imageId: string) {
    const res = await adminFetch(`/api/admin/hotspots?imageId=${imageId}`);
    const data = await res.json();
    setHotspots(data.hotspots ?? []);
  }

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const selectedImage = selectedProduct?.images.find((i) => i.id === selectedImageId);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!selectedImageId || !form.linkedProductId) {
      setError("اختر صورة ومنتجاً مرتبطاً");
      return;
    }
    const res = await adminFetch("/api/admin/hotspots", {
      method: "POST",
      body: JSON.stringify({
        imageId: selectedImageId,
        xPercent: Number(form.xPercent),
        yPercent: Number(form.yPercent),
        linkedProductId: form.linkedProductId,
      }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "فشل إضافة النقطة");
      return;
    }
    await loadHotspots(selectedImageId);
  }

  async function remove(id: string) {
    await adminFetch(`/api/admin/hotspots/${id}`, { method: "DELETE" });
    await loadHotspots(selectedImageId);
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">النقاط التفاعلية (Hotspots)</h1>

      {loading ? (
        <p className="text-sm text-neutral-400">...جاري التحميل</p>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <select
              value={selectedProductId}
              onChange={(e) => {
                setSelectedProductId(e.target.value);
                setSelectedImageId("");
                setHotspots([]);
              }}
              className="rounded-lg border border-neutral-200 px-3 py-2 text-sm"
            >
              <option value="">اختر منتجاً</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            {selectedProduct && (
              <select
                value={selectedImageId}
                onChange={(e) => {
                  setSelectedImageId(e.target.value);
                  if (e.target.value) loadHotspots(e.target.value);
                  else setHotspots([]);
                }}
                className="rounded-lg border border-neutral-200 px-3 py-2 text-sm"
              >
                <option value="">اختر صورة</option>
                {selectedProduct.images.map((img, i) => (
                  <option key={img.id} value={img.id}>
                    صورة {i + 1} {img.isLifestyle ? "" : "(غير مخصصة للنقاط التفاعلية)"}
                  </option>
                ))}
              </select>
            )}
          </div>

          {selectedImage && (
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-neutral-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selectedImage.url} alt="" className="w-full" />
                {hotspots.map((h) => (
                  <div
                    key={h.id}
                    title={h.linkedProduct.name}
                    className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-kayaan-brown shadow"
                    style={{ left: `${h.xPercent}%`, top: `${h.yPercent}%` }}
                  />
                ))}
                <div
                  className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-amber-500 opacity-70 shadow"
                  style={{ left: `${form.xPercent}%`, top: `${form.yPercent}%` }}
                  title="موقع النقطة الجديدة (معاينة)"
                />
              </div>

              <div className="flex-1">
                <form onSubmit={handleAdd} className="flex flex-col gap-2 rounded-xl border border-neutral-200 p-4">
                  <p className="text-xs font-bold text-neutral-500">إضافة نقطة جديدة</p>
                  <div className="flex gap-2">
                    <div>
                      <label className="mb-1 block text-xs text-neutral-500">X %</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={form.xPercent}
                        onChange={(e) => setForm((f) => ({ ...f, xPercent: e.target.value }))}
                        className="w-20 rounded-lg border border-neutral-200 px-2 py-1.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-neutral-500">Y %</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={form.yPercent}
                        onChange={(e) => setForm((f) => ({ ...f, yPercent: e.target.value }))}
                        className="w-20 rounded-lg border border-neutral-200 px-2 py-1.5 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-neutral-500">المنتج المرتبط</label>
                    <select
                      value={form.linkedProductId}
                      onChange={(e) => setForm((f) => ({ ...f, linkedProductId: e.target.value }))}
                      className="w-full rounded-lg border border-neutral-200 px-2 py-1.5 text-sm"
                    >
                      <option value="">اختر منتجاً</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="mt-1 rounded-full bg-kayaan-brown py-2 text-xs font-bold text-white">
                    إضافة النقطة
                  </button>
                  {error && <p className="text-xs text-red-600">{error}</p>}
                </form>

                <div className="mt-3 flex flex-col gap-1.5">
                  {hotspots.map((h) => (
                    <div key={h.id} className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2 text-xs">
                      <span>
                        {h.linkedProduct.name} — ({h.xPercent}%, {h.yPercent}%)
                      </span>
                      <button onClick={() => remove(h.id)} className="font-bold text-red-600">
                        حذف
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
