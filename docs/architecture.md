# Arsitektur

## Status
Tahap awal (fondasi). Dokumen ini mencakup keputusan yang telah ditetapkan
(struktur proyek, *tech stack*, batasan kepemilikan). Bagian yang
bergantung pada model data atau infrastruktur yang diterapkan ditandai sebagai *Pending*.

## Tech Stack
| Lapisan | Pilihan | Alasan |
|---|---|---|
| Frontend | Next.js (App Router, TypeScript) | Satu *framework* untuk UI + akses data, dukungan kelas satu dari Vercel |
| Styling | Tailwind CSS | Sudah disertakan dalam `create-next-app`, tidak perlu *tooling* *build* tambahan |
| Database | PostgreSQL melalui Supabase | Postgres terkelola (*managed*) dengan klien JS, memenuhi syarat "Supabase sebagai sumber kebenaran utama" |
| Backend / akses data | Klien Supabase (`@supabase/supabase-js`, `@supabase/ssr`) | Tidak perlu server API terpisah — Server Components/Actions Next.js berkomunikasi langsung dengan Supabase |
| Hosting | Vercel | Target *deployment* bawaan (*native*) untuk Next.js |
| CI/CD | GitHub Actions | Gratis, terintegrasi langsung dengan repositori GitHub |

Sengaja **tidak** digunakan: Docker, Kubernetes, Terraform, Jenkins,
*microservices*, Redis, Kafka, GraphQL — tidak ada kebutuhan yang terbukti mendesak untuk teknologi tersebut
pada skala proyek ini (satu aplikasi, satu peran pengguna, satu database Postgres).

## Mengapa tidak menggunakan layanan *backend* terpisah
Semua akses data dilakukan melalui klien Supabase dari Next.js Server
Components / Server Actions / Route Handlers. Menambahkan *backend*
terpisah (Express, dll.) hanya akan menduplikasi fungsi yang sudah disediakan
oleh Supabase + Next.js untuk sebuah *dashboard* internal dengan satu peran pengguna.
Keputusan ini dapat ditinjau kembali jika muncul kebutuhan konkret yang tidak dapat
dipenuhi oleh model klien/RLS Supabase.

## Struktur aplikasi
```
axon-sales-dashboard/
├── app/                  Rute Next.js (App Router) — ringan: menyusun fitur
├── components/ui/        Komponen UI dasar (primitif) yang digunakan bersama & bebas logika bisnis
├── features/              Satu folder untuk setiap domain terbatas (lihat di bawah)
├── lib/                   Klien Supabase bersama + utilitas lintas fitur
├── supabase/              Konfigurasi proyek Supabase / migrasi (Tertunda — lihat di bawah)
├── sql/                   Dataset sumber, skema, migrasi, pembersihan, analitik, SQL uji coba
├── testing/               Pengujian unit / integrasi / validasi
├── deployment/            Referensi cepat deployment
└── docs/                  Kumpulan dokumentasi ini
```

## Batasan fitur
Setiap folder `features/<name>/` merupakan domain independen yang memiliki penanggung jawab sendiri
(`components/`, `services/`, `queries/`, `types/`, `utils/` — dibuat sesuai
kebutuhan, tidak disediakan kerangka kosong sejak awal). Ini adalah langkah
**pencegahan konflik penggabungan (merge conflict) antar-kontributor**:
kontributor bekerja di dalam folder fitur mereka sendiri dan hanya menyentuh
file bersama (`app/layout.tsx`, `package.json`, `next.config.ts`,
`tsconfig.json`, `supabase/`, `.github/workflows/`) melalui perubahan
yang terkoordinasi (lihat `README_Dev.md`).

## Model data
*Tertunda.* Database belum diperiksa dalam proyek ini (lihat
`sql/source/` untuk *dump* MySQL `classicmodels` mentah). Pemeriksaan skema,
rencana migrasi MySQL → PostgreSQL, dan kamus data merupakan tahap
pekerjaan berikutnya — lihat `docs/data-dictionary.md`.

## Autentikasi / otorisasi
*Tertunda — memerlukan keputusan yang belum dibuat.* Proyek ini hanya
memiliki satu peran (Sales) dan secara eksplisit tidak menyertakan
kompleksitas RBAC/OAuth/SSO. Belum diputuskan apakah aplikasi dengan satu fungsi ini memerlukan proses masuk (misalnya, menggunakan satu akun pengguna Supabase Auth bersama) atau diperlakukan sebagai alat internal tanpa perlu masuk; hal ini juga tidak menghambat pelaksanaan tahap awal (foundation phase) ini. Keputusan mengenai hal ini harus diambil sebelum fitur CRUD diimplementasikan, karena akan menentukan apakah kebijakan *Row Level Security* Supabase diterapkan berdasarkan pengguna (per-user) atau bersifat terbuka.

## Deployment
*Menunggu pelaksanaan.* Lihat `deployment/README.md` untuk alur yang direncanakan; saat ini belum ada yang dideploy.