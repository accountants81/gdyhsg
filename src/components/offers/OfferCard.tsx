
import type { Offer } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale'; // For Arabic date formatting

interface OfferCardProps {
  offer: Offer;
}

export default function OfferCard({ offer }: OfferCardProps) {
  const formattedStartDate = format(new Date(offer.startDate), 'PPP', { locale: arSA });
  const formattedEndDate = format(new Date(offer.endDate), 'PPP', { locale: arSA });

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full group">
      {offer.imageUrl && (
        <CardHeader className="p-0">
          <div className="aspect-[16/7] relative w-full overflow-hidden"> {/* Adjusted aspect ratio for banners */}
            <Image
              src={offer.imageUrl}
              alt={offer.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              data-ai-hint="promotional banner"
            />
          </div>
        </CardHeader>
      )}
      <CardContent className={`p-4 flex-grow ${!offer.imageUrl ? 'pt-6' : ''}`}>
        <CardTitle className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
          {offer.title}
        </CardTitle>
        {offer.description && (
          <CardDescription className="text-sm text-muted-foreground mb-3 h-12 overflow-hidden text-ellipsis">
            {offer.description}
          </CardDescription>
        )}
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-primary" />
            <span>يسري من {formattedStartDate} إلى {formattedEndDate}</span>
          </div>
          {offer.discountPercentage && (
             <div className="flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-destructive" />
                <span>خصم {offer.discountPercentage}%</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 flex items-center justify-between">
        {offer.couponCode && (
          <Badge variant="secondary" className="text-sm px-3 py-1">
            كود: {offer.couponCode}
          </Badge>
        )}
        <Button size="sm" asChild className={!offer.couponCode ? 'ms-auto' : ''}>
          {/* Link to category, product, or a general offers page */}
          <Link href={offer.productId ? `/products/${offer.productId}` : (offer.categorySlug ? `/category/${offer.categorySlug}` : '/products')}>
            اكتشف العرض
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
