# Deployment — Referensi Cepat
Penjelasan lengkap dan detail lingkungan tersedia di `docs/deployment.md`. File ini berfungsi sebagai daftar periksa operasional.

**Status:** Live (deploy awal, manual) — https://dashboard-axon-sales.vercel.app

## Target
Vercel, project `kuliah2/dashboard-axon-sales`.

**Belum sesuai alur yang direncanakan:** deploy pertama ini dilakukan manual
(`vercel deploy --prod`) untuk memperbaiki konfigurasi environment variable,
bukan lewat CI → Testing → Deployment. Production Branch di Vercel saat ini
masih `main`, bukan `Deployment` — mengubahnya butuh akses dashboard Vercel
(Settings → Git → Production Branch), tidak tersedia lewat API/CLI. Sampai
diubah, deploy berikutnya lewat push ke `main` akan langsung live tanpa
melalui `Testing`/`Deployment` — perlakukan `main` dengan hati-hati sampai ini
diperbaiki.

## Alur (target, setelah Production Branch diperbaiki)
```
Kode → Pull Request → CI (lint/test/build) → Branch Testing → Merge → Branch Deployment → Vercel
```

## Daftar periksa pra-deployment
- [x] Proyek Supabase telah disiapkan, skema telah dimigrasi dan divalidasi
- [x] Variabel lingkungan telah diatur di Vercel (Production/Preview/Development)
- [ ] Status CI sukses (hijau) pada branch `Deployment` — belum berlaku, Production Branch masih `main`
- [x] `npm run build` berhasil dijalankan secara lokal
- [x] Tidak ada kunci `service_role` yang terekspos ke bundle klien (tidak dipakai di kode sama sekali)

Jangan pernah melakukan deployment kode yang belum lolos CI.