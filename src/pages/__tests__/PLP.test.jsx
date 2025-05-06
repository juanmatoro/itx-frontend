import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom'; // ProductCard usa Link
import ProductListPage from '../PLP'; // Ajusta la ruta si es necesario

// --- Mocks ---
const mockUseProducts = jest.fn();
jest.mock('../../api/hooks', () => ({
  // Mantenemos useProduct y useAddToCart por si se usaran indirectamente o en el futuro
  useProduct: jest.fn(),
  useAddToCart: jest.fn(() => [jest.fn(), { loading: false, error: null }]),
  // Mockeamos useProducts
  useProducts: () => mockUseProducts(),
}));

// No necesitamos mockear SearchBar, ProductGrid o ProductCard, los probamos en integración.

// --- Datos de prueba ---
const mockProductsData = [
  { id: '1', brand: 'Apple', model: 'iPhone 14', price: '900', imgUrl: 'url1' },
  { id: '2', brand: 'Samsung', model: 'Galaxy S23', price: '850', imgUrl: 'url2' },
  { id: '3', brand: 'Google', model: 'Pixel 8', price: '750', imgUrl: 'url3' },
];

// --- Helper para renderizar con Router ---
const renderWithRouter = (ui, { route = '/', ...renderOptions } = {}) => {
  // eslint-disable-next-line react/prop-types
  function Wrapper({ children }) {
    return <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>;
  }
  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// --- Pruebas ---
describe('<ProductListPage />', () => {
  beforeEach(() => {
    // Resetear mocks antes de cada test
    jest.clearAllMocks();
  });

  it('muestra mensaje de carga inicialmente', () => {
    mockUseProducts.mockReturnValue({ data: null, loading: true, error: null });
    renderWithRouter(<ProductListPage />);
    expect(screen.getByText(/Cargando productos…/i)).toBeInTheDocument();
  });

  it('muestra mensaje de error si falla la carga', () => {
    mockUseProducts.mockReturnValue({
      data: null,
      loading: false,
      error: new Error('Failed fetch'),
    });
    renderWithRouter(<ProductListPage />);
    expect(screen.getByText(/Error al cargar productos/i)).toBeInTheDocument();
  });

  it('muestra mensaje si no se encuentran productos (array vacío)', () => {
    mockUseProducts.mockReturnValue({ data: [], loading: false, error: null });
    renderWithRouter(<ProductListPage />);
    // El componente ProductGrid renderiza este mensaje
    expect(screen.getByText(/No se encontraron productos/i)).toBeInTheDocument();
  });

  it('renderiza la cuadrícula de productos correctamente', async () => {
    mockUseProducts.mockReturnValue({ data: mockProductsData, loading: false, error: null });
    renderWithRouter(<ProductListPage />);

    // Espera a que aparezca al menos un producto (indicando que la carga finalizó)
    await waitFor(() => {
      expect(screen.getByText(/iPhone 14/i)).toBeInTheDocument();
    });

    // Verifica que todos los productos mockeados están renderizados
    expect(screen.getByText(/iPhone 14/i)).toBeInTheDocument();
    expect(screen.getByText(/Galaxy S23/i)).toBeInTheDocument();
    expect(screen.getByText(/Pixel 8/i)).toBeInTheDocument();

    // Verifica que la barra de búsqueda está presente
    expect(screen.getByPlaceholderText(/Buscar por marca o modelo…/i)).toBeInTheDocument();
  });

  it('filtra los productos al escribir en la barra de búsqueda', async () => {
    mockUseProducts.mockReturnValue({ data: mockProductsData, loading: false, error: null });
    renderWithRouter(<ProductListPage />);

    // Espera a que los productos iniciales se muestren
    await waitFor(() => {
      expect(screen.getByText(/iPhone 14/i)).toBeInTheDocument();
    });

    // Encuentra la barra de búsqueda
    const searchInput = screen.getByPlaceholderText(/Buscar por marca o modelo…/i);

    // Simula escritura en la barra de búsqueda
    fireEvent.change(searchInput, { target: { value: 'Apple' } });

    // Verifica que solo el producto filtrado (iPhone) está visible
    expect(screen.getByText(/iPhone 14/i)).toBeInTheDocument();
    expect(screen.queryByText(/Galaxy S23/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Pixel 8/i)).not.toBeInTheDocument();

    // Limpia la búsqueda
    fireEvent.change(searchInput, { target: { value: '' } });

    // Verifica que todos los productos vuelven a aparecer
    expect(screen.getByText(/iPhone 14/i)).toBeInTheDocument();
    expect(screen.getByText(/Galaxy S23/i)).toBeInTheDocument();
    expect(screen.getByText(/Pixel 8/i)).toBeInTheDocument();

    // Prueba buscando por modelo
    fireEvent.change(searchInput, { target: { value: 'Pixel' } });
    expect(screen.queryByText(/iPhone 14/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Galaxy S23/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Pixel 8/i)).toBeInTheDocument();
  });
});
