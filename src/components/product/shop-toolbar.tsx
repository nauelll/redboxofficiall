"use client";
// Shop toolbar — premium filter + search, responsive mobile.
import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal, X, Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category, SortKey } from "@/lib/catalog";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "popular", label: "Paling Populer" },
  { value: "newest", label: "Terbaru" },
  { value: "price-asc", label: "Harga: Terendah" },
  { value: "price-desc", label: "Harga: Tertinggi" },
];

const allSizes = ["S", "M", "L", "XL", "XXL", "28", "30", "32", "34"];
const allColors = ["Hitam", "Putih", "Navy", "Gray", "Cream", "Merah", "Army"];
const allBadges = [
  { value: "NEW_ARRIVAL", label: "Baru" },
  { value: "BEST_SELLER", label: "Terlaris" },
  { value: "TRENDING", label: "Trending" },
  { value: "SALE", label: "Sale" },
];

interface ShopToolbarProps {
  resultCount: number;
  categories: Category[];
}

export function ShopToolbar({ resultCount, categories }: ShopToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const q = sp.get("q") ?? "";
  const cat = sp.get("cat") ?? "ALL";
  const sub = sp.get("sub") ?? "ALL";
  const color = sp.get("color") ?? "";
  const size = sp.get("size") ?? "";
  const badge = sp.get("badge") ?? "ALL";
  const sort = (sp.get("sort") as SortKey) ?? "popular";
  const onSale = sp.get("sale") === "1";

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [localQ, setLocalQ] = React.useState(q);

  React.useEffect(() => { setLocalQ(q); }, [q]);

  function updateParam(key: string, value: string | null) {
    const next = new URLSearchParams(sp.toString());
    if (value === null || value === "" || value === "ALL") next.delete(key);
    else next.set(key, value);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  React.useEffect(() => {
    const t = setTimeout(() => {
      if (localQ === q) return;
      updateParam("q", localQ || null);
    }, 350);
    return () => clearTimeout(t);
  }, [localQ, q]);

  function resetAll() {
    router.replace(pathname, { scroll: false });
    setLocalQ("");
  }

  const activeFilterCount =
    (q ? 1 : 0) + (cat !== "ALL" ? 1 : 0) + (sub !== "ALL" ? 1 : 0) + (color ? 1 : 0) + (size ? 1 : 0) + (badge !== "ALL" ? 1 : 0) + (onSale ? 1 : 0) + (sort !== "popular" ? 1 : 0);

  const activeCat = categories.find((c) => c.slug === cat);

  return (
    <div className="sticky top-[6.25rem] md:top-[7.25rem] z-30 glass border-b border-border">
      <div className="container-premium py-3">
        {/* Top row: search + sort + filter button */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="search" value={localQ} onChange={(e) => setLocalQ(e.target.value)}
              placeholder="Cari produk…" aria-label="Cari produk"
              className="w-full h-10 pl-10 pr-9 rounded-full bg-white border border-border focus:border-[#dc2626]/40 outline-none text-sm" />
            {localQ && (
              <button onClick={() => setLocalQ("")} aria-label="Hapus pencarian"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-secondary text-muted-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <select value={sort} onChange={(e) => updateParam("sort", e.target.value)}
            className="hidden md:block h-10 px-4 pr-9 rounded-full bg-white border border-border text-sm font-medium outline-none cursor-pointer appearance-none">
            {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <button onClick={() => setDrawerOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 h-10 px-4 rounded-full bg-white border border-border text-sm font-medium">
            <SlidersHorizontal className="h-4 w-4" /> Filter
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-[#dc2626] text-white text-[10px] font-bold">{activeFilterCount}</span>
            )}
          </button>
        </div>

        {/* Desktop category pills */}
        <div className="hidden lg:flex items-center gap-2 mt-3 flex-wrap">
          <Pill active={cat === "ALL"} onClick={() => { updateParam("cat", null); updateParam("sub", null); }}>Semua</Pill>
          {categories.map((c) => (
            <Pill key={c.id} active={cat === c.slug} onClick={() => { updateParam("cat", c.slug); updateParam("sub", null); }}>{c.name}</Pill>
          ))}
          <div className="ml-auto flex items-center gap-3">
            <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={onSale} onChange={(e) => updateParam("sale", e.target.checked ? "1" : null)} className="h-4 w-4 rounded border-border accent-[#dc2626]" />
              Hanya sale
            </label>
            <span className="text-sm text-muted-foreground">{resultCount} produk</span>
          </div>
        </div>

        {/* Desktop sub-color-size-badge filters */}
        <div className="hidden lg:flex items-center gap-4 mt-3 flex-wrap text-sm">
          {activeCat && activeCat.subcategories.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-muted-foreground text-xs">Sub:</span>
              <PillSmall active={sub === "ALL"} onClick={() => updateParam("sub", null)}>Semua</PillSmall>
              {activeCat.subcategories.map((s) => (
                <PillSmall key={s.id} active={sub === s.slug} onClick={() => updateParam("sub", s.slug)}>{s.name}</PillSmall>
              ))}
            </div>
          )}
        </div>
        <div className="hidden lg:flex items-center gap-4 mt-2 flex-wrap text-sm">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-muted-foreground text-xs">Warna:</span>
            <PillSmall active={!color} onClick={() => updateParam("color", null)}>Semua</PillSmall>
            {allColors.map((c) => (
              <PillSmall key={c} active={color === c} onClick={() => updateParam("color", color === c ? null : c)}>{c}</PillSmall>
            ))}
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-4 mt-2 flex-wrap text-sm">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-muted-foreground text-xs">Ukuran:</span>
            <PillSmall active={!size} onClick={() => updateParam("size", null)}>Semua</PillSmall>
            {allSizes.map((s) => (
              <PillSmall key={s} active={size === s} onClick={() => updateParam("size", size === s ? null : s)}>{s}</PillSmall>
            ))}
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-4 mt-2 flex-wrap text-sm">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-muted-foreground text-xs">Badge:</span>
            <PillSmall active={badge === "ALL"} onClick={() => updateParam("badge", null)}>Semua</PillSmall>
            {allBadges.map((b) => (
              <PillSmall key={b.value} active={badge === b.value} onClick={() => updateParam("badge", badge === b.value ? null : b.value)}>{b.label}</PillSmall>
            ))}
          </div>
          {activeFilterCount > 0 && (
            <button onClick={resetAll} className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-[#dc2626] hover:underline">
              <X className="h-3 w-3" /> Reset ({activeFilterCount})
            </button>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-[88%] max-w-sm bg-[#FAF7F2] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border bg-white">
              <h2 className="font-semibold">Filter</h2>
              <button onClick={() => setDrawerOpen(false)} className="p-2 rounded-full hover:bg-secondary"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">Urutkan</p>
                <div className="space-y-1">
                  {sortOptions.map((o) => (
                    <button key={o.value} onClick={() => updateParam("sort", o.value === "popular" ? null : o.value)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white text-left text-sm">
                      {o.label}{sort === o.value && <Check className="h-4 w-4 text-[#dc2626]" />}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">Kategori</p>
                <div className="space-y-1">
                  <button onClick={() => { updateParam("cat", null); updateParam("sub", null); }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white text-left text-sm">
                    Semua{cat === "ALL" && <Check className="h-4 w-4 text-[#dc2626]" />}
                  </button>
                  {categories.map((c) => (
                    <button key={c.id} onClick={() => { updateParam("cat", c.slug); updateParam("sub", null); }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white text-left text-sm">
                      {c.name}{cat === c.slug && <Check className="h-4 w-4 text-[#dc2626]" />}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">Warna</p>
                <div className="grid grid-cols-2 gap-1.5">
                  <button onClick={() => updateParam("color", null)} className={cn("px-3 py-2 rounded-lg text-sm text-left", !color ? "bg-[#1A1A1A] text-white" : "bg-white")}>Semua</button>
                  {allColors.map((c) => (
                    <button key={c} onClick={() => updateParam("color", color === c ? null : c)} className={cn("px-3 py-2 rounded-lg text-sm text-left", color === c ? "bg-[#1A1A1A] text-white" : "bg-white")}>{c}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">Ukuran</p>
                <div className="grid grid-cols-3 gap-1.5">
                  <button onClick={() => updateParam("size", null)} className={cn("px-3 py-2 rounded-lg text-sm", !size ? "bg-[#1A1A1A] text-white" : "bg-white")}>Semua</button>
                  {allSizes.map((s) => (
                    <button key={s} onClick={() => updateParam("size", size === s ? null : s)} className={cn("px-3 py-2 rounded-lg text-sm", size === s ? "bg-[#1A1A1A] text-white" : "bg-white")}>{s}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">Badge</p>
                <div className="grid grid-cols-2 gap-1.5">
                  <button onClick={() => updateParam("badge", null)} className={cn("px-3 py-2 rounded-lg text-sm", badge === "ALL" ? "bg-[#1A1A1A] text-white" : "bg-white")}>Semua</button>
                  {allBadges.map((b) => (
                    <button key={b.value} onClick={() => updateParam("badge", badge === b.value ? null : b.value)} className={cn("px-3 py-2 rounded-lg text-sm", badge === b.value ? "bg-[#1A1A1A] text-white" : "bg-white")}>{b.label}</button>
                  ))}
                </div>
              </div>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm">Hanya sale</span>
                <input type="checkbox" checked={onSale} onChange={(e) => updateParam("sale", e.target.checked ? "1" : null)} className="h-5 w-5 rounded border-border accent-[#dc2626]" />
              </label>
            </div>
            <div className="p-4 border-t border-border bg-white flex gap-3">
              <button onClick={resetAll} className="flex-1 h-12 rounded-full border border-border font-semibold text-sm">Reset</button>
              <button onClick={() => setDrawerOpen(false)} className="flex-1 h-12 rounded-full bg-[#dc2626] text-white font-semibold text-sm">Tampilkan {resultCount} produk</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={cn("inline-flex items-center h-9 px-4 rounded-full text-sm font-medium transition-colors",
        active ? "bg-[#1A1A1A] text-white" : "bg-white border border-border hover:bg-secondary")}>
      {children}
    </button>
  );
}
function PillSmall({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={cn("inline-flex items-center h-7 px-2.5 rounded-full text-xs font-medium transition-colors",
        active ? "bg-[#1A1A1A] text-white" : "bg-white border border-border hover:bg-secondary")}>
      {children}
    </button>
  );
}
