
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CategorySidebar from '@/components/layout/CategorySidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider defaultOpen={false}> {/* Default to closed on mobile, controlled by trigger */}
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1 container mx-auto px-4 py-8 max-w-screen-2xl">
          <CategorySidebar />
          <main className="flex-1 md:ps-4"> {/* Add padding for sidebar space on desktop */}
            {children}
          </main>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
}
