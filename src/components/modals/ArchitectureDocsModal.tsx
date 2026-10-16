import React, { useState } from 'react';
import { Database, FolderTree, ShieldCheck, Rocket, Copy, Check, FileCode2, Info } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { copyToClipboard } from '../../utils/format';

interface Props { onClose: () => void }

const TABS = [
  { id: 'FOLDER', label: 'Struktur Folder', icon: FolderTree, color: 'text-blue-400', pre: 'text-slate-300 whitespace-pre' },
  { id: 'DATABASE', label: 'Skema Prisma', icon: Database, color: 'text-emerald-400', pre: 'text-emerald-200/90 whitespace-pre' },
  { id: 'RBAC', label: 'RBAC & Keamanan', icon: ShieldCheck, color: 'text-amber-400', pre: 'text-amber-200/90 whitespace-pre' },
  { id: 'DEPLOY', label: 'Deployment', icon: Rocket, color: 'text-purple-400', pre: 'text-purple-200/90 whitespace-pre-wrap' },
] as const;

export const ArchitectureDocsModal: React.FC<Props> = ({ onClose }) => {
  const [active, setActive] = useState<(typeof TABS)[number]['id']>('FOLDER');
  const [copied, setCopied] = useState(false);

  const folderStructureCode = `my-siakad-app/
├── prisma/
│   ├── schema.prisma               # Skema ORM Prisma dengan relasi dan indeks PostgreSQL
│   └── seed.ts                     # Seeder data awal guru, siswa (<100), dan peran
├── public/
│   ├── manifest.json               # Konfigurasi PWA (Progressive Web App)
│   └── sw.js                       # Service Worker untuk offline caching
├── src/
│   ├── middleware.ts               # Next.js Edge Middleware untuk proteksi rute & RBAC
│   ├── app/
│   │   ├── layout.tsx              # Root Layout dengan Sentry & Vercel Analytics provider
│   │   ├── page.tsx                # Beranda publik & portal informasi sekolah
│   │   ├── (auth)/                 # Route Group Autentikasi
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── unauthorized/page.tsx
│   │   ├── dashboard/              # Dasbor terproteksi berbasis role
│   │   │   ├── layout.tsx          # Layout bersama dengan Sidebar & Navigasi dinamis
│   │   │   ├── user/page.tsx       # Default: Menunggu verifikasi role dari admin
│   │   │   ├── siswa/              # Fitur Siswa (Rapor pribadi, absensi, kirim tugas)
│   │   │   │   ├── page.tsx
│   │   │   │   └── tugas/page.tsx
│   │   │   ├── orang-tua/          # Fitur Orang Tua (Pemantauan anak, poin, hubungi BK)
│   │   │   │   └── page.tsx
│   │   │   ├── guru-mapel/         # Input nilai harian & absensi per mata pelajaran
│   │   │   │   └── page.tsx
│   │   │   ├── wali-kelas/         # Rekap kelas, cetak rapor ber-kop, export Excel
│   │   │   │   └── page.tsx
│   │   │   ├── guru-bk/            # Poin pelanggaran, catatan konseling privat, WhatsApp dispatch
│   │   │   │   └── page.tsx
│   │   │   └── admin/              # Master data siswa/guru, penugasan role (add role)
│   │   │       └── page.tsx
│   │   └── api/                    # Route Handlers Next.js
│   │       ├── auth/[...nextauth]/route.ts
│   │       ├── upload/route.ts     # Upload berkas & foto profil ke Vercel Blob (@vercel/blob)
│   │       ├── bk/
│   │       │   └── pelanggaran/route.ts # Filter otorisasi ketat (catatan privat vs publik)
│   │       ├── nilai/export/route.ts    # Streaming export CSV/Excel
│   │       └── wa-notify/route.ts       # Endpoint format template WhatsApp
│   ├── lib/
│   │   ├── db.ts                   # Inisialisasi Prisma Client (Neon serverless pooler)
│   │   ├── blob.ts                 # Helper Vercel Blob upload & optimasi WebP
│   │   ├── auth.ts                 # Konfigurasi NextAuth / JWT & verifikasi role
│   │   └── validations.ts          # Skema validasi Zod (anti XSS/SQL Injection)
│   └── components/
│       ├── KopSekolah.tsx          # Format Kop resmi surat/rapor berstandar Diknas
│       ├── CetakRapor.tsx          # Template cetak A4 rapor akademik
│       └── SkeletonLoading.tsx     # Loading placeholders responsif
├── sentry.client.config.ts         # Integrasi error tracking Sentry
├── vercel.json                     # Konfigurasi caching & security headers Vercel
└── package.json`;

  const prismaSchemaCode = `// prisma/schema.prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL") // Diperlukan untuk Neon Serverless migration
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  USER
  SISWA
  ORANG_TUA
  GURU_MAPEL
  WALI_KELAS
  GURU_BK
  ADMIN
}

enum StatusAbsensi {
  HADIR
  SAKIT
  IZIN
  ALPA
}

enum StatusPelanggaran {
  DALAM_PROSES
  DITANGANI
  PANGGILAN_ORTU
  SELESAI
}

model User {
  id             String    @id @default(uuid())
  email          String    @unique
  passwordHash   String    // Bcrypt / Argon2
  namaLengkap    String
  role           Role      @default(USER)
  subRole        String?
  avatarUrl      String?
  phone          String?
  isActive       Boolean   @default(true)
  isDeleted      Boolean   @default(false)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  // Relasi opsional satu arah ke Siswa atau Guru
  siswaProfile   Siswa?
  guruProfile    Guru?
  kritikSaran    KritikSaran[]

  @@index([email])
  @@index([role])
}

model Siswa {
  id                    String            @id @default(uuid())
  userId                String?           @unique
  user                  User?             @relation(fields: [userId], references: [id], onDelete: SetNull)
  nisn                  String            @unique
  nis                   String            @unique
  namaLengkap           String
  kelas                 String            // contoh: "X-IPA-1", "XI-IPS-2"
  jenisKelamin          String            // "L" / "P"
  namaOrangTua          String
  noWaOrangTua          String
  alamat                String
  avatarUrl             String?
  totalPoinPelanggaran  Int               @default(0)
  isDeleted             Boolean           @default(false)
  createdAt             DateTime          @default(now())

  // Relasi Transaksional
  absensi               Absensi[]
  nilaiAkademik         NilaiAkademik[]
  pelanggaranBK         PelanggaranBK[]
  dokumenTugas          DokumenTugas[]

  @@index([nisn])
  @@index([namaLengkap])
  @@index([kelas])
}

model Guru {
  id            String    @id @default(uuid())
  userId        String?   @unique
  user          User?     @relation(fields: [userId], references: [id], onDelete: SetNull)
  nip           String    @unique
  namaLengkap   String
  mataPelajaran String
  jabatan       String    // "Guru Mapel", "Wali Kelas", "Guru BK"
  kelasWali     String?   // jika Wali Kelas
  isDeleted     Boolean   @default(false)
  createdAt     DateTime  @default(now())

  pelanggaranDicatat PelanggaranBK[]

  @@index([nip])
  @@index([namaLengkap])
}

model Absensi {
  id          String        @id @default(uuid())
  siswaId     String
  siswa       Siswa         @relation(fields: [siswaId], references: [id], onDelete: Cascade)
  tanggal     DateTime      @db.Date
  status      StatusAbsensi @default(HADIR)
  keterangan  String?
  createdAt   DateTime      @default(now())

  @@index([siswaId])
  @@index([tanggal])
  @@index([siswaId, tanggal])
}

model NilaiAkademik {
  id            String    @id @default(uuid())
  siswaId       String
  siswa         Siswa     @relation(fields: [siswaId], references: [id], onDelete: Cascade)
  mataPelajaran String
  tugas         Float     @default(0)
  uts           Float     @default(0)
  uas           Float     @default(0)
  nilaiAkhir    Float     @default(0)
  predikat      String    // "A", "B", "C", "D"
  semester      String    // "Ganjil 2026/2027"
  isDeleted     Boolean   @default(false)
  createdAt     DateTime  @default(now())

  @@index([siswaId])
  @@index([mataPelajaran])
  @@index([semester])
}

model PelanggaranBK {
  id                  String            @id @default(uuid())
  siswaId             String
  siswa               Siswa             @relation(fields: [siswaId], references: [id], onDelete: Cascade)
  guruPencatatId      String?
  guruPencatat        Guru?             @relation(fields: [guruPencatatId], references: [id], onDelete: SetNull)
  tanggal             DateTime          @db.Date
  kategori            String
  namaPelanggaran     String
  poin                Int               @default(5)
  deskripsiUmum       String            // Terbuka untuk Orang Tua & Siswa
  tindakanInternalBK  String            // RAHASIA / HANYA GURU BK & ADMIN
  status              StatusPelanggaran @default(DALAM_PROSES)
  isDeleted           Boolean           @default(false)
  createdAt           DateTime          @default(now())

  @@index([siswaId])
  @@index([tanggal])
  @@index([status])
}

model DokumenTugas {
  id             String    @id @default(uuid())
  siswaId        String
  siswa          Siswa     @relation(fields: [siswaId], references: [id], onDelete: Cascade)
  judulTugas     String
  mataPelajaran  String
  namaFile       String
  ukuranFile     String
  fileUrl        String    // URL Vercel Blob
  tanggalUnggah  DateTime  @default(now())
  status         String    @default("TERKIRIM") // "TERKIRIM", "DINILAI", "REVISI"
  catatanGuru    String?
  isDeleted      Boolean   @default(false)

  @@index([siswaId])
  @@index([mataPelajaran])
}

model KritikSaran {
  id        String   @id @default(uuid())
  userId    String?
  user      User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  kategori  String
  pesan     String
  createdAt DateTime @default(now())
}`;

  const rbacCode = `// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';
import { getToken } from 'next-auth/jwt';

// Peta otorisasi rute per role
const ROLE_PERMISSIONS: Record<string, string[]> = {
  '/dashboard/guru-bk': ['GURU_BK', 'ADMIN'],
  '/dashboard/wali-kelas': ['WALI_KELAS', 'ADMIN'],
  '/dashboard/guru-mapel': ['GURU_MAPEL', 'WALI_KELAS', 'ADMIN'],
  '/dashboard/orang-tua': ['ORANG_TUA', 'ADMIN'],
  '/dashboard/siswa': ['SISWA', 'ADMIN'],
  '/dashboard/admin': ['ADMIN'],
};

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Lewatkan aset statis dan rute publik
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/'
  ) {
    return NextResponse.next();
  }

  // Jika belum login, redirect ke halaman login
  if (!token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const userRole = (token.role as string) || 'USER';

  // Periksa otorisasi rute dashboard
  for (const [routePrefix, allowedRoles] of Object.entries(ROLE_PERMISSIONS)) {
    if (pathname.startsWith(routePrefix)) {
      if (!allowedRoles.includes(userRole)) {
        // Blokir akses dan arahkan ke unauthorized
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/bk/:path*', '/api/nilai/:path*'],
};

// -------------------------------------------------------------
// src/app/api/bk/pelanggaran/route.ts (Contoh API Data Filtering)
// -------------------------------------------------------------
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Tidak terotentikasi' }, { status: 401 });
  }

  const { role, associatedSiswaId } = session.user;

  // 1. GURU BK atau ADMIN: Mendapat seluruh data lengkap TERMASUK catatan internal rahasia
  if (role === 'GURU_BK' || role === 'ADMIN') {
    const data = await prisma.pelanggaranBK.findMany({
      where: { isDeleted: false },
      include: { siswa: true },
      orderBy: { tanggal: 'desc' }
    });
    return NextResponse.json({ data });
  }

  // 2. ORANG TUA: Hanya boleh melihat anak sendiri & Catatan Internal BK DISENSOR!
  if (role === 'ORANG_TUA') {
    const data = await prisma.pelanggaranBK.findMany({
      where: {
        siswaId: associatedSiswaId,
        isDeleted: false
      },
      select: {
        id: true,
        tanggal: true,
        kategori: true,
        namaPelanggaran: true,
        poin: true,
        deskripsiUmum: true,
        status: true,
        // tindakanInternalBK DISENSOR (tidak disertakan dalam query select)
      },
      orderBy: { tanggal: 'desc' }
    });
    return NextResponse.json({ data });
  }

  return NextResponse.json({ error: 'Akses Ditolak' }, { status: 403 });
}`;

  const deploymentGuide = `# Panduan Deployment Produksi SIAKAD (Vercel + Neon DB + Vercel Blob)

## 1. Persiapan Database PostgreSQL di Neon DB
1. Buka console https://console.neon.tech dan buat project baru (misal: "siakad-bk-db").
2. Pilih region terdekat (misal: Singapore / asia-southeast1).
3. Salin connection string dari Neon Dashboard:
   - DATABASE_URL (dengan pgbouncer untuk pooled connection)
   - DIRECT_URL (koneksi langsung port 5432 untuk Prisma migrate)
4. Aktifkan fitur "Point-in-Time Recovery" (PITR) di Neon untuk backup otomatis berkelanjutan.

## 2. Persiapan Vercel Blob Storage
1. Buka dashboard project di https://vercel.com/dashboard/stores.
2. Klik "Create Database" -> Pilih "Blob".
3. Hubungkan Blob Store ke project SIAKAD. Vercel akan otomatis menginjeksi token:
   BLOB_READ_WRITE_TOKEN="..."

## 3. Konfigurasi Environment Variables di Vercel
Tambahkan variabel berikut pada tab Settings -> Environment Variables:
- DATABASE_URL="postgres://user:pass@ep-xyz-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
- DIRECT_URL="postgres://user:pass@ep-xyz.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
- BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
- NEXTAUTH_SECRET="buat_string_acak_32_karakter_openssl_rand_base64_32"
- NEXTAUTH_URL="https://siakad-sekolah.vercel.app"
- SENTRY_DSN="https://xxxx@o0.ingest.sentry.io/xxxx"

## 4. Eksekusi Migrasi Database & Seeding Awal
Di terminal lokal sebelum deployment:
\`\`\`bash
# Install Prisma dan client
npm install -D prisma
npm install @prisma/client @vercel/blob next-auth bcryptjs zod

# Generate Prisma Client & jalankan migrasi ke Neon DB
npx prisma migrate dev --name init_siakad_schema

# Seed data master awal (Guru BK, Admin, Siswa <100)
npx prisma db seed
\`\`\`

## 5. Hubungkan ke GitHub & Push ke Vercel
\`\`\`bash
git init
git add .
git commit -m "feat: inisialisasi arsitektur siakad bk & ortu"
git branch -M main
git remote add origin https://github.com/sekolah/siakad-bk.git
git push -u origin main
\`\`\`
Vercel akan otomatis melakukan auto-build, menyalakan Next.js SSR/ISR, Edge Middleware, dan Vercel Analytics.`;

  const content = { FOLDER: folderStructureCode, DATABASE: prismaSchemaCode, RBAC: rbacCode, DEPLOY: deploymentGuide }[active];
  const tab = TABS.find((t) => t.id === active)!;

  const copy = async () => {
    if (await copyToClipboard(content)) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  return (
    <Modal title="Roadmap Backend Produksi" subtitle="Referensi: Next.js + Prisma + Neon + Vercel Blob" size="xl" headerClass="bg-slate-950 text-white" icon={<FileCode2 className="h-5 w-5" />} onClose={onClose}>
      <div className="-mx-4 -mt-4 sm:-mx-6 sm:-mt-6">
        <div className="flex items-start gap-2 border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-900 sm:px-6">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          Aplikasi saat ini adalah front-end (data demo di perangkat). Dokumen ini panduan untuk menambahkan login, database, dan penyimpanan berkas asli.
        </div>
        <div className="scrollbar-none flex overflow-x-auto border-b border-slate-200 bg-slate-50 text-xs sm:text-sm">
          {TABS.map((t) => { const I = t.icon; return (
            <button key={t.id} onClick={() => setActive(t.id)} className={`flex min-h-11 shrink-0 items-center gap-2 px-4 font-semibold transition ${active === t.id ? 'border-b-2 border-blue-600 bg-white text-blue-700' : 'text-slate-600'}`}><I className="h-4 w-4" />{t.label}</button>); })}
        </div>
        <div className="bg-slate-900 p-4 font-mono text-xs leading-relaxed text-slate-100 sm:p-6">
          <div className="mb-3 flex justify-end">
            <button onClick={copy} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-slate-800 px-3 text-xs text-slate-200 hover:bg-slate-700">
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}{copied ? 'Tersalin' : 'Salin'}
            </button>
          </div>
          <pre className={`overflow-x-auto ${tab.pre}`}>{content}</pre>
        </div>
      </div>
    </Modal>
  );
};
