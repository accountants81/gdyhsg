
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Users, Package, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import type { AdminStats } from '@/lib/types';
import { MOCK_PRODUCTS } from "@/data/products"; // Assuming this contains all products

// Simulate fetching and calculating admin stats - reset for transactional data
async function getAdminStatistics(): Promise<AdminStats> {
  const lowStockProductsCount = MOCK_PRODUCTS.filter(p => p.stock < 10).length;

  return {
    totalRevenue: 0,
    monthlyRevenue: 0,
    dailyOrders: 0,
    monthlyOrders: 0,
    newCustomersToday: 0,
    totalActiveCustomers: 0,
    totalProducts: MOCK_PRODUCTS.length, // This is a count of existing entities
    lowStockProductsCount, // This is current inventory status
    topSellingProducts: [], // Reset top selling products
  };
}


export default async function AdminStatisticsPage() {
  const stats = await getAdminStatistics();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">إحصائيات المتجر</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalRevenue.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}
            </div>
            <p className="text-xs text-muted-foreground">
              منذ بداية المتجر (تم التصفير)
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إيرادات هذا الشهر</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.monthlyRevenue.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}
            </div>
            {/* <p className="text-xs text-muted-foreground">
              (تم التصفير)
            </p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">طلبات اليوم</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.dailyOrders}</div>
            {/* <p className="text-xs text-muted-foreground">
              (تم التصفير)
            </p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">طلبات هذا الشهر</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.monthlyOrders}</div>
            {/* <p className="text-xs text-muted-foreground">
              (تم التصفير)
            </p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">عملاء جدد اليوم</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.newCustomersToday}</div>
             <p className="text-xs text-muted-foreground">
              إجمالي العملاء النشطين: {stats.totalActiveCustomers} (تم التصفير)
            </p>
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
              منتجات في المتجر
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">منتجات قليلة المخزون</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowStockProductsCount}</div>
            <p className="text-xs text-muted-foreground">
              منتجات مخزونها أقل من 10 قطع
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>المنتجات الأكثر مبيعاً</CardTitle>
          <CardDescription>أكثر المنتجات طلباً (سيتم تحديثها عند ورود طلبات جديدة).</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.topSellingProducts.length > 0 ? (
            <ul className="space-y-2">
              {stats.topSellingProducts.map((product, index) => (
                <li key={index} className="flex justify-between text-sm">
                  <span>{product.name}</span>
                  <span className="font-semibold">{product.count} مرة</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">لا توجد بيانات مبيعات لعرضها حالياً.</p>
          )}
        </CardContent>
      </Card>
      
      {/* Placeholder for more charts/detailed stats */}
      {/* <Card>
        <CardHeader>
          <CardTitle>نمو الإيرادات الشهري</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">سيتم عرض رسم بياني هنا قريبًا.</p>
        </CardContent>
      </Card> */}
    </div>
  );
}
