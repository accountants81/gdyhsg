
"use client";

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ShoppingBag, Loader2, AlertTriangle } from 'lucide-react';
// import { getMockOrdersByUserId } from '@/data/orders'; // This function would need to be created
// import type { Order } from '@/lib/types';

// Mock function to simulate fetching orders for a user
// In a real app, this would involve fetching from a backend using the user's ID
const getOrdersForUser = async (userId: string | undefined): Promise<any[]> => {
  if (!userId) return [];
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  // For now, return an empty array as MOCK_ORDERS doesn't directly map to user IDs in AuthContext
  // You would filter MOCK_ORDERS by userId or fetch from a DB.
  // e.g. return MOCK_ORDERS.filter(order => order.userId === userId);
  return []; 
};


export default function UserOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = React.useState<any[]>([]); // Replace 'any' with 'Order' type
  const [loadingOrders, setLoadingOrders] = React.useState(true);

  React.useEffect(() => {
    if (user && !authLoading) {
      setLoadingOrders(true);
      getOrdersForUser(user.id)
        .then(userOrders => {
          setOrders(userOrders);
        })
        .catch(err => console.error("Error fetching user orders:", err))
        .finally(() => setLoadingOrders(false));
    } else if (!authLoading && !user) {
        setLoadingOrders(false); // No user, no orders to load
    }
  }, [user, authLoading]);

  if (authLoading || loadingOrders) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-15rem)]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ms-4 text-lg">جاري تحميل طلباتك...</p>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
     return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <AlertTriangle className="mx-auto h-16 w-16 text-destructive mb-4" />
          <h1 className="text-2xl font-bold mb-2">غير مصرح لك بالدخول</h1>
          <p className="text-muted-foreground mb-6">يجب تسجيل الدخول لعرض هذه الصفحة.</p>
          <Button asChild>
            <Link href="/login?redirect=/profile/orders">تسجيل الدخول</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }


  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-primary" />
              طلباتي
            </CardTitle>
            <CardDescription>قائمة بجميع الطلبات التي قمت بها.</CardDescription>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-10">
                <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-lg">لم تقم بأي طلبات حتى الآن.</p>
                <Button asChild className="mt-6">
                  <Link href="/">ابدأ التسوق الآن</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* This is where you would map through orders and display them */}
                {/* Example of one order item - replace with actual order data rendering */}
                <Card>
                    <CardContent className="p-4">
                        <p>تفاصيل الطلب ستعرض هنا.</p>
                        {/* Map through `orders` array and display each order */}
                        {/* e.g., order.id, order.status, order.totalAmount, order.items etc. */}
                    </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
