"use client";
// Product gallery — thumbnails + main image viewer.
import * as React from "react";
import Image from "next/image";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [idx, setIdx] = React.useState(0);
  if (images.length === 0) {
    return <div className="aspect-[4/5] rounded-2xl bg-secondary" />;
  }
  return (
    <div className="lg:sticky lg:top-24">
      <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr] gap-3">
        <div className="order-2 lg:order-1 flex lg:flex-col gap-2 overflow-x-auto no-scrollbar lg:max-h-[640px] lg:overflow-y-auto">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Lihat foto ${i + 1}`}
              aria-current={i === idx}
              className={`relative shrink-0 w-16 h-20 lg:w-full lg:h-24 rounded-lg overflow-hidden border-2 transition-colors bg-secondary ${
                i === idx ? "border-foreground" : "border-transparent hover:border-border"
              }`}
            >
              <Image src={src} alt={`${alt} thumbnail ${i + 1}`} fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
        <div className="order-1 lg:order-2 relative aspect-[4/5] rounded-2xl overflow-hidden bg-secondary">
          <Image src={images[idx]} alt={`${alt} — foto ${idx + 1}`} fill sizes="(max-width: 1024px) 100vw, 60vw" priority className="object-cover" />
          <span className="absolute bottom-3 right-3 inline-flex items-center h-7 px-2.5 rounded-full bg-black/60 text-white text-xs font-semibold tabular-nums">
            {idx + 1} / {images.length}
          </span>
        </div>
      </div>
    </div>
  );
}
