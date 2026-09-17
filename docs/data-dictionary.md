# Kamus Data

## Status: Inspeksi selesai — migrasi skema belum dijalankan

Seluruh isi dokumen ini diverifikasi langsung dari
`sql/source/classicmodels_mysql_dump.sql` (4065 baris).
Setiap klaim di bawah bisa direproduksi dengan membaca file itu pada baris
yang disebutkan.

## 1. Daftar lengkap tabel

8 tabel, sesuai urutan kemunculan di dump (baris `CREATE TABLE`):

| Tabel | Baris di dump | Jumlah baris data |
|---|---|---|
| `customers` | 33 | 122 |
| `employees` | 182 | 23 |
| `offices` | 229 | 7 |
| `orderdetails` | 257 | 2996 |
| `orders` | 3273 | 326 |
| `payments` | 3620 | 273 |
| `productlines` | 3910 | 7 |
| `products` | 3933 | 110 |

Jumlah baris dihitung dengan menghitung tuple `(...)` pada blok `insert`
masing-masing tabel (lihat §9 untuk detail per tabel).

## 2. Primary key per tabel

| Tabel | Primary Key |
|---|---|
| `customers` | `customerNumber` |
| `employees` | `employeeNumber` |
| `offices` | `officeCode` |
| `orderdetails` | **composite**: (`orderNumber`, `productCode`) |
| `orders` | `orderNumber` |
| `payments` | **composite**: (`customerNumber`, `checkNumber`) |
| `productlines` | `productLine` |
| `products` | `productCode` |

Catatan: `orderdetails` dan `payments` tidak memiliki kolom ID surrogate —
primary key-nya adalah kombinasi kolom bisnis. Ini dipertahankan apa adanya
saat migrasi (tidak menambah surrogate key tanpa alasan).

## 3. Foreign key per tabel

| Tabel | Kolom | Mengacu ke | Nama constraint (MySQL) |
|---|---|---|---|
| `customers` | `salesRepEmployeeNumber` | `employees.employeeNumber` | `customers_ibfk_1` |
| `employees` | `reportsTo` | `employees.employeeNumber` (self-reference) | `employees_ibfk_1` |
| `employees` | `officeCode` | `offices.officeCode` | `employees_ibfk_2` |
| `orderdetails` | `orderNumber` | `orders.orderNumber` | `orderdetails_ibfk_1` |
| `orderdetails` | `productCode` | `products.productCode` | `orderdetails_ibfk_2` |
| `orders` | `customerNumber` | `customers.customerNumber` | `orders_ibfk_1` |
| `payments` | `customerNumber` | `customers.customerNumber` | `payments_ibfk_1` |
| `products` | `productLine` | `productlines.productLine` | `products_ibfk_1` |

`offices` dan `productlines` tidak memiliki foreign key keluar (root tables).

## 4. Relasi antar-tabel (ringkasan)

```
offices ──< employees (officeCode)
employees ──< employees (reportsTo, self-referencing hierarchy: manajer → bawahan)
employees ──< customers (salesRepEmployeeNumber, NULLABLE — tidak semua customer punya sales rep)
customers ──< orders (customerNumber)
customers ──< payments (customerNumber)
orders ──< orderdetails (orderNumber)
productlines ──< products (productLine)
products ──< orderdetails (productCode)
```
(`A ──< B` dibaca: satu baris A dapat direferensikan banyak baris B — relasi one-to-many.)

`orderdetails` adalah tabel junction/associative antara `orders` dan
`products` (relasi many-to-many order↔product, dengan atribut tambahan
`quantityOrdered`, `priceEach`, `orderLineNumber`).

## 5. Kolom yang mengizinkan NULL (nullable)

Hanya kolom berikut yang **boleh NULL** (`DEFAULT NULL` di dump); semua
kolom lain di setiap tabel adalah `NOT NULL`:

| Tabel | Kolom nullable |
|---|---|
| `customers` | `addressLine2`, `state`, `postalCode`, `salesRepEmployeeNumber`, `creditLimit` |
| `employees` | `reportsTo` |
| `offices` | `addressLine2`, `state` |
| `orders` | `shippedDate`, `comments` |
| `productlines` | `textDescription`, `htmlDescription`, `image` |

`orderdetails`, `payments`, dan `products` tidak memiliki kolom nullable
sama sekali — semua kolomnya `NOT NULL`.

