"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BookingModal from '@/components/booking/BookingModal';
import { Gauge, Zap, CalendarDays, Loader } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function CarCarousel() {
  const [selectedCar, setSelectedCar] = useState<any | null>(null);
  const [dbCars, setDbCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();

  // Fetch from Real DB
  useEffect(() => {
    fetch('/api/cars')
      .then(res => res.json())
      .then(data => {
        if(data && Array.isArray(data) && data.length > 0) {
          // Parse JSON specs for frontend usage
          const parsed = data.map(car => ({
            ...car,
            specs: typeof car.specs === 'string' ? JSON.parse(car.specs) : car.specs
          }));
          setDbCars(parsed);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const carsToDisplay = dbCars;

  return (
    <section className="container mx-auto px-6">
      <div className="text-center mb-16 relative">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{t('car_title')}</h2>
        <div className="w-24 h-1 bg-gold-gradient mx-auto rounded-full" />
        <p className="text-gray-400 mt-6 max-w-xl mx-auto text-sm leading-relaxed">
          {language === 'ar' 
            ? 'تحف هندسية صُنعت لتقدم لك تجربة قيادة فارهة لا تضاهى. اختر مركبتك واصنع بصمتك الخاصة.'
            : 'Engineering masterpieces crafted to offer you an incomparable luxury driving experience. Choose your vehicle and make your mark.'}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-gold-500">
          <Loader size={48} className="animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
          {carsToDisplay.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-deepblack/60 backdrop-blur-xl border border-gray-800 rounded-3xl">
               <p className="text-gold-500 font-bold text-xl mb-2">{t('car_updating')}</p>
               <p className="text-gray-400">{t('car_updating_sub')}</p>
            </div>
          ) : (
            carsToDisplay.map((car, index) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                key={car.id}
                className="group block rounded-3xl overflow-hidden bg-deepblack/60 backdrop-blur-xl border border-gold-800/30 hover:border-gold-500/50 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(212,175,55,0.2)] relative flex flex-col h-full"
              >
                {/* Image Wrapper */}
                <div className="relative h-72 shrink-0 overflow-hidden bg-black">
                  <div className="absolute inset-0 bg-gradient-to-t from-deepblack/80 to-transparent z-10" />
                  <img 
                    src={car.imageUrl} 
                    alt={car.modelName} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=800&auto=format&fit=crop" }} // Fallback if local upload is missing
                  />
                  
                  {/* Specs Overlay */}
                  <div className="absolute top-0 left-0 w-full p-4 flex justify-between z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-black/80 to-transparent">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-gray-300 bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-md border border-gray-700 shadow-xl">
                        <Gauge size={14} className="text-gold-500" /> <span dir="ltr">{car.specs?.topSpeed || '250'} {t('car_speed')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-bold text-gray-300 bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-md border border-gray-700 shadow-xl">
                        <Zap size={14} className="text-gold-500" /> <span dir="ltr">{car.specs?.hp || '500'} {t('car_hp')}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-[11px] font-bold text-gray-300 bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-md border border-gray-700 shadow-xl">
                        <CalendarDays size={14} className="text-gold-500" /> {car.specs?.year || '2024'}
                      </div>
                    </div>
                  </div>

                  {/* Price Tag */}
                  <div className="absolute bottom-4 right-4 z-20 bg-deepblack/80 backdrop-blur-xl border border-gold-700/50 text-gold-400 px-5 py-2.5 rounded-xl font-bold shadow-lg flex gap-2 items-center">
                    <span dir="ltr">{car.dailyPrice}</span> <span className="text-xs text-gray-400 font-normal">{t('car_sar_day')}</span>
                  </div>
                </div>
                
                <div className="p-6 relative z-30 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gold-400 transition-colors line-clamp-2">
                      {car.modelName}
                    </h3>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedCar(car)}
                    className="w-full mt-6 py-4 rounded-xl font-bold border border-gold-500/50 text-gold-500 hover:bg-gold-gradient hover:text-deepblack hover:border-transparent transition-all duration-300 relative overflow-hidden group/btn shadow-[0_0_15px_rgba(212,175,55,0)] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                  >
                    <span className="relative z-10">{t('car_book')}</span>
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      <BookingModal 
        isOpen={!!selectedCar} 
        onClose={() => setSelectedCar(null)} 
        car={selectedCar} 
      />
    </section>
  );
}
