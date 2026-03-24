"use client";
import Link from 'next/link';
import { MapPin, Phone, Mail, User, FileText, Receipt } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-black pt-20 pb-10 border-t border-gold-800/30 relative overflow-hidden">
      {/* Decorative Elegance Line & Glow */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="lg:col-span-1 space-y-6">
            <Link href="/" className="flex items-center">
              <img src="/logo.png" alt="Cavalry Fleet" className="h-24 w-auto object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.4)] mix-blend-screen" />
            </Link>
            <p className="text-gray-400 leading-relaxed text-sm pr-2 border-r-2 border-gold-800/50">
              {t('ft_desc')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide text-lg border-b border-gold-800/50 pb-3 inline-block">{t('ft_links')}</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <Link href="#fleet" className="hover:text-gold-400 transition-colors flex items-center gap-2 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-700 group-hover:bg-gold-500 transition-colors" /> {t('nav_fleet')}
                </Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-gold-400 transition-colors flex items-center gap-2 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-700 group-hover:bg-gold-500 transition-colors" /> {t('nav_services')}
                </Link>
              </li>
              <li>
                <Link href="/portal" className="hover:text-gold-400 transition-colors flex items-center gap-2 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-700 group-hover:bg-gold-500 transition-colors" /> {t('nav_login')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-1">
            <h4 className="text-white font-bold mb-6 tracking-wide text-lg border-b border-gold-800/50 pb-3 inline-block">{t('ft_contact')}</h4>
            <ul className="space-y-6 text-sm text-gray-400">
              <li>
                <a href="https://maps.app.goo.gl/rftz5E6Q86bXfcY68?g_st=ipc" target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group">
                  <div className="p-2 rounded-lg bg-deepblack border border-gray-800 group-hover:border-gold-500/50 transition-colors shrink-0">
                    <MapPin className="text-gold-500 group-hover:animate-bounce" size={18} />
                  </div>
                  <span className="leading-relaxed mt-1 text-gray-300 group-hover:text-gold-400 transition-colors">{t('ft_address_1')}<br />{t('ft_address_2')}</span>
                </a>
              </li>
              <li>
                <a href="https://wa.me/966555268298" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                  <div className="p-2 rounded-lg bg-deepblack border border-gray-800 group-hover:border-gold-500/50 transition-colors shrink-0">
                    <Phone className="text-gold-500 group-hover:animate-pulse" size={18} />
                  </div>
                  <span dir="ltr" className="text-right w-full font-mono text-base font-bold text-gray-200 tracking-widest group-hover:text-gold-400 transition-colors">0555268298</span>
                </a>
              </li>
              <li>
                <a href="mailto:n41171734@gmail.com" className="flex items-center gap-4 group">
                  <div className="p-2 rounded-lg bg-deepblack border border-gray-800 group-hover:border-gold-500/50 transition-colors shrink-0">
                    <Mail className="text-gold-500" size={18} />
                  </div>
                  <span className="font-medium text-gray-300 group-hover:text-gold-400 transition-colors tracking-wide">n41171734@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Records VIP Card */}
          <div className="bg-charcoal border border-gold-800/30 p-6 rounded-2xl relative shadow-xl shadow-black h-fit">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gold-500/5 rounded-bl-[100px] pointer-events-none" />
            <h4 className="text-white font-bold mb-6 tracking-wide text-lg border-b border-gold-800/50 pb-3">{t('ft_legal')}</h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex flex-col gap-1 border-b border-gray-800 border-dashed pb-3">
                <div className="flex items-center gap-2 text-gold-500 mb-1"><User size={14} /> <span className="font-bold text-[11px] uppercase tracking-wider opacity-80">{t('ft_owner_lbl')}</span></div>
                <span className="font-bold text-white text-base">{t('ft_owner')}</span>
              </li>
              <li className="flex flex-col gap-1 border-b border-gray-800 border-dashed pb-3">
                <div className="flex items-center gap-2 text-gold-500 mb-1"><FileText size={14} /> <span className="font-bold text-[11px] uppercase tracking-wider opacity-80">{t('ft_cr_lbl')}</span></div>
                <span className="font-mono tracking-widest text-gold-400 font-bold">71016798710</span>
              </li>
              <li className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-gold-500 mb-1"><Receipt size={14} /> <span className="font-bold text-[11px] uppercase tracking-wider opacity-80">{t('ft_vat_lbl')}</span></div>
                <span className="font-mono tracking-widest text-gold-400 font-bold">310939976890002</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-900 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} {t('ft_copy')}</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/admin/login" className="hover:text-gold-500 transition-colors font-medium">{t('ft_admin')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
