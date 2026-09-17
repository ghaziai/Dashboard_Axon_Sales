# Fitur: Dasbor

- **Pemilik:** Ghazi
- **Status:** Diimplementasikan — halaman Ikhtisar (`app/page.tsx`) dengan KPI,
tren pendapatan bulanan, periode kinerja terbaik, dan top 5 produk/pelanggan

## Cakupan
- Kerangka/tata letak dasbor dan navigasi (Ikhtisar, Analisis Penjualan, Analisis Produk,
Analisis Pelanggan, Analisis Karyawan, Analisis Kantor, Advanced Insights).
- Halaman ikhtisar: KPI tingkat atas (total pendapatan, total pesanan, total kuantitas
terjual, tren pendapatan, periode dengan kinerja terbaik).
- Kerangka dasbor lintas-fitur yang digunakan bersama oleh fitur-fitur analisis lainnya di bawah ini.

## Konvensi struktur
Setiap fitur diharapkan mempertahankan struktur ini seiring berjalannya pengembangan (dibuat sesuai kebutuhan, bukan kerangka kosong yang disiapkan di awal):
```
features/dashboard/
├── components/   Komponen UI khusus untuk fitur ini
├── services/      Pemanggilan akses data ke Supabase
├── queries/       Definisi SQL / query-builder
├── types/         Tipe TypeScript untuk domain fitur ini
└── utils/         Fungsi pembantu (helper) lokal fitur
```

## Dependensi
- `lib/` (klien Supabase bersama, fungsi pembantu pemformatan)
- `components/ui/` (komponen dasar UI bersama)
- `sql/analytics.sql` (setelah diisi pada tahap migrasi data)

## Batasan
Jangan mengubah folder fitur lain. Lakukan koordinasi melalui *issue* jika dependensi bersama
(`lib/`, `components/ui/`, konfigurasi akar) perlu diubah.