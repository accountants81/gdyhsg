
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
      <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden"> {/* Ensure full width and prevent overflow */}
        <Header />
        <div className="flex flex-1 w-full">
          <main
            className={cn(
              "flex-1 py-8 px-4 w-full", 
              // CategorySidebar uses side="right". In RTL (dir="rtl"), this means it's positioned with `right:0`, appearing on the screen's left.
              // So, main content needs padding on its left side.
              // In Tailwind with RTL, `pe-` (padding-end) applies to the left.
              "md:pe-[var(--sidebar-width-icon)]", 
              "group-data-[state=expanded]/sidebar-wrapper:md:pe-[var(--sidebar-width)]",
              // The CSS property that `pe-` modifies in RTL is `padding-left`.
              "transition-[padding-left] duration-300 ease-in-out"
            )}
          >
            {children}
          </main>
          <CategorySidebar /> {/* Sidebar rendered after main. In RTL, flex items are reversed, but fixed positioning of sidebar overrides this. */}
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
}

