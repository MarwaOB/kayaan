"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { IconStar } from "@/components/ui/Icon";

type Review = {
  id: string;
  customerName: string;
  rating: number;
  comment: string | null;
  createdAt: Date | string;
};

/** Read-only rating display. Drawn icons, announced once, not five ⭐ emoji. */
function Rating({ value, className = "h-4 w-4" }: { value: number; className?: string }) {
  const clamped = Math.min(Math.max(Math.round(value), 0), 5);
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${clamped} من 5 نجوم`}>
      {Array.from({ length: 5 }, (_, i) => (
        <IconStar
          key={i}
          filled={i < clamped}
          className={`${className} ${i < clamped ? "text-brand-300" : "text-line-strong"}`}
        />
      ))}
    </div>
  );
}

/** Interactive picker for the form. */
function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  const shown = hovered || value;

  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHovered(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          aria-label={`${n} من 5 نجوم`}
          aria-pressed={value === n}
          className="rounded-xs p-0.5 transition-transform duration-fast ease-k hover:scale-110"
        >
          <IconStar
            filled={n <= shown}
            className={`h-7 w-7 ${n <= shown ? "text-brand-300" : "text-line-strong"}`}
          />
        </button>
      ))}
    </div>
  );
}

/**
 * "Write a review" (spec §7 item 14). New reviews land pending; the admin
 * approves them in /admin/reviews before they appear here.
 */
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
      <div className="rounded-md bg-surface-sunken p-6">
        <p className="text-body font-semibold text-ink">
          شكراً لك على تقييمك{" "}
          <span className="emoji" role="img" aria-label="قلب بني">
            🤎
          </span>
        </p>
        <p className="mt-1.5 text-body-sm text-ink-muted">سيظهر تقييمك بعد مراجعته من طرف فريقنا.</p>
      </div>
    );
  }

  const field =
    "h-11 w-full rounded-sm border border-line-strong bg-surface px-4 text-[16px] text-ink placeholder:text-ink-subtle";

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-md bg-surface-sunken p-5 sm:p-6">
      <h3 className="text-body font-semibold text-ink">شاركنا رأيك في هذا المنتج</h3>

      <div className="mt-5">
        <span className="block text-caption text-ink-muted">التقييم</span>
        <div className="mt-2">
          <StarPicker value={rating} onChange={setRating} />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="review-name" className="block text-caption text-ink-muted">
          الاسم
        </label>
        <input
          id="review-name"
          required
          maxLength={80}
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className={`mt-2 ${field}`}
        />
      </div>

      <div className="mt-5">
        <label htmlFor="review-comment" className="block text-caption text-ink-muted">
          تعليق (اختياري)
        </label>
        <textarea
          id="review-comment"
          maxLength={1000}
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mt-2 w-full rounded-sm border border-line-strong bg-surface px-4 py-3 text-[16px] text-ink placeholder:text-ink-subtle"
        />
      </div>

      {/* Honeypot — CSS-hidden rather than type="hidden", which some bots skip. */}
      <input
        type="text"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="pointer-events-none absolute h-0 w-0 opacity-0"
      />

      {error && (
        <p role="alert" className="mt-4 text-body-sm text-danger">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-6 h-11 rounded-sm bg-brand-700 px-7 text-body-sm font-semibold text-white transition duration-fast ease-k hover:bg-brand-800 disabled:opacity-60"
      >
        {status === "loading" ? "جاري الإرسال…" : "إرسال التقييم"}
      </button>
    </form>
  );
}

/**
 * Client feedback under each product (spec §7 item 14, brief R9). Only
 * admin-approved reviews reach this component (§14).
 *
 * Leads with the aggregate — average, count, and a distribution bar — because
 * "4.6 from 23 reviews" is the number a customer actually shops on, and the
 * old version showed neither.
 */
export function ProductReviews({ reviews, slug }: { reviews: Review[]; slug: string }) {
  const count = reviews.length;
  const average = count > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    n: reviews.filter((r) => Math.round(r.rating) === star).length,
  }));

  return (
    <section className="section-k">
      <div className="container-k-wide">
        <SectionHeader index={4} title="تقييمات العملاء" />

        <div className="grid gap-10 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-16">
          <div>
            {count > 0 ? (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="tabular font-display text-display-2 text-ink">
                    {average.toFixed(1)}
                  </span>
                  <span className="text-body text-ink-muted">من 5</span>
                </div>
                <div className="mt-2">
                  <Rating value={average} className="h-[18px] w-[18px]" />
                </div>
                <p className="mt-2 text-body-sm text-ink-muted">
                  بناءً على {count} {count === 1 ? "تقييم" : "تقييمات"}
                </p>

                <div className="mt-6 space-y-2">
                  {distribution.map(({ star, n }) => (
                    <div key={star} className="flex items-center gap-3">
                      <span className="tabular w-3 text-caption text-ink-muted">{star}</span>
                      <IconStar className="h-3.5 w-3.5 shrink-0 text-brand-300" />
                      <span className="h-1.5 flex-1 overflow-hidden rounded-pill bg-surface-sunken">
                        <span
                          className="block h-full rounded-pill bg-brand-300"
                          style={{ width: `${count > 0 ? (n / count) * 100 : 0}%` }}
                        />
                      </span>
                      <span className="tabular w-4 text-caption text-ink-subtle">{n}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-body text-ink-muted">
                لا توجد تقييمات بعد — كن أول من يشارك رأيه في هذه القطعة.
              </p>
            )}
          </div>

          <div>
            {count > 0 && (
              <div className="mb-10 space-y-8">
                {reviews.map((r) => (
                  <figure key={r.id} className="border-b border-line pb-8 last:border-0 last:pb-0">
                    <Rating value={r.rating} />
                    {r.comment && (
                      <blockquote className="mt-3">
                        <p className="max-w-[60ch] text-body-lg text-ink">{r.comment}</p>
                      </blockquote>
                    )}
                    <figcaption className="mt-3 flex items-center gap-2.5">
                      <span className="grid h-8 w-8 place-items-center rounded-pill bg-brand-100 text-caption font-semibold text-brand-700">
                        {r.customerName.trim().charAt(0)}
                      </span>
                      <span className="text-body-sm text-ink-muted">{r.customerName}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}

            <ReviewForm slug={slug} />
          </div>
        </div>
      </div>
    </section>
  );
}
