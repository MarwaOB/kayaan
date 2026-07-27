# Kayaaan Clothing — Build Progress Tracker

Source of truth: `kayaaan-website-full-spec.md`. This file tracks what's been
built, what's stubbed, and what's next — update it at the end of every phase.

---

## Phase 1 — Data model & API layer ✅ DONE

**Goal:** get the security-critical part (§3, §14.1) right and testable
before any UI gets built on top of it.

| Item | Status | File |
|---|---|---|
| Full Prisma schema (products, variants, categories, collections, bundles, orders, coupons, blocked numbers, reviews, hotspots) | ✅ | `prisma/schema.prisma` |
| Owner-only field split (cost/rawPrice/sponsorSpend/profit never in public queries) | ✅ | `src/lib/queries/publicProduct.ts` |
| Admin full-row queries, auth-gated | ✅ | `src/lib/queries/adminProduct.ts`, `src/lib/adminAuth.ts` |
| Category mask/unmask (§4) | ✅ | `setCategoryVisibility()` + `/api/admin/categories/:id/mask` |
| Order status pipeline w/ transition validation (§14.7) | ✅ | `src/lib/orderStatus.ts` |
| Transactional checkout w/ stock decrement (§14.6) | ✅ | `src/lib/checkout.ts` |
| WhatsApp order-confirmation recap message (no OTP — removed per client decision) | ✅ code, ⬜ needs real Meta credentials + approved Utility template | `src/lib/whatsapp.ts`, `src/lib/orderConfirmationMessage.ts` |
| Public + admin API routes | ✅ | `src/app/api/**` |
| CI security test (owner-only fields never leak) | ✅ written, **not yet run** (see blocker below) | `tests/publicProduct.test.ts` |
| Seed data | ✅ | `prisma/seed.ts` |

**⚠️ Known blocker, resolved (2026-07-08):** Supabase PostgreSQL is live,
`prisma generate`/`migrate deploy`/`seed`/`build` all pass locally. Run
`npm test` against the configured `.env` database to verify the security suite.

---

## Phase 2 — Storefront UI (§6, §7, §9) 🚧 IN PROGRESS — core storefront and checkout flow are now in place

**Goal:** build the customer-facing site, section by section, in the exact
order specified in §6 (home) and §7 (product page).

### Recent implementation update (2026-07-08)
- Added missing storefront route pages for categories, collections, bundles, and top-selling to remove the 404s from the home-page navigation.
- Removed the runtime Google Fonts dependency and switched to a local/system-font fallback so the dev server no longer fails on font fetches.
- Verified the app with `npm run build`, `npx prisma db seed`, and `npm test`.

| Section | Spec ref | Status |
|---|---|---|
| Tailwind setup, RTL-aware base layout | — | Done |
| `SiteSetting` model for admin-editable content | §14.11 | Done |
| Cart + favorites store (Zustand, localStorage) | §8, §13 | Done |
| Product card component | §5 | Done |
| Top banner (swipeable announcement) | §6.1 | Done |
| Header (logo, cart, favorites, hamburger to mega-menu) | §6.2, §10 | Done |
| Hero cover/carousel | §6.3 | Done — now uses richer local visuals and fallback slides when data is sparse |
| New drops carousel | §6.4 | Done |
| Embedded video + running bar (both, stacked) | §6.5 | Done — now shows a polished placeholder when no video is configured |
| Category tiles (respecting mask/unmask) | §6.6 | Done — now renders a stronger fallback card layout |
| Top Selling (top 4 products) | §6.7 | Done — uses `trending` flag as proxy, see note below; now includes local fallback cards |
| Bundles/Duos section | §6.8 | Done — now shows a richer, card-based layout with fallback content |
| Collections carousel | §6.9 | Done — now renders a polished fallback collection even with minimal seed data |
| Testimonials | §6.10 | Done — now shows a more complete, styled experience with defaults |
| Why choose us | §6.11 | Done — now uses the spec-aligned brand copy in a stronger card layout |
| Instagram/coupon callout | §6.12 | Done — now styled as a full promo CTA block |
| Footer (4-per-row category boxes) | §6.13, §9 | Done |
| WhatsApp bubble (bottom-right, fixed) | §2 | Done |
| Home page assembly, exact §6 order | §6 | Done — `src/app/page.tsx` |
| Category / collection / bundle / top-selling storefront routes | §6, §10 | Done — `src/app/categories/[slug]/page.tsx`, `src/app/collections/[slug]/page.tsx`, `src/app/bundles/[slug]/page.tsx`, `src/app/top-selling/page.tsx` |
| Product detail page (full §7 order) | §7 | **Done** — `src/app/products/[slug]/page.tsx`, section-by-section components in `src/components/product/` |
| Hotspot "shop the look" interaction | §7.4 | **Done** — `ProductGallery.tsx`, reuses `getPublicHotspotsForImage` (no raw Prisma calls in the page — kept the owner-field-safe query layer as the only path to product data) |
| Size guide popup | §7.6 | Done — `SizeGuideModal.tsx`, static placeholder measurements, swap for real client-provided sizing before launch |
| Contact form on product page | §7.11 | Done — `ProductContactForm.tsx`. Hands off to WhatsApp (no backend storage yet, consistent with "no accounts" §8) rather than a stored inquiry — revisit if the client wants inquiries logged in the admin dashboard |
| Related bundles on product page | §7.12 | Done — `RelatedBundles.tsx` + new `getBundlesForProduct()` query |
| Cart & checkout pages | -- | **Done** — `src/app/cart/page.tsx`, `src/app/checkout/page.tsx`. Checkout posts to the existing `createOrder`/`requestOtp` backend |
| Favorites page | §8 | **Done** — `src/app/favorites/page.tsx`, resolves localStorage IDs via new `getPublicProductsByIds()` (order-preserving) |

