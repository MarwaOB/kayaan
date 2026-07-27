"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCart, useFavorites, useStoreHydration } from "@/lib/store";
import { Logo } from "@/components/brand/Logo";
import { IconBag, IconChevronEnd, IconClose, IconHeart, IconMenu } from "@/components/ui/Icon";
import { MENU_SHOT } from "@/lib/lookbook";
import { toSrcSet } from "@/lib/media";

type NavCategory = { name: string; nameAr: string; slug: string };

type MenuSection = {
  id: string;
  title: string;
  subtitle: string;
  items: Array<{ label: string; href: string; description?: string }>;
};

const PAGES = [
  { label: "دليل المقاسات", href: "/pages/size-guide" },
  { label: "من نحن؟", href: "/pages/about" },
  { label: "سياسة الطلب والشحن", href: "/pages/shipping-policy" },
  { label: "سياسة الاستبدال والاسترجاع", href: "/pages/refund-policy" },
  { label: "شروط الاستخدام", href: "/pages/terms" },
  { label: "سياسات الخصوصية", href: "/pages/privacy" },
];

/**
 * Header (spec §6.2) + mega-menu (spec §10, Kith reference).
 *
 * Two changes of substance over the old header:
 *
 * 1. It renders the actual logo. The previous version set the string "كيان" in
 *    a bold `<Link>` — the brand has five real lockups and none were being used.
 * 2. It is transparent over the hero and only takes on a surface once you
 *    scroll, so the full-bleed hero the brief asks for (R6) actually reaches
 *    the top of the viewport instead of starting under a bar.
 *
 * The old Latin eyebrows ("التصفح" set in `tracking-[0.3em]`) are gone —
 * letter-spacing breaks Arabic cursive joins (DESIGN-SYSTEM.md §3.4).
 */
