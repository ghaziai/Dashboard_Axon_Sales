# Deployment

## Status: Live — alur 3-branch (main → Testing → Deployment) aktif

Project Vercel: `kuliah2/dashboard-axon-sales`. Model rilis: **trunk-based
untuk pengembangan** (`main` menerima semua PR dari branch kontributor),
**promosi manual bertahap untuk rilis** (`main` → `Testing` → `Deployment`,
masing-masing lewat PR + CI, bukan langsung push/force-push). Ini sengaja
dipilih (bukan `main` langsung ke production) supaya ada jeda terkendali
antara "kode tergabung & lolos CI" dan "kode live" — lihat riwayat
percakapan untuk pertimbangan lengkapnya.

Deploy pertama sempat dilakukan manual via `vercel deploy --prod` untuk
memperbaiki environment variable yang sempat kosong. Sejak itu, `Testing`
dan `Deployment` sudah disusulkan ke commit yang sama dengan `main` beberapa
kali lewat PR (#4/#5, lalu #7/#8) — CI lolos setiap kali.

**Production Branch di Vercel sudah `Deployment`** (diubah manual lewat
dashboard oleh pemilik project, diverifikasi lewat `GET /v9/projects/...` →
`link.productionBranch: "Deployment"`). Alur rilis 3-branch di bawah ini
sudah berlaku penuh — push/merge ke `main` atau `Testing` tidak lagi memicu
production deploy, hanya merge ke `Deployment` yang memicu.

## Target
Vercel, deployment production hanya dipicu dari branch `Deployment` (branch rilis — tidak ada pengembangan langsung di branch ini). Sudah berlaku, bukan lagi rencana.

## Alur
```
Kode (branch fitur)
→ Pull Request ke main
→ GitHub Actions CI (lint, test, build)
→ Branch Testing (validasi integrasi/regresi, via PR main → Testing)
→ Branch Deployment (rilis, via PR Testing → Deployment)
→ Deployment ke Vercel (otomatis, setelah Production Branch = Deployment)
→ Pemantauan (Monitoring)
```

Kode yang gagal dalam tahap CI tidak akan pernah ter-merge (branch protection
mewajibkan status check `validate` lolos di ketiga branch: `main`, `Testing`,
`Deployment`).

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