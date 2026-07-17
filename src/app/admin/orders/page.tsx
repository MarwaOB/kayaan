"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminClient";

// Matches the tab list in spec §2 exactly, plus "الكل" (all) and the
// separate "لost/abandoned" tracking view.
const STATUS_TABS: { value: string | null; label: string }[] = [
  { value: null, label: "كل الطلبات" },
  { value: "CONFIRMED", label: "تم التأكيد" },
  { value: "UNDER_REVIEW", label: "تحت المراجعة" },
  { value: "AWAITING_PAYMENT", label: "في انتظار الدفع" },
  { value: "PAYMENT_FAILED", label: "فشل الدفع" },
  { value: "PREPARING", label: "قيد التجهيز للشحن" },
  { value: "AWAITING_SHIPMENT", label: "بانتظار الشحن" },
  { value: "OUT_FOR_DELIVERY", label: "قيد التوصيل" },
  { value: "DELIVERED", label: "تم التوصيل" },
  { value: "LOST", label: "الطلبات المفقودة" },
];

// Mirrors src/lib/orderStatus.ts's VALID_TRANSITIONS — duplicated here only
// to build the "advance to..." dropdown; the server is the actual source of
// truth and re-validates every transition regardless of what this shows.
const VALID_TRANSITIONS: Record<string, string[]> = {
  AWAITING_PAYMENT: ["CONFIRMED", "PAYMENT_FAILED", "UNDER_REVIEW", "LOST"],
  PAYMENT_FAILED: ["AWAITING_PAYMENT", "LOST"],
  UNDER_REVIEW: ["CONFIRMED", "PAYMENT_FAILED", "LOST"],
  CONFIRMED: ["PREPARING", "LOST"],
  PREPARING: ["AWAITING_SHIPMENT", "LOST"],
  AWAITING_SHIPMENT: ["OUT_FOR_DELIVERY", "LOST"],
  OUT_FOR_DELIVERY: ["DELIVERED", "LOST"],
  DELIVERED: [],
  LOST: [],
};

const STATUS_LABEL: Record<string, string> = Object.fromEntries(
  STATUS_TABS.filter((t) => t.value).map((t) => [t.value as string, t.label])
);

type Order = {
  id: string;
  customerName: string;
  phone: string;
  wilaya: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: { id: string; quantity: number; unitPrice: number }[];
};

function formatDZD(amount: number) {
  return `${amount.toLocaleString("ar-DZ")} د.ج`;
}

export default function AdminOrdersPage() {
  const [tab, setTab] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const qs = tab ? `?status=${tab}` : "";
      const res = await adminFetch(`/api/admin/orders${qs}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "فشل تحميل الطلبات");
      setOrders(data.orders);
    } catch (err: any) {
      setError(err.message ?? "حدث خطأ");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  async function advance(orderId: string, to: string) {
    setBusyId(orderId);
    try {
      const res = await adminFetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: to }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error ?? "فشل تحديث الحالة");
        return;
      }
      await load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">الطلبات</h1>

      <div className="mb-4 flex flex-wrap gap-2">
        {STATUS_TABS.map((t) => (
          <button
            key={t.label}
            onClick={() => setTab(t.value)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
              tab === t.value ? "bg-kayaan-brown text-white" : "bg-neutral-100 text-neutral-600"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && <p className="text-sm text-neutral-400">...جاري التحميل</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <p className="text-sm text-neutral-400">لا توجد طلبات في هذه الحالة.</p>
      )}

      <div className="flex flex-col gap-3">
        {orders.map((order) => {
          const nextOptions = VALID_TRANSITIONS[order.status] ?? [];
          return (
            <div key={order.id} className="rounded-xl border border-neutral-200 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-bold">{order.customerName}</p>
                  <p dir="ltr" className="text-left text-sm text-neutral-500">
                    {order.phone}
                  </p>
                  <p className="text-sm text-neutral-500">{order.wilaya}</p>
                </div>
                <div className="text-left">
                  <p className="font-bold text-kayaan-brownDark">{formatDZD(order.totalAmount)}</p>
                  <p className="text-xs text-neutral-400">{new Date(order.createdAt).toLocaleString("ar-DZ")}</p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-bold">
                  {STATUS_LABEL[order.status] ?? order.status}
                </span>
                <span className="text-xs text-neutral-400">{order.items.length} عنصر</span>

                {nextOptions.length > 0 && (
                  <select
                    disabled={busyId === order.id}
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) advance(order.id, e.target.value);
                    }}
                    className="mr-auto rounded-lg border border-neutral-200 px-2 py-1 text-xs"
                  >
                    <option value="" disabled>
                      نقل إلى...
                    </option>
                    {nextOptions.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABEL[s] ?? s}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
