"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Clock, MapPin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Features() {
  const { t } = useLanguage();
  const [featureImage, setFeatureImage] = useState("https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=2564&auto=format&fit=crop");

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if(data && data.featureImage) {
          setFeatureImage(data.featureImage);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <section className="py-24 bg-black/50 backdrop-blur-[6px] relative overflow-hidden border-t border-gold-800/20">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gold-600/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gold-400/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
               <span className="text-gold-gradient">{t('feat_title')}</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              {t('feat_subtitle')}
            </p>
            
            <div className="space-y-6">
              {[
                { icon: Sparkles, text: t('feat_1_title') },
                { icon: Clock, text: t('feat_3_title') },
                { icon: MapPin, text: t('feat_2_title') },
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center border border-gold-500/20">
                    <feature.icon className="text-gold-500" size={20} />
                  </div>
                  <span className="text-white font-medium text-lg">{feature.text}</span>
                </div>
              ))}
            </div>
            
            <a href="#services" className="mt-8 px-8 py-4 border border-gold-500 text-gold-500 rounded-full font-bold hover:bg-gold-500 hover:text-deepblack transition-all duration-300 inline-block">
              {t('feat_btn')}
            </a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[500px] rounded-3xl overflow-hidden border border-gray-800 border-gold-800/30"
          >
            <img 
              src={featureImage} 
              alt="Luxury Car Focus" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 right-6">
              <span className="bg-deepblack/80 backdrop-blur-md px-4 py-2 rounded-lg text-gold-400 font-bold border border-gold-500/30 text-sm tracking-wider">
                PREMIUM INTERIORS
              </span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
