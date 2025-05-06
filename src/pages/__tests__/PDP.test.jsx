import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from '../../context/CartContext';
import ProductDetailsPage from '../PDP';

// --- Mocks (Mínimos para evitar errores) ---
const mockUseProduct = jest.fn();
const mockUseAddToCart = jest.fn();
const mockAddToCartFn = jest.fn().mockResolvedValue({ count: 1 });

jest.mock('../../api/hooks', () => ({
  useProduct: (id) => mockUseProduct(id),
  useAddToCart: () => mockUseAddToCart(),
}));

// Mock ultra-simple de SelectInput
jest.mock('../../components/SelectInput', () => {
  // eslint-disable-next-line react/display-name
  return () => <div data-testid="mock-select">MockSelect</div>;
});

// --- Datos Mock Mínimos ---
// Solo lo necesario para que el componente no falle al acceder a props
const minimalMockData = {
  id: '123',
  brand: 'B',
  model: 'M',
  price: '1',
  imgUrl: 'u',
  options: { colors: [], storages: [] }, // Arrays vacíos para que las condiciones .length no fallen
};

// --- Helper de Renderizado (Mantenemos el de antes) ---
const renderPDPPage = (productId = '123') => {
  const path = `/product/${productId}`;
  return render(
    <MemoryRouter initialEntries={[path]}>
      <CartProvider>
        <Routes>
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/" element={<div>Home Mock</div>} />
        </Routes>
      </CartProvider>
    </MemoryRouter>,
  );
};

// --- Suite de Pruebas Mínima ---
describe('<ProductDetailsPage /> (Minimal)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAddToCart.mockReturnValue([mockAddToCartFn, { loading: false, error: null }]);
  });

  it('renders without crashing in loading state', () => {
    // Arrange
    mockUseProduct.mockReturnValue({ data: null, loading: true, error: null });
    // Act & Assert
    expect(() => renderPDPPage()).not.toThrow();
  });

  it('renders without crashing in error state', () => {
    // Arrange
    mockUseProduct.mockReturnValue({ data: null, loading: false, error: new Error('Test Error') });
    // Act & Assert
    expect(() => renderPDPPage()).not.toThrow();
  });

  it('renders without crashing when data is present', () => {
    // Arrange
    mockUseProduct.mockReturnValue({ data: minimalMockData, loading: false, error: null });
    // Act & Assert
    expect(() => renderPDPPage()).not.toThrow();
  });
});
