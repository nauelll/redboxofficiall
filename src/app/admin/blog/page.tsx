// /admin/blog — manage blog posts (CRUD via API).
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { BlogAdminClient } from "@/components/admin/blog-admin-client";

export const metadata: Metadata = { title: "Blog — Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await db.blogPost.findMany({ orderBy: { publishedAt: "desc" } });
  return (
    <BlogAdminClient initialPosts={posts.map((p) => ({
      id: p.id, slug: p.slug, title: p.title, excerpt: p.excerpt ?? "",
      content: p.content, coverImage: p.coverImage ?? "", category: p.category,
      tags: p.tags ? JSON.parse(p.tags) : [], author: p.author, status: p.status,
      featured: p.featured, publishedAt: p.publishedAt.toISOString(),
    }))} />
  );
}
