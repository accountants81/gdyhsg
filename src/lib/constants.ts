import type { Category, Governorate, Offer } from './types';
import { Smartphone, Headphones, BatteryCharging, ShieldCheck, Cable, Grip, PenTool, Camera, Gamepad2, Watch, Sparkles, Focus, Speaker, Laptop, Radio, MemoryStick } from 'lucide-react';

export const SITE_NAME = "AAAMO";

// Updated for multiple admin users
export const ADMIN_EMAILS: string[] = [
  "searchemail85@gmail.com",
  "admin.user1@aaamo.com",
  "dev.user2@aaamo.com",
  "support.lead@aaamo.com",
  "product.manager@aaamo.com",
  "ceo@aaamo.com",
  "lead.developer@aaamo.com", 
  "marketing.specialist@aaamo.com",
  "operations.manager@aaamo.com",
  "finance.controller@aaamo.com" 
]; 

export const ADMIN_PASSWORD = "searchemail85@gmail.com"; // IMPORTANT: For demo only. Shared password for all admin accounts.

export const CATEGORIES: Category[] = [
  { id: '1', name: 'جرابات وحافظات', slug: 'cases', icon: Smartphone },
  { id: '2', name: 'سماعات رأس وأذن', slug: 'headphones', icon: Headphones },
  { id: '3', name: 'شواحن وباور بانك', slug: 'chargers-powerbanks', icon: BatteryCharging },
  { id: '4', name: 'اسكرينات حماية', slug: 'screen-protectors', icon: ShieldCheck },
  { id: '5', name: 'كابلات ووصلات', slug: 'cables-adapters', icon: Cable },
  { id: '6', name: 'حوامل ومثبتات', slug: 'mounts-holders', icon: Grip },
  { id: '7', name: 'أقلام ستايلس', slug: 'stylus-pens', icon: PenTool },
  { id: '8', name: 'عصي سيلفي وترايبود', slug: 'selfie-sticks-tripods', icon: Camera },
  { id: '9', name: 'اكسسوارات الألعاب', slug: 'gaming-accessories', icon: Gamepad2 },
  { id: '10', name: 'اكسسوارات الساعات الذكية', slug: 'wearable-accessories', icon: Watch },
  { id: '11', name: 'أدوات تنظيف وتعقيم', slug: 'cleaning-kits', icon: Sparkles },
  { id: '12', name: 'عدسات كاميرا إضافية', slug: 'phone-lenses', icon: Focus },
  { id: '13', name: 'مكبرات صوت بلوتوث', slug: 'bluetooth-speakers', icon: Speaker },
  { id: '14', name: 'اكسسوارات لابتوب وتابلت', slug: 'laptop-tablet-accessories', icon: Laptop },
  { id: '15', name: 'اكسسوارات سيارة', slug: 'car-accessories', icon: Radio }, // Placeholder, could be more specific like Car Charger icon
  { id: '16', name: 'بطاقات ذاكرة وفلاشات', slug: 'memory-cards-flashdrives', icon: MemoryStick },
  { id: '17', name: 'اكسسوارات أخرى متنوعة', slug: 'other-accessories', icon: Smartphone }, 
];

export const MOCK_OFFERS: Offer[] = [
  {
    id: 'offer_001',
    title: 'خصم 20% على كل الجرابات!',
    description: 'استفد من خصم 20% على جميع أنواع جرابات الموبايل. العرض ساري لفترة محدودة.',
    categorySlug: 'cases',
    discountPercentage: 20,
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(), // 7 days from now
    imageUrl: 'https://picsum.photos/seed/offer_cases/800/300',
    isActive: true,
    couponCode: 'CASE20'
  },
  {
    id: 'offer_002',
    title: 'شاحن سريع مجاني عند شراء سماعة لاسلكية',
    description: 'احصل على شاحن سريع بقيمة 450 جنيه مجانًا عند شرائك أي سماعة أذن لاسلكية من مجموعتنا.',
    productId: 'prod_002', // Link to a specific product if applicable, e.g., a popular headphone
    startDate: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(), // Started 3 days ago
    endDate: new Date(new Date().setDate(new Date().getDate() + 4)).toISOString(), // Ends in 4 days
    imageUrl: 'https://picsum.photos/seed/offer_headphones_charger/800/300',
    isActive: true,
  },
  {
    id: 'offer_003',
    title: 'عروض نهاية الأسبوع: تخفيضات تصل إلى 50% على اكسسوارات مختارة',
    description: 'لا تفوت عروض نهاية الأسبوع! تخفيضات كبيرة على مجموعة متنوعة من الإكسسوارات.',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + (5 - new Date().getDay() + 7) % 7).toISOString(), // Next Friday
    endDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + (7 - new Date().getDay() + 7) % 7).toISOString(), // Next Sunday
    imageUrl: 'https://picsum.photos/seed/offer_weekend/800/300',
    isActive: false, // Will become active on Friday
  }
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
