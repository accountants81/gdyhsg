
"use client";
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { addOfferAction } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CATEGORIES } from '@/lib/constants';
import { MOCK_PRODUCTS } from '@/data/products'; // Assuming MOCK_PRODUCTS for product selection
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { ArrowRight, Loader2, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import React, { useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

const initialState = {
  success: false,
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
      {pending ? 'جاري الإضافة...' : 'إضافة العرض'}
    </Button>
  );
}

export default function AddOfferPage() {
  const [state, formAction] = useActionState(addOfferAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({ title: 'نجاح', description: state.message });
        // Optionally reset form or redirect here
      } else {
        toast({ title: 'خطأ', description: state.message, variant: 'destructive' });
      }
    }
  }, [state, toast]);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">إضافة عرض جديد</h1>
        <Button variant="outline" asChild>
          <Link href="/admin/offers">
            <ArrowRight className="mr-2 h-4 w-4" /> العودة لقائمة العروض
          </Link>
        </Button>
      </div>
      <Card>
        <form action={formAction}>
          <CardHeader>
            <CardTitle>تفاصيل العرض</CardTitle>
            <CardDescription>قم بإدخال معلومات العرض الجديد.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">عنوان العرض</Label>
              <Input id="title" name="title" required placeholder="مثال: خصم 20% على الجرابات" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">وصف العرض (اختياري)</Label>
              <Textarea id="description" name="description" placeholder="وصف تفصيلي للعرض..." />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="productId">منتج مرتبط (اختياري)</Label>
                    <Select name="productId">
                        <SelectTrigger id="productId">
                        <SelectValue placeholder="اختر منتجًا" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="">لا يوجد منتج محدد</SelectItem>
                        {MOCK_PRODUCTS.map(product => (
                            <SelectItem key={product.id} value={product.id}>
                            {product.name}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="categorySlug">فئة مرتبطة (اختياري)</Label>
                    <Select name="categorySlug">
                        <SelectTrigger id="categorySlug">
                        <SelectValue placeholder="اختر فئة" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="">لا توجد فئة محددة</SelectItem>
                        {CATEGORIES.map(category => (
                            <SelectItem key={category.slug} value={category.slug}>
                            {category.name}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountPercentage">نسبة الخصم (اختياري، 0-100)</Label>
              <Input id="discountPercentage" name="discountPercentage" type="number" step="0.01" min="0" max="100" placeholder="مثال: 15" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">تاريخ البدء</Label>
                <Input id="startDate" name="startDate" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">تاريخ الانتهاء</Label>
                <Input id="endDate" name="endDate" type="date" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">رابط صورة العرض (اختياري)</Label>
              <Input id="imageUrl" name="imageUrl" type="url" placeholder="https://example.com/offer-banner.jpg" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="couponCode">كود الخصم (اختياري)</Label>
              <Input id="couponCode" name="couponCode" type="text" placeholder="مثال: RAMADAN20" />
            </div>

            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Checkbox id="isActive" name="isActive" defaultChecked />
              <Label htmlFor="isActive" className="cursor-pointer">
                العرض فعال؟
              </Label>
            </div>

          </CardContent>
          <CardFooter className="flex justify-end">
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
