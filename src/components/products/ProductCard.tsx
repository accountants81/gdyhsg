
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
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full group">
      <CardHeader className="p-0">
        <Link href={`/products/${product.id}`} className="block">
          <div className="aspect-square relative w-full overflow-hidden">
            <Image
              src={firstImage}
              alt={product.name}
              fill
              sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              data-ai-hint="mobile accessory"
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-2 md:p-3 flex-grow">
        <Link href={`/products/${product.id}`} className="block">
          <CardTitle className="text-sm md:text-base font-semibold mb-1 truncate group-hover:text-primary transition-colors">
            {product.name}
          </CardTitle>
        </Link>
        <CardDescription className="text-xs text-muted-foreground min-h-[2.5rem] max-h-[2.5rem] overflow-hidden text-ellipsis leading-tight">
          {product.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-2 md:p-3 flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-2">
        <p className="text-base md:text-lg font-bold text-primary self-center sm:self-auto">
          {product.price.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}
        </p>
        <Button size="sm" onClick={() => addToCart(product)} className="w-full sm:w-auto text-xs sm:text-sm">
          <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 me-1 sm:me-2" />
          أضف للسلة
        </Button>
      </CardFooter>
    </Card>
  );
}