**Open item carried over from spec §12:** "Top Selling" currently reuses the
manually-toggled `trending` flag as a stand-in for real sales-volume ranking,
since no sales-count field exists yet. This matches §12's own framing
("automatic sales-based logic is a possible future enhancement, not
confirmed") — flag to the client if they expect it to be automatic at launch.

**Homepage polish note:** the storefront now includes local seed images and
fallback content for the home page so the layout feels complete even when the
DB has only a minimal set of products/bundles/collections. This improves the
spec alignment for §6 when the client is still working with limited seed data.

**⚠️ Previously flagged gap — now fixed:** `src/lib/otp.ts` used to expose
`requestOtp()` (sends the code) with **no matching verify-code endpoint** —
nothing checked that the code the customer typed back matched what was sent.
This is resolved:
- New `Otp` model (`prisma/schema.prisma`): one row per order, code stored
  **hashed** (sha256), with `expiresAt` (10 min) and a `attempts` counter
  capped at 5 wrong guesses before the code is dead.
- `requestOtp()` now upserts a fresh hashed code + expiry every time it's
  called (a resend invalidates the old code), and only persists it after the
  WhatsApp send actually succeeds.
- New `verifyOtp(orderId, code)` in `src/lib/otp.ts`: checks not-found /
  expired / too-many-attempts / wrong-code, and on success deletes the OTP
  row (single use, no replay), sets `Order.otpVerified = true`, and advances
  the order to `CONFIRMED` via the existing `advanceOrderStatus()` pipeline
  (§14.7) rather than writing status directly.
- New route `POST /api/orders/otp/verify` (`src/app/api/orders/otp/verify/route.ts`).
- Checkout page (`src/app/checkout/page.tsx`) now has a real code-entry step
  (`otp-verify`) between "order created" and "done" — 6-digit input, inline
  error messages distinguishing "wrong code, retype it" from "code dead,
  request a new one," and a resend button. `otp-fallback` (WhatsApp send
  itself failed) is unchanged, per §14.5.
- `randomInt` (CSPRNG) replaces `Math.random()` for code generation, since
  this is now a real confirmation secret, not just a display value.

**Other things to confirm before trusting checkout end-to-end:**
- `MANUAL_QUOTE_WILAYAS` in `src/lib/checkout.ts` (backend) is still an empty
  set — populate once the client confirms which wilayas need manual delivery
  quotes (§1).
- `deliveryFee` is hardcoded to 0 pending the real delivery-provider
  integration (§13, Phase 4).
- Checkout now uses the full 58-wilaya list via `src/lib/wilayas.ts`, validated
  on both the client dropdown and server-side in `createOrder()`.

