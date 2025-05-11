
import Link from 'next/link';
import { Facebook, Instagram, MessageCircle, Phone, Send } from 'lucide-react'; // Using Send for generic messenger/whatsapp
import { SITE_NAME } from '@/lib/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-background/95">
      <div className="container py-8 max-w-screen-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">{SITE_NAME}</h3>
            <p className="text-sm text-muted-foreground">
              وجهتك الأولى لأحدث وأفضل إكسسوارات الموبايل في مصر. جودة عالية، أسعار تنافسية، وخدمة عملاء مميزة.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">روابط سريعة</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-foreground">من نحن</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">تواصل معنا</Link></li>
              <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground">سياسة الخصوصية</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-foreground">شروط الخدمة</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">تواصل معنا</h3>
            <div className="flex space-x-4 rtl:space-x-reverse mb-4">
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-muted-foreground hover:text-foreground">
                <Facebook size={24} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground hover:text-foreground">
                <Instagram size={24} />
              </a>
              <a href="https://wa.me/YOUR_WHATSAPP_NUMBER" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-muted-foreground hover:text-foreground">
                <MessageCircle size={24} /> {/* Using MessageCircle as generic for WhatsApp/Messenger */}
              </a>
               <a href="tel:YOUR_PHONE_NUMBER" aria-label="Phone" className="text-muted-foreground hover:text-foreground">
                <Phone size={24} />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">البريد الإلكتروني: <a href="mailto:info@aaamo.com" className="hover:text-foreground">info@aaamo.com</a></p>
            <p className="text-sm text-muted-foreground">رقم الهاتف: <a href="tel:+201234567890" className="hover:text-foreground" dir="ltr">+20 123 456 7890</a></p>
          </div>
        </div>
        <div className="text-center text-sm text-muted-foreground pt-8 border-t border-border/40">
          © {currentYear} {SITE_NAME}. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
