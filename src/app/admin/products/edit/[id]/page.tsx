
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
import { ArrowRight, Loader2, Save, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import React, { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';

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
  
  // State for image URLs
  const [mainImageUrl, setMainImageUrl] = useState('');
  const [otherImageUrls, setOtherImageUrls] = useState<string[]>([]);


  useEffect(() => {
    async function fetchProduct() {
      setIsLoadingProduct(true);
      const fetchedProduct = await getProductById(productId);
      if (fetchedProduct) {
        setProduct(fetchedProduct);
        setMainImageUrl(fetchedProduct.imageUrls[0] || '');
        // Ensure otherImageUrls has at least one empty string for the input field if no other images exist, up to 4.
        const existingOtherUrls = fetchedProduct.imageUrls.slice(1, 5);
        setOtherImageUrls(existingOtherUrls.length > 0 ? existingOtherUrls : ['']);

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
        setProduct(state.product); // Update local product state with returned data
        setMainImageUrl(state.product.imageUrls[0] || '');
        const existingOtherUrls = state.product.imageUrls.slice(1, 5);
        setOtherImageUrls(existingOtherUrls.length > 0 ? existingOtherUrls : ['']);

      } else if (!state.success) {
        toast({ title: 'خطأ', description: state.message, variant: 'destructive' });
      }
    }
  }, [state, toast]);

  const handleAddImageUrlField = () => {
    if (otherImageUrls.length < 4) { // Main image (handled by mainImageUrl) + 4 others
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
    formData.set('mainImageUrl', mainImageUrl.trim());
    const cleanedOtherUrls = otherImageUrls.map(url => url.trim()).filter(url => url);
    formData.set('otherImageUrls', cleanedOtherUrls.join(','));
    return formData;
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
        <form action={(formData) => formAction(prepareFormData(formData))}>
          <CardHeader>
            <CardTitle>تفاصيل المنتج</CardTitle>
            <CardDescription>قم بتحديث معلومات المنتج.</CardDescription>
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
              <Label htmlFor="mainImageUrl">رابط الصورة الرئيسية للمنتج</Label>
              <Input 
                id="mainImageUrl" 
                name="mainImageUrl" 
                type="url" 
                value={mainImageUrl}
                onChange={(e) => setMainImageUrl(e.target.value)}
                placeholder="https://example.com/main-image.jpg" 
              />
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
                   {otherImageUrls.length > 0 && (
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
               <p className="text-xs text-muted-foreground">اترك الحقول فارغة للاحتفاظ بالصور الحالية، أو قم بتعديلها. لحذف كل الصور، اترك كل الحقول فارغة.</p>
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
