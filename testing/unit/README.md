# Pengujian Unit

Rendering komponen, fungsi utilitas, dan logika murni untuk setiap fitur.

**Status:** Tahap pertama diimplementasikan menggunakan **Vitest** (lihat
`vitest.config.ts` di root, dijalankan lewat `npm test`). 52 test mencakup
seluruh fungsi agregasi murni di setiap `features/*/services/*.ts`
(dashboard, sales, products, customers, employees, offices, analytics) serta
`lib/format.ts` dan `monthKey()` di `lib/data/sales-facts.ts` — termasuk
verifikasi aritmatika (total revenue/quantity/orders), edge case dataset
kosong, dan cross-check antar hasil agregasi (mis. total pendapatan dari
`yearlyRevenue` harus sama dengan total dari `topMonths`). `fixtures.ts`
berisi data contoh bersama yang nilainya dihitung manual di komentar setiap
test, bukan angka acak.

**Belum tercakup:** rendering komponen (`components/ui/*`, halaman `app/*`) —
akan menyusul begitu dibutuhkan koordinasi lintas fitur untuk memilih
React Testing Library / testing-library setup, mengikuti `docs/testing.md`.