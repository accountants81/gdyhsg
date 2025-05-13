"use client";

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CategorySidebar from '@/components/layout/CategorySidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
        <Header />
        <div className="flex flex-1 w-full">
          <main
            className={cn(
              "flex-1 py-8 px-4 w-full",
              "md:pe-[var(--sidebar-width-icon)]",
              "group-data-[state=expanded]/sidebar-wrapper:md:pe-[var(--sidebar-width)]",
              "transition-[padding-left] duration-300 ease-in-out"
            )}
          >
            {children}
          </main>
          <CategorySidebar />
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
}
