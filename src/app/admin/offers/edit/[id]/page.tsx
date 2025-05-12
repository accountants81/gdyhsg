
"use client";
import { useFormStatus } from 'react-dom';
import React, { useEffect, useState, useActionState } from 'react'; 
import { updateOfferAction, getOfferById } from '../../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CATEGORIES } from '@/lib/constants';
import { MOCK_PRODUCTS } from '@/data/products';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { ArrowRight, Loader2, Save, ImageOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Offer } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import Image from 'next/image';

const initialState = {
  success: false,
  message: '',
  offer: undefined as Offer | undefined,
};

const EMPTY_SELECT_VALUE = "NO_SELECTION"; 

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
  const [imageFilePreview, setImageFilePreview] = useState<string | null>(null);
  const [imageUrlText, setImageUrlText] = useState<string>('');


  useEffect(() => {
    async function fetchOffer() {
      setIsLoadingOffer(true);
      const fetchedOffer = await getOfferById(offerId);
      if (fetchedOffer) {
        setOffer(fetchedOffer);
        setImageUrlText(fetchedOffer.imageUrl || '');
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
        setOffer(state.offer); 
        setImageFilePreview(null); // Clear file preview
        setImageUrlText(state.offer.imageUrl || ''); // Update text URL from server response
      } else if (!state.success) {
        toast({ title: 'خطأ', description: state.message, variant: 'destructive' });
      }
    }
  }, [state, toast]);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFilePreview(URL.createObjectURL(file));
    } else {
      setImageFilePreview(null);
    }
  };

  const handleImageUrlTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrlText(e.target.value);
    if(imageFilePreview) setImageFilePreview(null); // Clear file preview if user types URL
  };

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
  
  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'yyyy-MM-dd');
    } catch {
      return ''; 
    }
  };

  const displayImageUrl = imageFilePreview || imageUrlText || null;

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
            <CardDescription>قم بتحديث معلومات العرض. يمكنك رفع صورة جديدة أو تعديل الرابط.</CardDescription>
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
                    <Select name="productId" defaultValue={offer.productId || EMPTY_SELECT_VALUE}>
                        <SelectTrigger id="productId">
                        <SelectValue placeholder="اختر منتجًا" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value={EMPTY_SELECT_VALUE}>لا يوجد منتج محدد</SelectItem>
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
                    <Select name="categorySlug" defaultValue={offer.categorySlug || EMPTY_SELECT_VALUE}>
                        <SelectTrigger id="categorySlug">
                        <SelectValue placeholder="اختر فئة" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value={EMPTY_SELECT_VALUE}>لا توجد فئة محددة</SelectItem>
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
              <Input id="discountPercentage" name="discountPercentage" type="number" step="0.01" min="0" max="100" defaultValue={offer.discountPercentage?.toString() || ''} />
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
                <Label htmlFor="imageUrlFile">تغيير صورة العرض (رفع ملف)</Label>
                <Input id="imageUrlFile" name="imageUrlFile" type="file" accept="image/*" onChange={handleImageFileChange} />
                 <p className="text-xs text-muted-foreground">أو عدّل رابط الصورة أدناه. الرفع المباشر له الأولوية.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">رابط صورة العرض (URL)</Label>
              <Input id="imageUrl" name="imageUrl" type="url" placeholder="اتركه فارغًا أو احذف الرابط لإزالة الصورة إذا لم يتم رفع ملف" value={imageUrlText} onChange={handleImageUrlTextChange} />
            </div>

            {displayImageUrl ? (
                 <div className="my-2">
                    <Label>معاينة الصورة الحالية/الجديدة</Label>
                    <Image src={displayImageUrl} alt="معاينة صورة العرض" width={400} height={150} className="rounded-md object-contain aspect-[16/6] border mt-1" data-ai-hint="offer banner current preview"/>
                </div>
            ) : (
                 <div className="my-2 p-4 border border-dashed rounded-md flex flex-col items-center justify-center text-muted-foreground aspect-[16/6]">
                    <ImageOff className="h-12 w-12 mb-2" />
                    <p>لا توجد صورة محددة للعرض</p>
                </div>
            )}


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
