// POST /api/products — add / update / delete / duplicate / update_status
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bustCache } from "@/lib/catalog";
import type { Badge } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: any;
  try { body = await req.json(); } catch {
    return NextResponse.json({ status: "failed", message: "Format request tidak valid." }, { status: 400 });
  }
  const action: string = body?.action ?? "add";

  // --- ADD ---
  if (action === "add") {
    const name = String(body?.name ?? "").trim();
    if (!name) return NextResponse.json({ status: "failed", message: "Nama produk wajib diisi." }, { status: 400 });
    let slug = String(body?.slug ?? "").trim() || generateSlug(name);
    slug = await ensureUniqueSlug(slug);

    try {
      const p = await db.product.create({
        data: {
          slug, name, sku: body?.sku || null,
          description: body?.description ?? "", detailInfo: body?.detailInfo ?? null,
          careInfo: body?.careInfo ?? null, material: body?.material ?? null,
          categoryId: body?.categoryId || null, subcategoryId: body?.subcategoryId || null,
          price: body?.price ?? null, weightGram: body?.weightGram ?? null,
          images: JSON.stringify(body?.images ?? []),
          video: body?.video ?? null,
          sizes: JSON.stringify(body?.sizes ?? []),
          colors: JSON.stringify(body?.colors ?? []),
          badge: (body?.badge as Badge | undefined) || null,
          shopeeUrl: body?.shopeeUrl ?? null, tiktokUrl: body?.tiktokUrl ?? null,
          lazadaUrl: body?.lazadaUrl ?? null,
          whatsappUrl: body?.whatsappUrl ?? `https://wa.me/6281324898585?text=Hi%20REDBOX%2C%20saya%20tertarik%20dengan%20${encodeURIComponent(name)}`,
          status: body?.status ?? "published",
        },
      });
      bustCache();
      return NextResponse.json({ status: "ok", message: `Produk "${p.name}" ditambahkan.`, product: p });
    } catch (err) {
      return NextResponse.json({ status: "failed", message: "Gagal menambah produk.", error: String(err) }, { status: 500 });
    }
  }

  // --- UPDATE ---
  if (action === "update") {
    const id = String(body?.id ?? "");
    if (!id) return NextResponse.json({ status: "failed", message: "ID wajib diisi." }, { status: 400 });
    try {
      const updateData: Record<string, unknown> = {};
      const fields = ["name", "description", "detailInfo", "careInfo", "material", "categoryId", "subcategoryId",
        "price", "weightGram", "video", "badge", "shopeeUrl", "tiktokUrl", "lazadaUrl", "whatsappUrl", "status", "sku"];
      for (const f of fields) {
        if (body[f] !== undefined) updateData[f] = body[f] === "" ? null : body[f];
      }
      if (Array.isArray(body?.images)) updateData.images = JSON.stringify(body.images);
      if (Array.isArray(body?.sizes)) updateData.sizes = JSON.stringify(body.sizes);
      if (Array.isArray(body?.colors)) updateData.colors = JSON.stringify(body.colors);

      const p = await db.product.update({ where: { id }, data: updateData });
      bustCache();
      return NextResponse.json({ status: "ok", message: `Produk "${p.name}" diperbarui.`, product: p });
    } catch (err) {
      return NextResponse.json({ status: "failed", message: "Gagal memperbarui produk.", error: String(err) }, { status: 500 });
    }
  }

  // --- DUPLICATE ---
  if (action === "duplicate") {
    const id = String(body?.id ?? "");
    if (!id) return NextResponse.json({ status: "failed", message: "ID wajib diisi." }, { status: 400 });
    try {
      const orig = await db.product.findUnique({ where: { id } });
      if (!orig) return NextResponse.json({ status: "failed", message: "Produk tidak ditemukan." }, { status: 404 });
      const newName = `${orig.name} (Salinan)`;
      const slug = await ensureUniqueSlug(generateSlug(newName));
      const p = await db.product.create({
        data: {
          slug, name: newName, sku: null,
          description: orig.description, detailInfo: orig.detailInfo, careInfo: orig.careInfo,
          material: orig.material, categoryId: orig.categoryId, subcategoryId: orig.subcategoryId,
          price: orig.price, weightGram: orig.weightGram,
          images: orig.images, video: orig.video, sizes: orig.sizes, colors: orig.colors,
          badge: orig.badge, shopeeUrl: orig.shopeeUrl, tiktokUrl: orig.tiktokUrl,
          lazadaUrl: orig.lazadaUrl, whatsappUrl: orig.whatsappUrl,
          status: "draft", popularity: 70, rating: 5, reviewCount: 0,
        },
      });
      bustCache();
      return NextResponse.json({ status: "ok", message: `Produk diduplikasi: "${newName}".`, product: p });
    } catch (err) {
      return NextResponse.json({ status: "failed", message: "Gagal menduplikasi.", error: String(err) }, { status: 500 });
    }
  }

  // --- UPDATE STATUS ---
  if (action === "update_status") {
    const id = String(body?.id ?? "");
    const status = String(body?.status ?? "");
    if (!id || !["published", "draft", "archived"].includes(status)) {
      return NextResponse.json({ status: "failed", message: "ID dan status valid wajib diisi." }, { status: 400 });
    }
    try {
      const p = await db.product.update({ where: { id }, data: { status } });
      bustCache();
      return NextResponse.json({ status: "ok", message: `Status diubah ke ${status}.`, product: p });
    } catch {
      return NextResponse.json({ status: "failed", message: "Gagal mengubah status." }, { status: 500 });
    }
  }

  // --- DELETE ---
  if (action === "delete") {
    const id = String(body?.id ?? "");
    if (!id) return NextResponse.json({ status: "failed", message: "ID wajib diisi." }, { status: 400 });
    try {
      await db.product.delete({ where: { id } });
      bustCache();
      return NextResponse.json({ status: "ok", message: "Produk dihapus." });
    } catch {
      return NextResponse.json({ status: "failed", message: "Gagal menghapus." }, { status: 500 });
    }
  }

  return NextResponse.json({ status: "failed", message: `Aksi "${action}" tidak dikenal.` }, { status: 400 });
}

function generateSlug(name: string): string {
  return name.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 60) || `product-${Date.now()}`;
}

async function ensureUniqueSlug(base: string): Promise<string> {
  let candidate = base;
  let n = 2;
  while (await db.product.findUnique({ where: { slug: candidate } })) {
    candidate = `${base}-${n}`; n++;
  }
  return candidate;
}
