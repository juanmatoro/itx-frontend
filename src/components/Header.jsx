// src/components/Header.jsx

import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { count } = useCart();
  const { pathname } = useLocation();

  // Genera los breadcrumbs basados en la ruta actual
  const crumbs = pathname
    .split('/')
    .filter(Boolean) // Elimina segmentos vacíos (p.ej., de '/')
    .map((seg, i, arr) => (
      // Idealmente, estos serían Links si hubiera rutas intermedias, pero por ahora son spans
      <span key={seg} className="capitalize">
        {seg}
        {i < arr.length - 1 && <span className="mx-1">/</span>} {/* Espaciado para el separador */}
      </span>
    ));

  return (
    <header className="flex items-center justify-between pt-4 pb-4 px-4 sm:px-12 shadow">
      {' '}
      {/* Ajustado padding para móviles */}
      {/* Logo y enlace a la página principal */}
      <Link
        to="/"
        // Añadido: Estilos de focus
        className="text-xl font-bold flex items-center gap-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-label="Ir a la página principal de ITX Store"
      >
        <img src="/logo.svg" alt="" className="h-10 sm:h-12 w-auto" />{' '}
        {/* Alt vacío si es decorativo */}
        <span className="hidden sm:inline">ITX Store</span>{' '}
        {/* Ocultar texto en móvil si logo es suficiente */}
      </Link>
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 hidden md:block">
        {' '}
        {/* Ocultar en móvil si ocupa mucho */}
        <Link to="/" className="hover:underline">
          Inicio
        </Link>
        {crumbs.length > 0 && <span className="mx-1">/</span>}
        {crumbs}
      </nav>
      {/* Enlace al carrito */}
      <Link
        to="/cart"
        className="relative text-blue-600 p-1 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        aria-label={`Ver carrito, ${count} items`}
      >
        {/* Icono SVG del carrito */}
        <svg
          className="w-7 h-7"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true" // Ocultar a lectores de pantalla si aria-label es suficiente
        >
          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
          <circle cx="9" cy="21" r="1" />
          <circle cx="19" cy="21" r="1" />
        </svg>

        {/* Contador de items en el carrito */}
        {count > 0 && (
          <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
            {' '}
            {/* Ajustado padding y añadido font-bold */}
            {count}
          </span>
        )}
      </Link>
    </header>
  );
}
