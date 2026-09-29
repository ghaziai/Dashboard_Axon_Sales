# Deployment — Referensi Cepat
Penjelasan lengkap dan detail lingkungan tersedia di `docs/deployment.md`. File ini berfungsi sebagai daftar periksa operasional.

**Status:** Live — https://dashboard-axon-sales.vercel.app. Alur 3-branch
(`main → Testing → Deployment`) aktif dan sudah dipakai (PR #4/#5, #7/#8).
Production Branch Vercel = `Deployment` (terverifikasi).

## Target
Vercel, project `kuliah2/dashboard-axon-sales`.

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
- [x] Production Branch Vercel = `Deployment`
- [x] `npm run build` berhasil dijalankan secara lokal
- [x] Tidak ada kunci `service_role` yang terekspos ke bundle klien (tidak dipakai di kode sama sekali)

Jangan pernah melakukan deployment kode yang belum lolos CI.