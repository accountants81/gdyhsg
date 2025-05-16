"use client";

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CategorySidebar from '@/components/layout/CategorySidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function MainLayout({ children, className }: MainLayoutProps) {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden bg-background text-foreground">
        <Header />
        <div className="flex flex-1 w-full">
          <CategorySidebar aria-label="Category navigation" />
          <main
            className={cn(
              "flex-1 w-full py-8 px-4",
              "md:pl-[var(--sidebar-width-icon)]",
              "group-data-[state=expanded]/sidebar-wrapper:md:pl-[var(--sidebar-width)]",
              "transition-[padding] duration-300 ease-in-out",
              className
            )}
            id="main-content"
            aria-live="polite"
          >
            {children}
          </main>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
}
