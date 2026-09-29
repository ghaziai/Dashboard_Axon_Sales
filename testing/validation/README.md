# Uji Validasi Data

**Status:** Diimplementasikan — `data-quality.test.ts` (14 pemeriksaan: NULL,
nilai tidak valid, integritas FK/relasi, jumlah baris), mirror dari
`sql/tests.sql`, dijalankan lewat `@supabase/supabase-js` (anon key) terhadap
project Supabase asli. Tidak ada duplicate-detection terpisah — setiap tabel
sudah punya `PRIMARY KEY` yang mencegah duplikat di level skema (lihat
`docs/testing.md` untuk penjelasan lengkap).

Jalankan lokal: `npm run test:validation` (butuh `NEXT_PUBLIC_SUPABASE_URL`
dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` di `.env.local`). Di CI, dua nilai yang
sama disuplai lewat GitHub Actions Variables (bukan Secret — nilainya memang
publik, sama seperti yang dikirim ke browser).