# Fitur: Manajemen Produk

- **Pemilik:** Ilham Widi Mahendra
- **Status:** Analitik produk tahap pertama sudah ada di halaman `/products`
(`services/product-analysis.ts` — produk terlaris, pendapatan per lini
produk), ditambahkan sebagai bagian dari dasbor awal. Daftar/filter/detail
produk (cakupan utama fitur ini) belum diimplementasikan.

## Cakupan
- Daftar produk, pemfilteran
- Tampilan detail produk
- Analitik produk: produk terlaris, produk dengan pendapatan tertinggi,
kinerja lini produk, kuantitas per produk, kontribusi pendapatan,
tren kinerja

## Konvensi struktur
```
features/products/
├── components/
├── services/
├── queries/
├── types/
└── utils/
```
Dibuat sesuai kebutuhan saat pekerjaan dimulai — tidak disiapkan sebagai kerangka kosong sejak awal.

## Dependensi
- `lib/` (klien Supabase bersama, helper pemformatan)
- `components/ui/` (komponen UI dasar bersama)
- Tabel database `products`, `productlines` (lihat `docs/data-dictionary.md`
setelah data diisi pada tahap migrasi data)

## File yang diizinkan
Segala sesuatu di dalam `features/products/`.

## File yang dibatasi
Jangan mengubah: folder `features/*` lainnya, `app/layout.tsx`, `package.json`,
`next.config.ts`, `tsconfig.json`, `supabase/`, `.github/workflows/`. Jika
perubahan pada salah satu file tersebut diperlukan, buka issue terlebih dahulu (lihat
`README_Dev.md` → Koordinasi File Bersama).