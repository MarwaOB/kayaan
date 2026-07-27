"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { IconChevronDown, IconClose } from "@/components/ui/Icon";

export type ComboOption = { id: number; name: string };

/**
 * Searchable single-select.
 *
 * Built for the checkout's wilaya field: Algeria has 58 wilayas and a native
 * `<select>` makes a customer scroll a 58-row wheel on a phone to find their
 * own province. Typing three letters is the difference between finishing the
 * order and abandoning it. Communes are worse — a large wilaya has dozens.
 *
 * Arabic search is diacritic- and orthography-tolerant: أ/إ/آ normalise to ا
 * and ة to ه, so "قسنطينه" finds "قسنطينة". Latin input matches too, since
 * Yalidine returns some names transliterated.
 *
 * Keyboard: ArrowUp/Down move, Enter selects, Esc closes, Tab leaves.
 */

/** Fold the spellings that differ only by hamza/ta-marbuta, and strip tashkeel. */
function normalise(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[ً-ْٰ]/g, "") // tashkeel
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[ؤئ]/g, "ء")
    .replace(/[^\p{L}\p{N}]/gu, ""); // spaces, hyphens, punctuation
}

export function Combobox({
  id,
  label,
  options,
  value,
  onChange,
  placeholder = "اختر…",
  emptyLabel = "لا توجد نتائج",
  disabled = false,
  disabledHint,
  required = false,
}: {
  id: string;
  label: string;
  options: ComboOption[];
  value: number;
  onChange: (option: ComboOption) => void;
  placeholder?: string;
  emptyLabel?: string;
  disabled?: boolean;
  /** Shown in place of the value when disabled, e.g. "اختر الولاية أولاً". */
  disabledHint?: string;
  required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = options.find((o) => o.id === value) ?? null;

  const filtered = useMemo(() => {
    const q = normalise(query);
    if (!q) return options;
    // Prefix matches first — typing "ال" shouldn't bury الجزائر under
    // everything that merely contains those letters.
    const starts = options.filter((o) => normalise(o.name).startsWith(q));
    const contains = options.filter(
      (o) => !normalise(o.name).startsWith(q) && normalise(o.name).includes(q),
    );
    return [...starts, ...contains];
  }, [options, query]);

  useEffect(() => setHighlighted(0), [query, open]);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
    else setQuery("");
  }, [open]);

  // Keep the highlighted row in view when arrowing through a long list.
  useEffect(() => {
    if (!open) return;
    listRef.current?.children[highlighted]?.scrollIntoView({ block: "nearest" });
  }, [highlighted, open]);

  function commit(option: ComboOption) {
    onChange(option);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const option = filtered[highlighted];
      if (option) commit(option);
    }
  }

  const listboxId = `${id}-listbox`;

  return (
    <div ref={rootRef} className="relative">
      <label htmlFor={id} className="block text-caption text-ink-muted">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>

      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        className={`mt-2 flex h-11 w-full items-center justify-between gap-3 rounded-sm border px-4 text-start text-[16px] transition duration-fast ease-k ${
          disabled
            ? "cursor-not-allowed border-line bg-surface-sunken text-ink-subtle"
            : open
              ? "border-brand-700 bg-surface text-ink"
              : "border-line-strong bg-surface text-ink hover:border-brand-400"
        }`}
      >
        <span className={`truncate ${selected ? "" : "text-ink-subtle"}`}>
          {disabled ? (disabledHint ?? placeholder) : (selected?.name ?? placeholder)}
        </span>
        <IconChevronDown
          className={`h-4 w-4 shrink-0 text-ink-subtle transition-transform duration-base ease-k ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full z-20 mt-1 overflow-hidden rounded-sm border border-line-strong bg-surface shadow-2">
          <div className="relative border-b border-line">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="ابحث…"
              aria-label={`ابحث في ${label}`}
              aria-autocomplete="list"
              aria-controls={listboxId}
              className="h-11 w-full bg-transparent px-4 pe-10 text-[16px] text-ink placeholder:text-ink-subtle focus-visible:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                aria-label="مسح البحث"
                className="absolute end-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-pill text-ink-subtle hover:text-ink"
              >
                <IconClose className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-label={label}
            className="max-h-64 overflow-y-auto py-1"
          >
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-body-sm text-ink-subtle">{emptyLabel}</li>
            )}
            {filtered.map((option, i) => {
              const isSelected = option.id === value;
              return (
                <li key={option.id} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => commit(option)}
                    onMouseEnter={() => setHighlighted(i)}
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-start text-body-sm transition-colors duration-fast ease-k ${
                      i === highlighted ? "bg-brand-100 text-ink" : "text-ink"
                    } ${isSelected ? "font-semibold" : ""}`}
                  >
                    {option.name}
                    {isSelected && <span className="text-brand-700">✓</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
