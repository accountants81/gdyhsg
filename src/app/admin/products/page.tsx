
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import ProductListClient from "./components/ProductListClient";
import { getAllProducts } from './actions'; // Use the centralized action
import type { Product } from '@/lib/types';


export default async function AdminProductsPage() {
  const initialProducts = await getAllProducts(); // Use the action

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
