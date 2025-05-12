
"use client";
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
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
  const [state, formAction] = useActionState(addProductAction, initialState);
  const { toast } = useToast();
  const [otherImageCount, setOtherImageCount] = useState<number>(0); // Number of additional file inputs to show

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({ title: 'نجاح', description: state.message });
        // Optionally reset form or redirect here
        setOtherImageCount(0); // Reset additional image fields
        // Consider formRef.current.reset() if you add a ref to the form
      } else {
        toast({ title: 'خطأ', description: state.message, variant: 'destructive' });
      }
    }
  }, [state, toast]);

  const handleAddImageField = () => {
    if (otherImageCount < 4) { // Max 4 other images
      setOtherImageCount(prev => prev + 1);
    }
  };

  const handleRemoveImageField = (index: number) => {
    // This logic is tricky if inputs are not individually controlled
    // For now, just reduce the count, which removes the last added input
    if (otherImageCount > 0) {
       setOtherImageCount(prev => prev -1);
    }
  };
  
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
        <form action={formAction} encType="multipart/form-data">
          <CardHeader>
            <CardTitle>تفاصيل المنتج</CardTitle>
            <CardDescription>قم بإدخال معلومات المنتج الجديد. يمكنك إضافة صورة رئيسية و حتى 4 صور إضافية.</CardDescription>
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
              <Label htmlFor="mainImageFile">الصورة الرئيسية للمنتج</Label>
              <Input id="mainImageFile" name="mainImageFile" type="file" accept="image/*" />
            </div>

            <div className="space-y-2">
              <Label>صور إضافية (حتى 4 صور)</Label>
              {Array.from({ length: otherImageCount }).map((_, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="file"
                    name={`otherImageFile${index}`}
                    accept="image/*"
                  />
                  {/* Simple remove: removes the last added field. More complex removal would require managing an array of file states. */}
                   <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveImageField(index)} aria-label="إزالة حقل الصورة">
                        <PlusCircle className="h-4 w-4 rotate-45 text-destructive" />
                    </Button>
                </div>
              ))}
              {otherImageCount < 4 && (
                <Button type="button" variant="outline" size="sm" onClick={handleAddImageField} className="mt-2">
                  <PlusCircle className="mr-2 h-4 w-4" /> إضافة صورة أخرى
                </Button>
              )}
               <p className="text-xs text-muted-foreground">اختر الصور من جهازك. سيتم استخدام صور افتراضية إذا لم يتم رفع صور.</p>
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
