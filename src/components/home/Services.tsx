"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserCheck, PlaneTakeoff, ShieldCheck, Users } from 'lucide-react';
import BookingModal from '@/components/booking/BookingModal';
import { useLanguage } from '@/context/LanguageContext';

export default function Services() {
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [livePrices, setLivePrices] = useState<Record<string, number>>({});
  const [liveImages, setLiveImages] = useState<Record<string, string>>({});
  const { t, language } = useLanguage();

  const SERVICES = [
    {
      id: "srv_chauffeur",
      icon: UserCheck,
      title: t('srv_1_title'),
      description: t('srv_1_desc'),
      dailyPrice: 1500,
      imageUrl: 'https://images.unsplash.com/photo-1631269389201-901ed4fd0bd6?q=80&w=2670&auto=format&fit=crop'
    },
    {
      id: "srv_airport",
      icon: PlaneTakeoff,
      title: t('srv_2_title'),
      description: t('srv_2_desc'),
      dailyPrice: 800,
      imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2670&auto=format&fit=crop'
    },
    {
      id: "srv_security",
      icon: ShieldCheck,
      title: t('srv_3_title'),
      description: t('srv_3_desc'),
      dailyPrice: 3500,
      imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=2564&auto=format&fit=crop'
    },
    {
      id: "srv_crowd",
      icon: Users,
      title: t('srv_4_title'),
      description: t('srv_4_desc'),
      dailyPrice: 2500,
      imageUrl: 'https://images.unsplash.com/photo-1563720225384-9ddf42ba9eaf?q=80&w=2670&auto=format&fit=crop'
    }
  ];

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && data.servicePrices) {
          setLivePrices(data.servicePrices);
        }
        if (data && data.serviceImages) {
          setLiveImages(data.serviceImages);
        }
      })
      .catch(console.error);
  }, []);

  const getPrice = (id: string, def: number) => livePrices[id] || def;
  const getImage = (id: string, def: string) => liveImages[id] || def;

  const handleBookService = (service: any) => {
    setSelectedService({
      id: service.id,
      modelName: service.title,
      dailyPrice: getPrice(service.id, service.dailyPrice),
      imageUrl: getImage(service.id, service.imageUrl)
    });
  };

  return (
    <section id="services" className="py-24 bg-black/40 backdrop-blur-[4px] relative border-t border-gold-800/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{t('srv_header')}</h2>
          <div className="w-24 h-1 bg-gold-gradient mx-auto rounded-full mb-6" />
          <p className="text-gray-300 max-w-2xl mx-auto font-medium">
            {language === 'ar' 
              ? 'نقدم تجربة متكاملة تتجاوز مجرد استئجار سيارة، لنوفر لك أسلوب حياة يعكس مكانتك المرموقة.'
              : 'We offer an integrated experience that goes beyond merely renting a car, delivering a lifestyle that reflects your prestigious status.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative z-10">
          {SERVICES.map((service, index) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              key={service.title}
              className="group bg-deepblack/60 backdrop-blur-md border border-gold-800/30 p-8 rounded-2xl hover:border-gold-500/50 transition-all duration-500 hover:-translate-y-2 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="w-16 h-16 rounded-2xl bg-black/50 border border-gray-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 group-hover:border-gold-500/50 shadow-inner">
                  <service.icon size={32} className="text-gold-500 relative z-10" />
                  <div className="absolute inset-0 bg-gold-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gold-400 transition-colors">{service.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm mb-6">
                  {service.description}
                </p>
              </div>

              <div className="mt-auto pt-6 border-t border-gray-800/50 text-center">
                <p className="text-gold-500 font-bold flex items-center justify-center gap-2 font-mono text-xl mb-4"><span dir="ltr">{getPrice(service.id, service.dailyPrice)}</span> <span className="text-xs text-gray-400 font-normal font-sans">{service.id === 'srv_airport' ? t('srv_airport_unit') : t('srv_day_unit')}</span></p>
                <button 
                  onClick={() => handleBookService(service)}
                  className="w-full py-3 bg-gray-900 border border-gold-500/30 text-gold-400 rounded-xl font-bold hover:bg-gold-gradient hover:text-deepblack hover:border-transparent transition-all duration-300 relative overflow-hidden group/btn shadow-[0_0_15px_rgba(212,175,55,0)] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                >
                  <span className="relative z-10">{t('srv_book_btn')}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <BookingModal 
        isOpen={!!selectedService} 
        onClose={() => setSelectedService(null)} 
        car={selectedService} 
        type="service" 
      />
    </section>
  );
}
