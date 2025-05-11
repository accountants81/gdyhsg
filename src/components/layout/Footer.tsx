
import Link from 'next/link';
import { Facebook, Instagram, MessageCircle, Phone } from 'lucide-react'; 
import { getSiteSettings } from '@/app/admin/settings/actions'; // Assuming actions.ts is in admin/settings

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const settings = await getSiteSettings();

  const whatsappLink = settings.whatsappNumber 
    ? `https://wa.me/${settings.whatsappNumber.replace(/\+/g, '')}` 
    : '#';

  return (
    <footer className="border-t border-border/40 bg-background/95">
      <div className="container py-8 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-3">{settings.siteName || "AAAMO"}</h3>
            <p className="text-sm text-muted-foreground">
              وجهتك الأولى لأحدث وأفضل إكسسوارات الموبايل في مصر. جودة عالية، أسعار تنافسية، وخدمة عملاء مميزة.
            </p>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-3">روابط سريعة</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-foreground">من نحن</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">تواصل معنا</Link></li>
              <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground">سياسة الخصوصية</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-foreground">شروط الخدمة</Link></li>
            </ul>
          </div>
          
          <div className="md:col-span-1"> 
            <h3 className="text-lg font-semibold mb-3 md:text-start">تواصل معنا</h3>
            <div className="flex space-x-4 rtl:space-x-reverse mb-4 md:justify-start">
              {settings.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-muted-foreground hover:text-foreground">
                  <Facebook size={24} />
                </a>
              )}
              {settings.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground hover:text-foreground">
                  <Instagram size={24} />
                </a>
              )}
              {settings.whatsappNumber && (
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-muted-foreground hover:text-foreground">
                  <MessageCircle size={24} /> 
                </a>
              )}
              {settings.phoneNumber && (
                 <a href={`tel:${settings.phoneNumber}`} aria-label="Phone" className="text-muted-foreground hover:text-foreground">
                  <Phone size={24} />
                </a>
              )}
            </div>
            {settings.email && (
              <p className="text-sm text-muted-foreground md:text-start">البريد الإلكتروني: <a href={`mailto:${settings.email}`} className="hover:text-foreground">{settings.email}</a></p>
            )}
            {settings.phoneNumber && (
              <p className="text-sm text-muted-foreground md:text-start">رقم الهاتف: <a href={`tel:${settings.phoneNumber}`} className="hover:text-foreground" dir="ltr">{settings.phoneNumber}</a></p>
            )}
          </div>

        </div>
        <div className="text-center text-sm text-muted-foreground pt-8 border-t border-border/40">
          © {currentYear} {settings.siteName || "AAAMO"}. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
