
"use client";

import React, { useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Minus, Plus, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartItemCount, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleQuantityChange = (productId: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    } else {
      removeFromCart(productId);
    }
  };

  const handleCheckout = () => {
    if (authLoading) return; // Wait if auth state is still loading

    if (!user) {
      toast({
        title: "تسجيل الدخول مطلوب",
        description: "الرجاء تسجيل الدخول للمتابعة إلى الدفع.",
        variant: "destructive",
      });
      router.push('/login?redirect=/cart'); // Redirect to login, then back to cart
      return;
    }
    // Proceed to checkout page (to be created)
    // For now, just show a toast
    router.push('/checkout'); 
  };
  
  if (cartItems.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          <ShoppingCart className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
          <h1 className="text-3xl font-bold mb-4">سلة التسوق فارغة</h1>
          <p className="text-muted-foreground mb-8">لم تقم بإضافة أي منتجات إلى السلة بعد.</p>
          <Button asChild size="lg">
            <Link href="/">
              <ArrowLeft className="mr-2 h-5 w-5" /> متابعة التسوق
            </Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-2 sm:px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center md:text-start">سلة التسوق الخاصة بك</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <Card key={item.id} className="flex flex-col sm:flex-row items-center p-4 gap-4 shadow-md">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0">
                  <Image
                    src={item.imageUrls[0] || 'https://picsum.photos/seed/cartitem/100/100'}
                    alt={item.name}
                    fill
                    className="rounded-md object-cover"
                    sizes="(max-width: 640px) 100px, 120px"
                    data-ai-hint="product in cart"
                  />
                </div>
                <div className="flex-grow text-center sm:text-start">
                  <Link href={`/products/${item.id}`}>
                    <h2 className="text-lg font-semibold hover:text-primary transition-colors">{item.name}</h2>
                  </Link>
                  <p className="text-sm text-muted-foreground">{item.price.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })} للقطعة</p>
                </div>
                <div className="flex items-center gap-2 my-2 sm:my-0 flex-shrink-0">
                  <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item.id, item.quantity, -1)}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val) && val > 0) updateQuantity(item.id, val);
                        else if (!isNaN(val) && val <=0) removeFromCart(item.id);
                    }}
                    className="w-16 h-10 text-center"
                    aria-label={`كمية ${item.name}`}
                  />
                  <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item.id, item.quantity, 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-md font-semibold text-primary flex-shrink-0 w-full sm:w-auto text-center sm:text-end">
                  الإجمالي: {(item.price * item.quantity).toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="text-destructive hover:text-destructive/80 flex-shrink-0" aria-label={`إزالة ${item.name}`}>
                  <Trash2 className="h-5 w-5" />
                </Button>
              </Card>
            ))}
             <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={clearCart} className="text-destructive border-destructive hover:bg-destructive/10">
                <Trash2 className="mr-2 h-4 w-4" /> إفراغ السلة
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-lg"> {/* Sticky summary card */}
              <CardHeader>
                <CardTitle className="text-2xl">ملخص الطلب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>عدد المنتجات:</span>
                  <span>{getCartItemCount()}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg">
                  <span>الإجمالي الفرعي:</span>
                  <span>{getCartTotal().toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</span>
                </div>
                <p className="text-xs text-muted-foreground">الشحن والضرائب سيتم حسابها عند الدفع.</p>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Button onClick={handleCheckout} className="w-full" size="lg" disabled={authLoading}>
                  {authLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'المتابعة للدفع'}
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" /> متابعة التسوق
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
