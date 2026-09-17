# Strategi Pengujian

## Status
Rencana telah ditetapkan (tahap awal/fondasi); belum ada pengujian yang dibuat karena belum ada aplikasi atau data migrasi untuk diuji.

## Lapisan

| Lapisan | Lokasi | Cakupan |
|---|---|---|
| Validasi data | `testing/validation/`, `sql/tests.sql` | Pemeriksaan nilai NULL, deteksi duplikasi, integritas FK/relasi, pemeriksaan nilai tidak valid (harga/kuantitas negatif), validasi tipe data |
| Validasi analitik SQL | `testing/validation/` | Kueri agregasi (pendapatan/pesanan/kuantitas/pelanggan/produk) menghasilkan data yang konsisten dan benar |
| Unit | `testing/unit/` | Rendering komponen, fungsi utilitas |
| Integrasi | `testing/integration/` | Alur lintas fitur: filter → kueri → render, siklus CRUD dengan Supabase |
| Build | CI (`npm run build`) | Kompilasi aplikasi dan pemeriksaan tipe (type-check) |

Setiap fitur wajib memiliki status *Loading*, *Empty* (kosong), *Error*, dan *Success* —
yang diverifikasi melalui pengujian integrasi setelah fitur tersebut tersedia.

## Waktu penambahan pengujian
*Test runner* konkret (misalnya Vitest/Jest untuk pengujian unit/integrasi) akan
dipilih dan didokumentasikan di sini serta di `README_Ghazi.md`, lalu
diintegrasikan ke dalam `.github/workflows/ci.yml` saat fitur pertama siap —
bukan sebelumnya, guna menghindari keberadaan *framework* pengujian yang tidak terpakai
atau belum dikonfigurasi sepenuhnya di dalam repositori.