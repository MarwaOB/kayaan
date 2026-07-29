"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart, useStoreHydration } from "@/lib/store";
import { getDeliveryFee } from "@/lib/deliveryPricing";
import { formatDZD, toArabicIndex } from "@/lib/format";
import { Combobox, type ComboOption } from "@/components/ui/Combobox";
import { ProtectedImage } from "@/components/ui/ProtectedImage";
import { IconArrowEnd, IconWallet } from "@/components/ui/Icon";

type Step = "form" | "done";

const SAVED_DETAILS_KEY = "kayaan-checkout-details";

/**
 * Checkout. The order is created server-side, where all validation and stock
 * decrement happens (§14.2, §14.6) — nothing here is trusted. There is no OTP:
 * the order lands as AWAITING_PAYMENT and an admin calls to confirm (§2).
 *
 * Design notes:
 *
 * - **Details persist per device** (brief R4). Returning customers find the form
 *   already filled, with a visible note saying so and a way to clear it —
 *   silently remembering someone's address and phone number is not a feature.
 * - **Searchable wilaya** from a static 57-entry list (Combobox); commune is a
 *   free-text input since we no longer pull commune lists from an external API.
 * - **Delivery choice is two rich cards** with the real fee on each, so the
 *   price difference is visible at the moment of choosing rather than after.
 * - **The summary is sticky on desktop** and collapsible on mobile: the total is
 *   the thing people re-check before committing.
 */
