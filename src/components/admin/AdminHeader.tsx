
"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { PanelLeftOpen } from "lucide-react";
import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import AdminSidebar from "./AdminSidebar"; // We'll put the sidebar content inside the sheet for mobile
import { SidebarProvider, useSidebar } from "../ui/sidebar"; // Import SidebarProvider and useSidebar


function AdminHeaderContent() {
    const { toggleSidebar } = useSidebar();

    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            {/* Mobile Sidebar Trigger */}
            <Button variant="outline" size="icon" onClick={toggleSidebar} className="md:hidden">
                <PanelLeftOpen className="h-5 w-5" />
                <span className="sr-only">فتح/إغلاق القائمة الجانبية</span>
            </Button>
            
            <div className="flex-1">
                <Link href="/admin/dashboard" className="text-xl font-semibold">
                    {SITE_NAME} - المشرف
                </Link>
            </div>
            {/* Add any other header elements like user profile dropdown here */}
        </header>
    );
}


export default function AdminHeader() {
  // The SidebarProvider should wrap the layout that contains both the trigger (in Header) and the Sidebar itself.
  // So, AdminHeader should be used within a layout that has SidebarProvider.
  return <AdminHeaderContent />;
}

