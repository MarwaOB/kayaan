# Kayaaan Clothing — Full Website & Platform Specification

This document consolidates everything discussed with the client about the new Kayaaan e-commerce website: site structure, data model, business logic, admin requirements, open questions, and reference inspirations. It is meant to be read standalone — no prior images or chat history required.

---

## 1. Brand Identity (client-provided, verbatim)

**Brand name:** Kayaaan (كيان)
**Domain (current site):** kayaaanclothing.com
**Contact phone/WhatsApp:** +213562009989
**Contact email:** hello@kayaaanclothing.com
**Instagram:** instagram.com/kayaaan.clothing

### من نحن (About Us)

في كيان، لا نبيع مجرد ملابس… نحن نصنع أثراً.
نؤمن أن كل قطعة ترتديها هي رسالة، وأن أسلوبك هو انعكاس لهويتك. لهذا السبب، جاءت فكرة كيان لتقديم ملابس عصرية تحمل طابعاً عربياً وإسلامياً بلمسة حديثة، تجمع بين البساطة والمعنى.

**رؤيتنا:** أن نكون أكثر من مجرد علامة تجارية، بل تجربة تترك انطباعاً يدوم. نريد لكل شخص يرتدي كيان أن يشعر بأنه يعبّر عن نفسه، عن ثقافته، وعن قصته الخاصة.

**رسالتنا:** تصميم ملابس بجودة عالية وأفكار مبتكرة تدمج بين الأناقة والمعنى، لتمنحك ستايل فريد يميّزك ويترك أثراً في كل مكان تذهب إليه.

**ماذا نقدم؟**
- تيشيرتات وهوديز عصرية
- تصاميم مستوحاة من الثقافة العربية والإسلامية
- جودة عالية واهتمام بأدق التفاصيل
- تجربة مختلفة (مثل QR Code يحمل رسائل خاصة) — *note: QR code with hidden/special messages on garments is a planned product feature, likely printed on a tag or inside the garment*

**لماذا كيان؟** لأننا لا نصنع ملابس فقط، بل نصنع تجربة. كل تصميم في كيان له فكرة، وكل قطعة لها قصة، وكل عميل هو جزء من هذا الأثر.

**كيان… أكثر من ستايل** — كيان هو اختيارك لتكون مختلفاً، بسيطاً، وذا معنى.

### Order confirmation notice (shown to customer post-purchase)
بعد تأكيد عملية الشراء، سيتم الإتصال بكم لتأكيد الطلبية، فيرجى ترك هواتفكم شغال.
في حال وصول طلبيتكم، لديكم مهلة 03 أيام لاستلامها، وإلا سيتعين علينا دفع حق الإرجاع (الروتور) والذي يعتبر خسارة لنا.

### Delivery pricing note
أسعار التوصيل المعروضة في الموقع لمكتب التوصيل فقط. أسعار التوصيل إلى المنزل تختلف حسب الولاية. لذلك ندعوكم للتواصل معنا للاستفسار عن سعر التوصيل الخاص بولايتكم.

### Delivery methods
- 🚀 التوصيل السريع: يومين إلى ثلاثة أيام بعد التأكيد والتجهيز
- 📦 التوصيل الاقتصادي: يومين إلى ثلاثة أيام بعد التأكيد والتجهيز

### Site navigation (current site, footer)
**الأقسام (Categories):** توت باغز (Totebags) · هووديز (Hoodies) · أقمصة (T-shirts) · جوغرز (Joggers) · حقائب ظهر (Backpacks)
**الصفحات (Pages):** دليل المقاسات (Size Guide) · من نحن؟ (About Us) · سياسة الطلب والشحن (Shipping Policy) · سياسة الاستبدال والاسترجاع (Refund Policy) · شروط الاستخدام (Terms & Conditions) · سياسات الخصوصية (Privacy Policy)

### سياسة الاستبدال والاسترجاع (Refund/Exchange Policy) — full text
نحن نسعى دائمًا لضمان رضاكم الكامل عن منتجاتنا ❤️
في حال لم تكن راضيًا عن طلبك، يمكنك الاستفادة من سياسة الاسترجاع والاستبدال وفق الشروط التالية:

**⏱️ مدة الطلب:** يمكن طلب الاسترجاع أو الاستبدال خلال 7 أيام من تاريخ استلام الطلب.

**📦 شروط الاسترجاع:**
- أن يكون المنتج في حالته الأصلية (غير مستعمل، غير مغسول)
- لا نقبل استرجاع المنتجات المصممة حسب الطلب إلا في حالة وجود خطأ أو عيب

**🔄 الاستبدال — يمكن استبدال المنتج في الحالات التالية:**
- خطأ في المقاس
- خطأ في المنتج المستلم
- الاستبدال يكون حسب توفر المنتج في المخزون

**💸 الاسترجاع المالي:**
- يتم استرجاع المبلغ بعد استلام وفحص المنتج خلال 3 إلى 5 أيام عمل
- رسوم التوصيل غير قابلة للاسترجاع (إلا في حالة خطأ منا)

**🚚 تكاليف الشحن:**
- في حالة الخطأ من طرفنا: نتحمل كامل تكاليف الشحن
- في حالة رغبة العميل: يتحمل العميل تكاليف الشحن

**⚠️ منتجات غير قابلة للاسترجاع:** المنتجات المخفضة (Promotion) · المنتجات المخصصة (Custom design)

### شروط الاستخدام (Terms & Conditions) — full text
**1. مقدمة** — مرحبًا بكم في متجر كيان 🤎. باستخدامكم لهذا المتجر، فإنكم توافقون على الالتزام بشروط الاستخدام التالية.

**2. استخدام الموقع** — يجب استخدام المتجر لأغراض قانونية فقط. يُمنع استخدام الموقع لأي نشاط احتيالي أو مسيء. نحتفظ بحق إلغاء أي طلب في حال الاشتباه في استخدام غير مشروع.

**3. الطلبات والقبول** — جميع الطلبات تخضع للتأكيد والتوفر. نحتفظ بحق رفض أو إلغاء أي طلب في حالات: خطأ في المعلومات المقدمة، عدم توفر المنتج، الاشتباه في طلب غير جدي.

