import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { count } = useCart();
  const { pathname } = useLocation();

  const crumbs = pathname
    .split('/')
    .filter(Boolean)
    .map((seg, i, arr) => (
      <span key={seg} className="capitalize">
        {seg}
        {i < arr.length - 1 && ' / '}
      </span>
    ));

  return (
    <header className="flex items-center justify-between pt-4 pl-12 pb-4 pr-12 shadow">
      <Link to="/" className="text-xl font-bold">
        <img src="/logo1.svg" alt="Logo" className="h-16 w-auto inline-block mr-2" />
      </Link>

      <nav className="text-sm text-gray-500">{crumbs}</nav>

      <Link to="/cart" className="relative text-blue-600">
        <svg
          className="w-7 h-7"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
          <circle cx="9" cy="21" r="1" />
          <circle cx="19" cy="21" r="1" />
        </svg>

        {count > 0 && (
          <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs px-1 rounded">
            {count}
          </span>
        )}
      </Link>
    </header>
  );
}
