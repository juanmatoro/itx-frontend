import { useState, useMemo } from 'react';
import { useProducts } from '../api/hooks';
import SearchBar from '../components/SearchBar';
import ProductGrid from '../components/ProductGrid';

export default function ProductListPage() {
  const { data: products = [], loading, error } = useProducts();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) => p.brand.toLowerCase().includes(q) || p.model.toLowerCase().includes(q),
    );
  }, [products, query]);

  if (loading) return <p>Cargando productos…</p>;
  if (error) return <p>Error al cargar productos</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex mb-6 justify-between items-center">
        <h1 className="text-2xl font-semibold mb-4">Productos disponibles:</h1>
        <SearchBar value={query} onChange={setQuery} />
      </div>
      <ProductGrid products={filtered} />
    </div>
  );
}
