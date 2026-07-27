// Product grid — wraps ProductCard.
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: Product[];
  priorityCount?: number;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function ProductGrid({ products, priorityCount = 4, columns = 4, className }: ProductGridProps) {
  const colsClass =
    columns === 2 ? "grid-cols-2"
    : columns === 3 ? "grid-cols-2 md:grid-cols-3"
    : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
  return (
    <div className={cn("grid gap-4 md:gap-6", colsClass, className)}>
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} index={i} priority={i < priorityCount} />
      ))}
    </div>
  );
}
