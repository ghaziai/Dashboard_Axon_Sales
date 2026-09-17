# Fitur: Analisis Penjualan

- **Pemilik:** Ghazi
- **Status:** Belum diimplementasikan (tahap dasar)

## Cakupan
Domain analisis performa penjualan (lihat `docs/analytics.md` setelah tersedia):
- Total pendapatan, total pesanan, total kuantitas terjual
- Tren pendapatan (berdasarkan tahun, bulan)
- Periode dengan performa terbaik
- Perubahan pendapatan tahun-ke-tahun (YoY)

## Konvensi struktur
```
features/sales/
├── components/
├── services/
├── queries/
├── types/
└── utils/
```
Dibuat sesuai kebutuhan — tidak disediakan dalam bentuk kerangka kosong sejak awal.

## Dependensi
- `lib/` (klien Supabase bersama/shared)
- `sql/analytics.sql` (setelah tersedia pada tahap migrasi data)

## Batasan
Jangan mengubah folder fitur lain. Lakukan koordinasi melalui *issue* jika ada dependensi bersama
(`lib/`, `components/ui/`, konfigurasi *root*) yang perlu diubah.