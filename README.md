# New Sobat Komputer

Website profil statis New Sobat Komputer di Kejobong, Purbalingga.

## Dokumentasi Source Code

Proyek ini dibangun sebagai situs statis satu halaman tanpa _build tool_ (zero-build static site).

### Struktur File Utama

- `index.html`: Merupakan titik masuk (_entry point_) dari website. File ini mengatur struktur DOM, tag semantik, metadata SEO (termasuk Schema JSON-LD), serta menghubungkan skrip CSS dan JS.
- `assets/css/style.css`: File CSS utama. Menggunakan variabel CSS (_Custom Properties_) di `:root` untuk mendefinisikan _warm design tokens_ (seperti warna netral hangat dan hijau WhatsApp). Tata letak dibangun dengan Flexbox dan CSS Grid sehingga sepenuhnya responsif tanpa framework seperti Bootstrap/Tailwind.
- `assets/js/main.js`: Menangani interaksi UI secara progresif, meliputi tombol navigasi mobile (hamburger menu), status tautan aktif (_active link state_) saat di-scroll, tombol _Back to Top_, dan _focus management_ (tombol _Escape_ pada menu).
- `AGENTS.md`: Berisi konvensi (_invariants_) serta panduan khusus bagi agen AI, menetapkan batas-batas arsitektur dan persyaratan rilis.

Semua path aset memakai path relatif agar kompatibel dengan sub-path direktori GitHub Project Pages.

### Arsitektur Antarmuka & Layanan

- **Aksesibilitas Utama**: Website berfungsi optimal tanpa JavaScript. Tersedia tautan _skip-to-main-content_ bagi pengguna papan tik (keyboard).
- **Layanan & Timeline SOP**: Menggunakan struktur grid (layanan PC, CCTV, dll) dan layout timeline kustom untuk menyampaikan SOP Service dan SOP Jual-Beli dengan transparan.
- **Integrasi Eksternal**: Tombol _Chat WhatsApp_ membawa muatan pesan yang telah di-URL-encode untuk mempermudah pendaftaran servis. Peta (_map_) dirender melalui `iframe` dengan `loading="lazy"` agar performa halaman utama tetap ringan.

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
