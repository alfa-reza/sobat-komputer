const WHATSAPP_BASE_URL = 'https://wa.me/6285742744594';
const REFERENCE_PATTERN = /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/;
const SENSITIVE_QUERY_KEY = /^(?:access[_-]?token|refresh[_-]?token|auth|authorization|code|credential|key|password|session|token)$/i;

function validationError() {
  const error = new Error('Invalid WhatsApp request.');
  error.name = 'WhatsAppUrlError';
  error.code = 'VALIDATION_ERROR';
  return error;
}

function sanitizePageUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw validationError();
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') throw validationError();

  url.username = '';
  url.password = '';
  url.hash = '';
  for (const key of [...url.searchParams.keys()]) {
    if (SENSITIVE_QUERY_KEY.test(key)) url.searchParams.delete(key);
  }

  return url.href;
}

export function buildWhatsAppUrl({ contentType, reference, pageUrl } = {}) {
  if (typeof contentType !== 'string' || !/^[A-Za-z]+$/.test(contentType)) throw validationError();
  if (typeof reference !== 'string' || reference.length < 3 || reference.length > 30 || !REFERENCE_PATTERN.test(reference)) {
    throw validationError();
  }

  const type = contentType.toLocaleLowerCase('id-ID');
  const currentPage = sanitizePageUrl(pageUrl);
  const message = `Halo New Sobat Komputer, saya ingin menanyakan ${type} dengan referensi ${reference}. Halaman: ${currentPage}`;

  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`;
}
