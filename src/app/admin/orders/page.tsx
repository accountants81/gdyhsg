import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { getAllOrdersAdminAction } from './actions';
import OrdersListClient from "./components/OrdersListClient";

export default async function AdminOrdersPage() {
  const initialOrders = await getAllOrdersAdminAction();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <ShoppingCart className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">إدارة الطلبات</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>قائمة الطلبات</CardTitle>
          <CardDescription>عرض وتحديث حالات الطلبات الواردة.</CardDescription>
        </CardHeader>
        <CardContent>
          <OrdersListClient initialOrders={initialOrders} />
        </CardContent>
      </Card>
    </div>
  );
}
