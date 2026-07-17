"use client";

import { useState } from "react";

type Review = { id: string; customerName: string; rating: number; comment: string | null; createdAt: Date | string };

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div dir="ltr" className="flex gap-1 text-2xl">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`${n} stars`}
          className={n <= value ? "text-amber-500" : "text-neutral-300"}
        >
          ★
        </button>
      ))}
    </div>
  );
}

/** "Write a review" form (§7 item 14). New reviews land pending — admin approves in /admin/reviews before they show here. */
function ReviewForm({ slug }: { slug: string }) {
  const [customerName, setCustomerName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError("الرجاء اختيار تقييم بالنجوم.");
      return;
    }
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch(`/api/products/${slug}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName, rating, comment, website }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "حدث خطأ، حاول مجدداً.");
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setError("حدث خطأ، حاول مجدداً.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-xl border border-dashed border-neutral-300 p-4 text-center text-sm">
        <p className="font-bold text-green-700">شكراً لك على تقييمك! 🎉</p>
        <p className="mt-1 text-xs text-neutral-500">سيظهر تقييمك بعد مراجعته من طرف فريقنا.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-neutral-200 p-4">
      <p className="mb-3 text-sm font-bold">شاركنا رأيك في هذا المنتج</p>

      <div className="mb-3">
        <label className="mb-1 block text-xs font-bold text-neutral-500">التقييم</label>
        <StarPicker value={rating} onChange={setRating} />
      </div>

      <div className="mb-3">
        <label className="mb-1 block text-xs font-bold text-neutral-500">الاسم</label>
        <input
          required
          maxLength={80}
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
        />
      </div>

      <div className="mb-3">
        <label className="mb-1 block text-xs font-bold text-neutral-500">تعليق (اختياري)</label>
        <textarea
          maxLength={1000}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
        />
      </div>

      {/* Honeypot — hidden from real users, not `type="hidden"` since some bots skip those */}
      <input
        type="text"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="absolute h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      {error && <p className="mb-3 text-xs text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full bg-kayaan-brown px-5 py-2 text-sm font-bold text-white disabled:opacity-60"
      >
        {status === "loading" ? "جاري الإرسال..." : "إرسال التقييم"}
      </button>
    </form>
  );
}

/** Client feedback shown under each product (§7 item 14). Only admin-approved reviews are listed here (§14). */
export function ProductReviews({ reviews, slug }: { reviews: Review[]; slug: string }) {
  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="mb-5 text-xl font-bold text-kayaan-ink">تقييمات العملاء</h2>

        {reviews.length > 0 && (
          <div className="mb-4 flex flex-col gap-3">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-[1.25rem] bg-kayaan-bg p-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-bold text-kayaan-ink">{r.customerName}</p>
                  <p className="text-sm">{"⭐".repeat(r.rating)}</p>
                </div>
                {r.comment && <p className="text-sm leading-7 text-neutral-600">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}

        <ReviewForm slug={slug} />
      </div>
    </section>
  );
}
