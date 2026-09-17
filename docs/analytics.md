# Analitik

## Status: Tertunda

Belum ada kueri analitik yang tersedia — kueri-kueri tersebut bergantung pada skema PostgreSQL yang telah dimigrasikan (lihat `docs/data-dictionary.md`, yang saat ini masih tertunda). Setelah dilengkapi, dokumen ini akan memuat daftar setiap pertanyaan bisnis yang dapat dijawab oleh dasbor ini, dikelompokkan berdasarkan domain (Pendapatan, Pelanggan, Produk, Perwakilan Penjualan, Operasional — sesuai dengan ringkasan proyek), dengan masing-masing poin dipetakan ke:

- Kueri SQL (di `sql/analytics.sql`) yang menjawab pertanyaan tersebut
- Fitur/komponen yang menampilkannya
- Uji validasi (di `testing/validation/`) yang memastikan kebenaran
perhitungannya

Hanya metrik yang dapat dibuktikan berdasarkan data aktual hasil migrasi yang akan didokumentasikan di sini — tidak ada KPI yang dibuat-buat.