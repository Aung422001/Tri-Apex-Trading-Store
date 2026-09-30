# Deploying to Render — triapextradinggroupmm.com

Everything runs on Render's **free tier**. Defined in [`render.yaml`](render.yaml):

| URL | Service | Plan |
|---|---|---|
| `https://triapextradinggroupmm.com` | `triapex-web` (Next.js) | Free |
| `https://www.triapextradinggroupmm.com` | `triapex-web` (redirects to apex) | Free |
| `https://api.triapextradinggroupmm.com` | `triapex-api` (Express + Prisma) | Free |
| — | `triapex-db` (PostgreSQL) | Free |

---

## Free-tier limits — read first

- **Render deletes free Postgres databases after 30 days.** Everything in it goes
  with it. Before day 30, either upgrade the database (~$7/mo) or export your data
  and create a new one. Put a reminder in your calendar.
- **Free services sleep after 15 minutes** of no traffic. The next visitor waits
  ~30 seconds for a cold start. On a real customer-facing domain this looks
  broken — upgrade `triapex-web` before you advertise the site.
- Free instances have 512 MB RAM, which is why the Chromium price-comparison
  scraper stays disabled.

---

## 1. Push to GitHub

```bash
git add .
git commit -m "Switch to Postgres for Render free tier"
git push origin master
```

## 2. Create the Blueprint

Render Dashboard → **New** → **Blueprint** → select
`Aung422001/Tri-Apex-Trading-Store`.

- **Blueprint Name**: anything
- **Branch**: `master`
- **Blueprint Path**: leave **empty** (defaults to `render.yaml` at the repo root)

Render creates all three resources and prompts for the secrets marked
`sync: false`. The only one you need is **`ADMIN_DEFAULT_PASSWORD`** — it is read
by the seed on the very first boot, while the database is still empty. Leave
`GEMINI_API_KEY`, `ANTHROPIC_API_KEY`, `REDIS_URL`, `STRIPE_*` and `SMTP_*` blank;
those features degrade gracefully.

`DATABASE_URL` is wired from `triapex-db` automatically. Never paste it by hand.

## 3. First boot

The start command runs `prisma migrate deploy`, which creates all 19 tables, then
seeds **only if the database is empty** (12 products, 6 brands, categories,
coupons, blog posts, admin + demo users), then starts the server.

## 4. Point DNS at Render

| Type | Name | Value | TTL |
|---|---|---|---|
| `A` | `@` | `216.24.57.1` | Auto |
| `CNAME` | `www` | `triapex-web.onrender.com` | Auto |
| `CNAME` | `api` | `triapex-api.onrender.com` | Auto |

> **Confirm these against Render before saving.** Each service → **Settings →
> Custom Domains** shows the exact record it expects; the apex IP can change and
> Render's dashboard is the source of truth.

Click **Verify** on each domain in Render. Propagation is usually minutes but can
take up to 48 hours. TLS certificates are issued automatically — don't configure
HTTPS yourself. Behind Cloudflare, set the records to **DNS only** (grey cloud)
until Render has verified them.

## 4b. Until DNS resolves: use the onrender.com URLs

`render.yaml` currently points every URL setting at the default hosts, so the
whole store works before DNS exists:

- Store: `https://triapex-web.onrender.com`
- API: `https://triapex-api.onrender.com/health`

If Render gave a service a suffixed host (for example
`triapex-web-ab12.onrender.com` because the name was taken), put that host in the
URL env vars in `render.yaml`. Once the custom domain shows **Verified** in Render,
switch the four URL env vars back to it (see "Changing the domain later").

## 5. Verify

```bash
curl https://api.triapextradinggroupmm.com/health
# → {"status":"ok","service":"triapex-api"}

curl -I https://triapextradinggroupmm.com
# → HTTP/2 200
```

Open the site and confirm the browser console is free of CSP and CORS errors.

---

## Running locally now that it's Postgres

The Prisma provider is `postgresql`, so **`file:./dev.db` no longer works** and
your old `dev.db` is dead weight. Two options:

1. **Use the Render database.** Render → `triapex-db` → **Connect** → copy the
   *External Database URL* into `backend/.env` as `DATABASE_URL`. Simplest, but
   local development writes to the live database.
2. **Install Postgres locally** and point `DATABASE_URL` at it, then run
   `pnpm --filter backend exec prisma migrate deploy` and `pnpm db:seed`.

Anything you had added to the old SQLite `dev.db` beyond the seed does not carry
over — the seed recreates the base catalog only.

## Changing the domain later

Three places must agree or the site loads with no data:

1. `domains:` in `render.yaml`
2. `API_URL`, `APP_URL`, `CORS_ORIGIN` on `triapex-api`
3. `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_URL` on `triapex-web`

`NEXT_PUBLIC_*` is compiled into the bundle **at build time** and drives the
`Content-Security-Policy` in [`frontend/next.config.js`](frontend/next.config.js).
After changing either, run **Manual Deploy → Clear build cache & deploy**. A
restart will not pick it up.

## What is disabled in production

- **AI price comparison** — `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` keeps Chromium
  out of the build; it won't run in 512 MB anyway.
- **Redis caching** — no `REDIS_URL`, so reads go straight to the database.
- **AI chat** — needs `ANTHROPIC_API_KEY`.
- **Gemini features** — need `GEMINI_API_KEY` with quota remaining.

## Backing up before the 30-day expiry

Render → `triapex-db` → **Connect** → copy the External Database URL, then:

```bash
pg_dump "<external-database-url>" > triapex-backup.sql
```

## Stray Vercel project

A Vercel project (`tri-apex-trading-store-backend`, root `backend/`) is connected
to this repo and posts a failing "Vercel" status on every commit. The site does
not run on Vercel; disconnect the repo in Vercel → that project → **Settings →
Git**, or delete the project. It doesn't affect Render.

## Troubleshooting

| Symptom | Cause |
|---|---|
| `Prisma has no exported member ...` during build | `prisma generate` didn't run. It's wired into backend's `build` and `postinstall` — don't remove it. |
| Site loads, no products, CSP errors in console | `NEXT_PUBLIC_API_URL` wrong, or frontend not rebuilt with cache cleared |
| CORS errors | `CORS_ORIGIN` must list both apex and www exactly |
| Custom domain stuck "unverified" | DNS not propagated, or Cloudflare proxy is on |
| Everyone gets 429 "Too many requests" | Express must trust Render's proxy (`trust proxy` in `backend/src/app.ts`) |
| First request takes 30s | Free instance waking from sleep — expected |
| Everything empty after ~30 days | Render deleted the free Postgres database |
| Build fails on `pnpm install` | Lockfile out of sync — run `pnpm install` locally and commit `pnpm-lock.yaml` |
