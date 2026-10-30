# Free Toolkit

A Next.js + TypeScript starter for a free online tools website. Core text and PDF operations are designed to run in the browser where practical.

## Run locally
1. Install Node.js 24 LTS or later.
2. Extract the project and open a terminal in this directory.
3. Run `npm install`.
4. Copy `.env.example` to `.env.local` and replace `NEXT_PUBLIC_SITE_URL` with your real canonical domain before deployment.
5. Run `npm run dev` and visit `http://localhost:3000`.
6. Run `npm run build` before deployment.

## Included tools
- Word and character counter
- Case converter
- Remove duplicate lines
- Line-by-line text comparison
- Text formatter
- JSON formatter, validator, and minifier
- URL encoder/decoder
- Base64 encoder/decoder
- Unix timestamp converter
- JavaScript regex tester
- Percentage calculator
- Age calculator
- Date difference calculator
- Loan EMI calculator
- Unit converter (length, weight, temperature)
- CGPA average calculator
- Study timetable generator
- Mathematics helper (square, cube, square root, absolute value)
- Exam countdown
- PDF merge, rotate, delete pages, extract pages, drag-and-drop reorder, and page thumbnails
- Add text overlays, typed signatures, images, highlight rectangles, and drawing marks
- Add page numbers and watermarks
- Visual cover overlay and rasterized/flattened redaction mode
- PDF compression by rasterizing pages at adjustable quality
- Export PDF pages as PNG/JPG and extract selectable text to TXT
- JPG/PNG images to PDF
- PDF password protection/unlocking endpoint using qpdf (requires server setup)
- SEO metadata, Open Graph metadata, `robots.txt`, and `sitemap.xml`
- Optional Google Analytics and AdSense integration gated by optional-services consent
- Privacy, terms, and affiliate-disclosure starter pages

## PDF limitations to understand
- Adding text over existing PDF text is an overlay, not a direct edit of the original text stream.
- The white-cover option is not secure redaction. The rasterized redaction option flattens a selected area, but rasterizes every page and loses searchable text, links, forms, metadata, and accessibility. Inspect output carefully.
- Rasterized compression may make files larger; it can reduce quality and removes selectable/searchable text. Compare the output size with the original.
- PDF password protection/unlocking uses `qpdf` through the server API. Password input is provided to qpdf through stdin rather than process arguments. The included Dockerfile installs qpdf. Deploy with Docker for this feature, or install qpdf in your own Node.js runtime. A serverless host without qpdf will return a clear unavailable message.
- Browser processing can be memory-intensive for large PDFs. The preview UI renders up to 40 thumbnails; the text order field supports larger documents.
- OCR for scanned PDFs is available in the browser, but accuracy varies with image quality and language. PDF-to-Word/Excel exports selectable or OCR text into simple paragraphs/rows; they do not reliably preserve page layout, tables, images, formulas, or columns. True semantic editing of arbitrary existing PDF text/image objects is not included.

## Production deployment checklist
1. Replace `NEXT_PUBLIC_SITE_URL`, `CONTACT_EMAIL_REPLACE_ME` in `app/layout.tsx`, and any other sample identity details with real values.
2. Review the privacy and terms pages with appropriate legal guidance for the markets where you operate. They are starter templates, not legal advice.
3. Configure `NEXT_PUBLIC_GA_ID` only if you use GA4. Analytics loads only after the visitor accepts optional services.
4. Configure `NEXT_PUBLIC_ADSENSE_CLIENT` and `NEXT_PUBLIC_ADSENSE_SLOT` only after your AdSense account/site is approved. Ads load only after optional-services opt-in. In the EEA, UK, and Switzerland, Google may require a Google-certified CMP integrated with the IAB TCF; the simple consent prompt here is not a substitute for that requirement. Check current Google policies for your actual deployment.
5. Set up a real contact address, HTTPS, domain, monitoring, backups, rate limiting, request-size limits, and server security headers. The PDF security endpoint limits file size to 50 MB and deletes its temporary directory after each request.
6. Test every tool in supported browsers with ordinary, malformed, encrypted, and large files. Test PDF password outputs by opening them in an independent PDF reader.
7. Submit `https://YOUR_DOMAIN/sitemap.xml` to Google Search Console after launch. SEO setup does not guarantee indexing, traffic, or revenue. Affiliate monetization is not connected because you must first join an affiliate program and provide your actual partner links and disclosure requirements.

