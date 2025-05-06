// src/pages/PLP.jsx

import { useState, useMemo } from 'react';
import { useProducts } from '../api/hooks'; // Hook para obtener productos
import SearchBar from '../components/SearchBar'; // Componente de barra de búsqueda
import ProductGrid from '../components/ProductGrid'; // Componente de cuadrícula de productos

// Componente funcional para la página de listado de productos
export default function ProductListPage() {
  // Obtiene el estado de los productos (datos, carga, error) del hook personalizado
  const { data: products = [], loading, error } = useProducts();
  // Estado local para almacenar el texto de búsqueda del usuario
  const [query, setQuery] = useState('');

  // Memoiza los productos filtrados para evitar recalcular en cada render si no cambian los productos o la query
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase(); // Normaliza la query (sin espacios extra, minúsculas)
    if (!q) return products; // Si no hay query, devuelve todos los productos

    // Filtra los productos cuya marca o modelo (en minúsculas) incluyan la query
    return products.filter(
      (p) => p.brand.toLowerCase().includes(q) || p.model.toLowerCase().includes(q),
    );
  }, [products, query]); // Dependencias: se recalcula solo si 'products' o 'query' cambian

  // === Renderizado Condicional: Carga y Error ===
  // Se muestra un mensaje estilizado mientras cargan los datos
  if (loading) return <p className="text-center text-gray-500 py-10">Cargando productos…</p>;
  // Se muestra un mensaje de error estilizado si la carga falla
  if (error) return <p className="text-center text-red-600 py-10">Error al cargar productos</p>;
  // Nota: El mensaje "No se encontraron productos" se maneja dentro de ProductGrid si 'filtered' está vacío.

  // === Renderizado Principal ===
  return (
    // Contenedor principal de la página
    <div className="container mx-auto px-4 py-8">
      {/* Sección de Título y Búsqueda */}
      <div className="flex flex-wrap gap-4 mb-6 justify-between items-center">
        {/* Título de la página */}
        <h1 className="text-2xl font-semibold">Productos disponibles:</h1>
        {/* Componente de barra de búsqueda */}
        <SearchBar value={query} onChange={setQuery} />
      </div>

      {/* Cuadrícula de Productos */}
      {/* Se le pasa la lista de productos (ya filtrada si hay query) */}
      <ProductGrid products={filtered} />
    </div>
  );
}
