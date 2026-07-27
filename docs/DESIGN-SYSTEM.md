# Kayaaan — Design System

The single source of truth for visual decisions. Every token here exists in code
as a CSS custom property in `src/app/globals.css` and as a Tailwind utility in
`tailwind.config.js`. **If a value isn't in this file, it doesn't go in a
component.**

Companion documents: `DESIGN-BRIEF.md` (requirements and references),
`kayaaan-website-full-spec.md` (functionality).

---

## 1. Design direction

**Editorial streetwear on a warm canvas.**

The product photography is strong — high-contrast garments, real models, graphic
Arabic prints. The interface's job is to get out of its way. That means a cream
field, espresso ink, sand accents, big images, tight type, and almost no chrome.

Five principles, in priority order when they conflict:

1. **The photograph is the design.** Full-bleed where possible, generous margins
   everywhere else. No decorative gradients, patterns, or illustration competing
   with the garment.
2. **Warm, not beige.** The palette is low-chroma but never grey. Neutral greys
   (`stone-*`, `neutral-*`, `#ccc`) are banned — use the warm ramp in §2.
3. **Arabic-first, genuinely.** RTL is the default reading direction, not a
   mirrored afterthought. Type sizes and line-heights are set for Arabic, which
   needs more of both than Latin.
4. **Restraint over decoration.** One radius scale, two elevation steps, one
   accent. A page that needs a third shadow depth has a layout problem.
5. **Fast on a mid-range Android on 3G.** That is the actual customer device.
   Every visual decision is also a payload decision.

---

## 2. Colour

### 2.1 Brand ramp

Derived from the logo masters — the hexes below were sampled from the artwork,
so they match the shipped brand assets exactly.

| Token | Hex | Source | Use |
| --- | --- | --- | --- |
| `--k-brand-50` | `#f6f0ea` | derived | Tinted section backgrounds |
| `--k-brand-100` | `#ece0d4` | derived | Hover fills, chip backgrounds |
| `--k-brand-200` | `#e5d2b8` | **logo — sand** | Accent surfaces, logo on dark |
| `--k-brand-300` | `#c9a876` | existing `accent` | Highlights, active underline |
| `--k-brand-400` | `#9e816d` | **logo — taupe** | Secondary marks, muted brand text |
| `--k-brand-500` | `#865e5d` | **logo — rosewood** | Alternate mark, hover states |
| `--k-brand-600` | `#6b4a35` | existing `brown` | Buttons, badges, links |
| `--k-brand-700` | `#654746` | **logo — espresso** | **Primary.** Logo default, headings |
| `--k-brand-800` | `#4a3224` | existing `brownDark` | Pressed states, price text |
| `--k-brand-900` | `#2e1f16` | derived | Footer field, overlays |

Every colour the site already used is preserved — `brown`, `brownDark`, and
`accent` sit at 600/800/300. Nothing is being recoloured; the ramp fills in the
steps that were missing.

### 2.2 Surface & ink

| Token | Hex | Use |
| --- | --- | --- |
| `--k-bg` | `#faf7f2` | Page canvas (existing) |
| `--k-surface` | `#ffffff` | Cards, modals, sheets |
| `--k-surface-sunken` | `#f2ece3` | Image wells, empty states, inputs |
| `--k-line` | `#e6ddd1` | **The** hairline. Replaces every `stone-200` / `neutral-200`. |
| `--k-line-strong` | `#d6c9b8` | Input borders, dividers needing weight |
| `--k-ink` | `#1c1917` | Body text (existing) |
| `--k-ink-muted` | `#6b625a` | Secondary text, captions |
| `--k-ink-subtle` | `#9a8f85` | Placeholders, disabled, meta |
| `--k-blush` | `#f7e6e6` | Running-bar background only (existing `pink`) |

### 2.3 Semantic

| Token | Hex | Use |
| --- | --- | --- |
| `--k-success` | `#3f6f4f` | In stock, order confirmed |
| `--k-danger` | `#9b2c2c` | Out of stock, form errors, sale badge |
| `--k-warning` | `#b4761f` | Low stock, pending payment |
| `--k-focus` | `#654746` | Focus ring (2px, 2px offset) |

Warm-tuned deliberately — a stock `#ef4444` reads as a foreign object on this
canvas.

### 2.4 Pre-checked contrast pairings

Use these. Do not invent new foreground/background combinations without checking.

