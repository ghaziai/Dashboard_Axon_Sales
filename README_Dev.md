# Panduan Kontribusi

Untuk kontributor yang bergabung dengan repositori ini. Harap baca ini sebelum mengubah
apa pun di luar folder fitur Anda sendiri.

## Kontributor dan kepemilikan
| Kontributor | Tanggung Jawab |
|---|---|
| Kontributor 1 | Fondasi proyek, arsitektur, DevOps, CI/CD, inti dashboard (`features/dashboard`, `features/sales`, `features/analytics`), integrasi, deployment, dokumentasi, infrastruktur pengujian, fondasi analitik |
| Kontributor 2 | `features/customers/` |
| Kontributor 3 | `features/products/`, `features/orders/` |

## Aturan: tetap berada di dalam folder fitur Anda
Setiap folder `features/<name>/` adalah batasan Anda. Jangan mengimplementasikan atau
memodifikasi folder fitur milik kontributor lain. Jika pekerjaan Anda benar-benar memerlukan
perubahan di sana, koordinasikan dengan pemiliknya terlebih dahulu (buat issue → diskusikan → mereka yang mengimplementasikan, atau mereka menyetujui Anda melakukannya dalam PR khusus).

## File bersama / sensitif — koordinasi diperlukan
Jangan mengubah file-file ini tanpa membuka issue terlebih dahulu, menjelaskan alasannya,
dan mendapatkan tinjauan (review) atas perubahan tersebut:
- `package.json`, `package-lock.json`
- `next.config.ts`
- `tsconfig.json`
- `middleware.ts` (belum ada)
- `.env.example`
- `supabase/` (konfigurasi, migrasi)
- `.github/workflows/` (belum ada)
- `app/layout.tsx` (layout root)
- File konfigurasi tingkat root lainnya

Alur koordinasi untuk perubahan file bersama:
```
Buka Issue → Jelaskan alasan & dampak → Dapatkan persetujuan → Implementasikan → Uji → Commit → Dokumentasikan
```

Sumber daya bersama yang sifatnya hanya penambahan (`components/ui/`, `lib/`): menambahkan
ekspor baru diperbolehkan tanpa perlu bertanya; Mengubah atau menghapus *export* yang sudah ada
yang menjadi dependensi fitur lain memerlukan koordinasi yang sama seperti di atas.

## Strategi *branch*
> Nama *branch* menggunakan format *kebab-case* (`kontributor-1`, bukan `Kontributor 1`) —
> nama referensi *git* tidak boleh mengandung spasi.

| Branch | Tujuan |
|---|---|
| `main` | *Trunk*. Menyimpan fondasi/riwayat bersama (tahap ini) dan menjadi titik integrasi tempat *branch* kontributor dibuat serta tempat PR (Pull Request) dikirimkan kembali. |
| `Deployment` | *Branch* rilis. **Jangan pernah melakukan pengembangan langsung di sini.** Hanya menerima *merge* yang telah lolos tahap `Testing`. |
| `Testing` | Integrasi/regresi/validasi *end-to-end* sebelum rilis. |
| `kontributor-1` | *Branch* kerja Muhammad Ghazi |
| `kontributor-2` | *Branch* kerja Toimul Setyo Andri |
| `kontributor-3` | *Branch* kerja Ilham Widi Mahendra |

Alur:
```
kontributor-1 ┐
kontributor-2 ├─→ PR ke main → Testing → Deployment → Vercel
kontributor-3 ┘
```

## Alur kerja harian
```bash
git pull
# ...buat perubahan kecil yang berfungsi dan terverifikasi...
git add <file spesifik>
git commit -m "tipe: deskripsi"
git push
```
Jangan menggabungkan perubahan yang tidak saling berkaitan ke dalam satu *commit*. Satu *commit* = satu perubahan logis yang dapat dijalankan/diverifikasi.

## Konvensi commit (Conventional Commits)
`feat:` `fix:` `refactor:` `test:` `docs:` `chore:` `ci:` `build:` `perf:`

Baik: `feat: add customer search`
Buruk: `update project`

## Sebelum membuka PR
- [ ] `npm install` berhasil
- [ ] `npm run lint` lolos
- [ ] `npm run build` berhasil
- [ ] Tes yang relevan lolos (setelah *test suite* tersedia untuk area yang diubah)
- [ ] Cakupan/status `features/<name>/README.md` Anda masih akurat
- [ ] Jika Anda mengubah berkas bersama (*shared file*), masalah koordinasi terkait dicantumkan dalam PR

## Jangan diubah (tanpa mengikuti alur koordinasi di atas)
- Folder `features/<name>/` milik kontributor lain
- `package.json` / `package-lock.json`
- `next.config.ts`, `tsconfig.json`
- `app/layout.tsx`
- `.github/workflows/` (setelah tersedia)
- Konfigurasi `supabase/` (setelah tersedia)

## Lokasi berkas
Lihat [`README.md`](README.md) bagian 13 untuk struktur repositori, dan
[`docs/architecture.md`](docs/architecture.md) untuk penjelasan latar belakangnya.