import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

/**
 * Guarda la lista de artículos añadidos.
 * Cada elemento ≈ { id, brand, model, price, imgUrl, colorName, storageName }
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    return JSON.parse(localStorage.getItem('cartItems') || '[]');
  });

  // Persistencia
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(items));
  }, [items]);

  /* ------------ acciones ------------ */
  const addItem = (item) => setItems((prev) => [...prev, item]);
  const clearCart = () => setItems([]);

  /* ------------ API pública ------------ */
  const value = {
    items,
    count: items.length, // derivado
    addItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/* Hook de comodidad */
export function useCart() {
  return useContext(CartContext);
}
