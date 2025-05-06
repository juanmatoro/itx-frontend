import { getProducts, getProduct, addToCart } from '../client'; // Solo importar lo que se prueba

// --- Mock global de fetch ---
// Se mockea globalmente para interceptar todas las llamadas fetch de las pruebas en este archivo.
// Se usa jest.fn() para poder espiar las llamadas.
global.fetch = jest.fn();

// --- Pruebas del cliente API ---
describe('API client', () => {
  // Datos de prueba comunes
  const mockProductList = [
    { id: '1', name: 'Product 1' },
    { id: '2', name: 'Product 2' },
  ];
  const mockSingleProduct = { id: '1', name: 'Product 1', details: '...' };
  const mockCartResponse = { count: 1 };

  beforeEach(() => {
    // Limpiar mocks y localStorage antes de cada prueba
    fetch.mockClear();
    localStorage.clear();
    // Configuración por defecto del mock de fetch (respuesta OK genérica)
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({}), // Devuelve un objeto vacío por defecto
    });
  });

  // Pruebas para getProducts
  describe('getProducts', () => {
    it('obtiene la lista de productos de la red si no está en caché', async () => {
      // Configura fetch para devolver la lista de productos para esta prueba
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProductList,
      });

      const products = await getProducts();

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        'https://itx-frontend-test.onrender.com/api/product',
        expect.any(Object),
      );
      expect(products).toEqual(mockProductList);
      // Verifica que se guarda en caché
      expect(JSON.parse(localStorage.getItem('itx-cache:products')).data).toEqual(mockProductList);
    });

    it('devuelve la lista de productos desde la caché si está disponible y no ha expirado', async () => {
      // Pre-carga la caché
      const cacheKey = 'itx-cache:products';
      localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data: mockProductList }));

      const products = await getProducts();

      // No debería llamar a fetch
      expect(fetch).not.toHaveBeenCalled();
      expect(products).toEqual(mockProductList);
    });

    it('obtiene los productos de la red si la caché ha expirado', async () => {
      // Pre-carga la caché con timestamp antiguo (más de 1 hora)
      const cacheKey = 'itx-cache:products';
      const ONE_HOUR = 60 * 60 * 1000;
      localStorage.setItem(
        cacheKey,
        JSON.stringify({ ts: Date.now() - ONE_HOUR - 1000, data: [{ id: 'cached' }] }),
      );

      // Configura fetch para la nueva llamada
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProductList,
      });

      const products = await getProducts();

      // Debería llamar a fetch porque la caché expiró
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(products).toEqual(mockProductList); // Devuelve los datos nuevos
      // Verifica que la caché se actualizó
      expect(JSON.parse(localStorage.getItem(cacheKey)).data).toEqual(mockProductList);
    });
  });

  // Pruebas para getProduct (similar a getProducts)
  describe('getProduct', () => {
    const productId = 'xyz789';

    it('obtiene un producto de la red si no está en caché', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSingleProduct,
      });

      const product = await getProduct(productId);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        `https://itx-frontend-test.onrender.com/api/product/${productId}`,
        expect.any(Object),
      );
      expect(product).toEqual(mockSingleProduct);
      expect(JSON.parse(localStorage.getItem(`itx-cache:product:${productId}`)).data).toEqual(
        mockSingleProduct,
      );
    });

    it('devuelve un producto desde la caché si está disponible y no ha expirado', async () => {
      const cacheKey = `itx-cache:product:${productId}`;
      localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data: mockSingleProduct }));

      const product = await getProduct(productId);

      expect(fetch).not.toHaveBeenCalled();
      expect(product).toEqual(mockSingleProduct);
    });

    // Podríamos añadir prueba de expiración para getProduct también
  });

  // Pruebas para addToCart
  describe('addToCart', () => {
    it('envía la petición POST correctamente', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCartResponse,
      });

      const payload = { id: 'prod1', colorCode: 1000, storageCode: 2000 };
      const response = await addToCart(payload);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('https://itx-frontend-test.onrender.com/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Verifica que los códigos se envían como números
          id: payload.id,
          colorCode: Number(payload.colorCode),
          storageCode: Number(payload.storageCode),
        }),
      });
      expect(response).toEqual(mockCartResponse);

      // Verifica que addToCart NO usa la caché de localStorage
      expect(localStorage.getItem('itx-cache:cart')).toBeNull();
    });

    it('lanza un error si la respuesta de la API no es ok', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500, // Simula un error del servidor
        // No necesitamos .json() aquí si la respuesta no es ok
      });

      const payload = { id: 'prod1', colorCode: 1000, storageCode: 2000 };

      // Verifica que la promesa es rechazada con un error
      await expect(addToCart(payload)).rejects.toThrow('API error 500');
    });
  });
});
