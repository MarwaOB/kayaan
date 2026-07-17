// Pure signing/verification logic for the admin session cookie — deliberately
// has NO import of Prisma or anything DB-backed, so it can run in
// middleware.ts on the Edge runtime (which can't load the Prisma engine).
// The DB-backed lookup (does this user still exist?) stays in adminSession.ts
// and only runs for actual API calls, not for the page-level gate.
//
// Uses Web Crypto (crypto.subtle) instead of Node's `crypto` module because
// the Edge runtime does not support Node built-ins.

export const SESSION_COOKIE = "kayaaan_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days, in seconds

const encoder = new TextEncoder();

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (secret && secret.length >= 16) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "ADMIN_SESSION_SECRET is missing or too short. Set a long random value in .env before running in production."
    );
  }
  console.warn(
    "[adminSessionToken] ADMIN_SESSION_SECRET not set — using an insecure dev-only fallback. Set it in .env."
  );
  return "dev-only-insecure-fallback-secret-do-not-use-in-prod";
}

async function getKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(payload: string): Promise<string> {
  const key = await getKey();
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return toHex(sig);
}

// Constant-time string comparison — replaces Node's timingSafeEqual, which
// isn't available on the Edge runtime.
function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function buildSessionToken(userId: string): Promise<string> {
  const expiresAt = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = `${userId}.${expiresAt}`;
  return `${payload}.${await sign(payload)}`;
}

export async function verifySessionToken(token: string): Promise<{ userId: string } | null> {
  const match = /^(.+)\.(\d+)\.([a-f0-9]{64})$/.exec(token);
  if (!match) return null;
  const [, userId, expiresAtStr, signature] = match;
  const payload = `${userId}.${expiresAtStr}`;
  const expected = await sign(payload);

  if (!timingSafeEqualHex(signature, expected)) {
    return null;
  }

  if (Number(expiresAtStr) < Date.now()) return null; // expired server-side, not just cookie-side

  return { userId };
}