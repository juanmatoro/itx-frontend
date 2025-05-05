import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const { id, imgUrl, brand, model, price } = product;

  return (
    <Link
      to={`/product/${id}`}
      className="block bg-white rounded-lg shadow-sm hover:shadow-md transition p-4"
    >
      {/* Imagen cuadrada con object‑fit */}
      <div className="aspect-square overflow-hidden flex items-center justify-center mb-3">
        <img
          src={imgUrl}
          alt={`${brand} ${model}`}
          className="h-full w-full object-contain"
          loading="lazy"
        />
      </div>

      <h3 className="font-semibold text-sm">
        Marca:
        {brand}
      </h3>
      <h3 className="font-bold text-sm">
        Modelo:
        {model}
      </h3>

      <p className="text-indigo-600 font-bold mt-1">Precio: {price} €</p>
    </Link>
  );
}
