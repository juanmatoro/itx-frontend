/**
 * Client genérico para la prueba Inditex.
 *  - Wrap de fetch con JSON.
 *  - Caché de 1 hora en localStorage.
 */

const BASE = 'https://itx-frontend-test.onrender.com';
const ONE_HOUR = 60 * 60 * 1000;

/* ---------- helpers ---------- */
function storageKey(key) {
  // namespace por si añadimos otros datos
  return `itx-cache:${key}`;
}

function loadCache(key) {
  try {
    const raw = localStorage.getItem(storageKey(key));
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts > ONE_HOUR) return null; // caducado
    return data;
  } catch {
    return null;
  }
}

function saveCache(key, data) {
  try {
    localStorage.setItem(storageKey(key), JSON.stringify({ ts: Date.now(), data }));
  } catch {
    /* quota? ignora */
  }
}

/* ---------- fetchers ---------- */
async function fetchJSON(path, options) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

/**
 * Obtiene listado de productos (caché 1 h)
 */
export async function getProducts() {
  const cache = loadCache('products');
  if (cache) return cache;

  const data = await fetchJSON('/api/product');
  saveCache('products', data);
  return data;
}

/**
 * Obtiene un producto por id (caché 1 h)
 */
export async function getProduct(id) {
  const cache = loadCache(`product:${id}`);
  if (cache) return cache;

  const data = await fetchJSON(`/api/product/${id}`);
  saveCache(`product:${id}`, data);
  return data;
}

/**
 * Añade al carrito → {count}
 *  - NO se cachea, pero actualizamos localStorage(cartCount)
 */
export async function addToCart({ id, colorCode, storageCode }) {
  const body = JSON.stringify({
    id,
    colorCode: Number(colorCode),
    storageCode: Number(storageCode),
  });
  return fetchJSON('/api/cart', { method: 'POST', body });
}
