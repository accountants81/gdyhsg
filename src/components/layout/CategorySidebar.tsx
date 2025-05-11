
"use client";

import Link from 'next/link';
import { CATEGORIES } from '@/lib/constants';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { PanelRightOpen, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area'; // Import ScrollArea

export default function CategorySidebar() {
  const { open, toggleSidebar, isMobile, openMobile, setOpenMobile } = useSidebar();

  const categoriesContent = (
      <ScrollArea className="h-full"> {/* Wrap content in ScrollArea */}
        <SidebarHeader className="p-4">
          <h2 className="text-lg font-semibold">الأقسام</h2>
          {isMobile && (
             <Button variant="ghost" size="icon" onClick={() => setOpenMobile(false)} className="ms-auto">
                <X className="h-5 w-5" />
             </Button>
          )}
        </SidebarHeader>
        <SidebarContent className="p-0">
          <SidebarMenu>
            {CATEGORIES.map((category) => (
              <SidebarMenuItem key={category.id}>
                <Link href={`/category/${category.slug}`} passHref legacyBehavior>
                  <SidebarMenuButton 
                    className="w-full justify-start"
                    onClick={() => { if(isMobile) setOpenMobile(false);}} // Close on mobile click
                    tooltip={{content: category.name, side: 'right'}}
                  >
                    {category.icon && <category.icon className="h-5 w-5 me-3 text-primary" />}
                    <span>{category.name}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </ScrollArea>
  );

  if (isMobile) {
    return (
        <>
            <Button variant="outline" size="icon" onClick={toggleSidebar} className="fixed bottom-4 right-4 z-50 md:hidden rounded-full shadow-lg">
                <PanelRightOpen className="h-5 w-5" />
            </Button>
            <Sidebar side="right" collapsible="offcanvas" variant="sidebar" className="w-72 md:w-64">
                {categoriesContent}
            </Sidebar>
        </>
    );
  }

  return (
    <Sidebar side="right" collapsible="icon" variant="sidebar" className="hidden md:flex md:w-64">
       {categoriesContent}
    </Sidebar>
  );
}
