
"use client";
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const firstImage = product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : 'https://picsum.photos/seed/placeholder/400/400';

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-primary/20 transition-all duration-300 flex flex-col h-full group bg-card hover:border-primary/50 border border-transparent">
      <CardHeader className="p-0">
        <Link href={`/products/${product.id}`} className="block">
          <div className="aspect-square relative w-full overflow-hidden rounded-t-lg">
            <Image
              src={firstImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 15vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              data-ai-hint="mobile accessory product"
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-2 md:p-3 flex-grow flex flex-col justify-between">
        <div>
          <Link href={`/products/${product.id}`} className="block">
            <CardTitle className="text-xs sm:text-sm md:text-base font-semibold mb-1 truncate group-hover:text-primary transition-colors leading-tight">
              {product.name}
            </CardTitle>
          </Link>
          <CardDescription className="text-[11px] sm:text-xs text-muted-foreground min-h-[2.25rem] max-h-[2.25rem] sm:min-h-[2.5rem] sm:max-h-[2.5rem] overflow-hidden text-ellipsis leading-snug line-clamp-2">
            {product.description}
          </CardDescription>
        </div>
      </CardContent>
      <CardFooter className="p-2 md:p-3 flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-2 border-t border-border/50 mt-auto">
        <p className="text-sm md:text-base font-bold text-primary self-center sm:self-auto">
          {product.price.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}
        </p>
        <Button 
          size="sm" 
          onClick={() => addToCart(product)} 
          className="w-full sm:w-auto text-[10px] sm:text-xs py-1.5 sm:py-2"
          variant="outline"
        >
          <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 me-1 sm:me-1.5" />
          أضف للسلة
        </Button>
      </CardFooter>
    </Card>
  );
}
