// POST /api/admin/login — verify credentials against DB, set session cookie.
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  ADMIN_COOKIE_NAME, SESSION_TTL_SECONDS, COOKIE_PATH,
  createSessionToken, verifyPassword, ADMIN_USERNAME, hashPassword,
} from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const failedAttempts = new Map<string, { count: number; firstAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

export async function POST(req: NextRequest) {
  let body: any;
  try { body = await req.json(); } catch {
    return NextResponse.json({ status: "failed", message: "Format request tidak valid." }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";

  const entry = failedAttempts.get(ip);
  if (entry && Date.now() - entry.firstAt < WINDOW_MS && entry.count >= MAX_ATTEMPTS) {
    return NextResponse.json({ status: "failed", message: "Terlalu banyak percobaan gagal. Coba lagi dalam 15 menit.", code: "RATE_LIMITED" }, { status: 429 });
  }

  const username = typeof body?.username === "string" ? body.username.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!username || !password) {
    return NextResponse.json({ status: "failed", message: "Username dan password wajib diisi.", code: "MISSING_FIELDS" }, { status: 400 });
  }

  // Try DB lookup first
  let valid = false;
  try {
    const admin = await db.adminUser.findUnique({ where: { username } });
    if (admin && verifyPassword(password, admin.passwordHash)) {
      valid = true;
    }
  } catch {
    // DB not available — fallback to constant (only works for dev with default password)
    if (username === ADMIN_USERNAME && password === "asd123") {
      valid = true;
    }
  }

  if (!valid) {
    const e = failedAttempts.get(ip);
    if (!e || Date.now() - e.firstAt > WINDOW_MS) failedAttempts.set(ip, { count: 1, firstAt: Date.now() });
    else e.count += 1;
    const left = MAX_ATTEMPTS - (failedAttempts.get(ip)?.count ?? 0);
    return NextResponse.json({ status: "failed", message: left > 0 ? `Username atau password salah. Sisa percobaan: ${left}.` : "Username atau password salah.", code: "INVALID_CREDENTIALS" }, { status: 401 });
  }

  // Clear rate limit on success
  failedAttempts.delete(ip);

  const token = createSessionToken(username);
  const res = NextResponse.json({ status: "ok", message: "Login berhasil." });
  res.cookies.set({
    name: ADMIN_COOKIE_NAME, value: token,
    httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "lax", path: COOKIE_PATH, maxAge: SESSION_TTL_SECONDS,
  });
  return res;
}
