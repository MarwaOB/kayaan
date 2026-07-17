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

*End of specification. This document reflects all decisions made during the discovery conversation with the client as of the current date.*
