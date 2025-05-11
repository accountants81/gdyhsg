
"use client"; // This layout needs to be a client component to use hooks like useAuth

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAuth } from '@/hooks/useAuth';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Loader2 } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || !isAdmin) {
        router.push('/login?message=unauthorized');
      }
    }
  }, [user, isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ms-4 text-lg">جاري التحميل...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    // This will be briefly shown before redirect or if redirect fails
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">غير مصرح لك بالدخول</h1>
            <p className="text-muted-foreground mb-6">يجب أن تكون مسجلاً كمدير للوصول لهذه الصفحة.</p>
            <button onClick={() => router.push('/login')} className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                الذهاب لصفحة تسجيل الدخول
            </button>
        </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}> {/* Admin sidebar usually default open on desktop */}
        <div className="flex min-h-screen w-full flex-col bg-muted/40 max-w-full overflow-x-hidden"> {/* Ensure full width and prevent overflow */}
            <AdminSidebar />
            {/*
              AdminSidebar uses side="right". In RTL, this is positioned on the left (right:0 CSS).
              So, the main content area needs padding on its left.
              In Tailwind with RTL, `pe-` (padding-end) applies to the left.
              The values 5rem and 16rem are used here. Sidebar icon width is 3rem, expanded is 16rem (md:w-64).
              5rem for collapsed state provides 2rem extra spacing.
            */}
            <div className="flex flex-col flex-1 md:pe-[5rem] lg:pe-[16rem] peer-data-[state=collapsed]:md:pe-[5rem] transition-all duration-300 ease-in-out">
                <AdminHeader />
                <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8">
                    {children}
                </main>
            </div>
        </div>
    </SidebarProvider>
  );
}

