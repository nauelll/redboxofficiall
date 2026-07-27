"use client";
// Admin dashboard — professional sidebar layout + product management.
import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Plus, Trash2, Package, RefreshCw, LogOut, Pencil, Copy, Eye, Archive,
  CheckCircle2, FileText, Settings, Image as ImageIcon, FileQuestion, BookOpen,
  ShoppingBag, ExternalLink, X, Save, Loader2, Menu, Home,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatIDR } from "@/lib/catalog";

interface AdminProduct {
  id: string; slug: string; name: string; price?: number; sku?: string;
  categoryId?: string; categoryName?: string;
  subcategoryId?: string; subcategoryName?: string;
  images: string[]; stock: number; badge?: string | null; status: string;
  shopeeUrl?: string; tiktokUrl?: string; lazadaUrl?: string; whatsappUrl?: string;
  description: string; material?: string; detailInfo?: string; careInfo?: string;
  weightGram?: number; sizes: string[]; colors: { name: string; hex: string }[];
  video?: string; popularity: number; rating: number; reviewCount: number;
  createdAt: string;
}

interface AdminCategory {
  id: string; slug: string; name: string;
  subcategories: { id: string; slug: string; name: string; categoryId: string }[];
}

interface Stats { total: number; published: number; draft: number; archived: number; }

interface Props {
  products: AdminProduct[];
  stats: Stats;
  categories: AdminCategory[];
}

const STATUS_LABELS: Record<string, string> = { published: "Published", draft: "Draft", archived: "Arsip" };
const STATUS_COLORS: Record<string, string> = {
  published: "bg-emerald-500", draft: "bg-amber-500", archived: "bg-gray-400",
};
const BADGES = ["none", "NEW_ARRIVAL", "BEST_SELLER", "TRENDING", "LIMITED_EDITION", "SALE"];
const BADGE_LABELS: Record<string, string> = {
  "none": "Tanpa badge", NEW_ARRIVAL: "Baru", BEST_SELLER: "Terlaris",
  TRENDING: "Trending", LIMITED_EDITION: "Limited", SALE: "Sale",
};
const BADGE_COLORS: Record<string, string> = {
  NEW_ARRIVAL: "bg-[#dc2626] text-white", BEST_SELLER: "bg-[#1A1A1A] text-white",
  TRENDING: "bg-amber-500 text-white", LIMITED_EDITION: "bg-purple-600 text-white",
  SALE: "bg-[#dc2626] text-white",
};

const navLinks = [
  { href: "/admin", label: "Dashboard", icon: Package },
  { href: "/admin/categories", label: "Kategori", icon: ShoppingBag },
  { href: "/admin/banners", label: "Banner", icon: ImageIcon },
  { href: "/admin/blog", label: "Blog", icon: BookOpen },
  { href: "/admin/faq", label: "FAQ", icon: FileQuestion },
  { href: "/admin/settings", label: "Pengaturan", icon: Settings },
];

