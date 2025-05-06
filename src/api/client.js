/**
 * API client para la tienda ITX.
 * - Wrap de fetch con JSON.
 * - Caché de 1 hora en localStorage.
 */

const BASE = 'https://itx-frontend-test.onrender.com';
const ONE_HOUR = 60 * 60 * 1000; // 1 hora en milisegundos

/* ---------- helpers ---------- */

/** Genera la clave para usar en localStorage, con namespace. */
function storageKey(key) {
  return `itx-cache:${key}`;
}

/**
 * Intenta cargar datos desde localStorage.
 * Devuelve null si no existe, está mal formado o ha expirado.
 * @param {string} key Clave base (sin namespace)
 * @returns {any | null} Los datos cacheados o null.
 */
function loadCache(key) {
  try {
    const raw = localStorage.getItem(storageKey(key));
    if (!raw) return null; // No está en caché

    const { ts, data } = JSON.parse(raw); // Parsea el objeto cacheado

    // Comprueba si ha pasado más de una hora
    if (Date.now() - ts > ONE_HOUR) {
      localStorage.removeItem(storageKey(key)); // Elimina caché expirada (opcional)
      return null; // Expirado
    }

    return data; // Devuelve los datos válidos de la caché
  } catch {
    // Si hay cualquier error (p.ej., JSON mal formado), invalida la caché
    localStorage.removeItem(storageKey(key));
    return null;
  }
}

/**
 * Guarda datos en localStorage con timestamp actual.
 * @param {string} key Clave base (sin namespace)
 * @param {any} data Datos a guardar
 */
function saveCache(key, data) {
  try {
    const cacheEntry = { ts: Date.now(), data };
    localStorage.setItem(storageKey(key), JSON.stringify(cacheEntry));
  } catch (e) {
    // Ignora errores (p.ej., si localStorage está lleno o deshabilitado)
    console.warn('Error saving to localStorage cache:', e);
  }
}

/* ---------- fetchers ---------- */

/**
 * Wrapper genérico para fetch que maneja errores y parsea JSON.
 * @param {string} path Path del endpoint (ej: /api/product)
 * @param {RequestInit} [options] Opciones para fetch (method, body, etc.)
 * @returns {Promise<any>}
 * @throws {Error} Si la respuesta no es ok (status >= 400)
 */
async function fetchJSON(path, options) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    // Intenta obtener más detalles del error si es posible
    let errorDetails = '';
    try {
      errorDetails = await res.text(); // O res.json() si la API devuelve errores JSON
    } catch (_) {
      /* ignora si no se puede leer el body */
    }
    throw new Error(`API error ${res.status}: ${errorDetails}`);
  }
  // Devuelve el cuerpo de la respuesta parseado como JSON
  // Nota: res.json() puede fallar si el cuerpo no es JSON válido, pero fetchJSON asume que lo será si res.ok es true.
  return res.json();
}

/**
 * Obtiene listado de productos. Usa caché de 1 hora.
 * @returns {Promise<Array<object>>}
 */
export async function getProducts() {
  const cacheKey = 'products';
  const cachedData = loadCache(cacheKey);
  if (cachedData) {
    console.log('Cache hit for products list');
    return cachedData; // Devuelve desde caché si es válido
  }

  console.log('Cache miss for products list, fetching from API...');
  const data = await fetchJSON('/api/product');
  saveCache(cacheKey, data); // Guarda en caché para futuras peticiones
  return data;
}

/**
 * Obtiene un producto por id. Usa caché de 1 hora.
 * @param {string} id ID del producto
 * @returns {Promise<object>}
 */
export async function getProduct(id) {
  const cacheKey = `product:${id}`;
  const cachedData = loadCache(cacheKey);
  if (cachedData) {
    console.log(`Cache hit for product ${id}`);
    return cachedData;
  }

  console.log(`Cache miss for product ${id}, fetching from API...`);
  const data = await fetchJSON(`/api/product/${id}`);
  saveCache(cacheKey, data);
  return data;
}

/**
 * Añade un producto al carrito mediante petición POST.
 * NO se cachea.
 * @param {{id: string, colorCode: number, storageCode: number}} payload
 * @returns {Promise<{count: number}>} La respuesta de la API (solo contiene 'count')
 */
export async function addToCart({ id, colorCode, storageCode }) {
  // Asegurarse que los códigos son números como espera la API
  const body = JSON.stringify({
    id,
    colorCode: Number(colorCode),
    storageCode: Number(storageCode),
  });
  // Realiza la petición POST
  return fetchJSON('/api/cart', { method: 'POST', body });
}
