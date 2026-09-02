# Deploying to Render — triapextradinggroupmm.com

Two services from one repo, defined in [`render.yaml`](render.yaml):

| URL | Service | Plan |
|---|---|---|
| `https://triapextradinggroupmm.com` | `triapex-web` (Next.js) | Free |
| `https://www.triapextradinggroupmm.com` | `triapex-web` (redirects to apex) | Free |
| `https://api.triapextradinggroupmm.com` | `triapex-api` (Express + Prisma) | **Starter (paid)** |

The SQLite database lives on a 1 GB persistent disk mounted at `/var/data`, so it
survives deploys and restarts.

---

## Cost & limits — read first

- **The backend cannot run on Render's free plan.** Persistent disks are a paid
  feature; Starter is ~$7/month. Without a disk the database is wiped on every deploy.
- The disk pins the API to **one instance** — no horizontal scaling, and deploys
  are stop-then-start (a few seconds of downtime).
- The **free frontend sleeps after 15 minutes** of no traffic; the next visit takes
  ~30 seconds to wake. On a real domain this looks broken to customers — upgrade
  `triapex-web` to Starter before you announce the site.

---

## 1. Push to GitHub

```bash
git add .
git commit -m "Add Render deployment config"
git push origin master
```

## 2. Create the Blueprint

Render Dashboard → **New** → **Blueprint** → select
`Aung422001/Tri-Apex-Trading-Store` → **Apply**.

Render creates both services and prompts for the secrets marked `sync: false`.
Paste them from `backend/.env.production` (that file is gitignored and stays on
your machine).

At minimum set **`ADMIN_DEFAULT_PASSWORD`** before the first successful boot —
the seed only runs against an empty database, so this is your one chance to have
it create the admin account with a password of your choosing.

## 3. Point DNS at Render

In your domain registrar's DNS panel, add these three records:

| Type | Name | Value | TTL |
|---|---|---|---|
| `A` | `@` | `216.24.57.1` | Auto |
| `CNAME` | `www` | `triapex-web.onrender.com` | Auto |
| `CNAME` | `api` | `triapex-api.onrender.com` | Auto |

> **Confirm the values in Render before you save them.** Open each service →
> **Settings → Custom Domains**; Render shows the exact record it expects. The
> apex IP in particular can change, and Render's dashboard is the source of truth.

Then in Render, click **Verify** on each domain. DNS usually propagates in
minutes but can take up to 48 hours. Render issues free TLS certificates
automatically once verification succeeds — don't configure HTTPS yourself.

If your DNS is behind Cloudflare, set the records to **DNS only** (grey cloud)
until Render has verified them and issued the certificate, otherwise validation
fails.

## 4. Verify

```bash
curl https://api.triapextradinggroupmm.com/health
# → {"status":"ok","service":"triapex-api"}

curl -I https://triapextradinggroupmm.com
# → HTTP/2 200
```

Then open the site and check the browser console is free of CSP and CORS errors.

---

## Changing the domain later

Three places must agree, or the site loads but shows no data:

1. `domains:` in `render.yaml`
2. `API_URL`, `APP_URL`, `CORS_ORIGIN` on `triapex-api`
3. `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_URL` on `triapex-web`

`NEXT_PUBLIC_*` is compiled into the JS bundle **at build time** and also drives
the `Content-Security-Policy` in [`frontend/next.config.js`](frontend/next.config.js).
After changing either, run **Manual Deploy → Clear build cache & deploy**. A
plain restart will not pick up the change.

## What is disabled in production

- **AI price comparison** — `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` keeps Chromium
  (~150 MB) out of the build; it won't run in 512 MB of RAM anyway. To enable it,
  move to a Standard instance and add
  `npx playwright install --with-deps chromium` to the build command.
- **Redis caching** — no `REDIS_URL` means reads go straight to the database.
  To enable, create a Render Key Value instance and set `REDIS_URL`.
- **AI chat** — needs `ANTHROPIC_API_KEY`, otherwise the widget returns an
  offline message.
- **Gemini features** (recommendations, compare, description generation) — need
  `GEMINI_API_KEY` with quota remaining.

## Backing up the database

The disk is **not** backed up automatically. From the API service's **Shell** tab:

```bash
cp /var/data/prod.db /tmp/backup-$(date +%F).db
```

## Troubleshooting

| Symptom | Cause |
|---|---|
| `tsc` errors about `Prisma has no exported member ...` | `prisma generate` didn't run. It's wired into backend's `build` and `postinstall` scripts — don't remove it. |
| Site loads, no products, CSP errors in console | `NEXT_PUBLIC_API_URL` wrong, or frontend not rebuilt with cache cleared after changing it |
| CORS errors in console | `CORS_ORIGIN` doesn't exactly match the browser's origin — it must list both apex and www |
| Custom domain stuck "unverified" | DNS not propagated yet, or Cloudflare proxy (orange cloud) is on |
| API 500s on every request | `DATABASE_URL` not `file:/var/data/prod.db`, or the disk isn't mounted |
| Data disappears after deploy | The disk was removed, or the service was recreated on the free plan |
| Build fails on `pnpm install` | Lockfile out of sync — run `pnpm install` locally and commit `pnpm-lock.yaml` |