**Not yet verified in a browser:** same Prisma-engine network blocker as
Phase 1 — every component up through this session has been type-checked
(`npx tsc --noEmit` passes with zero new errors) but not actually rendered or
click-tested yet. `npm install` succeeded in this environment, but
`npx prisma generate` still fails here (403 from `binaries.prisma.sh`) — run
it yourself before trusting the DB layer, per the Phase 1 blocker note below.
This now also applies to the new `Otp` model specifically: **run
`npx prisma migrate dev` (or `db push`) yourself** to actually create the
table before testing checkout end-to-end.

---

## Current gaps vs spec (2026-07-08)
- The storefront is now largely aligned with §6/§7 for browsing, product detail, cart/checkout, and favorites, but several larger spec items are still not implemented or remain partially stubbed.
- Real admin authentication is still a token-based stub rather than a full Auth.js/NextAuth session flow.
- The WhatsApp/Meta integration is wired in code but still needs real business credentials and a live Meta template to send OTPs/messages for real.
- Delivery integration is still placeholder-only: no real courier provider, no full 58-wilaya rollout, and the checkout fee logic is still hardcoded.
- The admin dashboard still lacks the larger marketing/operations tools listed in §2 and §12: Excel/JSON bulk import, Product Feed export / Easy Catalog, A/B testing, funnels, tracking dashboards, referral/affiliate tooling, services section, and the full marketing suite beyond coupons and Google Merchant feed.
- The app still needs browser-level manual QA and a live production-style environment check before it can be called fully launch-ready.

### Infra setup update (2026-07-08)
- Migrated Prisma from SQLite to Supabase PostgreSQL; archived old SQLite migrations.
- Wired Cloudinary signed uploads in local `.env`.
- Fixed the admin product edit build blocker: existing product image URLs are now loaded into `ProductFormValues.images`.
- Removed the unsafe hardcoded fallback admin credential path; the first real admin should be created via `/admin/login` signup once the real DB exists.
- Reworked `/api/admin/upload` to use signed Cloudinary uploads through the server and accept both images and videos.
- Added `docs/SUPABASE_CLOUDINARY_SETUP.md` and updated `.env.example`/README with the exact Supabase + Cloudinary values needed next.
- Integration tests now use the configured Postgres `DATABASE_URL` instead of throwaway SQLite files.
- `npm run build` passes. Run `npm test` against the seeded Supabase database.

## Phase 3 — Admin dashboard (§2) 🚧 IN PROGRESS — core management built

**Goal:** match/exceed the client's current EasyOrders-style dashboard (§2
treats this as a hard minimum, not optional).

| Item | Status | File |
|---|---|---|
| Admin auth (real session: `AdminUser` + scrypt password hashing + HMAC-signed, self-expiring session cookie) + server-side `middleware.ts` gate on all `/admin/*` pages (closes the earlier client-only-gate gap where a direct URL could reach the page shell before the client redirect fired) | ✅ | `src/lib/adminSession.ts`, `src/lib/adminSessionToken.ts`, `src/lib/password.ts`, `src/middleware.ts` |
| Sidebar shell / layout | ✅ | `src/components/admin/AdminSidebar.tsx`, `src/app/admin/layout.tsx` |
| Orders pipeline — exact tab list from §2, per-order "advance to..." action using the validated transition pipeline | ✅ | `src/app/admin/orders/page.tsx` |
| Lost/abandoned orders | ✅ — `LOST` is just another tab, same list view | same file |
| Blocked numbers (blocked from ordering entirely, add/remove) | ✅ | `src/app/admin/blocked-numbers/page.tsx` + `src/lib/queries/adminBlocklist.ts` + `/api/admin/blocked-numbers` routes |
| Category mask/unmask UI (§4) — now an actual click in the dashboard | ✅ | `src/app/admin/categories/page.tsx` + new `GET /api/admin/categories` (full list incl. hidden) |
| Product management — search by name/SKU, create, edit (incl. owner-only cost/rawPrice/sponsorSpend/profit fields, clearly marked as owner-only in the UI), delete, variant (color/size/stock) management | ✅ | `src/app/admin/products/**`, `src/components/admin/ProductForm.tsx`, new `/api/admin/products/[id]` route, `adminProduct.ts` reworked to take a flat form shape instead of raw Prisma nested-write input |
| Coupons (create, activate/deactivate, delete) | ✅ | `src/app/admin/coupons/page.tsx` + new `src/lib/queries/adminCoupon.ts` + `/api/admin/coupons` routes |

