// tests/testUtils.js
import { render } from '@testing-library/react';
import { CartProvider } from '../src/context/CartContext';
import { MemoryRouter } from 'react-router-dom';

/* Render con Cart + Router */
export function renderWithCart(ui, { route = '/' } = {}) {
  return render(
    <CartProvider>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </CartProvider>,
  );
}

/* Mock genérico de fetch */
export function mockFetch(response) {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(response),
    }),
  );
}
