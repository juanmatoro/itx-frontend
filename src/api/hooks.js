// src/api/hooks.js
import { useEffect, useState } from 'react';
import { getProducts, getProduct, addToCart } from './client';
import { useCart } from '../context/CartContext';

/* ---------- Hook: listado de productos ---------- */
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

/* ---------- Hook: detalle de producto ---------- */
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

/* ---------- Hook: añadir al carrito ---------- */
export function useAddToCart() {
  const { count: current, setCount } = useCart();
  const [status, setStatus] = useState({ loading: false, error: null });

  async function add(item) {
    setStatus({ loading: true, error: null });
    try {
      const { count } = await addToCart(item);

      // Si el backend devuelve un valor mayor, úsalo; si no, incrementa localmente
      if (typeof count === 'number' && count > current) {
        setCount(count);
      } else {
        setCount((prev) => prev + 1);
      }

      setStatus({ loading: false, error: null });
    } catch (e) {
      setStatus({ loading: false, error: e });
    }
  }

  return [add, status]; // [función, {loading, error}]
}
