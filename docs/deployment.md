# Deployment

## Status: Belum di-deploy

## Target
Vercel, deployment hanya dilakukan dari branch `Deployment` (branch rilis — tidak ada pengembangan langsung di branch ini).

## Alur
```
Kode (branch fitur)
→ Pull Request
→ GitHub Actions CI (lint, test, build)
→ Branch Testing (validasi integrasi/regresi)
→ Merge ke Deployment
→ Deployment ke Vercel
→ Pemantauan (Monitoring)
```

Kode yang gagal dalam tahap CI tidak akan pernah di-deploy.

## Environment
| Variabel Env | Lokasi pengaturan | Diekspos ke browser? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel + `.env.local` | Ya |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel + `.env.local` | Ya (dilindungi RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel (khusus server) + `.env.local` | **Tidak — sama sekali tidak** |

Lihat `.env.example` untuk daftar lengkap beserta nilai placeholder-nya.

## URL Produksi
*Menunggu — belum di-deploy.*

## Rollback
Batalkan (revert) merge commit pada branch `Deployment` dan biarkan CI/Vercel melakukan deployment ulang ke kondisi sebelumnya. Tidak diperbolehkan melakukan hotfix produksi secara manual tanpa adanya issue dan PR yang terkait (lihat `README_Dev.md` di direktori root).