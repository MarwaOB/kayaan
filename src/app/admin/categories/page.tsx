"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminClient";

type Category = {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  visible: boolean;
  _count: { products: number };
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await adminFetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data.categories ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggle(id: string, visible: boolean) {
    setBusyId(id);
    try {
      await adminFetch(`/api/admin/categories/${id}/mask`, {
        method: "PATCH",
        body: JSON.stringify({ visible }),
      });
      await load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <h1 className="mb-1 text-xl font-bold">الأقسام</h1>
      <p className="mb-4 text-xs text-neutral-500">
        إخفاء أو إظهار قسم من الموقع (لا يحذف المنتجات، فقط يخفي القسم عن الزوار).
      </p>

      {loading ? (
        <p className="text-sm text-neutral-400">...جاري التحميل</p>
      ) : (
        <div className="flex flex-col gap-2">
          {categories.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-xl border border-neutral-200 p-4">
              <div>
                <p className="font-bold">
                  {c.name} <span className="text-neutral-400">/ {c.nameAr}</span>
                </p>
                <p className="text-xs text-neutral-500">{c._count.products} منتج</p>
              </div>
              <button
                disabled={busyId === c.id}
                onClick={() => toggle(c.id, !c.visible)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold disabled:opacity-60 ${
                  c.visible ? "bg-green-100 text-green-700" : "bg-neutral-200 text-neutral-500"
                }`}
              >
                {c.visible ? "ظاهر — اضغط للإخفاء" : "مخفي — اضغط للإظهار"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
