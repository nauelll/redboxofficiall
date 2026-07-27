"use client";
// Premium product card — clean layout with marketplace buy buttons.
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatIDR } from "@/lib/catalog";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  index?: number;
  className?: string;
}

const badgeStyles: Record<string, string> = {
  NEW_ARRIVAL: "bg-[#dc2626] text-white",
  BEST_SELLER: "bg-[#1A1A1A] text-white",
  TRENDING: "bg-amber-500 text-white",
  LIMITED_EDITION: "bg-purple-600 text-white",
  SALE: "bg-[#dc2626] text-white",
};
const badgeLabels: Record<string, string> = {
  NEW_ARRIVAL: "Baru", BEST_SELLER: "Best Seller", TRENDING: "Trending",
  LIMITED_EDITION: "Limited", SALE: "Sale",
};

export function ProductCard({ product, priority, index = 0, className }: ProductCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.3), ease: [0.22, 1, 0.36, 1] }}
      className={cn("group", className)}
    >
      {/* Image container */}
      <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#1A1A1A]/5 shadow-sm">
        <Link href={`/product/${product.slug}`} aria-label={product.name} className="absolute inset-0 block">
          <Image
            src={product.images[0] || "/assets/placeholder.svg"}
            alt={product.altImage || `${product.name}`}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
            priority={priority}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        </Link>

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-2.5 left-2.5">
            <span className={cn("inline-flex items-center h-6 px-2.5 rounded-full text-[9px] font-bold tracking-widest uppercase shadow-sm", badgeStyles[product.badge] ?? "bg-[#1A1A1A] text-white")}>
              {badgeLabels[product.badge] ?? product.badge}
            </span>
          </div>
        )}

        {/* Marketplace buttons — always visible at bottom */}
        <div className="absolute inset-x-2 bottom-2">
          <div className="grid grid-cols-2 gap-1.5">
            {product.shopeeUrl && (
              <a href={product.shopeeUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center justify-center gap-1 h-8 rounded-lg bg-[#dc2626] text-white text-[10px] font-bold tracking-wide uppercase transition-all hover:scale-105 shadow-sm">
                Shopee <ArrowRight className="w-2.5 h-2.5" />
              </a>
            )}
            {product.tiktokUrl && (
              <a href={product.tiktokUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center justify-center gap-1 h-8 rounded-lg bg-[#1A1A1A] text-white text-[10px] font-bold tracking-wide uppercase transition-all hover:scale-105 shadow-sm">
                Tokopedia
              </a>
            )}
            {!product.tiktokUrl && product.whatsappUrl && (
              <a href={product.whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center justify-center gap-1 h-8 rounded-lg bg-[#25D366] text-white text-[10px] font-bold tracking-wide uppercase transition-all hover:scale-105 shadow-sm">
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <Link href={`/product/${product.slug}`} className="block mt-2.5 px-0.5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] font-medium uppercase tracking-widest text-[#8A8A8A]">
            {product.categoryName ?? "REDBOX"}
          </p>
          <span className="inline-flex items-center gap-0.5 text-[11px] text-[#8A8A8A]">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {product.rating.toFixed(1)}
          </span>
        </div>
        <h3 className="mt-0.5 font-display text-sm md:text-base font-bold leading-snug line-clamp-2 group-hover:text-[#dc2626] transition-colors">
          {product.name}
        </h3>
        {product.price && (
          <p className="mt-1 text-sm font-semibold tabular-nums text-[#1A1A1A]">
            {formatIDR(product.price)}
          </p>
        )}
        {product.colors.length > 0 && (
          <div className="mt-1 flex items-center gap-1">
            {product.colors.slice(0, 4).map((c) => (
              <div key={c.name} className="h-3 w-3 rounded-full border border-[#1A1A1A]/10" style={{ backgroundColor: c.hex }} title={c.name} />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[10px] text-[#8A8A8A] ml-0.5">+{product.colors.length - 4}</span>
            )}
          </div>
        )}
      </Link>
    </motion.article>
  );
}
