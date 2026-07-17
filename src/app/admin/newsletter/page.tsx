"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminClient";

type Subscriber = {
  id: string;
  contact: string;
  active: boolean;
  subscribedAt: string;
};

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [contact, setContact] = useState("");

  async function load() {
    setLoading(true);
    const res = await adminFetch("/api/admin/newsletter");
    const data = await res.json();
    setSubscribers(data.subscribers ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await adminFetch("/api/admin/newsletter", {
        method: "POST",
        body: JSON.stringify({ contact }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "فشلت الإضافة");
        return;
      }
      setContact("");
      await load();
    } finally {
      setSubmitting(false);
    }
  }

  async function toggle(id: string, active: boolean) {
    await adminFetch(`/api/admin/newsletter/${id}`, { method: "PATCH", body: JSON.stringify({ active }) });
    await load();
  }

  async function remove(id: string) {
    await adminFetch(`/api/admin/newsletter/${id}`, { method: "DELETE" });
    await load();
  }

  const activeCount = subscribers.filter((s) => s.active).length;

  return (
    <div>
      <h1 className="mb-1 text-xl font-bold">النشرة البريدية</h1>
      <p className="mb-4 text-xs text-neutral-400">
        {subscribers.length} مشترك — {activeCount} نشط. لا يوجد حالياً نموذج اشتراك في المتجر (لم يُطلب في المواصفات
        بعد)، الإضافة هنا يدوية للأرقام/الإيميلات التي يجمعها المتجر عبر واتساب أو إنستغرام.
      </p>

      <form onSubmit={handleAdd} className="mb-6 flex flex-wrap items-end gap-2 rounded-xl border border-neutral-200 p-4">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-bold text-neutral-500">البريد الإلكتروني أو رقم الهاتف</label>
          <input
            required
            dir="ltr"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
            placeholder="example@mail.com أو 0555000000"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-kayaan-brown px-5 py-2 text-sm font-bold text-white disabled:opacity-60"
        >
          {submitting ? "جاري الإضافة..." : "إضافة مشترك"}
        </button>
        {error && <p className="w-full text-xs text-red-600">{error}</p>}
      </form>

      {loading ? (
        <p className="text-sm text-neutral-400">...جاري التحميل</p>
      ) : subscribers.length === 0 ? (
        <p className="text-sm text-neutral-400">لا يوجد مشتركون بعد.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {subscribers.map((s) => (
            <div key={s.id} className="flex items-center justify-between rounded-xl border border-neutral-200 p-4">
              <div>
                <p dir="ltr" className="font-bold">
                  {s.contact}
                </p>
                <p className="text-xs text-neutral-500">
                  مشترك منذ {new Date(s.subscribedAt).toLocaleDateString("ar-DZ")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggle(s.id, !s.active)}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                    s.active ? "bg-green-100 text-green-700" : "bg-neutral-200 text-neutral-500"
                  }`}
                >
                  {s.active ? "نشط" : "معطل"}
                </button>
                <button onClick={() => remove(s.id)} className="text-xs font-bold text-red-600">
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
