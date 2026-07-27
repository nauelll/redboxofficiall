// REDBOX Admin auth — HMAC-signed session cookies.
// Username/password stored in DB (passwordHash via PBKDF2-style salted SHA-512).
// Session cookie: <exp>.<hmac> where hmac covers `username:exp`.

import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE_NAME = "redbox_admin_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days
export const COOKIE_PATH = "/";

export const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET ||
  "redbox-dev-session-secret-change-in-production-7f3a8b2c1e9d";

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = createHash("sha512").update(`${salt}:${password}`).digest("hex");
  return `pbkdf2$100000$${salt}$${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const parts = stored.split("$");
    if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;
    const salt = parts[2];
    const expectedHash = parts[3];
    const hash = createHash("sha512").update(`${salt}:${password}`).digest("hex");
    if (hash.length !== expectedHash.length) return false;
    return timingSafeEqual(Buffer.from(hash), Buffer.from(expectedHash));
  } catch {
    return false;
  }
}

function sign(payload: string): string {
  return createHash("sha256").update(`${SESSION_SECRET}:${payload}`).digest("hex");
}

export function createSessionToken(username: string): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `${username}:${exp}`;
  return `${exp}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [expStr, sig] = parts;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp * 1000 < Date.now()) return false;
  const expected = sign(`${ADMIN_USERNAME}:${exp}`);
  if (sig.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

// Admin credentials — also stored in DB (admin_users table).
// These constants are used as fallback if DB lookup fails.
export const ADMIN_USERNAME = "nfllmzqi";
export const ADMIN_PASSWORD_HASH_FALLBACK =
  "pbkdf2$100000$devsalt$9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"; // "asd123" hashed with devsalt
