export class RequestBodyTooLargeError extends Error {}
export class RequestBodyTimedOutError extends Error {}
export class InvalidMultipartRequestError extends Error {}

const MAX_ACTIVE_PDF_REQUESTS = 1;
const MAX_UPLOAD_DURATION_MS = 120000;
const pdfRequestState = globalThis as typeof globalThis & { __freeToolkitActivePdfRequests?: number };

export function acquirePdfRequestSlot(): (() => void) | null {
  const activePdfRequests = pdfRequestState.__freeToolkitActivePdfRequests ?? 0;
  if (activePdfRequests >= MAX_ACTIVE_PDF_REQUESTS) return null;
  pdfRequestState.__freeToolkitActivePdfRequests = activePdfRequests + 1;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    pdfRequestState.__freeToolkitActivePdfRequests = Math.max(0, (pdfRequestState.__freeToolkitActivePdfRequests ?? 1) - 1);
  };
}

export async function readMultipartFormData(request: Request, maxBytes: number): Promise<FormData> {
  const contentType = request.headers.get("content-type");
  if (!contentType?.toLowerCase().startsWith("multipart/form-data;")) {
    throw new InvalidMultipartRequestError();
  }

  const contentLength = request.headers.get("content-length");
  if (contentLength !== null) {
    if (!/^\d+$/.test(contentLength)) throw new InvalidMultipartRequestError();
    const declaredBytes = Number(contentLength);
    if (!Number.isSafeInteger(declaredBytes)) throw new InvalidMultipartRequestError();
    if (declaredBytes > maxBytes) throw new RequestBodyTooLargeError();
  }

  const reader = request.body?.getReader();
  if (!reader) throw new InvalidMultipartRequestError();

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  const deadline = Date.now() + MAX_UPLOAD_DURATION_MS;
  try {
    while (true) {
      const remainingMs = deadline - Date.now();
      if (remainingMs <= 0) throw new RequestBodyTimedOutError();
      let timeout: ReturnType<typeof setTimeout> | undefined;
      let result: ReadableStreamReadResult<Uint8Array>;
      try {
        result = await Promise.race([
          reader.read(),
          new Promise<never>((_, reject) => {
            timeout = setTimeout(() => reject(new RequestBodyTimedOutError()), remainingMs);
          }),
        ]);
      } catch (error) {
        if (error instanceof RequestBodyTimedOutError) await reader.cancel().catch(() => undefined);
        throw error;
      } finally {
        if (timeout) clearTimeout(timeout);
      }
      const { done, value } = result;
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel();
        throw new RequestBodyTooLargeError();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  try {
    const blobParts: BlobPart[] = chunks.map((chunk) => new Uint8Array(chunk));
    return await new Response(new Blob(blobParts), { headers: { "Content-Type": contentType } }).formData();
  } catch {
    throw new InvalidMultipartRequestError();
  }
}