
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
  PanelLeftOpen,
  X
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

const adminNavItems = [
  { href: '/admin/dashboard', label: 'لوحة التحكم الرئيسية', icon: LayoutDashboard },
  { href: '/admin/products', label: 'إدارة المنتجات', icon: Package },
  { href: '/admin/orders', label: 'إدارة الطلبات', icon: ShoppingCart },
  { href: '/admin/customers', label: 'إدارة العملاء', icon: Users },
  { href: '/admin/messages', label: 'الرسائل الواردة', icon: MessageSquare },
  { href: '/admin/settings', label: 'إعدادات الحساب', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { isMobile, openMobile, setOpenMobile, toggleSidebar } = useSidebar();

  const sidebarContent = (
    <>
      <SidebarHeader className="p-4 flex items-center justify-between">
        <Link href="/admin/dashboard" className="font-bold text-lg">
          {SITE_NAME} - لوحة التحكم
        </Link>
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
            {/* Mobile trigger button could be in AdminHeader or here if AdminHeader is not used */}
            <Sidebar side="right" collapsible="offcanvas" variant="sidebar" className="w-72">
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
