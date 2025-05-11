
"use client";
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { updateOfferAction, getOfferById } from '../../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CATEGORIES, MOCK_PRODUCTS } from '@/lib/constants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { ArrowRight, Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import React, { useEffect, useState } from 'react';
import type { Offer } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';

const initialState = {
  success: false,
  message: '',
  offer: undefined as Offer | undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
      {pending ? 'جاري الحفظ...' : 'حفظ التعديلات'}
    </Button>
  );
}

interface EditOfferPageProps {
  params: { id: string };
}

export default function EditOfferPage({ params }: EditOfferPageProps) {
  const { id: offerId } = params;
  const [state, formAction] = useActionState(updateOfferAction.bind(null, offerId), initialState);
  const { toast } = useToast();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [isLoadingOffer, setIsLoadingOffer] = useState(true);

  useEffect(() => {
    async function fetchOffer() {
      setIsLoadingOffer(true);
      const fetchedOffer = await getOfferById(offerId);
      if (fetchedOffer) {
        setOffer(fetchedOffer);
      } else {
        toast({ title: 'خطأ', description: 'لم يتم العثور على العرض.', variant: 'destructive' });
      }
      setIsLoadingOffer(false);
    }
    fetchOffer();
  }, [offerId, toast]);

  useEffect(() => {
    if (state.message) {
      if (state.success && state.offer) {
        toast({ title: 'نجاح', description: state.message });
        setOffer(state.offer); // Update local offer state with returned data
      } else if (!state.success) {
        toast({ title: 'خطأ', description: state.message, variant: 'destructive' });
      }
    }
  }, [state, toast]);

  if (isLoadingOffer) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ms-2">جاري تحميل بيانات العرض...</p>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-destructive mb-4">لم يتم العثور على العرض.</p>
        <Button variant="outline" asChild>
          <Link href="/admin/offers">
             العودة لقائمة العروض
          </Link>
        </Button>
      </div>
    );
  }
  
  // Helper to format date for input type="date"
  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'yyyy-MM-dd');
    } catch {
      return ''; // Handle invalid date string
    }
  };


  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">تعديل العرض: {offer.title}</h1>
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
            <CardDescription>قم بتحديث معلومات العرض.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">عنوان العرض</Label>
              <Input id="title" name="title" required defaultValue={offer.title} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">وصف العرض (اختياري)</Label>
              <Textarea id="description" name="description" defaultValue={offer.description || ''} />
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="productId">منتج مرتبط (اختياري)</Label>
                    <Select name="productId" defaultValue={offer.productId || ""}>
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
                    <Select name="categorySlug" defaultValue={offer.categorySlug || ""}>
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
              <Input id="discountPercentage" name="discountPercentage" type="number" step="0.01" min="0" max="100" defaultValue={offer.discountPercentage || ''} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">تاريخ البدء</Label>
                <Input id="startDate" name="startDate" type="date" required defaultValue={formatDateForInput(offer.startDate)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">تاريخ الانتهاء</Label>
                <Input id="endDate" name="endDate" type="date" required defaultValue={formatDateForInput(offer.endDate)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">رابط صورة العرض (اختياري)</Label>
              <Input id="imageUrl" name="imageUrl" type="url" defaultValue={offer.imageUrl || ''} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="couponCode">كود الخصم (اختياري)</Label>
              <Input id="couponCode" name="couponCode" type="text" defaultValue={offer.couponCode || ''} />
            </div>

            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Checkbox id="isActive" name="isActive" defaultChecked={offer.isActive} />
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
