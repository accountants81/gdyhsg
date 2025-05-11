import type { Product } from '@/lib/types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod_001',
    name: 'جراب سيليكون فاخر لآيفون 15 برو',
    description: 'جراب سيليكون عالي الجودة يوفر حماية ممتازة وملمس ناعم لهاتف آيفون 15 برو. متوفر بألوان متعددة.',
    price: 250,
    imageUrls: [
        'https://picsum.photos/seed/prod_001_a/400/400',
        'https://picsum.photos/seed/prod_001_b/400/400',
        'https://picsum.photos/seed/prod_001_c/400/400',
    ],
    categorySlug: 'cases',
    stock: 50,
  },
  {
    id: 'prod_002',
    name: 'سماعة أذن لاسلكية بخاصية إلغاء الضوضاء',
    description: 'استمتع بصوت نقي وتجربة استماع غامرة مع سماعات الأذن اللاسلكية المتطورة. عمر بطارية طويل وجودة صوت استثنائية.',
    price: 1200,
    imageUrls: ['https://picsum.photos/seed/prod_002/400/400'],
    categorySlug: 'headphones',
    stock: 30,
  },
  {
    id: 'prod_003',
    name: 'شاحن سريع 65 واط GaN Tech',
    description: 'شاحن فائق السرعة بتقنية GaN، صغير الحجم وقوي. يدعم شحن اللابتوب والهواتف الذكية بسرعة وأمان.',
    price: 450,
    imageUrls: [
        'https://picsum.photos/seed/prod_003_x/400/400',
        'https://picsum.photos/seed/prod_003_y/400/400',
    ],
    categorySlug: 'chargers-powerbanks',
    stock: 75,
  },
  {
    id: 'prod_004',
    name: 'اسكرينة حماية زجاجية 9H لهاتف سامسونج جالاكسي S24 ألترا',
    description: 'اسكرينة زجاجية مقواة بدرجة صلابة 9H لحماية شاشة هاتفك سامسونج جالاكسي S24 ألترا من الخدوش والصدمات.',
    price: 180,
    imageUrls: ['https://picsum.photos/seed/prod_004/400/400'],
    categorySlug: 'screen-protectors',
    stock: 100,
  },
  {
    id: 'prod_005',
    name: 'كابل شحن USB-C إلى USB-C سريع',
    description: 'كابل شحن ونقل بيانات USB-C إلى USB-C عالي الجودة، يدعم الشحن السريع ونقل البيانات بسرعة فائقة. طول 2 متر.',
    price: 150,
    imageUrls: ['https://picsum.photos/seed/prod_005/400/400'],
    categorySlug: 'cables-adapters',
    stock: 60,
  },
  {
    id: 'prod_006',
    name: 'حامل موبايل مغناطيسي للسيارة',
    description: 'حامل موبايل مغناطيسي قوي وسهل التركيب لسيارتك. يوفر تثبيتًا آمنًا لهاتفك أثناء القيادة.',
    price: 220,
    imageUrls: [
        'https://picsum.photos/seed/prod_006_main/400/400',
        'https://picsum.photos/seed/prod_006_angle/400/400',
    ],
    categorySlug: 'mounts-holders', // Changed from other-accessories
    stock: 40,
  },
   {
    id: 'prod_007',
    name: 'باور بانك 20000 مللي أمبير شحن سريع',
    description: 'باور بانك بسعة كبيرة 20000 مللي أمبير مع دعم الشحن السريع. مثالي للرحلات والاستخدام اليومي.',
    price: 750,
    imageUrls: ['https://picsum.photos/seed/prod_007/400/400'],
    categorySlug: 'chargers-powerbanks',
    stock: 25,
  },
  {
    id: 'prod_008',
    name: 'جراب جلد طبيعي لهاتف جوجل بيكسل 8',
    description: 'جراب أنيق مصنوع من الجلد الطبيعي الفاخر، يوفر حماية ممتازة ومظهرًا راقيًا لهاتف جوجل بيكسل 8.',
    price: 350,
    imageUrls: [
        'https://picsum.photos/seed/prod_008_front/400/400',
        'https://picsum.photos/seed/prod_008_back/400/400',
        'https://picsum.photos/seed/prod_008_side/400/400',
        'https://picsum.photos/seed/prod_008_open/400/400',
    ],
    categorySlug: 'cases',
    stock: 35,
  }
];
