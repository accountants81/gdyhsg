
import MainLayout from '@/components/layout/MainLayout';
import ProductGrid from '@/components/products/ProductGrid';
import { getAllProducts } from '@/app/admin/products/actions'; 
import type { Product } from '@/lib/types'; 
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image'; 
import { SITE_NAME } from '@/lib/constants';

// Fetch products using the server action
async function getProducts(): Promise<Product[]> {
  return getAllProducts();
}

export default async function HomePage() {
  const products = await getProducts();
  const siteName = process.env.SITE_NAME || SITE_NAME;

  return (
    <MainLayout>
      <div className="w-full max-w-screen-xl mx-auto px-4">
        {/* Enhanced Hero Section */}
        <section className="relative bg-card text-foreground p-8 md:p-12 rounded-lg shadow-xl my-8 overflow-hidden min-h-[350px] md:min-h-[450px] flex flex-col justify-center items-center text-center">
          <Image
            src="https://picsum.photos/seed/luxury-tech-banner/1200/600" 
            alt="Promotional Banner - Luxurious Tech Accessories"
            fill
            className="object-cover opacity-15" 
            priority 
            data-ai-hint="luxury tech"
          />
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-primary animate-fade-in-down">
              مرحباً بك في {siteName}
            </h1>
            <p className="text-lg md:text-xl text-foreground/90 mb-10 animate-fade-in-up max-w-3xl mx-auto leading-relaxed">
              وجهتك الأولى لأفخم إكسسوارات الموبايل. اكتشف التميز والجودة الفائقة التي تستحقها.
            </p>
            <Button 
              size="lg" 
              asChild 
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-opacity duration-300 transform hover:scale-105 shadow-lg hover:shadow-primary/50 animate-bounce-subtle"
            >
              <Link href="/products">تسوق الآن واستكشف العروض الحصرية</Link>
            </Button>
          </div>
        </section>
        
        <ProductGrid products={products} title="أحدث المنتجات لدينا" />

      </div>
    </MainLayout>
  );
}

// Add subtle bounce animation if not present in tailwind config
// If globals.css handles keyframes and animations, this comment can be removed.
// Ensure tailwind.config.ts has:
// keyframes: { 'bounce-subtle': { '0%, 100%': { transform: 'translateY(-2%)' }, '50%': { transform: 'translateY(0)' } } },
// animation: { 'bounce-subtle': 'bounce-subtle 1.5s ease-in-out' }
// For animate-fade-in-down and animate-fade-in-up, ensure keyframes are defined:
// 'fade-in-down': { '0%': { opacity: '0', transform: 'translateY(-20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
// 'fade-in-up': { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
// And animations:
// 'fade-in-down': 'fade-in-down 0.6s ease-out forwards',
// 'fade-in-up': 'fade-in-up 0.6s ease-out 0.3s forwards', // Slight delay
