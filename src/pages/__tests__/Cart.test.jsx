import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom'; // Importar MemoryRouter
import { CartProvider } from '../../context/CartContext'; // Ajusta la ruta si es necesario
import CartPage from '../Cart'; // Ajusta la ruta si es necesario

// --- Mocks ---
// Mock para window.confirm que se usará en las pruebas
let confirmSpy;

// --- Helper para renderizar con Providers ---
const renderWithProviders = (ui, { providerProps, ...renderOptions } = {}) => {
  // eslint-disable-next-line react/prop-types
  function Wrapper({ children }) {
    return (
      <MemoryRouter>
        <CartProvider {...providerProps}>{children}</CartProvider>
      </MemoryRouter>
    );
  }
  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// --- Datos de prueba ---
const mockItems = [
  {
    id: '1',
    brand: 'Apple',
    model: 'iPhone 14',
    price: '900',
    imgUrl: 'url1',
    colorName: 'Negro',
    storageName: '128GB',
  },
  {
    id: '2',
    brand: 'Samsung',
    model: 'Galaxy S23',
    price: '850',
    imgUrl: 'url2',
    colorName: 'Blanco',
    storageName: '256GB',
  },
];

// --- Pruebas ---
describe('<CartPage />', () => {
  beforeEach(() => {
    // Limpiar mocks y localStorage antes de cada prueba
    jest.clearAllMocks();
    localStorage.clear();
    // Configurar el mock de confirm para que devuelva true por defecto
    confirmSpy = jest.spyOn(window, 'confirm').mockImplementation(() => true);
  });

  afterEach(() => {
    // Restaurar el mock después de cada prueba para evitar interferencias
    if (confirmSpy) {
      confirmSpy.mockRestore();
    }
  });

  it('muestra mensaje cuando el carrito está vacío', () => {
    renderWithProviders(<CartPage />);
    expect(screen.getByText(/Carrito vacío/i)).toBeInTheDocument();
  });

  it('renderiza los items del carrito y el total correctamente', () => {
    // Pre-carga el localStorage para simular items existentes
    localStorage.setItem('cartItems', JSON.stringify(mockItems));
    renderWithProviders(<CartPage />);

    // Verifica que ambos items están presentes
    expect(screen.getByText(/Apple iPhone 14/i)).toBeInTheDocument();
    expect(screen.getByText(/Samsung Galaxy S23/i)).toBeInTheDocument();
    expect(screen.getByText(/Negro \/ 128GB/i)).toBeInTheDocument();
    expect(screen.getByText(/Blanco \/ 256GB/i)).toBeInTheDocument();

    // Verifica precios individuales (usando getAllByText por si el precio aparece también en el total)
    expect(screen.getAllByText(/900\s*€/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/850\s*€/i).length).toBeGreaterThan(0);

    // Verifica el total (900 + 850 = 1750)
    expect(screen.getByText(/Total:\s*1750\s*€/i)).toBeInTheDocument();
  });

  it('vacía el carrito al hacer clic en "Vaciar carrito" y confirmar', () => {
    localStorage.setItem('cartItems', JSON.stringify(mockItems));
    renderWithProviders(<CartPage />);

    // Verifica que los items están inicialmente
    expect(screen.getByText(/Apple iPhone 14/i)).toBeInTheDocument();

    // Simula click en el botón "Vaciar carrito"
    fireEvent.click(screen.getByRole('button', { name: /vaciar carrito/i }));

    // Verifica que se pidió confirmación
    expect(confirmSpy).toHaveBeenCalledTimes(1);

    // Verifica que se muestra el mensaje de carrito vacío
    expect(screen.getByText(/Carrito vacío/i)).toBeInTheDocument();

    // Verifica que los items ya no están (usando queryByText)
    expect(screen.queryByText(/Apple iPhone 14/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Samsung Galaxy S23/i)).not.toBeInTheDocument();
  });

  it('NO vacía el carrito si no se confirma', () => {
    // Sobrescribe el mock de confirm para esta prueba específica
    confirmSpy.mockImplementation(() => false);

    localStorage.setItem('cartItems', JSON.stringify(mockItems));
    renderWithProviders(<CartPage />);

    expect(screen.getByText(/Apple iPhone 14/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /vaciar carrito/i }));

    expect(confirmSpy).toHaveBeenCalledTimes(1);

    // Los items y el total deben seguir ahí
    expect(screen.getByText(/Apple iPhone 14/i)).toBeInTheDocument();
    expect(screen.getByText(/Samsung Galaxy S23/i)).toBeInTheDocument();
    expect(screen.getByText(/Total:\s*1750\s*€/i)).toBeInTheDocument();
    expect(screen.queryByText(/Carrito vacío/i)).not.toBeInTheDocument();
  });

  it('elimina un solo ítem al hacer clic en su botón "Eliminar"', () => {
    localStorage.setItem('cartItems', JSON.stringify(mockItems));
    renderWithProviders(<CartPage />);

    // Encuentra el botón "Eliminar" específico para el iPhone usando 'within' en su 'li' padre
    const iphoneListItem = screen.getByText(/Apple iPhone 14/i).closest('li');
    expect(iphoneListItem).toBeInTheDocument(); // Asegurarse que encontró el li
    const deleteIphoneButton = within(iphoneListItem).getByRole('button', { name: /Eliminar/i });

    // Verifica estado inicial
    expect(screen.getByText(/Apple iPhone 14/i)).toBeInTheDocument();
    expect(screen.getByText(/Samsung Galaxy S23/i)).toBeInTheDocument();
    expect(screen.getByText(/Total:\s*1750\s*€/i)).toBeInTheDocument();

    // Simula click en el botón "Eliminar" del iPhone
    fireEvent.click(deleteIphoneButton);

    // Verifica que el iPhone ya no está
    expect(screen.queryByText(/Apple iPhone 14/i)).not.toBeInTheDocument();

    // Verifica que el Samsung todavía está
    expect(screen.getByText(/Samsung Galaxy S23/i)).toBeInTheDocument();

    // Verifica que el total se ha actualizado (solo queda el Samsung de 850€)
    expect(screen.getByText(/Total:\s*850\s*€/i)).toBeInTheDocument();
    expect(screen.queryByText(/Total:\s*1750\s*€/i)).not.toBeInTheDocument(); // El total anterior no debe estar
  });
});
