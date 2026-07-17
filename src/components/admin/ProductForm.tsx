"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/adminClient";

type Category = { id: string; name: string; nameAr: string };

type Variant = { id?: string; color: string; size: string; sku: string; stock: number };

export type ProductFormValues = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  careInstructions: string;
  salePrice: string;
  discountPrice: string;
  costPrice: string;
  rawPrice: string;
  sponsorSpend: string;
  profit: string;
  trending: boolean;
  metaDescription: string;
  categoryId: string;
  variants: Variant[];
  images: string[];
};

const EMPTY: ProductFormValues = {
  name: "",
  slug: "",
  description: "",
  careInstructions: "",
  salePrice: "",
  discountPrice: "",
  costPrice: "",
  rawPrice: "",
  sponsorSpend: "",
  profit: "",
  trending: false,
  metaDescription: "",
  categoryId: "",
  variants: [],
  images: [],
};

export default function ProductForm({ initial }: { initial?: ProductFormValues }) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormValues>(initial ?? EMPTY);
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const isEdit = Boolean(initial?.id);

  useEffect(() => {
    adminFetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories ?? []));
  }, []);

  function update<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function updateVariant(index: number, patch: Partial<Variant>) {
    setForm((f) => ({
      ...f,
      variants: f.variants.map((v, i) => (i === index ? { ...v, ...patch } : v)),
    }));
  }

  function addVariant() {
    setForm((f) => ({ ...f, variants: [...f.variants, { color: "", size: "", sku: "", stock: 0 }] }));
  }

  function removeVariant(index: number) {
    setForm((f) => ({ ...f, variants: f.variants.filter((_, i) => i !== index) }));
  }

  function toNumberOrNull(v: string): number | null {
    return v.trim() === "" ? null : Number(v);
  }

  async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await adminFetch("/api/admin/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "فشل رفع الصورة");
    return data.url as string;
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploadingImages(true);
    setError(null);
    try {
      const urls = [] as string[];
      for (const file of files) {
        const url = await uploadImage(file);
        urls.push(url);
      }
      setForm((f) => ({ ...f, images: [...f.images, ...urls] }));
    } catch (err: any) {
      setError(err.message || "فشل رفع الصورة");
    } finally {
      setUploadingImages(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      careInstructions: form.careInstructions || null,
      salePrice: Number(form.salePrice),
      discountPrice: toNumberOrNull(form.discountPrice),
      costPrice: toNumberOrNull(form.costPrice),
      rawPrice: toNumberOrNull(form.rawPrice),
      sponsorSpend: toNumberOrNull(form.sponsorSpend),
      profit: toNumberOrNull(form.profit),
      trending: form.trending,
      metaDescription: form.metaDescription || null,
      categoryId: form.categoryId,
      variants: form.variants.map((v) => ({ ...v, stock: Number(v.stock) })),
      images: form.images,
    };

    try {
      const res = isEdit
        ? await adminFetch(`/api/admin/products/${initial!.id}`, { method: "PATCH", body: JSON.stringify(payload) })
        : await adminFetch("/api/admin/products", { method: "POST", body: JSON.stringify(payload) });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "فشل الحفظ");
        return;
      }
      router.push("/admin/products");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!initial?.id) return;
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    await adminFetch(`/api/admin/products/${initial.id}`, { method: "DELETE" });
    router.push("/admin/products");
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <input
          required
          placeholder="اسم المنتج"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          className="col-span-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm sm:col-span-1"
        />
        <input
          required
          placeholder="slug (رابط الصفحة)"
          value={form.slug}
          onChange={(e) => update("slug", e.target.value)}
          dir="ltr"
          className="col-span-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm sm:col-span-1"
        />
      </div>

      <textarea
        required
        placeholder="الوصف"
        rows={3}
        value={form.description}
        onChange={(e) => update("description", e.target.value)}
        className="rounded-lg border border-neutral-200 px-3 py-2 text-sm"
      />

      <textarea
        placeholder="تعليمات العناية (اختياري)"
        rows={2}
        value={form.careInstructions}
        onChange={(e) => update("careInstructions", e.target.value)}
        className="rounded-lg border border-neutral-200 px-3 py-2 text-sm"
      />

      <fieldset className="rounded-xl border border-neutral-200 p-3">
        <legend className="px-1 text-xs font-bold text-neutral-500">صور المنتج</legend>
        <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
        {uploadingImages && <p className="mt-2 text-xs text-neutral-500">جاري رفع الصور...</p>}
        {form.images.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {form.images.map((url, index) => (
              <div key={`${url}-${index}`} className="flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs">
                <span className="max-w-[180px] truncate" dir="ltr">{url}</span>
                <button type="button" onClick={() => setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }))} className="font-bold text-red-600">
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </fieldset>

      <select
        required
        value={form.categoryId}
        onChange={(e) => update("categoryId", e.target.value)}
        className="rounded-lg border border-neutral-200 px-3 py-2 text-sm"
      >
        <option value="" disabled>
          اختر القسم
        </option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.trending} onChange={(e) => update("trending", e.target.checked)} />
        الأكثر مبيعاً (🔥 trending)
      </label>

      <fieldset className="rounded-xl border border-neutral-200 p-3">
        <legend className="px-1 text-xs font-bold text-neutral-500">التسعير — للعميل</legend>
        <div className="grid grid-cols-2 gap-3">
          <input
            required
            type="number"
            step="0.01"
            placeholder="السعر الحالي"
            value={form.salePrice}
            onChange={(e) => update("salePrice", e.target.value)}
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          />
          <input
            type="number"
            step="0.01"
            placeholder="سعر الخصم (اختياري)"
            value={form.discountPrice}
            onChange={(e) => update("discountPrice", e.target.value)}
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          />
        </div>
      </fieldset>

      <fieldset className="rounded-xl border border-amber-200 bg-amber-50 p-3">
        <legend className="px-1 text-xs font-bold text-amber-700">
          حقول خاصة بالمالك — لا تظهر أبداً للعميل (§3)
        </legend>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            step="0.01"
            placeholder="التكلفة"
            value={form.costPrice}
            onChange={(e) => update("costPrice", e.target.value)}
            className="rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm"
          />
          <input
            type="number"
            step="0.01"
            placeholder="منتج خام"
            value={form.rawPrice}
            onChange={(e) => update("rawPrice", e.target.value)}
            className="rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm"
          />
          <input
            type="number"
            step="0.01"
            placeholder="السبونسور"
            value={form.sponsorSpend}
            onChange={(e) => update("sponsorSpend", e.target.value)}
            className="rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm"
          />
          <input
            type="number"
            step="0.01"
            placeholder="الفائدة"
            value={form.profit}
            onChange={(e) => update("profit", e.target.value)}
            className="rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm"
          />
        </div>
      </fieldset>

      <fieldset className="rounded-xl border border-neutral-200 p-3">
        <legend className="px-1 text-xs font-bold text-neutral-500">المقاسات والألوان (Variants)</legend>
        <div className="flex flex-col gap-2">
          {form.variants.map((v, i) => (
            <div key={i} className="grid grid-cols-5 items-center gap-2">
              <input
                placeholder="اللون"
                value={v.color}
                onChange={(e) => updateVariant(i, { color: e.target.value })}
                className="rounded-lg border border-neutral-200 px-2 py-1.5 text-sm"
              />
              <input
                placeholder="المقاس"
                value={v.size}
                onChange={(e) => updateVariant(i, { size: e.target.value })}
                className="rounded-lg border border-neutral-200 px-2 py-1.5 text-sm"
              />
              <input
                placeholder="SKU"
                value={v.sku}
                onChange={(e) => updateVariant(i, { sku: e.target.value })}
                dir="ltr"
                className="rounded-lg border border-neutral-200 px-2 py-1.5 text-sm"
              />
              <input
                type="number"
                placeholder="المخزون"
                value={v.stock}
                onChange={(e) => updateVariant(i, { stock: Number(e.target.value) })}
                className="rounded-lg border border-neutral-200 px-2 py-1.5 text-sm"
              />
              <button type="button" onClick={() => removeVariant(i)} className="text-xs font-bold text-red-600">
                حذف
              </button>
            </div>
          ))}
          <button type="button" onClick={addVariant} className="self-start text-xs font-bold text-kayaan-brown">
            + إضافة لون/مقاس
          </button>
        </div>
      </fieldset>

      <input
        placeholder="Meta description (SEO — لا تظهر في الصفحة)"
        value={form.metaDescription}
        onChange={(e) => update("metaDescription", e.target.value)}
        className="rounded-lg border border-neutral-200 px-3 py-2 text-sm"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-kayaan-brown px-6 py-2.5 text-sm font-bold text-white disabled:opacity-60"
        >
          {submitting ? "جاري الحفظ..." : isEdit ? "حفظ التعديلات" : "إنشاء المنتج"}
        </button>
        {isEdit && (
          <button type="button" onClick={handleDelete} className="text-sm font-bold text-red-600">
            حذف المنتج
          </button>
        )}
      </div>
    </form>
  );
}
