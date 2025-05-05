// Testeando el cliente de API
import { getProducts } from '../client';

global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([{ id: '1' }]),
  }),
);

describe('API client', () => {
  it('caches product list', async () => {
    const data1 = await getProducts();
    const data2 = await getProducts();
    expect(fetch).toHaveBeenCalledTimes(1); // segunda llamada vino de caché
    expect(data2[0].id).toBe('1');
  });
});
