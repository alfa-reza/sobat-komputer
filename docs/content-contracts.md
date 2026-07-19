# Kontrak Konten Dinamis New Sobat Komputer

Task: TASK-002
Status: source of truth untuk schema, helper, public renderer, dan admin CRUD

## 1. Aturan Umum

- Frontend tetap HTML5, CSS3, dan JavaScript ES6 vanilla tanpa bundler atau custom API server.
- Supabase menjadi database, authentication, storage, dan enforcement RLS pada task lanjutan.
- Konten publik tetap berguna saat JavaScript mati atau fetch gagal; fallback HTML statis tidak boleh dihapus sebelum pengganti aman tersedia.
- Path frontend tetap relatif.
- Field bertanda **publik** boleh dibaca anonymous hanya ketika row memenuhi aturan visibility. Field **internal** hanya untuk admin terotorisasi, kecuali nilai dibutuhkan server-side/RLS atau untuk membentuk CTA tanpa ditampilkan sebagai teks.
- Timestamp disimpan dalam UTC dan ditampilkan dalam zona waktu yang sesuai di UI.
- Enum status bersama: `draft`, `published`, `archived`.
- Urutan menggunakan `sort_order` integer non-negatif, lalu `created_at`, lalu `id` sebagai tie-breaker deterministik.
- Tidak ada harga, deskripsi produk, stok, data pelanggan, order, payment, review, rating, visitor profile, role hierarchy, atau hero copy dinamis.

## 2. Product

### 2.1 Fields

| Field | Tipe konseptual | Wajib/default | Visibility | Validation | Sumber dan consumer |
|---|---|---|---|---|---|
| `id` | UUID | Wajib, generated | Publik untuk relasi | UUID valid dan immutable | FR-004; product image, renderer |
| `internal_label` | Text | Wajib | Internal | Trimmed, 1–100 karakter | ASM-002, FR-004; admin list/form |
| `reference_code` | Text | Wajib | Internal; boleh masuk payload WhatsApp | Trimmed, unique, 3–30 karakter, huruf/angka/hyphen | FR-007; admin dan WhatsApp helper |
| `status` | Enum | Wajib, `draft` | Internal; menentukan visibility | `draft`, `published`, atau `archived` | FR-004; RLS/query/admin |
| `sort_order` | Integer | Wajib, `0` | Internal; menentukan output | Integer >= 0 | FR-008; query/renderer |
| `created_at` | Timestamp UTC | Wajib, generated | Internal | Immutable setelah insert | Audit dan deterministic ordering |
| `updated_at` | Timestamp UTC | Wajib, generated | Internal | Diubah setiap mutation | Audit dan admin reconciliation |

Final WhatsApp message tidak disimpan pada product. Payload dibentuk saat CTA digunakan karena current page URL hanya tersedia saat runtime. Ini menghindari field `whatsapp_message` yang redundant.

### 2.2 Product Image Fields

| Field | Tipe konseptual | Wajib/default | Visibility | Validation | Sumber dan consumer |
|---|---|---|---|---|---|
| `id` | UUID | Wajib, generated | Publik untuk identitas media | UUID valid dan immutable | FR-005; renderer/admin |
| `product_id` | UUID | Wajib | Publik untuk relasi | Mereferensikan product; cascade policy ditentukan schema | FR-005; relation |
| `storage_path` | Text | Wajib | Publik untuk resolusi URL | Object path di `products/`, bukan arbitrary URL | FR-005, ADR-005; storage/renderer |
| `alt_text` | Text | Wajib | Publik melalui atribut `alt` | Trimmed, 5–160 karakter | ACC-001, FR-005; renderer |
| `sort_order` | Integer | Wajib | Publik untuk urutan | Integer 1–5, unique per product | FR-005, FR-008; renderer/admin |
| `width` | Integer | Wajib | Internal | Integer > 0 dan <= 1600 | PERF-001; preview/audit |
| `height` | Integer | Wajib | Internal | Integer > 0 dan <= 1600 | PERF-001; preview/audit |
| `bytes` | Integer | Wajib | Internal | Integer > 0 | PERF-001; preview/audit |
| `created_at` | Timestamp UTC | Wajib, generated | Internal | Immutable | Audit/cleanup |

