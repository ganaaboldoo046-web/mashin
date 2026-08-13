# Google registration checklist

Use the same Google account as both a Google Search Console verified owner and a Google Cloud project owner/editor.

## 1. Deploy and verify the public pages

All of these URLs must load without signing in:

- `https://dt-trading.kr/`
- `https://dt-trading.kr/about`
- `https://dt-trading.kr/privacy`
- `https://dt-trading.kr/terms`
- `https://dt-trading.kr/robots.txt`
- `https://dt-trading.kr/sitemap.xml`

The apex domain is the canonical hostname. If `www.dt-trading.kr` is configured later, permanently redirect it to `https://dt-trading.kr`.

Because `www.dt-trading.kr` currently resolves, create a Cloudflare Redirect Rule:

- Match: hostname equals `www.dt-trading.kr`
- Target: `concat("https://dt-trading.kr", http.request.uri.path)`
- Status: `301`
- Preserve query string: enabled

Also redirect `mashin-a6j.pages.dev` to the custom domain in the Cloudflare Pages custom-domain settings. Until that redirect is enabled, the project sends `X-Robots-Tag: noindex, nofollow` on the Pages subdomain.

## 2. Google Search Console

1. Open `https://search.google.com/search-console`.
2. Add a **Domain** property with `dt-trading.kr` (no protocol and no `www`).
3. Copy the Google verification TXT value.
4. In Cloudflare DNS, add a TXT record at the root (`@`) with that value.
5. Return to Search Console and select **Verify**. Keep the TXT record after verification.
6. Open **Sitemaps** and submit `sitemap.xml`.
7. Use **URL inspection** to request indexing for `/`, `/about`, `/privacy`, and `/terms`.

## 3. Google Auth Platform branding

Create or select the Google Cloud project, then use these values:

- App name: `DT Trading`
- User support email: `snorsininster@gmail.com`
- App home page: `https://dt-trading.kr/`
- Privacy policy: `https://dt-trading.kr/privacy`
- Terms of service: `https://dt-trading.kr/terms`
- Authorized domain: `dt-trading.kr`
- Developer contact email: `snorsininster@gmail.com`
- Audience: **External**
- Data access scopes: `openid`, `email`, `profile` only

Publish the app to Production when the branding and domain checks are complete. While it remains in Testing, add every account that must be able to sign in as a test user.

## 4. OAuth web client

Create an OAuth client with application type **Web application**.

Authorized JavaScript origins:

- `https://dt-trading.kr`
- `https://www.dt-trading.kr` (only if the `www` hostname is configured)
- `https://mashin-a6j.pages.dev`
- `http://localhost:5173`
- `http://127.0.0.1:5173`

Do not add a redirect URI for the current popup-based Google Sign-In implementation.

Copy the generated Web client ID and set the same value in both places:

- GitHub → repository Settings → Environments → `production` → Variables: `VITE_GOOGLE_CLIENT_ID`
- Cloudflare → Workers & Pages → `mashin-a6j` → Settings → Variables and Secrets → Production variable: `GOOGLE_CLIENT_ID`

`GOOGLE_CLIENT_ID` is public configuration, not a password. `SESSION_SECRET` must remain encrypted and must be at least 32 characters.

Update the Cloudflare Pages Production variable `PUBLIC_SITE_URL` to `https://dt-trading.kr` before redeploying. This value is used for authentication origin checks.

## 5. Final checks after deployment

1. Open a private/incognito window and test Google sign-in.
2. Confirm `/api/user_session` returns an authenticated user after login.
3. Confirm logout removes the session.
4. Test `https://dt-trading.kr/` with Google's Rich Results Test.
5. In Search Console, check that `sitemap.xml` is accepted and inspect a product URL.
