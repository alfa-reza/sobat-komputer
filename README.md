# Sobat Komputer Redirect

[![HTML5](https://img.shields.io/badge/HTML5-Redirect-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/docs/Web/HTML)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?logo=github&logoColor=white)](https://alfa-reza.github.io/sobat-komputer/)
[![Website](https://img.shields.io/badge/Website-sobatkomputer.github.io-0A66C2?logo=googlechrome&logoColor=white)](https://sobatkomputer.github.io/)
[![License](https://img.shields.io/badge/License-Apache%202.0-D22128?logo=apache&logoColor=white)](LICENSE)

Repository sederhana yang digunakan untuk mengalihkan pengunjung dari alamat GitHub Pages lama ke domain website Sobat Komputer yang baru.

## Alur Pengalihan

```text
https://alfa-reza.github.io/sobat-komputer/
                        │
                        ▼
          GitHub Pages memuat halaman redirect
                        │
                        ▼
       window.location.replace(
           "https://sobatkomputer.github.io/"
       )
                        │
                        ▼
          https://sobatkomputer.github.io/
```

Redirect utama dijalankan menggunakan:

```javascript
window.location.replace("https://sobatkomputer.github.io/");
```

Metode `window.location.replace()` digunakan agar halaman redirect tidak menambahkan alamat lama ke riwayat navigasi browser.

Elemen `meta refresh` juga disediakan sebagai mekanisme cadangan apabila JavaScript tidak dapat dijalankan.

## Website

- **Website baru:** [sobatkomputer.github.io](https://sobatkomputer.github.io/)
- **Alamat lama:** [alfa-reza.github.io/sobat-komputer](https://alfa-reza.github.io/sobat-komputer/)
- **Repository website utama:** [alfa-reza/website-sobat-komputer](https://github.com/alfa-reza/website-sobat-komputer/)

## Struktur Repository

```text
sobat-komputer/
├── index.html
├── README.md
└── LICENSE
```

## Lisensi

Proyek ini menggunakan [Apache License 2.0](LICENSE).
