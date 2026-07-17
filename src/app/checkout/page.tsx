"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/store";

function formatDZD(amount: number) {
  return `${amount.toLocaleString("ar-DZ")} د.ج`;
}

type Step = "form" | "done";
type Location = { id: number; name: string };

/**
 * Checkout — creates the order server-side (all validation/stock-decrement
 * happens in createOrder, never trusted from here — §14.2, §14.6). There is
 * no OTP step: the order is created as AWAITING_PAYMENT ("en attente") and
 * an admin calls the customer to confirm it manually from the orders
 * dashboard.
 *
 * Wilaya/commune lists come live from Yalidine (via our /api/delivery/*
 * proxy) instead of a static list, so the IDs we send back on submit always
 * match what Yalidine expects. As soon as both are picked, we fetch the
 * live delivery fee and show it as part of the total — no delivery-time
 * estimate is shown because Yalidine's API doesn't expose one (price only).
 */
export default function CheckoutPage() {
  const { lines, totalPrice, clear } = useCart();
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [wilayas, setWilayas] = useState<Location[]>([]);
  const [communes, setCommunes] = useState<Location[]>([]);
  const [fee, setFee] = useState<{ homeFee: number; officeFee: number; etaLabel: string } | null>(null);
  const [feeError, setFeeError] = useState<string | null>(null);
  const [loadingFee, setLoadingFee] = useState(false);

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    shippingAddress: "",
    wilayaId: 0,
    wilaya: "",
    communeId: 0,
    commune: "",
    deliveryMethod: "OFFICE" as "HOME" | "OFFICE",
    couponCode: "",
  });

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  // Load wilayas once.
  useEffect(() => {
    fetch("/api/delivery/wilayas")
      .then((r) => r.json())
      .then((data) => {
        if (data.wilayas) setWilayas(data.wilayas);
      })
      .catch(() => {});
  }, []);

  // Load communes + fee whenever the wilaya changes.
  useEffect(() => {
    if (!form.wilayaId) {
      setCommunes([]);
      setFee(null);
      return;
    }
    setFeeError(null);
    fetch(`/api/delivery/communes?wilayaId=${form.wilayaId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.communes) setCommunes(data.communes);
      })
      .catch(() => {});

    setLoadingFee(true);
    fetch(`/api/delivery/quote?wilayaId=${form.wilayaId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.homeFee !== undefined) setFee(data);
        else {
          setFee(null);
          setFeeError("تعذر جلب سعر التوصيل تلقائياً — سيتم تأكيده هاتفياً.");
        }
      })
      .catch(() => {
        setFee(null);
        setFeeError("تعذر جلب سعر التوصيل تلقائياً — سيتم تأكيده هاتفياً.");
      })
      .finally(() => setLoadingFee(false));
  }, [form.wilayaId]);

  const deliveryFee = fee ? (form.deliveryMethod === "HOME" ? fee.homeFee : fee.officeFee) : 0;
  const grandTotal = totalPrice() + deliveryFee;

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

      clear();
      setStep("done");
    } catch {
      setError("حدث خطأ في الاتصال، حاول مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  }

  if (lines.length === 0 && step === "form") {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-lg font-bold">السلة فارغة</p>
        <button onClick={() => router.push("/")} className="rounded-full bg-kayaan-brown px-6 py-2.5 text-sm font-bold text-white">
          تصفح المنتجات
        </button>
      </main>
    );
  }

  if (step === "done") {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-5xl">📞</p>
        <p className="text-lg font-bold">تم استلام طلبك</p>
        <p className="max-w-sm text-sm text-neutral-600">سنتصل بك قريباً لتأكيد طلبك عبر الهاتف.</p>
        <button onClick={() => router.push("/")} className="rounded-full bg-kayaan-brown px-6 py-2.5 text-sm font-bold text-white">
          العودة للرئيسية
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-xl font-bold">إتمام الطلب</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          required
          placeholder="الاسم الكامل"
          value={form.customerName}
          onChange={(e) => update("customerName", e.target.value)}
          className="rounded-lg border border-neutral-200 px-3 py-2.5 text-sm"
        />
        <input
          required
          placeholder="رقم الهاتف (05/06/07XXXXXXXX)"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          className="rounded-lg border border-neutral-200 px-3 py-2.5 text-sm"
        />
        <input
          type="email"
          placeholder="البريد الإلكتروني (اختياري)"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          className="rounded-lg border border-neutral-200 px-3 py-2.5 text-sm"
        />

        <select
          required
          value={form.wilayaId || ""}
          onChange={(e) => {
            const w = wilayas.find((x) => x.id === Number(e.target.value));
            update("wilayaId", w?.id ?? 0);
            update("wilaya", w?.name ?? "");
            update("communeId", 0);
            update("commune", "");
          }}
          className="rounded-lg border border-neutral-200 px-3 py-2.5 text-sm"
        >
          <option value="" disabled>
            اختر الولاية
          </option>
          {wilayas.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}
        </select>

        <select
          required
          disabled={!form.wilayaId}
          value={form.communeId || ""}
          onChange={(e) => {
            const c = communes.find((x) => x.id === Number(e.target.value));
            update("communeId", c?.id ?? 0);
            update("commune", c?.name ?? "");
          }}
          className="rounded-lg border border-neutral-200 px-3 py-2.5 text-sm disabled:opacity-50"
        >
          <option value="" disabled>
            اختر البلدية
          </option>
          {communes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <textarea
          required
          placeholder="العنوان بالتفصيل"
          rows={2}
          value={form.shippingAddress}
          onChange={(e) => update("shippingAddress", e.target.value)}
          className="rounded-lg border border-neutral-200 px-3 py-2.5 text-sm"
        />

        <div>
          <p className="mb-1.5 text-xs font-bold text-neutral-500">طريقة التوصيل</p>
          <div className="flex gap-2">
            {(["OFFICE", "HOME"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => update("deliveryMethod", m)}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm ${
                  form.deliveryMethod === m ? "border-kayaan-brown bg-kayaan-brown text-white" : "border-neutral-200"
                }`}
              >
                {m === "OFFICE" ? "التوصيل للمكتب" : "التوصيل للمنزل"}
                {fee && (
                  <span className="block text-xs opacity-80">
                    {formatDZD(m === "OFFICE" ? fee.officeFee : fee.homeFee)}
                  </span>
                )}
              </button>
            ))}
          </div>
          {loadingFee && <p className="mt-1 text-xs text-neutral-400">جاري حساب سعر التوصيل...</p>}
          {fee && <p className="mt-1 text-xs text-neutral-500">مدة التوصيل المتوقعة: {fee.etaLabel}</p>}
          {feeError && <p className="mt-1 text-xs text-amber-600">{feeError}</p>}
        </div>

        <input
          placeholder="كود الخصم (اختياري)"
          value={form.couponCode}
          onChange={(e) => update("couponCode", e.target.value)}
          className="rounded-lg border border-neutral-200 px-3 py-2.5 text-sm"
        />

        <div className="flex flex-col gap-1 border-t border-neutral-200 pt-4">
          <div className="flex items-center justify-between text-sm text-neutral-500">
            <span>المنتجات</span>
            <span>{formatDZD(totalPrice())}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-neutral-500">
            <span>التوصيل</span>
            <span>{fee ? formatDZD(deliveryFee) : "يُحدد لاحقاً"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold">الإجمالي</span>
            <span className="text-lg font-bold text-kayaan-brownDark">{formatDZD(grandTotal)}</span>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-kayaan-brown py-3 text-sm font-bold text-white disabled:opacity-60"
        >
          {submitting ? "جاري إرسال الطلب..." : "تأكيد الطلب"}
        </button>
        <p className="text-center text-xs text-neutral-400">الدفع عند الاستلام</p>
      </form>
    </main>
  );
}
