
"use client";
import { useFormStatus } from 'react-dom';
import React, { useEffect, useActionState, useState } from 'react'; 
import { addOfferAction } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CATEGORIES } from '@/lib/constants';
import { MOCK_PRODUCTS } from '@/data/products'; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { ArrowRight, Loader2, PlusCircle, ImageUp, ImageOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';

const initialState = {
  success: false,
  message: '',
};

const EMPTY_SELECT_VALUE = "NO_SELECTION"; 

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
  const formRef = React.useRef<HTMLFormElement>(null);
  const [imageFilePreview, setImageFilePreview] = useState<string | null>(null);
  const [imageUrlText, setImageUrlText] = useState<string>('');


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
  }


  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({ title: 'نجاح', description: state.message });
        formRef.current?.reset(); 
        setImageFilePreview(null);
        setImageUrlText('');
      } else {
        toast({ title: 'خطأ', description: state.message, variant: 'destructive' });
      }
    }
  }, [state, toast]);

  const displayImageUrl = imageFilePreview || imageUrlText || null;


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
        <form ref={formRef} action={formAction} encType="multipart/form-data">
          <CardHeader>
            <CardTitle>تفاصيل العرض</CardTitle>
            <CardDescription>قم بإدخال معلومات العرض الجديد. يمكنك رفع صورة أو إدخال رابط مباشر لها.</CardDescription>
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
                    <Select name="productId" defaultValue={EMPTY_SELECT_VALUE}>
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
                    <Select name="categorySlug" defaultValue={EMPTY_SELECT_VALUE}>
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
                <Label htmlFor="imageUrlFile">صورة العرض (رفع ملف)</Label>
                <Input id="imageUrlFile" name="imageUrlFile" type="file" accept="image/*" onChange={handleImageFileChange} />
                 <p className="text-xs text-muted-foreground">أو أدخل رابط صورة أدناه. الرفع المباشر له الأولوية.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">رابط صورة العرض (URL)</Label>
              <Input id="imageUrl" name="imageUrl" type="url" placeholder="https://example.com/offer-banner.jpg" value={imageUrlText} onChange={handleImageUrlTextChange}/>
            </div>
            
            {displayImageUrl ? (
                <div className="my-2">
                    <Label>معاينة الصورة</Label>
                    <Image src={displayImageUrl} alt="معاينة صورة العرض" width={400} height={150} className="rounded-md object-contain aspect-[16/6] border mt-1" data-ai-hint="offer banner preview"/>
                </div>
            ) : (
                 <div className="my-2 p-4 border border-dashed rounded-md flex flex-col items-center justify-center text-muted-foreground aspect-[16/6]">
                    <ImageOff className="h-12 w-12 mb-2" />
                    <p>لا توجد صورة لعرضها</p>
                </div>
            )}


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
