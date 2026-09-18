# Dasbor Penjualan Axon

Dasbor analitik penjualan untuk Axon, yang dibangun menggunakan dataset sampel `classicmodels` dan dikembangkan sebagai latihan DevOps menyeluruh (*end-to-end*): perencanaan, pengembangan, pengujian, integrasi, rilis, deployment, pemantauan, dan umpan balik.

> **Status: Dasbor tahap pertama live di production.** Database Supabase
> (`Axon_Sales`) sudah terhubung dan berisi seluruh dataset `classicmodels`
> hasil migrasi (lihat §5). Tujuh halaman dasbor (Ikhtisar, Analisis
> Penjualan, Produk, Pelanggan, Karyawan, Kantor, dan Wawasan Lanjutan) live
> di https://dashboard-axon-sales.vercel.app dengan data nyata dari Supabase
> — lihat `docs/analytics.md` untuk daftar pertanyaan bisnis yang sudah
> terjawab. Alur rilis 3-branch (`main → Testing → Deployment`, masing-masing
> lewat PR + CI, Production Branch Vercel = `Deployment`) sudah aktif penuh
> — lihat §11 dan `docs/deployment.md`. Toimul Setyo Andri dan Ilham Widi
> Mahendra sudah diundang sebagai kolaborator repo (menunggu diterima).

## 1. Gambaran Umum Proyek
Sebuah dasbor web untuk satu peran, yaitu **Sales** (Penjualan), guna melihat, memfilter, menganalisis, membuat, memperbarui, dan menghapus data penjualan Axon serta mengubah data transaksi mentah menjadi wawasan kinerja terkait pendapatan, produk, pelanggan, karyawan, dan kantor.

## 2. Tujuan
- **Bisnis:** mengubah data penjualan Axon menjadi informasi yang mendukung pengambilan keputusan bisnis.
- **Akademik:** mendemonstrasikan siklus hidup DevOps yang nyata (perencanaan → penulisan kode → *build* → pengujian → rilis → deployment → pemantauan → umpan balik → perencanaan) di seputar dasbor tersebut.

## 3. Tech Stack
| Lapisan | Pilihan |
|---|---|
| Frontend | Next.js (App Router, TypeScript) |
| Styling | Tailwind CSS |
| Database | PostgreSQL melalui Supabase |
| Backend / akses data | Supabase (`@supabase/supabase-js`, `@supabase/ssr`) — tanpa server API terpisah |
| Hosting | Vercel |
| Kontrol versi | Git / GitHub |
| CI/CD | GitHub Actions |
| Pengujian | Otomatis (lihat §9) |
| Dokumentasi | Markdown |

Sengaja tidak digunakan (tidak ada kebutuhan yang terbukti untuk skala proyek ini):
Docker, Kubernetes, Terraform, Jenkins, *microservices*, Redis, Kafka,
GraphQL.

## 4. Arsitektur
Lihat [`docs/architecture.md`](docs/architecture.md) untuk penjelasan lengkapnya:
struktur folder, alasan penentuan batasan fitur, dan hal-hal yang keputusannya
masih terbuka (pendekatan autentikasi).

## 5. Database
Sumber utama data: **Supabase PostgreSQL** (proyek `Axon_Sales`). Dataset sumber:
`classicmodels` (customers, products, productlines, orders, orderdetails,
payments, employees, offices), disediakan sebagai *dump* MySQL di
[`sql/source/classicmodels_mysql_dump.sql`](sql/source/classicmodels_mysql_dump.sql)
dan dimigrasikan ke PostgreSQL melalui [`sql/schema.sql`](sql/schema.sql) dan
[`sql/migration.sql`](sql/migration.sql).

**Migrasi sudah dijalankan dan diverifikasi** — jumlah baris di setiap tabel
serta seluruh pemeriksaan kualitas data di [`sql/tests.sql`](sql/tests.sql)
cocok dengan sumber (lihat [`docs/data-dictionary.md`](docs/data-dictionary.md)
untuk rincian skema lengkap). Akses baca/tulis untuk peran `anon` diizinkan
melalui kebijakan Row Level Security pada setiap tabel — dibuka penuh untuk
`anon` karena keputusan autentikasi masih *Pending* (lihat bagian
"Autentikasi / otorisasi" di `docs/architecture.md`).

## 6. Instalasi
Prasyarat: **Node.js `>=22`** (lihat `package.json` → `engines`; disyaratkan oleh
`@supabase/supabase-js`, dan versi yang sama dipakai CI serta Vercel — lihat
`.github/workflows/ci.yml` dan pengaturan Node Version di Vercel), **npm**, **Git**.

```bash
git clone <repository-url>
cd axon-sales-dashboard
npm install
```

## 7. Variabel Lingkungan (*Environment Variables*)
Salin `.env.example` menjadi `.env.local` dan isi dengan nilai dari
proyek Supabase Anda sendiri (jangan pernah melakukan *commit* pada `.env.local`):