export default function CheckoutPage() {
  const { lines, totalPrice, clear } = useCart();
  const hydrated = useStoreHydration((s) => s.hydrated);
  const router = useRouter();

  const [step, setStep] = useState<Step>("form");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [wilayas, setWilayas] = useState<ComboOption[]>([]);
  const [restored, setRestored] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    shippingAddress: "",
    wilayaId: 0,
    wilaya: "",
    commune: "",
    deliveryMethod: "OFFICE" as "HOME" | "OFFICE",
    couponCode: "",
  });

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  // Restore saved details (brief R4). Never restores the coupon code — a stale
  // one would fail validation and read as the site being broken.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVED_DETAILS_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      setForm((f) => ({ ...f, ...saved, couponCode: "" }));
      setRestored(true);
    } catch {
      /* corrupt entry — start clean rather than blocking checkout */
    }
  }, []);

  function forgetDetails() {
    localStorage.removeItem(SAVED_DETAILS_KEY);
    setForm({
      customerName: "",
      phone: "",
      email: "",
      shippingAddress: "",
      wilayaId: 0,
      wilaya: "",
      commune: "",
      deliveryMethod: "OFFICE",
      couponCode: "",
    });
    setRestored(false);
  }

  useEffect(() => {
    fetch("/api/delivery/wilayas")
      .then((r) => r.json())
      .then((data) => {
        if (data.wilayas) setWilayas(data.wilayas);
      })
      .catch(() => {});
  }, []);

  // Look up fees locally from the static table — instant on every wilaya change,
  // with no race between overlapping quote requests.
  const fee = useMemo(() => {
    if (!form.wilayaId) return null;
    const entry = getDeliveryFee(form.wilayaId);
    if (!entry) return null;
    return { homeFee: entry.homeFee, officeFee: entry.deskFee };
  }, [form.wilayaId]);

  const feeError =
    form.wilayaId && !fee ? "تعذر تحديد سعر التوصيل — يرجى التواصل معنا." : null;

  const subtotal = totalPrice();
  const deliveryFee = fee ? (form.deliveryMethod === "HOME" ? fee.homeFee : fee.officeFee) : 0;
  const grandTotal = subtotal + deliveryFee;
  const itemCount = lines.reduce((n, l) => n + l.quantity, 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          couponCode: form.couponCode || undefined,
          items: lines.map((l) => ({ type: "variant", variantId: l.variantId, quantity: l.quantity })),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "حدث خطأ، حاول مرة أخرى.");
        setSubmitting(false);
        return;
      }

      // Persist for next time only once the order actually succeeded (R4).
      try {
        const { couponCode, ...details } = form;
        localStorage.setItem(SAVED_DETAILS_KEY, JSON.stringify(details));
      } catch {
        /* storage full or blocked — not worth failing a completed order over */
      }

      clear();
      setStep("done");
    } catch {
      setError("حدث خطأ في الاتصال، حاول مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  }

  if (step === "done") return <OrderConfirmed onHome={() => router.push("/")} />;
  // Never claim the cart is empty before localStorage has been read — that
  // would bounce a returning customer out of checkout on arrival.
  if (!hydrated) return <CheckoutSkeleton />;
  if (lines.length === 0) return <EmptyCheckout />;

  const field =
    "mt-2 h-11 w-full rounded-sm border border-line-strong bg-surface px-4 text-[16px] text-ink placeholder:text-ink-subtle transition duration-fast ease-k hover:border-brand-400";

  return (
    <main className="section-k">
      <div className="container-k-wide">
        <h1 className="font-display text-display-2 text-ink">إتمام الطلب</h1>

        {/* Mobile summary — collapsed by default so the form is what you see. */}
        <div className="mt-6 lg:hidden">
          <button
            type="button"
            onClick={() => setSummaryOpen((o) => !o)}
            aria-expanded={summaryOpen}
            className="flex w-full items-center justify-between gap-4 rounded-sm bg-surface-sunken px-4 py-3.5"
          >
            <span className="text-body-sm font-semibold text-ink">
              ملخص الطلب ({itemCount})
            </span>
            <span className="tabular text-price text-brand-800">{formatDZD(grandTotal)}</span>
          </button>
          {summaryOpen && (
            <div className="mt-2 rounded-md bg-surface-sunken p-5">
              <OrderLines lines={lines} />
              <Totals subtotal={subtotal} fee={fee} deliveryFee={deliveryFee} total={grandTotal} />
            </div>
          )}
        </div>

        <div className="mt-8 grid gap-10 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-14">
          <form onSubmit={handleSubmit} noValidate>
            {restored && (
              <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-sm bg-brand-50 px-4 py-3">
                <p className="text-body-sm text-ink-muted">
                  أكملنا معلوماتك المحفوظة على هذا الجهاز.
                </p>
                <button
                  type="button"
                  onClick={forgetDetails}
                  className="text-body-sm font-semibold text-brand-700 underline underline-offset-4"
                >
                  مسح المعلومات
                </button>
              </div>
            )}

            <Fieldset index={1} title="معلومات التواصل">
              <div>
                <label htmlFor="name" className="block text-caption text-ink-muted">
                  الاسم الكامل <span className="text-danger">*</span>
                </label>
                <input
                  id="name"
                  required
                  autoComplete="name"
                  value={form.customerName}
                  onChange={(e) => update("customerName", e.target.value)}
                  className={field}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-caption text-ink-muted">
                  رقم الهاتف <span className="text-danger">*</span>
                </label>
                <input
                  id="phone"
                  required
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  dir="ltr"
                  placeholder="0555 12 34 56"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className={`${field} text-start`}
                />
                <p className="mt-1.5 text-caption text-ink-subtle">
                  سنتصل بك على هذا الرقم لتأكيد الطلب.
                </p>
              </div>

              <div>
                <label htmlFor="email" className="block text-caption text-ink-muted">
                  البريد الإلكتروني (اختياري)
                </label>
                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  dir="ltr"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className={`${field} text-start`}
                />
              </div>
            </Fieldset>

            <Fieldset index={2} title="عنوان التوصيل">
              <Combobox
                id="wilaya"
                label="الولاية"
                required
                options={wilayas}
                value={form.wilayaId}
                placeholder="اختر الولاية"
                onChange={(w) => {
                  setForm((f) => ({
                    ...f,
                    wilayaId: w.id,
                    wilaya: w.name,
                    commune: "",
                  }));
                }}
              />

              <div>
                <label htmlFor="commune" className="block text-caption text-ink-muted">
                  البلدية
                </label>
                <input
                  id="commune"
                  value={form.commune}
                  onChange={(e) => update("commune", e.target.value)}
                  placeholder="اكتب اسم البلدية"
                  className={field}
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-caption text-ink-muted">
                  العنوان بالتفصيل <span className="text-danger">*</span>
                </label>
                <textarea
                  id="address"
                  required
                  rows={3}
                  autoComplete="street-address"
                  placeholder="الحي، الشارع، رقم البناية…"
                  value={form.shippingAddress}
                  onChange={(e) => update("shippingAddress", e.target.value)}
                  className="mt-2 w-full rounded-sm border border-line-strong bg-surface px-4 py-3 text-[16px] text-ink placeholder:text-ink-subtle transition duration-fast ease-k hover:border-brand-400"
                />
              </div>
            </Fieldset>

            <Fieldset index={3} title="طريقة التوصيل">
              <div className="grid gap-3 sm:grid-cols-2">
                {(["OFFICE", "HOME"] as const).map((method) => {
                  const isSelected = form.deliveryMethod === method;
                  const methodFee = fee ? (method === "HOME" ? fee.homeFee : fee.officeFee) : null;
                  return (
                    <button
                      key={method}
                      type="button"
                      onClick={() => update("deliveryMethod", method)}
                      aria-pressed={isSelected}
                      className={`rounded-sm border p-4 text-start transition duration-fast ease-k ${
                        isSelected
                          ? "border-brand-700 bg-brand-50 ring-1 ring-brand-700"
                          : "border-line-strong hover:border-brand-400"
                      }`}
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span className="text-body font-semibold text-ink">
                          {method === "OFFICE" ? "التوصيل للمكتب" : "التوصيل للمنزل"}
                        </span>
                        <span
                          className={`grid h-5 w-5 shrink-0 place-items-center rounded-pill border transition duration-fast ease-k ${
                            isSelected ? "border-brand-700 bg-brand-700" : "border-line-strong"
                          }`}
                        >
                          {isSelected && <span className="h-1.5 w-1.5 rounded-pill bg-white" />}
                        </span>
                      </span>
                      <span className="mt-1.5 block text-body-sm text-ink-muted">
                        {method === "OFFICE" ? "استلام من أقرب مكتب توصيل" : "توصيل إلى باب المنزل"}
                      </span>
                      <span className="tabular mt-3 block text-price text-brand-800">
                        {methodFee !== null ? formatDZD(methodFee) : "يُحدد لاحقاً"}
                      </span>
                    </button>
                  );
                })}
              </div>

              {feeError && (
                <p role="status" className="text-body-sm text-warning">
                  {feeError}
                </p>
              )}
            </Fieldset>

            <Fieldset index={4} title="كود الخصم (اختياري)">
              <div>
                <label htmlFor="coupon" className="sr-only">
                  كود الخصم
                </label>
                <input
                  id="coupon"
                  dir="ltr"
                  placeholder="KAYAAN10"
                  value={form.couponCode}
                  onChange={(e) => update("couponCode", e.target.value.toUpperCase())}
                  className={`${field} mt-0 text-start uppercase`}
                />
                <p className="mt-1.5 text-caption text-ink-subtle">
                  يُطبّق الخصم عند تأكيد الطلب.
                </p>
              </div>
            </Fieldset>

            {error && (
              <p role="alert" className="mt-8 rounded-sm bg-danger/10 px-4 py-3 text-body-sm text-danger">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-10 flex h-12 w-full items-center justify-center rounded-sm bg-brand-700 text-body font-semibold text-white transition duration-fast ease-k hover:bg-brand-800 disabled:opacity-60 lg:w-auto lg:px-10"
            >
              {submitting ? "جاري إرسال الطلب…" : "تأكيد الطلب"}
            </button>

            <p className="mt-4 flex items-center gap-2 text-body-sm text-ink-muted">
              <IconWallet className="h-[18px] w-[18px] shrink-0 text-brand-600" />
              الدفع عند الاستلام — لا حاجة لبطاقة بنكية.
            </p>
          </form>

          {/* Desktop summary */}
          <aside className="hidden lg:sticky lg:top-8 lg:block lg:self-start">
            <div className="rounded-md bg-surface-sunken p-6">
              <h2 className="text-body font-semibold text-ink">ملخص الطلب</h2>
              <OrderLines lines={lines} />
              <Totals subtotal={subtotal} fee={fee} deliveryFee={deliveryFee} total={grandTotal} />
              <Link
                href="/cart"
                className="mt-5 inline-flex items-center gap-2 text-body-sm font-semibold text-brand-700 transition-colors duration-fast ease-k hover:text-brand-800"
              >
                <IconArrowEnd className="h-4 w-4" />
                تعديل السلة
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

/** Numbered form section, echoing the section numbering used site-wide. */
function Fieldset({
  index,
  title,
  children,
}: {
  index: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="border-t border-line pt-8 first:border-0 first:pt-0 [&+&]:mt-10">
      <legend className="sr-only">{title}</legend>
      <div className="flex items-center gap-3">
        <span className="tabular text-caption text-brand-600">{toArabicIndex(index)}</span>
        <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
      </div>
      <h2 className="mt-3 font-display text-h2 text-ink">{title}</h2>
      <div className="mt-6 space-y-5">{children}</div>
    </fieldset>
  );
}

function OrderLines({ lines }: { lines: ReturnType<typeof useCart.getState>["lines"] }) {
  return (
    <ul className="mt-5 space-y-4">
      {lines.map((line) => (
        <li key={line.variantId} className="flex gap-3">
          <div className="relative aspect-product w-14 shrink-0 overflow-hidden rounded-xs bg-surface">
            {line.imageUrl && (
              <ProtectedImage src={line.imageUrl} alt="" sizes="56px" className="h-full w-full object-cover" />
            )}
            <span className="tabular absolute -end-1.5 -top-1.5 grid h-5 min-w-[1.25rem] place-items-center rounded-pill bg-brand-700 px-1 text-[11px] font-semibold text-white">
              {line.quantity}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-body-sm font-medium text-ink">{line.productName}</p>
            <p className="mt-0.5 text-caption text-ink-muted">
              {line.color} · {line.size}
            </p>
          </div>
          <p className="tabular shrink-0 text-body-sm text-ink">
            {formatDZD(line.unitPrice * line.quantity)}
          </p>
        </li>
      ))}
    </ul>
  );
}

function Totals({
  subtotal,
  fee,
  deliveryFee,
  total,
}: {
  subtotal: number;
  fee: unknown;
  deliveryFee: number;
  total: number;
}) {
  return (
    <>
      <dl className="mt-5 space-y-3 border-t border-line-strong pt-5">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-body-sm text-ink-muted">المجموع الفرعي</dt>
          <dd className="tabular text-body-sm text-ink">{formatDZD(subtotal)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-body-sm text-ink-muted">التوصيل</dt>
          <dd className="tabular text-body-sm text-ink">
            {fee ? formatDZD(deliveryFee) : "يُحدد لاحقاً"}
          </dd>
        </div>
      </dl>

      <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-line-strong pt-5">
        <span className="text-body font-semibold text-ink">الإجمالي</span>
        <span className="tabular font-display text-h2 text-brand-800">{formatDZD(total)}</span>
      </div>
    </>
  );
}

function CheckoutSkeleton() {
  return (
    <main className="section-k" aria-busy="true" aria-live="polite">
      <div className="container-k-wide">
        <span className="sr-only">جاري تحميل صفحة الطلب…</span>
        <div className="h-9 w-48 animate-pulse rounded-sm bg-surface-sunken" />
        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-14">
          <div className="space-y-5">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-11 animate-pulse rounded-sm bg-surface-sunken" />
            ))}
          </div>
          <div className="h-72 animate-pulse rounded-md bg-surface-sunken" />
        </div>
      </div>
    </main>
  );
}

function EmptyCheckout() {
  return (
    <main className="section-k">
      <div className="container-k-wide max-w-xl text-center">
        <h1 className="font-display text-display-2 text-ink">سلتك فارغة</h1>
        <p className="mt-4 text-body text-ink-muted">أضف قطعة إلى السلة قبل إتمام الطلب.</p>
        <Link
          href="/top-selling"
          className="mt-8 inline-flex h-12 items-center rounded-sm bg-brand-700 px-7 text-body font-semibold text-white transition duration-fast ease-k hover:bg-brand-800"
        >
          تصفّح المنتجات
        </Link>
      </div>
    </main>
  );
}

/**
 * Confirmation. The customer's next question is "what now?" — so this answers
 * it explicitly rather than saying "order received" and stopping.
 */
function OrderConfirmed({ onHome }: { onHome: () => void }) {
  const steps = [
    { title: "استلمنا طلبك", desc: "طلبك مسجّل لدينا الآن." },
    { title: "سنتصل بك", desc: "سنهاتفك على رقمك لتأكيد الطلب والعنوان." },
    { title: "التحضير والشحن", desc: "بعد التأكيد نحضّر القطعة ونسلّمها لشركة التوصيل." },
    { title: "الدفع عند الاستلام", desc: "تدفع مباشرة لعامل التوصيل عند استلام الطلب." },
  ];

  return (
    <main className="section-k">
      <div className="container-k-wide max-w-2xl">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-pill bg-success text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
              <path d="m5 12.5 4.5 4.5L19 7.5" />
            </svg>
          </span>
          <h1 className="font-display text-display-2 text-ink">تم استلام طلبك</h1>
        </div>

        <p className="mt-5 text-body-lg text-ink-muted">
          شكراً لثقتك بكيان. سنتواصل معك هاتفياً في أقرب وقت لتأكيد الطلب.
        </p>

        <ol className="mt-10 border-t border-line">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-4 border-b border-line py-5">
              <span className="tabular mt-0.5 text-caption text-brand-600">{toArabicIndex(i + 1)}</span>
              <div>
                <p className="text-body font-semibold text-ink">{s.title}</p>
                <p className="mt-1 text-body-sm text-ink-muted">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onHome}
            className="flex h-12 items-center rounded-sm bg-brand-700 px-7 text-body font-semibold text-white transition duration-fast ease-k hover:bg-brand-800"
          >
            العودة للرئيسية
          </button>
          <a
            href="https://wa.me/213562009989"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 items-center rounded-sm border border-line-strong px-7 text-body font-semibold text-ink transition duration-fast ease-k hover:border-brand-400"
          >
            تواصل معنا
          </a>
        </div>
      </div>
    </main>
  );
}
