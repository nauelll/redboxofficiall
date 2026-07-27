// /blog/[slug] — single blog post.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowLeft, ArrowRight } from "lucide-react";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/catalog";
import { JsonLd } from "@/components/common/json-ld";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Artikel tidak ditemukan" };
  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt ?? "",
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt ?? "",
      url: `/blog/${post.slug}`,
      images: post.coverImage ? [{ url: post.coverImage }] : [],
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
  };
}

export const dynamic = "force-dynamic";

// Simple markdown to HTML (very basic — handles ## headings, **bold**, lists, paragraphs)
function renderMarkdown(md: string): string {
  return md
    .split("\n")
    .map((line) => {
      if (line.startsWith("## ")) return `<h2 class="font-display text-xl md:text-2xl font-bold tracking-tight mt-8 mb-3">${line.slice(3)}</h2>`;
      if (line.startsWith("### ")) return `<h3 class="font-display text-lg md:text-xl font-bold tracking-tight mt-6 mb-2">${line.slice(4)}</h3>`;
      if (line.startsWith("- ")) return `<li class="ml-4 list-disc text-sm md:text-base text-muted-foreground leading-relaxed">${line.slice(2)}</li>`;
      if (line.trim() === "") return "";
      return `<p class="text-sm md:text-base text-muted-foreground leading-relaxed mb-3">${line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground">$1</strong>')}</p>`;
    })
    .join("\n");
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const allPosts = await getBlogPosts();
  const related = allPosts.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, 3);

  return (
    <>
      <div className="container-premium pt-24 md:pt-28">
        <Breadcrumb items={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]} />
      </div>

      <article className="container-premium py-8 md:py-12 max-w-3xl">
        {/* Header */}
        <header className="mb-8">
          <span className="inline-flex items-center h-7 px-2.5 rounded-full bg-[#dc2626]/10 text-[#dc2626] text-[10px] font-bold tracking-widest uppercase mb-4">{post.category}</span>
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight leading-[1.05] text-balance">{post.title}</h1>
          {post.excerpt && <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">{post.excerpt}</p>}
          <div className="mt-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{post.author}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(post.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>
        </header>

        {/* Cover image */}
        {post.coverImage && (
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-secondary mb-8">
            <Image src={post.coverImage} alt={post.title} fill sizes="(max-width: 768px) 100vw, 768px" priority className="object-cover" />
          </div>
        )}

        {/* Content */}
        <div
          className="prose-content"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
        />

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-border flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <span key={t} className="inline-flex items-center h-7 px-3 rounded-full bg-secondary text-xs font-medium">#{t}</span>
            ))}
          </div>
        )}

        {/* Back link */}
        <div className="mt-8">
          <Link href="/blog" className="group inline-flex items-center gap-2 text-sm font-semibold hover:text-[#dc2626] transition-colors">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Kembali ke Blog
          </Link>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-secondary/40 py-12 md:py-20">
          <div className="container-premium max-w-5xl">
            <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight mb-6">Artikel terkait</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {related.map((p) => (
                <Link key={p.id} href={`/blog/${p.slug}`} className="group block rounded-xl overflow-hidden border border-border bg-background">
                  <div className="relative aspect-[16/10] bg-secondary">
                    {p.coverImage && <Image src={p.coverImage} alt={p.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform group-hover:scale-105" />}
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-[#dc2626] mb-1">{p.category}</p>
                    <h3 className="font-display text-sm font-bold leading-snug line-clamp-2 group-hover:text-[#dc2626] transition-colors">{p.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <JsonLd data={{
        "@context": "https://schema.org", "@type": "BlogPosting",
        headline: post.title, description: post.excerpt,
        image: post.coverImage, datePublished: post.publishedAt,
        author: { "@type": "Organization", name: post.author },
        publisher: { "@type": "Organization", name: "REDBOX" },
      }} />
    </>
  );
}
