import { NextRequest, NextResponse } from "next/server";
import { mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { acquirePdfRequestSlot, InvalidMultipartRequestError, readMultipartFormData, RequestBodyTimedOutError, RequestBodyTooLargeError } from "../_lib/pdf-request";
import { runProcessWithStdin } from "../_lib/run-process";

export const runtime = "nodejs";
const MAX_BYTES = 50 * 1024 * 1024;
const MAX_UPLOAD_BYTES = MAX_BYTES + 1024 * 1024;
const MAX_OUTPUT_BYTES = MAX_BYTES * 2;

export async function POST(request: NextRequest) {
  const releaseSlot = acquirePdfRequestSlot();
  if (!releaseSlot) return NextResponse.json({ error: "PDF processing is busy. Try again shortly." }, { status: 429, headers: { "Retry-After": "2", "Cache-Control": "no-store" } });
  let directory = "";
  try {
    const form = await readMultipartFormData(request, MAX_UPLOAD_BYTES);
    const file = form.get("file");
    const action = String(form.get("action") || "");
    const password = String(form.get("password") || "");
    const ownerPassword = String(form.get("ownerPassword") || "");
    if (!(file instanceof File)) return NextResponse.json({ error: "Choose a PDF file." }, { status: 400 });
    if (!file.name.toLowerCase().endsWith(".pdf")) return NextResponse.json({ error: "Only PDF files are supported." }, { status: 400 });
    if (file.size === 0 || file.size > MAX_BYTES) return NextResponse.json({ error: "PDF must be between 1 byte and 50 MB." }, { status: 413 });
    if (action !== "encrypt" && action !== "decrypt") return NextResponse.json({ error: "Unknown security operation." }, { status: 400 });
    if (password.length < 1) return NextResponse.json({ error: "Enter a password." }, { status: 400 });
    if (action === "encrypt" && ownerPassword.length < 8) return NextResponse.json({ error: "For encryption, choose an owner password of at least 8 characters." }, { status: 400 });
    if ([password, ownerPassword].some((value) => value.length > 1024 || /[\u0000\r\n]/.test(value))) return NextResponse.json({ error: "Passwords must be at most 1024 characters and cannot contain line breaks." }, { status: 400 });
    const fileBytes = Buffer.from(await file.arrayBuffer());
    if (!fileBytes.subarray(0, 1024).toString("latin1").includes("%PDF-")) return NextResponse.json({ error: "The selected file does not contain a PDF header." }, { status: 400 });
    directory = await mkdtemp(path.join(tmpdir(), "everytool-pdf-"));
    const input = path.join(directory, `${randomUUID()}.pdf`);
    const output = path.join(directory, `${randomUUID()}.pdf`);
    await writeFile(input, fileBytes);
    try {
      const args = action === "encrypt"
        ? ["--encrypt", password, ownerPassword, "256", "--", input, output]
        : [`--password=${password}`, "--decrypt", input, output];
      await runProcessWithStdin("qpdf", ["@-"], `${args.join("\n")}\n`, { timeoutMs: 60000, maxStderrBytes: 1024 * 1024 });
    } catch (error) {
      const err = error as NodeJS.ErrnoException & { stderr?: Buffer | string };
      if (err.code === "ENOENT") return NextResponse.json({ error: "PDF security is not enabled on this deployment yet. Install qpdf on the server and redeploy. No file was changed." }, { status: 503 });
      if (err.code === "ETIMEDOUT") return NextResponse.json({ error: "PDF processing timed out. Try a smaller or simpler PDF." }, { status: 422 });
      if (err.code === "ENOBUFS") return NextResponse.json({ error: "PDF processing produced too much diagnostic output." }, { status: 422 });
      return NextResponse.json({ error: action === "decrypt" ? "Could not unlock this PDF. Check the password and make sure you are authorized to modify the file." : "Could not encrypt this PDF. Check that the file is a valid, supported PDF." }, { status: 422 });
    }
    if ((await stat(output)).size > MAX_OUTPUT_BYTES) return NextResponse.json({ error: "The processed PDF is too large to return safely." }, { status: 413 });
    const bytes = await readFile(output);
    return new NextResponse(new Uint8Array(bytes), { status: 200, headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="${action === "encrypt" ? "protected.pdf" : "unlocked.pdf"}"`, "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) return NextResponse.json({ error: "Request is too large. PDF files must be 50 MB or smaller." }, { status: 413 });
    if (error instanceof RequestBodyTimedOutError) return NextResponse.json({ error: "The upload took too long. Try again on a stable connection." }, { status: 408 });
    if (error instanceof InvalidMultipartRequestError) return NextResponse.json({ error: "The upload request is malformed." }, { status: 400 });
    return NextResponse.json({ error: "The PDF could not be processed. Try a smaller or valid PDF." }, { status: 500 });
  } finally {
    if (directory) await rm(directory, { recursive: true, force: true }).catch(() => undefined);
    releaseSlot();
  }
}
