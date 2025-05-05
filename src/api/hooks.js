import { useEffect, useState } from 'react';
import { getProducts, getProduct, addToCart } from './client';
import { useCart } from '../context/CartContext';

/* Hook listado */
export function useProducts() {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    let mounted = true;
    getProducts()
      .then((data) => mounted && setState({ data, loading: false, error: null }))
      .catch((err) => mounted && setState({ data: null, loading: false, error: err }));
    return () => {
      mounted = false;
    };
  }, []);

  return state; // {data, loading, error}
}

/* Hook detalle */
export function useProduct(id) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    getProduct(id)
      .then((data) => mounted && setState({ data, loading: false, error: null }))
      .catch((err) => mounted && setState({ data: null, loading: false, error: err }));
    return () => {
      mounted = false;
    };
  }, [id]);

  return state;
}

/* Hook acción add to cart + side‑effect global */
export function useAddToCart() {
  const { setCount } = useCart();
  const [status, setStatus] = useState({ loading: false, error: null });

  async function add(item) {
    setStatus({ loading: true, error: null });
    try {
      const { count } = await addToCart(item);
      setCount(count); // <-- actualiza global
      setStatus({ loading: false, error: null });
    } catch (e) {
      setStatus({ loading: false, error: e });
    }
  }

  return [add, status]; // igual que useMutation: fn, {loading,error}
}
