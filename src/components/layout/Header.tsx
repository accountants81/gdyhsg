
"use client";
import Link from 'next/link';
import { ShoppingCart, User, LogIn, HomeIcon, Settings, LayoutDashboard, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SITE_NAME } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { Badge } from "@/components/ui/badge";
import { useSidebar } from '@/components/ui/sidebar'; // Import useSidebar

export default function Header() {
  const { user, isAdmin, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const cartItemCount = getCartItemCount();
  const { toggleSidebar, isMobile } = useSidebar(); // Get toggleSidebar and isMobile from context

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center">
          {isMobile && ( /* Show category toggle button only on mobile */
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="me-2 md:hidden">
              <LayoutGrid className="h-5 w-5" />
              <span className="sr-only">فتح الأقسام</span>
            </Button>
          )}
          <Link href="/" className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="font-bold text-xl sm:inline-block">{SITE_NAME}</span>
          </Link>
        </div>
        
        <nav className="flex items-center gap-3 md:gap-4">
          <Link href="/" legacyBehavior passHref>
            <Button variant="ghost" size="sm" className="text-sm">
              <HomeIcon className="h-4 w-4 me-1" /> الرئيسية
            </Button>
          </Link>
          
          <Link href="/cart" legacyBehavior passHref>
            <Button variant="ghost" size="sm" className="relative text-sm">
              <ShoppingCart className="h-4 w-4 me-1" /> السلة
              {cartItemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </Link>

          {user ? (
            <>
              {isAdmin && (
                <Link href="/admin/dashboard" legacyBehavior passHref>
                  <Button variant="ghost" size="sm" className="text-sm">
                    <LayoutDashboard className="h-4 w-4 me-1" /> لوحة التحكم
                  </Button>
                </Link>
              )}
               <Link href="/profile" legacyBehavior passHref>
                <Button variant="ghost" size="sm" className="text-sm">
                  <User className="h-4 w-4 me-1" /> حسابي
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout} className="text-sm">
                تسجيل الخروج
              </Button>
            </>
          ) : (
            <Link href="/login" legacyBehavior passHref>
              <Button variant="ghost" size="sm" className="text-sm">
                <LogIn className="h-4 w-4 me-1" /> تسجيل الدخول
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