**4. الأسعار والدفع** — الأسعار قابلة للتغيير في أي وقت دون إشعار مسبق. يتم تأكيد السعر النهائي عند إتمام الطلب. الدفع حسب الطرق المتاحة (مثلاً الدفع عند الاستلام).

**5. الشحن والتوصيل** — حسب سياسة التوصيل؛ قد تختلف المدة حسب الولاية أو ظروف خارجة عن الإرادة.

**6. الاسترجاع والاستبدال** — تخضع لسياسة الاسترجاع الخاصة بالمتجر.

**7. الملكية الفكرية** — جميع التصاميم والمحتوى ملك حصري للمتجر. يُمنع نسخ أو استخدام أي تصميم دون إذن مسبق.

**8. المسؤولية** — المتجر غير مسؤول عن تأخير خارج عن إرادته. العميل مسؤول عن صحة معلوماته.

**9. التعديلات على الشروط** — يحتفظ المتجر بحق تعديل الشروط في أي وقت.

**10. التواصل** — إنستغرام، البريد الإلكتروني، واتساب.

### سياسة الخصوصية (Privacy Policy) — full text
**1. مقدمة** — كيان يحترم خصوصية العملاء ويلتزم بحماية بياناتهم الشخصية.

**2. المعلومات التي نجمعها:** الاسم الكامل، رقم الهاتف، عنوان الشحن، البريد الإلكتروني (إن وجد)، معلومات الطلبات (المنتجات، المقاسات، التفضيلات).

**3. كيف نستخدم المعلومات:** معالجة وتأكيد الطلبات، التوصيل، التواصل بخصوص الطلب، تحسين الخدمة، إرسال عروض/تحديثات (اختياري).

**4. حماية المعلومات:** وسائل أمنية مناسبة، الاستخدام محصور بالأغراض المذكورة.

**5. مشاركة المعلومات:** لا تُباع أو تُشارك مع طرف ثالث، إلا: شركات التوصيل (لتسليم الطلبات فقط)، أو التزام قانوني.

**6. ملفات تعريف الارتباط (Cookies):** قد تُستخدم لتحسين التصفح وتحليل الأداء.

**7. حقوق المستخدم:** الاطلاع على البيانات، طلب تعديل/حذف، إلغاء الاشتراك من الرسائل الترويجية.

**8. التعديلات على السياسة:** قد تُحدَّث من وقت لآخر.

**9. التواصل:** إنستغرام، البريد الإلكتروني، واتساب.

---

## 2. Site Architecture — Two Sides to Build

This is not just a storefront. **Two separate systems must be built:**

1. **Client-side (storefront)** — what shoppers see and interact with.
2. **Admin-side (dashboard)** — what the store owner uses to manage everything.

The client currently runs on an existing platform (screenshots referenced an EasyOrders-style dashboard). **The new admin dashboard must match or exceed every feature currently available to him** — this is treated as a hard minimum, not optional. Do not ship a dashboard with fewer capabilities than what he already has today.

> **Two new sections were added to this document on 2026-07-31, and anyone
> picking the project up should read them before writing code:**
> **§15 — Admin Dashboard Front-End Brief** (the admin UI was explicitly left
> out of the storefront redesign and now has to be brought up to the same
> standard), and **§16 — Implementation Status Audit** (a verified,
> file-by-file record of what in this spec is actually built, what is
> half-built, and what has never been started).

### Confirmed admin dashboard features (minimum baseline, observed from current platform)
- Orders management with status pipeline: كل الطلبات (All) · تم التأكيد (Confirmed) · تحت المراجعة (Under review) · في انتظار الدفع (Awaiting payment) · فشل الدفع (Payment failed) · قيد التجهيز للشحن (Preparing for shipping) · بانتظار الشحن (Awaiting shipment) · قيد التوصيل (Out for delivery) · تم التوصيل (Delivered)
- Lost/abandoned orders tracking (الطلبات المفقودة)
- Blocked phone numbers from ordering (الارقام المحظورة من الطلب)
- OTP-blocked numbers (الارقام المحظورة OTP) — i.e., numbers blocked specifically from OTP order confirmation
- Newsletter management
- Product management: search by SKU or name, bulk import via Excel or JSON, Product Feed export, "Easy Catalog," A/B testing on products
- Category management (الاقسام) — including the mask/unmask feature (see §4)
- Ratings/reviews management (التقييمات)
- Store design settings (تصميم المتجر)
- Funnels
- Tracking tools (ادوات التتبع)
- Marketing tools (ادوات التسويق): Cross-selling, Coupons, Re-targeting, **WhatsApp Marketing** (send order confirmation messages or promotional messages via WhatsApp — requires the WhatsApp Marketing app to be enabled), "Top MB" order verification, ad campaign result tracking, Google Merchant integration, Sales popups, Referral link generation, Minimum order threshold for free shipping, Downsell
- Pixel settings, Conversion API, Google Tag linking
- Services section, affiliate/referral commission tracking

### WhatsApp integration specifics
- A WhatsApp bubble/icon fixed at the bottom-right of the storefront (as seen on the reference site) opens a WhatsApp chat window (client used "EasyOrders Help" business chat as reference) for customer support.
- WhatsApp is also used for **OTP order confirmation** — customer confirms their order via a WhatsApp OTP code rather than (or in addition to) a phone call.
- Admin can send automated or promotional WhatsApp messages to customers via the WhatsApp Marketing tool.

---

## 3. Data Model — Product Fields

### Customer-facing fields (safe to expose via any public API/page)
- Name
- Category
- Sale Price
- Discount/Promotion Price (shown as strikethrough original + discounted price when active)
- Color
- Size
- Description
- Care instructions
- In-stock / Out-of-stock status (see §5)
- Images

### Owner-only fields (must NEVER be exposed to the public-facing API, storefront HTML, or any client-side JS bundle)
- Cost price (التكلفة)
- Raw/base price (منتج خام)
- Sponsor/ad spend (السبونسور)
- Profit (الفائدة)

