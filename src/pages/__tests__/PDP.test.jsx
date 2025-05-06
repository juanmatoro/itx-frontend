import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom'; // Necesario para useParams y Link
import { CartProvider } from '../../context/CartContext'; // PDP usa useAddToCart que necesita CartProvider
import ProductDetailsPage from '../PDP'; // Ajusta la ruta si es necesario

// --- Mocks ---

// Mock de los hooks de API
const mockUseProduct = jest.fn();
const mockUseAddToCart = jest.fn();
const mockAddToCartFn = jest.fn(); // La función que devuelve useAddToCart

jest.mock('../../api/hooks', () => ({
  useProduct: (id) => mockUseProduct(id), // Pasamos el id para posible lógica en el mock
  useAddToCart: () => mockUseAddToCart(),
}));

// Mock del componente SelectInput
// Creamos un componente simple que simula el select
jest.mock('../../components/SelectInput', () => {
  // eslint-disable-next-line react/prop-types, react/display-name
  return ({ label, options, value, onChange }) => (
    <label>
      {label}:
      <select
        data-testid={`select-${label.toLowerCase()}`} // Añadimos test-id para facilitar la selección
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map(({ code, name }) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </label>
  );
});

// --- Datos de prueba ---
const mockProductData = {
  id: '123',
  brand: 'Apple',
  model: 'iPhone Test',
  price: '1000',
  imgUrl: 'test.jpg',
  cpu: 'A16',
  ram: '6GB',
  os: 'iOS',
  displayResolution: '2796x1290',
  battery: '4323mAh',
  primaryCamera: '48MP',
  secondaryCmera: '12MP', // Nota: typo en el código original 'secondaryCmera' vs 'secondaryCamera'
  dimentions: '155 x 78 x 7.8 mm',
  weight: '240g',
  options: {
    colors: [
      { code: 1000, name: 'Negro' },
      { code: 1001, name: 'Blanco' },
    ],
    storages: [
      { code: 2000, name: '128GB' },
      { code: 2001, name: '256GB' },
    ],
  },
};

// --- Helper para renderizar con Router y Context ---
// Envuelve el componente en los providers necesarios y configura una ruta para useParams
const renderWithProviders = (productId = '123') => {
  return render(
    <MemoryRouter initialEntries={[`/product/${productId}`]}>
      <CartProvider>
        <Routes>
          <Route path="/product/:id" element={<ProductDetailsPage />} />
        </Routes>
      </CartProvider>
    </MemoryRouter>,
  );
};

// --- Pruebas ---
describe('<ProductDetailsPage />', () => {
  beforeEach(() => {
    // Resetear mocks antes de cada test
    jest.clearAllMocks();
    // Configuración por defecto para useAddToCart
    mockUseAddToCart.mockReturnValue([mockAddToCartFn, { loading: false, error: null }]);
  });

  it('muestra mensaje de carga inicialmente', () => {
    mockUseProduct.mockReturnValue({ data: null, loading: true, error: null });
    renderWithProviders();
    expect(screen.getByText(/Cargando detalle…/i)).toBeInTheDocument();
  });

  it('muestra mensaje de error si falla la carga', () => {
    mockUseProduct.mockReturnValue({
      data: null,
      loading: false,
      error: new Error('Failed fetch'),
    });
    renderWithProviders();
    // El componente muestra "Producto no encontrado" tanto para error como para !product
    expect(screen.getByText(/Producto no encontrado/i)).toBeInTheDocument();
  });

  it('muestra mensaje de no encontrado si no hay datos', () => {
    // Test para el caso específico de !product (sin error)
    mockUseProduct.mockReturnValue({ data: null, loading: false, error: null });
    renderWithProviders();
    expect(screen.getByText(/Producto no encontrado/i)).toBeInTheDocument();
  });

  it('renderiza los detalles del producto correctamente', async () => {
    mockUseProduct.mockReturnValue({ data: mockProductData, loading: false, error: null });
    renderWithProviders(mockProductData.id); // Pasamos el ID para useParams

    // Esperamos a que aparezca un elemento clave que depende de los datos cargados.

    await waitFor(() => {
      // Busca "Marca:" seguido de cero o más espacios y luego el valor de brand (case-insensitive)
      expect(
        screen.getByText(new RegExp(`Marca:\\s*${mockProductData.brand}`, 'i')),
      ).toBeInTheDocument();
      // Busca "Modelo:" seguido de cero o más espacios y luego el valor de model (case-insensitive)
      expect(
        screen.getByText(new RegExp(`Modelo:\\s*${mockProductData.model}`, 'i')),
      ).toBeInTheDocument();
    });

    // Verificamos otros detalles (usando expresiones regulares flexibles o texto exacto)
    expect(screen.getByText(/Precio:\s*1000\s*€/i)).toBeInTheDocument(); // Precio (ajustado regex)
    expect(screen.getByText(mockProductData.cpu)).toBeInTheDocument(); // CPU: "A16"
    expect(screen.getByText(mockProductData.ram)).toBeInTheDocument(); // RAM: "6GB"
    expect(screen.getByText(mockProductData.os)).toBeInTheDocument(); // OS: "iOS"

    // Verificar que las opciones (selects) se renderizan buscando sus labels
    expect(screen.getByLabelText(/Color/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Almacenamiento/i)).toBeInTheDocument();
  });

  it('selecciona el color y almacenamiento inicial y permite cambiarlos', async () => {
    mockUseProduct.mockReturnValue({ data: mockProductData, loading: false, error: null });
    renderWithProviders(mockProductData.id);

    // Espera a que los selects aparezcan (dependen de los datos)
    await waitFor(() => screen.getByLabelText(/Color/i));
    const colorSelect = screen.getByLabelText(/Color/i);
    const storageSelect = screen.getByLabelText(/Almacenamiento/i);

    // Verifica la selección inicial (el primero de cada array en mockProductData)
    expect(colorSelect).toHaveValue(String(mockProductData.options.colors[0].code)); // 1000
    expect(storageSelect).toHaveValue(String(mockProductData.options.storages[0].code)); // 2000
    // Verificar que la opción está seleccionada visualmente
    expect(screen.getByRole('option', { name: 'Negro' }).selected).toBe(true);
    expect(screen.getByRole('option', { name: '128GB' }).selected).toBe(true);

    // Simula cambio de color
    fireEvent.change(colorSelect, {
      target: { value: String(mockProductData.options.colors[1].code) },
    }); // Cambia a Blanco (1001)
    expect(colorSelect).toHaveValue(String(mockProductData.options.colors[1].code));
    expect(screen.getByRole('option', { name: 'Blanco' }).selected).toBe(true);
    expect(screen.getByRole('option', { name: 'Negro' }).selected).toBe(false);

    // Simula cambio de almacenamiento
    fireEvent.change(storageSelect, {
      target: { value: String(mockProductData.options.storages[1].code) },
    }); // Cambia a 256GB (2001)
    expect(storageSelect).toHaveValue(String(mockProductData.options.storages[1].code));
    expect(screen.getByRole('option', { name: '256GB' }).selected).toBe(true);
    expect(screen.getByRole('option', { name: '128GB' }).selected).toBe(false);
  });

  it('llama a addToCart con los parámetros correctos al hacer clic en el botón', async () => {
    mockUseProduct.mockReturnValue({ data: mockProductData, loading: false, error: null });
    renderWithProviders(mockProductData.id);

    // Esperar a que el botón esté habilitado (depende de la selección inicial)
    const addButton = await screen.findByRole('button', { name: /añadir al carrito/i });
    await waitFor(() => expect(addButton).not.toBeDisabled());

    // Seleccionar opciones diferentes a las iniciales para asegurar que se envían las actuales
    const colorSelect = screen.getByLabelText(/Color/i);
    const storageSelect = screen.getByLabelText(/Almacenamiento/i);
    fireEvent.change(colorSelect, { target: { value: '1001' } }); // Blanco
    fireEvent.change(storageSelect, { target: { value: '2001' } }); // 256GB

    // Hacer clic en el botón
    fireEvent.click(addButton);

    // Verificar que mockAddToCartFn fue llamado
    expect(mockAddToCartFn).toHaveBeenCalledTimes(1);

    // Verificar que fue llamado con los parámetros correctos (payload API y item para el contexto)
    expect(mockAddToCartFn).toHaveBeenCalledWith(
      // Payload para la API
      expect.objectContaining({
        id: mockProductData.id, // '123'
        colorCode: 1001, // Blanco
        storageCode: 2001, // 256GB
      }),
      // Item para el contexto del carrito
      expect.objectContaining({
        id: mockProductData.id,
        brand: mockProductData.brand,
        model: mockProductData.model,
        price: mockProductData.price,
        colorName: 'Blanco', // Nombre correspondiente al código 1001
        storageName: '256GB', // Nombre correspondiente al código 2001
      }),
    );
  });

  it('deshabilita el botón "Añadir al carrito" mientras se añade', async () => {
    // Simulamos que useAddToCart está en estado de carga
    mockUseAddToCart.mockReturnValue([mockAddToCartFn, { loading: true, error: null }]);
    mockUseProduct.mockReturnValue({ data: mockProductData, loading: false, error: null });
    renderWithProviders(mockProductData.id);

    // Esperamos a que aparezca el botón y verificamos que esté deshabilitado
    const addButton = await screen.findByRole('button', { name: /añadiendo…/i }); // El texto cambia
    expect(addButton).toBeDisabled();
  });
});
