"use client";
// Home hero slider — interactive carousel. Receives banners as prop from server parent.
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import type { Banner } from "@/types";
import { cn } from "@/lib/utils";

export function HomeHeroSlider({ banners }: { banners: Banner[] }) {
  const slides = banners.length > 0 ? banners : [defaultBanner];
  const [idx, setIdx] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (paused || slides.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [paused, slides.length]);

  function next() { setIdx((i) => (i + 1) % slides.length); }
  function prev() { setIdx((i) => (i - 1 + slides.length) % slides.length); }

  const slide = slides[idx];
  const isDark = slide.overlay.startsWith("dark");
  const textColor = isDark ? "text-white" : "text-foreground";

  return (
    <section
      aria-labelledby="hero-title"
      className="relative -mt-16 md:-mt-20 pt-16 md:pt-20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container-premium pt-4 md:pt-8 pb-12 md:pb-20">
        <div className="relative aspect-[16/10] md:aspect-[16/7] lg:aspect-[16/6] rounded-2xl lg:rounded-3xl overflow-hidden bg-foreground">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={slide.imageMobile || slide.imageDesktop}
                alt={slide.title}
                fill
                priority
                sizes="100vw"
                className="object-cover md:hidden"
              />
              <Image
                src={slide.imageDesktop}
                alt={slide.title}
                fill
                priority
                sizes="100vw"
                className="object-cover hidden md:block"
              />
              <div className={cn(
                "absolute inset-0",
                slide.overlay === "dark-left" && "bg-gradient-to-r from-black/80 via-black/40 to-transparent",
                slide.overlay === "dark-right" && "bg-gradient-to-l from-black/80 via-black/40 to-transparent",
                slide.overlay === "dark-bottom" && "bg-gradient-to-t from-black/85 via-black/30 to-transparent",
                slide.overlay === "light-left" && "bg-gradient-to-r from-white/80 via-white/40 to-transparent",
                slide.overlay === "light-right" && "bg-gradient-to-l from-white/80 via-white/40 to-transparent",
                slide.overlay === "light-bottom" && "bg-gradient-to-t from-white/85 via-white/30 to-transparent",
              )} />
            </motion.div>
          </AnimatePresence>

          <div className={cn("relative z-10 flex flex-col justify-end md:justify-center p-6 md:p-12 lg:p-16 max-w-2xl", textColor)}>
            <motion.div
              key={`text-${slide.id}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className={cn(
                "inline-flex items-center gap-2 h-8 px-3.5 rounded-full mb-4 backdrop-blur-sm border",
                isDark ? "bg-white/10 border-white/20" : "bg-black/5 border-black/10",
              )}>
                <Sparkles className="h-3.5 w-3.5 text-[#dc2626]" />
                <span className="text-[11px] font-semibold tracking-[0.25em] uppercase">Premium Teen Fashion · Bandung</span>
              </div>
              <h1 id="hero-title" className="font-display text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[0.95] text-balance">
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="mt-3 md:mt-4 text-sm md:text-base lg:text-lg opacity-80 max-w-md leading-relaxed">{slide.subtitle}</p>
              )}
              {slide.ctaText && slide.ctaHref && (
                <div className="mt-5 md:mt-6 flex items-center gap-3 flex-wrap">
                  <Link href={slide.ctaHref} className={cn("group inline-flex items-center gap-2.5 h-12 md:h-13 px-6 md:px-7 py-3 rounded-full text-sm md:text-base font-semibold transition-all shadow-lg", isDark ? "bg-white text-black hover:scale-[1.02]" : "bg-foreground text-background hover:bg-[#dc2626]")}>
                    {slide.ctaText}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link href="/category" className={cn("group inline-flex items-center gap-2 h-12 md:h-13 px-5 md:px-6 py-3 rounded-full text-sm md:text-base font-semibold border-2 transition-colors", isDark ? "border-white/60 text-white hover:bg-white hover:text-black" : "border-foreground/60 text-foreground hover:bg-foreground hover:text-background")}>
                    Explore Collection
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </motion.div>
          </div>

          {slides.length > 1 && (
            <>
              <button type="button" onClick={prev} aria-label="Slide sebelumnya" className="absolute left-3 top-1/2 -translate-y-1/2 z-20 inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/40 transition-colors">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button type="button" onClick={next} aria-label="Slide berikutnya" className="absolute right-3 top-1/2 -translate-y-1/2 z-20 inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/40 transition-colors">
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                {slides.map((_, i) => (
                  <button key={i} onClick={() => setIdx(i)} aria-label={`Ke slide ${i + 1}`} className={cn("h-1.5 rounded-full transition-all", i === idx ? "w-6 bg-white" : "w-1.5 bg-white/50")} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Trust strip */}
      <div className="container-premium py-6 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center md:text-left">
          {[
            { label: "Bahan Premium", sub: "Katun combed, lacoste, linen" },
            { label: "Untuk Usia 9–17", sub: "Anak laki-laki & remaja" },
            { label: "Pengiriman Cepat", sub: "2–5 hari ke seluruh Indonesia" },
            { label: "Checkout Aman", sub: "Via marketplace resmi" },
          ].map((item) => (
            <div key={item.label} className="px-2 py-1">
              <p className="text-sm font-semibold">{item.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const defaultBanner: Banner = {
  id: "default",
  title: "Style For The Next Generation",
  subtitle: "Premium teen fashion brand asal Bandung, Indonesia.",
  ctaText: "Shop Now",
  ctaHref: "/shop",
  imageDesktop: "/assets/banners/hero-1.svg",
  imageMobile: "/assets/banners/hero-1-mobile.svg",
  placement: "hero",
  overlay: "dark-left",
  sortOrder: 0,
  startAt: null,
  endAt: null,
};
