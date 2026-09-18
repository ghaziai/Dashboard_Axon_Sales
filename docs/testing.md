# Strategi Pengujian

## Status
Dasbor tahap pertama dan data migrasi sudah tersedia (lihat README.md §5, §11).
*Test runner* sudah dipilih: **Vitest** (`vitest.config.ts`, `npm test`).
Lapisan **Unit** sudah diimplementasikan (52 test, lihat `testing/unit/README.md`)
dan terhubung ke CI (`.github/workflows/ci.yml`: lint → test → build).
Lapisan **Integrasi**, **Validasi data**, dan **Validasi analitik SQL** masih
*Pending* — lihat catatan per lapisan di bawah.

## Lapisan

| Lapisan | Lokasi | Cakupan | Status |
|---|---|---|---|
| Unit | `testing/unit/` | Fungsi agregasi murni tiap fitur (`features/*/services/*.ts`) + `lib/format.ts` | **Diimplementasikan**, jalan di CI |
| Validasi data | `testing/validation/`, `sql/tests.sql` | Pemeriksaan nilai NULL, integritas FK/relasi, nilai tidak valid (harga/kuantitas negatif), jumlah baris | Kueri sudah ada & sudah dijalankan manual sekali saat migrasi (lihat catatan di `sql/tests.sql`); **belum otomatis di CI** — lihat catatan di bawah |
| Validasi analitik SQL | `testing/validation/` | Kueri agregasi (pendapatan/pesanan/kuantitas/pelanggan/produk) menghasilkan data yang konsisten dan benar | Sudah tercakup secara tidak langsung oleh lapisan Unit (agregasi dilakukan di `lib/data/sales-facts.ts` + `features/*/services/`, bukan di SQL — lihat `docs/architecture.md` → Model data). Belum ada kueri SQL analitik murni di `sql/analytics.sql` |
| Integrasi | `testing/integration/` | Alur lintas fitur: filter → kueri → render, siklus CRUD dengan Supabase | Pending — menunggu fitur CRUD pertama (lihat Issue #1, #2) |
| Build | CI (`npm run build`) | Kompilasi aplikasi dan pemeriksaan tipe (type-check) | Diimplementasikan |

Setiap fitur wajib memiliki status *Loading*, *Empty* (kosong), *Error*, dan *Success* —
yang diverifikasi melalui pengujian integrasi setelah fitur tersebut tersedia.

## Mengapa `sql/tests.sql` belum otomatis di CI
Menjalankannya otomatis butuh CI terhubung ke Supabase Postgres (connection
string atau service-role key sebagai GitHub Secret). Ini keputusan yang
sengaja ditunda, bukan terlewat: repo ini publik, jadi menambahkan kredensial
database sebagai secret perlu dipertimbangkan dulu (siapa yang boleh trigger
run-nya, apakah pakai role read-only terpisah, dst.) — lihat prinsip
"Security" di aturan proyek. Untuk saat ini, kueri di `sql/tests.sql`
dijalankan manual lewat Supabase SQL editor/MCP saat ada perubahan skema.

## Duplicate detection
Tidak ada kueri duplicate-detection terpisah di `sql/tests.sql` karena setiap
tabel sudah punya `PRIMARY KEY` (lihat `sql/schema.sql` dan
`docs/data-dictionary.md` §2) — PostgreSQL menolak baris duplikat pada level
skema saat *insert*, jadi tidak ada kondisi yang bisa dicek ulang secara
runtime tanpa membuat asumsi bisnis baru yang tidak berdasar pada skema
sumber (mis. "checkNumber pasti unik lintas customer" — itu tidak dinyatakan
di manapun pada dump sumber, jadi sengaja tidak diasumsikan/diperiksa).