// Generate optimised logo variants from the uploaded official logo PNG.
import sharp from "sharp";
import { writeFileSync } from "node:fs";

const SRC = "/home/z/my-project/upload/logo.png";
const BRAND_DIR = "/home/z/my-project/public/assets/brand";
const PUBLIC_DIR = "/home/z/my-project/public";

// 1) Favicon — 64x64 PNG
await sharp(SRC).resize(64, 64, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } }).png().toFile(`${PUBLIC_DIR}/favicon.png`);
console.log("✓ favicon.png (64x64)");

// 2) Header logo — 48x48 (landscape, used in navbar)
await sharp(SRC).resize(48, 48, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } }).png().toFile(`${BRAND_DIR}/logo-header.png`);
console.log("✓ logo-header.png (48x48)");

// 3) Footer logo — 56x56 (slightly bigger for dark footer)
await sharp(SRC).resize(56, 56, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(`${BRAND_DIR}/logo-footer.png`);
console.log("✓ logo-footer.png (56x56)");

// 4) Mobile drawer logo — 40x40
await sharp(SRC).resize(40, 40, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } }).png().toFile(`${BRAND_DIR}/logo-mobile.png`);
console.log("✓ logo-mobile.png (40x40)");

// 5) Login page logo — 64x64
await sharp(SRC).resize(64, 64, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } }).png().toFile(`${BRAND_DIR}/logo-login.png`);
console.log("✓ logo-login.png (64x64)");

console.log("\nAll logo variants generated.");