| Foreground | Background | Ratio | Verdict |
| --- | --- | --- | --- |
| `--k-ink` `#1c1917` | `--k-bg` `#faf7f2` | 16.4:1 | ✅ any size |
| `--k-ink-muted` `#6b625a` | `--k-bg` | 5.6:1 | ✅ any size |
| `--k-ink-subtle` `#9a8f85` | `--k-bg` | 3.0:1 | ⚠️ **decorative / disabled only** |
| `--k-brand-700` `#654746` | `--k-bg` | 7.7:1 | ✅ any size |
| `--k-brand-600` `#6b4a35` | `--k-bg` | 7.4:1 | ✅ any size |
| `#ffffff` | `--k-brand-700` | 8.3:1 | ✅ any size — **primary button** |
| `#ffffff` | `--k-brand-600` | 7.9:1 | ✅ any size |
| `--k-brand-200` `#e5d2b8` | `--k-brand-900` `#2e1f16` | 10.8:1 | ✅ — **footer, dark sections** |
| `--k-brand-400` `#9e816d` | `--k-bg` | 3.4:1 | ⚠️ ≥24px or ≥19px bold only |
| `--k-brand-300` `#c9a876` | `--k-bg` | 2.1:1 | ❌ **never for text.** Rules, borders, fills only. |
| `--k-ink` | `--k-blush` `#f7e6e6` | 14.5:1 | ✅ — running bar |
| `#ffffff` | `--k-danger` `#9b2c2c` | 7.5:1 | ✅ — sale badge, errors |
| `#ffffff` | `--k-success` `#3f6f4f` | 5.8:1 | ✅ — in-stock pill |

Text over photography always needs a scrim: `linear-gradient(to top,
rgb(46 31 22 / .78), transparent 60%)`. Never rely on the image being dark.

### 2.5 Logo colourways

18 assets in `public/brand/`, named `kayaan-{mark}-{colourway}.{png,webp}`.

**Marks**

| Mark | Contents | Use |
| --- | --- | --- |
| `wordmark` | Arabic كيان alone | Header, favicon, tight spaces |
| `lockup-horizontal` | Arabic + KAYAAAN CLOTHING, side by side | Footer, email, wide headers |
| `lockup-stacked` | Arched KAYAAAN over Arabic | Hero overlays, loading state, social |
| `badge-framed` | Double-ruled frame | Packaging, stamps, certificates — **not** UI chrome |
| `tile-solid` | Full-bleed knockout tile | Social avatar, OG image, app icon |

**Colourways:** `espresso` `#654746` (default, on light) · `sand` `#e5d2b8`
(on dark/photo) · `taupe` `#9e816d` (muted/secondary) · `rosewood` `#865e5d`
(alternate — `wordmark` and `lockup-horizontal` have no rosewood master).

**Rules**

- Clear space on all sides ≥ the height of the Arabic ن.
- Minimum width: `wordmark` 88px, `lockup-horizontal` 180px, `lockup-stacked` 120px.
- Never recolour, outline, rotate, add effects to, or place the logo on a busy
  area of a photograph. Pick the colourway that already fits.

Access them through `<Logo />` (`src/components/brand/Logo.tsx`) rather than
hardcoding paths.

---

## 3. Typography

### 3.1 Families

