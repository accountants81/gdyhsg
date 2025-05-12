
"use server";

import { revalidatePath } from 'next/cache';
import type { Offer } from '@/lib/types';
import { MOCK_OFFERS } from '@/lib/constants'; 

// For a real app, MOCK_OFFERS would be in its own file or fetched from constants

let offersStore: Offer[] = [...MOCK_OFFERS.map(o => ({...o}))]; // Ensure deep copy for mutable store

const EMPTY_SELECT_VALUE = "NO_SELECTION"; // Value for "no selection" option

const getProcessedSelectValue = (valueFromForm: string | null): string | undefined => {
  if (valueFromForm === EMPTY_SELECT_VALUE || valueFromForm === null || valueFromForm === "") {
    return undefined;
  }
  return valueFromForm;
};


export async function getOfferById(offerId: string): Promise<Offer | undefined> {
  const offer = offersStore.find(o => o.id === offerId);
  // Return a deep copy to prevent direct mutation of the store from outside
  return offer ? JSON.parse(JSON.stringify(offer)) : undefined;
}

export async function addOfferAction(formData: FormData): Promise<{ success: boolean; message: string; offer?: Offer }> {
  try {
    const newOffer: Offer = {
      id: `offer_${Date.now()}`,
      title: formData.get('title') as string,
      description: formData.get('description') as string || undefined,
      productId: getProcessedSelectValue(formData.get('productId') as string | null),
      categorySlug: getProcessedSelectValue(formData.get('categorySlug') as string | null),
      discountPercentage: formData.get('discountPercentage') ? parseFloat(formData.get('discountPercentage') as string) : undefined,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      imageUrl: formData.get('imageUrl') as string || undefined,
      isActive: formData.get('isActive') === 'on',
      couponCode: formData.get('couponCode') as string || undefined,
    };

    if (!newOffer.title || !newOffer.startDate || !newOffer.endDate) {
      return { success: false, message: "بيانات العرض غير كاملة أو غير صالحة." };
    }
    if (new Date(newOffer.startDate) >= new Date(newOffer.endDate)) {
      return { success: false, message: "تاريخ البدء يجب أن يكون قبل تاريخ الانتهاء." };
    }
    if (newOffer.discountPercentage && (newOffer.discountPercentage < 0 || newOffer.discountPercentage > 100)) {
        return { success: false, message: "نسبة الخصم يجب أن تكون بين 0 و 100."};
    }


    offersStore.push(newOffer);
    console.log("Offer added:", newOffer);

    revalidatePath('/admin/offers');
    revalidatePath('/'); // Revalidate homepage if offers are shown there

    return { success: true, message: "تمت إضافة العرض بنجاح!", offer: JSON.parse(JSON.stringify(newOffer)) };
  } catch (error) {
    console.error("Error adding offer:", error);
    const errorMessage = error instanceof Error ? error.message : "حدث خطأ غير معروف.";
    return { success: false, message: `حدث خطأ أثناء إضافة العرض: ${errorMessage}` };
  }
}

export async function updateOfferAction(offerId: string, formData: FormData): Promise<{ success: boolean; message: string; offer?: Offer }> {
  try {
    const offerIndex = offersStore.findIndex(o => o.id === offerId);
    if (offerIndex === -1) {
      return { success: false, message: "العرض غير موجود." };
    }

    const updatedOfferData: Partial<Offer> = {
      title: formData.get('title') as string,
      description: formData.get('description') as string || undefined,
      productId: getProcessedSelectValue(formData.get('productId') as string | null),
      categorySlug: getProcessedSelectValue(formData.get('categorySlug') as string | null),
      discountPercentage: formData.get('discountPercentage') ? parseFloat(formData.get('discountPercentage') as string) : undefined,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      imageUrl: formData.get('imageUrl') as string || undefined,
      isActive: formData.get('isActive') === 'on',
      couponCode: formData.get('couponCode') as string || undefined,
    };
    
    if (!updatedOfferData.title || !updatedOfferData.startDate || !updatedOfferData.endDate) {
      return { success: false, message: "بيانات العرض المحدثة غير كاملة أو غير صالحة." };
    }
     if (new Date(updatedOfferData.startDate) >= new Date(updatedOfferData.endDate)) {
      return { success: false, message: "تاريخ البدء يجب أن يكون قبل تاريخ الانتهاء." };
    }
    if (updatedOfferData.discountPercentage && (updatedOfferData.discountPercentage < 0 || updatedOfferData.discountPercentage > 100)) {
        return { success: false, message: "نسبة الخصم يجب أن تكون بين 0 و 100."};
    }


    offersStore[offerIndex] = { ...offersStore[offerIndex], ...updatedOfferData };
    console.log("Offer updated:", offersStore[offerIndex]);
    
    revalidatePath('/admin/offers');
    revalidatePath(`/admin/offers/edit/${offerId}`);
    revalidatePath('/');

    return { success: true, message: "تم تحديث العرض بنجاح!", offer: JSON.parse(JSON.stringify(offersStore[offerIndex])) };
  } catch (error) {
    console.error("Error updating offer:", error);
    const errorMessage = error instanceof Error ? error.message : "حدث خطأ غير معروف.";
    return { success: false, message: `حدث خطأ أثناء تحديث العرض: ${errorMessage}` };
  }
}

export async function deleteOfferAction(offerId: string): Promise<{ success: boolean; message: string }> {
  try {
    const initialLength = offersStore.length;
    offersStore = offersStore.filter(o => o.id !== offerId);
    
    if (offersStore.length === initialLength) {
      return { success: false, message: "العرض غير موجود ليتم حذفه." };
    }

    console.log("Offer deleted, ID:", offerId);
    
    revalidatePath('/admin/offers');
    revalidatePath('/');

    return { success: true, message: "تم حذف العرض بنجاح." };
  } catch (error) {
    console.error("Error deleting offer:", error);
    const errorMessage = error instanceof Error ? error.message : "حدث خطأ غير معروف.";
    return { success: false, message: `حدث خطأ أثناء حذف العرض: ${errorMessage}` };
  }
}

// Helper function to get all offers (primarily for the admin list page)
export async function getAllOffers(): Promise<Offer[]> {
    // Return a deep copy to prevent direct mutation of the store from outside
    return Promise.resolve(offersStore.map(o => JSON.parse(JSON.stringify(o))));
}
