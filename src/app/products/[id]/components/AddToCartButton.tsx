
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/useCart';
import type { Product } from '@/lib/types';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch">
      <div className="flex items-center gap-2">
        <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1 || product.stock === 0}
            aria-label="تقليل الكمية"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          value={quantity}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            if (!isNaN(val) && val > 0) setQuantity(val);
          }}
          min="1"
          max={product.stock > 0 ? product.stock : 1}
          className="w-16 h-10 text-center"
          disabled={product.stock === 0}
          aria-label="الكمية"
        />
        <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= product.stock || product.stock === 0}
            aria-label="زيادة الكمية"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Button 
        onClick={handleAddToCart} 
        size="lg" 
        className="flex-grow" 
        disabled={product.stock === 0}
        aria-label="إضافة إلى السلة"
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        {product.stock === 0 ? "نفذ المخزون" : "أضف إلى السلة"}
      </Button>
    </div>
  );
}
