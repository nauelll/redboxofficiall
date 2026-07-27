// Generate premium SVG placeholders for REDBOX.
// Products: p1-p10 (3 angles each) + categories (7) + banners (hero + promo) + blog covers + favicon + og-image.
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const PUBLIC = path.resolve("/home/z/my-project/public/assets");
const dirs = ["products", "categories", "banners", "blog", "brand"];
for (const d of dirs) mkdirSync(path.join(PUBLIC, d), { recursive: true });

const RED = "#E60012";
const BLACK = "#0a0a0a";
const WHITE = "#ffffff";
const GRAY = "#f5f5f5";

function svg(content: string, w = 1200, h = 1500): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${GRAY}"/>
      <stop offset="1" stop-color="#e8e8e8"/>
    </linearGradient>
  </defs>
  ${content}
</svg>`;
}

// --- Product images (3 angles for first 2 products, 1 for rest) ---
const productConfigs = [
  { id: "p1", color: BLACK, accent: RED, name: "Basic Tee" },
  { id: "p2", color: WHITE, accent: BLACK, name: "Graphic Tee" },
  { id: "p3", color: BLACK, accent: RED, name: "Oversize Tee" },
  { id: "p4", color: "#1a2b4a", accent: WHITE, name: "Polo Navy" },
  { id: "p5", color: RED, accent: BLACK, name: "Flanel Merah" },
  { id: "p6", color: "#efe6d2", accent: "#2d4030", name: "Koko Cream" },
  { id: "p7", color: "#5c5c42", accent: BLACK, name: "Cargo Army" },
  { id: "p8", color: "#6b6b6b", accent: BLACK, name: "Hoodie Gray" },
  { id: "p9", color: BLACK, accent: RED, name: "Windbreaker" },
  { id: "p10", color: RED, accent: WHITE, name: "Parfum" },
];

function productSvg(cfg: typeof productConfigs[0], angle: 1 | 2 | 3 = 1): string {
  const transform = angle === 1 ? "" : angle === 2 ? `transform="translate(60 60) scale(0.92)"` : `transform="translate(-30 -30) scale(1.05)"`;
  return svg(`
    <rect width="1200" height="1500" fill="url(#bg)"/>
    <text x="80" y="120" font-family="Poppins, Inter, sans-serif" font-size="14" letter-spacing="6" fill="#0a0a0a" font-weight="600">REDBOX</text>
    <line x1="80" y1="140" x2="200" y2="140" stroke="#0a0a0a" stroke-width="1"/>
    <g ${transform}>
      <!-- T-shirt silhouette -->
      <path d="M 450 400 L 540 340 L 580 380 L 620 380 L 660 340 L 750 400 L 800 540 L 740 560 L 740 1050 L 460 1050 L 460 560 L 400 540 Z"
            fill="${cfg.color}" stroke="rgba(0,0,0,0.15)" stroke-width="2"/>
      <path d="M 540 340 Q 600 380 660 340" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="2"/>
      <circle cx="600" cy="500" r="6" fill="${cfg.accent}" opacity="0.8"/>
      <circle cx="600" cy="600" r="6" fill="${cfg.accent}" opacity="0.8"/>
    </g>
    <text x="600" y="1400" font-family="Poppins, Inter, sans-serif" font-size="20" letter-spacing="3" fill="#0a0a0a" text-anchor="middle" font-weight="700">${cfg.name.toUpperCase()}</text>
  `);
}

// First 2 products get 3 angles
for (const cfg of productConfigs) {
  if (cfg.id === "p1" || cfg.id === "p2") {
    writeFileSync(path.join(PUBLIC, "products", `${cfg.id}.svg`), productSvg(cfg, 1));
    writeFileSync(path.join(PUBLIC, "products", `${cfg.id}-2.svg`), productSvg(cfg, 2));
    writeFileSync(path.join(PUBLIC, "products", `${cfg.id}-3.svg`), productSvg(cfg, 3));
  } else {
    writeFileSync(path.join(PUBLIC, "products", `${cfg.id}.svg`), productSvg(cfg, 1));
  }
}
console.log(`✓ ${productConfigs.length} product images`);

// --- Categories (7) ---
const catConfigs = [
  { slug: "kaos-anak", name: "Kaos Anak", color: BLACK },
  { slug: "kaos-polo", name: "Kaos Polo", color: "#1a2b4a" },
  { slug: "kemeja", name: "Kemeja", color: RED },
  { slug: "muslim-wear", name: "Muslim Wear", color: "#efe6d2" },
  { slug: "celana", name: "Celana", color: "#5c5c42" },
  { slug: "outerwear", name: "Outerwear", color: "#6b6b6b" },
  { slug: "parfume", name: "Parfume", color: RED },
];

for (const c of catConfigs) {
  const content = `
    <rect width="1000" height="1200" fill="url(#bg)"/>
    <text x="80" y="100" font-family="Poppins, sans-serif" font-size="14" letter-spacing="6" fill="#0a0a0a" font-weight="600">REDBOX</text>
    <g transform="translate(180 220) scale(0.7)">
      <path d="M 450 400 L 540 340 L 580 380 L 620 380 L 660 340 L 750 400 L 800 540 L 740 560 L 740 1050 L 460 1050 L 460 560 L 400 540 Z"
            fill="${c.color}" stroke="rgba(0,0,0,0.15)" stroke-width="2"/>
    </g>
    <text x="500" y="1100" font-family="Poppins, sans-serif" font-size="48" letter-spacing="-1" fill="#0a0a0a" text-anchor="middle" font-weight="800">${c.name}</text>
  `;
  writeFileSync(path.join(PUBLIC, "categories", `${c.slug}.svg`), svg(content, 1000, 1200));
}
console.log(`✓ ${catConfigs.length} category tiles`);

// --- Hero banners ---
function heroBanner(title: string, subtitle: string, dark = true): string {
  const w = 1600, h = 1000;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${dark ? '#1a1a1a' : GRAY}"/>
      <stop offset="1" stop-color="${dark ? '#0a0a0a' : '#e0e0e0'}"/>
    </linearGradient>
    <radialGradient id="accent" cx="0.8" cy="0.3" r="0.5">
      <stop offset="0" stop-color="${RED}" stop-opacity="0.3"/>
      <stop offset="1" stop-color="${RED}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect width="${w}" height="${h}" fill="url(#accent)"/>
  <polygon points="1000,0 ${w},0 ${w},${h*0.5} ${w*0.7},${h*0.6}" fill="${RED}" opacity="0.85"/>
  <text x="80" y="80" font-family="Poppins, sans-serif" font-size="14" letter-spacing="6" fill="white" font-weight="600">REDBOX · BANDUNG</text>
  <text x="80" y="${h*0.5}" font-family="Poppins, sans-serif" font-size="80" font-weight="800" fill="white" letter-spacing="-2">${title}</text>
  <text x="80" y="${h*0.5 + 60}" font-family="Inter, sans-serif" font-size="24" font-weight="400" fill="white" opacity="0.8">${subtitle}</text>
</svg>`;
}

