
import MainLayout from '@/components/layout/MainLayout';
import ProductGrid from '@/components/products/ProductGrid';
import { MOCK_PRODUCTS } from '@/data/products'; // Using mock data for now
import type { Product } from '@/lib/types';

// Simulate fetching products (replace with actual data fetching later)
async function getProducts(): Promise<Product[]> {
  // In a real app, this would fetch from an API or database
  return Promise.resolve(MOCK_PRODUCTS);
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <MainLayout>
      <div className="container mx-auto px-4">
        {/* Hero Section Placeholder */}
        <section className="text-center py-12 bg-card rounded-lg shadow-md my-8">
          <h1 className="text-4xl font-bold mb-4 text-primary">مرحباً بك في AAAMO</h1>
          <p className="text-lg text-muted-foreground mb-6">
            اكتشف مجموعتنا الواسعة من إكسسوارات الموبايل عالية الجودة.
          </p>
          {/* You can add a CTA button here e.g., <Button size="lg">تسوق الآن</Button> */}
        </section>
        
        <ProductGrid products={products} title="أحدث المنتجات" />

        {/* Placeholder for featured categories or promotions */}
        {/* <section className="my-12">
          <h2 className="text-2xl font-bold mb-6 text-center">الأقسام المميزة</h2>
          { Add Category Cards or Promotional Banners here }
        </section> */}
      </div>
    </MainLayout>
  );
}
