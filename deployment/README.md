# Deployment — Referensi Cepat
Penjelasan lengkap dan detail lingkungan tersedia di `docs/deployment.md`. File ini berfungsi sebagai daftar periksa operasional.

**Status:** Belum di-deploy.

## Target
Vercel, deployment hanya dilakukan dari branch `Deployment`.

## Alur
```
Kode → Pull Request → CI (lint/test/build) → Branch Testing → Merge → Branch Deployment → Vercel
```

## Daftar periksa pra-deployment (untuk diselesaikan saat tahap ini dimulai)
- [ ] Proyek Supabase telah disiapkan, skema telah dimigrasi dan divalidasi
- [ ] Variabel lingkungan telah diatur di Vercel (mengikuti `.env.example`)
- [ ] Status CI sukses (hijau) pada branch `Deployment`
- [ ] `npm run build` berhasil dijalankan secara lokal
- [ ] Tidak ada kunci `service_role` yang terekspos ke bundle klien

Jangan pernah melakukan deployment kode yang belum lolos CI.