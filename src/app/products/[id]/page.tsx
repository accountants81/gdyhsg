import React from 'react';
import { ThumbsUp, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '@/components/ui/card';
import MainLayout from '@/layouts/MainLayout';

const ProductPage = ({ product, relatedProducts }) => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Product Main Content Here */}
        
        {/* Smart Recommendations */}
        <SmartRecommendationsLoader product={product} />

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-12 animate-fade-in" data-testid="related-products-section">
            <h2 className="text-2xl font-bold mb-6 text-center md:text-start flex items-center justify-center md:justify-start">
              <ThumbsUp className="mr-2 h-6 w-6 text-primary" />
              منتجات مشابهة قد تعجبك
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map(relatedProduct => (
                <Card 
                  key={relatedProduct.id} 
                  className="overflow-hidden shadow-lg hover:shadow-primary/20 transition-all duration-300 flex flex-col h-full group bg-card hover:border-primary/50 border border-transparent"
                  data-product-id={relatedProduct.id}
                >
                  <CardHeader className="p-0 relative">
                    <Link 
                      href={`/products/${relatedProduct.id}`} 
                      passHref 
                      legacyBehavior
                      prefetch={false}
                    >
                      <a className="block focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-t-lg">
                        <div className="aspect-square relative w-full overflow-hidden rounded-t-lg">
                          <Image
                            src={relatedProduct.imageUrls[0] || '/images/placeholder-product.jpg'}
                            alt={relatedProduct.name || 'صورة المنتج'}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            quality={85}
                            placeholder="blur"
                            blurDataURL="data:image/svg+xml;base64,..."
                            onError={(e) => {
                              e.currentTarget.src = '/images/placeholder-product.jpg';
                            }}
                          />
                          {relatedProduct.discountPercentage > 0 && (
                            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              خصم {relatedProduct.discountPercentage}%
                            </span>
                          )}
                        </div>
                      </a>
                    </Link>
                  </CardHeader>
                  <CardContent className="p-2 md:p-3 flex-grow">
                    <Link 
                      href={`/products/${relatedProduct.id}`} 
                      passHref 
                      legacyBehavior
                      prefetch={false}
                    >
                      <a className="block hover:no-underline focus:outline-none">
                        <CardTitle 
                          className="text-xs sm:text-sm md:text-base font-semibold mb-1 line-clamp-2 group-hover:text-primary transition-colors leading-tight"
                          title={relatedProduct.name}
                        >
                          {relatedProduct.name}
                        </CardTitle>
                        {relatedProduct.brand && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {relatedProduct.brand}
                          </p>
                        )}
                      </a>
                    </Link>
                  </CardContent>
                  <CardFooter className="p-2 md:p-3 pt-0 flex flex-col items-start gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {relatedProduct.originalPrice > relatedProduct.price && (
                        <p className="text-xs line-through text-gray-500 dark:text-gray-400">
                          {relatedProduct.originalPrice.toLocaleString('ar-EG', { 
                            style: 'currency', 
                            currency: 'EGP',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2
                          })}
                        </p>
                      )}
                      <p className="text-sm md:text-base font-bold text-primary">
                        {relatedProduct.price.toLocaleString('ar-EG', { 
                          style: 'currency', 
                          currency: 'EGP',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 2
                        })}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between w-full mt-1">
                      {relatedProduct.rating > 0 ? (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs ml-1">
                            {relatedProduct.rating.toFixed(1)}
                          </span>
                        </div>
                      ) : (
                        <div className="h-4"></div> {/* Spacer for consistent layout */}
                      )}
                      
                      {relatedProduct.inStock !== undefined && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          relatedProduct.inStock 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {relatedProduct.inStock ? 'متوفر' : 'غير متوفر'}
                        </span>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </MainLayout>
  );
};

export default ProductPage;
