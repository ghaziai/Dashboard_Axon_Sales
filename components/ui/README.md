# Komponen Dasar UI Bersama

Elemen penyusun UI yang digunakan lintas fitur dan tidak memuat logika bisnis. misalnya tombol, kartu, tabel, input, modal, header halaman, badge, komponen untuk status kosong/error/loading, dll.

**Status:** Belum diimplementasikan (tahap pengembangan fondasi).

## Aturan
Folder ini digunakan bersama oleh semua fitur. Menambahkan komponen dasar baru diperbolehkan;
namun, mengubah atau menghapus komponen yang sudah ada dan menjadi dependensi fitur lain memerlukan koordinasi (buka *issue*, tandai pemilik fitur terkait) karena tindakan tersebut dapat mengganggu pekerjaan kontributor lain yang sedang berlangsung. Komponen khusus fitur (yang tidak digunakan kembali di tempat lain) harus ditempatkan di dalam direktori `features/<name>/components/` milik fitur tersebut, bukan disini.