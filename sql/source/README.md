# Dataset Sumber

`classicmodels_mysql_dump.sql` adalah **dataset sumber otoritatif** untuk
proyek ini, yang disalin di sini secara persis (*verbatim*) dari hasil ekspor MySQL yang disediakan.

## Verifikasi (pemeriksaan menyeluruh — selesai)
- Nama database: `classicmodels`
- Sumber: Database Contoh MySQL `classicmodels`, versi dump 3.1
(`http://www.mysqltutorial.org`)
- Engine: InnoDB, charset: `latin1`
- 4065 baris, 8 tabel: `customers`, `employees`, `offices`, `orderdetails`,
`orders`, `payments`, `productlines`, `products`
- Seluruh kolom, tipe data, primary key, foreign key, index, constraint,
kolom nullable, dan jumlah baris per tabel sudah diverifikasi dan
didokumentasikan lengkap di `docs/data-dictionary.md`
- 8 foreign key ditemukan (termasuk satu self-reference pada
`employees.reportsTo`), mengonfirmasi ketergantungan antar-tabel — lihat
`docs/data-dictionary.md` §3–4 untuk detail lengkap

## Jangan ubah file ini
File ini merupakan salinan referensi dari sumber aslinya. Transformasi data dilakukan di
`sql/cleaning.sql`; skema PostgreSQL target ada di
`sql/schema.sql`; prosedur migrasi ada di `sql/migration.sql`.