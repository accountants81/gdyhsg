
"use client";
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { updateProductAction, getProductById } from '../../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CATEGORIES } from '@/lib/constants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { ArrowRight, Loader2, Save, PlusCircle, ImageOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import React, { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import Image from 'next/image';

const initialState = {
  success: false,
  message: '',
  product: undefined as Product | undefined,
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

interface EditProductPageProps {
  params: { id: string };
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id: productId } = params;
  const [state, formAction] = useActionState(updateProductAction.bind(null, productId), initialState);
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  
  // Preview URLs for client-side display of newly selected files
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [otherImagePreviews, setOtherImagePreviews] = useState<(string | null)[]>(Array(4).fill(null));


  useEffect(() => {
    async function fetchProduct() {
      setIsLoadingProduct(true);
      const fetchedProduct = await getProductById(productId);
      if (fetchedProduct) {
        setProduct(fetchedProduct);
      } else {
        toast({ title: 'خطأ', description: 'لم يتم العثور على المنتج.', variant: 'destructive' });
      }
      setIsLoadingProduct(false);
    }
    fetchProduct();
  }, [productId, toast]);

  useEffect(() => {
    if (state.message) {
      if (state.success && state.product) {
        toast({ title: 'نجاح', description: state.message });
        setProduct(state.product); 
        setMainImagePreview(null); // Clear previews after successful update
        setOtherImagePreviews(Array(4).fill(null));
      } else if (!state.success) {
        toast({ title: 'خطأ', description: state.message, variant: 'destructive' });
      }
    }
  }, [state, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setImagePreview: React.Dispatch<React.SetStateAction<string | null>>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };
  
  const handleOtherFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const newPreviews = [...otherImagePreviews];
    if (file) {
      newPreviews[index] = URL.createObjectURL(file);
    } else {
      newPreviews[index] = null;
    }
    setOtherImagePreviews(newPreviews);
  };


  if (isLoadingProduct) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ms-2">جاري تحميل بيانات المنتج...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-destructive mb-4">لم يتم العثور على المنتج.</p>
        <Button variant="outline" asChild>
          <Link href="/admin/products">
             العودة لقائمة المنتجات
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">تعديل المنتج: {product.name}</h1>
        <Button variant="outline" asChild>
          <Link href="/admin/products">
            <ArrowRight className="mr-2 h-4 w-4" /> العودة لقائمة المنتجات
          </Link>
        </Button>
      </div>
      <Card>
        <form action={formAction}>
          <CardHeader>
            <CardTitle>تفاصيل المنتج</CardTitle>
            <CardDescription>قم بتحديث معلومات المنتج. يمكنك رفع صور جديدة لاستبدال الحالية.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">اسم المنتج</Label>
              <Input id="name" name="name" required defaultValue={product.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">وصف المنتج</Label>
              <Textarea id="description" name="description" required defaultValue={product.description} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">السعر (بالجنيه المصري)</Label>
                <Input id="price" name="price" type="number" step="0.01" required defaultValue={product.price} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">الكمية المتوفرة (المخزون)</Label>
                <Input id="stock" name="stock" type="number" required defaultValue={product.stock} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="categorySlug">فئة المنتج</Label>
              <Select name="categorySlug" required defaultValue={product.categorySlug}>
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
              { (mainImagePreview || product.imageUrls[0]) && (
                <Image src={mainImagePreview || product.imageUrls[0]!} alt="الصورة الرئيسية الحالية" width={100} height={100} className="rounded-md object-cover my-2" data-ai-hint="current product image" />
              )}
              <Input 
                id="mainImageFile" 
                name="mainImageFile" 
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setMainImagePreview)}
              />
              <p className="text-xs text-muted-foreground">اترك الحقل فارغًا للاحتفاظ بالصورة الحالية.</p>
            </div>

            <div className="space-y-2">
              <Label>صور إضافية (حتى 4 صور)</Label>
              {Array.from({ length: 4 }).map((_, index) => {
                const existingImageUrl = product.imageUrls[index + 1];
                const previewUrl = otherImagePreviews[index];
                return (
                  <div key={index} className="space-y-1 border-t pt-2 mt-2">
                     <Label htmlFor={`otherImageFile${index}`}>صورة إضافية {index + 1}</Label>
                    {(previewUrl || existingImageUrl) ? (
                       <Image src={previewUrl || existingImageUrl!} alt={`الصورة الإضافية ${index + 1} الحالية`} width={80} height={80} className="rounded-md object-cover my-1" data-ai-hint="additional product image" />
                    ) : (
                      <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center my-1">
                        <ImageOff className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <Input
                      id={`otherImageFile${index}`}
                      name={`otherImageFile${index}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleOtherFileChange(index, e)}
                    />
                  </div>
                );
              })}
               <p className="text-xs text-muted-foreground">اترك الحقول فارغة للاحتفاظ بالصور الحالية أو لإزالة صورة إذا لم تكن موجودة.</p>
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
