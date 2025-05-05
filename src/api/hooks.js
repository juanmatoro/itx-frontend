import { useEffect, useState } from 'react';
import { getProducts, getProduct, addToCart } from './client';
import { useCart } from '../context/CartContext';

/* ---------- useProducts ---------- */
export function useProducts() {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    let mounted = true;
    getProducts()
      .then((data) => mounted && setState({ data, loading: false, error: null }))
      .catch((err) => mounted && setState({ data: null, loading: false, error: err }));
    return () => (mounted = false);
  }, []);

  return state;
}

/* ---------- useProduct ---------- */
export function useProduct(id) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    getProduct(id)
      .then((data) => mounted && setState({ data, loading: false, error: null }))
      .catch((err) => mounted && setState({ data: null, loading: false, error: err }));
    return () => (mounted = false);
  }, [id]);

  return state;
}

/* ---------- useAddToCart ---------- */
export function useAddToCart() {
  const { items, addItem } = useCart(); // items.length = contador actual
  const [status, setStatus] = useState({ loading: false, error: null });

  async function add(apiPayload, cartItem) {
    setStatus({ loading: true, error: null });
    try {
      await addToCart(apiPayload); // la API responde siempre count=1, la ignoramos
      if (cartItem) addItem(cartItem); // guardamos en contexto
      setStatus({ loading: false, error: null });
    } catch (e) {
      setStatus({ loading: false, error: e });
    }
  }

  return [add, status]; // [fn, {loading,error}]
}
