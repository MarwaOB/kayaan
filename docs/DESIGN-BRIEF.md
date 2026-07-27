# Kayaaan — Design Brief

What the redesign has to achieve, and where each requirement comes from. This is
the *what*; `DESIGN-SYSTEM.md` is the *how*.

Sources:

- **`docs/Kayaan.pdf`** — client's inspiration notes (2 pages, with screenshots).
  Quoted verbatim below as **[PDF]**.
- **`docs/kayaaan-website-full-spec.md`** — the agreed functional spec. **[SPEC §n]**.
- **Live site** — <https://www.kayaaanclothing.com/> (the version being replaced).

The brand identity is **not** in scope for change. Same logos, same colours, same
Arabic voice. What changes is craft: typography, spacing, imagery treatment,
motion, and the consistency of the component set.

---

## 1. Reference boards

### 1.1 Based on Love — <https://basedonloveofficial.com>

> **[PDF]** "apply this idea in my platform"
> **[PDF]** "Large screens, main image would be swipable (no gap between images),
> get inspired from this website. Same thing for mobile (no small rectangles)."

What to take:

| Element | Decision |
| --- | --- |
| Hero | Full-bleed, edge-to-edge slides. **Zero gutter between slides**, no rounded corners, no card framing. The image touches the viewport edges. |
| Slide peek | On ≥1024px the next slide peeks in at the leading edge so the carousel reads as swipeable without controls. |
| Controls | Circular, low-contrast, vertically centred, overlaid on the image. No dots-only navigation on desktop. |
| Mobile | One slide fills the full viewport width. **Never** a row of small rectangles with margins. |
| WhatsApp | Persistent floating bubble, bottom-leading corner (bottom-right in RTL = bottom-left visually — see `DESIGN-SYSTEM.md` §8). |
| Hotspots | Dot markers on lifestyle photos → panel with name/price/CTA. **[SPEC §7.4]** |

What **not** to take: their monochrome black palette. Kayaaan stays cream +
espresso.

### 1.2 Kith — <https://kith.com>

> **[PDF]** "Menu of https://kith.com/ (use categories then write other sections
> like privacy….)"

| Element | Decision |
| --- | --- |
| Menu | Mega-menu: sub-navigation rail on one side, large lifestyle image on the other. Categories first, then info/policy pages in the same structure. **[SPEC §10]** |
| PDP layout | Vertical thumbnail rail beside a large main image; details column alongside. **Mirrored for RTL** — thumbnails on the right, details on the left. |
| PDP details | Title → price → colour → size chips → size-guide link → primary CTA → accordions (description / care / shipping). |
| Type | Small, wide-tracked uppercase labels against a large product image. Adapted to Arabic: tracking does not apply to Arabic script — use size and weight contrast instead (see `DESIGN-SYSTEM.md` §3.4). |

### 1.3 Jana Store — running bar

> **[PDF]** "Running bar inspired from (jana store), add it in my website."
> **[SPEC §6.5]**

Blush (`--k-blush`) bar, four icon + label items, evenly spaced, rounded
container:

الدفع عند الاستلام · توصيل 58 ولاية · خدمة العملاء · إمكانية التخصيص

Static evenly-spaced row on ≥768px; marquee on smaller widths where four items
cannot fit. Marquee stops under `prefers-reduced-motion`.

---

## 2. Hard requirements from the PDF

| # | Requirement | Design implication |
| --- | --- | --- |
| R1 | "The whole website should be in arabic, no english, no french." | Every string in the UI is Arabic. The only Latin permitted is the **KAYAAAN** logotype inside the logo asset itself. `dir="rtl"` throughout. Numerals: see §3 below. |
| R2 | "Embedded video: possible to be changed by the admin" | Video block on the home page, 16:9, poster frame required, source driven by site settings. Never autoplay with sound. |
| R3 | "Non savable images" | `contextmenu` and `dragstart` suppressed, `user-select: none`, `-webkit-touch-callout: none`. **Deterrent only** — the spec already records that this is accepted as cosmetic. Do not build anything that degrades load performance or accessibility in pursuit of it. |
| R4 | "Use local storage, once the user enters, his info will be saved." | Checkout fields (name, phone, wilaya, commune, address) persist per device and prefill on return. Same mechanism as favourites. **[SPEC §8]** Show a visible "نحفظ معلوماتك على هذا الجهاز فقط" note — it is a privacy affordance, not a hidden behaviour. |
| R5 | Kith-style menu | §1.2 above. |
| R6 | Swipable full-bleed main image | §1.1 above. |
| R7 | Running bar | §1.3 above. |
| R8 | "Pop up for the size guide (product page)" | Modal, not a route change. Focus-trapped, `Esc` closes, scroll locked behind it. |
| R9 | "Feedback under each product" | Reviews block on every PDP, below the trust section. **[SPEC §7.14]** |
| R10 | "Use iphone emojis" | Emoji render from the Apple set where available via the font stack in `DESIGN-SYSTEM.md` §3.5. Emoji are **content**, not controls: interactive affordances (cart, favourite, close, nav) use real icons so they stay legible, colourable, and accessible. |

