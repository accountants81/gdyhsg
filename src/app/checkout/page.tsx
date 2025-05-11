"use client";

import React, { useEffect, useActionState, useRef } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';
import { Loader2, Lock, ShoppingBag, UserCircle, MapPin, CreditCard, PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EGYPTIAN_GOVERNORATES, PAYMENT_METHODS_AR, MIN_ORDER_VALUE } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { createOrderAction, type CreateOrderInput } from './actions';
import type { Order } from '@/lib/types';
import Image from 'next/image';
import { useFormStatus } from 'react-dom';

const initialFormState = {
  success: false,
  message: '',
  order: undefined as Order | undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full mt-6" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
      {pending ? 'جاري تأكيد الطلب...' : 'تأكيد الطلب والدفع'}
    </Button>
  );
}


export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const { cartItems, getCartTotal, getCartItemCount, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction] = useActionState(createOrderAction, initialFormState);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login?redirect=/checkout');
    }
    if (!authLoading && user && cartItems.length === 0) {
        router.replace('/cart');
    }
    if (!authLoading && user && getCartTotal() < MIN_ORDER_VALUE) {
      toast({
        title: "الحد الأدنى للطلب",
        description: `الحد الأدنى لقيمة الطلب هو ${MIN_ORDER_VALUE} جنيه مصري.`,
        variant: "destructive",
      });
      router.replace('/cart');
    }
  }, [user, authLoading, router, cartItems, getCartTotal, toast]);

  useEffect(() => {
    if(state.message){
        if(state.success && state.order){
            toast({
                title: "تم الطلب بنجاح!",
                description: `${state.message}. سيتم توجيهك لصفحة تتبع الطلب.`,
                duration: 5000,
            });
            clearCart();
            router.push(`/track-order?orderId=${state.order.id}&email=${state.order.customerDetails.email || state.order.customerDetails.phone}`);
        } else {
            toast({
                title: "خطأ في الطلب",
                description: state.message,
                variant: "destructive",
            });
        }
    }
  }, [state, toast, router, clearCart]);


  if (authLoading || (!user && !authLoading) || cartItems.length === 0 || getCartTotal() < MIN_ORDER_VALUE) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-6" />
          <h1 className="text-2xl font-semibold">جاري التحضير للدفع...</h1>
          <p className="text-muted-foreground mt-2">الرجاء الانتظار قليلاً.</p>
        </div>
      </MainLayout>
    );
  }

  const cartTotal = getCartTotal();

  const handleSubmit = (formData: FormData) => {
    const data: CreateOrderInput = {
        userId: user?.id || null,
        customerName: formData.get('customerName') as string,
        customerPhone: formData.get('customerPhone') as string,
        customerAlternatePhone: formData.get('customerAlternatePhone') as string || undefined,
        customerAddress: formData.get('customerAddress') as string,
        customerLandmark: formData.get('customerLandmark') as string || undefined,
        customerEmail: formData.get('customerEmail') as string || user?.email || undefined,
        customerGovernorate: formData.get('customerGovernorate') as string,
        paymentMethod: formData.get('paymentMethod') as Order['paymentMethod'],
        cartItems: cartItems,
    };
    formAction(data);
  };


  return (
    <MainLayout>
      <div className="container mx-auto px-2 sm:px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center md:text-start">الدفع وإتمام الطلب</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <form ref={formRef} action={handleSubmit} className="md:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><UserCircle className="h-6 w-6 text-primary"/> معلومات العميل</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="customerName">الاسم بالكامل <span className="text-destructive">*</span></Label>
                            <Input id="customerName" name="customerName" defaultValue={user?.name || ''} required placeholder="مثال: محمد أحمد عبدالله" />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="customerEmail">البريد الإلكتروني</Label>
                            <Input id="customerEmail" name="customerEmail" type="email" defaultValue={user?.email || ''} placeholder="example@mail.com" />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="customerPhone">رقم الهاتف الأساسي <span className="text-destructive">*</span></Label>
                            <Input id="customerPhone" name="customerPhone" type="tel" defaultValue={user?.phone || ''} required placeholder="01xxxxxxxxx" />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="customerAlternatePhone">رقم هاتف احتياطي (اختياري)</Label>
                            <Input id="customerAlternatePhone" name="customerAlternatePhone" type="tel" placeholder="01xxxxxxxxx" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><MapPin className="h-6 w-6 text-primary"/> عنوان الشحن</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="space-y-1.5">
                            <Label htmlFor="customerGovernorate">المحافظة <span className="text-destructive">*</span></Label>
                            <Select name="customerGovernorate" required>
                                <SelectTrigger id="customerGovernorate">
                                    <SelectValue placeholder="اختر محافظتك" />
                                </SelectTrigger>
                                <SelectContent>
                                {EGYPTIAN_GOVERNORATES.map(gov => (
                                    <SelectItem key={gov.name} value={gov.name}>{gov.name} (+{gov.shippingCost} ج.م)</SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="customerAddress">العنوان بالتفصيل <span className="text-destructive">*</span></Label>
                            <Textarea id="customerAddress" name="customerAddress" required placeholder="مثال: 123 شارع النصر، بجوار مسجد السلام، الدور الثالث، شقة 5" />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="customerLandmark">أقرب علامة مميزة (اختياري)</Label>
                            <Input id="customerLandmark" name="customerLandmark" placeholder="مثال: أمام مدرسة المستقبل" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><CreditCard className="h-6 w-6 text-primary"/> طريقة الدفع</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-1.5">
                            <Label htmlFor="paymentMethod">اختر طريقة الدفع <span className="text-destructive">*</span></Label>
                            <Select name="paymentMethod" required defaultValue="cod">
                                <SelectTrigger id="paymentMethod">
                                    <SelectValue placeholder="اختر طريقة الدفع" />
                                </SelectTrigger>
                                <SelectContent>
                                {Object.entries(PAYMENT_METHODS_AR).map(([key, value]) => (
                                    <SelectItem key={key} value={key}>{value}</SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                        </div>
                         <SubmitButton />
                    </CardContent>
                </Card>
            </form>

            <div className="md:col-span-1">
                <Card className="sticky top-24 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ShoppingBag className="h-6 w-6 text-primary"/> ملخص طلبك ({getCartItemCount()} منتجات)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex justify-between items-start text-sm border-b pb-2 last:border-b-0">
                                <div className="flex items-start gap-2">
                                    <Image src={item.imageUrls[0] || 'https://picsum.photos/seed/checkoutitem/60/60'} alt={item.name} width={60} height={60} className="rounded-md object-cover aspect-square" data-ai-hint="product thumbnail" />
                                    <div>
                                        <p className="font-medium leading-tight">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">الكمية: {item.quantity}</p>
                                        <p className="text-xs text-muted-foreground">{item.price.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })} للقطعة</p>
                                    </div>
                                </div>
                                <p className="font-semibold pt-1">{(item.price * item.quantity).toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</p>
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter className="flex flex-col pt-4 border-t">
                        <div className="flex justify-between w-full text-md mb-1">
                            <span>إجمالي المنتجات:</span>
                            <span>{cartTotal.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</span>
                        </div>
                        <div className="flex justify-between w-full text-md mb-2">
                            <span>الشحن:</span>
                            <span className="text-muted-foreground">(يحدد بناءً على المحافظة)</span>
                        </div>
                        <div className="flex justify-between w-full font-bold text-lg text-primary mb-4">
                            <span>الإجمالي النهائي:</span>
                            <span>(سيتم تحديده)</span>
                        </div>
                        <p className="text-xs text-muted-foreground text-center">الحد الأدنى للطلب هو {MIN_ORDER_VALUE} جنيه مصري. تكلفة الشحن تضاف للإجمالي النهائي.</p>
                        <Button variant="outline" asChild className="w-full mt-4">
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
