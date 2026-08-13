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

Create a Google OAuth 2.0 **Web application** client. Add the production site and local development URLs to its Authorized JavaScript origins. Set its public client ID as `VITE_GOOGLE_CLIENT_ID` at build time and as `GOOGLE_CLIENT_ID` in Cloudflare Pages runtime variables.

Configure these Cloudflare Pages variables and secrets:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD_HASH`: lowercase SHA-256 of the administrator password
- `SESSION_SECRET`: at least 32 random characters
- `PUBLIC_SITE_URL`: canonical production origin, `https://dt-trading.kr`
- `GOOGLE_CLIENT_ID`: Google Web OAuth client ID (a public variable, not a password)

Never commit `.dev.vars` or plaintext administrator credentials.

## Deployment

Pull requests run build and lint checks. A verified push to `main` deploys the exact commit to the `mashin-a6j` Cloudflare Pages project through `.github/workflows/deploy.yml`.

Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as secrets and `VITE_GOOGLE_CLIENT_ID` as a variable in the GitHub `production` environment. D1 (`DB`) and R2 (`BUCKET`) bindings and the authentication variables/secrets must also exist in the Cloudflare Pages production environment.

## Google launch

Follow [`docs/google-registration.md`](docs/google-registration.md) to verify `dt-trading.kr` in Search Console, submit the dynamic sitemap, configure OAuth branding, create the Web client and connect the GitHub/Cloudflare variables.
