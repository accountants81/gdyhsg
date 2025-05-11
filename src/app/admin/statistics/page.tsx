
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Users, Package, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import type { AdminStats } from '@/lib/types';
import { MOCK_PRODUCTS } from "@/data/products"; // Assuming this contains all products
// In a real app, you'd fetch order data too. For now, we'll simulate.

// Simulate fetching and calculating admin stats
async function getAdminStatistics(): Promise<AdminStats> {
  // Simulate some order data for calculations
  const mockOrders = [
    { totalAmount: 250, createdAt: new Date().toISOString() },
    { totalAmount: 1200, createdAt: new Date(Date.now() - 86400000 * 1).toISOString() }, // 1 day ago
    { totalAmount: 450, createdAt: new Date(Date.now() - 86400000 * 2).toISOString() }, // 2 days ago
    { totalAmount: 180, createdAt: new Date(Date.now() - 86400000 * 5).toISOString() }, // 5 days ago
    { totalAmount: 750, createdAt: new Date(Date.now() - 86400000 * 10).toISOString() }, // 10 days ago
    { totalAmount: 350, createdAt: new Date(Date.now() - 86400000 * 20).toISOString() }, // 20 days ago
    { totalAmount: 1500, createdAt: new Date(Date.now() - 86400000 * 35).toISOString() }, // 35 days ago (another month)
  ];

  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getTime();

  const dailyOrders = mockOrders.filter(o => new Date(o.createdAt).getTime() >= startOfToday).length;
  const monthlyOrders = mockOrders.filter(o => new Date(o.createdAt).getTime() >= startOfMonth).length;
  
  const totalRevenue = mockOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const monthlyRevenue = mockOrders
    .filter(o => new Date(o.createdAt).getTime() >= startOfMonth)
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const lowStockProductsCount = MOCK_PRODUCTS.filter(p => p.stock < 10).length;

  // Mock other stats
  const newCustomersToday = Math.floor(Math.random() * 5); // 0-4 new customers
  const totalActiveCustomers = Math.floor(Math.random() * 50) + 20; // 20-69 active customers
  
  // Mock top selling products
  const topSellingProducts = MOCK_PRODUCTS.slice(0,3).map(p => ({ name: p.name, count: Math.floor(Math.random() * 20) + 5}));


  return {
    totalRevenue,
    monthlyRevenue,
    dailyOrders,
    monthlyOrders,
    newCustomersToday,
    totalActiveCustomers,
    totalProducts: MOCK_PRODUCTS.length,
    lowStockProductsCount,
    topSellingProducts,
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
              منذ بداية المتجر
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
            <p className="text-xs text-muted-foreground">
              +15.3% عن الشهر الماضي (مثال)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">طلبات اليوم</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.dailyOrders}</div>
            <p className="text-xs text-muted-foreground">
              مقارنة باليوم السابق (مثال)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">طلبات هذا الشهر</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.monthlyOrders}</div>
            <p className="text-xs text-muted-foreground">
              مقارنة بالشهر السابق (مثال)
            </p>
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
              إجمالي العملاء النشطين: {stats.totalActiveCustomers}
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
          <CardTitle>المنتجات الأكثر مبيعاً (مثال)</CardTitle>
          <CardDescription>أكثر 3 منتجات تم طلبها هذا الشهر.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {stats.topSellingProducts.map((product, index) => (
              <li key={index} className="flex justify-between text-sm">
                <span>{product.name}</span>
                <span className="font-semibold">{product.count} مرة</span>
              </li>
            ))}
          </ul>
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
