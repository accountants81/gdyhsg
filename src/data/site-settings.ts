
import type { SiteSettings } from '@/lib/types';
import { SITE_NAME } from '@/lib/constants';

export let MOCK_SITE_SETTINGS: SiteSettings = {
  siteName: SITE_NAME,
  facebookUrl: 'https://facebook.com/yourpage',
  instagramUrl: 'https://instagram.com/yourprofile',
  whatsappNumber: '+201234567890', // Example WhatsApp number, ensure it's correctly formatted for wa.me link
  phoneNumber: '+201002003000',
  email: 'info@aaamo.com',
};

// Function to update settings in-memory (for demo purposes)
export function updateMockSiteSettings(newSettings: Partial<SiteSettings>) {
  MOCK_SITE_SETTINGS = { ...MOCK_SITE_SETTINGS, ...newSettings };
}
