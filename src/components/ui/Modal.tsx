"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IconClose } from "@/components/ui/Icon";

/**
 * Modal dialog — docs/DESIGN-SYSTEM.md §6.6 and §9.
 *
 * Handles the four things a hand-rolled overlay almost always misses: Esc to
 * close, focus moved in and trapped, focus restored to the trigger on close,
 * and the page behind locked from scrolling.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  footnote,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footnote?: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Portalled to <body>. The size guide is triggered from inside the PDP's
  // sticky details column, and `position: sticky` creates a stacking context —
  // so a `z-50` overlay nested inside it still renders *behind* the `z-40`
  // header, which then stayed clickable through the backdrop. Escaping to the
  // body is the only reliable fix; raising z-index cannot cross contexts.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Callers write `onClose={() => setOpen(false)}`, so `onClose` is a fresh
  // function on every render. Holding it in a ref keeps the effect below keyed
  // on `open` alone — otherwise the effect tears down and re-runs on each
  // parent render, which restores the previous body overflow (releasing the
  // scroll lock) and drags focus back to the trigger mid-interaction. React
  // Strict Mode makes it happen immediately; in production it waits for the
  // first re-render, which is worse to debug.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const focusables = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab") return;

      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    (focusables()[0] ?? panelRef.current)?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused.current?.focus();
    };
  }, [open]);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="إغلاق"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-brand-900/45 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="relative z-10 max-h-[85vh] w-full max-w-[35rem] overflow-y-auto rounded-t-lg bg-surface shadow-2 outline-none sm:rounded-lg"
      >
        <div className="sticky top-0 flex items-center justify-between gap-4 border-b border-line bg-surface px-5 py-4 sm:px-6">
          <h2 className="font-display text-h2 text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-pill text-ink-muted transition duration-fast ease-k hover:bg-surface-sunken hover:text-ink"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 py-5 sm:px-6">{children}</div>

        {footnote && (
          <p className="border-t border-line px-5 py-4 text-body-sm text-ink-muted sm:px-6">{footnote}</p>
        )}
      </div>
    </div>,
    document.body,
  );
}
