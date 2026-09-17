# Fitur: Analitik Karyawan

- **Pemilik:** Ghazi
- **Status:** Diimplementasikan — halaman `/employees` dengan pendapatan,
jumlah pelanggan, dan jumlah pesanan per perwakilan penjualan

## Cakupan
Analitik kinerja perwakilan penjualan / karyawan:
- Pendapatan per perwakilan penjualan
- Jumlah pelanggan yang ditangani
- Jumlah pesanan yang ditangani
- Korelasi antara jumlah pelanggan dan pendapatan

## Konvensi struktur
```
features/employees/
├── components/
├── services/
├── queries/
├── types/
└── utils/
```
Dibuat sesuai kebutuhan saat pengerjaan dimulai — tidak dibuatkan kerangka kosong di awal.

## Dependensi
- `lib/` (klien Supabase bersama, *helper* pemformatan)
- Tabel database `employees` (lihat `docs/data-dictionary.md` setelah data diisi
pada tahap migrasi data)

## File yang dibatasi
Jangan ubah: folder `features/*` lainnya, `app/layout.tsx`, `package.json`,
`next.config.ts`, `tsconfig.json`, `supabase/`, `.github/workflows/`.