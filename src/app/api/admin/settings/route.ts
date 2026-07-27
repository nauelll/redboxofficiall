// POST /api/admin/settings — save key-value settings
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bustCache } from "@/lib/catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: any;
  try { body = await req.json(); } catch {
    return NextResponse.json({ status: "failed", message: "Format request tidak valid." }, { status: 400 });
  }
  const settings: Record<string, string> = body?.settings ?? {};
  if (Object.keys(settings).length === 0) {
    return NextResponse.json({ status: "failed", message: "Tidak ada setting untuk disimpan." }, { status: 400 });
  }
  try {
    await Promise.all(
      Object.entries(settings).map(([key, value]) =>
        db.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } }),
      ),
    );
    bustCache();
    return NextResponse.json({ status: "ok", message: "Pengaturan berhasil disimpan." });
  } catch (err) {
    return NextResponse.json({ status: "failed", message: "Gagal menyimpan pengaturan." }, { status: 500 });
  }
}
