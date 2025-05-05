import { getProducts } from '../client';

// → Mock global fetch con Jest
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([{ id: '1' }]),
  }),
);

describe('API client', () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorage.clear(); // vacía caché entre tests
  });

  it('caches product list for subsequent calls', async () => {
    const first = await getProducts(); // hit de red
    const second = await getProducts(); // caché

    expect(fetch).toHaveBeenCalledTimes(1); // solo la primera vez
    expect(second[0].id).toBe('1');
  });
});
