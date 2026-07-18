# New Sobat Komputer

Website profil statis New Sobat Komputer di Kejobong, Purbalingga.

## Panduan Multi-Page Website

Website ini sekarang telah dikembangkan dari satu halaman panjang menjadi situs statis beberapa halaman untuk meningkatkan performa, kemudahan navigasi, dan pengalaman pengguna.

### Struktur Halaman Utama

- `index.html` (Beranda): Berisi ringkasan profil, kategori layanan ringkas, teaser promo terbaru, teaser lokasi toko, dan tombol kontak WhatsApp utama.
- `layanan.html` (Layanan): Daftar layanan lengkap (Service Laptop, Service PC, Service Printer, Jual Beli, Aksesori, CCTV, iPrime) beserta SOP pengerjaan yang transparan dan ketentuan garansi.
- `promo.html` (Promo & Katalog): Berisi carousel promosi produk (4 poster dengan auto-play 5 detik) dan tautan katalog resmi WhatsApp.
- `kontak.html` (Lokasi & Kontak): Menampilkan informasi alamat lengkap, jam buka toko, tiga nomor WhatsApp resmi dengan format klik langsung buka percakapan, serta Google Maps Embed interaktif.

### Struktur File

```
/
├── index.html
├── layanan.html
├── promo.html
├── kontak.html
├── assets/
│   ├── css/style.css   # Stylesheet global bersama
│   ├── js/main.js     # Script interaksi global bersama
│   └── images/        # Folder aset gambar & logo
└── screenshots/       # Bukti tangkapan layar pengujian visual
```

### Informasi Kontak Bisnis Resmi

- **Nomor Utama (Chat WA / CTA Umum)**: `+62 857-4274-4594` (wa.me/6285742744594)
- **Tiga Kontak WhatsApp**:
  1. `+62 857-4274-4594` (wa.me/6285742744594)
  2. `+62 851-8506-2811` (wa.me/6285185062811)
  3. `+62 889-8004-2670` (wa.me/6288980042670)
- **Katalog WhatsApp**: `https://wa.me/c/6288980042670`

## Menjalankan secara Lokal

Karena website ini zero-build (hanya HTML/CSS/JS murni), Anda dapat langsung membukanya di browser atau menjalankannya menggunakan static server sederhana:

```sh
python3 -m http.server 8000
```
Lalu buka `http://localhost:8000` di web browser Anda.

## Validasi Kualitas Kode & Link

Untuk menjaga kualitas situs dan kompatibilitas tautan, jalankan skrip validasi lokal berikut:

```sh
# 1. Cek trailing whitespace dan error git diff
git diff --check

# 2. Cek integritas tautan halaman lokal, fragment id, dan file aset
node scratch/validate_links.js
```

## Kompatibilitas GitHub Pages

Seluruh referensi aset dan file menggunakan path relatif (tidak diawali dengan `/`) agar kompatibel penuh dengan sub-direktori atau root path pada rilis GitHub Project Pages.
