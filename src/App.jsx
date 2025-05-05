import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import ProductListPage from './pages/PLP';
import ProductDetailsPage from './pages/PDP';
import { CartProvider } from './context/CartContext';
import CartPage from './pages/Cart';

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<ProductListPage />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/cart" element={<CartPage />} />
            {/* ruta comodín */}
            <Route path="*" element={<h2>Página no encontrada 😢</h2>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
