# Fitur: Wawasan Lanjutan (Advanced Insights)

- **Pemilik:** Ghazi
- **Status:** Diimplementasikan (tahap pertama) — halaman `/insights` dengan
dua wawasan lintas-entitas: overlap produk terlaris vs. berpendapatan
tertinggi, dan korelasi Pearson jumlah pelanggan vs. pendapatan per
perwakilan penjualan

## Cakupan
Analitik "Wawasan Lanjutan" lintas-fungsi yang tidak terikat pada satu fitur domain
tertentu — misalnya, pertanyaan lintas-entitas seperti "apakah produk dengan
kuantitas terbanyak juga menghasilkan pendapatan tertinggi?" atau "apakah
jumlah pelanggan per perwakilan penjualan berkorelasi dengan pendapatan?".
Lihat `docs/analytics.md` (yang akan diisi setelah model data dasar dimigrasikan)
untuk daftar lengkap pertanyaan bisnis yang dijawab oleh dasbor ini.

## Konvensi struktur
```
features/analytics/
├── components/
├── services/
├── queries/
├── types/
└── utils/
```
Dibuat sesuai kebutuhan saat pekerjaan mulai dikerjakan — tidak disiapkan dalam
bentuk kerangka kosong sejak awal.

## Dependensi
- `lib/` (klien Supabase bersama/shared)
- Kueri agregat *read-only* yang mencakup data dari `features/sales`,
`features/products`, `features/customers`, `features/employees`, dan
`features/offices`.

## Batasan
Jangan mengubah folder fitur lain. Lakukan koordinasi melalui *issue* jika
ada dependensi bersama yang perlu diubah.