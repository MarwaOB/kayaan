"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminClient";

type Review = {
  id: string;
  customerName: string;
  rating: number;
  comment: string | null;
  approved: boolean;
  createdAt: string;
  product: { id: string; name: string; slug: string };
};

const TABS: { key: "all" | "pending" | "approved"; label: string }[] = [
  { key: "pending", label: "بانتظار المراجعة" },
  { key: "approved", label: "معتمدة" },
  { key: "all", label: "الكل" },
];

function Stars({ rating }: { rating: number }) {
  return (
    <span dir="ltr" className="text-amber-500">
      {"★".repeat(rating)}
      <span className="text-neutral-300">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

export default function AdminReviewsPage() {
  const [tab, setTab] = useState<"all" | "pending" | "approved">("pending");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  async function load(currentTab: typeof tab) {
    setLoading(true);
    const res = await adminFetch(`/api/admin/reviews?filter=${currentTab}`);
    const data = await res.json();
    setReviews(data.reviews ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  async function setApproved(id: string, approved: boolean) {
    await adminFetch(`/api/admin/reviews/${id}`, { method: "PATCH", body: JSON.stringify({ approved }) });
    await load(tab);
  }

  async function remove(id: string) {
    await adminFetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    await load(tab);
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">التقييمات</h1>

      <div className="mb-6 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-bold ${
              tab === t.key ? "bg-kayaan-brown text-white" : "bg-neutral-100 text-neutral-600"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-neutral-400">...جاري التحميل</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-neutral-400">لا توجد تقييمات هنا.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-xl border border-neutral-200 p-4">
              <div className="mb-1 flex items-center justify-between">
                <div>
                  <span className="font-bold">{r.customerName}</span>{" "}
                  <span className="text-xs text-neutral-400">
                    — {new Date(r.createdAt).toLocaleDateString("ar-DZ")}
                  </span>
                </div>
                <Stars rating={r.rating} />
              </div>
              <p className="mb-2 text-xs text-neutral-500">
                على المنتج:{" "}
                <a href={`/products/${r.product.slug}`} target="_blank" rel="noopener noreferrer" className="underline">
                  {r.product.name}
                </a>
              </p>
              {r.comment && <p className="mb-3 text-sm text-neutral-700">{r.comment}</p>}
              <div className="flex items-center gap-2">
                {r.approved ? (
                  <button
                    onClick={() => setApproved(r.id, false)}
                    className="rounded-full bg-neutral-200 px-3 py-1.5 text-xs font-bold text-neutral-600"
                  >
                    إلغاء الاعتماد
                  </button>
                ) : (
                  <button
                    onClick={() => setApproved(r.id, true)}
                    className="rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold text-green-700"
                  >
                    اعتماد ونشر
                  </button>
                )}
                <button onClick={() => remove(r.id)} className="text-xs font-bold text-red-600">
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
