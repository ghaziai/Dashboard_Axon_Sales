# Fitur: Analitik Kantor

- **Pemilik:** Ghazi
- **Status:** Diimplementasikan — halaman `/offices` dengan pendapatan per
wilayah (territory), distribusi kantor, dan kinerja per kantor

## Cakupan
Analitik kinerja kantor / geografis:
- Pendapatan per kantor
- Distribusi perwakilan penjualan per kantor
- Distribusi pelanggan per kantor
- Kinerja geografis (berdasarkan negara/wilayah)

## Konvensi struktur
```
features/offices/
├── components/
├── services/
├── queries/
├── types/
└── utils/
```
Dibuat sesuai kebutuhan saat pekerjaan dimulai — tidak disiapkan sebagai kerangka kosong sejak awal.

## Dependensi
- `lib/` (klien Supabase bersama, fungsi pembantu pemformatan)
- Tabel database `offices` (lihat `docs/data-dictionary.md` setelah data diisi
pada tahap migrasi data)

## File yang dibatasi
Jangan ubah: folder `features/*` lainnya, `app/layout.tsx`, `package.json`,
`next.config.ts`, `tsconfig.json`, `supabase/`, `.github/workflows/`.