### Semi-technical field
- **SEO link** — becomes the page's URL slug. Customer sees it in the browser address bar but never interacts with the raw field directly; it's set by admin when creating the product.
- **Meta Description** — intentionally exposed, but only inside the page's `<meta>` tag for Google search results, not rendered visibly on the page itself.

**Engineering note (flagged earlier, still critical):** the product database/table currently stores cost, raw price, sponsor spend, and profit in the same row as customer-safe fields. The storefront's product API endpoint must query/return only a filtered view containing the customer-safe fields — never the full row — to avoid leaking cost/profit data through browser dev tools or API responses.

### Removed/resolved fields
- **"Type" field (e.g. Oversize) — REMOVED as a separate structured field.** Client confirmed all products are oversize by default; this will just be mentioned in the product description text, not stored/filtered as its own attribute.

---

## 4. Categories

**Fixed category list (confirmed, not open-ended for now):**
1. T-shirts (أقمصة)
2. Hoodies (هووديز)
3. Joggers (جوغرز)
4. Shorts
5. Totebags (توت باغز)
6. Backpacks (حقائب ظهر)

**New required admin feature — Category masking:** Admin must be able to mask/unmask categories independently, controlling which are publicly visible at any given time. At launch, only 3 categories will be unmasked: **T-shirts, Totebags, Hoodies**. The rest (Joggers, Shorts, Backpacks) stay hidden until the admin chooses to reveal them. This must be a simple toggle per category in the dashboard, not a code change.

**No "design" filter.** Earlier note "Shop by design" was a figure of speech, not a literal filter category — filtering is by Category only for now. Room to add more filters later (e.g. price range) — open for future ideas, not a launch requirement.

---

## 5. Product Card Component (used in Home, Collections, Top Selling, category grids)

