// POST /api/admin/blog — add / update / delete
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
    if (!title) return NextResponse.json({ status: "failed", message: "Judul wajib diisi." }, { status: 400 });
    let slug = String(body?.slug ?? "").trim() || generateSlug(title);
    slug = await ensureUniqueSlug(slug);
    try {
      const p = await db.blogPost.create({
        data: {
          slug, title,
          excerpt: body?.excerpt ?? null, content: body?.content ?? "",
          coverImage: body?.coverImage ?? null, category: body?.category ?? "Tips Fashion",
          tags: JSON.stringify(body?.tags ?? []), author: "REDBOX Team",
          status: body?.status ?? "published", featured: body?.featured ?? false,
          publishedAt: new Date(),
        },
      });
      bustCache();
      return NextResponse.json({ status: "ok", message: `Artikel "${p.title}" ditambahkan.`, post: p });
    } catch (err) {
      return NextResponse.json({ status: "failed", message: "Gagal menambah artikel.", error: String(err) }, { status: 500 });
    }
  }

  if (action === "update") {
    const id = String(body?.id ?? "");
    if (!id) return NextResponse.json({ status: "failed", message: "ID wajib diisi." }, { status: 400 });
    try {
      const updateData: Record<string, unknown> = {};
      if (typeof body?.title === "string") updateData.title = body.title.trim();
      if (typeof body?.excerpt === "string") updateData.excerpt = body.excerpt || null;
      if (typeof body?.content === "string") updateData.content = body.content;
      if (typeof body?.coverImage === "string") updateData.coverImage = body.coverImage || null;
      if (typeof body?.category === "string") updateData.category = body.category;
      if (Array.isArray(body?.tags)) updateData.tags = JSON.stringify(body.tags);
      if (typeof body?.status === "string") updateData.status = body.status;
      if (typeof body?.featured === "boolean") updateData.featured = body.featured;
      const p = await db.blogPost.update({ where: { id }, data: updateData });
      bustCache();
      return NextResponse.json({ status: "ok", message: `Artikel "${p.title}" diperbarui.`, post: p });
    } catch {
      return NextResponse.json({ status: "failed", message: "Gagal memperbarui artikel." }, { status: 500 });
    }
  }

  if (action === "delete") {
    const id = String(body?.id ?? "");
    if (!id) return NextResponse.json({ status: "failed", message: "ID wajib diisi." }, { status: 400 });
    try {
      await db.blogPost.delete({ where: { id } });
      bustCache();
      return NextResponse.json({ status: "ok", message: "Artikel dihapus." });
    } catch {
      return NextResponse.json({ status: "failed", message: "Gagal menghapus artikel." }, { status: 500 });
    }
  }

  return NextResponse.json({ status: "failed", message: `Aksi "${action}" tidak dikenal.` }, { status: 400 });
}

function generateSlug(name: string): string {
  return name.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 60) || `post-${Date.now()}`;
}
async function ensureUniqueSlug(base: string): Promise<string> {
  let candidate = base;
  let n = 2;
  while (await db.blogPost.findUnique({ where: { slug: candidate } })) { candidate = `${base}-${n}`; n++; }
  return candidate;
}
