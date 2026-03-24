"use client";

import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function Hero() {
  const { t, language } = useLanguage();

  return (
    <section className="relative min-h-[800px] flex items-center justify-center overflow-hidden">
      <div className="container mx-auto px-6 relative z-20 flex flex-col items-center text-center mt-20">
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1.2, ease: "easeOut" }}
           className="w-40 md:w-56 mb-6"
        >
           <img src="/logo.png" alt="Emblem" className="w-full h-auto object-contain filter drop-shadow-md mix-blend-screen" />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight tracking-tight"
        >
          {t('hero_title').split('،')[0]}
          {t('hero_title').includes('،') && (
            <>
              <br className="hidden md:block" />
              <span className="text-gold-gradient"> {t('hero_title').split('،')[1]}</span>
            </>
          )}
          {!t('hero_title').includes('،') && ( 
            <><br className="hidden md:block"/><span className="text-gold-gradient"> {t('hero_title').split(',')[1] || ''}</span></>
          )}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed mb-12 font-medium"
        >
          {t('hero_subtitle')}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto"
        >
          <a href="#fleet" className="bg-gold-gradient text-deepblack px-10 py-4 rounded-xl font-bold text-lg hover:scale-[1.03] transition-transform duration-300 shadow-[0_0_30px_rgba(212,175,55,0.3)] block">
            {t('hero_btn1')}
          </a>
          <a href="#services" className="bg-transparent border border-gold-500/50 text-gold-400 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gold-500/10 transition-colors duration-300 backdrop-blur-sm block">
            {t('hero_btn2')}
          </a>
        </motion.div>
      </div>

      {/* Modern Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500"
      >
        <span className="text-xs tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-px h-16 bg-gradient-to-b from-gold-500 to-transparent animate-pulse" />
      </motion.div>
    </section>
  );
}
