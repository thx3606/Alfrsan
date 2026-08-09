// Client-side fetch wrapper that echoes the CSRF cookie into the header
// proxy.ts checks on every mutating /api request. See
// src/modules/security/csrf.ts for the server-side half.

const CSRF_COOKIE_NAME = "khibra_csrf";
const CSRF_HEADER_NAME = "x-khibra-csrf";

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

export async function apiFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const method = (init.method ?? "GET").toUpperCase();
  const headers = new Headers(init.headers);

  if (method !== "GET" && method !== "HEAD") {
    const csrfToken = readCookie(CSRF_COOKIE_NAME);
    if (csrfToken) headers.set(CSRF_HEADER_NAME, csrfToken);
    if (!headers.has("Content-Type") && init.body) {
      headers.set("Content-Type", "application/json");
    }
  }

  return fetch(input, { ...init, headers, credentials: "same-origin" });
}
