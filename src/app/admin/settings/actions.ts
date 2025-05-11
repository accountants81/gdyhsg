
"use server";

import { revalidatePath } from 'next/cache';
import type { SiteSettings } from '@/lib/types';
import { MOCK_SITE_SETTINGS, updateMockSiteSettings } from '@/data/site-settings';

export async function getSiteSettings(): Promise<SiteSettings> {
  // In a real app, fetch from a database or persistent store
  return Promise.resolve(MOCK_SITE_SETTINGS);
}

export async function updateSiteSettingsAction(formData: FormData): Promise<{ success: boolean; message: string; settings?: SiteSettings }> {
  try {
    const newSettings: SiteSettings = {
      facebookUrl: formData.get('facebookUrl') as string,
      instagramUrl: formData.get('instagramUrl') as string,
      whatsappNumber: formData.get('whatsappNumber') as string,
      phoneNumber: formData.get('phoneNumber') as string,
      email: formData.get('email') as string,
      siteName: formData.get('siteName') as string || MOCK_SITE_SETTINGS.siteName, // Keep existing or default if not provided
    };

    // Basic validation (can be expanded with Zod)
    if (!newSettings.email) { // Email is a good mandatory check
      return { success: false, message: "البريد الإلكتروني مطلوب." };
    }
    // Add more validation as needed (e.g., URL format for social links)

    updateMockSiteSettings(newSettings); // Update in-memory store
    console.log("Site settings updated:", MOCK_SITE_SETTINGS);

    revalidatePath('/'); // Revalidate home page (where footer is)
    revalidatePath('/admin/settings'); // Revalidate settings page
    // Add other paths that might display this info, e.g., contact page

    return { success: true, message: "تم تحديث إعدادات الموقع بنجاح!", settings: MOCK_SITE_SETTINGS };
  } catch (error) {
    console.error("Error updating site settings:", error);
    const errorMessage = error instanceof Error ? error.message : "حدث خطأ غير معروف.";
    return { success: false, message: `حدث خطأ أثناء تحديث الإعدادات: ${errorMessage}` };
  }
}
