# Kode Library Bersama

Utilitas tingkat *framework* yang mencakup berbagai fitur: *factory* klien Supabase,
fungsi pembantu pemformatan (mata uang, tanggal), konstanta, dan tipe generik
yang digunakan bersama oleh lebih dari satu fitur.

**Status:** `supabase/client.ts` (Komponen Klien) dan `supabase/server.ts`
(Komponen Server/Action/Route Handler) sudah tersedia dan siap digunakan setelah
`.env.local` diisi dengan URL/kunci *anon* proyek Supabase yang sebenarnya
(lihat `.env.example` di *root*). Belum ada proyek Supabase aktif yang terhubung —
itu adalah tahap berikutnya (migrasi data). Belum ada `middleware.ts`: *middleware*
penyegaran sesi (*session-refresh*) baru diperlukan setelah alur autentikasi
ditentukan (lihat `docs/architecture.md` → Authentication, saat ini statusnya *Pending*).
Belum ada logika bisnis lain di sini.

## Aturan
Aturan koordinasi yang sama dengan `components/ui/`: perubahan yang bersifat
menambah (utilitas baru) diperbolehkan; perubahan pada *export* bersama yang sudah
ada dan menjadi dependensi fitur lain memerlukan koordinasi terlebih dahulu.