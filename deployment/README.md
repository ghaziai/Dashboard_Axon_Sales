# Deployment — Referensi Cepat
Penjelasan lengkap dan detail lingkungan tersedia di `docs/deployment.md`. File ini berfungsi sebagai daftar periksa operasional.

**Status:** Live — https://dashboard-axon-sales.vercel.app. Alur 3-branch
(`main → Testing → Deployment`) aktif dan sudah dipakai (PR #4, #5).

## Target
Vercel, project `kuliah2/dashboard-axon-sales`.

**Satu langkah manual tersisa:** Production Branch di Vercel masih `main`,
belum `Deployment` — ubah di Settings → Git → Production Branch (tidak ada
cara lewat API/CLI, sudah dicek). Sampai diubah, push ke `main` masih memicu
production deploy langsung; `Testing`/`Deployment` sudah berfungsi sebagai
gate PR + CI, tapi belum jadi pemicu deploy yang sesungguhnya.

## Alur
```
Kode → Pull Request ke main → CI (lint/test/build)
→ PR main → Testing (validasi integrasi)
→ PR Testing → Deployment (rilis)
→ Vercel (otomatis, setelah Production Branch = Deployment)
```

## Daftar periksa pra-deployment
- [x] Proyek Supabase telah disiapkan, skema telah dimigrasi dan divalidasi
- [x] Variabel lingkungan telah diatur di Vercel (Production/Preview/Development)
- [x] Branch protection aktif di `main`, `Testing`, `Deployment` (wajib PR + status check `validate`)
- [ ] Production Branch Vercel = `Deployment` — masih `main`, menunggu langkah manual di atas
- [x] `npm run build` berhasil dijalankan secara lokal
- [x] Tidak ada kunci `service_role` yang terekspos ke bundle klien (tidak dipakai di kode sama sekali)

Jangan pernah melakukan deployment kode yang belum lolos CI.