Displays:
- Product image
- Optional discount badge (e.g. "-15%") when a promotion price is active
- Optional "hot/trending" indicator (🔥 emoji seen in one product's name in current data — admin should be able to manually mark a product as trending; automatic sales-based logic is a possible future enhancement, not confirmed)
- Favorite/heart icon (toggle, persists per device — see §8)
- Product name
- Price (and strikethrough original price + discounted price when on promotion)

**New required feature — Out-of-stock tag:** if a product is out of stock, it must still appear in listings (not hidden) but visibly marked "Out of stock" on the card, so customers know the product exists even if unavailable right now.

---

## 6. Home Page — Section Order (top to bottom)

1. **Top banner** — announcement/message, swipeable if multiple messages
2. **Header** — logo centered, cart icon, favorites (♡) icon, hamburger menu
3. **Hero cover / carousel** — main visual banner
4. **New drops carousel** — 2x row of newest products
5. **Embedded video AND running bar (marquee)** — client confirmed BOTH appear (not either/or). The video must be swappable by the admin at any time (e.g., a new clip per drop). The running bar is a continuously scrolling text ticker — client referenced **jana store's running bar** as direct visual inspiration: a light pink background bar with small icon + text items such as "الدفع عند الاستلام" (cash on delivery), "توصيل 58 ولاية" (delivery to 58 wilayas), "خدمة العملاء" (customer service), "إمكانية التخصيص" (customization option) — evenly spaced icon+label items in a single horizontal bar, not necessarily auto-scrolling text; can be a static row of feature highlights.
6. **Categories** — "Shop by category" tiles (T-shirts, Hoodies, etc. — respecting the masked/unmasked state from §4)
7. **Top Selling** — shows the top 4 individual best-selling products (not grouped collections), with a "view more" option to expand. No full product detail shown here — just the card.
8. **Bundles/Duos** — confirmed as its own **separate section**, placed directly underneath Top Selling. Not a filter or tab inside Top Selling.
9. **Collections carousel** — collections are **not fixed**; the admin creates new ones whenever inspiration strikes (e.g. seasonal drops, themed sets). Admin needs an easy interface to create/edit collections at will.
10. **Client feedback / testimonials**
11. **Why choose us**
12. **Follow us on Instagram / coupon / promo callout**
13. **Footer** (see §9)

---

## 7. Products Page (single product detail page) — Section Order

1. **Breadcrumb navigation** — e.g. الرئيسية › هووديز › هوودي "جزائري" (Home › Hoodies › [Product name]) — style reference confirmed by client screenshot
2. **Category bar** — swipeable, up top
3. **Product image(s)** — non-savable pictures. Client confirmed: screenshot-blocking is impossible on the web and this is accepted as-is; no further protection needed beyond disabling right-click-save, which is cosmetic/discouragement only.
4. **Interactive hotspot feature (new, inspired by reference brand "Based on Love"):** On lifestyle/model photos, clickable dot hotspots can be placed on individual garments the model is wearing. Clicking a hotspot highlights/displays that specific article's info on the right side of the screen (e.g. name + price + "View Product" button), letting one photo cross-sell multiple products worn together.
5. **Name + Price**
6. **Small description + Size guide** — Size guide opens as a **popup/modal** on the product page (confirmed via client screenshot), not a separate page navigation.
7. **Approximate delivery time**
8. **Color + Size selectors**
9. **Add to cart button**
10. **Product detail sections** — Description / Care Instructions
11. **Contact form** — separate section (confirmed, not merged with bundles)
12. **Related bundles** — separate section (confirmed, not merged with contact form)
13. **Our service + message** — reassurance/trust section
14. **Client feedback** — shown under each product (confirmed via client screenshot: "Feedback under each product")
15. **Footer**

---

## 8. No Customer Accounts, But Persistent Favorites

Customers do **not** need to create an account or log in. However, their **favorites (♡) must persist** across visits — when they return to the site later (same device/browser), their previously favorited items should still be there. This implies device-level persistence (e.g. local storage or a cookie-linked identifier), not account-based login.

---

## 9. Footer

- Categories grouped into boxes — each box shows the category name, laid out **4 boxes per row** (confirmed by client)
- Small brand description + logo
- Main pages: About Us · Return Policy · Privacy Policy · Social media logos + Contact
- Copyright line: "© 2026 By Kayaan"

---

## 10. Navigation / Menu — Structure Inspiration (Kith.com reference)

Client explicitly referenced **kith.com** as inspiration for the site's main navigation structure:
- Top-level horizontal menu: NEW · MENS · WOMENS · KIDS · [seasonal/event link] — for Kayaaan this maps to top-level categories/sections
- Clicking a top-level menu item opens a **mega-menu**: a left-hand vertical sidebar listing sub-sections (e.g. "Explore [Category]," then specific sub-collections, then general links like Footwear, Apparel, Accessories, Lifestyle, Brands) alongside a large lifestyle image preview panel on the right
- For Kayaaan, this pattern should be adapted to show category sub-sections and also link out to policy/info pages (About Us, Privacy, etc.) within the same expandable menu structure, not just product categories

This is a **navigation UX pattern reference**, not a literal design to copy — Kayaaan's actual categories (T-shirts, Hoodies, Joggers, Shorts, Totebags, Backpacks) and pages (Size Guide, About Us, Shipping Policy, Refund Policy, Terms, Privacy) should populate this structure.

---

## 11. Resolved Ambiguities Log (for reference — do not re-ask these)

| # | Topic | Resolution |
|---|---|---|
| 1 | Category list fixed or growing | Fixed 6 categories, but admin can mask/unmask individually |
| 2 | T-shirt/Hoodie are separate categories | Confirmed yes |
| 3 | "Type" field (Oversize, etc.) | Removed as structured field — folded into description text only |
| 4 | "Shop by design" | Not a real filter — figure of speech; filtering stays category-based, open to adding filters like price later |
| 5 | Collections fixed or growing | Not fixed — admin adds new ones whenever inspired |
| 6 | Top Selling: products or collections | Individual products |
| 7 | Bundles/Duos placement | Confirmed: separate section, directly under Top Selling |
| 8 | Embedded video vs. running bar | Both, stacked; video must be swappable by admin |
| 9 | Footer category boxes content | Category name only, 4 boxes per row |
| 10 | Non-savable pictures | Accepted that screenshots can't be blocked; no further action needed |

## 12. Still-Open Items (worth confirming if not already answered elsewhere)

- Exact behavior of the "hot/trending" 🔥 badge on product cards: manual toggle by admin, or automatic based on sales volume?
- Exact visual/interaction spec for the hotspot "shop the look" feature (how many hotspots per image, animation on click, mobile tap behavior)
- Whether the running bar auto-scrolls (marquee/ticker) or is a static row of icon+label items, matching the "jana store" reference more precisely
- Full list of admin-side marketing tool integrations that must be wired up at launch vs. can be added post-launch (Google Merchant, Conversion API, Pixel, referral links, etc.) — sequencing/priority not yet discussed

---

## 13. Recommended Tech Stack (free-tier-first)

Every layer below defaults to a genuinely free option. Where a "standard" industry choice has a hidden commercial-use restriction or a tight free tier, the actual recommendation is the alternative — not the popular default.

### Frontend
- **Next.js (React)** — free, open-source. Chosen for built-in SEO/server-rendering (matters given the per-product "SEO link" field) and image optimization.
- **Tailwind CSS** — free, open-source. Fast, consistent styling; handles mixed RTL Arabic / LTR layouts.
- **Zustand or React Context** — free — manages cart/favorites state client-side.

### Hosting
- **Cloudflare Pages** (not Vercel Hobby) — Vercel's free "Hobby" tier explicitly disallows commercial/revenue-generating sites in its Terms of Service; a live store violates that the day it takes its first order. **Cloudflare Pages' free tier has no such commercial-use restriction** and comfortably handles a Next.js storefront at this scale — use it as the default.

### Database
- **Neon (PostgreSQL)** (not Supabase free tier) — Supabase's free tier auto-pauses a project after 7 days without traffic, which is unacceptable for a live storefront that needs to always be reachable. Neon's free tier scales to zero instead of pausing entirely, avoiding surprise downtime, while still giving a real dedicated Postgres database with generous storage.
- **Prisma** as the ORM — free, open-source — used to enforce that owner-only fields (cost, raw price, sponsor spend, profit) are structurally excluded from any customer-facing query (see §3), not just hidden by the frontend.

### Media (product images/video)
- **Cloudflare Images + Cloudflare R2** (not Cloudinary) — Cloudinary's free tier is only 25 combined credits/month (~25GB total storage+bandwidth), which a photo-heavy fashion catalog will exceed quickly. Cloudflare's free egress and storage tiers are far more generous for this use case and integrate cleanly with Cloudflare Pages hosting.

### Admin dashboard
- Same Next.js codebase, a protected `/admin` route tree with simple email + password (or magic-link) authentication — no need for a separate paid auth service at single-owner scale. **NextAuth.js / Auth.js** is free and open-source and covers this.

### WhatsApp integration (OTP confirmation + marketing messages)
- **Meta's WhatsApp Cloud API, used directly** (not through a paid Business Solution Provider like Twilio, 360dialog, or Wati) — going direct avoids the BSP's extra per-message markup layered on top of Meta's own rate.
- **Important, unavoidable cost:** Meta itself charges a small per-message fee (a fraction of a cent to a few cents, depending on message type and country) for OTP/authentication messages and any business-initiated marketing message. Only replies sent inside a 24-hour window that the *customer* opened are free. This is the one piece of the stack that cannot be made 100% free — it's Meta's own billing, not a middleman's. Practically, at Kayaaan's order volume this cost is small, but it should be budgeted for, however minor.

### Delivery integration
- Direct API integration with **Yalidine, ZR Express, or Noest Express** (whichever the client already uses) — these are typically free for merchants to integrate against; confirm which provider(s) with the client before building this piece, since it's the most operationally critical integration in the whole system.

### Monitoring
- **Sentry** free tier (5,000 errors/month) — sufficient at this scale, catches silent checkout/OTP failures before they cost real orders.

### Analytics/marketing (already expected per admin feature list, §2)
- **Meta Pixel + Conversion API** — free, standard Meta tooling.
- **Google Tag Manager + Google Merchant Center** — free.

---

## 14. Implementation Instructions — Building It Correctly, With No Bugs

These are non-negotiable engineering practices for this specific project, given it handles real money, real customer data, and a non-technical owner who will be managing it daily.

### Data integrity & security
1. **Enforce the owner-only vs. customer-safe field split at the database query layer, not the UI layer.** Build a dedicated Prisma query/service (e.g. `getPublicProduct()`) that explicitly `select`s only customer-safe fields. Never use a generic `findMany()`/`findUnique()` without an explicit field allowlist anywhere the response could reach the browser. Write an automated test that asserts cost/profit/sponsor fields are absent from every public API response — this test must run in CI on every deploy, not just be checked once by hand.
2. **Validate every input server-side**, never trust client-side validation alone — sizes, colors, quantities, phone numbers, and coupon codes must all be re-validated on the server before an order is created.
3. **Rate-limit the OTP endpoint** specifically — this prevents abuse (someone spamming OTP requests to run up your WhatsApp bill) and ties into the existing "blocked numbers from OTP" admin feature already planned.
4. **Never log full customer phone numbers or order details in plaintext application logs** that a third-party monitoring tool (like Sentry) could store — mask or truncate sensitive fields before logging, in line with the privacy policy's data-protection commitments (§1).

### Reliability
5. **Every external integration (WhatsApp API, delivery company API, payment/COD flow) must have explicit error handling and a fallback path.** If the WhatsApp OTP send fails, the customer should get a clear on-screen message and an alternative confirmation path (e.g. phone call), not a silent failure that loses the order.
6. **Wrap all checkout-critical operations in database transactions.** An order + its line items + a stock decrement must all succeed or all roll back together — a half-completed order (payment recorded but stock not decremented, or vice versa) is the most common source of real revenue-losing bugs in small e-commerce builds.
7. **Write automated tests for the order status pipeline** (§2's full state list: Awaiting payment → Confirmed → Preparing → Shipped → Delivered, etc.) — verify every valid transition and that invalid transitions are rejected, since this pipeline is the backbone of daily operations.

### Performance
8. **Compress and lazy-load every product image** — with a photo-heavy catalog, unoptimized images are the single most common cause of a slow storefront on mobile data connections, which matters given the target audience is primarily mobile shoppers in Algeria.
9. **Cache category and collection listings** (they change infrequently) rather than querying the database on every page load — use Next.js's built-in static/ISR caching rather than building a custom cache layer.

### Process / handoff quality
10. **Staging environment before production.** Every change — especially anything touching checkout, OTP, or pricing — must be tested on a staging deployment first, never pushed directly to the live store, since a broken checkout flow directly costs the client money in real time.
11. **Version control everything, including admin-configurable content** (like the swappable homepage video, masked/unmasked categories) — store these as data in the database, editable via the dashboard, never hardcoded into the frontend, so the client can self-serve changes without needing a developer each time.
12. **Document every environment variable and third-party credential** (WhatsApp API tokens, delivery company API keys, database connection strings) in a `.env.example` file with clear comments — this project will likely be handed off or maintained by more than one developer over time given its scope.
13. **Before launch, run through the full customer journey end-to-end at least 20 times manually**, covering: every payment/COD state, an out-of-stock product, a discounted product, a bundle purchase, an OTP failure, and a delivery-address edge case (a wilaya with home-delivery pricing that requires manual contact, per the client's own delivery note in §1) — these are the exact scenarios most likely to break silently in a real launch.

---

## 15. Admin Dashboard — Front-End Brief (added 2026-07-31)

### 15.1 Why this section exists

The storefront went through a full design pass against `docs/DESIGN-SYSTEM.md`.
**The admin dashboard did not.** `docs/DESIGN-BRIEF.md` §4 records this
explicitly: the last row of the build-audit table reads *"Admin UI — Not in
scope — ⬜ Untouched by design."*

The result is that the two halves of the same product now look like they were
built by different companies in different decades. Verified state of
`src/app/admin/**` and `src/components/admin/**` as of this writing:

| Symptom | Evidence |
| --- | --- |
| Zero design tokens | Not one file under `src/app/admin` or `src/components/admin` references `--k-brand-*`, `--k-ink-*`, `--k-line`, or `--k-surface`. All 17 use raw `neutral-*` and the legacy `kayaan-brown` / `kayaan-brownDark` classes — the exact greys `DESIGN-SYSTEM.md` §1 bans by name. |
| Duplicated primitives | `formatDZD` is redefined by hand in three separate admin files (`admin/page.tsx`, `admin/orders/page.tsx`, `admin/products/page.tsx`). None of them import the canonical `formatDZD` from `src/lib/format.ts`. |
| Wrong numerals | Those local copies use `toLocaleString("ar-DZ")`, which renders `٣٬٨٠٠` — Arabic-Indic digits. The storefront settled this in `DESIGN-BRIEF.md` §3: prices render as `3 800 د.ج` with Western digits. The admin contradicts the storefront on the same number. |
| No mobile layout | `AdminLayoutWrapper` is a bare `flex` row and `AdminSidebar` is `h-screen w-56` with no drawer, no collapse, no breakpoint. On a phone the nav permanently consumes 224px and the content column is unusable. The owner runs this business from a phone. |
| Browser dialogs as UI | `alert()` is the failure path for status changes and several other mutations. There is no toast, no inline error surface, no optimistic state. |
| Prose-only states | Loading, empty, and error are all a single grey `<p>` — `...جاري التحميل`, `لا توجد نتائج.` No skeletons, no empty-state art, no retry affordance. |
| Flat information design | The dashboard home is three unlabelled count tiles (orders, products, categories) and five order rows. No revenue, no time range, no chart, no trend, nothing actionable. |
| Tables without table behaviour | The products table has no pagination, no sort, no column control, no row selection, no bulk action, no product thumbnail. It renders whatever the API returns, entire. |

### 15.2 The instruction

**Rebuild the admin front-end to the same standard as the storefront, and make
it feel like a modern SaaS dashboard rather than an internal CRUD form.** This
is a front-end and UX task: the API routes, Prisma queries, and auth in
`src/app/api/admin/**` and `src/lib/queries/admin*.ts` are sound and should be
reused, not rewritten. Where a page needs data the API does not yet return
(order line-item detail, revenue aggregates, paginated products), extend the
existing query module rather than reaching for Prisma from the page.

### 15.3 Where to draw from

Study these and take the *patterns*, not the pixels. The dashboard must still
read as Kayaaan — warm canvas, espresso ink, Almarai — not as a clone.

| Reference | What to take from it |
| --- | --- |
| **Shopify Admin** (and the Polaris system) | The closest analogue to this product. Take: the resource-list pattern (filter chips + saved views + bulk selection bar that slides in over the header), the order detail layout (timeline down one side, customer + payment + fulfilment cards down the other), and the way destructive actions are always confirmed inline rather than in a browser dialog. |
| **Salla** and **Zid** (Saudi commerce platforms) | The only mature references that are *natively Arabic RTL commerce dashboards*, not translated ones. Take: how they handle numerals, how the sidebar behaves at RTL, and how dense Arabic table content is set without becoming a wall. |
| **Linear** | Take: the command palette (`Ctrl/⌘+K`) as the primary navigation accelerator, keyboard-first list navigation, and the restraint — one accent colour, hairline separators, no gradients. |
| **Stripe Dashboard** | Take: the metrics header — a compact row of figures with sparklines and period-over-period deltas — and the way it makes a table row expandable into full detail without a page navigation. |
| **Vercel Dashboard** | Take: the app shell (slim top bar with breadcrumb + context switcher, content max-width, generous vertical rhythm) and the skeleton-loading discipline — every async surface has a shaped placeholder, never a spinner or a sentence. |
| **Medusa Admin** (open source) | Take: how a headless commerce admin models variants, inventory, and product media in a form without it becoming a 40-field wall. Directly useful for reworking `ProductForm.tsx`. |
| **EasyOrders** (client's current tool) | The feature floor, per §2. Do not take its visual design. The point of this rebuild is that the client gets something better-looking than what he is leaving, not a lookalike. |

### 15.4 Non-negotiables

These carry over from the storefront unchanged. Invoke the **`kayaan-design`**
skill before writing admin UI, exactly as for the storefront.

1. **Tokens only.** Every colour, radius, shadow, and type step comes from
   `docs/DESIGN-SYSTEM.md`. No raw hex, no `neutral-*`, no `stone-*`, no
   `gray-*`. The legacy `kayaan-brown` classes get replaced by `--k-brand-*`.
2. **Arabic-only strings.** Every label, button, column header, toast, empty
   state, and error message. No English leaks into the UI — English stays in
   code, comments, and these docs.
3. **Logical properties.** `ms-*`/`me-*`/`start-*`/`end-*`. Never `ml-*`,
   `mr-*`, `text-left`, `left-*`. The existing admin has a handful of these to
   clean up.
4. **Never `tracking-*` on Arabic text.**
5. **One `formatDZD`,** imported from `src/lib/format.ts`. Delete all three
   local copies. Western digits, per `DESIGN-BRIEF.md` §3.
6. **Dates and status labels get shared helpers too** — a status label map
   currently lives inline in `admin/orders/page.tsx`; it should sit next to
   `src/lib/orderStatus.ts` so the storefront, admin, and WhatsApp message
   cannot drift apart.
7. **Accessibility parity with the storefront:** keyboard reachable, visible
   focus ring, Arabic `aria-label` on every icon-only control, motion disabled
   under `prefers-reduced-motion`.

### 15.5 Required surfaces

| Surface | What it must become |
| --- | --- |
| **App shell** | Slim top bar (brand mark, breadcrumb, global search / `⌘K`, admin menu with sign-out) over a collapsible sidebar. Sidebar becomes an overlay drawer below `lg`. Sidebar links get icons and group into sections — الطلبات والعملاء / الكتالوج / المحتوى والتسويق / الإعدادات — because a flat list of twelve is already past the point of scanning. |
| **Dashboard home** | Real operations view. Revenue for a selectable period, order count by status, average order value, top products, low-stock warnings, and a chart of orders over time. Each figure carries a period-over-period delta. Every tile is a link into the filtered list behind it. Follow the `dataviz` skill for any chart. |
| **Orders list** | Keep the §2 status tabs. Add: search by name/phone/order ID, date-range filter, sort, pagination, row selection with a bulk status action, and a visible per-tab count. Show wilaya/commune, item count, and Yalidine tracking state on the row. |
| **Order detail** | **Does not exist today** — there is no `/admin/orders/[id]` route at all, so the owner cannot see what was actually ordered, the delivery address, the coupon used, or the Yalidine label. Build it: line items with thumbnails, customer and delivery block, coupon and totals breakdown, the `OrderStatusHistory` timeline (already modelled, never surfaced), the Yalidine tracking number and label link, and one-tap WhatsApp/call actions on the customer's number. |
| **Products list** | Thumbnail, pagination, sort, category filter, stock filter, inline trending toggle, row selection with bulk visibility/delete, and duplicate-product. Keep the existing SKU/name search. |
| **Product form** | Split the current single scroll into sections or steps: basics, pricing (with the owner-only block visually walled off and labelled as such), media with drag-reorder and a lifestyle-image flag, variants as an editable matrix rather than a repeated row form, and SEO (slug + meta description) with a live search-result preview. |
| **Store design** | Currently one long form with a single save button. Make it a live preview beside the fields, section by section, so the owner can see the banner/hero/running bar/video as they edit. |
| **Every list page** | Skeleton while loading, illustrated empty state with a primary action, an error state with a retry button. No bare `<p>`. |
| **Every mutation** | Toast confirmation, optimistic update where safe, inline validation messages. Destructive actions get an in-page confirm dialog. **Remove every `alert()`.** |

### 15.6 Definition of done

Mirrors `DESIGN-BRIEF.md` §5, plus:

7. The page is usable at 360px — sidebar drawer closes over content, tables
   either scroll horizontally in their own container or collapse to cards.
8. No `alert()`, no `confirm()`, no `prompt()` anywhere under `src/app/admin`.
9. `grep -r "neutral-\|kayaan-brown\|toLocaleString" src/app/admin src/components/admin`
   returns nothing.
10. Every async surface has a loading, empty, and error state that was
    deliberately designed, not defaulted.

---

## 16. Implementation Status Audit (verified 2026-07-31)

Read against the actual contents of `src/`, `prisma/`, and `tests/` — not
against `docs/PROGRESS.md`, which is a build log and in places is optimistic.
Anything below marked ❌ or ⚠️ is work the next developer inherits.

### 16.1 Storefront (§5, §6, §7, §8, §9, §10)

Substantially complete and on the design system. Sections §6.1–§6.13 and
§7.1–§7.15 all exist; listing pages, cart, checkout, favourites, and the six
information pages are built.

| Item | Status | Note |
| --- | --- | --- |
| Home §6, PDP §7, footer §9, mega-menu §10 | ✅ | |
| Product card incl. out-of-stock tag §5 | ✅ | |
| Favourites persisted per device §8 | ✅ | `localStorage` via Zustand |
| Hotspot "shop the look" §7.4 | ⚠️ | Built, but the linked article renders in a popover anchored to the dot, not in a right-side panel as §7.4 describes. Knowing deviation, logged in `DESIGN-BRIEF.md` §4. **Needs the client's yes or no.** |
| Size guide §7.6 | ⚠️ | Modal is built; **the measurements in `src/data/size-guide.ts` are placeholders.** Real sizing has never been supplied. |
| Trending 🔥 badge §5 / §12 | ⚠️ | Manual admin toggle only. "Top Selling" ranks by that flag, not by real sales volume — there is no sales-count field. §12 leaves this open; it needs a decision. |
| Delivery ETA §7.7 | ⚠️ | `src/lib/deliveryEta.ts` is now a single `DEFAULT_DELIVERY_ETA` constant ("2-5 أيام عمل") shown to every customer. Per-wilaya estimates are possible via the `WILAYAS` table in `deliveryPricing.ts` but none are set. **Needs real per-wilaya figures if §7.7 is meant to be specific.** |
| Product contact form §7.11 | ⚠️ | Hands off to WhatsApp; inquiries are not stored, so they never appear in the dashboard. Fine if intended — confirm. |

### 16.2 Data model & security (§3, §14.1)

| Item | Status | Note |
| --- | --- | --- |
| Owner-only field split enforced in the query layer | ✅ | `src/lib/queries/publicProduct.ts` uses an explicit `select`; `publicProductFeed.ts` builds on it so the Merchant feed cannot leak either |
| Automated test that owner-only fields never appear in a public response | ✅ | `tests/publicProduct.test.ts` |
| **That test running in CI on every deploy** (§14.1 requires this) | ❌ | There is no CI configuration in the repo. The test exists and passes locally; nothing enforces it. |
| Server-side input validation (§14.2) | ✅ | `src/lib/validation/adminProduct.ts`, plus re-validation in `checkout.ts` |
| Transactional checkout with stock decrement (§14.6) | ✅ | `src/lib/checkout.ts` |
| Order status pipeline with transition validation (§14.7) | ✅ | `src/lib/orderStatus.ts` |
| Admin auth | ✅ | scrypt hashing + HMAC-signed self-expiring cookie + `src/middleware.ts` server-side gate. Note this is **not** the NextAuth/Auth.js setup §13 proposed — a hand-rolled equivalent was built instead. Works; just know the spec and the build disagree here. |
| **`.env.example` (§14.12 requires it)** | ❌ | **No environment-variable documentation exists in the repository at all.** `.env.example` was never created, and `.env.local.example` — the one tracked example file — was **deleted** in `121c038`. So every WhatsApp, delivery, Cloudinary, and Supabase variable is now undocumented, including the newly-added `WHATSAPP_PROVIDER`, `WHATSAPP_SERVICE_URL`, and `WHATSAPP_SERVICE_API_KEY`. §14.12 calls this out as a handoff requirement, and this project is being handed off. **This is the single highest-value hour of work available right now — do it first.** |

### 16.3 Admin dashboard (§2)

Core CRUD is genuinely complete: orders pipeline with the exact §2 tab list,
products (incl. owner-only fields and variants), categories with mask/unmask
(§4), collections, bundles, hotspots, coupons, reviews, newsletter, blocked
numbers, store design. Twelve pages, all wired to real APIs.

**Missing from the §2 baseline — never started:**

| Missing | §2 reference |
| --- | --- |
| Bulk product import (Excel / JSON) | §2 product management |
| Product Feed export UI, "Easy Catalog" | §2 product management |
| A/B testing on products | §2 product management |
| Funnels | §2 |
| Tracking tools (ادوات التتبع) dashboard | §2 |
| Pixel settings, Conversion API, Google Tag linking — **no UI and no runtime code anywhere in `src/`** | §2 |
| Cross-selling, re-targeting, sales popups, downsell | §2 marketing tools |
| WhatsApp Marketing (promotional sends) | §2, §2 WhatsApp specifics |
| "Top MB" order verification, ad campaign result tracking | §2 marketing tools |
| Referral link generation, affiliate/referral commission tracking | §2, §2 services |
| Minimum order threshold for free shipping | §2 marketing tools |
| Services section | §2 |
| Google Merchant integration **UI** | §2 — the feed endpoint itself exists (`/api/feed/google-merchant`), but nothing in the dashboard surfaces or configures it |

§12's fourth open item — which of these must be wired at launch versus after —
**is still unanswered and now blocks planning.** It should be the first thing
raised with the client.

**Also missing, not on the §2 list but needed to operate the store:** an order
detail page (§15.5), any revenue or sales reporting, and a customer view (the
schema has no `Customer` model — orders are keyed by phone number only, so
"this person has ordered four times" is not answerable today).

### 16.4 Integrations (§13)

| Integration | Status |
| --- | --- |
| Delivery pricing | ✅ **Yalidine was removed on 2026-07-29** (`121c038`). `src/lib/yalidine.ts` and `yalidineParcel.ts` are now empty deprecated stubs; `src/lib/deliveryPricing.ts` holds a static per-wilaya `homeFee`/`deskFee` table maintained by hand from the carrier agreement. Checkout reads that table directly. **Consequences to know:** there is no automatic parcel creation any more (labels are made in the carrier's own tool), `commune` is now free text rather than a validated pick from an API, `Order.yalidineTracking`/`yalidineLabelUrl` survive as legacy columns, and the rate table is now a **manual maintenance burden — it goes stale silently the moment the carrier changes prices.** |
| WhatsApp order confirmation | ⚠️ **Provider switched to Baileys on 2026-07-29** (`121c038`), because Meta's Cloud API requires a payment card the client does not have. `WHATSAPP_PROVIDER` (default `baileys`) selects between the new service and the retained `cloud_api` path in `src/lib/whatsapp.ts`. Three things the next developer must know: **(1) `whatsapp-service/` is not in the repository** — the commit adds it, but `git ls-tree` shows zero tracked files under that path, so a fresh clone does not get the service at all; **(2)** it is currently QR-linked to a *personal* WhatsApp number and must be re-linked to the client's business number before launch; **(3)** Baileys is an unofficial WhatsApp Web client — it is not a supported Meta integration and carries a real risk of the number being banned, which is a business risk the client should be told about explicitly, not just an engineering one. |
| Google Merchant feed | ✅ endpoint. ⬜ Needs a Merchant Center account and `SITE_URL` set. Note Algeria is a *beta* target country in Google's own list, and DZD acceptance for an Algeria-targeted feed is unconfirmed. |
| Meta Pixel + Conversion API | ❌ Not started. No `fbq`, no CAPI call, nowhere in `src/`. |
| Sentry (§13 monitoring, §14.4) | ❌ Not started. No error monitoring of any kind — a silent checkout failure is currently invisible. |

### 16.5 Deliberate divergences from this document

These are decisions that were made after this spec was written. They are
recorded here so nobody "fixes" the code back to match the old text.

| Spec says | Build does | Why |
| --- | --- | --- |
| §2 / §13: WhatsApp **OTP** order confirmation, and an OTP-blocked-numbers admin list | No OTP at all. Orders sit at `AWAITING_PAYMENT` until an admin phones the customer and moves them to `CONFIRMED` or `PAYMENT_FAILED` by hand. A WhatsApp **recap** message is sent instead. | Client decision, 2026-07-16. The `Otp` / `OtpBlockedNumber` models, `src/lib/otp.ts`, and the checkout OTP step were all removed. §2's "OTP-blocked numbers" line is therefore obsolete. |
| §13: **Neon** Postgres | **Supabase** Postgres, plus a local Docker Postgres for offline UI work | Chosen in setup. Note §13's stated objection to Supabase — free-tier projects auto-pause after 7 days idle — **still applies and has not been mitigated.** Either the project goes to a paid tier before launch or it must move. **This is a live launch risk.** |
| §13: **Cloudflare Images + R2** | **Cloudinary** (signed server-side uploads) | Chosen in setup. §13's objection — 25 credits/month on the free tier against a photo-heavy catalogue — also still applies. Watch the quota. |
| §13: **Cloudflare Pages** hosting | Not yet deployed anywhere | §13's reasoning (Vercel's Hobby tier forbids commercial use) is unchanged and still correct. Do not deploy a live store to Vercel Hobby. |
| §13: **NextAuth.js / Auth.js** | Hand-rolled scrypt + HMAC-signed cookie sessions | Equivalent in effect at single-owner scale; just not the named library. |
| §1: delivery methods "التوصيل السريع / الاقتصادي" | `deliveryMethod` is `HOME` / `OFFICE` | Originally chosen to match Yalidine's `is_stopdesk` flag. Yalidine is gone, but the split survives because it is what customers are actually shown and what the static rate table prices. |
| §13: direct API integration with a delivery provider, called "the most operationally critical integration in the whole system" | No provider API at all. A hand-maintained rate table (`src/lib/deliveryPricing.ts`) and manual label creation in the carrier's own tool. | Decision of 2026-07-29. Reasonable at current volume, but §13's framing still stands: this is the piece most likely to hurt operationally, and it now fails *silently* (a stale price is invisible) rather than loudly (an API error). Worth a recurring reminder to re-check the rates. |
| §13 / §2: WhatsApp via Meta's Cloud API | Baileys (unofficial WhatsApp Web) in a separate Node service, with the Cloud API path kept behind `WHATSAPP_PROVIDER=cloud_api` | Meta requires a payment card the client does not have. See §16.4 for the ban risk and the missing-from-git problem. |

### 16.6 Hardening not done (§14, Phase 5)

- No staging environment (§14.10). Nothing has been deployed at all.
- The 20-pass manual customer-journey run (§14.13) has not happened. **The
  storefront has never been click-tested in a browser against a real
  database** — everything to date is type-checked and unit-tested only.
- ISR/caching for category and collection listings (§14.9) not configured.
- §1's "home delivery pricing varies by wilaya, contact us for a quote" case
  never triggers. `createOrder()` now writes `requiresManualDeliveryQuote:
  false` unconditionally, and the column is dead. This may well be *correct*
  now that every wilaya has a fixed `homeFee` in the rate table — but §1's
  customer-facing notice still promises the old behaviour. **Either drop that
  notice from the site copy or re-implement the case; right now the site says
  one thing and does another.**
- Phone-number masking in logs (§14.4) is not implemented.
- Rate limiting on the public POST endpoints is in-memory
  (`src/lib/rateLimit.ts`) and resets on every deploy and every serverless
  cold start. Needs Redis or a DB table before production.

### 16.7 Small, concrete cleanups found during this audit

- ~~The dead duplicate `admin-order-status-route.ts`~~ — already deleted in
  `121c038`.
- **`whatsapp-service/` is untracked.** `.gitignore` only excludes
  `/whatsapp-service/baileys-session/` (correctly — those are live
  credentials), but the service's own source was never added. A fresh clone
  cannot run or redeploy WhatsApp. Commit it, minus the session directory.
- The status-transition map is duplicated between `src/lib/orderStatus.ts` and
  a literal copy in `src/app/admin/orders/page.tsx`. The comment there
  acknowledges it. Export it from the lib instead.
- `AdminAuthGate` still runs a client-side redirect that `src/middleware.ts`
  now makes redundant. Harmless, but it is a second gate that can drift.

---

*End of specification. §1–§14 reflect the decisions made during the discovery
conversation with the client. §15 (admin front-end brief) and §16
(implementation status audit) were added on 2026-07-31 at the point of handoff
and reflect the verified state of the codebase on that date.*
