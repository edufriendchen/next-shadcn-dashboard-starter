const BASE_URL = '/api';

// In the browser a relative URL is enough: cookies ride along automatically.
// During SSR/RSC, Node's fetch needs an absolute URL and the BFF routes
// authenticate from the incoming request cookie, so build both from the
// current request. Importing `next/headers` dynamically keeps it out of the
// client execution path (the branch is never taken in the browser).
async function resolveServerBaseUrl(): Promise<{ url: string; cookie?: string } | null> {
  const { headers } = await import('next/headers');
  const requestHeaders = await headers();
  const host = requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host');
  if (!host) return null;

  const proto =
    requestHeaders.get('x-forwarded-proto') ??
    (host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https');

  return {
    url: `${proto}://${host}${BASE_URL}`,
    cookie: requestHeaders.get('cookie') ?? undefined
  };
}

export async function apiClient<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const headers = new Headers(options?.headers);
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

  let baseUrl = BASE_URL;
  if (typeof window === 'undefined') {
    try {
      const context = await resolveServerBaseUrl();
      if (context) {
        baseUrl = context.url;
        if (context.cookie) headers.set('cookie', context.cookie);
      }
    } catch {
      // `headers()` is unavailable outside a request scope (e.g. build-time
      // prerendering) — keep the relative URL.
    }
  }

  const res = await fetch(`${baseUrl}${endpoint}`, { ...options, headers });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}
