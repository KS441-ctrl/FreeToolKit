import { spawn } from "node:child_process";

type ProcessOptions = {
  timeoutMs: number;
  maxStderrBytes: number;
};

type ProcessError = Error & {
  code?: string | number;
  stderr?: Buffer;
};

export function runProcessWithStdin(
  command: string,
  args: string[],
  input: string,
  options: ProcessOptions,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { windowsHide: true, stdio: ["pipe", "ignore", "pipe"] });
    const stderrChunks: Buffer[] = [];
    let stderrBytes = 0;
    let timedOut = false;
    let outputExceeded = false;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, options.timeoutMs);

    child.stderr.on("data", (chunk: Buffer | string) => {
      const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      if (stderrBytes + bytes.length > options.maxStderrBytes) {
        outputExceeded = true;
        child.kill("SIGKILL");
        return;
      }
      stderrChunks.push(bytes);
      stderrBytes += bytes.length;
    });

    child.stdin.on("error", () => undefined);
    child.once("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.once("close", (code, signal) => {
      clearTimeout(timer);
      const stderr = Buffer.concat(stderrChunks);
      if (timedOut || outputExceeded || code !== 0) {
        const error: ProcessError = new Error(
          timedOut ? "The process timed out." : outputExceeded ? "The process produced too much diagnostic output." : `The process exited with status ${code ?? signal ?? "unknown"}.`,
        );
        error.code = timedOut ? "ETIMEDOUT" : outputExceeded ? "ENOBUFS" : code ?? undefined;
        error.stderr = stderr;
        reject(error);
        return;
      }
      resolve();
    });

    child.stdin.end(input);
  });
}