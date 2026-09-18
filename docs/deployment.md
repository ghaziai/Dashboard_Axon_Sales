# Deployment

## Status: Live (deploy awal, manual — belum lewat alur CI→Testing→Deployment)

Project Vercel: `kuliah2/dashboard-axon-sales`. Deploy pertama dilakukan
manual via `vercel deploy --prod` untuk memperbaiki environment variable yang
sempat salah/kosong (lihat riwayat percakapan — root cause: env var Supabase
belum terisi saat deploy awal lewat dashboard Vercel). Karena itu, deploy ini
**belum melalui** alur CI → Testing → Deployment di bawah.

**Gap yang diketahui:** Production Branch di pengaturan Vercel masih `main`,
bukan `Deployment`. Mengubahnya butuh akses dashboard Vercel (Settings → Git
→ Production Branch) — tidak ada endpoint API/CLI publik untuk ini per
pemeriksaan `vercel api list` dan dokumentasi REST API Vercel. Sampai diubah
manual, push ke `main` akan otomatis men-trigger production deploy, melewati
`Testing`/`Deployment`.

## Target
Vercel, deployment seharusnya hanya dilakukan dari branch `Deployment` (branch rilis — tidak ada pengembangan langsung di branch ini) — lihat gap di atas.

## Alur (target, setelah Production Branch diperbaiki)
```
Kode (branch fitur)
→ Pull Request
→ GitHub Actions CI (lint, test, build)
→ Branch Testing (validasi integrasi/regresi)
→ Merge ke Deployment
→ Deployment ke Vercel
→ Pemantauan (Monitoring)
```

Kode yang gagal dalam tahap CI tidak akan pernah di-deploy — begitu Production Branch diperbaiki.

## Environment
| Variabel Env | Lokasi pengaturan | Diekspos ke browser? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel + `.env.local` | Ya |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel + `.env.local` | Ya (dilindungi RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel (khusus server) + `.env.local` | **Tidak — sama sekali tidak** |

Lihat `.env.example` untuk daftar lengkap beserta nilai placeholder-nya.

## URL Produksi
https://dashboard-axon-sales.vercel.app

## Rollback
Batalkan (revert) merge commit pada branch `Deployment` dan biarkan CI/Vercel melakukan deployment ulang ke kondisi sebelumnya. Tidak diperbolehkan melakukan hotfix produksi secara manual tanpa adanya issue dan PR yang terkait (lihat `README_Dev.md` di direktori root).