## 6. Tipe data (MySQL → PostgreSQL)

| Tipe MySQL di dump | Tipe PostgreSQL | Catatan |
|---|---|---|
| `int(11)` | `integer` | Display width `(11)` tidak berarti apa-apa di kedua engine, diabaikan |
| `smallint(6)` | `smallint` | idem |
| `varchar(N)` | `varchar(N)` | Identik |
| `decimal(10,2)` | `numeric(10,2)` | Identik secara presisi; PostgreSQL menyebutnya `numeric` |
| `date` | `date` | Identik |
| `text` | `text` | Identik |
| `mediumtext` | `text` | PostgreSQL `text` tidak punya batas ukuran seperti MySQL, jadi `mediumtext`/`text` sama-sama jadi `text` |
| `mediumblob` | `bytea` | Hanya dipakai di `productlines.image`, yang selalu `NULL` di seluruh data — dipertahankan sebagai `bytea` agar setia pada struktur sumber, bukan dihapus |

## 7. Index

Setiap foreign key di MySQL otomatis mendapat index (`KEY`) pada kolomnya —
semua terdaftar di §3. Tidak ada index tambahan di luar itu dan di luar
primary key masing-masing tabel.

## 8. Constraint

Selain primary key (§2) dan foreign key (§3), tidak ada `CHECK` constraint,
`UNIQUE` constraint tambahan, atau `DEFAULT` value non-NULL yang
didefinisikan di level skema pada dump sumber ini.

## 9. Jumlah baris per tabel (detail penghitungan)

Dihitung dengan menghitung baris yang diawali `(` pada blok `insert` tiap
tabel di `sql/source/classicmodels_mysql_dump.sql`:
- `customers`: baris 54–177 → **122** baris
- `employees`: baris 200–223 → **23** baris
- `offices`: baris 244–251 → **7** baris
- `orderdetails`: baris 269–3268 → **2996** baris
- `orders`: baris 3288–3615 → **326** baris
- `payments`: baris 3631–3905 → **273** baris
- `productlines`: baris 3920–3927 → **7** baris
- `products`: baris 3950–4065 → **110** baris

Total: **3864** baris data di seluruh dataset.

## 10. Dependensi antar-tabel (urutan migrasi)

Urutan load data yang aman (menghormati foreign key, root dulu):

```
1. offices          (tidak ada FK keluar)
2. employees        (FK → offices; FK self-reference reportsTo)
3. customers        (FK → employees, nullable)
4. productlines     (tidak ada FK keluar)
5. products         (FK → productlines)
6. orders           (FK → customers)
7. payments         (FK → customers)
8. orderdetails     (FK → orders, FK → products)
```

**Catatan migrasi untuk `employees` (self-referencing):** data sumber
sudah terurut secara topologis (baris dengan `reportsTo IS NULL` — direktur
— muncul lebih dulu, baru bawahannya). Selama urutan insert dari dump
dipertahankan apa adanya, tidak diperlukan penanganan khusus. Sebagai
jaring pengaman tambahan, `sql/schema.sql` mendefinisikan FK self-reference
ini sebagai `DEFERRABLE INITIALLY DEFERRED` agar urutan insert tidak
menjadi satu-satunya hal yang menjaga integritas referensial saat migrasi.

## 11. Keputusan yang BELUM diambil (perlu ditentukan sebelum lanjut)

- **Penamaan kolom:** dump sumber memakai `camelCase` (`customerNumber`,
  `orderNumber`, dst.). `sql/schema.sql` mempertahankan nama ini apa adanya
  (di-quote dengan `"..."` di PostgreSQL, karena identifier tanpa quote akan
  di-lowercase-kan) — bukan hasil keputusan final, hanya pilihan paling
  konservatif (tidak mengubah struktur sumber tanpa alasan). Konversi ke
  `snake_case` adalah opsi yang lebih idiomatis untuk PostgreSQL tapi
  mengubah nama kolom dari sumber — jika tim ingin melakukan ini,
  perlu keputusan eksplisit dan dicatat sebagai perubahan terpisah.
- **Provisioning proyek Supabase nyata** belum dilakukan — `sql/schema.sql`
  belum pernah dijalankan melawan database sungguhan, jadi belum
  tervalidasi secara eksekusi (baru tervalidasi secara pembacaan sumber).