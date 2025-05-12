
import MainLayout from '@/components/layout/MainLayout';
import ProductGrid from '@/components/products/ProductGrid';
import { MOCK_PRODUCTS } from '@/data/products'; 
import type { Product } from '@/lib/types'; 
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image'; // Added for hero image

// Simulate fetching products (replace with actual data fetching later)
async function getProducts(): Promise<Product[]> {
  // In a real app, this would fetch from an API or database
  return Promise.resolve(MOCK_PRODUCTS);
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <MainLayout>
      <div className="w-full max-w-screen-xl mx-auto px-4">
        {/* Enhanced Hero Section */}
        <section className="relative bg-card text-foreground p-8 md:p-12 rounded-lg shadow-xl my-8 overflow-hidden min-h-[300px] md:min-h-[400px] flex flex-col justify-center items-center text-center">
          <Image
            src="https://picsum.photos/seed/hero-banner-tech/1200/500" // Updated seed for a potentially different image
            alt="Promotional Banner"
            fill
            className="object-cover opacity-20" // Maintained opacity for text readability
            priority // Ensure hero image loads quickly
            data-ai-hint="abstract technology" // Updated AI hint
          />
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary animate-fade-in-down">
              مرحباً بك في {process.env.SITE_NAME || "AAAMO"}
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 mb-8 animate-fade-in-up max-w-2xl mx-auto">
              اكتشف مجموعتنا الواسعة من إكسسوارات الموبايل عالية الجودة بأفضل الأسعار. كل ما تحتاجه لجهازك في مكان واحد!
            </p>
            <Button size="lg" asChild className="animate-bounce-once">
              <Link href="/products">تسوق الآن واستكشف العروض</Link>
            </Button>
          </div>
        </section>
        
        <ProductGrid products={products} title="أحدث المنتجات لدينا" />

      </div>
    </MainLayout>
  );
}
