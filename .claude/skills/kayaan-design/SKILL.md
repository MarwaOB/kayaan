---
name: kayaan-design
description: Design rules for the Kayaaan storefront (Arabic RTL streetwear e-commerce). Load BEFORE writing or editing any user-facing UI in this repo — pages, components, styles, layout, colour, typography, imagery, or animation. Triggers on any storefront or admin UI work, any mention of the hero, product card, header, menu, footer, running bar, PDP, gallery, size guide, checkout styling, or "redesign / enhance the design / make it look better". Also load when adding product photography or logo assets.
---

# Kayaaan design

Arabic-only RTL streetwear storefront. Next.js 14 App Router + Tailwind + Prisma.

## Read first

Both live in `docs/`. Do not restate them from memory — open them:

- **`DESIGN-SYSTEM.md`** — tokens, type scale, components, RTL, a11y. Binding.
- **`DESIGN-BRIEF.md`** — the client's requirements and their sources, plus the
  current-build audit table listing exactly what to fix.

`kayaaan-website-full-spec.md` holds functional scope (section order, data model,
policies). Check it before changing what a page *contains*.

## Non-negotiables

These are the ones that get broken most often here.

1. **Arabic only.** Every visible string. No English, no French. The only Latin
   on the site is the KAYAAAN logotype inside the logo artwork.
2. **Tokens only.** No raw hex, no `stone-*`/`neutral-*`/`gray-*`, no arbitrary
   radius like `rounded-[1.25rem]`. If you need a value that isn't in
   `DESIGN-SYSTEM.md`, that's a conversation, not a `[...]` class.
3. **Logical properties.** `ms-*`/`me-*`/`ps-*`/`pe-*`/`start-*`/`end-*`. Never
   `ml-*`, `left-*`, `right-*`. Test both `dir` values.
4. **Never letter-space Arabic.** `tracking-*` on Arabic text breaks the cursive
   joins. There are existing instances of this in `Header.tsx` — they are bugs.
5. **Images through the manifest.** `src/lib/media.ts` → `getArticle()`,
   `getLogo()`. Never hand-write a `/public` path, never reference `/images/**`
   (those are gitignored camera masters).
6. **Logo through `<Logo />`.** Never the string `كيان` as a heading, never a
   raw `/brand/*.webp`.
7. **Product cards carry no shadow.** Depth is `--k-line` and background
   contrast. See §4.3.
8. **Minimum 15px body text, 44×44px touch targets, 16px form inputs**
   (smaller inputs trigger iOS zoom on focus).
9. **Animate `transform`/`opacity` only**, and honour
   `prefers-reduced-motion` — it is already enforced globally in `globals.css`,
   don't fight it.
10. **Emoji are content; controls get icons.** Apple emoji only render on Apple
    devices — no affordance may depend on a specific emoji design. Use the
    `.emoji` class for content emoji, real SVG for cart/heart/close/nav.

## Working order

For a section redesign:

1. Read the section's current component(s) and the matching row in the
   `DESIGN-BRIEF.md` audit table (§4).
2. Check `kayaaan-website-full-spec.md` for what the section must contain.
3. Rewrite using tokens. Delete the `/images/seed/*.svg` placeholder it was
   using — don't leave both.
4. Verify against `DESIGN-BRIEF.md` §5 (definition of done) before reporting.

Migrate section by section. The legacy `kayaan.*` Tailwind colours still resolve,
so a half-migrated tree renders correctly — leave working code working.

## Assets

`npm run assets:prepare` rebuilds `/public/brand` and `/public/images/products`
from the masters in `/images`, and regenerates both manifests. It is idempotent;
`--force` rebuilds everything.

Available photography: `summer` and `winter` × `dz`, `gaza`, `hourria`,
`sinwar` — 85 images. Editorial model shots, mostly 4:5 portrait, dark garments
with graphic Arabic prints on light backgrounds.

## Verify

```
npx tsc --noEmit          # types
npm run build             # the real check — Tailwind + next/font resolve here
npm test                  # vitest
```

Then look at it. `/run` starts the app; check 360px and 1280px, and confirm the
RTL layout is genuinely right-to-left rather than a mirrored afterthought.
