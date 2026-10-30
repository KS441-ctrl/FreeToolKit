# Tool inventory

Validation below is from source inspection plus the production build and TypeScript check. No full end-to-end file-processing suite or manual browser QA has been run; each tool is therefore **build-verified, behavior not independently tested**.

| Tool | Route | Processing and expected output | Input checks / dependencies | Status and known limits |
| --- | --- | --- | --- | --- |
| PDF Studio | `/tools/pdf-editor` | Browser PDF merge, split/extract, rotate, delete/reorder, annotations, images, page numbers, watermarks, images/text export, rasterization | PDF.js, pdf-lib; file/page checks in UI | Build-verified; no full file test. Overlay is not direct text editing. Whiteout is not secure redaction. Rasterized redaction/compression loses text/searchability and may enlarge files. |
| PDF compression | `/tools/pdf-compress` | Links to PDF Studio's rasterizing compression | Browser PDF.js/pdf-lib through PDF Studio | Build-verified; rasterization is lossy and may increase size. |
| PDF conversion | `/tools/pdf-convert` | Browser extraction to TXT, DOCX paragraphs, or XLSX text rows; PNG/JPG page export | PDF.js, docx, xlsx; 40 MB page limit per README | Build-verified; does not preserve layout, tables, images, formulas, or columns reliably. Scans need OCR. |
| OCR for scanned PDFs | `/tools/pdf-ocr` | Browser PDF.js rendering + Tesseract.js; TXT, DOCX, XLSX output | PDF.js, Tesseract.js; 30 MB, 20 pages/run; language data may download | Build-verified; OCR accuracy varies with image quality and language. Browser CPU/memory may be high. |
| Image to PDF | `/tools/image-to-pdf` | Browser image embedding into PDF | pdf-lib; JPG/PNG file input | Build-verified; end-to-end image tests not run. |
| Replace PDF text | `/tools/pdf-replace-text` | Server PyMuPDF rectangular redaction and replacement text | Node API, Python 3, PyMuPDF; 25 MB file cap, bounded multipart request and 120-second upload limit; PDF signature checked; process-global single-job cap; temp cleanup | Build-verified; helper parser/slot behavior directly tested. Requires runtime dependencies and authorization. Rectangle may remove overlapping graphics. Real API/PDF integration not tested. Replacement text is sent to Python over stdin, not argv. |
| Protect / unlock PDF | `/tools/pdf-security` | Server qpdf AES-256 encryption/decryption | Node API, qpdf; 50 MB file cap, bounded multipart request and 120-second upload limit; PDF signature checked; process-global single-job cap; temp cleanup | Build-verified; helper parser/slot behavior directly tested. Requires qpdf; decrypt only files the user is authorized to modify. qpdf passwords use documented stdin argument-file mode rather than process arguments. Real qpdf/PDF integration not tested. |
| Word counter | `/tools/word-counter` | Browser counts words, characters, sentences, reading time | Text input | Build-verified, behavior not independently tested. |
| Case converter | `/tools/case-converter` | Browser upper/lower/title/sentence case conversions | Text input | Build-verified, behavior not independently tested. |
| Duplicate lines | `/tools/duplicate-lines` | Browser deduplication preserving order | Text input | Build-verified, behavior not independently tested. |
| Text comparison | `/tools/text-comparison` | Browser line-by-line comparison | Two text inputs | Build-verified, behavior not independently tested. |
| Text formatter | `/tools/text-formatter` | Browser whitespace and line-break cleanup | Text input | Build-verified, behavior not independently tested. |
| JSON formatter | `/tools/json-formatter` | Browser JSON formatting, validation, minification | JSON text | Build-verified, behavior not independently tested. |
| URL encoder | `/tools/url-encoder` | Browser URL component encode/decode | Text input | Build-verified, behavior not independently tested. |
| Base64 | `/tools/base64` | Browser text Base64 encode/decode | Text input | Build-verified, behavior not independently tested. |
| Timestamp converter | `/tools/timestamp-converter` | Browser Unix timestamp/date conversion | Numeric/date input | Build-verified, behavior not independently tested. |
| Regex tester | `/tools/regex-tester` | Browser JavaScript regular-expression testing | Pattern and test text | Build-verified, behavior not independently tested. |
| Percentage calculator | `/tools/percentage-calculator` | Browser percentage calculations | Numeric inputs | Build-verified, behavior not independently tested. |
| Age calculator | `/tools/age-calculator` | Browser age calculation | Date input | Build-verified, behavior not independently tested. |
| Date difference | `/tools/date-difference` | Browser date interval calculation | Two dates | Build-verified, behavior not independently tested. |
| Loan EMI calculator | `/tools/loan-emi-calculator` | Browser fixed-payment loan estimate | Principal, rate, term | Build-verified; estimate only, not financial advice. |
| Unit converter | `/tools/unit-converter` | Browser length, weight, temperature conversion | Numeric value and unit selection | Build-verified, behavior not independently tested. |
| CGPA calculator | `/tools/cgpa-calculator` | Browser semester CGPA average | Numeric semester values | Build-verified; assumes a simple average unless weighted inputs are explicitly supported. |
| Study timetable | `/tools/study-timetable` | Browser study-time schedule allocation | Subjects and available time | Build-verified; generated plan is a simple allocation, not an adaptive planner. |
| Mathematics tools | `/tools/mathematics-tools` | Browser square, cube, square root, and absolute value calculations | Numeric input | Build-verified, behavior not independently tested. |
| Exam countdown | `/tools/exam-countdown` | Browser days-until calculation | Exam date | Build-verified; UI recalculation is user-driven rather than a live timer. |

## Automated and manual test gap

Automated unit tests are not configured in `package.json`. Current checks are `npm run lint` (TypeScript), `npm run build` (production compilation/prerender), and a direct helper smoke check of valid multipart parsing, declared over-limit rejection, content-type rejection, and shared-slot release. The API routes themselves and actual PDF/qpdf/PyMuPDF file processing have not been integration-tested. Validate normal, malformed, encrypted, and near-limit files in a browser and on the chosen production runtime before launch.
