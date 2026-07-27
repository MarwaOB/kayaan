# Kayaaan Clothing

Arabic-only RTL e-commerce storefront + admin for an Algerian streetwear brand.
Replaces <https://www.kayaaanclothing.com/>.

Next.js 14 (App Router) · TypeScript · Tailwind · Prisma/Postgres · Zustand ·
Cloudinary · Yalidine delivery · WhatsApp order confirmation.

## Docs

| File | What it settles |
| --- | --- |
| `docs/kayaaan-website-full-spec.md` | Functional scope — section order, data model, policies, integrations. Check before changing what a page *contains*. |
| `docs/DESIGN-SYSTEM.md` | Visual tokens, type scale, component specs, RTL, accessibility. Binding for anything user-facing. |
| `docs/DESIGN-BRIEF.md` | The client's design requirements, their sources, and an audit of what's currently wrong. |
| `docs/PROGRESS.md` | Build log. |
| `docs/Kayaan.pdf` | The client's original inspiration notes (already transcribed into `DESIGN-BRIEF.md`). |

## UI work

Invoke the **`kayaan-design`** skill before touching any user-facing UI. For a
full section redesign, the **`kayaan-ui`** agent handles one section per run.

The rules broken most often: Arabic-only strings; tokens not raw hex; logical
properties (`ms-*`/`start-*`) not physical (`ml-*`/`left-*`); never
`tracking-*` on Arabic.

## Assets

Camera masters live in `/images` (**gitignored**, ~400 MB). Web derivatives are
generated:

```
npm run assets:prepare      # incremental
npm run assets:rebuild      # --force
```

That writes `/public/brand` (18 logo assets), `/public/images/products`
(85 images), and the two manifests in `src/data/`. Read images through
`src/lib/media.ts`, never by hand-writing a path. Render the logo through
`<Logo />`, never as the string `كيان`.

## Database

Two targets. **Supabase** (`.env`) is the source of truth for staging/production.
**Local Postgres** (`.env.local` + `docker-compose.yml`) exists so UI work
doesn't stop when Supabase is paused or the network is flaky.

```
npm run db:setup            # start container + migrate + seed
npm run db:up / db:down     # start / stop (data survives)
npm run db:reset            # stop and delete the volume
npm run db:studio
```

`.env.local` (gitignored, copy from `.env.local.example`) points the app at
`localhost:5433`. Next.js loads it ahead of `.env` automatically. Delete it to
go back to Supabase.

**The Prisma CLI does not read `.env.local`.** Use the `db:*` scripts, which
pass it via `dotenv-cli`. Bare `npx prisma migrate` — and the older
`prisma:migrate` / `prisma:seed` scripts — read `.env` and will hit **production
Supabase**.

## Commands

```
npm run dev
npm run build               # the real check — Tailwind + next/font resolve here
npx tsc --noEmit
npm test
```

## Conventions

- `src/app/api/**` — public routes must never expose owner-only product fields
  (cost price, supplier, margin). See spec §3.
- `src/lib/queries/**` — split `public*` / `admin*`; keep the boundary.
- Prices are DZD integers in the DB, formatted at the edge.
- No customer accounts. Favourites and checkout details persist in
  `localStorage` per device (spec §8).
