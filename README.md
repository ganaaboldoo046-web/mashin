# DT Trading

Mongolian customers can browse, save and reserve inspected vehicles imported from Korea. The project uses React, TypeScript, Vite and Cloudflare Pages Functions with D1 and R2.

## Local development

```bash
npm ci
npm run build
copy .dev.vars.example .dev.vars
npm run dev:full
```

`npm run dev` starts only Vite. API-backed screens intentionally show an outage state unless a Pages Functions server is also running.

## Required configuration

Set `VITE_GOOGLE_CLIENT_ID` at build time. Configure these encrypted Cloudflare secrets for Pages Functions:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD_HASH`: lowercase SHA-256 of the administrator password
- `SESSION_SECRET`: at least 32 random characters
- `PUBLIC_SITE_URL`: canonical production origin, for example `https://www.temmun.mn`

Never commit `.dev.vars` or plaintext administrator credentials.

## Deployment

Pull requests run build and lint checks. A verified push to `main` deploys the exact commit to the `temmun-car` Cloudflare Pages project through `.github/workflows/deploy.yml`.

Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` to the GitHub `production` environment. D1 (`DB`) and R2 (`BUCKET`) bindings and the authentication secrets must also exist in the Cloudflare Pages production environment.
