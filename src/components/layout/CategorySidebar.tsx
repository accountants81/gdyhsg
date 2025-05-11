
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
  // SidebarTrigger, // No longer needed here
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react'; // PanelRightOpen is no longer needed here
import { ScrollArea } from '@/components/ui/scroll-area'; 

export default function CategorySidebar() {
  const { isMobile, setOpenMobile } = useSidebar(); // Removed open, toggleSidebar as trigger is elsewhere

  const categoriesContent = (
      <ScrollArea className="h-full"> 
        <SidebarHeader className="p-4 flex items-center justify-between"> {/* Added flex and justify-between */}
          <h2 className="text-lg font-semibold">الأقسام</h2>
          {isMobile && ( // Close button for mobile sheet
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
                    onClick={() => { if(isMobile) setOpenMobile(false);}} 
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
        // The Sheet (Sidebar for mobile) is now triggered from Header.tsx
        // No trigger button is needed here.
        <Sidebar side="right" collapsible="offcanvas" variant="sidebar" className="w-72 md:w-64">
            {categoriesContent}
        </Sidebar>
    );
  }

  return (
    // Desktop sidebar
    <Sidebar side="right" collapsible="icon" variant="sidebar" className="hidden md:flex md:w-64 h-screen flex-col"> {/* Added h-screen and flex-col */}
       {categoriesContent}
    </Sidebar>
  );
}
