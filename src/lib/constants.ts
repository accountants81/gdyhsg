import type { Category, Governorate } from './types';
import { Smartphone, Headphones, BatteryCharging, ShieldCheck, Cable } from 'lucide-react';

export const SITE_NAME = "AAAMO";

// Updated for multiple admin users
export const ADMIN_EMAILS: string[] = [
  "searchemail85@gmail.com",
  "admin.user1@aaamo.com",
  "dev.user2@aaamo.com",
  "support.lead@aaamo.com",
  "product.manager@aaamo.com",
  "ceo@aaamo.com" 
]; // More than five admin emails

export const ADMIN_PASSWORD = "searchemail85@gmail.com"; // IMPORTANT: For demo only. Shared password for all admin accounts.

export const CATEGORIES: Category[] = [
  { id: '1', name: 'جرابات', slug: 'cases', icon: Smartphone },
  { id: '2', name: 'سماعات', slug: 'headphones', icon: Headphones },
  { id: '3', name: 'شواحن وباور بانك', slug: 'chargers-powerbanks', icon: BatteryCharging },
  { id: '4', name: 'اسكرينات حماية', slug: 'screen-protectors', icon: ShieldCheck },
  { id: '5', name: 'كابلات ووصلات', slug: 'cables-adapters', icon: Cable },
  { id: '6', name: 'اكسسوارات أخرى', slug: 'other-accessories', icon: Smartphone },
];

export const EGYPTIAN_GOVERNORATES: Governorate[] = [
  { name: "القاهرة", shippingCost: 50 },
  { name: "الجيزة", shippingCost: 50 },
  { name: "الإسكندرية", shippingCost: 60 },
  { name: "القليوبية", shippingCost: 55 },
  { name: "الشرقية", shippingCost: 65 },
  { name: "الغربية", shippingCost: 60 },
  { name: "المنوفية", shippingCost: 60 },
  { name: "البحيرة", shippingCost: 65 },
  { name: "الدقهلية", shippingCost: 65 },
  // Add more governorates as needed
];

export const MIN_ORDER_VALUE = 100; // EGP

export const ORDER_STATUSES_AR = {
  pending: 'قيد الانتظار',
  processing: 'قيد التجهيز',
  shipping: 'تم الشحن',
  delivered: 'تم التوصيل',
  on_hold: 'معلق',
  rejected: 'مرفوض',
  cancelled: 'ملغي',
};

export const PAYMENT_METHODS_AR = {
  cod: 'الدفع عند الاستلام',
  vodafone_cash: 'فودافون كاش',
  fawry: 'فوري',
};
