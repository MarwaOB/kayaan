"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminClient";

type BlockedEntry = { id: string; phone: string; reason: string | null; blockedAt: string };

function BlocklistPanel({
  title,
  description,
  listPath,
  addPath,
}: {
  title: string;
  description: string;
  listPath: string;
  addPath: string;
}) {
  const [entries, setEntries] = useState<BlockedEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await adminFetch(listPath);
      const data = await res.json();
      setEntries(data.numbers ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await adminFetch(addPath, {
        method: "POST",
        body: JSON.stringify({ phone: phone.trim(), reason: reason.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "فشل الإضافة");
        return;
      }
      setPhone("");
      setReason("");
      await load();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemove(id: string) {
    await adminFetch(`${listPath}/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="flex-1 rounded-xl border border-neutral-200 p-4">
      <h2 className="font-bold">{title}</h2>
      <p className="mb-3 text-xs text-neutral-500">{description}</p>

      <form onSubmit={handleAdd} className="mb-4 flex flex-col gap-2">
        <input
          required
          placeholder="رقم الهاتف"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          dir="ltr"
          className="rounded-lg border border-neutral-200 px-3 py-2 text-sm"
        />
        <input
          placeholder="السبب (اختياري)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="rounded-lg border border-neutral-200 px-3 py-2 text-sm"
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-kayaan-brown py-2 text-xs font-bold text-white disabled:opacity-60"
        >
          {submitting ? "جاري الإضافة..." : "حظر الرقم"}
        </button>
      </form>

      {loading ? (
        <p className="text-xs text-neutral-400">...جاري التحميل</p>
      ) : entries.length === 0 ? (
        <p className="text-xs text-neutral-400">لا توجد أرقام محظورة.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {entries.map((e) => (
            <li key={e.id} className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2 text-sm">
              <div>
                <p dir="ltr" className="font-bold">
                  {e.phone}
                </p>
                {e.reason && <p className="text-xs text-neutral-500">{e.reason}</p>}
              </div>
              <button onClick={() => handleRemove(e.id)} className="text-xs font-bold text-red-600">
                إلغاء الحظر
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function AdminBlockedNumbersPage() {
  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">الأرقام المحظورة</h1>
      <div className="flex flex-col gap-4 md:flex-row">
        <BlocklistPanel
          title="محظورة من الطلب"
          description="هذه الأرقام لا يمكنها إنشاء طلب جديد على الإطلاق."
          listPath="/api/admin/blocked-numbers"
          addPath="/api/admin/blocked-numbers"
        />
      </div>
    </div>
  );
}