### 3. Numerals — decision needed, defaulted

Arabic-Indic (`٥٬٠٠٠ د.ج`) vs Western (`5,000 د.ج`). Algerian retail overwhelmingly
uses Western digits for prices, and the current code's `toLocaleString("ar-DZ")`
produces Arabic-Indic — an inconsistency with the live site.

**Defaulting to Western digits** (`ar-DZ-u-nu-latn`) for prices, quantities,
phone numbers, and order numbers, with Arabic script for all words. Flagged for
the client to confirm; changing it later is a one-line change in the price
formatter.

---

## 4. Build audit

The original audit of `src/`, with the state of each item. Home, header, footer,
product card, PDP, cart, checkout and the information pages were done first;
**the four listing pages and the bundle page followed** (see §4.1).

| Area | Was | Now |
| --- | --- | --- |
| Logo | The literal string `كيان` in a `<Link>` | ✅ Real asset via `<Logo />` — wordmark in the header, horizontal lockup in the footer and menu, stacked in the Instagram band |
| Typography | `Tahoma, Arial, sans-serif` | ✅ Almarai + IBM Plex Sans Arabic, self-hosted via `next/font` |
| Borders | `stone-200` / `stone-300` / `neutral-200` mixed arbitrarily | ✅ One `--k-line` token |
| Radii | Seven different values including `rounded-[1.25rem]` and `rounded-[2rem]` | ✅ Four-step scale |
| Shadows | `shadow-sm` / `shadow` / `shadow-2xl` on cards, chips, buttons | ✅ Two steps; product cards carry none |
| Hero | Card-framed carousel | ✅ Full-bleed scroll-snap, zero gutter, desktop peek (R6) |
| Product card | `rounded-xl` + `shadow-sm` + emoji heart with an inline `style={{ top: 8 }}` | ✅ Chrome-free tile, icon button, logical inset properties |
| Imagery | `/images/seed/*.svg` placeholders | ✅ Real photography everywhere on the home page; zero seed SVGs remain |
| Colour | Six ad-hoc hexes | ✅ Same hexes inside the full logo-derived ramp |
| Latin eyebrows | "Shop by Category", "Best Sellers", "Bundles & Duos" | ✅ Removed (R1). Replaced by the numbered `SectionHeader` |
| `tracking-*` on Arabic | Several instances in `Header.tsx` | ✅ Removed (§3.4) |
| Emoji as controls | 🛍️ cart, ♡/❤️ favourite, 💬 WhatsApp, ⭐ ratings | ✅ Real SVG icons; emoji kept for content only (R10) |
| Prices | `toLocaleString("ar-DZ")` → `٣٬٨٠٠`, redefined in 7 files | ✅ One `formatDZD` → `3 800 د.ج` (§3) |
| PDP gallery | One image in a `rounded-[2rem]` bordered card | ✅ Kith rail + large image on desktop, full-bleed zero-gap strip on mobile, pointer zoom |
| PDP hotspots | Dots opening a third side column | ✅ Anchored popovers on the photo — **deviates from spec §7.4, see below** |
| Size guide | Overlay with no Esc, focus trap, or scroll lock | ✅ Shared `Modal`, portalled to `<body>`, all four close paths |
| PDP info | Tabs (second panel invisible until clicked) | ✅ Accordions, per the Kith reference |
| Mobile PDP | Add-to-cart off-screen for most of the page | ✅ Sticky buy bar driven by IntersectionObserver |
| Cart & checkout chrome | Bare `<main>` — no logo, nav, or way back | ✅ Cart gets full chrome; checkout gets a deliberately minimal header (every nav link on a checkout is an exit) |
| Cart | Flat list, ✕ removes instantly | ✅ Sticky summary, quantity stepper, 10-second undo on remove, photographic empty state |
| Wilaya / commune | Native `<select>` over 58 wilayas | ✅ Searchable `Combobox`, tolerant of Arabic spelling (قسنطينه finds قسنطينة) |
| Delivery choice | Two text buttons | ✅ Cards showing the real fee for each method at the moment of choosing |
| Saved details (R4) | Not implemented | ✅ Persisted after a successful order, restored with a visible notice and a "clear" control |
| Order confirmation | "Order received", then nothing | ✅ Four-step explanation of what happens next |
| Store hydration | `skipHydration` documented but never set — server/client mismatch on every page with a badge | ✅ Set, with a shared hydration flag; skeletons instead of a flash of "empty cart" |
| **Admin UI** | Not in scope | ⬜ Untouched by design |

