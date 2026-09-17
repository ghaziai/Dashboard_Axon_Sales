# Uji Validasi Data

Pemeriksaan kualitas data otomatis yang sesuai dengan `sql/tests.sql`: validasi
NULL, deteksi duplikasi, validasi *foreign-key*/relasi, validasi nilai
tidak valid (misalnya kuantitas/harga negatif), dan validasi tipe data.
Lihat contoh "Validasi Otomatis" pada ringkasan proyek.

**Status:** Belum diimplementasikan — menunggu tahap migrasi data, karena
pengujian ini memvalidasi set data PostgreSQL/Supabase hasil migrasi.