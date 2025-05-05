// src/pages/PDP.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct, useAddToCart } from '../api/hooks';
import SelectInput from '../components/SelectInput';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { data: product, loading, error } = useProduct(id);

  // estado local de selectores
  const [color, setColor] = useState('');
  const [storage, setStorage] = useState('');

  // acción para añadir al carrito
  const [addToCart, { loading: adding }] = useAddToCart();

  /* -------------------- efectos -------------------- */
  // Cuando llega el producto, establece valores por defecto
  useEffect(() => {
    if (!product) return;

    if (product.colors?.length && color === '') {
      setColor(product.colors[0].code);
    }

    if (product.storages?.length && storage === '') {
      setStorage(product.storages[0].code);
    }
  }, [product, color, storage]);

  /* -------------------- handlers ------------------- */
  const handleAdd = () =>
    addToCart({ id: product.id, colorCode: Number(color), storageCode: Number(storage) });

  /* -------------------- render --------------------- */
  if (loading) return <p>Cargando detalle…</p>;
  if (error || !product) return <p>Producto no encontrado</p>;

  return (
    <>
      <Link to="/" className="text-sm text-indigo-600 mb-4 inline-block">
        &larr; Volver al listado
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* imagen */}
        <div className="border rounded p-4 flex items-center justify-center">
          <img src={product.imgUrl} alt={product.model} className="max-h-96 object-contain" />
        </div>

        {/* detalles */}
        <div>
          <h2 className="text-2xl font-bold mb-2">
            {product.brand} {product.model}
          </h2>
          <p className="text-indigo-600 text-xl font-bold mb-6">{product.price} €</p>

          {/* select color */}
          {product.colors?.length > 0 && (
            <SelectInput
              label="Color"
              options={product.colors.map((c) => ({
                code: c.code,
                name: c.name,
              }))}
              value={color}
              onChange={setColor}
            />
          )}

          {/* select almacenamiento */}
          {product.storages?.length > 0 && (
            <SelectInput
              label="Almacenamiento"
              options={product.storages.map((s) => ({
                code: s.code,
                name: s.name,
              }))}
              value={storage}
              onChange={setStorage}
            />
          )}

          {/* botón añadir */}
          <button
            onClick={handleAdd}
            disabled={adding || !color || !storage}
            className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded disabled:opacity-60"
          >
            {adding ? 'Añadiendo…' : 'Añadir al carrito'}
          </button>
        </div>
      </div>
    </>
  );
}