### 2.3 Lifecycle dan Visibility

- Admin dapat create, read, update, archive, dan permanent delete melalui session owner yang valid.
- Product publik hanya jika `status == published` dan memiliki 1–5 image rows valid.
- Draft dan archived tidak boleh dikembalikan kepada anonymous user.
- Product dengan nol gambar tidak dapat dipublish. Satu sampai lima gambar valid. Gambar keenam ditolak sebelum upload dan constraint database juga harus menolak `sort_order` di luar 1–5 atau posisi duplikat.
- Duplicate `reference_code` menghasilkan `VALIDATION_ERROR` conflict tanpa menimpa row lain.
- Archive tidak menghapus media. Permanent delete memerlukan confirmation dan cleanup aman.

### 2.4 Public Product Rendering

Product card hanya berisi:

```html
<article>
  <img src="[resolved product image]" alt="[alt_text]">
  <a href="[encoded primary WhatsApp URL]">Tanya via WhatsApp</a>
</article>
```

- Gallery dapat menampilkan maksimal lima gambar dengan alt text masing-masing.
- `internal_label` dan `reference_code` tidak ditampilkan sebagai body text. `reference_code` hanya masuk payload CTA.
- Non-hero images memakai lazy loading kecuali gambar pertama yang menjadi kandidat konten awal.
- Empty catalog menampilkan pesan aman dan CTA WhatsApp; nav, kontak, dan fallback statis tetap ada.
- Fetch failure mempertahankan fallback dan menyediakan retry yang tidak destruktif.
- Homepage teaser memakai subset product published dengan ordering yang sama. Empty/failure state tidak menghapus section statis lain.

## 3. Promotion

### 3.1 Fields

| Field | Tipe konseptual | Wajib/default | Visibility | Validation | Sumber dan consumer |
|---|---|---|---|---|---|
| `id` | UUID | Wajib, generated | Publik sebagai identitas slide | UUID valid dan immutable | FR-009; renderer/admin |
| `internal_label` | Text | Wajib | Internal | Trimmed, 1–100 karakter | FR-009; admin |
| `storage_path` | Text | Wajib | Publik untuk resolusi URL | Tepat satu object path di `promotions/` | FR-010, ADR-005; renderer/storage |
| `alt_text` | Text | Wajib | Publik melalui `alt` | Trimmed, 5–160 karakter | FR-010, ACC-001; renderer |
| `status` | Enum | Wajib, `draft` | Internal; menentukan visibility | Shared status enum | FR-009, FR-012; RLS/query |
| `starts_at` | Timestamp UTC/null | Opsional, `null` | Internal; menentukan visibility | Jika ada, timestamp valid | FR-011, FR-012; query/admin |
| `ends_at` | Timestamp UTC/null | Opsional, `null` | Internal; menentukan visibility | Jika keduanya ada, `ends_at > starts_at` | FR-011, FR-012; query/admin |
| `sort_order` | Integer | Wajib, `0` | Internal; menentukan output | Integer >= 0 | FR-013; renderer |
| `width` | Integer | Wajib | Internal | Integer > 0 dan <= 1600 | FR-016; preview/audit |
| `height` | Integer | Wajib | Internal | Integer > 0 dan <= 1600 | FR-016; preview/audit |
| `bytes` | Integer | Wajib | Internal | Integer > 0 | FR-016; preview/audit |
| `created_at` | Timestamp UTC | Wajib, generated | Internal | Immutable | Audit/order tie-breaker |
| `updated_at` | Timestamp UTC | Wajib, generated | Internal | Diubah setiap mutation | Audit/reconciliation |

### 3.2 Active Schedule

Promotion aktif jika dan hanya jika:

```text
status == published
AND (starts_at is null OR starts_at <= now_utc)
AND (ends_at is null OR now_utc < ends_at)
```

