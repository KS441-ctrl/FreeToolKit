# Production readiness checklist

## Current verified state

- Framework: Next.js 15.5.28 App Router, React 18.3.1, TypeScript 5.9.3 installed.
- Required Node version: Node.js 24 LTS or later. `pdfjs-dist` 4.10.38 declares Node `>=20`; Node 18 and 20 are end-of-life. Local system Node remains 18.19.0; validation used ephemeral Node 24.22.2.
- Production dependency audit: `npm audit --omit=dev` reports 0 vulnerabilities after upgrading Next, overriding PostCSS, and using official SheetJS 0.20.3.
- Application routes: 26 tool pages, two Node.js PDF API routes, and public privacy, terms, affiliate, resources, robots, sitemap, and ads.txt routes.
- Browser PDF operations use `pdf-lib` and PDF.js. OCR uses Tesseract.js; DOCX/XLSX exports use `docx` and `xlsx`.
- `/api/pdf-security` requires qpdf. `/api/pdf-replace-text` requires Python 3 and PyMuPDF. `Dockerfile` installs these requirements; local Docker and qpdf are not currently available in the inspected environment.
- Uploaded API PDFs are limited to 25 MB or 50 MB. Raw multipart bodies are capped before parsing, upload duration is limited to 120 seconds, and a process-global semaphore permits one PDF job per Node process. Subprocess execution is limited to 60 seconds/1 MiB stderr; passwords and replacement text travel through stdin instead of argv. Random temporary directories are removed in `finally`. No persistent upload storage is implemented.
- API protection is process-local, not a distributed/IP rate limit. Multipart parsing still buffers bounded bodies and makes memory copies; verify host memory, disk quotas, request duration, and cross-replica rate controls before public launch.
- Analytics and ads have no real account IDs configured. Affiliate destinations are empty by default. No deployment, Search Console verification, program approval, or AdSense approval has been confirmed.
- Sitemap and `metadataBase` now require a real `NEXT_PUBLIC_SITE_URL`; robots allows public pages and disallows `/api/`.

## Hosting decision

No examined $0 host is verified to support the complete current application, including both server-side PDF routes and their native/external runtimes. Keep the existing Docker deployment path as the compatible baseline; choose a Docker-capable commercial host only after reviewing its current charges, resource limits, and terms. No provider has been selected or deployed.

- **Netlify:** its current pricing page lists a Free plan at $0 with 300 monthly credits, custom domains with SSL, global CDN, and Functions. Usage-based plans and credit packs can create charges; check account billing/auto-recharge settings before enabling anything. Its functions can run server code, but this repository's qpdf + Python/PyMuPDF runtime bundle has not been demonstrated on Netlify. Do not deploy the PDF APIs there until that is proven, or the two APIs will be unavailable.
- **Cloudflare Workers:** current Free limits include 100,000 requests/day, 10 ms CPU/request, 128 MB isolate memory, and 100 MB request bodies. These are poor margins for buffered PDF processing. Current official Next.js guidance recommends vinext, which is in beta; this project is Next.js 14 and depends on qpdf and Python, neither of which is provided as a normal Workers runtime. Not selected for the complete app.
- **Cloudflare Workers:** current Free limits include 100,000 requests/day, 10 ms CPU/request, 128 MB isolate memory, and 100 MB request bodies. These are poor margins for buffered PDF processing. Current official Next.js guidance recommends vinext, which is in beta; this project is Next.js 15 and depends on qpdf and Python, neither of which is provided as a normal Workers runtime. Not selected for the complete app.
- **Vercel Hobby:** not suitable for this monetized site. Current official fair-use terms restrict Hobby to non-commercial personal use and explicitly include advertising and affiliate links as commercial usage.

Sources checked 2026-10-30:

- https://www.netlify.com/pricing/
- https://docs.netlify.com/build/functions/overview/
- https://developers.cloudflare.com/workers/platform/limits/
- https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/
- https://vercel.com/docs/limits/fair-use-guidelines

## Before launch

- [ ] Use Node.js 20+ and a clean, reproducible install from `package-lock.json`.
- [ ] Use Node.js 24 LTS+ and a clean, reproducible install from `package-lock.json`. The SheetJS tarball is fetched from the official CDN during npm install.
- [ ] Configure the real HTTPS `NEXT_PUBLIC_SITE_URL`; verify `sitemap.xml`, `robots.txt`, page titles, canonical host, and social metadata on the deployed host.
- [ ] Replace `CONTACT_EMAIL_REPLACE_ME` in `app/layout.tsx` with a monitored contact address; review privacy and terms against actual vendors, retention, legal operator, and target markets.
- [ ] Run `npm run lint`, `npm run build`, and test all 26 tools in supported browsers, including real valid/malformed/large/encrypted PDFs.
- [ ] Test qpdf encrypt/decrypt using a PDF reader and authorized files; test PyMuPDF replacement/redaction and inspect every page. Add server-side rate limiting and hosting request limits before exposing upload APIs publicly.
- [ ] Test qpdf encrypt/decrypt using a PDF reader and authorized files; test PyMuPDF replacement/redaction and inspect every page. Add edge/IP rate limiting, host resource quotas, and request limits before exposing upload APIs publicly.
- [ ] Confirm files are not retained, cached, or included in logs; verify host temp storage and error logging behavior.
- [ ] Configure GA4 only with a real `G-...` measurement ID; test consent accept/reject and page-view behavior. No analytics is live until verified.
- [ ] Configure an appropriate consent platform for actual jurisdictions and advertising behavior before enabling ads. The current consent prompt is not a certified CMP.
- [ ] Apply to affiliate programs only after the site and recommendations are ready. Configure only approved tracking URLs and keep the disclosure near links.
- [ ] Apply to AdSense only after the publisher has configured real identity/contact and privacy disclosures, useful content, consent, and approved IDs. Approval is not guaranteed.
- [ ] Verify custom domain, HTTPS, key tool routes, static PDF worker, uploads/downloads, mobile layout, and API routes on the actual host.
- [ ] Create or connect a private Git remote deliberately; review secrets and visibility before any push.

## Not done / requires operator access

No account logins, domain, Git remote, deployment target, contact address, GA4 property, Search Console property, affiliate account, affiliate tracking URL, or AdSense publisher IDs were supplied. This project remains undeployed and unmonetized.
