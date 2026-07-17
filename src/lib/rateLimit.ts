/**
 * Minimal in-memory sliding-window rate limiter for public write endpoints
 * that have no other spam protection (review submissions, newsletter
 * signup). This is in-memory only, fine for local dev / a single instance,
 * but won't survive a restart or work across multiple server instances —
 * replace with a Redis/DB-backed limiter before relying on it in production
 * (Phase 5).
 */

const requestLog = new Map<string, number[]>();

export function isRateLimited(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(key) ?? []).filter((t) => now - t < windowMs);

  if (timestamps.length >= maxRequests) {
    requestLog.set(key, timestamps);
    return true;
  }

  timestamps.push(now);
  requestLog.set(key, timestamps);
  return false;
}

/** Best-effort client IP from standard proxy headers; falls back to a constant bucket if unavailable. */
export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
