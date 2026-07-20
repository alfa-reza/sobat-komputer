export const mockContent = {
  hero: {
    id: 'hero-primary',
    desktop_path: 'assets/images/hero/new-sobat-komputer-hero-desktop-1536x864.webp',
    mobile_path: 'assets/images/hero/new-sobat-komputer-hero-mobile-864x1080.webp',
    alt_text: 'Foto depan toko New Sobat Komputer di Kejobong'
  },
  promotions: [
    {
      id: 'promo-1',
      storage_path: 'assets/images/promotions/poster-1-kredit-laptop.webp',
      alt_text: 'Poster kredit laptop New Sobat Komputer',
      status: 'published',
      starts_at: null,
      ends_at: null,
      sort_order: 10,
      created_at: '2026-01-01T00:00:00.000Z'
    },
    {
      id: 'promo-2',
      storage_path: 'assets/images/promotions/poster-2-pemasangan-cctv.webp',
      alt_text: 'Poster pemasangan CCTV New Sobat Komputer',
      status: 'published',
      starts_at: null,
      ends_at: null,
      sort_order: 20,
      created_at: '2026-01-02T00:00:00.000Z'
    },
    {
      id: 'promo-3',
      storage_path: 'assets/images/promotions/poster-3-jual-laptop.webp',
      alt_text: 'Poster penjualan laptop baru dan second New Sobat Komputer',
      status: 'published',
      starts_at: null,
      ends_at: null,
      sort_order: 30,
      created_at: '2026-01-03T00:00:00.000Z'
    },
    {
      id: 'promo-4',
      storage_path: 'assets/images/promotions/poster-4-set-pc.webp',
      alt_text: 'Poster paket PC komputer lengkap New Sobat Komputer',
      status: 'published',
      starts_at: null,
      ends_at: null,
      sort_order: 40,
      created_at: '2026-01-04T00:00:00.000Z'
    },
    {
      id: 'promo-draft',
      storage_path: 'assets/images/promotions/poster-1-kredit-laptop.webp',
      alt_text: 'Poster promo draft New Sobat Komputer',
      status: 'draft',
      starts_at: null,
      ends_at: null,
      sort_order: 50,
      created_at: '2026-01-05T00:00:00.000Z'
    },
    {
      id: 'promo-future',
      storage_path: 'assets/images/promotions/poster-2-pemasangan-cctv.webp',
      alt_text: 'Poster promo mendatang New Sobat Komputer',
      status: 'published',
      starts_at: '2030-01-01T00:00:00.000Z',
      ends_at: null,
      sort_order: 60,
      created_at: '2026-01-06T00:00:00.000Z'
    },
    {
      id: 'promo-expired',
      storage_path: 'assets/images/promotions/poster-3-jual-laptop.webp',
      alt_text: 'Poster promo berakhir New Sobat Komputer',
      status: 'published',
      starts_at: '2025-01-01T00:00:00.000Z',
      ends_at: '2025-12-31T00:00:00.000Z',
      sort_order: 70,
      created_at: '2026-01-07T00:00:00.000Z'
    }
  ],
  products: [
    {
      id: 'product-draft',
      reference_code: 'DRAFT-001',
      status: 'draft',
      sort_order: 10,
      created_at: '2026-01-01T00:00:00.000Z',
      images: [{ id: 'draft-image-1', storage_path: 'assets/images/brand/logo.webp', alt_text: 'Produk draft', sort_order: 1 }]
    },
    {
      id: 'product-archived',
      reference_code: 'ARCHIVED-001',
      status: 'archived',
      sort_order: 20,
      created_at: '2026-01-02T00:00:00.000Z',
      images: [{ id: 'archived-image-1', storage_path: 'assets/images/brand/logo.webp', alt_text: 'Produk archived', sort_order: 1 }]
    },
    {
      id: 'product-no-images',
      reference_code: 'EMPTY-001',
      status: 'published',
      sort_order: 30,
      created_at: '2026-01-03T00:00:00.000Z',
      images: []
    },
    {
      id: 'product-six-images',
      reference_code: 'SIX-001',
      status: 'published',
      sort_order: 40,
      created_at: '2026-01-04T00:00:00.000Z',
      images: Array.from({ length: 6 }, (_, index) => ({
        id: `six-image-${index + 1}`,
        storage_path: 'assets/images/brand/logo.webp',
        alt_text: `Gambar produk ${index + 1}`,
        sort_order: index + 1
      }))
    },
    {
      id: 'product-invalid-image',
      reference_code: 'INVALID-001',
      status: 'published',
      sort_order: 50,
      created_at: '2026-01-05T00:00:00.000Z',
      images: [{ id: 'invalid-image-1', storage_path: '/assets/images/brand/logo.webp', alt_text: '', sort_order: 1 }]
    }
  ]
};