Interval schedule adalah `[starts_at, ends_at)`: aktif tepat pada waktu mulai dan expired tepat pada waktu akhir. Draft, archived, future, dan expired promotion tidak boleh dikembalikan kepada anonymous user.

### 3.3 Carousel States

- `0` active promotions: pertahankan poster fallback statis atau safe empty state; sembunyikan kontrol yang tidak berfungsi.
- `1` active promotion: tampilkan satu poster tanpa autoplay, previous/next, atau indicator berlebih.
- `N > 1`: jumlah slide dan indicator mengikuti data; setiap perpindahan tepat satu viewport, bukan persentase hardcoded berdasarkan empat slide.
- Previous, next, indicators, play/pause, keyboard focus pause, swipe, visibility pause, live status, dan reduced-motion behavior existing dipertahankan.
- Fetch failure mempertahankan poster statis existing dan CTA; error tidak mengosongkan halaman.

## 4. Hero Settings

### 4.1 Fields

| Field | Tipe konseptual | Wajib/default | Visibility | Validation | Sumber dan consumer |
|---|---|---|---|---|---|
| `id` | Singleton key | Wajib, fixed | Publik untuk lookup | Hanya satu row hero settings | FR-014; query/admin |
| `desktop_path` | Text | Wajib | Publik | Object path di `hero/` | FR-014, ADR-005; `<picture>` |
| `mobile_path` | Text | Wajib | Publik | Object path di `hero/` | FR-014, ADR-005; `<picture>` |
| `alt_text` | Text | Wajib | Publik melalui `alt` | Trimmed, 5–160 karakter | ACC-001; hero image |
| `updated_by` | UUID | Wajib pada mutation | Internal | Owner user ID valid | Audit/security |
| `updated_at` | Timestamp UTC | Wajib, generated | Internal | Diubah setiap replacement | Audit/reconciliation |

Hero eyebrow, heading, paragraph, hours, dan CTA tetap statis di `index.html`; tidak ada field hero copy.

### 4.2 Safe Replacement

1. Admin wajib memilih desktop dan mobile bersama.
2. Kedua input divalidasi, dioptimalkan, dan dipreview sebelum save.
3. Kedua file baru harus berhasil di-upload sebelum row database diubah.
4. Jika salah satu upload gagal, row lama tidak berubah; object baru yang orphan dicatat untuk cleanup aman.
5. Row diubah hanya setelah dua upload berhasil.
6. Media lama dihapus hanya setelah update row berhasil.
7. Cleanup lama yang gagal tidak membatalkan hero baru; hasilnya `CLEANUP_FAILED` dengan path reconciliation, tanpa blind retry.
8. Fetch failure atau JavaScript mati mempertahankan `<picture>` dan hero statis existing.

## 5. Image Processing dan Storage

### 5.1 Shared Input Rules

- Input hanya JPEG atau PNG dengan MIME yang diverifikasi melalui successful browser decode, bukan extension saja.
- Ukuran raw input maksimum 12 MiB per file. File lebih besar ditolak sebagai `IMAGE_TOO_LARGE` sebelum decode/upload.
- Corrupt atau unsupported input menghasilkan `IMAGE_DECODE_ERROR`.
- Canvas menghapus metadata yang tidak diperlukan dan menghasilkan WebP.
- Nama object menggunakan UUID; original filename tidak menjadi public identifier.
- Preview menampilkan output image, dimensions, dan bytes sebelum save.
- Upload selalu selesai sebelum database membuat reference.
- Bucket tunggal `catalog-media` memakai prefix `products/`, `promotions/`, dan `hero/`.

### 5.2 Profiles

