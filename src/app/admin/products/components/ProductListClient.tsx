
"use client";

import React, { useState, useTransition } from 'react';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, PlusCircle, Search, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
// Import server actions once created e.g.
// import { deleteProductAction } from '../actions';

interface ProductListClientProps {
  initialProducts: Product[];
}

export default function ProductListClient({ initialProducts }: ProductListClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("هل أنت متأكد أنك تريد حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.")) {
      return;
    }
    startTransition(async () => {
      // Example of calling a server action
      // const result = await deleteProductAction(productId);
      // For now, simulate client-side deletion
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500)); 
        setProducts(prev => prev.filter(p => p.id !== productId));
        toast({ title: "نجاح", description: "تم حذف المنتج بنجاح." });
      } catch (error) {
        toast({ title: "خطأ", description: "فشل حذف المنتج.", variant: "destructive" });
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rtl:right-3 rtl:left-auto" />
          <Input
            type="search"
            placeholder="ابحث عن منتج بالاسم أو الكود..."
            value={searchTerm}
            onChange={handleSearch}
            className="ps-10 rtl:pr-10"
          />
        </div>
         <Link href="/admin/products/add">
          <Button variant="outline">
            <PlusCircle className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" /> إضافة منتج
          </Button>
        </Link>
      </div>

      {isPending && (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ms-2 rtl:mr-2">جاري المعالجة...</span>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">الصورة</TableHead>
              <TableHead>اسم المنتج</TableHead>
              <TableHead>السعر</TableHead>
              <TableHead>المخزون</TableHead>
              <TableHead>الفئة</TableHead>
              <TableHead className="text-left w-[120px]">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={50}
                      height={50}
                      className="rounded-md object-cover aspect-square"
                      data-ai-hint="product photo"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.price.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</TableCell>
                  <TableCell>
                    <Badge variant={product.stock > 0 ? (product.stock < 10 ? "destructive" : "default") : "outline"}>
                      {product.stock > 0 ? `${product.stock} متوفر` : 'نفذ المخزون'}
                    </Badge>
                  </TableCell>
                  <TableCell>{product.categorySlug}</TableCell> {/* TODO: Show category name */}
                  <TableCell className="text-left">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/products/edit/${product.id}`} legacyBehavior>
                        <Button variant="outline" size="icon" aria-label="تعديل المنتج">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteProduct(product.id)}
                        disabled={isPending}
                        aria-label="حذف المنتج"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  لا توجد منتجات تطابق بحثك أو لم يتم إضافة منتجات بعد.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
       {filteredProducts.length === 0 && searchTerm === '' && (
         <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">لم يتم إضافة أي منتجات حتى الآن.</p>
            <Link href="/admin/products/add">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> ابدأ بإضافة أول منتج
              </Button>
            </Link>
          </div>
       )}
    </div>
  );
}
