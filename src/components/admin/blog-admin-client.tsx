"use client";
// Blog admin — list + add/edit/delete. Uses /api/admin/blog.
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, ArrowLeft, Loader2, X, Save, BookOpen, Calendar } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Post {
  id: string; slug: string; title: string; excerpt: string; content: string;
  coverImage: string; category: string; tags: string[]; author: string;
  status: string; featured: boolean; publishedAt: string;
}

const BLOG_CATEGORIES = ["Tips Fashion", "Mix & Match", "Fashion Trend", "Perawatan Baju", "Inspirasi Outfit"];

export function BlogAdminClient({ initialPosts }: { initialPosts: Post[] }) {
  const router = useRouter();
  const [posts, setPosts] = React.useState(initialPosts);
  const [editing, setEditing] = React.useState<Post | null>(null);
  const [adding, setAdding] = React.useState(false);

  React.useEffect(() => { setPosts(initialPosts); }, [initialPosts]);

  function refresh() { router.refresh(); }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Hapus artikel "${title}"?`)) return;
    try {
      const res = await fetch("/api/admin/blog", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "delete", id }) });
      const data = await res.json();
      if (data.status === "ok") { toast.success("Artikel dihapus."); setPosts((prev) => prev.filter((p) => p.id !== id)); refresh(); }
      else toast.error(data.message || "Gagal menghapus.");
    } catch { toast.error("Gagal menghapus."); }
  }

  return (
    <div className="container-premium pt-24 md:pt-28 pb-6 md:pb-10">
      <div className="mb-6">
        <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft className="h-4 w-4" /> Kembali ke Dashboard</Link>
      </div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Blog</h1>
          <p className="text-sm text-muted-foreground mt-2">Kelola artikel blog.</p>
        </div>
        <button onClick={() => setAdding(true)} className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-foreground text-background font-semibold hover:bg-[#dc2626] transition-colors text-sm"><Plus className="h-4 w-4" /> Tambah Artikel</button>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <BookOpen className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
          <p className="font-semibold">Belum ada artikel</p>
          <button onClick={() => setAdding(true)} className="mt-5 inline-flex items-center gap-2 h-11 px-5 rounded-full bg-foreground text-background font-semibold hover:bg-[#dc2626] transition-colors text-sm"><Plus className="h-4 w-4" /> Tambah Artikel</button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((p) => (
            <div key={p.id} className="rounded-2xl border border-border bg-background overflow-hidden">
              <div className="relative aspect-[16/9] bg-secondary">
                {p.coverImage && <img src={p.coverImage} alt={p.title} className="absolute inset-0 h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0"; }} />}
                <span className="absolute top-3 left-3 inline-flex items-center h-6 px-2.5 rounded-full bg-white/90 backdrop-blur text-[10px] font-bold tracking-widest uppercase">{p.category}</span>
                {p.status !== "published" && <span className="absolute top-3 right-3 inline-flex items-center h-6 px-2.5 rounded-full bg-amber-500 text-white text-[10px] font-bold tracking-widest uppercase">{p.status}</span>}
              </div>
              <div className="p-4">
                <p className="font-display font-bold text-sm line-clamp-2">{p.title}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{p.excerpt}</p>
                <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(p.publishedAt).toLocaleDateString("id-ID")}</p>
                <div className="mt-3 flex items-center gap-1.5">
                  <button onClick={() => setEditing(p)} title="Edit" className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-border hover:border-foreground/40 hover:bg-secondary transition-colors"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(p.id, p.title)} title="Hapus" className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-border hover:border-[#dc2626] hover:text-[#dc2626] transition-colors"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(adding || editing) && <BlogModal post={editing} onClose={() => { setAdding(false); setEditing(null); }} onSaved={() => { setAdding(false); setEditing(null); refresh(); }} />}
    </div>
  );
}

function BlogModal({ post, onClose, onSaved }: { post: Post | null; onClose: () => void; onSaved: () => void }) {
  const isEdit = !!post;
  const [title, setTitle] = React.useState(post?.title ?? "");
  const [slug, setSlug] = React.useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = React.useState(post?.excerpt ?? "");
  const [content, setContent] = React.useState(post?.content ?? "");
  const [coverImage, setCoverImage] = React.useState(post?.coverImage ?? "");
  const [category, setCategory] = React.useState(post?.category ?? "Tips Fashion");
  const [tagsText, setTagsText] = React.useState(post?.tags.join(", ") ?? "");
  const [status, setStatus] = React.useState(post?.status ?? "published");
  const [featured, setFeatured] = React.useState(post?.featured ?? false);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!isEdit && title) setSlug(title.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 60));
  }, [title, isEdit]);
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && !saving) onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose, saving]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    if (!title.trim()) { toast.error("Judul wajib diisi."); return; }
    setSaving(true);
    const tags = tagsText.split(",").map((s) => s.trim()).filter(Boolean);
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: isEdit ? "update" : "add",
          ...(isEdit ? { id: post!.id } : {}),
          title: title.trim(), slug: slug.trim(), excerpt: excerpt.trim(),
          content: content.trim(), coverImage: coverImage.trim(),
          category, tags, status, featured,
        }),
      });
      const data = await res.json();
      if (data.status === "ok") { toast.success(data.message); onSaved(); onClose(); }
      else toast.error(data.message || "Gagal menyimpan.");
    } catch { toast.error("Gagal terhubung."); }
    finally { setSaving(false); }
  }

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !saving && onClose()} className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }}
        className="fixed inset-x-3 sm:inset-x-4 top-3 sm:top-10 bottom-3 sm:bottom-10 z-50 mx-auto max-w-2xl rounded-2xl bg-background shadow-premium flex flex-col overflow-hidden"
        role="dialog" aria-modal="true"
      >
        <div className="shrink-0 px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">{isEdit ? "Edit Artikel" : "Tambah Artikel"}</h2>
          <button onClick={() => !saving && onClose()} disabled={saving} className="p-2 rounded-full hover:bg-secondary disabled:opacity-50"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          <Field label="Judul" required value={title} onChange={setTitle} placeholder="5 Tips Memilih Kaos Anak" />
          <Field label="Slug" value={slug} onChange={setSlug} placeholder="auto-generated" disabled={isEdit} />
          <Field label="Excerpt" multiline rows={2} value={excerpt} onChange={setExcerpt} placeholder="Ringkasan singkat artikel…" />
          <Field label="Konten (Markdown — gunakan ## untuk heading)" multiline rows={8} value={content} onChange={setContent} placeholder="## Pendahuluan&#10;&#10;Tulis artikel di sini…" />
          <Field label="URL Cover Image" value={coverImage} onChange={setCoverImage} placeholder="/assets/blog/post-1.svg" />
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Kategori</span>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1.5 w-full h-11 px-3 rounded-lg bg-secondary border border-border outline-none cursor-pointer">
                {BLOG_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Status</span>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1.5 w-full h-11 px-3 rounded-lg bg-secondary border border-border outline-none cursor-pointer">
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </label>
          </div>
          <Field label="Tags (pisahkan koma)" value={tagsText} onChange={setTagsText} placeholder="tips, kaos, anak" />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4 rounded border-border accent-foreground" />
            <span className="text-sm">Featured (tampil di home jika diaktifkan)</span>
          </label>
        </form>
        <div className="shrink-0 px-5 py-4 border-t border-border flex items-center justify-end gap-3 bg-background">
          <button type="button" onClick={() => !saving && onClose()} disabled={saving} className="h-11 px-5 rounded-full border border-border hover:bg-secondary text-sm font-semibold disabled:opacity-50">Batal</button>
          <button type="button" onClick={handleSubmit} disabled={saving} className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-foreground text-background font-semibold hover:bg-[#dc2626] transition-colors disabled:opacity-50">
            {saving ? <><Loader2 className="h-4 w-4 animate-spin" />Menyimpan…</> : <><Save className="h-4 w-4" />Simpan</>}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function Field({ label, value, onChange, placeholder, multiline, rows = 3, required, disabled }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
  multiline?: boolean; rows?: number; required?: boolean; disabled?: boolean;
}) {
  const base = "mt-1.5 w-full px-4 rounded-lg bg-secondary border border-border focus:border-foreground/30 outline-none transition-colors text-sm disabled:opacity-60";
  return (
    <label className="block">
      <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">{label}{required && <span className="text-[#dc2626] ml-1">*</span>}</span>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} disabled={disabled} className={`${base} py-3 resize-y`} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} disabled={disabled} className={`${base} h-11`} />
      )}
    </label>
  );
}
