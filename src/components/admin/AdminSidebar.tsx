"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminFetch } from "@/lib/adminClient";

const LINKS = [
  { href: "/admin", label: "لوحة التحكم" },
  { href: "/admin/orders", label: "الطلبات" },
  { href: "/admin/products", label: "المنتجات" },
  { href: "/admin/categories", label: "الأقسام" },
  { href: "/admin/collections", label: "التشكيلات" },
  { href: "/admin/bundles", label: "الحزم" },
  { href: "/admin/hotspots", label: "النقاط التفاعلية" },
  { href: "/admin/coupons", label: "كوبونات الخصم" },
  { href: "/admin/reviews", label: "التقييمات" },
  { href: "/admin/newsletter", label: "النشرة البريدية" },
  { href: "/admin/store-design", label: "تصميم المتجر" },
  { href: "/admin/blocked-numbers", label: "الأرقام المحظورة" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-56 flex-shrink-0 flex-col border-l border-neutral-200 bg-white">
      <div className="border-b border-neutral-200 px-4 py-4">
        <p className="text-sm font-bold text-kayaan-brownDark">لوحة تحكم كيان</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {LINKS.map((link) => {
          const active = pathname?.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                active ? "bg-kayaan-brown text-white" : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={async () => {
          await adminFetch("/api/admin/logout", { method: "POST" });
          window.location.href = "/admin/login";
        }}
        className="border-t border-neutral-200 px-4 py-3 text-right text-xs font-bold text-neutral-400 hover:text-neutral-600"
      >
        تسجيل الخروج
      </button>
    </aside>
  );
}
