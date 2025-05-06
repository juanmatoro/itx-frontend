import { useEffect, useState } from 'react';
import { getProducts, getProduct, addToCart } from './client'; // Funciones del cliente API
import { useCart } from '../context/CartContext'; // Contexto del carrito

/* ---------- Hook useProducts ---------- */
/**
 * Hook para obtener la lista completa de productos.
 * Maneja estados de carga y error.
 * Utiliza la caché implementada en client.js.
 * @returns {{ data: Array|null, loading: boolean, error: Error|null }}
 */
export function useProducts() {
  // Estado interno del hook: datos, estado de carga, posible error
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    let isMounted = true; // Flag para evitar actualizaciones de estado en componente desmontado

    // Llama a la función del cliente API
    getProducts()
      .then((data) => {
        if (isMounted) {
          setState({ data, loading: false, error: null });
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Error fetching products:', err);
          setState({ data: null, loading: false, error: err });
        }
      });

    // Función de limpieza que se ejecuta al desmontar el componente
    return () => {
      isMounted = false;
    };
  }, []); // El array vacío [] significa que este efecto se ejecuta solo una vez (al montar)

  return state;
}

/* ---------- Hook useProduct ---------- */
/**
 * Hook para obtener los detalles de un producto específico por ID.
 * Maneja estados de carga y error.
 * Utiliza la caché implementada en client.js.
 * @param {string} id - El ID del producto a obtener.
 * @returns {{ data: object|null, loading: boolean, error: Error|null }}
 */
export function useProduct(id) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    if (!id) {
      // Si no hay ID, no intentar cargar y establecer estado inicial
      setState({ data: null, loading: false, error: null });
      return;
    }

    let isMounted = true;
    setState({ data: null, loading: true, error: null }); // Reiniciar estado al cambiar ID

    getProduct(id)
      .then((data) => {
        if (isMounted) {
          setState({ data, loading: false, error: null });
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error(`Error fetching product ${id}:`, err);
          setState({ data: null, loading: false, error: err });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]); // Se re-ejecuta si el 'id' cambia

  return state;
}

/* ---------- Hook useAddToCart ---------- */
/**
 * Hook para gestionar la acción de añadir un producto al carrito.
 * Proporciona una función para ejecutar la acción y el estado de esa acción (carga/error).
 * @returns {[Function, { loading: boolean, error: Error|null }]} - Una tupla con [funciónParaAñadir, estadoDeLaAcción]
 */
export function useAddToCart() {
  // Obtiene la función 'addItem' del contexto del carrito para añadir el item localmente
  const { addItem } = useCart();
  // Estado local para la operación de añadir (loading, error)
  const [status, setStatus] = useState({ loading: false, error: null });

  /**
   * Función asíncrona para añadir un item.
   * Llama a la API y luego actualiza el contexto local.
   * @param {object} apiPayload - Datos a enviar a POST /api/cart { id, colorCode, storageCode }
   * @param {object} cartItem - Datos completos del item a guardar en el contexto local
   */
  async function add(apiPayload, cartItem) {
    setStatus({ loading: true, error: null }); // Inicia estado de carga
    try {
      // Llama a la API. La respuesta ({ count: 1 }) no se usa directamente aquí.
      await addToCart(apiPayload);

      // Si la llamada API fue exitosa, añade el item al estado local del carrito.
      if (cartItem) {
        addItem(cartItem);
      }
      setStatus({ loading: false, error: null }); // Finaliza estado de carga (éxito)
    } catch (e) {
      console.error('Error adding item to cart:', e);
      setStatus({ loading: false, error: e }); // Finaliza estado de carga (error)
    }
  }

  // Devuelve la función para añadir y el estado de la operación
  return [add, status];
}
