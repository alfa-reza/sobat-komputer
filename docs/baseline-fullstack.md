# Baseline Fullstack New Sobat Komputer

Tanggal: 2026-07-19
Task: TASK-001
Branch basis: `development`
HEAD awal: `67593ce` (`Delete index.md`)

## Kondisi Repository

- Working tree bersih sebelum task.
- `git pull --ff-only origin development` menghasilkan `Already up to date.`
- Website memakai HTML5, CSS3, dan JavaScript ES6 vanilla tanpa build tool, package manifest, framework, backend, database migration, atau test suite.
- Entry point publik: `index.html`, `layanan.html`, `promo.html`, dan `kontak.html`.
- Source bersama: `assets/css/style.css` dan `assets/js/main.js`.
- Semua referensi aset dan halaman lokal yang diperiksa memakai path relatif.
- Nomor WhatsApp utama yang digunakan adalah `6285742744594`.
- Belum ada halaman produk atau dashboard admin; kondisi ini sesuai urutan sebelum task katalog dan admin.

## Baseline Behavior

### Navigasi dan accessibility

- Keempat halaman memiliki skip link, header, navigasi empat halaman, CTA WhatsApp, footer, floating WhatsApp, dan tombol kembali ke atas.
- Halaman aktif ditandai dengan `aria-current="page"`.
- Mobile menu memakai tombol dengan `aria-expanded`, dibuka oleh JavaScript, ditutup setelah link dipilih, dan dapat ditutup dengan Escape sambil mengembalikan focus ke tombol.
- CSS menyediakan focus outline global melalui `:focus-visible` dan menampilkan skip link saat focus.
- Pada viewport maksimal 767px, `.nav-list` disembunyikan sampai JavaScript menambahkan `.show`. Karena itu, tanpa JavaScript menu navigasi utama tidak terlihat pada mobile; brand, konten halaman, CTA WhatsApp header, footer links, dan floating WhatsApp tetap tersedia. Ini pre-existing discrepancy terhadap target navigasi utama yang tetap berguna tanpa JavaScript.

### Hero

- Beranda memakai elemen `<picture>`.
- Mobile maksimal 767px memakai `assets/images/new-sobat-komputer-hero-mobile-864x1080.webp`.
- Desktop memakai `assets/images/new-sobat-komputer-hero-desktop-1536x864.webp`.
- Teks hero dan CTA tetap berada di HTML dan tidak bergantung pada JavaScript.

### Promo carousel

- `promo.html` memiliki empat poster statis dan empat indicator.
- Implementasi saat ini terikat pada empat slide: `.carousel-track` memiliki `width: 400%`, setiap `.carousel-slide` memiliki `width: 25%`, dan JavaScript menerjemahkan track sebesar `currentIndex * 25%`.
- JavaScript menyediakan previous, next, indicator, play/pause, autoplay lima detik, pause saat hover/focus, swipe, pause saat dokumen tersembunyi, dan status slide.
- `prefers-reduced-motion: reduce` menghentikan autoplay dan meniadakan transisi carousel.
- Tanpa JavaScript, poster pertama tetap terlihat sebagai fallback statis. Kontrol carousel tetap terlihat tetapi tidak berfungsi; slide lain berada pada track di luar viewport.

### WhatsApp dan path

- CTA utama yang diperiksa mengarah ke `wa.me/6285742744594` dengan pesan terisi.
- Halaman kontak juga memuat dua nomor resmi tambahan.
- Katalog WhatsApp mengarah ke nomor katalog yang sudah ada.
- Tidak ditemukan `href`, `src`, atau `srcset` lokal yang diawali `/` pada empat HTML.

## Validation Results

### Branch dan sinkronisasi

```text
$ git branch --show-current
development

$ git status --short
<no output>

$ git pull --ff-only origin development
From github.com:alfa-reza/sobat-komputer
 * branch            development -> FETCH_HEAD
Already up to date.
```

### Static server dan HTTP entry points

Server dijalankan dengan Python static server. Probe HTTP memakai Python stdlib karena `curl` tidak tersedia di environment.

```text
$ python3 -m http.server 8765
$ python3 <urllib.request probe>
200 index.html
200 layanan.html
200 promo.html
200 kontak.html
200 assets/css/style.css
200 assets/js/main.js
200 assets/images/new-sobat-komputer-hero-desktop-1536x864.webp
200 assets/images/new-sobat-komputer-hero-mobile-864x1080.webp
200 assets/images/poster-1-kredit-laptop.png
200 assets/images/poster-2-pemasangan-cctv.png
200 assets/images/poster-3-jual-laptop.png
200 assets/images/poster-4-set-pc.png
```

### Existing validator

```text
$ node scratch/validate_links.js
Not run: scratch/validate_links.js does not exist in this checkout; scratch/ is ignored.
```

Tidak dibuat validator pengganti karena task mewajibkan discrepancy command dicatat, bukan mengarang command repository baru.

### Failed environment attempts

Percobaan probe pertama gagal sebelum request dijalankan:

```text
zsh:1: command not found: curl
zsh:1: read-only variable: status
```

Percobaan kedua berhenti karena timeout saat pengelolaan background server dan tidak menghasilkan hasil aplikasi. Probe Python pada port 8765 kemudian berhasil untuk semua path di atas.

### Final repository validation

`git diff --check` dijalankan setelah dokumen dibuat dan hasil final dicatat pada completion report task.

## Pemeriksaan Manual dan Batas Bukti

- Struktur responsive desktop/mobile, menu, focus, reduced motion, carousel, no-JS fallback, CTA, dan path diperiksa dari source.
- Keempat halaman dan aset utama berhasil dilayani melalui HTTP.
- Sesi CLI ini tidak menyediakan browser interaktif. Rendering visual desktop/mobile, keyboard traversal aktual, swipe aktual, link eksternal WhatsApp, dan browser console belum diverifikasi secara langsung.
- Tidak ada production source yang diubah selama task ini.

## Pre-existing Failures dan Discrepancies

1. `scratch/validate_links.js` yang didokumentasikan README tidak tersedia pada checkout.
2. Navigasi utama mobile disembunyikan CSS ketika JavaScript gagal; footer links tetap menyediakan navigasi alternatif.
3. Carousel dan CSS hardcoded untuk tepat empat poster.
4. Browser QA interaktif belum dapat dilakukan di environment CLI ini.
5. Branch kerja mengikuti aturan repository yaitu `development`, sedangkan metadata planning awal menyebut evidence repository dari `main`.

## Asumsi, Deviasi, dan Risiko Tersisa

- Asumsi: respons HTTP 200 membuktikan file tersedia, bukan tampilan visual atau perilaku browser penuh.
- Deviasi: server validasi memakai port 8765 agar proses dapat dihentikan otomatis setelah percobaan pengelolaan proses pada port 8000 timeout; server yang digunakan tetap `python3 -m http.server`.
- Risiko tersisa: regression visual awal atau error console yang hanya muncul di browser dapat belum tercatat.
- Risiko tersisa: link eksternal tidak dibuka agar baseline tidak bergantung pada layanan pihak ketiga.
