
"use client";

import React, { useState, useEffect } from 'react';
import { getSmartRecommendations, type SmartRecommendationsInput, type SmartRecommendationsOutput } from '@/ai/flows/smart-recommendations';
import type { Product as ProductType } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SmartRecommendationsLoaderProps {
  product: ProductType;
}

export default function SmartRecommendationsLoader({ product }: SmartRecommendationsLoaderProps) {
  const [recommendations, setRecommendations] = useState<SmartRecommendationsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchRecommendations() {
      if (!product) return;
      setIsLoading(true);
      try {
        const input: SmartRecommendationsInput = {
          productName: product.name,
          productDescription: product.description,
          category: product.categorySlug,
          // userHistory: "Optional: User's past purchases or viewed items string" 
        };
        const result = await getSmartRecommendations(input);
        setRecommendations(result);
      } catch (error) {
        console.error("Failed to fetch smart recommendations:", error);
        toast({
          title: "خطأ في جلب التوصيات",
          description: "لم نتمكن من تحميل التوصيات الذكية في الوقت الحالي.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecommendations();
  }, [product, toast]);

  if (isLoading) {
    return (
      <div className="mt-12 py-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-3" />
        <p className="text-muted-foreground">جاري البحث عن توصيات ذكية لك...</p>
      </div>
    );
  }

  if (!recommendations || recommendations.recommendedProducts.length === 0) {
    return null; // Don't render anything if no recommendations or error occurred
  }

  return (
    <section className="mt-12">
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-xl md:text-2xl">
            <Lightbulb className="mr-2 h-6 w-6 text-primary" />
            نقترح عليك أيضاً
          </CardTitle>
          <CardDescription>منتجات قد تهمك بناءً على اختيارك.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.recommendedProducts.map((recProduct, index) => (
              <Card key={index} className="overflow-hidden flex flex-col group">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">{recProduct.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-xs text-muted-foreground mb-2 h-10 overflow-hidden text-ellipsis">{recProduct.description}</p>
                  <p className="text-xs font-semibold text-primary/80">لماذا نوصي به؟ <span className="text-muted-foreground font-normal">{recProduct.reason}</span></p>
                </CardContent>
                <CardContent className="pt-2"> {/* CardFooter equivalent for spacing */}
                   {/* Placeholder for image and link if available - Genkit doesn't return image/link */}
                  <Button size="sm" variant="outline" className="w-full" asChild>
                    {/* In a real scenario, you'd link to the product or search page */}
                    <Link href={`/products?search=${encodeURIComponent(recProduct.name)}`}>
                        عرض المنتج (مثال)
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
