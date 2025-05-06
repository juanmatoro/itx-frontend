import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const { id, imgUrl, brand, model, price } = product;

  return (
    <Link
      to={`/product/${id}`}
      className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition duration-200 ease-in-out p-4 hover:-translate-y-1"
    >
      <div className="aspect-square overflow-hidden flex items-center justify-center mb-3">
        <img
          src={imgUrl}
          alt={`${brand} ${model}`}
          className="h-full w-full object-contain object-center group-hover:scale-105 transition-transform duration-200 ease-in-out"
          loading="lazy"
        />
      </div>

      <h3 className="font-semibold text-sm">Marca: {brand}</h3>
      <h3 className="font-bold text-sm">Modelo: {model}</h3>

      <p className="text-indigo-600 font-bold mt-1">Precio: {price} €</p>
    </Link>
  );
}
