"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminClient";

type Coupon = {
  id: string;
  code: string;
  discountType: "PERCENT" | "FIXED";
  discountValue: number;
  active: boolean;
  expiresAt: string | null;
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    code: "",
    discountType: "PERCENT" as "PERCENT" | "FIXED",
    discountValue: "",
    expiresAt: "",
  });

  async function load() {
    setLoading(true);
    const res = await adminFetch("/api/admin/coupons");
    const data = await res.json();
    setCoupons(data.coupons ?? []);
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
      const res = await adminFetch("/api/admin/coupons", {
        method: "POST",
        body: JSON.stringify({
          code: form.code,
          discountType: form.discountType,
          discountValue: Number(form.discountValue),
          expiresAt: form.expiresAt || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "فشل إنشاء الكوبون");
        return;
      }
      setForm({ code: "", discountType: "PERCENT", discountValue: "", expiresAt: "" });
      await load();
    } finally {
      setSubmitting(false);
    }
  }

  async function toggle(id: string, active: boolean) {
    await adminFetch(`/api/admin/coupons/${id}`, { method: "PATCH", body: JSON.stringify({ active }) });
    await load();
  }

  async function remove(id: string) {
    await adminFetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">كوبونات الخصم</h1>

      <form onSubmit={handleCreate} className="mb-6 flex flex-wrap items-end gap-2 rounded-xl border border-neutral-200 p-4">
        <div>
          <label className="mb-1 block text-xs font-bold text-neutral-500">الكود</label>
          <input
            required
            dir="ltr"
            value={form.code}
            onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold text-neutral-500">نوع الخصم</label>
          <select
            value={form.discountType}
            onChange={(e) => setForm((f) => ({ ...f, discountType: e.target.value as "PERCENT" | "FIXED" }))}
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          >
            <option value="PERCENT">نسبة %</option>
            <option value="FIXED">مبلغ ثابت</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold text-neutral-500">القيمة</label>
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={form.discountValue}
            onChange={(e) => setForm((f) => ({ ...f, discountValue: e.target.value }))}
            className="w-28 rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold text-neutral-500">تاريخ الانتهاء (اختياري)</label>
          <input
            type="date"
            value={form.expiresAt}
            onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-kayaan-brown px-5 py-2 text-sm font-bold text-white disabled:opacity-60"
        >
          {submitting ? "جاري الإنشاء..." : "إنشاء كوبون"}
        </button>
        {error && <p className="w-full text-xs text-red-600">{error}</p>}
      </form>

      {loading ? (
        <p className="text-sm text-neutral-400">...جاري التحميل</p>
      ) : coupons.length === 0 ? (
        <p className="text-sm text-neutral-400">لا توجد كوبونات بعد.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {coupons.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-xl border border-neutral-200 p-4">
              <div>
                <p dir="ltr" className="font-bold">
                  {c.code}
                </p>
                <p className="text-xs text-neutral-500">
                  {c.discountType === "PERCENT" ? `${c.discountValue}%` : `${c.discountValue} د.ج`}
                  {c.expiresAt && ` — ينتهي في ${new Date(c.expiresAt).toLocaleDateString("ar-DZ")}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggle(c.id, !c.active)}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                    c.active ? "bg-green-100 text-green-700" : "bg-neutral-200 text-neutral-500"
                  }`}
                >
                  {c.active ? "فعال" : "معطل"}
                </button>
                <button onClick={() => remove(c.id)} className="text-xs font-bold text-red-600">
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
