# Dependency and Upload Security Remediation

Checked 2026-10-30. This records the actual dependency audit and checks performed in the current workspace. No deployment, server start, external account setup, or paid service was used.

## Versions and dependency paths

| Package | Before | After | Dependency path / use |
| --- | --- | --- | --- |
| Node.js | 18.19.0 active system runtime | Node 24.22.2 used for verification; `engines.node` is `>=24`, `.nvmrc` is `24` | Next.js build and PDF.js runtime compatibility. Node 24 is an active LTS line per the Node release schedule. |
| `next` | 14.2.35 (`package.json` range `^14.2.30`) | 15.5.28 (`^15.5.28`) | Direct production dependency. |
| `postcss` | 8.4.31 | 8.5.32 | `next@14.2.35 -> postcss@8.4.31`; now pinned with npm `overrides` for `next@15.5.28`. |
| `xlsx` / SheetJS CE | 0.18.5 from the stale public npm package | 0.20.3 from the official SheetJS CDN tarball | Direct production dependency; used only to create XLSX downloads in PDF conversion and OCR. No app route reads user-supplied XLSX files. |
| `react` / `react-dom` | 18.3.1 | 18.3.1 | Kept on React 18; accepted by Next 15.5.28 peer ranges. |
| `pdfjs-dist` | 4.10.38 | 4.10.38 | Client-side PDF tools only; package declares Node `>=20`. |
| TypeScript | 5.9.3 installed | 5.9.3 | `npm run lint` is `tsc --noEmit`. |

`package-lock.json` now pins the exact dependency graph and the SheetJS CDN tarball URL/integrity. SheetJS's official documentation calls the CDN authoritative because the public npm `xlsx` registry package is stale, and recommends vendoring the tarball for infrastructure independence. This project uses the official CDN URL directly; future installs require access to that host. No private fork or unverified package was introduced.

## Audit findings before remediation

The pre-change command was `npm audit --omit=dev`. It reported 3 vulnerable package nodes: `next@14.2.35`, its transitive `postcss@8.4.31`, and `xlsx@0.18.5`. npm offered no non-breaking automatic fix for the combined graph and suggested a major Next 16 jump. No `npm audit fix --force` was run.

Next.js advisories reported for the old Next 14 dependency node and the patched 15.x floor:

