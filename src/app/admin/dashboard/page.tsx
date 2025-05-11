
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";

// Mock data for stats - replace with actual data fetching
const getAdminStats = async () => {
  return {
    totalRevenue: 12500.75,
    subscriptions: 230,
    sales: 560,
    activeUsers: 120,
  };
};

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">لوحة التحكم الرئيسية</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
              +20.1% عن الشهر الماضي
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الطلبات الجديدة</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.subscriptions}</div>
            <p className="text-xs text-muted-foreground">
              +180.1% عن الشهر الماضي
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المبيعات</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.sales}</div>
            <p className="text-xs text-muted-foreground">
              +19% عن الشهر الماضي
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
            <p className="text-xs text-muted-foreground">
              +201 منذ الساعة الأخيرة
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder for recent orders or other relevant info */}
      <Card>
        <CardHeader>
          <CardTitle>أحدث الطلبات</CardTitle>
          <CardDescription>قائمة بأحدث 5 طلبات تم إجراؤها.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">سيتم عرض تفاصيل الطلبات هنا قريبًا.</p>
          {/* Implement table or list of recent orders here */}
        </CardContent>
      </Card>
    </div>
  );
}