export function AdminDashboardClient({ products: initialProducts, stats: initialStats, categories }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [products, setProducts] = React.useState(initialProducts);
  const [stats, setStats] = React.useState(initialStats);
  const [filter, setFilter] = React.useState<"all" | "published" | "draft" | "archived">("all");
  const [editing, setEditing] = React.useState<AdminProduct | null>(null);
  const [adding, setAdding] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    setProducts(initialProducts);
    setStats(initialStats);
  }, [initialProducts, initialStats]);

  function refresh() {
    setRefreshing(true);
    router.refresh();
    setTimeout(() => setRefreshing(false), 1000);
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Hapus produk "${name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    try {
      const res = await fetch("/api/products", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
      const data = await res.json();
      if (data.status === "ok") {
        toast.success("Produk dihapus.");
        const oldStatus = products.find((p) => p.id === id)?.status as "published" | "draft" | "archived";
        setProducts((prev) => prev.filter((p) => p.id !== id));
        if (oldStatus) setStats((prev) => ({ ...prev, total: prev.total - 1, [oldStatus]: Math.max(0, prev[oldStatus] - 1) }));
        refresh();
      } else toast.error(data.message || "Gagal menghapus.");
    } catch { toast.error("Gagal menghapus."); }
  }

  async function handleStatusChange(id: string, name: string, status: "published" | "draft" | "archived") {
    try {
      const res = await fetch("/api/products", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_status", id, status }),
      });
      const data = await res.json();
      if (data.status === "ok") {
        toast.success(`"${name}" → ${STATUS_LABELS[status]}.`);
        const oldStatus = products.find((p) => p.id === id)?.status as "published" | "draft" | "archived";
        setProducts((prev) => prev.map((p) => p.id === id ? { ...p, status } : p));
        if (oldStatus) setStats((prev) => ({
          ...prev,
          [oldStatus]: Math.max(0, prev[oldStatus] - 1),
          [status]: prev[status] + 1,
        }));
        refresh();
      }
    } catch { toast.error("Gagal mengubah status."); }
  }

  async function handleDuplicate(p: AdminProduct) {
    try {
      const res = await fetch("/api/products", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "duplicate", id: p.id }),
      });
      const data = await res.json();
      if (data.status === "ok") {
        toast.success(`"${p.name}" diduplikasi sebagai draf.`);
        setStats((prev) => ({ ...prev, total: prev.total + 1, draft: prev.draft + 1 }));
        refresh();
      } else toast.error(data.message || "Gagal menduplikasi.");
    } catch { toast.error("Gagal menduplikasi."); }
  }

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      toast.success("Berhasil logout.");
      router.push("/admin/login");
    } catch { toast.error("Gagal logout."); }
  }

  const filtered = filter === "all" ? products : products.filter((p) => p.status === filter);

  return (
    <div className="min-h-screen flex bg-[#FAF7F2]">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#1A1A1A] text-white fixed inset-y-0 left-0 z-40 pt-24">
        <div className="px-5 py-4 border-b border-white/10">
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#dc2626]">REDBOX Admin</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navLinks.map((l) => {
            const active = pathname === l.href;
            return (
              <Link key={l.href} href={l.href}
                className={cn("flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  active ? "bg-[#dc2626] text-white" : "text-white/60 hover:text-white hover:bg-white/5")}>
                <l.icon className="h-4 w-4" /> {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <Link href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors">
            <Home className="h-4 w-4" /> Lihat Website
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-[#dc2626] hover:bg-white/5 transition-colors">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-40 bg-black/50 lg:hidden" />
            <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 360, damping: 36 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-[#1A1A1A] text-white lg:hidden flex flex-col pt-6">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#dc2626]">REDBOX Admin</p>
                <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10"><X className="h-5 w-5" /></button>
              </div>
              <nav className="flex-1 px-3 py-4 space-y-1">
                {navLinks.map((l) => {
                  const active = pathname === l.href;
                  return (
                    <Link key={l.href} href={l.href} onClick={() => setSidebarOpen(false)}
                      className={cn("flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                        active ? "bg-[#dc2626] text-white" : "text-white/60 hover:text-white hover:bg-white/5")}>
                      <l.icon className="h-4 w-4" /> {l.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="px-3 py-4 border-t border-white/10 space-y-1">
                <Link href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5">
                  <Home className="h-4 w-4" /> Lihat Website
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-[#dc2626] hover:bg-white/5">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 pt-24 md:pt-28">
        <div className="container-premium pb-10">
          {/* Top bar */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl bg-white border border-border shadow-sm">
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="font-display text-xl md:text-2xl font-bold tracking-tight">Dashboard Produk</h1>
                <p className="text-xs text-muted-foreground mt-0.5">Kelola semua produk REDBOX</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={refresh} disabled={refreshing} className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-white border border-border hover:bg-secondary text-sm font-semibold transition-colors">
                <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} /> <span className="hidden sm:inline">Refresh</span>
              </button>
              <button onClick={() => setAdding(true)} className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-[#dc2626] text-white font-semibold hover:bg-[#b91c1c] transition-colors text-sm shadow-sm">
                <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Tambah Produk</span><span className="sm:hidden">Tambah</span>
              </button>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Total", value: stats.total, icon: Package, color: "bg-[#1A1A1A]" },
              { label: "Published", value: stats.published, icon: CheckCircle2, color: "bg-emerald-500" },
              { label: "Draft", value: stats.draft, icon: FileText, color: "bg-amber-500" },
              { label: "Arsip", value: stats.archived, icon: Archive, color: "bg-gray-400" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-border p-4 md:p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] md:text-xs font-semibold tracking-widest uppercase text-muted-foreground">{s.label}</p>
                  <div className={cn("inline-flex items-center justify-center h-7 w-7 rounded-lg text-white", s.color)}>
                    <s.icon className="h-3.5 w-3.5" />
                  </div>
                </div>
                <p className="font-display text-2xl md:text-3xl font-bold tabular-nums">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Filter chips */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
            {(["all", "published", "draft", "archived"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={cn("inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                  filter === f ? "bg-[#1A1A1A] text-white" : "bg-white border border-border text-foreground hover:bg-secondary")}>
                {f === "all" ? "Semua" : STATUS_LABELS[f]}
                <span className={cn("inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full text-[10px] font-bold",
                  filter === f ? "bg-white/20" : "bg-secondary")}>
                  {f === "all" ? stats.total : stats[f]}
                </span>
              </button>
            ))}
          </div>

          {/* Product list */}
          <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-border bg-secondary/30">
              <h2 className="font-display text-base font-bold">Daftar Produk ({filtered.length})</h2>
            </div>
            {filtered.length === 0 ? (
              <div className="p-10 text-center">
                <Package className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                <p className="font-semibold">Belum ada produk</p>
                <button onClick={() => setAdding(true)} className="mt-4 inline-flex items-center gap-2 h-10 px-5 rounded-full bg-[#dc2626] text-white font-semibold hover:bg-[#b91c1c] text-sm">
                  <Plus className="h-4 w-4" /> Tambah Produk
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {filtered.map((p) => (
                  <li key={p.id} className="p-4 md:p-5 flex items-center gap-3 md:gap-4 hover:bg-secondary/20 transition-colors">
                    {/* Image */}
                    <div className="relative h-14 w-14 md:h-16 md:w-16 shrink-0 rounded-lg overflow-hidden bg-secondary border border-border">
                      {p.images[0] && (
                        <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = "/assets/placeholder.svg"; }} />
                      )}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="font-semibold text-sm md:text-base truncate">{p.name}</p>
                        {p.badge && (
                          <span className={cn("inline-flex items-center h-5 px-2 rounded-full text-[9px] font-bold tracking-widest uppercase", BADGE_COLORS[p.badge] ?? "bg-gray-200")}>
                            {BADGE_LABELS[p.badge] ?? p.badge}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[9px] font-bold tracking-widest uppercase bg-secondary">
                          <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_COLORS[p.status])} />
                          {STATUS_LABELS[p.status] ?? p.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {p.categoryName ?? "—"} · {p.stock} stok{p.price ? ` · ${formatIDR(p.price)}` : ""}
                      </p>
                    </div>
                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      {p.status !== "published" && (
                        <button onClick={() => handleStatusChange(p.id, p.name, "published")} title="Publish" className="inline-flex items-center justify-center h-8 w-8 md:h-9 md:w-9 rounded-full border border-border hover:border-emerald-500 hover:text-emerald-500 transition-colors">
                          <CheckCircle2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                        </button>
                      )}
                      {p.status === "published" && (
                        <button onClick={() => handleStatusChange(p.id, p.name, "draft")} title="Jadikan draft" className="inline-flex items-center justify-center h-8 w-8 md:h-9 md:w-9 rounded-full border border-border hover:border-amber-500 hover:text-amber-500 transition-colors">
                          <FileText className="h-3.5 w-3.5 md:h-4 md:w-4" />
                        </button>
                      )}
                      <button onClick={() => handleDuplicate(p)} title="Duplikasi" className="hidden sm:inline-flex items-center justify-center h-9 w-9 rounded-full border border-border hover:border-foreground/40 transition-colors">
                        <Copy className="h-4 w-4" />
                      </button>
                      {p.status === "published" && (
                        <Link href={`/product/${p.slug}`} target="_blank" title="Lihat" className="hidden sm:inline-flex items-center justify-center h-9 w-9 rounded-full border border-border hover:bg-secondary">
                          <Eye className="h-4 w-4" />
                        </Link>
                      )}
                      <button onClick={() => setEditing(p)} title="Edit" className="inline-flex items-center justify-center h-8 w-8 md:h-9 md:w-9 rounded-full border border-border hover:border-foreground/40 hover:bg-secondary transition-colors">
                        <Pencil className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      </button>
                      <button onClick={() => handleDelete(p.id, p.name)} title="Hapus" className="inline-flex items-center justify-center h-8 w-8 md:h-9 md:w-9 rounded-full border border-border hover:border-[#dc2626] hover:text-[#dc2626] transition-colors">
                        <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {(adding || editing) && (
        <ProductModal product={editing} categories={categories}
          onClose={() => { setAdding(false); setEditing(null); }}
          onSaved={() => {
            setAdding(false); setEditing(null);
            setStats((prev) => ({ ...prev, total: prev.total + 1, published: prev.published + 1 }));
            refresh();
          }} />
      )}
    </div>
  );
}

// ----- Product Modal -----
function ProductModal({ product, categories, onClose, onSaved }: {
  product: AdminProduct | null; categories: AdminCategory[]; onClose: () => void; onSaved: () => void;
}) {
  const isEdit = !!product;
  const [name, setName] = React.useState(product?.name ?? "");
  const [slug, setSlug] = React.useState(product?.slug ?? "");
  const [sku, setSku] = React.useState(product?.sku ?? "");
  const [price, setPrice] = React.useState(product?.price ? String(product.price) : "");
  const [stock, setStock] = React.useState(String(product?.stock ?? 0));
  const [description, setDescription] = React.useState(product?.description ?? "");
  const [detailInfo, setDetailInfo] = React.useState(product?.detailInfo ?? "");
  const [careInfo, setCareInfo] = React.useState(product?.careInfo ?? "");
  const [material, setMaterial] = React.useState(product?.material ?? "");
  const [categoryId, setCategoryId] = React.useState(product?.categoryId ?? "");
  const [subcategoryId, setSubcategoryId] = React.useState(product?.subcategoryId ?? "");
  const [imagesText, setImagesText] = React.useState(product?.images.join("\n") ?? "");
  const [video, setVideo] = React.useState(product?.video ?? "");
  const [sizesText, setSizesText] = React.useState(product?.sizes.join(", ") ?? "S, M, L, XL");
  const [colorsText, setColorsText] = React.useState(product?.colors.map((c) => c.name).join(", ") ?? "Hitam");
  const [weightGram, setWeightGram] = React.useState(product?.weightGram ? String(product.weightGram) : "");
  const [badge, setBadge] = React.useState(product?.badge ?? "none");
  const [shopeeUrl, setShopeeUrl] = React.useState(product?.shopeeUrl ?? "");
  const [tiktokUrl, setTiktokUrl] = React.useState(product?.tiktokUrl ?? "");
  const [lazadaUrl, setLazadaUrl] = React.useState(product?.lazadaUrl ?? "");
  const [whatsappUrl, setWhatsappUrl] = React.useState(product?.whatsappUrl ?? "");
  const [status, setStatus] = React.useState(product?.status ?? "published");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!isEdit && name) setSlug(name.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 60));
  }, [name, isEdit]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && !saving) onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose, saving]);

  const selectedCat = categories.find((c) => c.id === categoryId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    if (!name.trim()) { toast.error("Nama produk wajib diisi."); return; }
    const priceNum = price ? Number(price) : undefined;
    if (price && (!Number.isFinite(priceNum) || priceNum! < 0)) { toast.error("Harga tidak valid."); return; }
    const images = imagesText.split("\n").map((s) => s.trim()).filter(Boolean);
    const sizes = sizesText.split(",").map((s) => s.trim()).filter(Boolean);
    const colors = colorsText.split(",").map((s) => s.trim()).filter(Boolean).map((n) => ({ name: n, hex: guessHex(n) }));
    setSaving(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: isEdit ? "update" : "add", ...(isEdit ? { id: product!.id } : {}),
          name: name.trim(), slug: slug.trim() || undefined, sku: sku.trim() || undefined,
          price: priceNum, stock: stock ? Number(stock) : 0,
          description: description.trim(), detailInfo: detailInfo.trim() || undefined,
          careInfo: careInfo.trim() || undefined, material: material.trim() || undefined,
          categoryId: categoryId || undefined, subcategoryId: subcategoryId || undefined,
          images, video: video.trim() || undefined, sizes, colors,
          weightGram: weightGram ? Number(weightGram) : undefined,
          badge: badge === "none" ? undefined : badge,
          shopeeUrl: shopeeUrl.trim() || undefined, tiktokUrl: tiktokUrl.trim() || undefined,
          lazadaUrl: lazadaUrl.trim() || undefined, whatsappUrl: whatsappUrl.trim() || undefined,
          status,
        }),
      });
      const data = await res.json();
      if (data.status === "ok") { toast.success(data.message); onSaved(); onClose(); }
      else toast.error(data.message || "Gagal menyimpan.");
    } catch { toast.error("Gagal terhubung ke server."); }
    finally { setSaving(false); }
  }

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={() => !saving && onClose()} className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }}
        className="fixed inset-x-3 sm:inset-x-4 top-3 sm:top-10 bottom-3 sm:bottom-10 z-50 mx-auto max-w-2xl rounded-2xl bg-white shadow-2xl flex flex-col overflow-hidden"
        role="dialog" aria-modal="true">
        <div className="shrink-0 px-5 py-4 border-b border-border flex items-center justify-between bg-[#1A1A1A] text-white">
          <h2 className="font-display text-lg font-bold">{isEdit ? "Edit Produk" : "Tambah Produk"}</h2>
          <button onClick={() => !saving && onClose()} disabled={saving} className="p-2 rounded-full hover:bg-white/10 disabled:opacity-50">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-5 space-y-4 bg-[#FAF7F2]">
          <Field label="Nama Produk" required value={name} onChange={setName} placeholder="Contoh: Basic Tee Hitam" />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Slug" value={slug} onChange={setSlug} placeholder="auto-generated" disabled={isEdit} />
            <Field label="SKU" value={sku} onChange={setSku} placeholder="RDB-KA-001" />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Harga (IDR)" type="number" value={price} onChange={setPrice} placeholder="79000" />
            <Field label="Stok" type="number" value={stock} onChange={setStock} placeholder="50" />
            <Field label="Berat (gram)" type="number" value={weightGram} onChange={setWeightGram} placeholder="180" />
          </div>
          <Field label="Deskripsi" multiline rows={3} value={description} onChange={setDescription} placeholder="Deskripsi produk…" />
          <Field label="Detail Produk" multiline rows={2} value={detailInfo} onChange={setDetailInfo} placeholder="Bahan, fit, jahitan, dll." />
          <Field label="Cara Perawatan" multiline rows={2} value={careInfo} onChange={setCareInfo} placeholder="Cara cuci & setrika…" />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Material" value={material} onChange={setMaterial} placeholder="100% Katun Combed 30s" />
            <label className="block">
              <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Kategori</span>
              <select value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setSubcategoryId(""); }}
                className="mt-1.5 w-full h-11 px-3 rounded-lg bg-white border border-border outline-none cursor-pointer text-sm">
                <option value="">— Pilih kategori —</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
          </div>
          {selectedCat && selectedCat.subcategories.length > 0 && (
            <label className="block">
              <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Subkategori</span>
              <select value={subcategoryId} onChange={(e) => setSubcategoryId(e.target.value)}
                className="mt-1.5 w-full h-11 px-3 rounded-lg bg-white border border-border outline-none cursor-pointer text-sm">
                <option value="">— Pilih subkategori —</option>
                {selectedCat.subcategories.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </label>
          )}
          <Field label="URL Foto (satu per baris)" multiline rows={3} value={imagesText} onChange={setImagesText} placeholder="/assets/products/p1.svg" />
          <Field label="URL Video (opsional)" value={video} onChange={setVideo} placeholder="https://youtube.com/..." />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Ukuran (pisahkan koma)" value={sizesText} onChange={setSizesText} placeholder="S, M, L, XL" />
            <Field label="Warna (pisahkan koma)" value={colorsText} onChange={setColorsText} placeholder="Hitam, Putih" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Badge</span>
              <select value={badge} onChange={(e) => setBadge(e.target.value)} className="mt-1.5 w-full h-11 px-3 rounded-lg bg-white border border-border outline-none cursor-pointer text-sm">
                {BADGES.map((b) => <option key={b} value={b}>{BADGE_LABELS[b] ?? b}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Status</span>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1.5 w-full h-11 px-3 rounded-lg bg-white border border-border outline-none cursor-pointer text-sm">
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Arsip</option>
              </select>
            </label>
          </div>
          <div className="rounded-xl border border-border bg-white p-4">
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">Link Marketplace</p>
            <div className="space-y-3">
              <Field label="Shopee URL" value={shopeeUrl} onChange={setShopeeUrl} placeholder="https://shopee.co.id/..." />
              <Field label="TikTok Shop / Tokopedia URL" value={tiktokUrl} onChange={setTiktokUrl} placeholder="https://..." />
              <Field label="Lazada URL" value={lazadaUrl} onChange={setLazadaUrl} placeholder="https://..." />
              <Field label="WhatsApp URL" value={whatsappUrl} onChange={setWhatsappUrl} placeholder="https://wa.me/..." />
            </div>
          </div>
        </form>
        <div className="shrink-0 px-5 py-4 border-t border-border flex items-center justify-end gap-3 bg-white">
          <button type="button" onClick={() => !saving && onClose()} disabled={saving}
            className="h-11 px-5 rounded-full border border-border hover:bg-secondary text-sm font-semibold disabled:opacity-50">Batal</button>
          <button type="button" onClick={handleSubmit} disabled={saving}
            className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-[#dc2626] text-white font-semibold hover:bg-[#b91c1c] transition-colors disabled:opacity-50">
            {saving ? <><Loader2 className="h-4 w-4 animate-spin" />Menyimpan…</> : <><Save className="h-4 w-4" />Simpan</>}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", multiline, rows = 3, required, disabled }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
  type?: string; multiline?: boolean; rows?: number; required?: boolean; disabled?: boolean;
}) {
  const base = "mt-1.5 w-full px-4 rounded-lg bg-white border border-border focus:border-[#dc2626]/40 outline-none transition-colors text-sm disabled:opacity-60";
  return (
    <label className="block">
      <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
        {label}{required && <span className="text-[#dc2626] ml-1">*</span>}
      </span>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} disabled={disabled} className={`${base} py-3 resize-y`} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} disabled={disabled} className={`${base} h-11`} />
      )}
    </label>
  );
}

function guessHex(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("hitam") || n.includes("black")) return "#0a0a0a";
  if (n.includes("putih") || n.includes("white")) return "#ffffff";
  if (n.includes("merah") || n.includes("red")) return "#dc2626";
  if (n.includes("biru") || n.includes("blue") || n.includes("navy")) return "#1a2b4a";
  if (n.includes("hijau") || n.includes("green")) return "#2d4030";
  if (n.includes("kuning") || n.includes("yellow")) return "#FACC15";
  if (n.includes("abu") || n.includes("gray") || n.includes("grey")) return "#6b6b6b";
  if (n.includes("cream")) return "#efe6d2";
  if (n.includes("army")) return "#5c5c42";
  return "#0a0a0a";
}
