import { getProducts } from '../core/content-api.mjs';
import { buildWhatsAppUrl } from '../core/whatsapp.mjs';

const EMPTY_WHATSAPP_URL = 'https://wa.me/6285742744594?text=Halo%20New%20Sobat%20Komputer%2C%20saya%20ingin%20menanyakan%20produk%20yang%20tersedia.';

export function normalizeProductCandidates(value) {
  if (!Array.isArray(value)) return null;

  const candidates = value.map((product) => {
    if (!product || typeof product !== 'object' || Array.isArray(product)) return null;
    if (typeof product.id !== 'string' || typeof product.referenceCode !== 'string' || !Array.isArray(product.images)) return null;
    const id = product.id.trim();
    const referenceCode = product.referenceCode.trim();
    if (!id || !referenceCode || product.images.length < 1 || product.images.length > 5) return null;

    const images = product.images.map((image) => {
      if (!image || typeof image !== 'object' || Array.isArray(image)) return null;
      if (typeof image.src !== 'string' || typeof image.alt !== 'string' || !Number.isInteger(image.position)) return null;
      const src = image.src.trim();
      const alt = image.alt.trim();
      return src && alt && image.position >= 1 && image.position <= 5
        ? Object.freeze({ src, alt, position: image.position })
        : null;
    });
    if (!images.every(Boolean) || new Set(images.map(({ position }) => position)).size !== images.length) return null;

    return Object.freeze({
      id,
      referenceCode,
      images: Object.freeze([...images].sort((left, right) => left.position - right.position))
    });
  });

  return candidates.every(Boolean) ? Object.freeze(candidates) : null;
}

export function buildProductViews(products, { pageUrl } = {}) {
  return products.map((product, productIndex) => Object.freeze({
    id: product.id,
    images: Object.freeze(product.images.map((image, imageIndex) => Object.freeze({
      ...image,
      loading: productIndex === 0 && imageIndex === 0 ? 'eager' : 'lazy'
    }))),
    whatsappUrl: buildWhatsAppUrl({ contentType: 'Produk', reference: product.referenceCode, pageUrl })
  }));
}

function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = resolve;
    image.onerror = reject;
    image.src = src;
  });
}

export async function preloadProductViews(views, loadImage = preloadImage) {
  await Promise.all(views.flatMap(({ images }) => images.map(({ src }) => loadImage(src))));
  return views;
}

function createEmptyCandidate() {
  const root = document.createElement('div');
  root.className = 'product-region';
  root.dataset.products = '';

  const empty = document.createElement('div');
  empty.className = 'product-empty';
  empty.setAttribute('role', 'status');

  const message = document.createElement('p');
  message.textContent = 'Belum ada produk yang ditampilkan saat ini.';

  const link = document.createElement('a');
  link.className = 'btn btn-wa';
  link.href = EMPTY_WHATSAPP_URL;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = 'Tanya Produk via WhatsApp';

  empty.append(message, link);
  root.append(empty);
  return root;
}

function createProductCard(view) {
  const card = document.createElement('article');
  card.className = 'product-card';
  card.dataset.productId = view.id;

  const images = document.createElement('div');
  images.className = 'product-images';
  images.append(...view.images.map((item) => {
    const image = document.createElement('img');
    image.src = item.src;
    image.alt = item.alt;
    image.loading = item.loading;
    image.decoding = 'async';
    return image;
  }));

  const link = document.createElement('a');
  link.className = 'btn btn-wa';
  link.href = view.whatsappUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = 'Tanya via WhatsApp';

  card.append(images, link);
  return card;
}

function createProductCandidate(views) {
  const root = document.createElement('div');
  root.className = 'product-region';
  root.dataset.products = '';

  const grid = document.createElement('div');
  grid.className = 'product-grid';
  grid.append(...views.map(createProductCard));
  root.append(grid);
  return root;
}

export async function initProducts(root, { limit, pageUrl, loadProducts = getProducts, loadImage = preloadImage } = {}) {
  if (!root || typeof root.replaceWith !== 'function') return false;

  try {
    const products = normalizeProductCandidates(await loadProducts({ limit }));
    if (products === null) throw new Error('Invalid product content.');
    const views = buildProductViews(products, { pageUrl });
    const candidate = views.length === 0
      ? createEmptyCandidate()
      : createProductCandidate(await preloadProductViews(views, loadImage));
    root.replaceWith(candidate);
    return true;
  } catch {
    return false;
  }
}
