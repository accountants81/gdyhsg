
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
    <SidebarProvider defaultOpen={false}> {/* Default to closed on mobile, controlled by trigger */}
      <div className="flex flex-col min-h-screen">
        <Header />
        {/* The main flex container now takes full width. CategorySidebar is on the right (start in RTL) */}
        <div className="flex flex-1 w-full">
          {/* The main content area needs padding-start to account for the fixed CategorySidebar */}
          {/* It uses group-data-state from SidebarProvider to adjust padding */}
          <main
            className={cn(
              "flex-1 py-8 px-4 w-full", // Base padding & ensure it takes width
              // Default (collapsed) state for desktop: padding for icon sidebar (3rem)
              "md:ps-[var(--sidebar-width-icon)]",
              // Expanded state for desktop: padding for full sidebar (16rem)
              "group-data-[state=expanded]/sidebar-wrapper:md:ps-[var(--sidebar-width)]",
              "transition-[padding-left] duration-300 ease-in-out" // Use padding-left for RTL ps
            )}
          >
            {/* Children like HomePage can use 'container mx-auto' for their own content centering */}
            {children}
          </main>
          <CategorySidebar /> {/* Sidebar rendered after main, will be on the right due to flex and RTL */}
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
}
