# SIAKAD BK & Ortu

Sistem Informasi Akademik, Bimbingan Konseling (BK) & Pemantauan Orang Tua.
Responsif untuk **HP dan laptop** (sidebar di desktop, bottom-nav + bottom-sheet di HP).

**Stack:** Vite 8 · React 19 · TypeScript (strict) · Tailwind CSS 4 · lucide-react

## Menjalankan lokal

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # typecheck + build produksi ke /dist
npm run preview    # uji hasil build di http://localhost:4173
```

Butuh Node.js 20+ (disarankan 22, lihat `.nvmrc`).

## Deploy ke Vercel

**Cara 1 — lewat GitHub (disarankan)**
1. Push folder ini ke repository GitHub.
2. Di vercel.com → *Add New → Project* → pilih repo.
3. Framework otomatis terdeteksi **Vite**. Tidak ada environment variable yang dibutuhkan. Klik **Deploy**.

**Cara 2 — Vercel CLI**
```bash
npm i -g vercel
vercel          # preview
vercel --prod   # produksi
```

`vercel.json` sudah mengatur: SPA rewrite, cache aset immutable, dan header keamanan.

## Fitur per peran

| Peran | Menu |
|---|---|
| Guru BK | Ringkasan, Kasus (cari/filter/ubah status/WhatsApp), Siswa |
| Orang Tua | Ringkasan, Nilai, Catatan BK (catatan internal BK disembunyikan), cetak rapor, WA ke Guru BK |
| Siswa | Ringkasan, Nilai, Tugas, ganti foto (otomatis WebP), cetak rapor |
| Wali Kelas | Ringkasan, Siswa, Presensi, export CSV nilai/absensi, cetak rapor |
| Guru Mapel | Nilai (hitung otomatis 30/35/35), Tugas siswa |
| Admin | Role, Siswa (tambah + validasi), Guru, Aspirasi |

## ⚠️ Status: mode demo (front-end saja)

- Data contoh disimpan di **localStorage** peramban, tanpa server dan tanpa login.
- Pergantian peran adalah **simulasi** — siapa pun yang membuka situs bisa memilih peran apa pun,
  termasuk Guru BK/Admin yang melihat catatan konseling rahasia.
- Unggah tugas tidak mengirim berkas ke server.

**Jangan memasukkan data siswa sungguhan sebelum ditambah autentikasi + database.**
Panduan arsitektur lanjutan (Next.js/Prisma/Neon/Blob, RBAC, middleware) tersedia di aplikasi:
menu **Roadmap Backend**.

## Struktur

```
src/
  layout/        AppShell (sidebar/bottom-nav), konfigurasi menu per role
  components/
    ui/          Modal responsif, Toast, Avatar, ErrorBoundary, kit komponen
    dashboards/  Dashboard tiap peran
    modals/      Form & dialog (rapor & roadmap di-lazy-load)
  hooks/         usePersistentState (localStorage aman)
  utils/         CSV (anti formula-injection), WhatsApp, format
  data/          Data contoh
```
