
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  X,
  BadgePercent, // Icon for Offers
  BarChart3, // Icon for Statistics
} from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { SITE_NAME } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SheetTitle } from '@/components/ui/sheet'; 

const adminNavItems = [
  { href: '/admin/dashboard', label: 'لوحة التحكم الرئيسية', icon: LayoutDashboard },
  { href: '/admin/products', label: 'إدارة المنتجات', icon: Package },
  { href: '/admin/offers', label: 'إدارة العروض', icon: BadgePercent },
  { href: '/admin/orders', label: 'إدارة الطلبات', icon: ShoppingCart },
  { href: '/admin/customers', label: 'إدارة العملاء', icon: Users },
  { href: '/admin/statistics', label: 'الإحصائيات', icon: BarChart3 },
  { href: '/admin/messages', label: 'الرسائل الواردة', icon: MessageSquare },
  { href: '/admin/settings', label: 'إعدادات الحساب', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { isMobile, openMobile, setOpenMobile } = useSidebar(); 

  const sidebarContent = (
    <>
      <SidebarHeader className="p-4 flex items-center justify-between">
        {isMobile ? (
          <SheetTitle asChild>
            <Link href="/admin/dashboard" className="font-bold text-lg">
              {SITE_NAME} - لوحة التحكم
            </Link>
          </SheetTitle>
        ) : (
          <Link href="/admin/dashboard" className="font-bold text-lg">
            {SITE_NAME} - لوحة التحكم
          </Link>
        )}
        {isMobile && (
            <Button variant="ghost" size="icon" onClick={() => setOpenMobile(false)}>
                <X className="h-5 w-5" />
            </Button>
        )}
      </SidebarHeader>
      <ScrollArea className="flex-grow">
        <SidebarContent className="p-0">
          <SidebarMenu>
            {adminNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref legacyBehavior>
                  <SidebarMenuButton
                    className="w-full justify-start"
                    isActive={pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href))}
                    onClick={() => { if(isMobile) setOpenMobile(false);}}
                    tooltip={{content: item.label, side: 'right'}}
                  >
                    <item.icon className="h-5 w-5 me-3" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </ScrollArea>
      <SidebarFooter className="p-2 border-t border-sidebar-border">
        <SidebarMenuButton
          className="w-full justify-start"
          onClick={() => {
            logout();
            if (isMobile) setOpenMobile(false);
          }}
          tooltip={{content: "تسجيل الخروج", side: 'right'}}
        >
          <LogOut className="h-5 w-5 me-3" />
          <span>تسجيل الخروج</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </>
  );

  if (isMobile) {
    return (
        <>
            <Sidebar side="right" collapsible="offcanvas" variant="sidebar" className="w-72">
                 {/* SheetTitle is now part of sidebarContent when isMobile is true */}
                {sidebarContent}
            </Sidebar>
        </>
    );
  }

  return (
    <Sidebar side="right" collapsible="icon" variant="sidebar" className="hidden md:flex md:w-64 h-screen flex-col">
        {sidebarContent}
    </Sidebar>
  );
}
