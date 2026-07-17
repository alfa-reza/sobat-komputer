# New Sobat Komputer

Website profil statis New Sobat Komputer di Kejobong, Purbalingga.

## File Utama

- `index.html`: konten, metadata, navigasi, dan tautan integrasi.
- `assets/css/style.css`: seluruh gaya responsif native CSS.
- `index.md`: file lama repository; bukan entry point GitHub Pages.

Semua path aset memakai path relatif agar kompatibel dengan GitHub Project Pages.

## Pembaruan Konten

- Ubah layanan, alamat, jam, nomor, WhatsApp, sosial, dan peta di `index.html`.
- Pertahankan nomor WhatsApp `6285742744594` dan pesan CTA yang telah di-URL-encode.
- `assets/images/logo.png` sudah tersedia, tetapi hasil pemeriksaan menunjukkan file `TrueColor` tanpa alpha dengan pola checkerboard tersimpan sebagai piksel. File belum dipakai agar latar checkerboard tidak tampil sebagai bagian dari logo. Ganti dengan ekspor PNG transparan, lalu gunakan elemen `<img>` dengan `alt="Logo New Sobat Komputer"`.
- Untuk foto toko, tambahkan hanya foto yang disetujui ke `assets/images/`, sertakan `width`, `height`, dan alt yang akurat. Foto toko belum tersedia pada rilis ini.
- Perbarui iframe dan fallback Maps bersama-sama, dan pastikan keduanya menunjuk lokasi toko yang sama.

## Validasi Lokal

Repository tidak memiliki package manager, build tool, workflow, atau command validasi sebelumnya. Pemeriksaan statis yang digunakan:

```sh
git diff --check
node -e "const fs=require('fs');const h=fs.readFileSync('index.html','utf8');const ids=[...h.matchAll(/\bid=\"([^\"]+)\"/g)].map(m=>m[1]);const anchors=[...h.matchAll(/href=\"#([^\"]+)\"/g)].map(m=>m[1]);if(anchors.some(id=>!ids.includes(id)))process.exit(1)"
```

## GitHub Pages

Tidak ada workflow, `CNAME`, atau konfigurasi Pages yang dapat diverifikasi dari checkout ini. `index.html` sudah berada di root repository sehingga siap untuk model Pages `Deploy from a branch` dengan branch `main` dan folder `/(root)`, jika pemilik mengonfigurasikannya di GitHub.

Setelah konfigurasi aktif, buka URL Pages yang disediakan GitHub dan periksa halaman, stylesheet, WhatsApp, tiga tautan sosial, serta peta. Jangan push atau mengubah remote tanpa instruksi pemilik.

## Rollback

Jika rilis bermasalah, kembalikan commit rilis pada branch publishing ke commit terakhir yang berfungsi, lalu verifikasi ulang URL Pages.
