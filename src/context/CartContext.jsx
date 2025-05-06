import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

/**
 * Contexto para gestionar el estado del carrito de compras.
 * Provee la lista de items, el contador y funciones para modificar el carrito.
 * Persiste los items en localStorage.
 */
export function CartProvider({ children }) {
  // Estado para los items del carrito.
  // Se inicializa leyendo desde localStorage o con un array vacío.
  const [items, setItems] = useState(() => {
    try {
      const storedItems = localStorage.getItem('cartItems');
      return storedItems ? JSON.parse(storedItems) : [];
    } catch (error) {
      console.error('Error reading cart items from localStorage', error);
      return []; //Fallback a vacío si hay error
    }
  });

  // Efecto para persistir los items en localStorage cada vez que cambian.
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart items to localStorage', error);
    }
  }, [items]); // Se ejecuta solo cuando el array 'items' cambia

  /* ------------ Acciones para modificar el carrito ------------ */

  /** Añade un nuevo item al final del array de items. */
  const addItem = (item) => setItems((prevItems) => [...prevItems, item]);

  /** Elimina todos los items del carrito. */
  const clearCart = () => setItems([]);

  /** Elimina un item específico del carrito basado en su índice. */
  const removeItem = (indexToRemove) => {
    setItems((prevItems) => prevItems.filter((_, index) => index !== indexToRemove));
  };

  /* ------------ API pública del contexto ------------ */
  // Valor que será accesible por los componentes consumidores del contexto.
  const value = {
    items,
    count: items.length, // El contador se deriva directamente de la longitud del array
    addItem,
    clearCart,
    removeItem,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/* Hook personalizado para consumir el contexto fácilmente */
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
