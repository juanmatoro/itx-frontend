import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct, useAddToCart } from '../api/hooks';
import SelectInput from '../components/SelectInput';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { data: product, loading, error } = useProduct(id);
  const [addToCartHook, { loading: adding }] = useAddToCart(); // Renombrado para evitar conflicto

  const [color, setColor] = useState('');
  const [storage, setStorage] = useState('');

  /* inicializar selects */
  useEffect(() => {
    if (!product) return;
    if (product.options?.colors?.length >= 1 && color === '')
      setColor(product.options.colors[0].code);
    if (product.options?.storages?.length >= 1 && storage === '')
      setStorage(product.options.storages[0].code);
  }, [product, color, storage]);

  const handleAdd = () => {
    if (!product || !color || !storage) return;
    addToCartHook(
      { id: product.id, colorCode: Number(color), storageCode: Number(storage) },
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
  };

  /* renders de estado */
  if (loading) return <p className="text-center text-gray-500 py-10">Cargando detalle…</p>;
  if (error || !product)
    return <p className="text-center text-orange-600 py-10">Producto no encontrado</p>;

  return (
    <>
      {/* Link para volver */}
      <Link
        to="/"
        // Añadido: Estilos de focus
        className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline mb-4 inline-block rounded focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500"
      >
        &larr; Volver al listado
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Columna Imagen */}
        <div className="border rounded p-4 flex items-center justify-center">
          <img
            src={product.imgUrl}
            alt={`${product.brand} ${product.model}`}
            className="max-h-96 object-contain"
          />
        </div>

        {/* Columna Detalles y Acciones */}
        <div>
          {/* Título y Precio */}
          <h2 className="text-2xl font-bold mb-2">
            {product.brand}&nbsp;{product.model}
          </h2>
          <p className="text-indigo-600 text-xl font-bold mb-4">{product.price}&nbsp;€</p>{' '}
          {/* Espacio normal */}
          {/* Descripción Técnica */}
          <h3 className="font-semibold mb-2 mt-4">Descripción del producto</h3> {/* Añadido mt-4 */}
          <dl className="grid grid-cols-[auto,1fr] gap-y-1 gap-x-4 text-sm mb-6">
            {' '}
            {/* Reducido gap-y */}
            <dt className="font-medium text-gray-600">CPU</dt> <dd>{product.cpu ?? '—'}</dd>
            <dt className="font-medium text-gray-600">RAM</dt> <dd>{product.ram ?? '—'}</dd>
            <dt className="font-medium text-gray-600">Sistema operativo</dt>{' '}
            <dd>{product.os ?? '—'}</dd>
            <dt className="font-medium text-gray-600">Resolución pantalla</dt>{' '}
            <dd>{product.displayResolution ?? '—'}</dd>
            <dt className="font-medium text-gray-600">Batería</dt> <dd>{product.battery ?? '—'}</dd>
            <dt className="font-medium text-gray-600">Cámaras</dt>
            <dd>
              {product.primaryCamera ?? '—'}
              {/* Corregido typo: secondaryCmera -> secondaryCamera (asumiendo que la API lo da bien o ajustar mock) */}
              {product.secondaryCamera && ` / ${product.secondaryCamera}`}
            </dd>
            <dt className="font-medium text-gray-600">Dimensiones</dt>{' '}
            <dd>{product.dimentions ?? '—'}</dd>
            <dt className="font-medium text-gray-600">Peso</dt>{' '}
            <dd>{product.weight ? `${product.weight}g` : '—'}</dd> {/* Añadido 'g' */}
          </dl>
          {/* Selectores de Opciones */}
          <div className="w-full max-w-40 space-y-4 mb-6">
            {' '}
            {/* Agrupados para mejor espaciado */}
            {product.options?.colors?.length >= 1 && (
              <SelectInput
                label="Color"
                options={product.options.colors.map((c) => ({ code: c.code, name: c.name }))}
                value={color}
                onChange={setColor}
              />
            )}
            {product.options?.storages?.length >= 1 && (
              <SelectInput
                label="Almacenamiento"
                options={product.options.storages.map((s) => ({ code: s.code, name: s.name }))}
                value={storage}
                onChange={setStorage}
                // Añadido margen superior para separación
              />
            )}
          </div>
          {/* Botón Añadir */}
          <button
            onClick={handleAdd}
            disabled={adding || !color || !storage} // Deshabilitado si no hay opciones o está añadiendo
            className="mt-6 w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded disabled:opacity-60 disabled:cursor-not-allowed transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 active:scale-[0.98]"
          >
            {adding ? 'Añadiendo…' : 'Añadir al carrito'}
          </button>
        </div>
      </div>
    </>
  );
}
