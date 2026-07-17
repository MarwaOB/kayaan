# Supabase + Cloudinary Setup

This app now uses Supabase PostgreSQL for persistence and Cloudinary for admin
media uploads. Collect any missing values below before deploying.

## What to Create

### 1. Supabase project

Create a Supabase project and keep the database password somewhere safe.

Send these two connection strings:

- `DATABASE_URL`: the pooled app connection string. If Supabase gives you a
  transaction-pooler/Supavisor URL, add `pgbouncer=true` to the query string.
- `DIRECT_URL`: session-mode pooler on port `5432` (or direct DB host on port
  `5432`). Do not use the transaction pooler (port `6543`) for migrations.

Prisma and Supabase both recommend a pooled runtime connection plus a direct
migration connection. Supabase notes that transaction-mode Supavisor needs
`pgbouncer=true` for Prisma prepared statements; Prisma also recommends
keeping a direct URL for migrate commands.

The values usually look like:

```env
DATABASE_URL="postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres"
```

If your password contains symbols like `@`, `#`, `/`, `%`, or spaces, use the
URL-encoded version from Supabase rather than typing it manually.

### 2. Cloudinary account

Create a Cloudinary account, then send:

```env
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

`CLOUDINARY_UPLOAD_PRESET` can stay empty. The app now signs uploads on the
server, so an unsigned upload preset is not required. If you later create a
signed preset with transformations/folder rules, paste its name too.

## Status

- Supabase PostgreSQL: configured and migrated
- Cloudinary: configured in local `.env` (set the same values in production)

## Remaining checks

1. Create the first real admin from `/admin/login` using signup (if not already done).
2. Test an admin image upload from `/admin/products/new` or `/admin/store-design`.
3. Test a short homepage video upload from `/admin/store-design`.

## Why This Comes Before Other Features

The remaining marketing and delivery features depend on real persistent data
and real media URLs. Moving to Supabase + Cloudinary first avoids building more
screens against temporary seed images and a local-only SQLite database.
