
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

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="p-0">
        <Link href={`/products/${product.id}`} className="block">
          <div className="aspect-square relative w-full overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              data-ai-hint="mobile accessory"
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Link href={`/products/${product.id}`} className="block">
          <CardTitle className="text-lg font-semibold mb-1 truncate hover:text-primary transition-colors">
            {product.name}
          </CardTitle>
        </Link>
        <CardDescription className="text-sm text-muted-foreground h-10 overflow-hidden text-ellipsis">
          {product.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4 flex items-center justify-between">
        <p className="text-xl font-bold text-primary">
          {product.price.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}
        </p>
        <Button size="sm" onClick={() => addToCart(product)}>
          <ShoppingCart className="h-4 w-4 me-2" />
          أضف للسلة
        </Button>
      </CardFooter>
    </Card>
  );
}