| Profile | Output geometry | Byte policy | Rendering |
|---|---|---|---|
| Product | Pertahankan aspect ratio; long edge maksimal 1600px; tidak upscale | Target <= 450 KB selama kualitas visual masih layak | WebP; lazy load untuk non-primary images |
| Promotion | Pertahankan aspect ratio; long edge maksimal 1600px; tidak upscale | Target <= 450 KB selama poster/text tetap terbaca | WebP; carousel responsive |
| Hero desktop | Center cover-crop ke aspect ratio 16:9, lalu 1536x864; upscale hanya setelah preview warning dan confirmation | Target <= 700 KB | WebP pada desktop source |
| Hero mobile | Center cover-crop ke aspect ratio 4:5, lalu 864x1080; upscale hanya setelah preview warning dan confirmation | Target <= 700 KB | WebP pada mobile source |

Byte values adalah optimization target, bukan izin melewati hard raw-input limit. Bila target tidak dapat dicapai tanpa merusak keterbacaan, admin mendapat preview ukuran aktual dan harus mengonfirmasi; output geometry dan decode validity tetap hard requirements.

## 6. WhatsApp CTA

- Nomor inquiry utama: `6285742744594`.
- Base URL: `https://wa.me/6285742744594`.
- Katalog existing pada nomor lain tidak menggantikan nomor inquiry utama.
- Product message template:

```text
Halo New Sobat Komputer, saya ingin menanyakan produk dengan referensi [reference_code]. Halaman: [current page URL]
```

- Promotion CTA bila digunakan memakai content type `promo` dan `id` sebagai reference; internal label tidak dibocorkan.
- Current page URL diambil saat CTA digunakan. URL yang dimasukkan ke pesan dibersihkan dari credential atau auth-related query/fragment.
- Seluruh message menjadi satu nilai query `text` yang di-encode dengan `encodeURIComponent`.
- Empty/invalid reference ditolak saat authoring sebagai `VALIDATION_ERROR`; helper tidak menghasilkan payload ambigu.
- CTA tidak mengumpulkan atau menyimpan data visitor/customer.

## 7. UI dan Error States

### 7.1 Public Content Group

| State | Behavior |
|---|---|
| Initial/static | Semantic HTML, nav, contact, CTA, dan fallback terlihat sebelum JavaScript |
| Loading | Fallback tetap ada; indikator tidak menyebabkan layout kosong |
| Success/content | Replace/enhance hanya target dynamic; preserve focus dan semantics |
| Success/empty | Pesan aman dan WhatsApp CTA; kontrol carousel nonaktif disembunyikan |
| Fetch error | Fallback tetap terlihat; pesan aman dan retry opsional |
| Recovery | Retry read-only boleh dilakukan; tidak menduplikasi markup/control |

### 7.2 Admin Operation

Urutan state mutation: `idle`, `validating`, `optimizing`, `preview_ready`, `uploading`, `saving`, `success`. Failure dapat menghasilkan `validation_error`, `upload_failed`, `database_write_failed`, `cleanup_failed`, `session_expired`, `access_denied`, atau `reconciliation_required`.

- Save dinonaktifkan saat operation aktif untuk mencegah duplicate mutation.
- Validation failure terjadi sebelum upload.
- Upload failure tidak membuat database reference.
- Database failure setelah upload mempertahankan row lama dan menandai uploaded object untuk cleanup.
- Unknown write outcome tidak diulang secara buta; UI meminta refresh/reconciliation.
- Session expired meminta login ulang tanpa kehilangan preview lokal bila aman.

### 7.3 Error Codes

| Code | Kondisi | Safe behavior |
|---|---|---|
| `AUTH_REQUIRED` | Belum login | Arahkan ke login admin |
| `ACCESS_DENIED` | Session bukan owner | Tolak operation tanpa detail policy |
| `VALIDATION_ERROR` | Field/rule invalid atau conflict | Tandai field dan jangan upload |
| `IMAGE_DECODE_ERROR` | File corrupt/unsupported | Tolak file dan minta JPEG/PNG valid |
| `IMAGE_TOO_LARGE` | Raw input > 12 MiB | Tolak sebelum decode/upload |
| `UPLOAD_FAILED` | Storage write gagal | Jangan buat DB reference |
| `DATABASE_WRITE_FAILED` | Mutation row gagal | Pertahankan row lama; cleanup orphan aman |
| `CLEANUP_FAILED` | Delete object lama/orphan gagal | Konten valid tetap aktif; catat reconciliation |
| `FETCH_FAILED` | Public/admin read gagal | Pertahankan fallback/data terakhir yang aman |
| `SESSION_EXPIRED` | Session habis saat operation | Hentikan mutation dan minta login ulang |

