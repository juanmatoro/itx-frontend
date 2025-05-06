import ProductCard from './ProductCard';

export default function ProductGrid({ products }) {
  if (!products.length) return <p>No se encontraron productos</p>;

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
