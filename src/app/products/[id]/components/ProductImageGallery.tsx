
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card'; // Import Card and CardContent

interface ProductImageGalleryProps {
  imageUrls: string[];
  productName: string;
}

export default function ProductImageGallery({ imageUrls, productName }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(imageUrls[0] || 'https://picsum.photos/seed/product_placeholder/600/600');

  if (!imageUrls || imageUrls.length === 0) {
    imageUrls = ['https://picsum.photos/seed/product_default/600/600'];
  }
  
  // Ensure selectedImage is updated if imageUrls[0] changes (though less likely for a static page)
  React.useEffect(() => {
    setSelectedImage(imageUrls[0] || 'https://picsum.photos/seed/product_placeholder_effect/600/600');
  }, [imageUrls]);


  return (
    <div className="p-4 md:p-0">
      <Card className="bg-card/50 border-0 md:border md:rounded-lg overflow-hidden">
        <CardContent className="p-0">
          <div className="aspect-square relative w-full mb-3 md:mb-4 shadow-inner overflow-hidden md:rounded-t-lg">
            <Image
              src={selectedImage}
              alt={`صورة المنتج الرئيسية لـ ${productName}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain transition-opacity duration-300 ease-in-out hover:opacity-90"
              priority
              data-ai-hint="product main image"
            />
          </div>
        </CardContent>
      </Card>
      
      {imageUrls.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 md:gap-3 mt-3 md:mt-0 md:p-4 md:pt-0">
          {imageUrls.map((url, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(url)}
              className={cn(
                "aspect-square relative rounded-md overflow-hidden border-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all",
                selectedImage === url ? "border-primary shadow-lg scale-105" : "border-border hover:border-primary/70"
              )}
              aria-label={`عرض الصورة ${index + 1} لمنتج ${productName}`}
            >
              <Image
                src={url}
                alt={`صورة مصغرة ${index + 1} لـ ${productName}`}
                fill
                sizes="100px"
                className="object-cover"
                data-ai-hint="product thumbnail"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
