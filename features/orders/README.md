# Fitur: Manajemen Pesanan

- **Pemilik:** Ilham Widi Mahendra
- **Status:** Belum diimplementasikan (tahap fondasi)

## Cakupan
- Daftar pesanan, detail pesanan
- Status pesanan
- Analitik pesanan: nilai rata-rata pesanan, distribusi pesanan berdasarkan status,
kuantitas/pendapatan per pesanan

## Konvensi struktur
```
features/orders/
├── components/
├── services/
├── queries/
├── types/
└── utils/
```
Dibuat sesuai kebutuhan saat pekerjaan dimulai — tidak disiapkan sebagai kerangka kosong sejak awal.

## Dependensi
- `lib/` (klien Supabase bersama, *helper* pemformatan)
- `components/ui/` (komponen UI dasar bersama)
- Tabel database `orders`, `orderdetails` (lihat `docs/data-dictionary.md`
setelah data diisi pada tahap migrasi data)
- Terkait dengan `features/payments/` (status pembayaran pesanan) — koordinasikan
dengan pemilik fitur tersebut jika relasi memerlukan tipe data bersama.

## File yang diizinkan
Segala sesuatu di dalam `features/orders/`.

## File yang dibatasi
Jangan mengubah: folder `features/*` lainnya, `app/layout.tsx`, `package.json`,
`next.config.ts`, `tsconfig.json`, `supabase/`, `.github/workflows/`. Jika
perubahan pada salah satu file ini diperlukan, buka *issue* terlebih dahulu (lihat
`README_Dev.md` → Koordinasi File Bersama).