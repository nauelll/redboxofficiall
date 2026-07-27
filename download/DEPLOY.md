# REDBOX Official Website — Cara Deploy ke Vercel

## ⚠️ WAJIB: Set Environment Variable DATABASE_URL di Vercel

**Tanpa langkah ini, website akan error.** File `.env` tidak ikut ke GitHub (ada di `.gitignore` untuk keamanan).

### Cara Set Environment Variable:

1. Buka **https://vercel.com** → login
2. Klik project **redboxofficial** Anda
3. Klik tab **Settings**
4. Di sidebar kiri, klik **Environment Variables**
5. Klik **Add New** dan isi:

   ```
   Name:   DATABASE_URL
   Value:  postgresql://neondb_owner:npg_iDZJCl17KkNd@ep-muddy-boat-azxr6q0p.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```

6. Centang: ✅ Production, ✅ Preview, ✅ Development
7. Klik **Save**
8. Buka tab **Deployments** → klik ⋯ di deployment terbaru → **Redeploy**

---

## Quick Start (Lokal / Dev)

```bash
bun install
cp .env.example .env          # Copy env template
bun run db:push               # Buat tabel di Neon PostgreSQL
bun run scripts/seed.ts       # Seed: admin + 10 produk + 7 kategori + banner + blog + FAQ
bun run dev                   # Buka http://localhost:3000
```

**Login Admin:** http://localhost:3000/admin
- Username: `nfllmzqi`
- Password: `asd123`

---

## Deploy ke Vercel (Step by Step)

### 1. Push ke GitHub
```bash
git init
git add .
git commit -m "REDBOX Official Website"
git branch -M main
git remote add origin https://github.com/USERNAME/redboxofficial.git
git push -u origin main
```

### 2. Import ke Vercel
1. Buka https://vercel.com → login dengan GitHub
2. Klik **Add New Project**
3. Pilih repo `redboxofficial`
4. **JANGAN klik Deploy dulu** — klik **Settings** dulu
5. Set Environment Variable `DATABASE_URL` (lihat di atas)
6. Klik **Deploy**
7. Tunggu 2-3 menit

### 3. Verifikasi
- Buka `https://YOUR-DOMAIN.vercel.app/` → home load normal
- Buka `/admin` → redirect ke login
- Login dengan `nfllmzqi` / `asd123`
- Dashboard menampilkan 10 produk dari Neon PostgreSQL

---

## Admin Panel — Kelola Tanpa Edit Kode

Setelah login di `/admin`, Anda bisa:

| Menu | Fungsi |
|------|--------|
| **Dashboard** | Lihat semua produk, tambah/edit/hapus/duplikasi produk |
| **Kategori** | CRUD kategori + subkategori |
| **Banner** | CRUD banner hero + promo |
| **Blog** | CRUD artikel blog |
| **FAQ** | CRUD pertanyaan umum |
| **Pengaturan** | Edit URL Shopee/Tokopedia/Lazada/WhatsApp, social media, info brand |

**Semua perubahan langsung tampil di website — tanpa edit kode, tanpa redeploy.**

---

## Tech Stack
- Next.js 16 (App Router) + TypeScript
- Prisma 6 + Neon PostgreSQL
- Tailwind CSS 4 + shadcn/ui
- Framer Motion + Lucide icons
- Poppins (heading) + Inter (body)

© 2026 REDBOX Official Store. Made with ❤ in Bandung, Indonesia.