function heroBannerMobile(title: string, subtitle: string, dark = true): string {
  const w = 1000, h = 1400;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="bgm" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${dark ? '#1a1a1a' : GRAY}"/>
      <stop offset="1" stop-color="${dark ? '#0a0a0a' : '#e0e0e0'}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bgm)"/>
  <polygon points="600,0 ${w},0 ${w},${h*0.5} ${w*0.6},${h*0.6}" fill="${RED}" opacity="0.7"/>
  <text x="60" y="80" font-family="Poppins, sans-serif" font-size="12" letter-spacing="5" fill="white" font-weight="600">REDBOX</text>
  <text x="60" y="${h*0.55}" font-family="Poppins, sans-serif" font-size="64" font-weight="800" fill="white" letter-spacing="-2">${title}</text>
  <text x="60" y="${h*0.55 + 50}" font-family="Inter, sans-serif" font-size="20" fill="white" opacity="0.8">${subtitle}</text>
</svg>`;
}

writeFileSync(path.join(PUBLIC, "banners", "hero-1.svg"), heroBanner("Style For The Next", "Premium teen fashion dari Bandung. Untuk usia 9–17 tahun."));
writeFileSync(path.join(PUBLIC, "banners", "hero-1-mobile.svg"), heroBannerMobile("Style For The Next", "Premium teen fashion dari Bandung."));
writeFileSync(path.join(PUBLIC, "banners", "hero-2.svg"), heroBanner("New Collection 2026", "Drop terbaru dengan desain streetwear modern."));
writeFileSync(path.join(PUBLIC, "banners", "hero-2-mobile.svg"), heroBannerMobile("New Collection", "Drop terbaru 2026."));
writeFileSync(path.join(PUBLIC, "banners", "promo-1.svg"), heroBanner("Flash Sale", "Diskon hingga 30% — terbatas!"));
console.log("✓ 5 banner SVGs");

// --- Blog covers (3) ---
const blogConfigs = [
  { id: "post-1", color: BLACK, title: "Tips Memilih Kaos" },
  { id: "post-2", color: "#1a2b4a", title: "Mix & Match Outfit" },
  { id: "post-3", color: RED, title: "Tren Fashion 2026" },
];

for (const b of blogConfigs) {
  const content = `
    <rect width="1200" height="800" fill="${b.color}"/>
    <text x="80" y="100" font-family="Poppins, sans-serif" font-size="14" letter-spacing="6" fill="white" font-weight="600">REDBOX BLOG</text>
    <text x="80" y="450" font-family="Poppins, sans-serif" font-size="64" font-weight="800" fill="white" letter-spacing="-2">${b.title}</text>
    <rect x="80" y="480" width="120" height="4" fill="${RED}"/>
  `;
  writeFileSync(path.join(PUBLIC, "blog", `${b.id}.svg`), svg(content, 1200, 800));
}
console.log("✓ 3 blog covers");

// --- Favicon + OG image ---
writeFileSync(path.resolve("/home/z/my-project/public/favicon.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
    <rect width="64" height="64" rx="14" fill="${RED}"/>
    <text x="32" y="42" font-family="Poppins, sans-serif" font-size="28" font-weight="800" fill="white" text-anchor="middle" letter-spacing="-1">RB</text>
  </svg>`);

