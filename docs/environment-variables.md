# Environment variables

Set values in the hosting dashboard or a local `.env.local` file. Do not commit populated environment files. Values prefixed `NEXT_PUBLIC_` are included in browser code and must never contain secrets.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Before launch | Canonical HTTPS site origin. Required for absolute sitemap URLs and metadata base; leave blank during local development. |
| `NEXT_PUBLIC_GA_ID` | No | GA4 measurement ID (`G-...`). Analytics is opt-in and does not load without a valid ID and consent. |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | No | Approved AdSense client ID (`ca-pub-...`); public identifier, not a secret. |
| `NEXT_PUBLIC_ADSENSE_SLOT` | No | Approved numeric ad slot. Ads remain disabled until both ad values and optional-service consent are present. |
| `ADSENSE_PUBLISHER_ID` | No | Server-only numeric publisher ID used to generate `/ads.txt` after approval. |
| `NEXT_PUBLIC_AFFILIATE_HOSTING_URL` | No | Confirmed, approved affiliate destination URL for a relevant hosting recommendation. |
| `NEXT_PUBLIC_AFFILIATE_PDF_URL` | No | Confirmed, approved affiliate destination URL for relevant PDF software. |
| `NEXT_PUBLIC_AFFILIATE_DEVELOPER_URL` | No | Confirmed, approved affiliate destination URL for relevant developer software. |
| `NEXT_PUBLIC_AFFILIATE_STORE_URL` | No | Confirmed, approved affiliate destination URL for relevant study or office supplies. |
| `NEXT_PUBLIC_AMAZON_ASSOCIATE` | No | Set to `true` only after joining and verifying the applicable Amazon marketplace and required disclosure wording. |
| `PYTHON_BIN` | No | Server-only Python executable override for PDF text replacement. Docker sets this to its PyMuPDF virtual environment. |
| `NEXT_BUILD_DIR` | No | Optional Next.js build output directory override, useful for isolated local validation. Defaults to `.next`. |

Affiliate variables must contain the actual network-generated tracking destinations, not a network home page. Never configure a destination until the account and individual offer are approved and its terms permit the intended placement and audience.
