const DEFAULT_TIMEOUT_MS = 5000;

export class FetchTimeoutError extends Error {
  constructor(message = "Request timed out") {
    super(message);
    this.name = "FetchTimeoutError";
  }
}

function logFetchTiming(label: string, url: string, startedAt: number) {
  if (process.env.NODE_ENV !== "development") return;
  const ms = Math.round(performance.now() - startedAt);
  console.info(`[fetch] ${label} ${ms}ms ${url}`);
}

export async function fetchJson<T>(
  url: string,
  init: RequestInit & {
    timeoutMs?: number;
    label?: string;
    next?: { revalidate?: number | false; tags?: string[] };
  } = {}
): Promise<T> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, label = "GET", next, ...fetchInit } = init;
  const startedAt = performance.now();

  let res: Response;
  try {
    res = await fetch(url, {
      ...fetchInit,
      ...(next ? { next } : {}),
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      throw new FetchTimeoutError(`Gateway unreachable: ${label}`);
    }
    throw err;
  }

  logFetchTiming(label, url, startedAt);

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export async function fetchResponse(
  url: string,
  init: RequestInit & { timeoutMs?: number; label?: string } = {}
): Promise<Response> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, label = "GET", ...fetchInit } = init;
  const startedAt = performance.now();

  let res: Response;
  try {
    res = await fetch(url, {
      ...fetchInit,
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      throw new FetchTimeoutError(`Gateway unreachable: ${label}`);
    }
    throw err;
  }

  logFetchTiming(label, url, startedAt);
  return res;
}
