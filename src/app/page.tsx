
import MainLayout from '@/components/layout/MainLayout';
import ProductGrid from '@/components/products/ProductGrid';
// import OffersSection from '@/components/offers/OffersSection'; // Removed
import { MOCK_PRODUCTS } from '@/data/products'; 
// import { MOCK_OFFERS } from '@/lib/constants'; // Removed
import type { Product } from '@/lib/types'; // Offer type removed
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Simulate fetching products (replace with actual data fetching later)
async function getProducts(): Promise<Product[]> {
  // In a real app, this would fetch from an API or database
  return Promise.resolve(MOCK_PRODUCTS);
}

// Simulate fetching offers - Removed
// async function getOffers(): Promise<Offer[]> {
//   return Promise.resolve(MOCK_OFFERS);
// }

export default async function HomePage() {
  const products = await getProducts();
  // const offers = await getOffers(); // Removed

  return (
    <MainLayout>
      <div className="w-full max-w-screen-2xl mx-auto px-4">
        <section className="text-center py-12 bg-card rounded-lg shadow-md my-8">
          <h1 className="text-4xl font-bold mb-4 text-primary">مرحباً بك في AAAMO</h1>
          <p className="text-lg text-muted-foreground mb-6">
            اكتشف مجموعتنا الواسعة من إكسسوارات الموبايل عالية الجودة بأفضل الأسعار.
          </p>
          <Button size="lg" asChild>
            <Link href="/products">تسوق الآن</Link>
          </Button>
        </section>
        
        {/* <OffersSection offers={offers} /> */} {/* Removed */}

        <ProductGrid products={products} title="أحدث المنتجات لدينا" />

      </div>
    </MainLayout>
  );
}