export function Header({ categories }: { categories: NavCategory[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState("categories");
  const [scrolled, setScrolled] = useState(false);
  // Counts stay at zero until localStorage has been read, so the server markup
  // and the first client render match (see useStoreHydration).
  const hydrated = useStoreHydration((s) => s.hydrated);
  const cartCount = useCart((s) => s.totalCount());
  const favCount = useFavorites((s) => s.favoriteIds.length);
  const totalCount = hydrated ? cartCount : 0;
  const favoriteCount = hydrated ? favCount : 0;

  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /**
   * Publishes the header's real height as `--k-header-h` so anything pinning
   * beneath it (the listing toolbar) sits flush. globals.css carries measured
   * defaults for the server render and for pages without this header; this
   * only ever corrects them, so a failure here degrades to a few pixels rather
   * than to a broken layout.
   */
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const publish = () =>
      document.documentElement.style.setProperty("--k-header-h", `${el.offsetHeight}px`);

    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(el);

    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--k-header-h");
    };
  }, []);

  // Esc closes, focus returns to the trigger, body scroll locks (§9).
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [menuOpen]);

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
      subtitle: "المجموعات والإصدارات الجديدة",
      items: [
        { label: "إطلاقة رمضان 2026", href: "/collections/drop-ramadan-2026", description: "تشكيلة جديدة مميزة" },
        { label: "الأكثر مبيعاً", href: "/top-selling", description: "أفضل القطع المختارة" },
      ],
    },
    {
      id: "pages",
      title: "المعلومات",
      subtitle: "من نحن، والسياسات، ودليل المقاسات",
      items: PAGES.map((p) => ({ label: p.label, href: p.href })),
    },
  ];

  const activeSection = sections.find((s) => s.id === activeSectionId) ?? sections[0];

  const iconButton =
    "grid h-11 w-11 place-items-center rounded-pill transition duration-fast ease-k hover:bg-brand-900/5";

  return (
    <>
      <header
        ref={headerRef}
        className={`sticky top-0 z-40 transition-colors duration-base ease-k ${
          scrolled ? "border-b border-line bg-bg/90 shadow-1 backdrop-blur-md" : "border-b border-transparent bg-bg"
        }`}
      >
        <div className="container-k-wide grid grid-cols-[1fr_auto_1fr] items-center py-3">
          <div className="flex items-center gap-1 justify-self-start">
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="فتح القائمة"
              aria-expanded={menuOpen}
              className={iconButton}
            >
              <IconMenu className="h-5 w-5" />
            </button>
          </div>

          <Link href="/" aria-label="كيان — الصفحة الرئيسية" className="justify-self-center py-1">
            <Logo mark="wordmark" colorway="espresso" width={104} priority />
          </Link>

          <div className="flex items-center gap-1 justify-self-end">
            <Link href="/favorites" aria-label={`المفضلة (${favoriteCount})`} className={`relative ${iconButton}`}>
              <IconHeart className="h-5 w-5" />
              {favoriteCount > 0 && <Badge>{favoriteCount}</Badge>}
            </Link>
            <Link href="/cart" aria-label={`السلة (${totalCount})`} className={`relative ${iconButton}`}>
              <IconBag className="h-5 w-5" />
              {totalCount > 0 && <Badge>{totalCount}</Badge>}
            </Link>
          </div>
        </div>

        {/* Kith-style top-level category rail — desktop only; on mobile these
            live in the mega-menu rather than being crushed into a scroller. */}
        <nav aria-label="الأقسام" className="hidden border-t border-line/60 md:block">
          <div className="container-k-wide flex items-center justify-center gap-8 py-2.5">
            {categories.slice(0, 6).map((c) => (
              <Link
                key={c.slug}
                href={`/categories/${c.slug}`}
                className="relative py-1 text-body-sm text-ink-muted transition-colors duration-fast ease-k after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-right after:scale-x-0 after:bg-brand-700 after:transition-transform after:duration-base after:ease-k hover:text-ink hover:after:scale-x-100"
              >
                {c.nameAr}
              </Link>
            ))}
            <Link
              href="/top-selling"
              className="py-1 text-body-sm font-semibold text-brand-700 transition-colors duration-fast ease-k hover:text-brand-800"
            >
              الأكثر مبيعاً
            </Link>
          </div>
        </nav>
      </header>

      {/* ---- Mega-menu ---- */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-slow ease-k ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="قائمة التصفح"
      >
        <button
          type="button"
          aria-label="إغلاق القائمة"
          onClick={() => setMenuOpen(false)}
          className="absolute inset-0 h-full w-full cursor-default bg-brand-900/45 backdrop-blur-sm"
        />

        <div
          ref={panelRef}
          tabIndex={-1}
          className={`absolute inset-y-0 start-0 flex h-full w-full max-w-5xl flex-col bg-bg shadow-2 outline-none transition-transform duration-slow ease-k md:flex-row ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Rail */}
          <div className="flex shrink-0 flex-col justify-between border-line bg-surface-sunken p-6 md:w-[30%] md:border-e md:p-8">
            <div>
              <div className="flex items-start justify-between gap-4">
                <Logo mark="lockup-horizontal" colorway="espresso" width={150} />
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="إغلاق القائمة"
                  className="grid h-10 w-10 place-items-center rounded-pill bg-surface text-ink-muted transition duration-fast ease-k hover:text-ink"
                >
                  <IconClose className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-8 flex flex-wrap gap-2 md:flex-col md:gap-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSectionId(section.id)}
                    aria-current={activeSection.id === section.id}
                    className={`rounded-sm px-4 py-3 text-start text-body font-semibold transition duration-fast ease-k ${
                      activeSection.id === section.id
                        ? "bg-brand-700 text-white"
                        : "text-ink hover:bg-brand-100"
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 space-y-1 border-t border-line pt-6">
              <MenuQuickLink href="/favorites" onClick={() => setMenuOpen(false)} label="المفضلة" count={favoriteCount}>
                <IconHeart className="h-[18px] w-[18px]" />
              </MenuQuickLink>
              <MenuQuickLink href="/cart" onClick={() => setMenuOpen(false)} label="السلة" count={totalCount}>
                <IconBag className="h-[18px] w-[18px]" />
              </MenuQuickLink>
            </div>
          </div>

          {/* Panel */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10">
            <div className="grid h-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <h2 className="font-display text-h1 text-ink">{activeSection.title}</h2>
                <p className="mt-1.5 text-body-sm text-ink-muted">{activeSection.subtitle}</p>

                <div className="mt-6 flex flex-col">
                  {activeSection.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="group flex items-center justify-between gap-4 border-b border-line py-4 transition-colors duration-fast ease-k hover:border-brand-400"
                    >
                      <span>
                        <span className="block text-body font-medium text-ink group-hover:text-brand-700">
                          {item.label}
                        </span>
                        {item.description && (
                          <span className="mt-0.5 block text-body-sm text-ink-muted">{item.description}</span>
                        )}
                      </span>
                      <IconChevronEnd className="h-4 w-4 shrink-0 text-ink-subtle transition-transform duration-base ease-k group-hover:-translate-x-1 group-hover:text-brand-700" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Lifestyle preview, per the Kith reference. */}
              {MENU_SHOT && (
                <Link
                  href="/top-selling"
                  onClick={() => setMenuOpen(false)}
                  className="group relative hidden overflow-hidden rounded-md bg-surface-sunken lg:block"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={MENU_SHOT.image.src}
                    srcSet={toSrcSet(MENU_SHOT.image)}
                    sizes="420px"
                    alt={MENU_SHOT.alt}
                    draggable={false}
                    className="no-save h-full w-full object-cover transition-transform duration-slow ease-k group-hover:scale-[1.03]"
                  />
                  <div className="scrim-k absolute inset-0" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="font-display text-h2 leading-snug text-white">أكثر من مجرد ملابس</p>
                    <p className="mt-1 text-body-sm text-brand-200">تصفّح القطع الأكثر طلباً</p>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="tabular absolute end-1.5 top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-pill bg-brand-700 px-1 text-[11px] font-semibold leading-none text-white">
      {children}
    </span>
  );
}

function MenuQuickLink({
  href,
  label,
  count,
  onClick,
  children,
}: {
  href: string;
  label: string;
  count: number;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center justify-between rounded-sm px-3 py-3 text-body font-medium text-ink transition duration-fast ease-k hover:bg-brand-100"
    >
      <span className="flex items-center gap-2.5">
        {children}
        {label}
      </span>
      {count > 0 && <span className="tabular text-body-sm text-ink-muted">{count}</span>}
    </Link>
  );
}
