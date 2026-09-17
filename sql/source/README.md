# Dataset Sumber

`classicmodels_mysql_dump.sql` adalah **dataset sumber otoritatif** untuk
proyek ini, yang disalin di sini secara persis (*verbatim*) dari hasil ekspor MySQL yang disediakan.

## Verifikasi sejauh ini (hanya bagian header + tabel pertama — bukan pemeriksaan menyeluruh)
- Nama database: `classicmodels`
- Sumber: Database Contoh MySQL `classicmodels`, versi dump 3.1
(`http://www.mysqltutorial.org`)
- Engine: InnoDB, charset: `latin1`
- 4065 baris, 8 pernyataan `CREATE TABLE` (sesuai dengan tabel-tabel
`classicmodels` yang umum diketahui — `customers`, `products`, `productlines`,
`orders`, `orderdetails`, `payments`, `employees`, `offices` — namun kolom,
kunci, dan batasan (*constraint*) yang tepat untuk setiap tabel **belum**
semuanya diverifikasi; lihat `docs/data-dictionary.md`)
- Terdapat *foreign key* (misalnya `customers.salesRepEmployeeNumber` →
`employees.employeeNumber`), yang mengonfirmasi adanya ketergantungan antar-tabel

## Jangan ubah file ini
File ini merupakan salinan referensi dari sumber aslinya. Transformasi data dilakukan di
`sql/cleaning.sql`; skema PostgreSQL target ada di
`sql/schema.sql`; prosedur migrasi ada di `sql/migration.sql`.