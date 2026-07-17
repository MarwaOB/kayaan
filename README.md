# Kayaaan Platform

Next.js + Prisma platform for the Kayaaan Clothing storefront and admin
dashboard. The source spec is `kayaaan-website-full-spec.md`; current progress
and known gaps are tracked in `PROGRESS.md`.

## Current State

- Storefront pages are built: home, category, collection, bundle, product,
  cart, checkout, favorites, static content pages, and top-selling.
- Core admin pages are built: dashboard, products, orders, categories, coupons,
  blocked numbers, newsletter, reviews, and store-design settings.
- Public product queries use explicit Prisma allowlists so owner-only fields
  (`costPrice`, `rawPrice`, `sponsorSpend`, `profit`) do not leak.
- Admin media upload is wired to Cloudinary through a signed server-side upload
  endpoint at `/api/admin/upload`.
- The app uses Supabase PostgreSQL for persistence and Cloudinary for media.

## Local Commands

```bash
npm install
npm run prisma:generate
npm run prisma:seed
npm run dev
```

Verification:

```bash
npx tsc --noEmit
npm run build
npm test
```

Note: integration tests read `DATABASE_URL` from `.env` and expect a migrated,
seeded Supabase/Postgres database.

## Real Database + Media Setup

Before production-like testing, create:

1. A Supabase project.
2. A Cloudinary account.

Then follow `docs/SUPABASE_CLOUDINARY_SETUP.md`. In short, provide:

```env
DATABASE_URL=""
DIRECT_URL=""
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
CLOUDINARY_UPLOAD_PRESET=""
```

`DATABASE_URL` should be the pooled Supabase app URL. `DIRECT_URL` should be
the direct Supabase database URL for Prisma migrations.

## Still Not Launch-Ready

- Delivery provider integration and real delivery pricing are not done.
- WhatsApp OTP needs real Meta credentials and an approved auth template.
- Meta Pixel, Conversion API, GTM, Sentry, and several advanced marketing/admin
  tools are still pending.
- Full browser QA and the 20-pass checkout QA checklist from the spec are still
  required before launch.
