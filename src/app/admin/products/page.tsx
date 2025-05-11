
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import ProductListClient from "./components/ProductListClient";
import { MOCK_PRODUCTS } from '@/data/products'; // Temporary mock data
import type { Product } from '@/lib/types';

// Simulate fetching products for admin (replace with actual data fetching)
async function getAdminProducts(): Promise<Product[]> {
  // In a real app, fetch from DB.
  // For now, we return a mutable copy if we were to modify it with server actions.
  // Since ProductListClient will handle actions, this can be a direct import for now.
  return Promise.resolve([...MOCK_PRODUCTS]);
}


export default async function AdminProductsPage() {
  const initialProducts = await getAdminProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">إدارة المنتجات</h1>
        <Link href="/admin/products/add">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> إضافة منتج جديد
          </Button>
        </Link>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>قائمة المنتجات</CardTitle>
          <CardDescription>عرض وتعديل وحذف المنتجات الموجودة في المتجر.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProductListClient initialProducts={initialProducts} />
        </CardContent>
      </Card>
    </div>
  );
}
