"use client";

// REDBOX site header — premium navbar with logo, nav, search, theme toggle,
// mobile drawer. Glass effect on scroll.
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Search, Moon, Sun, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { getAllCategoriesSync, searchSuggestionsSync } from "@/lib/catalog";
import { useMounted } from "@/hooks/use-mounted";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/lookbook", label: "Lookbook" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [megaOpen, setMegaOpen] = React.useState(false);
  const mounted = useMounted();
  const { theme, setTheme } = useTheme();
  const categories = getAllCategoriesSync();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    setMobileOpen(false); setSearchOpen(false); setMegaOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-background focus:text-foreground focus:px-4 focus:py-2 focus:rounded-lg focus:border focus:border-border"
      >
        Skip to content
      </a>

      <header
        className={cn(
          "fixed top-9 left-0 w-full z-50 transition-all duration-500",
          scrolled ? "glass border-b border-border shadow-sm" : "bg-transparent",
        )}
      >
        <div className="container-premium">
          <div className="flex h-16 md:h-20 items-center justify-between gap-4">
            {/* Left: mobile menu + logo */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 -ml-2 rounded-full hover:bg-secondary"
                aria-label="Buka menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <Link href="/" className="group flex items-center gap-2.5" aria-label="REDBOX beranda">
                {/* Official logo — red rounded square with "Red Box" wordmark */}
                <div className="relative h-10 w-10 md:h-11 md:w-11 shrink-0 rounded-xl overflow-hidden">
                  <Image
                    src="/assets/brand/logo-header.png"
                    alt="REDBOX Official"
                    fill
                    sizes="44px"
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-display text-lg md:text-xl font-extrabold tracking-tight">REDBOX</span>
                  <span className="text-[9px] md:text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground mt-0.5 hidden sm:block">
                    Bandung · Since 2021
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: nav */}
            <nav className="hidden lg:flex items-center gap-0.5" aria-label="Primary">
              {navLinks.map((link) => {
                if (link.label === "Shop") {
                  return (
                    <div
                      key={link.href}
                      className="relative"
                      onMouseEnter={() => setMegaOpen(true)}
                      onMouseLeave={() => setMegaOpen(false)}
                    >
                      <Link
                        href={link.href}
                        className={cn(
                          "relative px-3.5 py-2 text-sm font-medium tracking-wide transition-colors inline-flex items-center gap-1",
                          isActive(link.href) ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {link.label}
                        <ChevronDown className={cn("h-3 w-3 transition-transform", megaOpen && "rotate-180")} />
                        {isActive(link.href) && (
                          <motion.span
                            layoutId="nav-active"
                            className="absolute inset-x-3 -bottom-px h-0.5 bg-[#dc2626]"
                            transition={{ type: "spring", stiffness: 350, damping: 30 }}
                          />
                        )}
                      </Link>
                      <AnimatePresence>
                        {megaOpen && categories.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[560px]"
                          >
                            <div className="rounded-2xl border border-border bg-popover shadow-premium p-3">
                              <div className="grid grid-cols-2 gap-1.5">
                                {categories.map((c) => (
                                  <Link
                                    key={c.id}
                                    href={`/category/${c.slug}`}
                                    className="group flex items-center gap-3 rounded-lg p-2.5 hover:bg-secondary transition-colors"
                                  >
                                    <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-secondary shrink-0">
                                      {c.image && (
                                        <Image src={c.image} alt={c.name} fill sizes="48px" className="object-cover" />
                                      )}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-sm font-semibold truncate">{c.name}</p>
                                      <p className="text-xs text-muted-foreground line-clamp-1">{c.tagline}</p>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                              <Link
                                href="/category"
                                className="mt-2 block text-center text-xs font-semibold uppercase tracking-widest hover:text-[#dc2626] py-2"
                              >
                                Lihat semua kategori →
                              </Link>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative px-3.5 py-2 text-sm font-medium tracking-wide transition-colors",
                      active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-x-3 -bottom-px h-0.5 bg-[#dc2626]"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: actions */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSearchOpen((s) => !s)}
                className="p-2 rounded-full hover:bg-secondary"
                aria-label="Cari produk"
              >
                <Search className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full hover:bg-secondary"
                aria-label="Ganti tema"
              >
                {mounted ? (
                  theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />
                ) : <Moon className="h-5 w-5 opacity-0" />}
              </button>
              <Link
                href="/shop"
                className="ml-1 inline-flex items-center gap-2 h-10 px-5 rounded-full bg-foreground text-background text-sm font-semibold hover:bg-[#dc2626] transition-colors"
              >
                Shop Now
              </Link>
            </div>
          </div>

          {/* Search bar */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pb-4">
                  <SearchBox onClose={() => setSearchOpen(false)} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 360, damping: 36 }}
              className="fixed inset-y-0 left-0 z-50 w-[88%] max-w-sm bg-background lg:hidden flex flex-col"
              role="dialog"
              aria-modal="true"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <Link href="/" className="flex items-center gap-2.5">
                  <div className="relative h-10 w-10 rounded-xl overflow-hidden">
                    <Image
                      src="/assets/brand/logo-mobile.png"
                      alt="REDBOX"
                      fill
                      sizes="40px"
                      className="object-contain"
                    />
                  </div>
                  <span className="font-display text-lg font-extrabold tracking-tight">REDBOX</span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-full hover:bg-secondary"
                  aria-label="Tutup menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4 border-b border-border">
                <SearchBox onClose={() => setMobileOpen(false)} />
              </div>
              <nav className="flex-1 overflow-y-auto p-2" aria-label="Mobile primary">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "block px-4 py-3 rounded-xl text-base font-medium",
                      isActive(link.href)
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="p-4 border-t border-border">
                <Link
                  href="/shop"
                  className="flex items-center justify-center gap-2 h-12 w-full rounded-full bg-foreground text-background font-semibold"
                >
                  Shop Now
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function SearchBox({ onClose }: { onClose: () => void }) {
  const [q, setQ] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const suggestions = React.useMemo(() => {
    if (!q.trim()) return [];
    return searchSuggestionsSync(q, 6);
  }, [q]);

  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function submit(query: string) {
    const finalQ = query.trim();
    onClose();
    if (finalQ) {
      window.location.href = `/shop?q=${encodeURIComponent(finalQ)}`;
    } else {
      window.location.href = "/shop";
    }
  }

  return (
    <div ref={ref} className="relative">
      <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type="search"
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => { if (e.key === "Enter") submit(q); }}
        placeholder="Cari produk, kategori…"
        aria-label="Cari di REDBOX"
        className="w-full h-11 pl-11 pr-10 rounded-full bg-secondary border border-transparent focus:border-foreground/15 focus:bg-background transition-colors text-sm placeholder:text-muted-foreground outline-none"
      />
      {q && (
        <button
          onClick={() => setQ("")}
          aria-label="Hapus pencarian"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-foreground/5 text-muted-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
      {open && suggestions.length > 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl border border-border bg-popover shadow-premium overflow-hidden p-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => submit(s)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary text-left text-sm"
            >
              <Search className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 truncate">{s}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
