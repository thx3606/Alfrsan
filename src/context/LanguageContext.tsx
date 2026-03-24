"use client";
import { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<string, string>> = {
  ar: {
    // Nav
    nav_home: 'الرئيسية',
    nav_fleet: 'أسطولنا',
    nav_services: 'الخدمات',
    nav_login: 'تسجيل الدخول',
    nav_book: 'احجز الآن',
    nav_admin: 'التطوير',
    
    // Hero
    hero_title: 'فخامة مُطلقة، وقيادة استثنائية.',
    hero_subtitle: 'أسطول الفرسان يضع بين يديك أرقى تحف السيارات في العالم، لنصنع لك حضوراً طاغياً في كل مناسبة وتجربة قيادة لا تُنسى في شوارع المملكة.',
    hero_btn1: 'تصفح الأسطول الحصري',
    hero_btn2: 'خدمات كبار الشخصيات',

    // Features
    feat_title: 'لماذا تختار أسطول الفرسان؟',
    feat_subtitle: 'لأننا لا نؤجر السيارات فحسب، بل نصنع لك حضوراً طاغياً في كل مناسبة. أسطولنا يمر بصيانة دورية وعناية استثنائية ليكون في أبهى حلة تليق بك.',
    feat_1_title: 'خيار النخبة الأول',
    feat_1_desc: 'نمتلك أندر السيارات الفارهة المخصصة فقط لكبار الشخصيات ورجال الأعمال.',
    feat_2_title: 'سرية وخصوصية تامة',
    feat_2_desc: 'نضمن لك تجربة حجز سلسة تحافظ على أقصى درجات الخصوصية والأمان.',
    feat_3_title: 'خدمة كونسيرج 24/7',
    feat_3_desc: 'فريق دعم مخصص لخدمتك على مدار الساعة لتلبية كافة متطلباتك بلمح البصر.',
    feat_btn: 'اكتشف المزيد عن خدماتنا',

    // Cars
    car_title: 'أسطولنا الحصري',
    car_updating: 'الأسطول قيد التحديث',
    car_updating_sub: 'سيتم إضافة أحدث السيارات الفارهة قريباً. تابعنا لاكتشاف الرفاهية المطلقة.',
    car_speed: 'KM/H',
    car_hp: 'HP',
    car_sar_day: 'ر.س / يوم',
    car_book: 'احجز الآن',
    car_demo: 'هذه سيارة افتراضية للتجربة',
    car_qty: 'العدد المتاح:',

    // Services
    srv_header: 'خدمات النخبة (VIP)',
    srv_desc: 'تتجاوز خدماتنا توفير السيارات، لنقدم لك نمط حياة متكامل يليق بك.',
    srv_1_title: 'سائق خاص (Chauffeur)',
    srv_1_desc: 'تمتع براحة البال والخصوصية التامة مع سائقين محترفين مدربين على أرقى بروتوكولات التعامل مع كبار الشخصيات.',
    srv_2_title: 'نقل المطار VIP',
    srv_2_desc: 'استقبال استثنائي وتنقل سلس من وإلى المطار في سيارات فائقة الفخامة تضمن لك ولضيوفك وصولاً مريحاً.',
    srv_3_title: 'مرافقة أمنية للوفود',
    srv_3_desc: 'نوفر حلولاً أمنية متكاملة وسيارات مصفحة للقصور والوفود الدبلوماسية لضمان أقصى درجات الحماية.',
    srv_4_title: 'إدارة الحشود وحرس شخصي',
    srv_4_desc: 'نخبة من الحراس الشخصيين لتأمين الشخصيات الهامة وإدارة الحشود باحترافية في الفعاليات الكبرى.',
    srv_airport_unit: '/ للرحلة',
    srv_day_unit: '/ يوم',
    srv_book_btn: 'احجز الخدمة الآن',

    // Booking
    bk_car_title: 'تأكيد الحجز الاستثنائي',
    bk_srv_title: 'تأكيد طلب الخدمة المتميزة',
    bk_car_desc: 'يرجى إكمال البيانات أدناه ليتم التواصل معك فوراً وتجهيز',
    bk_srv_desc: 'يرجى إكمال البيانات أدناه ليقوم فريق كبار الشخصيات بترتيب',
    bk_car_price: 'سعر الإيجار اليومي',
    bk_srv_price: 'تكلفة الخدمة الأساسية',
    bk_total: 'الإجمالي التقديري',
    bk_promo_invalid: 'كود الخصم غير صالح أو منتهي الصلاحية.',
    bk_promo_valid: 'تم تطبيق الخصم بنجاح!',
    bk_promo_label: 'كود الخصم (اختياري)',
    bk_promo_placeholder: 'أدخل الكود هنا',
    bk_apply: 'تطبيق',
    bk_dates_title: 'جدولة الحجز',
    bk_start: 'تاريخ البدء',
    bk_end: 'تاريخ الانتهاء',
    bk_open_contract: 'عقد مفتوح المدة',
    bk_client_title: 'بيانات المستفيد',
    bk_name: 'الاسم الرباعي المطابق للهوية',
    bk_name_ph: 'مثال: محمد بن عبدالله',
    bk_id: 'رقم الهوية / الإقامة',
    bk_id_ph: '10xxxxxxxxx',
    bk_phone: 'رقم الجوال النشط',
    bk_phone_ph: '05xxxxxxxx',
    bk_submit: 'تأكيد الطلب الآن',
    bk_fill_dates: 'أكمل البيانات لاختيار التواريخ',
    bk_success_title: 'تم استلام طلبك الملكي بنجاح!',
    bk_success_desc: 'تم إرسال رسالة تأكيد مبدئية إلى بريدك الإلكتروني. سيقوم مدير حسابات التميز بالتواصل معك هاتفياً خلال دقائق لإتمام ترتيبات',
    bk_close: 'إغلاق والعودة',

    // Footer
    ft_desc: 'شركة أسطول الفرسان تقدم خدمة تأجير السيارات الفارهة بمعايير عالمية. الفخامة، الموثوقية، والتجربة الاستثنائية هي وعودنا لك.',
    ft_links: 'روابط سريعة',
    ft_contact: 'تواصل معنا',
    ft_address_1: 'مكة المكرمة - الشوقية',
    ft_address_2: 'شارع الحكمة',
    ft_legal: 'البيانات الرسمية',
    ft_owner_lbl: 'المالك العام',
    ft_owner: 'أ. محمد الحربي',
    ft_cr_lbl: 'السجل التجاري',
    ft_vat_lbl: 'الرقم الضريبي',
    ft_copy: 'شركة أسطول الفرسان لتأجير السيارات الفخمة. جميع الحقوق محفوظة.',
    ft_admin: 'بوابة الإدارة المركزية'
  },
  en: {
    // Nav
    nav_home: 'Home',
    nav_fleet: 'Our Fleet',
    nav_services: 'Services',
    nav_login: 'Client Login',
    nav_book: 'Book Now',
    nav_admin: 'Admin Portal',
    
    // Hero
    hero_title: 'Absolute Luxury, Exceptional Drive.',
    hero_subtitle: 'Cavalry Fleet brings the world’s finest automotive masterpieces to your hands, crafting an unforgettable presence and driving experience across the Kingdom.',
    hero_btn1: 'Explore Exclusive Fleet',
    hero_btn2: 'VIP Concierge',

    // Features
    feat_title: 'Why Choose Cavalry Fleet?',
    feat_subtitle: 'Because we do not just rent cars, we craft an overwhelming presence for every occasion. Our fleet undergoes extraordinary care to be in its absolute best.',
    feat_1_title: 'The Elite Choice',
    feat_1_desc: 'We possess the rarest luxury vehicles dedicated strictly for VIPs and executives.',
    feat_2_title: 'Absolute Privacy & Discretion',
    feat_2_desc: 'We guarantee a seamless booking experience maintaining your utmost privacy and security.',
    feat_3_title: '24/7 Concierge Service',
    feat_3_desc: 'A dedicated support team available round the clock to fulfill all your requirements in a blink.',
    feat_btn: 'Discover Our Services',

    // Cars
    car_title: 'Exclusive Fleet',
    car_updating: 'Fleet Updating',
    car_updating_sub: 'The latest luxury vehicles will be added soon. Stay tuned for ultimate luxury.',
    car_speed: 'KM/H',
    car_hp: 'HP',
    car_sar_day: 'SAR / Day',
    car_book: 'Book Now',
    car_demo: 'This is a virtual demo car',
    car_qty: 'Available:',


    // Services
    srv_header: 'Elite Services (VIP)',
    srv_desc: 'Our services go beyond providing vehicles; we deliver a complete lifestyle befitting you.',
    srv_1_title: 'Private Chauffeur',
    srv_1_desc: 'Enjoy complete peace of mind and privacy with professional chauffeurs trained in the highest VIP protocols.',
    srv_2_title: 'Airport VIP Transfer',
    srv_2_desc: 'Exceptional reception and seamless transport to and from the airport ensuring a comfortable arrival.',
    srv_3_title: 'Security Escort',
    srv_3_desc: 'We provide comprehensive security solutions and armored vehicles for maximum protection.',
    srv_4_title: 'Crowd Management & Bodyguard',
    srv_4_desc: 'Elite bodyguards for VIP protection and professional crowd management at major events.',
    srv_airport_unit: '/ Trip',
    srv_day_unit: '/ Day',
    srv_book_btn: 'Reserve Service',

    // Booking
    bk_car_title: 'Confirm Exceptional Reservation',
    bk_srv_title: 'Confirm Premium Service Request',
    bk_car_desc: 'Please complete the details below so we can contact you immediately to prepare',
    bk_srv_desc: 'Please complete the details below so our VIP team can arrange',
    bk_car_price: 'Daily Rental Rate',
    bk_srv_price: 'Base Service Rate',
    bk_total: 'Estimated Total',
    bk_promo_invalid: 'Invalid or expired promo code.',
    bk_promo_valid: 'Discount applied successfully!',
    bk_promo_label: 'Promo Code (Optional)',
    bk_promo_placeholder: 'Enter Code',
    bk_apply: 'Apply',
    bk_dates_title: 'Schedule Booking',
    bk_start: 'Start Date',
    bk_end: 'End Date',
    bk_open_contract: 'Open-ended Contract',
    bk_client_title: 'Client Details',
    bk_name: 'Full Name (As per ID)',
    bk_name_ph: 'e.g., Mohammed Abdullah',
    bk_id: 'National ID / Iqama',
    bk_id_ph: '10xxxxxxxxx',
    bk_phone: 'Active Phone Number',
    bk_phone_ph: '05xxxxxxxx',
    bk_submit: 'Confirm Request Now',
    bk_fill_dates: 'Fill details to select dates',
    bk_success_title: 'Royal Request Received Successfully!',
    bk_success_desc: 'An initial confirmation email has been sent. Your VIP Account Manager will contact you via phone within minutes to finalize the handover of',
    bk_close: 'Close & Return',

    // Footer
    ft_desc: 'Cavalry Fleet offers world-class luxury car rental services. Luxury, reliability, and an exceptional experience are our promises to you.',
    ft_links: 'Quick Links',
    ft_contact: 'Contact Us',
    ft_address_1: 'Makkah - Al Shawqiyyah',
    ft_address_2: 'Al Hikmah Street',
    ft_legal: 'Official Records',
    ft_owner_lbl: 'General Owner',
    ft_owner: 'Mr. Mohammed Al-Harbi',
    ft_cr_lbl: 'CR Number',
    ft_vat_lbl: 'VAT Number',
    ft_copy: 'Cavalry Fleet luxury car rentals. All rights reserved.',
    ft_admin: 'Central Admin Portal'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar');

  useEffect(() => {
    // Dynamic flip of root HTML properties triggering full Tailwind RTL/LTR repaint
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => setLanguage(prev => prev === 'ar' ? 'en' : 'ar');

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