```bash
cp .env.example .env.local
```

| Variabel | Diekspos ke *browser*? | Catatan |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Ya | Dari pengaturan proyek Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Ya | Dilindungi RLS, aman untuk diekspos |
| `SUPABASE_SERVICE_ROLE_KEY` | **Tidak** | Hanya untuk sisi server, melewati RLS — jangan pernah disertakan di sisi klien |

Proyek Supabase `Axon_Sales` sudah disiapkan dan `.env.local` di lingkungan
pengembangan sudah terisi (nilai URL + `anon` key dari
`https://supabase.com/dashboard/project/flngoumoilywdcozcxom/settings/api`).
`.env.local` tidak pernah di-*commit* (lihat `.gitignore`) — kontributor lain
mengisinya sendiri dari dashboard proyek Supabase yang sama.

## 8. Pengembangan Lokal
```bash
npm run dev      # menjalankan server pengembangan di http://localhost:3000
npm run lint      # ESLint
npm test          # Vitest — unit test (lihat §9)
npm run build     # build produksi (juga menjalankan pemeriksaan TypeScript)
```

## 9. Pengujian
Strategi didokumentasikan dalam [`docs/testing.md`](docs/testing.md). Lapisan
**Unit** sudah diimplementasikan dengan Vitest (`npm test`, 52 test) — mencakup
seluruh fungsi agregasi bisnis di `features/*/services/*.ts` dan `lib/format.ts`.
`sql/tests.sql` berisi kueri validasi data yang sudah dijalankan manual saat
migrasi (lihat §5), tapi belum otomatis di CI (alasannya didokumentasikan di
`docs/testing.md`). Lapisan **Integrasi** dan **Validasi data otomatis**
(`testing/integration/`, `testing/validation/`) masih *Pending*.

## 10. CI/CD
Dikonfigurasi di [`.github/workflows/ci.yml`](.github/workflows/ci.yml):
`checkout → install (npm ci) → lint → test → build`, berjalan otomatis pada
setiap push ke `main`/`Testing`/`Deployment` dan pada setiap pull request.
Build tidak memerlukan Supabase secrets karena setiap route di-render dinamis saat
runtime, bukan saat `next build` (sudah diverifikasi lokal dengan
`.env.local` dihapus sementara sebelum pipeline ini ditulis). Branch
protection aktif di `main`, `Testing`, dan `Deployment` — wajib lewat PR dan
status check `validate` lolos sebelum merge (lihat `README_Dev.md`).

## 11. Deployment
Model: trunk-based untuk pengembangan (`main` menerima semua PR fitur),
promosi manual bertahap untuk rilis (`main → Testing → Deployment`, masing-masing
lewat PR + CI). Production Branch Vercel = `Deployment` (aktif, terverifikasi).
Lihat [`docs/deployment.md`](docs/deployment.md) dan
[`deployment/README.md`](deployment/README.md) untuk alur lengkap.

## 12. URL Produksi
https://dashboard-axon-sales.vercel.app

## 13. Struktur Repositori
```
axon-sales-dashboard/
├── app/            Rute Next.js (App Router) — Ikhtisar, sales, products, customers,
│                   employees, offices, insights
├── components/ui/  Komponen UI dasar bersama (Card, KpiCard, DataTable, Sidebar,
│                   charts/) yang digunakan lintas fitur
├── features/       Satu folder per domain terbatas (bounded domain) — lihat README.md masing-masing
├── lib/            Klien Supabase bersama, lib/format.ts (pemformatan), dan
│                   lib/data/sales-facts.ts (join + fetch data lintas-fitur)
├── sql/            Dataset sumber, skema, migrasi, pembersihan data, analitik, pengujian
├── testing/        Pengujian unit / integrasi / validasi
├── deployment/      Referensi cepat deployment
├── docs/           Dokumentasi arsitektur, kamus data, analitik, pengujian, dan deployment
├── README.md        File ini
└── README_Dev.md    Panduan kontribusi — kepemilikan folder, aturan branch/commit
```

## 14. Pemecahan Masalah (Troubleshooting)
- **`npm install` menampilkan peringatan terkait engine Node `>=22`**: pastikan
Anda memakai Node `>=22` (lihat `package.json` → `engines`) — di bawah itu,
`@supabase/supabase-js` dan beberapa nilai format `Intl` (mis. compact currency
di `lib/format.ts`) bisa berperilaku sedikit berbeda karena versi ICU yang
dibundel Node ikut berbeda per versi.
- **Turbopack mendeteksi `package-lock.json` yang tidak relevan dari folder induk**:
masalah ini sudah diperbaiki melalui `turbopack.root` di `next.config.ts` — jika
masalah muncul kembali setelah memindahkan repositori, pastikan jalur (path)
tersebut masih terdeteksi dengan benar.
- **Build gagal**: jalankan `npm run build` secara lokal sebelum melakukan push; 
CI akan menghentikan proses jika terjadi kegagalan yang sama saat CI sudah diterapkan.