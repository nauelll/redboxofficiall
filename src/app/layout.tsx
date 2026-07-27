// REDBOX Official Website — root layout.
// Fonts: Poppins (display) + Inter (body) + Geist Mono (mono).
// Theme: light/dark via next-themes (default light, premium feel).
import type { Metadata, Viewport } from "next";
import { Poppins, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { PromoBar } from "@/components/layout/promo-bar";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { BackToTop } from "@/components/shared/back-to-top";
import { FloatingWhatsApp } from "@/components/shared/floating-whatsapp";
import { getSettingsSync } from "@/lib/catalog";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const SITE_URL = "https://redbox-official.com";
const settings = getSettingsSync();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "REDBOX — Premium Teen Fashion Brand dari Bandung",
    template: "%s | REDBOX Official",
  },
  description: settings.seo.defaultDescription,
  keywords: [
    "REDBOX", "brand fashion remaja", "baju anak laki-laki", "pakaian remaja",
    "kaos anak", "polo anak", "kemeja anak", "muslim wear anak", "celana anak",
    "outerwear anak", "parfum anak", "fashion Bandung", "brand fashion Indonesia",
  ],
  authors: [{ name: "REDBOX" }],
  creator: "REDBOX",
  publisher: "REDBOX",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: "REDBOX Official",
    title: "REDBOX — Premium Teen Fashion Brand dari Bandung",
    description: settings.seo.defaultDescription,
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "REDBOX Official" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "REDBOX — Premium Teen Fashion Brand dari Bandung",
    description: settings.seo.defaultDescription,
    images: ["/og-image.svg"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png", sizes: "64x64" },
    ],
    apple: "/favicon.png",
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "shopping",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "REDBOX",
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
  description: "REDBOX — brand fashion remaja asal Bandung, Indonesia. Premium quality, modern design.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bandung",
    addressCountry: "ID",
  },
  sameAs: [
    "https://shopee.co.id/redbox_officialstore",
    "https://www.tiktok.com/@redbox.official",
    "https://www.instagram.com/redbox.official",
    "https://www.facebook.com/share/1Fm7EDcktv/",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning className={`${poppins.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground min-h-screen flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <PromoBar />
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <BackToTop />
          <FloatingWhatsApp />
        </ThemeProvider>
        <Toaster position="bottom-center" richColors closeButton />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </body>
    </html>
  );
}
