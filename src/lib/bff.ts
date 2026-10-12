// ============================================================
// BFF Proxy Helper
// ============================================================
// Generic, project-wide proxy for the BFF pattern. Route handlers
// under src/app/api/ call this to forward a request to the external
// backend service, so header/auth/timeout/error/observability handling
// lives in one place instead of being duplicated per feature.
//
// Configure the backend base URL via BACKEND_URL, e.g.
//   BACKEND_URL="https://api.internal.example.com"
// Requests are proxied to `${BACKEND_URL}${path}`.
//
// Features:
//   - Request timeout via AbortSignal (504 on timeout)
//   - Selective request-header forwarding (auth, cookie, trace, locale)
//   - Raw body pass-through (handles JSON and non-JSON alike, incl. 204)
//   - Response-header allowlist (never copies hop-by-hop / content-encoding)
//   - Failures reported to Sentry
// ============================================================

import * as Sentry from '@sentry/nextjs';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL;
const DEFAULT_TIMEOUT_MS = 10_000;

// Default bearer token used ONLY for local testing. Set BACKEND_TEST_TOKEN
// in your .env so requests carry an Authorization header without wiring up
// real auth yet. Dev-only — never injected in production.
const TEST_TOKEN = process.env.BACKEND_TEST_TOKEN;

// Request headers forwarded to the backend by default.
const DEFAULT_FORWARD_HEADERS = ['authorization', 'cookie', 'accept-language', 'x-request-id'];

// Response headers passed back to the client. Allowlist only — never copy
// hop-by-hop or content-encoding headers: fetch already decoded the body,
// so forwarding `content-encoding` would corrupt the response.
const RESPONSE_HEADER_ALLOWLIST = [
  'content-type',
  'cache-control',
  'x-request-id',
  'x-total-count',
  'link'
];

export type ProxyOptions = {
  // Extra headers to inject (e.g. a service token). Override forwarded ones.
  headers?: Record<string, string>;
  // Abort the backend request after this many ms (default 10s).
  timeoutMs?: number;
  // Which incoming request headers to forward (default: DEFAULT_FORWARD_HEADERS).
  forwardHeaders?: string[];
};

export async function proxyToBackend(
  request: NextRequest,
  path: string,
  options: ProxyOptions = {}
): Promise<NextResponse> {
  if (!BACKEND_URL) {
    return NextResponse.json(
      {
        success: false,
        message: 'BACKEND_URL is not configured. Set it in your environment to proxy requests.'
      },
      { status: 500 }
    );
  }

  const {
    headers: extraHeaders,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    forwardHeaders = DEFAULT_FORWARD_HEADERS
  } = options;

  const headers = new Headers();
  for (const name of forwardHeaders) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  const method = request.method;
  const hasBody = method !== 'GET' && method !== 'HEAD';
  if (hasBody && !headers.has('content-type')) {
    headers.set('content-type', request.headers.get('content-type') ?? 'application/json');
  }

  if (extraHeaders) {
    for (const [key, value] of Object.entries(extraHeaders)) {
      headers.set(key, value);
    }
  }

  // Fallback test token (dev only) — used only when no auth was provided
  // by the incoming request or options.headers.
  if (TEST_TOKEN && process.env.NODE_ENV !== 'production' && !headers.has('authorization')) {
    headers.set('authorization', `Bearer ${TEST_TOKEN}`);
  }

  const init: RequestInit = { method, headers };
  if (hasBody) {
    // Forward the raw body bytes as-is. Using arrayBuffer (not text) keeps
    // binary payloads intact — e.g. multipart/form-data file uploads — while
    // still working for JSON. The incoming content-type (with any multipart
    // boundary) is preserved above.
    init.body = await request.arrayBuffer();
  }

  const url = `${BACKEND_URL}${path}`;

  try {
    const res = await fetch(url, {
      ...init,
      signal: AbortSignal.timeout(timeoutMs)
    });

    const responseHeaders = new Headers();
    for (const name of RESPONSE_HEADER_ALLOWLIST) {
      const value = res.headers.get(name);
      if (value) responseHeaders.set(name, value);
    }

    // No-content responses carry no body.
    if (res.status === 204 || res.status === 205) {
      return new NextResponse(null, {
        status: res.status,
        headers: responseHeaders
      });
    }

    // Pass the raw body through with the backend's status and content-type.
    // This preserves non-JSON payloads and the real upstream status code.
    const body = await res.text();
    return new NextResponse(body || null, {
      status: res.status,
      headers: responseHeaders
    });
  } catch (error) {
    const isTimeout = error instanceof Error && error.name === 'TimeoutError';

    Sentry.captureException(error, {
      tags: { scope: 'bff-proxy', timeout: String(isTimeout) },
      extra: { url, method }
    });

    return NextResponse.json(
      {
        success: false,
        message: isTimeout ? 'Backend request timed out.' : 'Failed to reach the backend service.'
      },
      { status: isTimeout ? 504 : 502 }
    );
  }
}
