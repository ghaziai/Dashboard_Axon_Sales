# Kamus Data

## Status: Tertunda

Pemeriksaan skema **belum** dilakukan untuk proyek ini. Tidak ada
informasi mengenai tabel, kolom, kunci, atau batasan (*constraint*) yang didokumentasikan di sini
untuk menghindari penetapan struktur yang belum diverifikasi.

## Informasi yang tersedia
Kumpulan data sumber utama (berupa *dump* MySQL dari `classicmodels`)
telah disimpan di `sql/source/` sebagai referensi. Pemindaian awal menemukan **8**
pernyataan `CREATE TABLE` dalam *dump* tersebut, yang sesuai dengan tabel-tabel
yang diketahui dalam skema `classicmodels` (`customers`, `products`, `productlines`,
`orders`, `orderdetails`, `payments`, `employees`, `offices`) — namun hal ini belum
diverifikasi secara mendetail untuk setiap kolomnya. Oleh karena itu, tidak boleh ada asumsi
mengenai nama kolom, tipe data, sifat *nullability*, kunci, atau batasan tertentu
sebelum pemeriksaan di bawah ini selesai dilakukan.

## Langkah selanjutnya: Tahap Migrasi Data
Sebelum skema PostgreSQL/Supabase dibuat, hal-hal berikut harus
diidentifikasi dan didokumentasikan di sini, sesuai dengan protokol migrasi proyek:

1. Daftar lengkap tabel
2. *Primary key* (kunci utama)
3. *Foreign key* (kunci asing)
4. Relasi antar-tabel
5. Kolom yang mengizinkan nilai *null* (*nullable columns*)
6. Tipe data (beserta pemetaan tipe dari MySQL ke PostgreSQL)
7. Indeks
8. Batasan (*constraints*)
9. Jumlah baris per tabel
10. Dependensi antar-tabel (urutan migrasi)

Dokumen ini akan dilengkapi — tabel demi tabel — seiring dilakukannya pemeriksaan tersebut,
dan akan menjadi acuan bagi `sql/schema.sql` serta `sql/migration.sql`.