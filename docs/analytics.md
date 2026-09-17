# Analitik

## Status: Tahap pertama diimplementasikan

Setiap pertanyaan bisnis di bawah ini dijawab dengan mengagregasi
`lib/data/sales-facts.ts` (join `orders` + `orderdetails` + `products` +
`customers` + `employees` + `offices` dari Supabase, dilakukan di memori
karena dataset-nya kecil) di dalam service milik masing-masing fitur. Belum
ada uji validasi otomatis (`testing/validation/`) — lihat `docs/testing.md`.

| Domain | Pertanyaan bisnis | Service | Halaman |
|---|---|---|---|
| Ikhtisar | Total pendapatan, total pesanan, total kuantitas, rata-rata nilai pesanan | `features/dashboard/services/overview.ts` | `/` |
| Ikhtisar | Tren pendapatan bulanan & periode kinerja terbaik | `features/dashboard/services/overview.ts` | `/` |
| Penjualan | Pendapatan & jumlah pesanan per tahun, perubahan YoY | `features/sales/services/sales-analysis.ts` | `/sales` |
| Penjualan | Distribusi pesanan berdasarkan status | `features/sales/services/sales-analysis.ts` | `/sales` |
| Penjualan | 10 periode (bulan) dengan pendapatan tertinggi | `features/sales/services/sales-analysis.ts` | `/sales` |
| Produk | Produk dengan pendapatan tertinggi & terlaris (kuantitas) | `features/products/services/product-analysis.ts` | `/products` |
| Produk | Kinerja per lini produk (productLine) | `features/products/services/product-analysis.ts` | `/products` |
| Pelanggan | Pelanggan dengan pendapatan tertinggi & jumlah pesanan | `features/customers/services/customer-analysis.ts` | `/customers` |
| Pelanggan | Distribusi pendapatan berdasarkan negara | `features/customers/services/customer-analysis.ts` | `/customers` |
| Karyawan | Pendapatan, jumlah pelanggan, jumlah pesanan per perwakilan penjualan | `features/employees/services/employee-analysis.ts` | `/employees` |
| Kantor | Pendapatan, jumlah pelanggan, jumlah karyawan per kantor & wilayah | `features/offices/services/office-analysis.ts` | `/offices` |
| Wawasan Lanjutan | Apakah produk terlaris (kuantitas) juga berpendapatan tertinggi? | `features/analytics/services/insights.ts` | `/insights` |
| Wawasan Lanjutan | Korelasi jumlah pelanggan vs. pendapatan per perwakilan penjualan (Pearson) | `features/analytics/services/insights.ts` | `/insights` |

## Belum tercakup
- `sql/analytics.sql` (kueri SQL murni) masih kosong — agregasi saat ini
  dilakukan di TypeScript, bukan di database. Ini cukup untuk ukuran dataset
  ini (~3.9 ribu baris); pindah ke SQL view/RPC baru diperlukan jika volume
  data bertambah signifikan.
- Analitik `payments` (pola pembayaran pelanggan) — domain milik
  `features/payments/`, belum diimplementasikan.
- Analitik `orders` mendetail (nilai rata-rata pesanan per status, dll. di
  luar yang sudah ada di `/sales`) — domain milik `features/orders/`, belum
  diimplementasikan.
