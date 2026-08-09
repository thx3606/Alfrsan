// Security headers applied to every response via proxy.ts.
// See SECURITY.md and brief §128.

export function securityHeaders(): Record<string, string> {
  return {
    // No inline scripts without a nonce; no third-party script hosts by
    // default (add explicit hosts here if a vetted third party is ever
    // required — never widen with 'unsafe-inline'/'unsafe-eval').
    "Content-Security-Policy": [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'", // Tailwind-generated styles; no remote style hosts
      "img-src 'self' data: blob:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy":
      "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
    "X-Frame-Options": "DENY",
  };
}
