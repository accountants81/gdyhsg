
"use client";

import React, { useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';
import { Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const { cartItems, getCartTotal, getCartItemCount } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login?redirect=/checkout');
    }
    if (!authLoading && user && cartItems.length === 0) {
        // If user is logged in but cart is empty, redirect to cart page which will show "empty cart" message
        router.replace('/cart');
    }
  }, [user, authLoading, router, cartItems]);

  if (authLoading || (!user && !authLoading) || cartItems.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-6" />
          <h1 className="text-2xl font-semibold">جاري التحقق من بياناتك وسلة التسوق...</h1>
          <p className="text-muted-foreground mt-2">سيتم توجيهك قريباً.</p>
        </div>
      </MainLayout>
    );
  }


  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center md:text-start">الدفع</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>تفاصيل الشحن والدفع</CardTitle>
                        <CardDescription>الرجاء إدخال معلومات الشحن واختيار طريقة الدفع.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Placeholder for shipping and payment form */}
                        <div>
                            <h3 className="text-lg font-semibold mb-2">معلومات الشحن</h3>
                            <p className="text-muted-foreground">سيتم إضافة نموذج إدخال عنوان الشحن هنا.</p>
                            {/* Example fields: Name, Address, Governorate, Phone */}
                        </div>
                         <div>
                            <h3 className="text-lg font-semibold mb-2">طريقة الدفع</h3>
                            <p className="text-muted-foreground">سيتم إضافة خيارات الدفع هنا (الدفع عند الاستلام، فودافون كاش، إلخ).</p>
                        </div>
                        <Button type="submit" size="lg" className="w-full" disabled>
                            <Lock className="mr-2 h-4 w-4" /> إتمام الطلب (قيد التطوير)
                        </Button>
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-1">
                <Card className="sticky top-24">
                    <CardHeader>
                        <CardTitle>ملخص الطلب</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex justify-between items-center text-sm border-b pb-2">
                                <div>
                                    <p className="font-medium">{item.name} (x{item.quantity})</p>
                                    <p className="text-xs text-muted-foreground">{item.price.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</p>
                                </div>
                                <p className="font-semibold">{(item.price * item.quantity).toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</p>
                            </div>
                        ))}
                        <div className="flex justify-between font-bold text-lg pt-3">
                            <span>الإجمالي:</span>
                            <span>{getCartTotal().toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</span>
                        </div>
                         <p className="text-xs text-muted-foreground">سيتم إضافة تكلفة الشحن بناءً على المحافظة.</p>
                    </CardContent>
                     <CardFooter>
                        <Button variant="outline" asChild className="w-full">
                            <Link href="/cart">العودة إلى السلة</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
      </div>
    </MainLayout>
  );
}
