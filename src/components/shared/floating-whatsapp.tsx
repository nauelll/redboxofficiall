"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/catalog";

export function FloatingWhatsApp() {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20REDBOX%2C%20saya%20ingin%20bertanya`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat dengan REDBOX di WhatsApp"
          initial={{ opacity: 0, scale: 0.6, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 30 }}
          transition={{ type: "spring", stiffness: 360, damping: 24 }}
          className="fixed z-30 bottom-6 right-6 lg:bottom-8 lg:right-8 inline-flex items-center justify-center h-14 w-14 lg:h-16 lg:w-16 rounded-full bg-[#25D366] text-white shadow-premium hover:scale-105 transition-transform"
        >
          <MessageCircle className="h-6 w-6 lg:h-7 lg:w-7" />
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30 -z-10" aria-hidden />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