| Advisory | Affected Next.js range relevant to old version | Patched 15.x release |
| --- | --- | --- |
| [GHSA-9g9p-9gw9-jx7f](https://github.com/advisories/GHSA-9g9p-9gw9-jx7f) | `>=10.0.0 <15.5.10` | 15.5.10 |
| [GHSA-h25m-26qc-wcjf](https://github.com/advisories/GHSA-h25m-26qc-wcjf) | `>=13.0.0 <15.0.8` | 15.0.8 |
| [GHSA-ggv3-7p47-pfv8](https://github.com/advisories/GHSA-ggv3-7p47-pfv8) | `>=9.5.0 <15.5.13` | 15.5.13 |
| [GHSA-3x4c-7xq6-9pq8](https://github.com/advisories/GHSA-3x4c-7xq6-9pq8) | `>=10.0.0 <15.5.14` | 15.5.14 |
| [GHSA-q4gf-8mx6-v5v3](https://github.com/advisories/GHSA-q4gf-8mx6-v5v3) | `>=13.0.0 <15.5.15` | 15.5.15 |
| [GHSA-8h8q-6873-q5fj](https://github.com/advisories/GHSA-8h8q-6873-q5fj) | `>=13.0.0 <15.5.16` | 15.5.16 |
| [GHSA-3g8h-86w9-wvmq](https://github.com/advisories/GHSA-3g8h-86w9-wvmq) | `>=12.2.0 <15.5.16` | 15.5.16 |
| [GHSA-ffhc-5mcf-pf4q](https://github.com/advisories/GHSA-ffhc-5mcf-pf4q) | `>=13.4.0 <15.5.16` | 15.5.16 |
| [GHSA-vfv6-92ff-j949](https://github.com/advisories/GHSA-vfv6-92ff-j949) | `>=13.4.6 <15.5.16` | 15.5.16 |
| [GHSA-gx5p-jg67-6x7h](https://github.com/advisories/GHSA-gx5p-jg67-6x7h) | `>=13.0.0 <15.5.16` | 15.5.16 |
| [GHSA-h64f-5h5j-jqjh](https://github.com/advisories/GHSA-h64f-5h5j-jqjh) | `>=10.0.0 <15.5.16` | 15.5.16 |
| [GHSA-c4j6-fc7j-m34r](https://github.com/advisories/GHSA-c4j6-fc7j-m34r) | `>=13.4.13 <15.5.16` | 15.5.16 |
| [GHSA-wfc6-r584-vfw7](https://github.com/advisories/GHSA-wfc6-r584-vfw7) | `>=14.2.0 <15.5.16` | 15.5.16 |
| [GHSA-36qx-fr4f-26g5](https://github.com/advisories/GHSA-36qx-fr4f-26g5) | `>=12.2.0 <15.5.16` | 15.5.16 |
| [GHSA-m99w-x7hq-7vfj](https://github.com/advisories/GHSA-m99w-x7hq-7vfj) | `>=13.0.0 <15.5.21` | 15.5.21 |
| [GHSA-89xv-2m56-2m9x](https://github.com/advisories/GHSA-89xv-2m56-2m9x) | `>=14.1.1 <15.5.21` | 15.5.21 |
| [GHSA-68g3-v927-f742](https://github.com/advisories/GHSA-68g3-v927-f742) | `>=13.0.0 <15.5.21` | 15.5.21 |
| [GHSA-4633-3j49-mh5q](https://github.com/advisories/GHSA-4633-3j49-mh5q) | `>=13.0.0 <15.5.21` | 15.5.21 |
| [GHSA-4c39-4ccg-62r3](https://github.com/advisories/GHSA-4c39-4ccg-62r3) | `>=13.0.0 <15.5.21` | 15.5.21 |
| [GHSA-p9j2-gv94-2wf4](https://github.com/advisories/GHSA-p9j2-gv94-2wf4) | `>=12.0.0 <15.5.21` | 15.5.21 |
| [GHSA-955p-x3mx-jcvp](https://github.com/advisories/GHSA-955p-x3mx-jcvp) | `>=13.0.0 <15.5.21` | 15.5.21 |
| [GHSA-p293-qw3h-jr36](https://github.com/advisories/GHSA-p293-qw3h-jr36) | `>=13.4.0 <15.5.24` | 15.5.24 |
| [GHSA-2xp9-vwfh-vxw4](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4) | `>=10.0.0 <15.5.24` | 15.5.24 |
| [GHSA-2464-fhr4-w9xw](https://github.com/advisories/GHSA-2464-fhr4-w9xw) | `>=10.0.0 <=15.5.27` | 15.5.28 |
| [GHSA-p3m5-59mp-jv5r](https://github.com/advisories/GHSA-p3m5-59mp-jv5r) | `>=13.0.0 <=15.5.27` | 15.5.28 |

The first failed audit also reported a combined Next/PostCSS advisory node. PostCSS findings were `GHSA-qx2v-qp2m-jg93` (`<8.5.10`), `GHSA-6g55-p6wh-862q` (`<=8.5.11`), `GHSA-r28c-9q8g-f849` (`<=8.5.17`), and `GHSA-fxqj-rqcc-2cmp` (`<=8.5.22`). The old transitive `8.4.31` fell within all four ranges. The override now resolves `8.5.32`.

For npm `xlsx`, [GHSA-4r6h-8v6p-xvw6](https://github.com/advisories/GHSA-4r6h-8v6p-xvw6) affects `<0.19.3` (prototype pollution when reading specially crafted workbook files), and [GHSA-5pgg-2g8v-p4x9](https://github.com/advisories/GHSA-5pgg-2g8v-p4x9) affects `<0.20.2` (ReDoS). The public npm package was `0.18.5`; the installed version is now `0.20.3` from the official SheetJS CDN. The application only writes workbooks, so the file-reading prototype-pollution attack path was not used here, but the dependency was updated to a patched release regardless.

## Framework and runtime decisions

- Next.js 16 was not chosen: its official upgrade guide requires Node `>=20.9`, changes the default bundler to Turbopack, removes `next lint`, removes synchronous request APIs, and changes several route/image/cache behaviors. This is a wider migration than needed.
- Next.js 15.5.28 is a major upgrade from 14, but is the minimum 15.5 patch identified by the official Next release/advisory data for the latest fixes known at the time, including critical Windows-hosted RCE and SVG optimization advisories. Its peer dependency range accepts existing React 18.3.1. The source scan found only client-side `useSearchParams` usage; no synchronous server `cookies()`, `headers()`, `draftMode()`, `params`, `searchParams`, or `revalidateTag()` use was found.
- Node 24 LTS is selected for development/CI/container consistency: `pdfjs-dist@4.10.38` requires Node `>=20`, and Next 15 supports Node 18.18+ / 20+, but Node 18 is end-of-life and Node 20 is end-of-life by the current official release schedule. Local system Node was not replaced; validation used an ephemeral Node 24.22.2 binary. `Dockerfile` now uses `node:24-bookworm-slim`.
- React stays at 18.3.1 because Next 15.5.28 accepts React 18.2+ and no app usage required React 19.

Official references:

- https://nextjs.org/docs/app/guides/upgrading/version-15
- https://nextjs.org/docs/app/guides/upgrading/version-16
- https://github.com/vercel/next.js/releases/tag/v15.5.28
- https://nodejs.org/en/about/previous-releases
- https://docs.sheetjs.com/docs/getting-started/installation/nodejs/
- https://cdn.sheetjs.com/advisories/CVE-2023-30533
- https://cdn.sheetjs.com/advisories/CVE-2024-22363

## PDF.js runtime warning

`pdfjs-dist@4.10.38` emits `Warning: Please use the legacy build in Node.js environments.` merely when the browser-oriented `pdfjs-dist` entry point is imported under Node. This was reproduced with a direct Node 24 module import. The three imports are in client PDF tool pages and are needed for browser processing/prerender bundling. Neither `app/api/pdf-security` nor `app/api/pdf-replace-text` imports PDF.js; the APIs use qpdf and Python/PyMuPDF respectively. This warning therefore does not mean server-side PDF API processing uses PDF.js. The production build passes; the warning remains documented rather than switching client tools to a different PDF.js build without a browser regression test.

## PDF API resource controls

Implemented in `app/api/_lib/pdf-request.ts`, `app/api/_lib/run-process.ts`, and both PDF route handlers:

- Reject non-multipart requests and invalid declared `Content-Length` values.
- Enforce a streamed raw-body cap before multipart parsing: 50 MiB + 1 MiB for security; 25 MiB + 128 KiB for replacement.
- Abort upload reads after 120 seconds.
- Limit to one active PDF process per Node.js process across both endpoints; a busy process returns `429` with `Retry-After`.
- Bound child-process time at 60 seconds and captured stderr at 1 MiB.
- qpdf passwords and PyMuPDF replacement text are delivered through child stdin, not command-line arguments. qpdf documents `@-` for reading arguments from stdin; password newlines are rejected because qpdf's argument-file format is line-based.
- Keep random temporary directories and `finally` cleanup; reject output larger than 2x the respective input cap before reading it back into memory; responses remain `no-store`.

Residual limitations: multipart parsing still buffers the bounded body and creates additional in-memory copies, so plan adequate per-instance memory. The semaphore is per Node process, not a distributed rate limiter; horizontal replicas can each accept one job. There is still no IP-based rate limiting or hosting-level upload timeout configured. A child process may write an output file before the post-process size check, so the host must provide temporary disk quotas/monitoring. qpdf/PyMuPDF integration and real encrypted PDF behavior were not tested here because qpdf/Docker are unavailable and the local environment does not have the deployment image.

## Final validation results

- `npm run lint` under Node 24.22.2: passed.
- `npm run build` under Node 24.22.2 / Next 15.5.28 using `NEXT_BUILD_DIR=.next-build-check`: passed; all 39 static pages generated. No local server was started.
- Direct helper checks: valid multipart parse, declared over-limit rejection, wrong content-type rejection, process-global slot cap, and slot release passed. This was not an HTTP API integration test.
- Fresh `npm audit --omit=dev`: **found 0 vulnerabilities** after updating `next`, transitive `postcss`, and SheetJS. This is the only basis for saying the previously reported advisories were remediated in the installed production dependency graph.
- Remaining build notices: PDF.js import-time Node warning described above; earlier build output also had an Autoprefixer CSS `flex-end` compatibility warning (it did not recur on the last build). Neither blocks compilation.
- No server smoke test, full tool suite, qpdf/PyMuPDF API integration test, deployment, push, or account-level verification was performed.
