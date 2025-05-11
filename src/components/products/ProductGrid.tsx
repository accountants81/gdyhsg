
import type { Product } from '@/lib/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  title?: string;
}

export default function ProductGrid({ products, title = "أحدث المنتجات" }: ProductGridProps) {
  if (!products || products.length === 0) {
    return <p className="text-center text-muted-foreground py-8">{title}: لا توجد منتجات لعرضها حالياً.</p>;
  }

  return (
    <section className="py-8">
      {title && <h2 className="text-3xl font-bold mb-6 text-center md:text-start">{title}</h2>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
