
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
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react'; 
import { ScrollArea } from '@/components/ui/scroll-area'; 
import { SheetTitle } from '@/components/ui/sheet'; // Import SheetTitle

export default function CategorySidebar() {
  const { isMobile, setOpenMobile } = useSidebar(); 

  const categoriesContent = (
      <ScrollArea className="h-full"> 
        <SidebarHeader className="p-4 flex items-center justify-between">
          {isMobile ? (
            <SheetTitle className="text-lg font-semibold">الأقسام</SheetTitle>
          ) : (
            <div className="text-lg font-semibold">الأقسام</div>
          )}
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
        <Sidebar side="right" collapsible="offcanvas" variant="sidebar" className="w-72 md:w-64">
            {categoriesContent}
        </Sidebar>
    );
  }

  return (
    <Sidebar side="right" collapsible="icon" variant="sidebar" className="hidden md:flex md:w-64 h-screen flex-col">
       {categoriesContent}
    </Sidebar>
  );
}

