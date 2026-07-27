"use client";
// Buy buttons — Shopee, TikTok Shop, Lazada, WhatsApp. Reads URLs from product.
import { ShoppingBag, Music2, Package, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

type Variant = "grid" | "detail" | "compact";

interface BuyButtonsProps {
  product: Pick<Product, "shopeeUrl" | "tiktokUrl" | "lazadaUrl" | "whatsappUrl" | "name">;
  variant?: Variant;
  className?: string;
}

const channels = [
  { key: "shopeeUrl" as const, label: "Shopee", short: "Shopee", icon: ShoppingBag, color: "bg-[#EE4D2D] text-white hover:bg-[#d93e1f]" },
  { key: "tiktokUrl" as const, label: "TikTok Shop", short: "TikTok", icon: Music2, color: "bg-[#000000] text-white hover:bg-[#222] dark:bg-white dark:text-black dark:hover:bg-gray-200" },
  { key: "lazadaUrl" as const, label: "Lazada", short: "Lazada", icon: Package, color: "bg-[#0F146D] text-white hover:bg-[#1A2080]" },
  { key: "whatsappUrl" as const, label: "WhatsApp", short: "WhatsApp", icon: MessageCircle, color: "bg-[#25D366] text-white hover:bg-[#20B954]" },
];

export function BuyButtons({ product, variant = "grid", className }: BuyButtonsProps) {
  if (variant === "compact") {
    return (
      <div className={cn("flex flex-wrap gap-2", className)}>
        {channels.map((c) => {
          const url = product[c.key];
          if (!url) return null;
          const Icon = c.icon;
          return (
            <a
              key={c.key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn("inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-semibold transition-colors", c.color)}
            >
              <Icon className="h-3 w-3" />
              {c.short}
            </a>
          );
        })}
      </div>
    );
  }

  if (variant === "grid") {
    return (
      <div className={cn("flex flex-wrap gap-1.5", className)}>
        {channels.map((c) => {
          const url = product[c.key];
          if (!url) return null;
          const Icon = c.icon;
          return (
            <a
              key={c.key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Beli ${product.name} di ${c.label}`}
              className={cn("inline-flex items-center justify-center h-8 w-8 rounded-full transition-all hover:scale-110", c.color)}
            >
              <Icon className="h-3.5 w-3.5" />
            </a>
          );
        })}
      </div>
    );
  }

  // detail variant — full-width buttons
  return (
    <div className={cn("grid grid-cols-2 gap-2.5", className)}>
      {channels.map((c) => {
        const url = product[c.key];
        if (!url) return null;
        const Icon = c.icon;
        return (
          <a
            key={c.key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn("inline-flex items-center justify-center gap-2 h-12 px-4 rounded-xl text-sm font-semibold transition-colors", c.color)}
          >
            <Icon className="h-4 w-4" />
            {c.label}
          </a>
        );
      })}
    </div>
  );
}