### 4.1 Listing pages

The four product-listing pages (`/categories/[slug]`, `/collections/[slug]`,
`/top-selling`, `/favorites`) and `/bundles/[slug]` were the last routes still on
the pre-redesign idiom — `rounded-3xl` white boxes, `neutral-*` borders,
`shadow-sm`, dashed-border empty states.

| Area | Was | Now |
| --- | --- | --- |
| Page opening | White `rounded-3xl` card holding a 24px title and a grey line | ✅ `ListingHero` — full-bleed photograph, scrim, breadcrumb, display title, piece count. Tinted band where there is no photo |
| Narrowing a list | Nothing. Every listing page was an unfiltered, unsorted grid | ✅ Faceted filter + sort (`src/lib/listing.ts`): size, colour, price band, availability, on-sale, with per-option result counts |
| Filter surface | — | ✅ Inline panel ≥1024px (live results); the shared `Modal` as a bottom sheet below it, with a "عرض N قطعة" CTA that updates as you choose |
| Applied filters | — | ✅ Removable chips plus "مسح الكل"; a distinct empty state for "filters excluded everything" |
| Facet adaptivity | — | ✅ A group with fewer than two values is dropped; price banding switches off on short or narrow-priced pages; stock/sale toggles appear only when the page contains one |
| Lateral browsing | A category page was a cul-de-sac — no route to a sibling category except back through the header | ✅ `CategoryRail` scroll-snap strip under the masthead |
| Long grids | An unbroken wall of tiles | ✅ Full-bleed editorial frames spliced between rows, suppressed the moment a filter is applied |
| Top selling | A flat grid — every tile the same size, so the ranking was invisible | ✅ First three ranked with wall-label numerals, №1 full-width on mobile |
| Favourites | Bare `<main>` — no chrome. Refetched everything on each heart tap; a failed fetch was indistinguishable from an empty list | ✅ Full chrome via a layout, ID-keyed cache (instant removal), skeleton grid, and distinct copy for a network failure |
| Bundle | Bundle price as a small pink pill; items nested in bordered white boxes | ✅ Saving is the headline — struck full price, bundle price, difference in dinars *and* percent, derived from the items shown |
| Empty states | Dashed border + one grey sentence | ✅ Photographic `ListingEmpty` with a route onward |
| Sticky offset | — | ✅ `--k-header-h`, published by `Header.tsx` at its measured height (§4.4) |

### Open deviation — hotspots

Spec §7.4 says a hotspot displays the linked article "on the right side of the
screen". It is implemented as a card anchored to the dot instead: it keeps the
link between mark and garment obvious and leaves the purchase panel undisturbed,
where a third column would squeeze both. **Worth confirming with the client** —
it is the one place the build knowingly departs from the written spec.

---

## 5. Definition of done

A section is finished when:

1. Every string is Arabic and the layout is correct at `dir="rtl"`.
2. It uses only tokens from `DESIGN-SYSTEM.md` — no raw hex, no ad-hoc radius, no
   `stone-*`/`neutral-*` borders.
3. It holds up at 360px, 768px, 1280px and 1920px.
4. Images come from the manifest with width/height set (no layout shift) and a
   blur placeholder.
5. Interactive elements are reachable by keyboard, have a visible focus ring, and
   carry an Arabic `aria-label` where the label is an icon.
6. Motion is disabled under `prefers-reduced-motion`.
7. Text on brand surfaces meets 4.5:1 — the pairings in `DESIGN-SYSTEM.md` §2.4
   are pre-checked.
