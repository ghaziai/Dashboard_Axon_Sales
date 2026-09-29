# Strategi Pengujian

## Status
Dasbor tahap pertama dan data migrasi sudah tersedia (lihat README.md §5, §11).
*Test runner*: **Vitest**, dengan dua konfigurasi terpisah:
- `vitest.config.mts` / `npm test` — unit test murni (offline, tanpa network)
- `vitest.validation.config.mts` / `npm run test:validation` — validasi data terhadap Supabase asli

Lapisan **Unit** dan **Validasi data** sudah diimplementasikan dan terhubung
ke CI (`.github/workflows/ci.yml`: lint → test → build → data validation).
Lapisan **Integrasi** dan **Validasi analitik SQL** murni (`sql/analytics.sql`)
masih *Pending* — lihat catatan per lapisan di bawah.

## Lapisan

| Lapisan | Lokasi | Cakupan | Status |
|---|---|---|---|
| Unit | `testing/unit/` | Fungsi agregasi murni tiap fitur (`features/*/services/*.ts`) + `lib/format.ts` | **Diimplementasikan**, jalan di CI |
| Validasi data | `testing/validation/data-quality.test.ts` (mirror `sql/tests.sql`) | NULL, nilai tidak valid (harga/kuantitas negatif), integritas FK/relasi, jumlah baris | **Diimplementasikan** (14 kueri), jalan di CI lewat `npm run test:validation`, pakai anon key sebagai GitHub Actions **Variable** (bukan Secret — lihat di bawah) |
| Validasi analitik SQL | `testing/validation/` | Kueri agregasi (pendapatan/pesanan/kuantitas/pelanggan/produk) menghasilkan data yang konsisten dan benar | Sudah tercakup secara tidak langsung oleh lapisan Unit (agregasi dilakukan di `lib/data/sales-facts.ts` + `features/*/services/`, bukan di SQL — lihat `docs/architecture.md` → Model data). Belum ada kueri SQL analitik murni di `sql/analytics.sql` |
| Integrasi | `testing/integration/` | Alur lintas fitur: filter → kueri → render, siklus CRUD dengan Supabase | Pending — menunggu fitur CRUD pertama (lihat Issue #1, #2) |
| Build | CI (`npm run build`) | Kompilasi aplikasi dan pemeriksaan tipe (type-check) | Diimplementasikan |

Setiap fitur wajib memiliki status *Loading*, *Empty* (kosong), *Error*, dan *Success* —
yang diverifikasi melalui pengujian integrasi setelah fitur tersebut tersedia.

## Bagaimana `sql/tests.sql` diotomatisasi di CI
Sebelumnya ditunda karena menjalankan SQL mentah butuh koneksi Postgres
langsung (connection string/service-role key) sebagai GitHub Secret di repo
publik. Solusinya: `testing/validation/data-quality.test.ts` menjalankan
kueri yang setara lewat **PostgREST (`@supabase/supabase-js`) memakai anon
key** — key publik yang sama yang sudah dikirim ke browser (RLS mengizinkan
`anon` membaca semua tabel, lihat §5 `README.md`). Karena nilainya memang
sudah publik, disimpan sebagai GitHub Actions **Variable**
(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`), bukan Secret —
tidak perlu kredensial database sensitif sama sekali. `sql/tests.sql` tetap
dipertahankan sebagai referensi kueri SQL mentahnya.

## Duplicate detection
Tidak ada kueri duplicate-detection terpisah di `sql/tests.sql` karena setiap
tabel sudah punya `PRIMARY KEY` (lihat `sql/schema.sql` dan
`docs/data-dictionary.md` §2) — PostgreSQL menolak baris duplikat pada level
skema saat *insert*, jadi tidak ada kondisi yang bisa dicek ulang secara
runtime tanpa membuat asumsi bisnis baru yang tidak berdasar pada skema
sumber (mis. "checkNumber pasti unik lintas customer" — itu tidak dinyatakan
di manapun pada dump sumber, jadi sengaja tidak diasumsikan/diperiksa).