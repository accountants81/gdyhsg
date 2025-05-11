
import type { Offer } from '@/lib/types';
import OfferCard from './OfferCard';

interface OffersSectionProps {
  offers: Offer[];
  title?: string;
}

export default function OffersSection({ offers, title = "أحدث العروض والتخفيضات" }: OffersSectionProps) {
  const activeOffers = offers.filter(offer => offer.isActive && new Date(offer.endDate) >= new Date());

  if (!activeOffers || activeOffers.length === 0) {
    return null; // Don't render the section if there are no active offers
  }

  return (
    <section className="py-8 my-8">
      {title && <h2 className="text-3xl font-bold mb-6 text-center md:text-start">{title}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeOffers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </section>
  );
}