## Docker deployment (includes qpdf)
```bash
docker build -t free-toolkit .
docker run --rm -p 3000:3000 \
  -e NEXT_PUBLIC_SITE_URL=https://your-real-domain.example \
  -e NEXT_PUBLIC_GA_ID= \
  -e NEXT_PUBLIC_ADSENSE_CLIENT= \
  -e NEXT_PUBLIC_ADSENSE_SLOT= \
  free-toolkit
```

The PDF.js worker is copied from the installed dependency into `public/` by the `predev` and `prebuild` scripts so Next.js does not run the worker module through its JavaScript minifier. The generated worker is ignored by Git. Use Node.js 24 LTS or later; Node 18 and 20 are end-of-life, and `pdfjs-dist` requires Node 20+.

The project is a substantial starter implementation, not a claim that every edge case has been production-tested. Run `npm install` and `npm run build` in your environment and resolve any platform-specific issues before publishing.


## Added PDF conversion, OCR, advertising and affiliate setup

- **PDF password protection/unlocking:** `/tools/pdf-security` calls `qpdf` via `/api/pdf-security`. Docker installs qpdf. On other hosts install qpdf in the server runtime; do not expose this route without rate limiting and upload-size limits in production.
- **Text replacement:** PDF Studio includes a local visual overlay option. `/tools/pdf-replace-text` also uses Python 3 + PyMuPDF to redact a selected rectangle and insert replacement text, removing overlapping text and potentially nearby graphics or image pixels in that rectangle. Docker installs PyMuPDF; non-Docker hosts need Python 3 and PyMuPDF, with `PYTHON_BIN` set if needed.
- **OCR:** `/tools/pdf-ocr` uses PDF.js and Tesseract.js in the browser. Current limit is 30 MB and 20 pages per run; it exports TXT, DOCX, or XLSX and may make recognition errors.
- **PDF to Word / Excel:** `/tools/pdf-convert` creates editable DOCX paragraphs and an XLSX workbook with one extracted text line per row. It does not preserve original page layout or reliably reconstruct tables, images, formulas, or columns.
- **Google AdSense:** configure `NEXT_PUBLIC_ADSENSE_CLIENT` and `NEXT_PUBLIC_ADSENSE_SLOT` after approval. Configure `ADSENSE_PUBLISHER_ID` (digits only, without `pub-`) to populate `/ads.txt`. This project does not grant AdSense approval. The existing consent UI is a simple optional-services choice, not a Google-certified CMP; for EEA/UK/Switzerland traffic, integrate a Google-certified CMP where required before serving personalized ads. Test consent and ad behavior with your privacy/legal requirements.
- **Affiliate links:** `/affiliate-programs` is a curated list of official publisher sign-up destinations, not a claim that the site is approved by any program. `/resources` shows only URLs you configure in `.env.local`: `NEXT_PUBLIC_AFFILIATE_HOSTING_URL`, `NEXT_PUBLIC_AFFILIATE_PDF_URL`, `NEXT_PUBLIC_AFFILIATE_DEVELOPER_URL`, `NEXT_PUBLIC_AFFILIATE_STORE_URL`. Use only the real destination links generated by each approved affiliate program; do not paste a network homepage into these fields and expect tracking. Keep disclosures near links and review each program's terms.
- **Install dependencies:** run `npm install` after pulling the latest project, then `npm run build`.

## Operations and verification

- [Production readiness and hosting checklist](docs/production-readiness.md)
- [Environment variable reference](docs/environment-variables.md)
- [Affiliate application tracker](docs/affiliate-tracker.md)
- [Tool inventory and test status](docs/tool-inventory.md)
- [Dependency and upload security remediation](docs/security-remediation.md)
