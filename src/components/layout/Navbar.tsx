"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ease-in-out ${isScrolled ? 'bg-black/80 backdrop-blur-lg border-b border-gold-800/20 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)]' : 'bg-transparent py-5 border-b border-transparent'}`}>
      <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center group relative">
          <img src="/logo.png" alt="Cavalry Fleet Logo" className="h-16 w-auto object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-[0_0_15px_rgba(212,175,55,0.3)] mix-blend-screen" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 font-bold text-sm tracking-wide">
          <Link href="/" className="hover:text-gold-400 transition-colors uppercase tracking-widest">{t('nav_home')}</Link>
          <Link href="/#fleet" className="hover:text-gold-400 transition-colors uppercase tracking-widest">{t('nav_fleet')}</Link>
          <Link href="/#services" className="hover:text-gold-400 transition-colors uppercase tracking-widest">{t('nav_services')}</Link>
          
          <div className="w-px h-6 bg-gray-800 hidden lg:block" />
          
          <Link href="/portal" className="text-gray-300 hover:text-white transition-colors">{t('nav_login')}</Link>
          
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 text-gray-400 hover:text-gold-400 transition-colors font-mono"
          >
            <Globe size={16} />
            <span className="font-bold text-xs">{language === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          <Link href="/#fleet" className="bg-gold-gradient text-deepblack px-6 py-2.5 rounded-xl font-bold hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] transition-all duration-300">
            {t('nav_book')}
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="md:flex hidden lg:hidden items-center gap-4">
           {/* Add language toggle for mobile too explicitly here if we want */}
        </div>

        <div className="md:hidden flex items-center gap-4">
          <button onClick={toggleLanguage} className="text-gold-400"><Globe size={20} /></button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white hover:text-gold-400">
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-deepblack/95 backdrop-blur-xl border-b border-gold-800/20 py-6 px-6 flex flex-col gap-6 shadow-2xl">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold hover:text-gold-400">{t('nav_home')}</Link>
          <Link href="/#fleet" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold hover:text-gold-400">{t('nav_fleet')}</Link>
          <Link href="/#services" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold hover:text-gold-400">{t('nav_services')}</Link>
          <Link href="/portal" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold hover:text-gold-400">{t('nav_login')}</Link>
          <Link href="/#fleet" onClick={() => setMobileMenuOpen(false)} className="w-full bg-gold-gradient text-deepblack py-4 rounded-xl font-bold text-center inline-block">{t('nav_book')}</Link>
        </div>
      )}
    </nav>
  );
}