Public error tidak menampilkan stack trace, detail database, credential, token, raw auth object, atau storage policy. Admin error menyebut operation yang gagal dan recovery action tanpa membocorkan secret.

## 8. Edge Cases dan Acceptance Samples

| Case | Expected result |
|---|---|
| Product tanpa image | Tetap draft; publish ditolak |
| Product dengan satu image | Valid untuk publish |
| Product dengan lima images | Valid untuk publish |
| Image keenam | Ditolak sebelum upload dan oleh DB position constraint |
| Duplicate reference | Conflict validation; row existing tidak berubah |
| Empty product catalog | Safe empty state + WhatsApp; halaman lain tetap ada |
| Zero active promotions | Static fallback/safe empty; no broken controls |
| One active promotion | Satu poster tanpa autoplay/navigation berlebih |
| Expired promotion | Tidak tersedia anonymous tepat saat `ends_at` |
| Partial hero selection | Save ditolak sebelum upload |
| One hero upload fails | Hero lama tetap aktif |
| Dynamic fetch fails | Static HTML, nav, contacts, and CTA tetap ada |

Sample product card acceptance: imagery dengan alt text dan tombol WhatsApp saja. Tidak ada label, reference text, harga, deskripsi, stok, review, atau rating.

## 9. Traceability

| Contract | Requirement/decision | Consumer |
|---|---|---|
| Product lifecycle/status | FR-004 | Schema, RLS, admin CRUD |
| Product 1–5 ordered images | FR-005, FR-008 | Constraints, admin, renderer |
| Image-only product card | FR-006 | Public renderer |
| Product reference CTA | FR-007 | WhatsApp helper |
| Promotion lifecycle/poster | FR-009, FR-010 | Schema, admin, carousel |
| Promotion schedule/visibility | FR-011, FR-012 | RLS/query |
| Carousel 0/1/N | FR-013 | Public promo module |
| Paired responsive hero | FR-014 | Admin and hero renderer |
| Static hero copy | FR-015 | `index.html` |
| Browser WebP optimization | FR-016, ADR-004 | Image helper |
| Preview before save | FR-017 | Admin forms |
| Static fallback | FR-018, REL-001 | Public modules |
| Homepage teaser states | FR-019 | Homepage renderer |
| Relative no-JS product nav | FR-020, COMP-001 | Shared navigation task |
| Alt text | ACC-001 | All public images |
| MIME/size restrictions | SEC-004 | Image helper/storage policy |
| Upload-before-reference | REL-002 | Admin mutations |
| Safe hero cleanup | REL-003 | Hero admin module |

Setiap persisted field pada tabel entity memiliki consumer dan requirement/decision. Detail implementation SQL, JavaScript, CSS, dan HTML berada di luar TASK-002.

## 10. Keputusan TASK-002

Detail yang tidak diberi angka/policy oleh planning ditetapkan untuk membuat kontrak testable:

- Raw input maksimum 12 MiB.
- Promotion label 1–100 karakter; promotion dan hero alt text 5–160 karakter.
- Schedule disimpan UTC dengan interval aktif `[starts_at, ends_at)`.
- Promotion memakai profile long edge 1600px dan target 450 KB.
- Hero memakai center cover-crop ke output 1536x864 dan 864x1080 dengan preview; upscale memerlukan warning dan confirmation.
- Tie-breaker ordering adalah `created_at`, lalu `id`.
- Product reference tidak ditampilkan sebagai body text dan hanya digunakan dalam WhatsApp payload.
- Final WhatsApp message dibentuk runtime, bukan disimpan sebagai field.
