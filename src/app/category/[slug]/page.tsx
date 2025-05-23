
import MainLayout from '@/components/layout/MainLayout';
import ProductGrid from '@/components/products/ProductGrid';
import { getProductsByCategory } from '@/app/admin/products/actions'; // Updated import
import type { Product } from '@/lib/types';
import { CATEGORIES } from '@/lib/constants';
import { notFound } from 'next/navigation';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

// getProductsByCategory is already an async function from actions.ts

async function getCategoryName(categorySlug: string): Promise<string | undefined> {
  const category = CATEGORIES.find(cat => cat.slug === categorySlug);
  return category?.name;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;
  const products = await getProductsByCategory(slug); // Use the server action
  const categoryName = await getCategoryName(slug);

  if (!categoryName) {
    notFound(); // If category doesn't exist, show 404
  }

  return (
    <MainLayout>
      <div className="w-full max-w-screen-xl mx-auto px-4">
        <ProductGrid products={products} title={`منتجات قسم: ${categoryName}`} />
        {products.length === 0 && (
          <div className="text-center py-10">
            <h1 className="text-2xl font-semibold mb-4">لا توجد منتجات</h1>
            <p className="text-muted-foreground">لا توجد منتجات في هذا القسم حاليًا. يرجى التحقق مرة أخرى لاحقًا.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export async function generateStaticParams() {
  return CATEGORIES.map(category => ({
    slug: category.slug,
  }));
}
