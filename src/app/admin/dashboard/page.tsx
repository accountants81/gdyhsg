
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CreditCard, DollarSign, Users, Package, BarChart3, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MOCK_PRODUCTS } from "@/data/products"; // For total products count

// Mock data for stats - reset for transactional data
const getAdminSummaryStats = async () => {
  // Simulate an empty state for transactional data
  return {
    totalRevenueToday: 0,
    newOrdersToday: 0,
    totalProducts: MOCK_PRODUCTS.length, // This is a count of existing entities, not a transactional stat
    activeUsers: 0, // Reset active users
  };
};

export default async function AdminDashboardPage() {
  const stats = await getAdminSummaryStats();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">لوحة التحكم الرئيسية</h1>
        <Button asChild variant="outline">
          <Link href="/admin/statistics">
            <BarChart3 className="mr-2 h-4 w-4" /> عرض الإحصائيات التفصيلية
          </Link>
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إيرادات اليوم</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalRevenueToday.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}
            </div>
            {/* <p className="text-xs text-muted-foreground">
              +0% عن أمس (تم التصفير)
            </p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">طلبات جديدة اليوم</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.newOrdersToday}</div>
            {/* <p className="text-xs text-muted-foreground">
              إجمالي الطلبات هذا الشهر (تم التصفير)
            </p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المنتجات</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              منتجات متاحة في المتجر
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">العملاء النشطون الآن</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.activeUsers}</div>
            {/* <p className="text-xs text-muted-foreground">
              (تم التصفير)
            </p> */}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
            <CardHeader>
            <CardTitle>إجراءات سريعة</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                <Button asChild variant="outline" className="w-full">
                    <Link href="/admin/products/add">إضافة منتج جديد</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                    <Link href="/admin/offers/add">إضافة عرض جديد</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                    <Link href="/admin/orders">عرض الطلبات</Link>
                </Button>
                 <Button asChild variant="outline" className="w-full">
                    <Link href="/admin/messages">مراجعة الرسائل</Link>
                </Button>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
            <CardTitle>أحدث الطلبات (مثال)</CardTitle>
            <CardDescription>قائمة بأحدث الطلبات (سيتم تحديثها عند ورود طلبات جديدة).</CardDescription>
            </CardHeader>
            <CardContent>
            {/* Replace with actual recent orders list */}
            <ul className="space-y-2 text-sm">
                <li className="flex justify-between"><span>لا توجد طلبات حديثة بعد.</span></li>
            </ul>
            <Button variant="link" asChild className="mt-2 p-0 h-auto">
                <Link href="/admin/orders">عرض كل الطلبات</Link>
            </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
