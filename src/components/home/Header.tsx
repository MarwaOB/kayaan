"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart, useFavorites } from "@/lib/store";

type NavCategory = { name: string; nameAr: string; slug: string };
type NavPage = { label: string; href: string };

type MenuSection = {
  id: string;
  title: string;
  subtitle: string;
  items: Array<{ label: string; href: string; description?: string }>;
};

const PAGES: NavPage[] = [
  { label: "دليل المقاسات", href: "/pages/size-guide" },
  { label: "من نحن؟", href: "/pages/about" },
  { label: "سياسة الطلب والشحن", href: "/pages/shipping-policy" },
  { label: "سياسة الاستبدال والاسترجاع", href: "/pages/refund-policy" },
  { label: "شروط الاستخدام", href: "/pages/terms" },
  { label: "سياسات الخصوصية", href: "/pages/privacy" },
];

/**
 * Header (§6.2): logo centered, cart icon, favorites icon, hamburger menu.
 * The hamburger opens a Kith-style mega-menu (§10): a sectioned navigation
 * experience with a preview panel and quick-access links.
 */
export function Header({ categories }: { categories: NavCategory[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState("categories");
  const totalCount = useCart((s) => s.totalCount());
  const favoriteCount = useFavorites((s) => s.favoriteIds.length);

  const sections: MenuSection[] = [
    {
      id: "categories",
      title: "الأقسام",
      subtitle: "اكتشف التصاميم حسب الفئة",
      items: categories.map((c) => ({ label: c.nameAr, href: `/categories/${c.slug}` })),
    },
    {
      id: "collections",
      title: "التشكيلات",
      subtitle: "المجموعات والحدود الجديدة",
      items: [
        { label: "إطلاقة رمضان 2026", href: "/collections/drop-ramadan-2026", description: "تشكيلة جديدة مميزة" },
        { label: "الأكثر مبيعاً", href: "/top-selling", description: "أفضل القطع المختارة" },
      ],
    },
    {
      id: "pages",
      title: "المعلومات",
      subtitle: "من نحن؟ والسياسات والتوجيهات",
      items: PAGES.map((p) => ({ label: p.label, href: p.href })),
    },
  ];

  const activeSection = sections.find((section) => section.id === activeSectionId) ?? sections[0];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-kayaan-bg/95 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-3 items-center px-4 py-3">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="القائمة"
            className="justify-self-start rounded-full border border-stone-300 bg-white/80 p-2 text-xl shadow-sm transition hover:bg-white"
          >
            ☰
          </button>

          <Link href="/" className="justify-self-center text-xl font-bold tracking-wide text-kayaan-brownDark">
            كيان
          </Link>

          <div className="flex items-center gap-4 justify-self-end">
            <Link href="/favorites" aria-label="المفضلة" className="relative text-xl">
              ♡
              {favoriteCount > 0 && (
                <span className="absolute -top-2 -end-2 grid h-4 w-4 place-items-center rounded-full bg-kayaan-brown text-[10px] text-white">
                  {favoriteCount}
                </span>
              )}
            </Link>
            <Link href="/cart" aria-label="السلة" className="relative text-xl">
              🛍️
              {totalCount > 0 && (
                <span className="absolute -top-2 -end-2 grid h-4 w-4 place-items-center rounded-full bg-kayaan-brown text-[10px] text-white">
                  {totalCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-50 flex justify-start transition-all duration-300 ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div
          className="absolute inset-0 bg-neutral-900/45 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setMenuOpen(false)}
        />

        <div
          className={`relative z-10 flex h-full w-full max-w-5xl flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out md:flex-row ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full bg-kayaan-bg/70 p-6 md:w-[34%] md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-kayaan-brown">التصفح</p>
                <h2 className="mt-1 text-xl font-bold text-kayaan-ink">استكشف كيان</h2>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-600 shadow-sm transition hover:bg-neutral-100"
                aria-label="إغلاق القائمة"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 md:flex-col">
              {sections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSectionId(section.id)}
                  className={`rounded-full px-4 py-2 text-right text-sm font-semibold transition ${
                    activeSection.id === section.id
                      ? "bg-kayaan-brown text-white shadow"
                      : "bg-white text-kayaan-ink hover:bg-kayaan-pink"
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </div>

            <div className="mt-8 space-y-2 border-t border-stone-200 pt-6">
              <Link href="/favorites" onClick={() => setMenuOpen(false)} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-kayaan-ink shadow-sm">
                <span>المفضلة</span>
                <span>♡</span>
              </Link>
              <Link href="/cart" onClick={() => setMenuOpen(false)} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-kayaan-ink shadow-sm">
                <span>السلة</span>
                <span>🛍️</span>
              </Link>
            </div>
          </div>

          <div className="flex-1 bg-white p-6 md:p-8">
            <div className="grid h-full gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-kayaan-brown">{activeSection.title}</p>
                <h3 className="mt-2 text-2xl font-bold text-kayaan-ink">{activeSection.subtitle}</h3>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {activeSection.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="rounded-[1.25rem] border border-stone-200 bg-kayaan-bg/80 p-4 transition hover:-translate-y-0.5 hover:border-kayaan-accent hover:bg-white"
                    >
                      <p className="text-sm font-semibold text-kayaan-ink">{item.label}</p>
                      {item.description && <p className="mt-1 text-xs text-neutral-600">{item.description}</p>}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[2rem] bg-kayaan-pink">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/seed/hero-1.svg"
                  alt="كيان ستايل"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/75 via-neutral-900/20 to-transparent" />
                <div className="absolute bottom-0 p-6 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-kayaan-accent">مجموعة صيف 2026</p>
                  <h4 className="mt-2 text-xl font-bold leading-snug">أكثر من مجرد ملابس، ستايل يعبّر عنك.</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
