# Fitur: Manajemen Pelanggan

- **Pemilik:** Toimul Setyo Andri
- **Status:** Analitik pelanggan tahap pertama sudah ada di halaman
`/customers` (`services/customer-analysis.ts` — top pelanggan, distribusi per
negara), ditambahkan sebagai bagian dari dasbor awal. Daftar/pencarian/filter
dan CRUD pelanggan (cakupan utama fitur ini) belum diimplementasikan.

## Cakupan
- Daftar, pencarian, dan pemfilteran pelanggan
- Tampilan detail pelanggan
- Membuat / memperbarui / menghapus pelanggan (CRUD dalam batasan cakupan
yang diizinkan untuk peran Sales)
- Analitik pelanggan: pelanggan dengan nilai tertinggi, pendapatan per pelanggan,
pesanan per pelanggan, distribusi geografis, kontribusi pendapatan

## Konvensi struktur
```
features/customers/
├── components/
├── services/
├── queries/
├── types/
└── utils/
```
Dibuat sesuai kebutuhan saat pekerjaan dimulai — tidak disiapkan sebagai kerangka kosong sejak awal.

## Dependensi
- `lib/` (klien Supabase bersama, helper pemformatan)
- `components/ui/` (komponen UI dasar bersama — tabel, filter, modal, kontrol
formulir)
- Tabel database `customers` (lihat `docs/data-dictionary.md` setelah data
diisi pada tahap migrasi data)

## File yang diizinkan
Segala sesuatu di dalam `features/customers/`.

## File yang dibatasi
Jangan mengubah: folder `features/*` lainnya, `app/layout.tsx`, `package.json`,
`next.config.ts`, `tsconfig.json`, `supabase/`, `.github/workflows/`. Jika
perubahan pada salah satu file ini diperlukan, buka issue terlebih dahulu (lihat
`README_Dev.md` → Koordinasi File Bersama).