"use client";

import React, { useEffect, useActionState, Suspense } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search, Truck, PackageCheck, PackageX, Hourglass, ShoppingBag, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { findOrderByIdAction } from './actions';
import type { Order } from '@/lib/types';
import { useFormStatus } from 'react-dom';
import { ORDER_STATUSES_AR, PAYMENT_METHODS_AR } from '@/lib/constants';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSearchParams } from 'next/navigation';

const initialState = {
  success: false,
  order: undefined as Order | undefined,
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
      {pending ? 'جارِ البحث...' : 'تتبع الطلب'}
    </Button>
  );
}

function OrderStatusIcon({ status }: { status: Order['status'] }) {
    switch (status) {
        case 'pending': return <Hourglass className="h-5 w-5 text-yellow-500" />;
        case 'processing': return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
        case 'shipping': return <Truck className="h-5 w-5 text-sky-500" />;
        case 'delivered': return <PackageCheck className="h-5 w-5 text-green-500" />;
        case 'on_hold': return <Hourglass className="h-5 w-5 text-orange-500" />;
        case 'cancelled':
        case 'rejected': 
            return <PackageX className="h-5 w-5 text-red-500" />;
        default: return <ShoppingBag className="h-5 w-5 text-gray-500" />;
    }
}


function TrackOrderContent() {
  const searchParams = useSearchParams();
  const [state, formAction] = useActionState(findOrderByIdAction, initialState);
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);

  const prefillOrderId = searchParams.get('orderId');
  const prefillVerification = searchParams.get('email') || searchParams.get('phone');


  useEffect(() => {
    if (state.message && !state.success) {
      toast({ title: 'خطأ في البحث', description: state.message, variant: 'destructive' });
    }
  }, [state, toast]);
  
  useEffect(() => {
    if (prefillOrderId && prefillVerification && formRef.current) {
        const orderIdInput = formRef.current.elements.namedItem('orderId') as HTMLInputElement;
        const verificationInput = formRef.current.elements.namedItem('verificationDetail') as HTMLInputElement;
        if(orderIdInput) orderIdInput.value = prefillOrderId;
        if(verificationInput) verificationInput.value = prefillVerification;
        // Automatically submit the form if prefill values exist
        if(formRef.current) {
            const formData = new FormData(formRef.current);
            formAction(formData);
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillOrderId, prefillVerification]); // formAction is stable

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto shadow-xl">
          <CardHeader className="text-center">
            <Truck className="mx-auto h-12 w-12 text-primary mb-4" />
            <CardTitle className="text-3xl font-bold">تتبع طلبك</CardTitle>
            <CardDescription>
              أدخل رقم طلبك وبريدك الإلكتروني أو رقم هاتفك المسجل لمتابعة حالة طلبك.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form ref={formRef} action={formAction} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="orderId">رقم الطلب</Label>
                <Input id="orderId" name="orderId" required placeholder="مثال: order_12345_abcde" defaultValue={prefillOrderId || ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="verificationDetail">البريد الإلكتروني أو رقم الهاتف</Label>
                <Input id="verificationDetail" name="verificationDetail" required placeholder="example@mail.com أو 01xxxxxxxxx" defaultValue={prefillVerification || ''} />
              </div>
              <SubmitButton />
            </form>
          </CardContent>
        </Card>

        {state.success && state.order && (
          <Card className="max-w-3xl mx-auto mt-8 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <OrderStatusIcon status={state.order.status} />
                حالة الطلب: {ORDER_STATUSES_AR[state.order.status]}
              </CardTitle>
              <CardDescription>
                رقم الطلب: {state.order.id} | تاريخ الطلب: {format(new Date(state.order.createdAt), 'PPPp', { locale: arSA })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h4 className="font-semibold mb-1">تفاصيل العميل:</h4>
                  <p><strong>الاسم:</strong> {state.order.customerDetails.name}</p>
                  <p><strong>الهاتف:</strong> {state.order.customerDetails.phone}</p>
                  <p><strong>العنوان:</strong> {state.order.customerDetails.governorate} - {state.order.customerDetails.address}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">ملخص الدفع:</h4>
                  <p><strong>طريقة الدفع:</strong> {PAYMENT_METHODS_AR[state.order.paymentMethod]}</p>
                  <p><strong>إجمالي المنتجات:</strong> {state.order.totalAmount.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</p>
                  <p><strong>تكلفة الشحن:</strong> {state.order.shippingCost.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</p>
                  <p className="font-bold text-lg"><strong>الإجمالي:</strong> {state.order.finalAmount.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</p>
                </div>
              </div>
              
              <h4 className="font-semibold mb-2 text-lg">المنتجات في طلبك:</h4>
              <ScrollArea className="max-h-80 border rounded-md">
                <div className="space-y-3 p-4">
                  {state.order.items.map(item => (
                    <div key={item.id} className="flex items-start gap-4 border-b pb-3 last:border-b-0">
                      <Image 
                        src={item.imageUrls[0] || 'https://picsum.photos/seed/trackitem/80/80'} 
                        alt={item.name} 
                        width={80} 
                        height={80} 
                        className="rounded-md object-cover aspect-square"
                        data-ai-hint="product item"
                      />
                      <div className="flex-grow">
                        <p className="font-semibold text-md">{item.name}</p>
                        <p className="text-sm text-muted-foreground">الكمية: {item.quantity}</p>
                        <p className="text-sm">{item.price.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })} x {item.quantity} = {(item.price * item.quantity).toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
             <CardFooter>
                <p className="text-sm text-muted-foreground">
                    إذا كانت لديك أي استفسارات بخصوص طلبك، يرجى <Link href="/contact" className="text-primary hover:underline">التواصل معنا</Link> مع ذكر رقم الطلب.
                </p>
             </CardFooter>
          </Card>
        )}
        {state.message && !state.success && !state.order && (
             <Card className="max-w-2xl mx-auto mt-8 border-destructive">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="h-6 w-6"/> خطأ في البحث عن الطلب
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{state.message}</p>
                    <p className="mt-2 text-sm text-muted-foreground">يرجى التأكد من إدخال البيانات بشكل صحيح والمحاولة مرة أخرى.</p>
                </CardContent>
             </Card>
        )}
      </div>
    </MainLayout>
  );
}


export default function TrackOrderPage() {
  return (
    // Suspense boundary is required for useSearchParams hook
    <Suspense fallback={<div>جار التحميل...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
