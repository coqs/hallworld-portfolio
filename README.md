# hallworld portfolio

Minimal ATS-style interactive resume and writing site.

## Frontend

```bash
npm install
npm run dev
```

## Cloudflare Worker

Create a D1 database, put its ID in `wrangler.jsonc`, then run:

```bash
npx wrangler d1 migrations apply hallworld-content --remote
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put SESSION_SECRET
npm run worker:deploy
```

Update the Worker hostname in `vercel.json` if Cloudflare assigns a different URL. The frontend proxies `/api/*` to the Worker in production and Vite proxies it to Wrangler locally.