| Newsletter management (list, manual add, activate/deactivate, delete) | ✅ | `src/app/admin/newsletter/page.tsx` + new `src/lib/queries/adminNewsletter.ts` + `/api/admin/newsletter`, `/api/admin/newsletter/[id]` routes |
| Ratings/reviews moderation (filter pending/approved/all, approve/unapprove, delete) | ✅ | `src/app/admin/reviews/page.tsx` + new `src/lib/queries/adminReview.ts` + `/api/admin/reviews`, `/api/admin/reviews/[id]` routes |
| Newsletter signup form (storefront) | ✅ | `NewsletterSignup` in `src/components/home/Footer.tsx` → `POST /api/newsletter` → `subscribeFromStorefront()` in new `src/lib/queries/publicNewsletter.ts` |
| Review submission form (storefront) | ✅ | `ReviewForm` in `src/components/product/ProductReviews.tsx` → `POST /api/products/[slug]/reviews` → `submitReview()` in new `src/lib/queries/publicReview.ts` |
| Store-design settings UI (edit homepage banner/hero/video/running-bar/testimonials without touching the DB) | ✅ | `src/app/admin/store-design/page.tsx` + new `setSiteSetting()`/`setHomepageContent()` in `src/lib/queries/siteSettings.ts` + `GET`/`PUT /api/admin/settings/homepage` |

**Client decided (previous open question, now resolved):** both features get
real on-site forms rather than staying admin-entered-only. Notes on how they
were built:
- New reviews always land with `approved: false` — nothing a visitor submits
  is visible until approved in `/admin/reviews`. `ProductReviews` now always
  renders (review list if any exist, plus the form), instead of returning
  `null` when there are zero approved reviews yet.
- Newsletter signup is idempotent from the visitor's side: re-submitting an
  already-subscribed contact quietly succeeds instead of showing a "already
  exists" error; a previously-deactivated contact gets reactivated. The
  separate admin-side "add subscriber" (`addSubscriber` in
  `adminNewsletter.ts`) still fails loudly on duplicates, since that's a
  normal admin CRUD action, not a repeat-visitor edge case.
- Both new public POST endpoints (`/api/newsletter`, `/api/products/[slug]/reviews`)
  share a new lightweight in-memory per-IP rate limiter
  (`src/lib/rateLimit.ts`, same "swap for Redis/DB before production" caveat
  as the existing OTP rate limiter) plus a hidden honeypot field, since
  neither endpoint existed before and both are now open, unauthenticated
  write paths reachable by anyone/anything on the internet.
- Placement wasn't spec'd exactly, so a call was made: newsletter signup
  lives in the footer (present on every page); review form lives in the
  existing §7.14 "client feedback" section on the product page, right below
  the approved-reviews list. Flag to the client if a different placement
  (e.g. a dedicated homepage newsletter section per §6.12) is preferred.

**Store-design settings UI** — the `SiteSetting` key-value table and its
read-side helper (`getHomepageContent()`) already existed from Phase 2, but
nothing could write to it except a direct DB edit. Added the write side:
- `setSiteSetting()` / `setHomepageContent()` in `siteSettings.ts` — upserts
  all five keys (`top_banner_messages`, `hero_slides`,
  `homepage_video_url`, `running_bar_items`, `testimonials`) together as one
  unit, since the admin page saves them with a single "save all" button
  rather than per-item CRUD (unlike coupons/products) — these are homepage
  config blobs, not a list of independent records.
- `/admin/store-design`: add/edit/remove rows for banner messages, hero
  slides (image + headline + optional CTA), running-bar items (icon +
  label), and testimonials (name + quote + 1-5 rating), plus a plain text
  field for the video URL.
