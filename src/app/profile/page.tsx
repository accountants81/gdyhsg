
"use client";

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'; // Added CardFooter
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2, UserCircle, LogIn, Edit3, ShoppingBag } from 'lucide-react';

export default function ProfilePage() {
  const { user, isAdmin, loading, logout } = useAuth();

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center text-center min-h-[calc(100vh-15rem)]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-6" />
          <h1 className="text-2xl font-semibold">جاري تحميل بيانات حسابك...</h1>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center text-center min-h-[calc(100vh-15rem)]">
          <UserCircle className="h-20 w-20 text-muted-foreground mb-6" />
          <h1 className="text-3xl font-bold mb-4">لم تقم بتسجيل الدخول</h1>
          <p className="text-muted-foreground mb-8">
            يرجى تسجيل الدخول لعرض ملفك الشخصي وتفاصيل حسابك.
          </p>
          <Button asChild size="lg">
            <Link href="/login?redirect=/profile">
              <LogIn className="mr-2 h-5 w-5" /> تسجيل الدخول
            </Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto shadow-xl">
          <CardHeader className="text-center">
            <UserCircle className="mx-auto h-16 w-16 text-primary mb-4" />
            <CardTitle className="text-3xl font-bold">ملفك الشخصي</CardTitle>
            <CardDescription>مرحباً بك، {user.name || user.email}!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 border rounded-md">
              <span className="font-medium">الاسم:</span>
              <span>{user.name || 'غير محدد'}</span>
            </div>
            <div className="flex justify-between items-center p-3 border rounded-md">
              <span className="font-medium">البريد الإلكتروني:</span>
              <span>{user.email}</span>
            </div>
            <div className="flex justify-between items-center p-3 border rounded-md">
              <span className="font-medium">نوع الحساب:</span>
              <span className={`font-semibold ${isAdmin ? 'text-destructive' : 'text-primary'}`}>
                {isAdmin ? 'مدير النظام' : 'عميل'}
              </span>
            </div>
            {/* Add more user details here as needed, e.g., phone, address if collected */}
            
             <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button variant="outline" asChild className="w-full">
                    <Link href="/profile/edit"> {/* Placeholder for edit profile page */}
                        <Edit3 className="mr-2 h-4 w-4" /> تعديل بيانات الحساب
                    </Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                    <Link href="/profile/orders"> {/* Placeholder for user's order history */}
                        <ShoppingBag className="mr-2 h-4 w-4" /> عرض طلباتي
                    </Link>
                </Button>
             </div>
          </CardContent>
          <CardFooter className="flex justify-center pt-6">
            <Button variant="destructive" onClick={logout} className="w-full max-w-xs">
              تسجيل الخروج
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
}

