
"use client";

import React, { useState, useTransition } from 'react';
import type { Offer } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, PlusCircle, Search, Loader2, ImageOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { deleteOfferAction } from '../actions'; 
import { format } from 'date-fns';

interface OffersListClientProps {
  initialOffers: Offer[];
}

export default function OffersListClient({ initialOffers }: OffersListClientProps) {
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredOffers = offers.filter(offer =>
    offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (offer.couponCode && offer.couponCode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDeleteOffer = async (offerId: string) => {
    if (!confirm("هل أنت متأكد أنك تريد حذف هذا العرض؟ لا يمكن التراجع عن هذا الإجراء.")) {
      return;
    }
    startTransition(async () => {
      const result = await deleteOfferAction(offerId);
      if (result.success) {
        setOffers(prev => prev.filter(o => o.id !== offerId));
        toast({ title: "نجاح", description: result.message });
      } else {
        toast({ title: "خطأ", description: result.message, variant: "destructive" });
      }
    });
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch {
      return 'تاريخ غير صالح';
    }
  };


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rtl:right-3 rtl:left-auto" />
          <Input
            type="search"
            placeholder="ابحث عن عرض بالاسم أو كود الخصم..."
            value={searchTerm}
            onChange={handleSearch}
            className="ps-10 rtl:pr-10"
          />
        </div>
         <Link href="/admin/offers/add">
          <Button variant="outline">
            <PlusCircle className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" /> إضافة عرض
          </Button>
        </Link>
      </div>

      {isPending && (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ms-2 rtl:mr-2">جاري المعالجة...</span>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">الصورة</TableHead>
              <TableHead>عنوان العرض</TableHead>
              <TableHead>الخصم</TableHead>
              <TableHead>كود الخصم</TableHead>
              <TableHead>تاريخ البدء</TableHead>
              <TableHead>تاريخ الإنتهاء</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead className="text-left w-[120px]">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOffers.length > 0 ? (
              filteredOffers.map((offer) => (
                <TableRow key={offer.id}>
                  <TableCell>
                    {offer.imageUrl ? (
                        <Image
                        src={offer.imageUrl}
                        alt={offer.title}
                        width={80}
                        height={45} // Aspect ratio 16:9
                        className="rounded-md object-cover aspect-video"
                        data-ai-hint="offer banner"
                        />
                    ) : (
                        <div className="w-20 h-[45px] bg-muted rounded-md flex items-center justify-center">
                            <ImageOff className="h-6 w-6 text-muted-foreground" />
                        </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{offer.title}</TableCell>
                  <TableCell>
                    {offer.discountPercentage ? `${offer.discountPercentage}%` : '-'}
                  </TableCell>
                   <TableCell>
                    {offer.couponCode ? <Badge variant="secondary">{offer.couponCode}</Badge> : '-'}
                  </TableCell>
                  <TableCell>{formatDate(offer.startDate)}</TableCell>
                  <TableCell>{formatDate(offer.endDate)}</TableCell>
                  <TableCell>
                    <Badge variant={offer.isActive ? "default" : "outline"}>
                      {offer.isActive ? 'فعال' : 'غير فعال'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/offers/edit/${offer.id}`} legacyBehavior>
                        <Button variant="outline" size="icon" aria-label="تعديل العرض">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteOffer(offer.id)}
                        disabled={isPending}
                        aria-label="حذف العرض"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  لا توجد عروض تطابق بحثك أو لم يتم إضافة عروض بعد.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
       {filteredOffers.length === 0 && searchTerm === '' && (
         <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">لم يتم إضافة أي عروض حتى الآن.</p>
            <Link href="/admin/offers/add">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> ابدأ بإضافة أول عرض
              </Button>
            </Link>
          </div>
       )}
    </div>
  );
}