- Server-side shape validation in the `PUT` route (arrays of the right
  object shape) — not full sanitization (no image-URL reachability check,
  no XSS-scrubbing of free text beyond React's default escaping), which is
  fine for a single-admin tool but worth knowing if this ever opens up to
  more than one trusted editor.

**Not yet built (still genuinely missing, not silently skipped):**
- Bulk import (Excel/JSON), Product Feed export, "Easy Catalog," A/B testing on products
- Funnels, tracking tools, Pixel/Conversion API/Google Tag settings
- Marketing tools beyond coupons: cross-selling, re-targeting, WhatsApp Marketing sends, "Top MB" verification, ad campaign tracking, Google Merchant, sales popups, referral links, free-shipping threshold, downsell
- Services section, affiliate/referral commission tracking

These are large, mostly Phase-4-integration-shaped items (most need a real
external API — Meta, Google Merchant, a delivery provider — behind them) or
genuinely new UI surfaces; flagging them here rather than treating Phase 3
as "done."

**Not yet verified in a browser:** same Prisma-engine network blocker as
Phase 1/2 — every admin/storefront file added this session (newsletter +
reviews admin UI, the two on-site forms, the shared rate limiter, and the
new store-design settings page) type-checks cleanly against the current
`@prisma/client` (`npx tsc --noEmit` re-run after reinstalling
`node_modules`: 11 pre-existing errors, all the same
`OrderStatus`/`DeliveryMethod`/`Prisma.ProductSelect` "module has no
exported member" errors caused by the stale generic client — **none** in
any file touched this session) but hasn't been click-tested. Also needs
`ADMIN_API_TOKEN` set in `.env` and a matching value pasted into the
dashboard's login screen — there's no seeded admin credential yet. Run
`npx prisma generate` yourself once network access allows it; that should
also clear the 11 pre-existing errors, which are all symptoms of the same
blocker, not new bugs.

**Worth a manual look before launch:** the honeypot + in-memory rate limit
on the two new public POST endpoints is basic spam resistance, not a full
answer — no CAPTCHA, no email/phone verification on newsletter signup, no
per-product review cap. Fine for launch given the spec never asked for more,
but flag if spam becomes a real problem later.

## Phase 4 — Integrations 🚧 IN PROGRESS

Real WhatsApp Cloud API wiring, delivery provider API (Yalidine/ZR
Express/Noest — needs client confirmation, §13), Meta Pixel + Conversion
API, Google Merchant Center, Sentry.

| Item | Status | File |
|---|---|---|
| WhatsApp Cloud API — real OTP send (replaces the old stub) | ✅ code, ⬜ untestable without your credentials | `src/lib/otp.ts` (`sendWhatsAppOtp`) |
| Google Merchant Center product feed | ✅ code, ⬜ needs your Merchant Center account to actually consume it | `src/app/api/feed/google-merchant/route.ts` + new `src/lib/queries/publicProductFeed.ts` |

**WhatsApp Cloud API — what changed:** `sendWhatsAppOtp()` in `otp.ts` used
to be a literal stub (checked for a token, then did nothing). It's now a
real `POST` to Meta's Graph API `/messages` endpoint, sending the code
through an **AUTHENTICATION-category template message** — Meta requires
this specific template category for OTPs; a freeform text message is
rejected outright. Details:
- Local Algerian phone format (`0XXXXXXXXX`, enforced by `checkout.ts`) is
  converted to the `213XXXXXXXXX` E.164-without-`+` format the API wants
  (`toWhatsAppE164()`).
- Template `components` include a `body` parameter (the code) and a
  `button` component (`sub_type: "url"`, repeating the code) — that's the
  correct wire format for a copy-code/one-tap authentication template as of
  Meta's current docs, confirmed via a live search rather than assumed from
  training data, since Meta's template APIs have changed more than once.
  Set `WHATSAPP_OTP_TEMPLATE_HAS_BUTTON=false` if using a zero-tap
  no-button template instead.
- On any non-2xx response, Meta's actual error body is thrown up rather
  than swallowed — `requestOtp()` already wraps that into the existing
  §14.5 "fall back to a phone call" path, so nothing needed to change
  there.

**What you still need to do before this actually sends anything** (none of
this is a coding task — it's Meta account/business setup that only you can
do):
1. A Meta Business Manager account with a verified WhatsApp Business
   phone number.
2. In WhatsApp Manager → Message Templates → create a new template with
   category **Authentication**, get it approved (usually near-instant for
   auth templates since they're locked to Meta's fixed preset text).
3. Set in `.env`: `WHATSAPP_CLOUD_API_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`
   (the "Phone number ID" from WhatsApp Manager, not the phone number
   itself), and `WHATSAPP_OTP_TEMPLATE_NAME` (exact template name). See
   the expanded comments in `.env.example` for all of these plus the
   optional ones (`WHATSAPP_OTP_TEMPLATE_LANG`, `_HAS_BUTTON`, `WHATSAPP_API_VERSION`).

**Google Merchant product feed — what it does:** `GET
/api/feed/google-merchant` returns an RSS 2.0 + `g:` namespace XML feed —
the format Merchant Center's "scheduled fetch" expects. One `<item>` per
product (not per variant/color/size — see the comment in
`publicProductFeed.ts` for why that's a reasonable scope cut, not an
oversight). Built directly on the existing `getPublicProducts()` — the same
masked-category-excluding, owner-field-safe query the rest of the
storefront uses — specifically so a feed generator couldn't become a new
way to accidentally leak `costPrice`/`rawPrice`/`sponsorSpend`/`profit`.
Required Google fields are all covered (id, title, description, link,
image_link, availability, price, condition); `sale_price` is included when
`discountPrice` is set; `identifier_exists: no` is reported honestly since
there's no GTIN/MPN field in the schema, rather than inventing a fake one.

**What you still need to do** (again, account setup, not code):
1. Create a Merchant Center account, verify + claim the site's domain
   (via Search Console).
2. Add a feed in Merchant Center pointed at this endpoint's full URL —
   e.g. `https://kayaaanclothing.com/api/feed/google-merchant`. No `.xml`
   extension needed; Merchant Center reads the response's Content-Type
   header, not the URL string.
3. Set `SITE_URL` in `.env` — the feed 500s with a clear error instead of
   silently emitting broken relative links if it's missing.
4. **Worth knowing, not something to "fix":** Algeria shows up as a
   supported-but-**beta** target country in Google's own country list for
   Shopping ads/free listings — expect rollout/behavior to differ from a
   fully-supported market. Also worth confirming directly with Merchant
   Center whether DZD is an accepted submission currency for an
   Algeria-targeted feed before going live; this feed emits DZD as-is
   (matching how prices are stored and shown everywhere else in the app)
   since guessing at a currency conversion here would be worse than
   flagging the open question.

**Not yet started in Phase 4:** delivery provider integration (still
waiting on which provider — Yalidine/ZR Express/Noest — per §13), Meta
Pixel + Conversion API (needs your Pixel ID + CAPI token from Meta Events
Manager), Sentry (needs a DSN from a Sentry account).

---

## Phase 5 — Hardening & launch (§14) ⬜ NOT STARTED

Staging environment, the 20-pass manual QA checklist (§14.13), CI wiring for
the security test, image compression/lazy-loading, ISR caching for
categories/collections.

---

*Last updated (2026-07-16): removed OTP entirely per client decision — no
more code-verification step. Orders now stay `AWAITING_PAYMENT` ("en
attente") until an admin calls the customer and manually moves it to
`CONFIRMED` or `PAYMENT_FAILED` from the orders dashboard (the existing
transition rules in `orderStatus.ts` already supported this, no changes
needed there). Removed: `src/lib/otp.ts`, the `Otp` and `OtpBlockedNumber`
Prisma models, `Order.otpVerified`/`otpAttempts`, the OTP admin blocklist UI,
and the OTP step in checkout. Added: `src/lib/whatsapp.ts` (generic
WhatsApp template sender, extracted from the old OTP code) and
`src/lib/orderConfirmationMessage.ts` — sends a recap message (items, total,
delivery type, wilaya) right after an order is created; needs its own
approved Meta "Utility" template (`WHATSAPP_ORDER_CONFIRMATION_TEMPLATE_NAME`),
separate from the old Authentication one.

Also fixed a real security gap found during audit: `/admin/*` pages had no
server-side auth check — only a client-side React redirect
(`AdminAuthGate`), which runs after the page is already served, so a direct
URL could momentarily reach the page shell before being kicked out. Added
`src/middleware.ts`, which checks the signed session cookie server-side
before any admin page renders. Session tokens are now HMAC-signed with a
server-enforced expiry (`ADMIN_SESSION_SECRET`) instead of the previous raw
`AdminUser.id` cookie value.

Confirmed during audit: `src/lib/validation/adminProduct.ts` (zod-free,
hand-rolled request validation for the admin product routes) already exists
and is wired in — an earlier progress note calling this a gap was stale.

Next up: Yalidine delivery integration — confirmed as the provider. Needs
(1) live delivery-fee lookup wired into checkout so the fee/ETA show as the
customer fills in wilaya/commune, and (2) parcel creation once an order is
confirmed. Blocked on the client's Yalidine API ID + Token
(`yalidine.app/dev`, requires a verified Yalidine business account — the API
itself is free, no subscription). Also still open: Meta Pixel + Conversion
API, Sentry, Phase 5 hardening.*

*Update (2026-07-17): Yalidine integration built —
`src/lib/yalidine.ts` (wilayas/communes/fee-lookup/parcel-creation client),
live wilaya+commune pickers and delivery fee shown during checkout
(`src/app/checkout/page.tsx`), and automatic parcel creation when an admin
confirms an order (`src/lib/yalidineParcel.ts`, hooked into
`PATCH /api/admin/orders/:id/status`). `Order.commune` is now a required
field (Yalidine prices by commune, not just wilaya) and `deliveryMethod`
changed from FAST/ECONOMIC to HOME/OFFICE to match what's actually being
shown to customers and what Yalidine's `is_stopdesk` flag expects.

**Not yet exercised**: blocked on `YALIDINE_API_ID`/`YALIDINE_API_TOKEN`
(client needs a verified Yalidine business account, free otherwise) and
`YALIDINE_FROM_WILAYA_ID`/`YALIDINE_FROM_WILAYA_NAME` (Kayaaan's shipping
origin). The `/fees/` and `/parcels/` response field names in
`yalidine.ts` are best-effort (only request shapes are publicly documented)
— it fails loudly with the real response's keys if they don't match, rather
than silently returning 0.

Added a manually-maintained delivery-time-estimate table
(`src/lib/deliveryEta.ts`) since Yalidine's API only gives price, not ETA.
**Every value in it is currently a flat placeholder** ("2-4 أيام عمل تقديري"
for all 58 wilayas) — deliberately generic so it can't be mistaken for real
researched data. Needs real per-wilaya numbers from the client before
launch.*

*Update (2026-07-17, dashboard audit): found three content types that were
fully modeled and live on the storefront but had ZERO admin management
surface — Collections (`/collections/[slug]`), Bundles/"Duos"
(`/bundles/[slug]`, orderable at checkout), and Hotspots (tappable points on
product images at `/products/[slug]`). The only way to create/edit any of
them was directly in the database. Built admin CRUD for all three, same
pattern as the existing coupons/categories pages:

| Item | File |
|---|---|
| Collections — create/edit/hide/delete + product assignment | `src/app/admin/collections/page.tsx`, `src/lib/queries/adminCollection.ts`, `/api/admin/collections`, `/api/admin/collections/:id/products` |
| Bundles — create/edit/hide/delete + item assignment w/ quantities | `src/app/admin/bundles/page.tsx`, `src/lib/queries/adminBundle.ts`, `/api/admin/bundles`, `/api/admin/bundles/:id/items` |
| Hotspots — pick product → pick image → place points (x%/y%) linked to another product, with a live preview overlay | `src/app/admin/hotspots/page.tsx`, `src/lib/queries/adminHotspot.ts`, `/api/admin/hotspots` |

All three added to `AdminSidebar.tsx`. Everything else checked out fine —
store-design, coupons, reviews, newsletter, blocked numbers, orders,
products, categories all had complete admin coverage matching the backend
already.*

*Update (2026-07-27, listing pages): the five routes still on the
pre-redesign idiom — `/categories/[slug]`, `/collections/[slug]`,
`/top-selling`, `/favorites`, `/bundles/[slug]` — rebuilt on a shared listing
system. Audit table in `docs/DESIGN-BRIEF.md` §4.1; component spec in
`docs/DESIGN-SYSTEM.md` §6.7.

| Item | File |
|---|---|
| Facet engine — filter/sort/count/band maths, pure, tested | `src/lib/listing.ts`, `tests/listing.test.ts` (16 tests) |
| Editorial masthead | `src/components/listing/ListingHero.tsx` |
| Toolbar + filter surfaces + grid + editorial breaks + empty states | `src/components/listing/ProductGrid.tsx` |
| Sibling category strip | `src/components/listing/CategoryRail.tsx` |
| Favourites client view (ID cache, skeleton, failure copy) | `src/components/listing/FavoritesView.tsx` |
| Full chrome on `/favorites` | `src/app/favorites/layout.tsx` |
| `--k-header-h`, published from the header's measured height | `src/app/globals.css`, `tailwind.config.js`, `src/components/home/Header.tsx` |
| Editorial frame helpers across the server/client boundary | `src/lib/lookbook.ts` |

Two adjacent fixes: `sizeLabel()` in `src/lib/format.ts` renders the
catalogue's `"One Size"` as `مقاس واحد` on the PDP size chips and in the size
facet (R1); `CategoryRail` avoids the `aria-label="الأقسام"` already used by
two navs in the header.

**Known, pre-existing**: `.bleed-k` uses `width: 100vw`, which is wider than the
document when a classic scrollbar is present — every full-bleed section (hero,
video band, and now the editorial breaks) overflows by the scrollbar width on
desktop. Fixed in a later pass, below.*

*Update (2026-07-27, testimonials §6.10): the section was already on tokens and
pull-quote typography, but had three structural problems — it only worked at
exactly two entries (two-column grid, empty cell on an odd count, a wall of
display headlines at five), it carried no aggregate, and one long testimonial
set at `h2` blew out the row height.

Rebuilt as the same snap rail the drops and collections rows use, with an
average strip above it. The average comes from `getPublicReviewSummary()` —
real approved reviews on visible products (§7.14) — not from averaging the
admin-authored `testimonials` site setting, and it is suppressed below five
reviews. Stars floor rather than round, so a 4.8 average never paints five.
Quote length picks the treatment: `h2` under 90 characters, `h3` under 180,
body-lg prose above that, clamped at six lines. Copy helpers `reviewCount()`
and `formatRating()` added to `src/lib/format.ts`.*

*Update (2026-07-27, why-choose-us §6.11): the section was correct on tokens and
wrong on substance — it was the only block on the home page with no photograph,
sat between the testimonials and the Instagram band, and carried three headline
claims ("تصاميم أصيلة / جودة عالية / تجربة مختلفة") that any shop could make.
Rebuilt as a photograph beside the client's own sentence from spec §1 — "لا نصنع
ملابس فقط، بل نصنع تجربة" — with the three points as a hairline-divided list
under it and a route on to `/pages/about`, which the section previously lacked
entirely. Every line is §1 verbatim or close to it. Service reasons (COD, 58
wilayas) are deliberately absent: the running bar carries those directly above
(§6.5). Titles dropped from `h2` to `h3` — three `h2`s under one `display-2`
flattened the hierarchy — and the three-column layout went away because at 768px
it gave each column a ~230px measure, far too tight for Arabic.

Also corrected a provenance claim I had introduced on the category page
("مصنوعة ومطبوعة في الجزائر"). The spec records where the brand is from, not
where the garments are made.*

*Update (2026-07-27, full-bleed overflow): `.bleed-k` sizes at `100vw` — the
viewport *including* the classic scrollbar — while the document is viewport
minus scrollbar, so every full-bleed section was ~15px wider than the page and
desktop had a real horizontal scrollbar on every route. Present since the hero
shipped.

Auditing the four usages showed three did not need the utility at all:
`HeroCarousel` and both bands in `VideoAndRunningBar` sit directly under
`<main>`, which carries no container, so they were already document-width and
`bleed-k` was only forcing the overflow. Those three are now plain full-width
elements. Only the editorial break in `ProductGrid` genuinely escapes a
container, and `html { overflow-x: clip }` in `globals.css` absorbs its
remainder.

`clip`, not `hidden`: `hidden` establishes a scroll container, which would make
every `position: sticky` on the site — header, listing toolbar, cart summary, PDP
details column, info-page rail — stick to that container instead of the viewport.
`overflow: clip` establishes no scroll container. No `@supports` guard is needed;
a browser that doesn't know the value drops the declaration and gets the previous
behaviour. Rule written into `docs/DESIGN-SYSTEM.md` §4.4.*
