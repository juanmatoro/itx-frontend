import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct, useAddToCart } from '../api/hooks';
import SelectInput from '../components/SelectInput';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { data: product, loading, error } = useProduct(id);
  const [addToCart, { loading: adding }] = useAddToCart();

  const [color, setColor] = useState('');
  const [storage, setStorage] = useState('');

  /* inicializar selects */
  useEffect(() => {
    if (!product) return;
    if (product.options?.colors?.length && color === '') setColor(product.options.colors[0].code);
    if (product.options?.storages?.length && storage === '')
      setStorage(product.options.storages[0].code);
  }, [product, color, storage]);

  const handleAdd = () =>
    addToCart(
      { id: product.id, colorCode: Number(color), storageCode: Number(storage) }, // payload API
      {
        id: product.id,
        imgUrl: product.imgUrl,
        brand: product.brand,
        model: product.model,
        price: product.price,
        colorName: product.options.colors.find((c) => c.code === Number(color))?.name ?? '',
        storageName: product.options.storages.find((s) => s.code === Number(storage))?.name ?? '',
      },
    );

  /* renders de estado */
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
          <p className="text-indigo-600 text-xl font-bold mb-4">{product.price} €</p>

          {/* descripción técnica */}
          <h3 className="font-semibold mb-2">Descripción del producto</h3>
          <dl className="grid grid-cols-[auto,1fr] gap-y-2 gap-x-4 text-sm mb-6">
            <dt className="font-medium">CPU</dt>
            <dd>{product.cpu ?? '—'}</dd>
            <dt className="font-medium">RAM</dt>
            <dd>{product.ram ?? '—'}</dd>
            <dt className="font-medium">Sistema operativo</dt>
            <dd>{product.os ?? '—'}</dd>
            <dt className="font-medium">Resolución pantalla</dt>
            <dd>{product.displayResolution ?? '—'}</dd>
            <dt className="font-medium">Batería</dt>
            <dd>{product.battery ?? '—'}</dd>
            <dt className="font-medium">Cámaras</dt>
            <dd>
              {product.primaryCamera ?? '—'}
              {product.secondaryCmera && ` / ${product.secondaryCmera}`}
            </dd>
            <dt className="font-medium">Dimensiones</dt>
            <dd>{product.dimentions ?? '—'}</dd>
            <dt className="font-medium">Peso</dt>
            <dd>{product.weight ?? '—'}</dd>
          </dl>

          {/* selectores */}
          {product.options?.colors?.length > 0 && (
            <SelectInput
              label="Color"
              options={product.options.colors.map((c) => ({
                code: c.code,
                name: c.name,
              }))}
              value={color}
              onChange={setColor}
            />
          )}
          {product.options?.storages?.length > 0 && (
            <SelectInput
              label="Almacenamiento"
              options={product.options.storages.map((s) => ({
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
