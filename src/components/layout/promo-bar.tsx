"use client";
// PromoBar — marquee announcement bar at the very top of the page.
import { Flame, Star, Truck } from "lucide-react";

const messages = [
  { icon: Flame, text: "Diskon spesial hari ini — langsung checkout di Shopee & Tokopedia" },
  { icon: Star, text: "Star+ Seller · 27.5K+ Followers · 100% Original" },
  { icon: Truck, text: "Gratis ongkir syarat & ketentuan berlaku di marketplace" },
];

export function PromoBar() {
  // Duplicate messages for seamless marquee loop
  const allMessages = [...messages, ...messages, ...messages, ...messages];
  return (
    <div className="fixed top-0 left-0 w-full z-[60] bg-[#1A1A1A] text-white h-9 flex items-center overflow-hidden">
      <div className="flex items-center whitespace-nowrap animate-marquee">
        {allMessages.map((msg, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-semibold tracking-wide mx-6"
          >
            <msg.icon className="h-3.5 w-3.5 text-[#dc2626]" />
            {msg.text}
          </span>
        ))}
      </div>
    </div>
  );
}
