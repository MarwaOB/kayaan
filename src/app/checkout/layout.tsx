import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { IconChevronEnd, IconWallet } from "@/components/ui/Icon";

/**
 * Checkout wears deliberately minimal chrome: logo, a way back to the cart, and
 * the cash-on-delivery reassurance — no mega-menu, no category rail, no footer
 * link farm.
 *
 * This is not laziness, it is the standard pattern for a reason: every
 * navigation affordance on a checkout page is an exit, and exits on the last
 * step of a funnel are expensive. The customer already decided; the job now is
 * to keep them looking at the form.
 */
export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line">
        <div className="container-k-wide flex items-center justify-between gap-4 py-4">
          <Link href="/cart" className="flex items-center gap-1.5 text-body-sm text-ink-muted transition-colors duration-fast ease-k hover:text-ink">
            <IconChevronEnd className="h-4 w-4" />
            العودة إلى السلة
          </Link>

          <Link href="/" aria-label="كيان — الصفحة الرئيسية">
            <Logo mark="wordmark" colorway="espresso" width={92} priority />
          </Link>

          <p className="hidden items-center gap-2 text-body-sm text-ink-muted sm:flex">
            <IconWallet className="h-[18px] w-[18px] text-brand-600" />
            الدفع عند الاستلام
          </p>
          {/* Keeps the logo centred on small screens, where the note is hidden. */}
          <span className="w-24 sm:hidden" aria-hidden="true" />
        </div>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="border-t border-line py-6">
        <div className="container-k-wide flex flex-wrap items-center justify-between gap-3 text-caption text-ink-muted">
          <p>© 2026 By Kayaan</p>
          <div className="flex gap-5">
            <Link href="/pages/refund-policy" className="transition-colors duration-fast ease-k hover:text-ink">
              سياسة الاستبدال والاسترجاع
            </Link>
            <Link href="/pages/privacy" className="transition-colors duration-fast ease-k hover:text-ink">
              سياسات الخصوصية
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
