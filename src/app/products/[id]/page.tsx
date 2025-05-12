
import MainLayout from '@/components/layout/MainLayout';
import { getProductById } from '@/app/admin/products/actions';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, ThumbsUp } from 'lucide-react';
import AddToCartButton from './components/AddToCartButton';
import ProductImageGallery from './components/ProductImageGallery';
import SmartRecommendationsLoader from './components/SmartRecommendationsLoader';
import { MOCK_PRODUCTS } from '@/data/products'; // For related products as fallback

interface ProductDetailsPageProps {
  params: {
    id: string;
  };
}

// Simulate fetching related products (could be by category, etc.)
async function getRelatedProducts(currentProductId: string, categorySlug: string): Promise<typeof MOCK_PRODUCTS> {
  return MOCK_PRODUCTS.filter(p => p.categorySlug === categorySlug && p.id !== currentProductId).slice(0, 4);
}


export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.id, product.categorySlug);

  return (
    <MainLayout>
      <div className="container mx-auto px-2 sm:px-4 py-8">
        <Card className="overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-6">
            {/* Product Image Gallery */}
            <ProductImageGallery imageUrls={product.imageUrls} productName={product.name} />

            {/* Product Details */}
            <div className="p-4 md:p-6 flex flex-col">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-2xl md:text-3xl font-bold text-primary">{product.name}</CardTitle>
                <Badge variant="outline" className="w-fit mt-1">{product.categorySlug}</Badge>
              </CardHeader>

              <CardContent className="p-0 flex-grow space-y-3">
                <CardDescription className="text-base text-foreground/80 leading-relaxed">
                  {product.description}
                </CardDescription>
                
                <p className="text-3xl font-bold text-accent">
                  {product.price.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}
                </p>

                <div>
                  <span className="font-semibold">التوفر: </span>
                  {product.stock > 0 ? (
                    <Badge variant="default" className="bg-green-500/20 text-green-300 border-green-400">
                      {product.stock > 5 ? "متوفر في المخزون" : `متبقي ${product.stock} فقط!`}
                    </Badge>
                  ) : (
                    <Badge variant="destructive">نفذ المخزون</Badge>
                  )}
                </div>
              </CardContent>
              
              <div className="mt-auto pt-4">
                <AddToCartButton product={product} />
              </div>
            </div>
          </div>
        </Card>

        {/* Smart Recommendations Section */}
        <SmartRecommendationsLoader product={product} />

        {/* Related Products Section (Fallback or alternative) */}
        {relatedProducts.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-center md:text-start flex items-center">
              <ThumbsUp className="mr-2 h-6 w-6 text-primary" />
              منتجات مشابهة قد تعجبك
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map(relatedProduct => (
                <Card key={relatedProduct.id} className="overflow-hidden shadow-lg hover:shadow-primary/20 transition-all duration-300 flex flex-col h-full group bg-card hover:border-primary/50 border border-transparent">
                  <CardHeader className="p-0">
                    <a href={`/products/${relatedProduct.id}`} className="block">
                      <div className="aspect-square relative w-full overflow-hidden rounded-t-lg">
                        <Image
                          src={relatedProduct.imageUrls[0] || 'https://picsum.photos/seed/related/400/400'}
                          alt={relatedProduct.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          data-ai-hint="related product"
                        />
                      </div>
                    </a>
                  </CardHeader>
                  <CardContent className="p-2 md:p-3 flex-grow">
                    <a href={`/products/${relatedProduct.id}`} className="block">
                      <CardTitle className="text-xs sm:text-sm md:text-base font-semibold mb-1 truncate group-hover:text-primary transition-colors leading-tight">
                        {relatedProduct.name}
                      </CardTitle>
                    </a>
                  </CardContent>
                  <CardContent className="p-2 md:p-3 pt-0">
                     <p className="text-sm md:text-base font-bold text-primary self-center sm:self-auto">
                        {relatedProduct.price.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </MainLayout>
  );
}
