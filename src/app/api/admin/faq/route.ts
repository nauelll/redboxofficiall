// POST /api/admin/faq — add / update / delete
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
    const question = String(body?.question ?? "").trim();
    const answer = String(body?.answer ?? "").trim();
    if (!question || !answer) return NextResponse.json({ status: "failed", message: "Pertanyaan dan jawaban wajib diisi." }, { status: 400 });
    try {
      const f = await db.faq.create({
        data: {
          question, answer, category: body?.category ?? "Umum",
          sortOrder: typeof body?.sortOrder === "number" ? body.sortOrder : 0,
          isActive: body?.isActive ?? true,
        },
      });
      bustCache();
      return NextResponse.json({ status: "ok", message: "FAQ ditambahkan.", faq: f });
    } catch {
      return NextResponse.json({ status: "failed", message: "Gagal menambah FAQ." }, { status: 500 });
    }
  }

  if (action === "update") {
    const id = String(body?.id ?? "");
    if (!id) return NextResponse.json({ status: "failed", message: "ID wajib diisi." }, { status: 400 });
    try {
      const updateData: Record<string, unknown> = {};
      if (typeof body?.question === "string") updateData.question = body.question.trim();
      if (typeof body?.answer === "string") updateData.answer = body.answer.trim();
      if (typeof body?.category === "string") updateData.category = body.category;
      if (typeof body?.sortOrder === "number") updateData.sortOrder = body.sortOrder;
      if (typeof body?.isActive === "boolean") updateData.isActive = body.isActive;
      const f = await db.faq.update({ where: { id }, data: updateData });
      bustCache();
      return NextResponse.json({ status: "ok", message: "FAQ diperbarui.", faq: f });
    } catch {
      return NextResponse.json({ status: "failed", message: "Gagal memperbarui FAQ." }, { status: 500 });
    }
  }

  if (action === "delete") {
    const id = String(body?.id ?? "");
    if (!id) return NextResponse.json({ status: "failed", message: "ID wajib diisi." }, { status: 400 });
    try {
      await db.faq.delete({ where: { id } });
      bustCache();
      return NextResponse.json({ status: "ok", message: "FAQ dihapus." });
    } catch {
      return NextResponse.json({ status: "failed", message: "Gagal menghapus FAQ." }, { status: 500 });
    }
  }

  return NextResponse.json({ status: "failed", message: `Aksi "${action}" tidak dikenal.` }, { status: 400 });
}
