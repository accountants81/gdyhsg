"use client";

import React, { useState, useTransition, useMemo } from 'react';
import type { Order } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Loader2, Search, Package, Filter, ChevronDown, Check, X, ArrowUpAZ, ArrowDownAZ } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateOrderStatusAdminAction } from '../actions'; 
import { format, formatDistanceToNow } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ORDER_STATUSES_AR, PAYMENT_METHODS_AR } from '@/lib/constants';
import Image from 'next/image';

interface OrdersListClientProps {
  initialOrders: Order[];
}

type OrderStatusKey = keyof typeof ORDER_STATUSES_AR;

export default function OrdersListClient({ initialOrders }: OrdersListClientProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilters, setStatusFilters] = useState<OrderStatusKey[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc'); // 'desc' for newest first
  const [isProcessing, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleStatusFilterChange = (statusKey: OrderStatusKey) => {
    setStatusFilters(prev =>
      prev.includes(statusKey)
        ? prev.filter(s => s !== statusKey)
        : [...prev, statusKey]
    );
  };

  const filteredAndSortedOrders = useMemo(() => {
    return orders
      .filter(order => {
        const searchMatch = order.id.toLowerCase().includes(searchTerm) ||
                            order.customerDetails.name.toLowerCase().includes(searchTerm) ||
                            order.customerDetails.phone.includes(searchTerm) ||
                            (order.customerDetails.email && order.customerDetails.email.toLowerCase().includes(searchTerm));
        const statusMatch = statusFilters.length === 0 || statusFilters.includes(order.status);
        return searchMatch && statusMatch;
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
  }, [orders, searchTerm, statusFilters, sortOrder]);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatusKey) => {
    startTransition(async () => {
      const result = await updateOrderStatusAdminAction(orderId, newStatus);
      if (result.success && result.order) {
        setOrders(prev => prev.map(o => o.id === orderId ? result.order! : o));
        toast({ title: "نجاح", description: result.message });
      } else {
        toast({ title: "خطأ", description: result.message || "فشل تحديث حالة الطلب.", variant: "destructive" });
      }
    });
  };
  
  const getStatusBadgeVariant = (status: OrderStatusKey) => {
    switch (status) {
      case 'pending': return 'default'; // Or 'secondary' for a more neutral look
      case 'processing': return 'default';
      case 'shipping': return 'default';
      case 'delivered': return 'default'; // 'success' if you have a success variant
      case 'on_hold': return 'secondary';
      case 'rejected': return 'destructive';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };


  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rtl:right-3 rtl:left-auto" />
          <Input
            type="search"
            placeholder="ابحث برقم الطلب, اسم العميل, الهاتف, أو الإيميل..."
            value={searchTerm}
            onChange={handleSearch}
            className="ps-10 rtl:pr-10"
          />
        </div>
        <div className="flex gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" /> تصفية بالحالة
                    <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>اختر حالات لعرضها</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {Object.entries(ORDER_STATUSES_AR).map(([key, value]) => (
                    <DropdownMenuCheckboxItem
                        key={key}
                        checked={statusFilters.includes(key as OrderStatusKey)}
                        onCheckedChange={() => handleStatusFilterChange(key as OrderStatusKey)}
                    >
                        {value}
                    </DropdownMenuCheckboxItem>
                    ))}
                     <DropdownMenuSeparator />
                     <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => setStatusFilters([])}>
                        <X className="mr-2 h-4 w-4" /> مسح الفلاتر
                     </Button>
                </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" onClick={toggleSortOrder}>
              {sortOrder === 'asc' ? <ArrowUpAZ className="mr-2 h-4 w-4" /> : <ArrowDownAZ className="mr-2 h-4 w-4" />}
              {sortOrder === 'asc' ? 'الأقدم أولاً' : 'الأحدث أولاً'}
            </Button>
        </div>
      </div>

      {isProcessing && (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ms-2 rtl:mr-2">جاري المعالجة...</span>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">رقم الطلب</TableHead>
              <TableHead>العميل</TableHead>
              <TableHead className="w-[120px]">الإجمالي</TableHead>
              <TableHead className="w-[150px]">تاريخ الطلب</TableHead>
              <TableHead className="w-[130px]">الحالة</TableHead>
              <TableHead className="text-left w-[180px]">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedOrders.length > 0 ? (
              filteredAndSortedOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">{order.id}</TableCell>
                  <TableCell>
                    <div>{order.customerDetails.name}</div>
                    <div className="text-xs text-muted-foreground">{order.customerDetails.phone}</div>
                  </TableCell>
                  <TableCell>{order.finalAmount.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</TableCell>
                  <TableCell>{formatDistanceToNow(new Date(order.createdAt), { addSuffix: true, locale: arSA })}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(order.status)}>
                      {ORDER_STATUSES_AR[order.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left">
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                           <Button variant="outline" size="icon" aria-label="عرض تفاصيل الطلب">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>تفاصيل الطلب: {order.id}</DialogTitle>
                            <DialogDescription>
                                 بتاريخ: {format(new Date(order.createdAt), 'PPPp', { locale: arSA })}
                            </DialogDescription>
                          </DialogHeader>
                          <ScrollArea className="max-h-[60vh] mt-4 p-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                                <div>
                                    <h4 className="font-semibold mb-1">بيانات العميل:</h4>
                                    <p><strong>الاسم:</strong> {order.customerDetails.name}</p>
                                    <p><strong>الهاتف:</strong> {order.customerDetails.phone}</p>
                                    {order.customerDetails.alternatePhone && <p><strong>هاتف احتياطي:</strong> {order.customerDetails.alternatePhone}</p>}
                                    {order.customerDetails.email && <p><strong>الإيميل:</strong> {order.customerDetails.email}</p>}
                                    <p><strong>المحافظة:</strong> {order.customerDetails.governorate}</p>
                                    <p><strong>العنوان:</strong> {order.customerDetails.address}</p>
                                    {order.customerDetails.landmark && <p><strong>علامة مميزة:</strong> {order.customerDetails.landmark}</p>}
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1">تفاصيل الدفع والشحن:</h4>
                                    <p><strong>طريقة الدفع:</strong> {PAYMENT_METHODS_AR[order.paymentMethod]}</p>
                                    <p><strong>تكلفة المنتجات:</strong> {order.totalAmount.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</p>
                                    <p><strong>تكلفة الشحن:</strong> {order.shippingCost.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</p>
                                    <p className="font-bold"><strong>الإجمالي النهائي:</strong> {order.finalAmount.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</p>
                                    <p><strong>حالة الطلب الحالية:</strong> <Badge variant={getStatusBadgeVariant(order.status)}>{ORDER_STATUSES_AR[order.status]}</Badge></p>
                                </div>
                            </div>
                            <h4 className="font-semibold mt-3 mb-1 p-2">المنتجات المطلوبة:</h4>
                            <div className="space-y-2 p-2">
                                {order.items.map(item => (
                                    <div key={item.id} className="flex items-start gap-3 border-b pb-2 last:border-0">
                                        <Image src={item.imageUrls[0]} alt={item.name} width={50} height={50} className="rounded object-cover" data-ai-hint="product item"/>
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">الكمية: {item.quantity} | السعر للقطعة: {item.price.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                          </ScrollArea>
                          <DialogFooter className="sm:justify-start mt-4">
                             <DialogClose asChild>
                                <Button type="button" variant="secondary">
                                إغلاق
                                </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" aria-label="تغيير حالة الطلب">
                                <Edit className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                             <DropdownMenuLabel>تغيير حالة الطلب إلى:</DropdownMenuLabel>
                             <DropdownMenuSeparator />
                            {Object.entries(ORDER_STATUSES_AR).map(([statusKey, statusValue]) => (
                                <DropdownMenuCheckboxItem
                                    key={statusKey}
                                    checked={order.status === statusKey}
                                    onCheckedChange={() => handleUpdateStatus(order.id, statusKey as OrderStatusKey)}
                                    disabled={isProcessing || order.status === statusKey}
                                >
                                    {statusValue}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {searchTerm || statusFilters.length > 0 ? "لا توجد طلبات تطابق معايير البحث." : "لا توجد طلبات حتى الآن."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
       {filteredAndSortedOrders.length === 0 && !searchTerm && statusFilters.length === 0 && (
         <div className="text-center py-8">
            <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">لم يتم تسجيل أي طلبات بعد.</p>
          </div>
       )}
    </div>
  );
}