writeFileSync(path.join(PUBLIC, "brand", "og-image.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
    <defs>
      <linearGradient id="ogbg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#1a1a1a"/>
        <stop offset="1" stop-color="#0a0a0a"/>
      </linearGradient>
      <radialGradient id="ogr" cx="0.85" cy="0.3" r="0.6">
        <stop offset="0" stop-color="${RED}" stop-opacity="0.35"/>
        <stop offset="1" stop-color="${RED}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#ogbg)"/>
    <rect width="1200" height="630" fill="url(#ogr)"/>
    <polygon points="700,0 1200,0 1200,300 900,400" fill="${RED}" opacity="0.85"/>
    <text x="80" y="80" font-family="Poppins, sans-serif" font-size="13" letter-spacing="6" fill="white" font-weight="600">REDBOX · PREMIUM TEEN FASHION</text>
    <text x="80" y="280" font-family="Poppins, sans-serif" font-size="120" font-weight="800" fill="white" letter-spacing="-4">REDBOX</text>
    <rect x="80" y="300" width="120" height="4" fill="${RED}"/>
    <text x="80" y="380" font-family="Inter, sans-serif" font-size="32" fill="white" opacity="0.85">Style For The Next Generation</text>
    <text x="80" y="540" font-family="Inter, sans-serif" font-size="14" letter-spacing="3" fill="white" opacity="0.5">SHOPEE · TIKTOK SHOP · LAZADA · WHATSAPP</text>
  </svg>`);

// Manifest
writeFileSync(path.resolve("/home/z/my-project/public/manifest.json"),
  JSON.stringify({
    name: "REDBOX Official",
    short_name: "REDBOX",
    description: "Premium teen fashion brand dari Bandung",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#E60012",
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
    categories: ["shopping", "lifestyle", "fashion"],
  }, null, 2));

// Placeholder for missing product images
writeFileSync(path.resolve("/home/z/my-project/public/assets/placeholder.svg"),
  svg(`<rect width="1200" height="1500" fill="url(#bg)"/><text x="600" y="750" font-family="Poppins, sans-serif" font-size="48" fill="#6b6b6b" text-anchor="middle" font-weight="600">REDBOX</text>`));

console.log("✓ favicon, og-image, manifest, placeholder");
console.log("\n✅ All SVG assets generated.");
