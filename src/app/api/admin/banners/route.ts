// POST /api/admin/banners — add / update / delete
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
  const action: string = body?.action ?? "add";

  if (action === "add") {
    const title = String(body?.title ?? "").trim();
    const imageDesktop = String(body?.imageDesktop ?? "").trim();
    if (!title || !imageDesktop) return NextResponse.json({ status: "failed", message: "Judul dan gambar desktop wajib diisi." }, { status: 400 });
    try {
      const b = await db.banner.create({
        data: {
          title, subtitle: body?.subtitle ?? null,
          ctaText: body?.ctaText ?? null, ctaHref: body?.ctaHref ?? null,
          imageDesktop, imageMobile: body?.imageMobile ?? null,
          placement: body?.placement ?? "hero", overlay: body?.overlay ?? "dark-left",
          sortOrder: typeof body?.sortOrder === "number" ? body.sortOrder : 0,
          isActive: body?.isActive ?? true,
          startAt: body?.startAt ? new Date(body.startAt) : null,
          endAt: body?.endAt ? new Date(body.endAt) : null,
        },
      });
      bustCache();
      return NextResponse.json({ status: "ok", message: `Banner "${b.title}" ditambahkan.`, banner: b });
    } catch {
      return NextResponse.json({ status: "failed", message: "Gagal menambah banner." }, { status: 500 });
    }
  }

  if (action === "update") {
    const id = String(body?.id ?? "");
    if (!id) return NextResponse.json({ status: "failed", message: "ID wajib diisi." }, { status: 400 });
    try {
      const updateData: Record<string, unknown> = {};
      const fields = ["title", "subtitle", "ctaText", "ctaHref", "imageDesktop", "imageMobile", "placement", "overlay", "sortOrder", "isActive"];
      for (const f of fields) {
        if (body[f] !== undefined) updateData[f] = body[f] === "" ? null : body[f];
      }
      if (body?.startAt !== undefined) updateData.startAt = body.startAt ? new Date(body.startAt) : null;
      if (body?.endAt !== undefined) updateData.endAt = body.endAt ? new Date(body.endAt) : null;
      const b = await db.banner.update({ where: { id }, data: updateData });
      bustCache();
      return NextResponse.json({ status: "ok", message: `Banner "${b.title}" diperbarui.`, banner: b });
    } catch {
      return NextResponse.json({ status: "failed", message: "Gagal memperbarui banner." }, { status: 500 });
    }
  }

  if (action === "delete") {
    const id = String(body?.id ?? "");
    if (!id) return NextResponse.json({ status: "failed", message: "ID wajib diisi." }, { status: 400 });
    try {
      await db.banner.delete({ where: { id } });
      bustCache();
      return NextResponse.json({ status: "ok", message: "Banner dihapus." });
    } catch {
      return NextResponse.json({ status: "failed", message: "Gagal menghapus banner." }, { status: 500 });
    }
  }

  return NextResponse.json({ status: "failed", message: `Aksi "${action}" tidak dikenal.` }, { status: 400 });
}