The site is Arabic-only, so the Arabic face **is** the brand voice — `Tahoma`
(what's currently shipping) is a system fallback with poor Arabic shaping and
no weight range.

| Role | Family | Weights | Notes |
| --- | --- | --- | --- |
| Display | **Almarai** | 700, 800 | Geometric, high-contrast. Headlines, hero, section titles. |
| Body / UI | **IBM Plex Sans Arabic** | 400, 500, 600 | Excellent shaping, wide weight range, tuned for screens. |
| Numerals | IBM Plex Sans Arabic, `tnum` | 400–600 | Tabular figures for prices and totals so columns align. |

Both are on Google Fonts with open licences. Load via `next/font/google` with
`subsets: ["arabic"]` and `display: "swap"` so they are self-hosted, preloaded,
and never block render. Never load them from a CDN `<link>`.

The Latin serif in the logo is **artwork, not a typeface choice** — do not try to
match it in body copy.

### 3.2 Scale

Arabic sits lower and needs more vertical room than Latin at the same size —
these line-heights are deliberately looser than a Latin scale.

| Token | Size | Line-height | Weight | Use |
| --- | --- | --- | --- | --- |
| `display-1` | `clamp(2.25rem, 6vw, 4rem)` | 1.15 | 800 | Hero headline |
| `display-2` | `clamp(1.75rem, 4vw, 2.75rem)` | 1.2 | 800 | Section headline |
| `h1` | `1.75rem` | 1.35 | 700 | Page title |
| `h2` | `1.375rem` | 1.4 | 700 | Section title |
| `h3` | `1.125rem` | 1.5 | 600 | Card title, accordion header |
| `body-lg` | `1.0625rem` | 1.75 | 400 | Long-form Arabic (about, policies) |
| `body` | `0.9375rem` | 1.7 | 400 | Default |
| `body-sm` | `0.875rem` | 1.65 | 400 | Card meta, helper text |
| `caption` | `0.8125rem` | 1.5 | 500 | Badges, labels, breadcrumbs |
| `price` | `1.0625rem` | 1.3 | 700 | Price, `tnum`, `--k-brand-800` |

**Minimum body size is 15px.** Arabic diacritics and dot placement degrade badly
below that.

### 3.3 Measure

Long-form Arabic caps at `68ch`. Product descriptions cap at `56ch`.

### 3.4 Letter-spacing — Arabic

**Never apply `letter-spacing` to Arabic text.** It breaks the cursive joins and
makes words unreadable. The current codebase does this in several places
(`tracking-[0.3em]` on Arabic labels in `Header.tsx`) — those are bugs.

Where a Latin design would reach for wide-tracked uppercase eyebrows, Arabic uses
**size and weight contrast** instead: `caption` at weight 500 in
`--k-brand-600`, optionally with a 24px rule beside it.

`letter-spacing` is permitted only on Latin strings, which in practice means the
logo artwork alone.

### 3.5 Emoji

Per the brief (R10), emoji should render from the Apple set where the device has
it:

```css
--k-font-emoji: "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif;
```

Applied via the `.emoji` utility. Emoji carry **content** meaning (🤎 in brand
copy, 🔥 on a trending product). Interactive controls — cart, favourite, close,
navigation — use real SVG icons: they inherit `currentColor`, scale cleanly,
stay legible at 16px, and can be labelled for screen readers. Android will not
render Apple's glyphs, so no affordance may depend on a specific emoji design.

Any emoji conveying meaning needs `role="img"` and an Arabic `aria-label`;
decorative ones get `aria-hidden="true"`.

---

## 4. Space, radius, elevation

### 4.1 Spacing

4px base: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128`.

Section rhythm: `64px` mobile, `96px` tablet, `128px` desktop between top-level
home sections. Consistent vertical rhythm does more for perceived quality here
than any individual component change.

### 4.2 Radius

Four steps. The current code uses seven.

| Token | Value | Use |
| --- | --- | --- |
| `--k-radius-xs` | `6px` | Badges, chips, size selectors |
| `--k-radius-sm` | `10px` | Buttons, inputs, small controls |
| `--k-radius-md` | `14px` | Product cards, tiles, media |
| `--k-radius-lg` | `20px` | Modals, sheets, mega-menu panels |
| `--k-radius-pill` | `999px` | Counters, carousel controls, avatars **only** |

**`0` for full-bleed media** — hero slides, edge-to-edge gallery, category
banners. Per the brief (R6), the hero touches the viewport edges with no
rounding and no gap.

### 4.3 Elevation

| Token | Value | Use |
| --- | --- | --- |
| `--k-shadow-none` | `none` | **Default.** Product cards, tiles, sections. |
| `--k-shadow-1` | `0 1px 2px rgb(28 25 23 / .06)` | Sticky header once scrolled, input focus |
| `--k-shadow-2` | `0 8px 24px -12px rgb(28 25 23 / .18)` | Modals, mega-menu, dropdowns |

Depth comes from `--k-line` and background contrast, not shadow. A product card
with a drop shadow on a cream page looks like a 2016 template — the current
`shadow-sm` on cards and chips should come off.

### 4.4 Layout

| Token | Value |
| --- | --- |
| `--k-container` | `1200px` — text and form content |
| `--k-container-wide` | `1440px` — product grids, carousels |
| `--k-header-h` | Height of the sticky header — `top-header` in Tailwind |
| Full-bleed | `bleed-k` — **only for an element inside a container** |
| Gutter | `16px` / `24px` ≥768px / `32px` ≥1280px |

`bleed-k` escapes a centred container by sizing to `100vw`. If the element's
parent is already document-width — anything sitting directly in `<main>` — it is
full-bleed already and needs no utility; adding one forces `100vw`, which is the
viewport *including* the scrollbar and therefore wider than the page. `html`
carries `overflow-x: clip` to absorb that difference for the cases that genuinely
need it (`clip`, never `hidden` — `hidden` creates a scroll container and breaks
every `position: sticky` on the site).

`--k-header-h` carries measured defaults (`4.5rem`, `7.75rem` ≥768px) and is
overwritten with the header's real height by a `ResizeObserver` in
`Header.tsx`. Anything pinning below the header uses `top-header` rather than a
hand-counted offset — a four-pixel error there shows a sliver of the page
scrolling between the two bars.

**Product grid:** 2 columns at 360px, 3 at 768px, 4 at 1280px. Two columns on
mobile with full-width tiles — per the brief (R6), never a row of small
rectangles.

---

## 5. Motion

| Token | Value | Use |
| --- | --- | --- |
| `--k-ease` | `cubic-bezier(.2, .8, .2, 1)` | Everything |
| `--k-dur-fast` | `120ms` | Hover, focus, colour change |
| `--k-dur-base` | `220ms` | Card lift, accordion, chip select |
| `--k-dur-slow` | `420ms` | Modal, drawer, carousel slide |

Animate `transform` and `opacity` only. Never `width`, `height`, `top`, or
`box-shadow` — they force layout on exactly the low-end devices this site is for.

Hover on a product card: image `scale(1.03)` over `--k-dur-base`. Nothing else
moves — no lift, no shadow, no border change.

**`prefers-reduced-motion: reduce` must:** stop the running-bar marquee, stop
carousel autoplay (manual navigation still works), and reduce all durations to
`0.01ms`. This is enforced globally in `globals.css`.

---

## 6. Components

Specs below are binding. Anything not listed inherits from these.

### 6.1 Button

| Variant | Fill | Text | Border | Use |
| --- | --- | --- | --- | --- |
| Primary | `--k-brand-700` | `#fff` | none | Add to cart, confirm order |
| Secondary | transparent | `--k-brand-700` | 1px `--k-line-strong` | Size guide, view more |
| Ghost | transparent | `--k-ink` | none | Tertiary, in-card actions |
| Danger | `--k-danger` | `#fff` | none | Destructive admin actions |

Height 44px (48px for the PDP primary CTA — it is the money button). Padding
`0 24px`. Radius `--k-radius-sm`. Hover darkens one ramp step; active darkens
two. Disabled: `--k-surface-sunken` fill, `--k-ink-subtle` text, no pointer
events. Every button is ≥44×44px of touch target.

### 6.2 Product card

Image (`4:5`, `--k-radius-md`, `object-cover`) → name (`body-sm`, 1 line, ellipsis)
→ price row. No shadow, no border, no card background — it sits directly on the
canvas.

Overlays, positioned with logical properties (`inset-inline-start`, never
`left`):

- Discount badge — top **start**, `--k-danger`, `caption`, `-15%`
- Trending 🔥 — top start, below discount when both present
- Favourite — top **end**, 36px circular button, `--k-surface` at 90%, heart icon
  (filled `--k-danger` when active). An icon button, not an emoji.
- Out of stock — bottom start, `--k-brand-900` at 85%, `#fff`, "نفدت الكمية".
  The card stays fully visible; per spec §5 out-of-stock products are never hidden.

### 6.3 Running bar (brief §1.3)

`--k-blush` background, full-bleed, 56px tall. Four icon + label items,
`caption` in `--k-ink`, 20px icons in `--k-brand-600`, evenly distributed.
Marquee below 768px only; `aria-hidden` on the duplicated marquee track so
screen readers hear the list once.

### 6.4 Hero carousel (brief §1.1)

Full-bleed, zero gap, no radius. `100vw` per slide on mobile; `92vw` with the
next slide peeking at the leading edge on ≥1024px. Circular 44px controls,
`--k-surface` at 85%, vertically centred, inset 16px. Scrim at the bottom for
overlaid text. `aspect-ratio` fixed per breakpoint (`4:5` mobile, `16:9`
desktop) so nothing shifts on load. Swipe via CSS scroll-snap — no JS carousel
library.

### 6.5 PDP gallery (brief §1.2)

Vertical thumbnail rail on the **right** (leading edge in RTL), large main image
on the left. Below 1024px the rail becomes a horizontal scroll-snap strip under
the main image. Thumbnails 64px, `--k-radius-xs`, active thumbnail gets a 2px
`--k-brand-700` border. Zero gap between gallery images in the scroll strip.
`user-select: none` and `oncontextmenu` suppression per brief R3.

### 6.6 Size guide modal (brief R8)

`--k-radius-lg`, `--k-shadow-2`, max 560px wide, `--k-brand-900` at 45% backdrop
with a 4px blur. Focus trapped, `Esc` closes, focus returns to the trigger, body
scroll locked. Never a route change.

### 6.7 Listing page

Shared by `/categories`, `/collections`, `/top-selling`, `/favorites`
(`src/components/listing/`). Order down the page:

`ListingHero` (breadcrumb → full-bleed photo, scrim, `display-1` title, piece
count) → `CategoryRail` where siblings exist → sticky toolbar → applied-filter
chips → grid.

- **Toolbar** pins at `top-header`, `z-30`, `--k-bg` at 90% with a blur. Filter
  button (with an active-count badge), live result count, sort `<select>`.
- **Filters** are an inline panel ≥1024px and the `Modal` bottom sheet below it
  — one state, one set of fields. Every option carries the count it would
  return; a zero-count option is disabled, never hidden.
- **Facets are adaptive.** A group with fewer than two distinct values is not
  rendered. Price banding is derived from the catalogue and switches off below
  six products or a 1000 DZD range.
- **Grid** is 2 / 3 / 4 columns (§4.4), `gap-y` 40px rising to 56px, staggered
  reveal across the row.
- **Editorial breaks**: a full-bleed frame every 8 tiles, `col-span-full` +
  `bleed-k`. Suppressed while any filter is applied.

### 6.8 Form field

Label `caption` above, input 44px, `--k-surface` fill, 1px `--k-line-strong`,
`--k-radius-sm`, `16px` text — **anything smaller triggers iOS zoom on focus**.
Focus: 2px `--k-focus` ring at 2px offset. Error: `--k-danger` border plus a
message below in `body-sm`; never colour alone.

---

## 7. Imagery

All web derivatives are produced by `npm run assets:prepare` from the masters in
`/images` (gitignored). Never reference `/images/**` from the app, and never
commit a camera original.

- Manifest: `src/data/media-manifest.json` — 85 product images across 8 articles
  (`summer` / `winter` × `dz` / `gaza` / `hourria` / `sinwar`), plus the 18 logo
  assets.
- Widths: 400 / 800 / 1600 WebP. Every entry carries `width`, `height`,
  `aspect`, and a `blurDataURL`.
- Product crops are `4:5`. Lifestyle and hero images are `16:9` on desktop,
  `4:5` on mobile.
- Always set `width`/`height` (or `aspect-ratio`) — no layout shift.
- Above-the-fold hero image: `priority`. Everything else: lazy.
- Arabic `alt` on every content image. Decorative images get `alt=""`.

The `/images/seed/*.svg` placeholders are dead once a section is migrated —
delete them as you go rather than leaving both.

---

## 8. RTL

`dir="rtl"` on `<html>` is set. Beyond that:

- **Logical properties only.** `margin-inline-start`, not `margin-left`.
  `inset-inline-end`, not `right`. In Tailwind: `ms-*`/`me-*`/`ps-*`/`pe-*`
  and `start-*`/`end-*` — never `ml-*`/`left-*`.
- Icons that indicate **direction** (chevrons, arrows, "next") mirror. Icons that
  represent **objects** (cart, heart, search, play) do not.
- Carousels advance right-to-left. "Next" moves the content leftward.
- Prices: `5,000 د.ج` — Western digits, currency after the number, per the brief §3.
- Phone numbers and Latin-script strings inside Arabic paragraphs need
  `dir="ltr"` on their own element or they scramble.
- The WhatsApp bubble sits at `inset-inline-end` — visually bottom-left in RTL.

Test every layout at both `dir` values. A component that only works in one is
using physical properties somewhere.

---

## 9. Accessibility floor

Non-negotiable, checked as part of §5 of the brief:

- Text contrast ≥4.5:1 (≥3:1 at ≥24px). Use the §2.4 table.
- Visible focus ring on every interactive element — 2px `--k-focus`, 2px offset.
  Never `outline: none` without a replacement.
- Icon-only controls carry an Arabic `aria-label`.
- Modals and the mega-menu trap focus and restore it on close.
- Full keyboard operability: the carousel, gallery, size chips, and accordions
  all need it.
- `prefers-reduced-motion` honoured (§5).
- Colour is never the only signal — out-of-stock, errors, and selected states all
  carry text or an icon too.
