
"use client";
import { useFormState, useFormStatus } from 'react-dom';
import { addProductAction } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CATEGORIES } from '@/lib/constants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { ArrowRight, Loader2, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import React, { useEffect, useState } from 'react';

const initialState = {
  success: false,
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
      {pending ? 'جاري الإضافة...' : 'إضافة المنتج'}
    </Button>
  );
}

export default function AddProductPage() {
  const [state, formAction] = useFormState(addProductAction, initialState);
  const { toast } = useToast();
  const [otherImageUrls, setOtherImageUrls] = useState<string[]>(['']); // Start with one empty input for other images

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

  const handleAddImageUrlField = () => {
    if (otherImageUrls.length < 4) { // Main image + 4 others = 5 total
      setOtherImageUrls([...otherImageUrls, '']);
    }
  };

  const handleOtherImageUrlChange = (index: number, value: string) => {
    const newUrls = [...otherImageUrls];
    newUrls[index] = value;
    setOtherImageUrls(newUrls);
  };

  const handleRemoveImageUrlField = (index: number) => {
    if (otherImageUrls.length > 1) {
      const newUrls = otherImageUrls.filter((_, i) => i !== index);
      setOtherImageUrls(newUrls);
    } else if (otherImageUrls.length === 1) {
       setOtherImageUrls(['']); // Reset the last field instead of removing it
    }
  };
  
  const prepareFormData = (formData: FormData) => {
    const otherUrls = otherImageUrls.map(url => url.trim()).filter(url => url);
    formData.set('otherImageUrls', otherUrls.join(','));
    return formData;
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">إضافة منتج جديد</h1>
        <Button variant="outline" asChild>
          <Link href="/admin/products">
            <ArrowRight className="mr-2 h-4 w-4" /> العودة لقائمة المنتجات
          </Link>
        </Button>
      </div>
      <Card>
        <form action={(formData) => formAction(prepareFormData(formData))}>
          <CardHeader>
            <CardTitle>تفاصيل المنتج</CardTitle>
            <CardDescription>قم بإدخال معلومات المنتج الجديد.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">اسم المنتج</Label>
              <Input id="name" name="name" required placeholder="مثال: جراب آيفون فاخر" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">وصف المنتج</Label>
              <Textarea id="description" name="description" required placeholder="وصف تفصيلي للمنتج ومميزاته..." />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">السعر (بالجنيه المصري)</Label>
                <Input id="price" name="price" type="number" step="0.01" required placeholder="مثال: 250.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">الكمية المتوفرة (المخزون)</Label>
                <Input id="stock" name="stock" type="number" required placeholder="مثال: 50" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="categorySlug">فئة المنتج</Label>
              <Select name="categorySlug" required>
                <SelectTrigger id="categorySlug">
                  <SelectValue placeholder="اختر الفئة" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category.slug} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mainImageUrl">رابط الصورة الرئيسية للمنتج</Label>
              <Input id="mainImageUrl" name="mainImageUrl" type="url" placeholder="https://example.com/main-image.jpg" />
            </div>

            <div className="space-y-2">
              <Label>روابط صور إضافية (حتى 4 صور)</Label>
              {otherImageUrls.map((url, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="url"
                    value={url}
                    onChange={(e) => handleOtherImageUrlChange(index, e.target.value)}
                    placeholder={`رابط الصورة الإضافية ${index + 1}`}
                  />
                  {otherImageUrls.length > 0 && ( // Show remove button if there's at least one field or if it's not the only field and empty
                     <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveImageUrlField(index)} aria-label="إزالة حقل الصورة">
                        <PlusCircle className="h-4 w-4 rotate-45 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
              {otherImageUrls.length < 4 && (
                <Button type="button" variant="outline" size="sm" onClick={handleAddImageUrlField} className="mt-2">
                  <PlusCircle className="mr-2 h-4 w-4" /> إضافة رابط صورة أخرى
                </Button>
              )}
               <p className="text-xs text-muted-foreground">يمكنك لصق روابط الصور من مواقع مثل Imgur أو Google Photos (تأكد أن الرابط مباشر للصورة وينتهي بـ .jpg, .png, إلخ).</p>
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
