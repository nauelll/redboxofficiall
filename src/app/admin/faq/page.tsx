// /admin/faq
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { FaqAdminClient } from "@/components/admin/faq-admin-client";

export const metadata: Metadata = { title: "FAQ — Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminFaqPage() {
  const faqs = await db.faq.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <FaqAdminClient initialFaqs={faqs.map((f) => ({
      id: f.id, question: f.question, answer: f.answer, category: f.category, sortOrder: f.sortOrder, isActive: f.isActive,
    }))} />
  );
}
