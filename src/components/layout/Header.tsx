
"use client";
import Link from 'next/link';
import { ShoppingCart, User, LogIn, HomeIcon, Settings, LayoutDashboard, LayoutGrid, LogOut, Tag, Mail, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SITE_NAME } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { Badge } from "@/components/ui/badge";
import { useSidebar } from '@/components/ui/sidebar'; 

export default function Header() {
  const { user, isAdmin, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const cartItemCount = getCartItemCount();
  const { toggleSidebar, isMobile } = useSidebar();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-2 sm:px-4">
        <div className="flex items-center gap-1 sm:gap-2">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
              <LayoutGrid className="h-5 w-5" />
              <span className="sr-only">فتح الأقسام</span>
            </Button>
          )}
          <Link href="/" className="flex items-center">
            <span className="font-bold text-lg md:text-xl">{SITE_NAME}</span>
          </Link>
        </div>
        
        <nav className="flex items-center gap-0.5 sm:gap-1 md:gap-2">
          <Link href="/" legacyBehavior passHref>
            <Button variant="ghost" size="icon" className="sm:hidden text-sm" aria-label="الرئيسية">
              <HomeIcon className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/" legacyBehavior passHref>
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-sm">
              <HomeIcon className="h-4 w-4 me-1" /> الرئيسية
            </Button>
          </Link>

          <Link href="/offers" legacyBehavior passHref>
            <Button variant="ghost" size="icon" className="sm:hidden text-sm" aria-label="العروض">
              <Tag className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/offers" legacyBehavior passHref>
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-sm">
              <Tag className="h-4 w-4 me-1" /> العروض
            </Button>
          </Link>

          <Link href="/track-order" legacyBehavior passHref>
            <Button variant="ghost" size="icon" className="sm:hidden text-sm" aria-label="تتبع طلبك">
              <Truck className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/track-order" legacyBehavior passHref>
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-sm">
              <Truck className="h-4 w-4 me-1" /> تتبع طلبك
            </Button>
          </Link>

          <Link href="/contact" legacyBehavior passHref>
            <Button variant="ghost" size="icon" className="sm:hidden text-sm" aria-label="تواصل معنا">
              <Mail className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/contact" legacyBehavior passHref>
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-sm">
              <Mail className="h-4 w-4 me-1" /> تواصل معنا
            </Button>
          </Link>
          
          <Link href="/cart" legacyBehavior passHref>
            <Button variant="ghost" size="icon" className="sm:hidden relative text-sm" aria-label="السلة">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] leading-none">
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </Link>
          <Link href="/cart" legacyBehavior passHref>
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex relative text-sm">
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
                <>
                  <Link href="/admin/dashboard" legacyBehavior passHref>
                    <Button variant="ghost" size="icon" className="sm:hidden text-sm" aria-label="لوحة التحكم">
                       <LayoutDashboard className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/admin/dashboard" legacyBehavior passHref>
                    <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-sm">
                      <LayoutDashboard className="h-4 w-4 me-1" /> لوحة التحكم
                    </Button>
                  </Link>
                </>
              )}
               <Link href="/profile" legacyBehavior passHref>
                  <Button variant="ghost" size="icon" className="sm:hidden text-sm" aria-label="حسابي">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/profile" legacyBehavior passHref>
                  <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-sm">
                    <User className="h-4 w-4 me-1" /> حسابي
                  </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={logout} className="sm:hidden text-sm" aria-label="تسجيل الخروج">
                <LogOut className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={logout} className="hidden sm:inline-flex text-sm">
                <LogOut className="h-4 w-4 me-1" /> تسجيل الخروج
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" legacyBehavior passHref>
                 <Button variant="ghost" size="icon" className="sm:hidden text-sm" aria-label="تسجيل الدخول">
                  <LogIn className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login" legacyBehavior passHref>
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-sm">
                  <LogIn className="h-4 w-4 me-1" /> تسجيل الدخول
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
