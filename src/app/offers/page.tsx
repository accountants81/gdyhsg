
import MainLayout from '@/components/layout/MainLayout';
import OffersSection from '@/components/offers/OffersSection';
import { MOCK_OFFERS } from '@/lib/constants'; // Using MOCK_OFFERS, can be replaced with getAllOffers from actions
import type { Offer } from '@/lib/types';
// import { getAllOffers } from '@/app/admin/offers/actions'; // Alternative if you want to use the action

// Simulate fetching offers
async function getOffers(): Promise<Offer[]> {
  // return getAllOffers(); // Option 1: Use the server action if it's suitable for public facing page
  return Promise.resolve(MOCK_OFFERS); // Option 2: Use MOCK_OFFERS for simplicity
}

export default async function OffersPage() {
  const offers = await getOffers();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <OffersSection offers={offers} title="العروض والتخفيضات الحالية" />
        {offers.filter(offer => offer.isActive && new Date(offer.endDate) >= new Date()).length === 0 && (
          <div className="text-center py-10">
            <h1 className="text-2xl font-semibold mb-4">لا توجد عروض متاحة حالياً</h1>
            <p className="text-muted-foreground">يرجى التحقق مرة أخرى لاحقًا للحصول على أحدث العروض والتخفيضات.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
