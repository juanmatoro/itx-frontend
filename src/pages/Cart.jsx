import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function CartPage() {
  const { items, clearCart, removeItem } = useCart();

  const handleClearCart = () => {
    const confirmed = window.confirm('¿Estás seguro de que quieres vaciar el carrito?');
    if (confirmed) clearCart();
  };

  if (items.length === 0)
    return (
      <div className="text-center mt-10">
        <h1 className="text-2xl font-semibold mb-4">Carrito vacío</h1>
        <p>Añade productos desde el listado.</p>
        <Link to="/" className="text-sm text-indigo-600 mb-4 inline-block">
          &larr; Volver al listado
        </Link>
      </div>
    );

  const total = items.reduce((sum, it) => sum + Number(it.price), 0);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Tu carrito</h1>

      <ul>
        {items.map((it, idx) => (
          <li
            key={`${it.id}-${it.colorName}-${it.storageName}-${idx}`} // <-- KEY MODIFICADA
            className="flex items-center gap-4 border-b py-3"
          >
            <img src={it.imgUrl} alt={it.model} className="w-16 h-16 object-contain" />
            <div className="flex-1">
              <p className="font-medium">
                {it.brand} {it.model}
              </p>
              <p className="text-sm text-gray-500">
                {it.colorName} / {it.storageName}
              </p>
            </div>
            <span className="font-bold mr-4">{it.price} €</span>{' '}
            {/* Añadido mr-4 para separar del botón */}
            {/* --- BOTÓN ELIMINAR --- */}
            <button
              onClick={() => removeItem(idx)} // <-- Llama a removeItem con el índice correcto
              className="text-red-600 hover:text-red-800 text-sm font-semibold"
              aria-label={`Eliminar ${it.brand} ${it.model}`} // Accesibilidad
            >
              Eliminar
            </button>
            {/* --- FIN BOTÓN ELIMINAR --- */}
          </li>
        ))}
      </ul>

      <div className="flex justify-between items-center mt-6">
        <span className="text-lg font-bold">Total: {total} €</span>
        <button
          onClick={handleClearCart}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Vaciar carrito
        </button>
      </div>
      <Link to="/" className="text-sm text-indigo-600 mb-4 inline-block">
        &larr; Seguir comprando
      </Link>
    </div>
  );
}
