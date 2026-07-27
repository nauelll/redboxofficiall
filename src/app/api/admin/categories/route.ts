// POST /api/admin/categories — add / update / delete
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
    const name = String(body?.name ?? "").trim();
    const slug = String(body?.slug ?? "").trim();
    if (!name || !slug) return NextResponse.json({ status: "failed", message: "Nama dan slug wajib diisi." }, { status: 400 });
    try {
      const cat = await db.category.create({
        data: {
          name, slug,
          tagline: body?.tagline ?? null, description: body?.description ?? null,
          icon: body?.icon ?? null, image: body?.image ?? null,
          sortOrder: typeof body?.sortOrder === "number" ? body.sortOrder : 0,
          isActive: body?.isActive ?? true,
        },
      });
      // Add subcategories if provided
      if (Array.isArray(body?.subcategories)) {
        for (let i = 0; i < body.subcategories.length; i++) {
          const subName = String(body.subcategories[i]);
          const subSlug = subName.toLowerCase().replace(/\s+/g, "-");
          await db.subcategory.create({
            data: { slug: subSlug, name: subName, categoryId: cat.id, sortOrder: i, isActive: true },
          });
        }
      }
      bustCache();
      return NextResponse.json({ status: "ok", message: `Kategori "${cat.name}" ditambahkan.`, category: cat });
    } catch (err: any) {
      if (err?.code === "P2002") return NextResponse.json({ status: "failed", message: "Slug sudah digunakan." }, { status: 400 });
      return NextResponse.json({ status: "failed", message: "Gagal menambah kategori." }, { status: 500 });
    }
  }

  if (action === "update") {
    const id = String(body?.id ?? "");
    if (!id) return NextResponse.json({ status: "failed", message: "ID wajib diisi." }, { status: 400 });
    try {
      const updateData: Record<string, unknown> = {};
      if (typeof body?.name === "string") updateData.name = body.name.trim();
      if (typeof body?.tagline === "string") updateData.tagline = body.tagline || null;
      if (typeof body?.description === "string") updateData.description = body.description || null;
      if (typeof body?.image === "string") updateData.image = body.image || null;
      if (typeof body?.sortOrder === "number") updateData.sortOrder = body.sortOrder;
      if (typeof body?.isActive === "boolean") updateData.isActive = body.isActive;
      const cat = await db.category.update({ where: { id }, data: updateData });
      bustCache();
      return NextResponse.json({ status: "ok", message: `Kategori "${cat.name}" diperbarui.`, category: cat });
    } catch {
      return NextResponse.json({ status: "failed", message: "Gagal memperbarui kategori." }, { status: 500 });
    }
  }

  if (action === "delete") {
    const id = String(body?.id ?? "");
    if (!id) return NextResponse.json({ status: "failed", message: "ID wajib diisi." }, { status: 400 });
    try {
      await db.product.updateMany({ where: { categoryId: id }, data: { categoryId: null } });
      await db.category.delete({ where: { id } });
      bustCache();
      return NextResponse.json({ status: "ok", message: "Kategori dihapus." });
    } catch {
      return NextResponse.json({ status: "failed", message: "Gagal menghapus kategori." }, { status: 500 });
    }
  }

  return NextResponse.json({ status: "failed", message: `Aksi "${action}" tidak dikenal.` }, { status: 400 });
}
