import ProductCard from './ProductCard';

export default function ProductGrid({ products }) {
  if (!products.length) return <p>No se encontraron productos</p>;

  return (
    <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
