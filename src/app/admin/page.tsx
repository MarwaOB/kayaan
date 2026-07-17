"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/adminClient";

type DashboardStats = {
  ordersTotal: number;
  productsTotal: number;
  categoriesTotal: number;
  recentOrders: Array<{
    id: string;
    customerName: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }>;
};

function formatDZD(amount: number) {
  return `${amount.toLocaleString("ar-DZ")} د.ج`;
}

export default function AdminRootPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await adminFetch("/api/admin/dashboard");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "فشل تحميل لوحة التحكم");
        setStats(data);
      } catch (err: any) {
        setError(err.message ?? "حدث خطأ");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">لوحة التحكم</h1>
          <p className="text-sm text-neutral-500">نظرة سريعة على المتجر وأحدث الطلبات</p>
        </div>
        <Link href="/admin/orders" className="rounded-full bg-kayaan-brown px-4 py-2 text-sm font-bold text-white">
          عرض الطلبات
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-400">...جاري التحميل</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : stats ? (
        <>
          <div className="mb-6 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <p className="text-sm text-neutral-500">إجمالي الطلبات</p>
              <p className="mt-2 text-2xl font-bold">{stats.ordersTotal}</p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <p className="text-sm text-neutral-500">إجمالي المنتجات</p>
              <p className="mt-2 text-2xl font-bold">{stats.productsTotal}</p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <p className="text-sm text-neutral-500">إجمالي الأقسام</p>
              <p className="mt-2 text-2xl font-bold">{stats.categoriesTotal}</p>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-bold">أحدث الطلبات</h2>
              <Link href="/admin/orders" className="text-sm font-bold text-kayaan-brown">
                كل الطلبات
              </Link>
            </div>

            {stats.recentOrders.length === 0 ? (
              <p className="text-sm text-neutral-400">لا توجد طلبات بعد.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between rounded-lg border border-neutral-100 px-3 py-2">
                    <div>
                      <p className="font-semibold">{order.customerName}</p>
                      <p className="text-xs text-neutral-500">{new Date(order.createdAt).toLocaleString("ar-DZ")}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold">{formatDZD(order.totalAmount)}</p>
                      <p className="text-xs text-neutral-500">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
