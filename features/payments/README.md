# Fitur: Pembayaran

- **Pemilik:** DIUSULKAN → Kontributor 3 (pasangan alami untuk `features/orders/`
karena status pembayaran berkaitan langsung dengan pemenuhan pesanan). **Belum
dikonfirmasi dengan tim** — fitur ini tidak termasuk dalam pembagian
dasar awal dan memerlukan persetujuan eksplisit sebelum pengerjaan dimulai.
- **Status:** Belum diimplementasikan (tahap fondasi)

## Cakupan
- Catatan pembayaran per pelanggan/pesanan
- Analisis pola pembayaran pelanggan (analisis operasional: pola
pembayaran, konteks nilai rata-rata pesanan)

## Konvensi struktur
```
features/payments/
├── components/
├── services/
├── queries/
├── types/
└── utils/
```
Dibuat sesuai kebutuhan saat pengerjaan dimulai — tidak disiapkan kerangka kosong sejak awal.

## Dependensi
- `lib/` (klien Supabase bersama, helper pemformatan)
- Tabel database `payments` (lihat `docs/data-dictionary.md` setelah tabel
tersedia pada tahap migrasi data)

## File yang dibatasi
Jangan ubah: folder `features/*` lainnya, `app/layout.tsx`, `package.json`,
`next.config.ts`, `tsconfig.json`, `supabase/`, `.github/workflows/`.