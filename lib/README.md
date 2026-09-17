# Kode Library Bersama

Utilitas tingkat *framework* yang mencakup berbagai fitur: *factory* klien Supabase,
fungsi pembantu pemformatan (mata uang, tanggal), konstanta, dan tipe generik
yang digunakan bersama oleh lebih dari satu fitur.

**Status:** `supabase/client.ts` (Komponen Klien) dan `supabase/server.ts`
(Komponen Server/Action/Route Handler) sudah tersambung ke proyek Supabase
`Axon_Sales` yang aktif (`.env.local` sudah terisi di lingkungan
pengembangan). `format.ts` berisi *helper* pemformatan mata uang, angka,
persen, dan label bulan yang dipakai lintas fitur. `data/sales-facts.ts`
adalah lapisan akses data bersama: mengambil seluruh tabel dasar dari
Supabase dan menggabungkannya menjadi satu larik *fact* (`SaleFact[]`) yang
dipakai oleh setiap `features/*/services/`. Belum ada `middleware.ts`:
*middleware* penyegaran sesi (*session-refresh*) baru diperlukan setelah alur
autentikasi ditentukan (lihat `docs/architecture.md` → Authentication, saat
ini statusnya *Pending*).

## Aturan
Aturan koordinasi yang sama dengan `components/ui/`: perubahan yang bersifat
menambah (utilitas baru) diperbolehkan; perubahan pada *export* bersama yang sudah
ada dan menjadi dependensi fitur lain memerlukan koordinasi terlebih dahulu.