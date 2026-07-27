// POST /api/admin/logout
import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, COOKIE_PATH } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const res = NextResponse.json({ status: "ok", message: "Berhasil logout." });
  res.cookies.set({
    name: ADMIN_COOKIE_NAME, value: "",
    httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "lax", path: COOKIE_PATH, maxAge: 0,
  });
  return res;
}
