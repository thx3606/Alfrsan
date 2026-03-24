"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, CreditCard, Phone, Tag, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface BookingItem {
  id: string;
  modelName: string;
  dailyPrice: number;
  imageUrl: string;
  specs?: any;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: BookingItem | null;
  type?: 'car' | 'service'; // Differentiates between vehicle and VIP service
}

export default function BookingModal({ isOpen, onClose, car, type = 'car' }: BookingModalProps) {
  const [isOpenEnded, setIsOpenEnded] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  
  const [availabilityStatus, setAvailabilityStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const { t, language } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      setBookingSuccess(false);
      setAvailabilityStatus('idle');
      setPromoCode('');
      setDiscountAmount(0);
      setStartDate('');
      setEndDate('');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  useEffect(() => {
    if (startDate && (endDate || isOpenEnded)) {
      setAvailabilityStatus('checking');
      const timeout = setTimeout(() => {
        if (type === 'car' && startDate === '2026-04-01') {
          setAvailabilityStatus('unavailable');
        } else {
          setAvailabilityStatus('available');
        }
      }, 1000);
      return () => clearTimeout(timeout);
    } else {
      setAvailabilityStatus('idle');
    }
  }, [startDate, endDate, isOpenEnded, type]);

  const applyPromoCode = () => {
    if (promoCode === 'VIP2026') {
      setDiscountAmount(car ? car.dailyPrice * 0.2 : 0);
    } else if (promoCode === 'WINTER500') {
      setDiscountAmount(500);
    } else {
      alert(t('bk_promo_invalid'));
      setDiscountAmount(0);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (availabilityStatus !== 'available') return;

    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          carId: car?.id,
          fullName: formData.get('fullName'),
          nationalId: formData.get('nationalId'),
          phoneNumber: formData.get('phoneNumber'),
          startDate,
          endDate,
          isOpenEnded,
          promoCode,
          totalPrice: finalPrice
        })
      });
      if (res.ok) {
        setBookingSuccess(true);
      } else {
        alert("Error submitting request.");
      }
    } catch {
      alert("Network failed.");
    }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const finalPrice = car ? Math.max(0, car.dailyPrice - discountAmount) : 0;

  return createPortal(
    <AnimatePresence>
      {isOpen && car && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          className="relative w-full max-w-6xl h-[90vh] bg-deepblack border border-gold-800/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row shadow-gold-900/10"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className={`absolute top-4 ${language === 'ar' ? 'left-4' : 'right-4'} z-50 p-2 bg-black/50 backdrop-blur-md text-white hover:text-gold-400 hover:bg-gold-500/20 rounded-full transition-colors border border-gray-700 hover:border-gold-500/50`}
          >
            <X size={20} />
          </button>

          {/* Form Area (Scrollable) */}
          <div className="w-full md:w-1/2 h-full flex flex-col bg-charcoal relative">
            
            {/* Header */}
            <div className="p-6 md:p-10 pb-6 border-b border-gray-800 shrink-0 bg-charcoal z-20">
              <h2 className="text-2xl font-bold text-white tracking-wide">
                {type === 'car' ? t('bk_car_title') : t('bk_srv_title')}
              </h2>
              <p className="text-gray-400 text-sm mt-1">{language === 'ar' ? 'يُرجى إكمال البيانات بدقة لضمان أفضل تجربة لك.' : 'Please complete the details accurately to ensure the best experience.'}</p>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar pb-32">
              {bookingSuccess ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <CheckCircle size={80} className="text-emerald-500 mb-4" />
                  <h2 className="text-3xl font-bold text-white">{t('bk_success_title')}</h2>
                  <p className="text-gray-400 leading-relaxed">
                    {t('bk_success_desc')} {car.modelName}.
                  </p>
                  <div className={`bg-deepblack p-6 rounded-xl border border-gold-800/30 w-full mt-6 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    <p className="text-gold-400 text-sm mb-2 font-bold tracking-widest">{language === 'ar' ? 'رقم المرجع' : 'Reference'}: <span className="font-mono text-white text-lg">CF-{Math.floor(Math.random() * 10000)}</span></p>
                  </div>
                  <button onClick={onClose} className="mt-6 text-gold-500 border border-gold-500/30 hover:bg-gold-500/10 px-6 py-2 rounded-xl">{t('bk_close')}</button>
                </div>
              ) : (
                <form className="space-y-6" id="booking-form" onSubmit={handleBooking}>
                  {/* Personal Info */}
                  <div className="space-y-4">
                    <h4 className="text-gold-400 font-bold border-b border-gray-800 pb-2 mb-4">{t('bk_client_title')}</h4>
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500 flex items-center gap-2"><User size={14} /> {t('bk_name')}</label>
                      <input name="fullName" required type="text" className="w-full bg-deepblack border border-gray-800 focus:border-gold-500 rounded-xl px-4 py-3 text-white outline-none transition-colors" placeholder={t('bk_name_ph')} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs text-gray-500 flex items-center gap-2"><CreditCard size={14} /> {t('bk_id')}</label>
                        <input name="nationalId" required type="text" className="w-full bg-deepblack border border-gray-800 focus:border-gold-500 rounded-xl px-4 py-3 text-white outline-none transition-colors" placeholder={t('bk_id_ph')} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-gray-500 flex items-center gap-2"><Phone size={14} /> {t('bk_phone')}</label>
                        <input name="phoneNumber" required type="tel" className={`w-full bg-deepblack border border-gray-800 focus:border-gold-500 rounded-xl px-4 py-3 text-white outline-none transition-colors direction-ltr ${language === 'ar' ? 'text-right' : 'text-left'}`} placeholder={t('bk_phone_ph')} />
                      </div>
                    </div>
                  </div>

                  {/* Scheduling Info */}
                  <div className="space-y-4 mt-8 pt-6 border-t border-gray-800">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-gold-400 font-bold border-b border-gray-800 pb-2 w-full flex justify-between">
                        {t('bk_dates_title')}
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="accent-gold-500 w-4 h-4" checked={isOpenEnded} onChange={(e) => setIsOpenEnded(e.target.checked)} />
                          <span className="text-xs text-gray-300 font-normal">{t('bk_open_contract')}</span>
                        </label>
                      </h4>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs text-gray-500">{t('bk_start')}</label>
                        <input required type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} className={`w-full bg-deepblack border border-gray-800 focus:border-gold-500 rounded-xl px-4 py-3 text-white outline-none transition-colors text-sm ${language==='ar'?'text-right':'text-left'}`} />
                      </div>
                      {!isOpenEnded && (
                        <div className="space-y-2">
                          <label className="text-xs text-gray-500">{t('bk_end')}</label>
                          <input required type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)} className={`w-full bg-deepblack border border-gray-800 focus:border-gold-500 rounded-xl px-4 py-3 text-white outline-none transition-colors text-sm ${language==='ar'?'text-right':'text-left'}`} />
                        </div>
                      )}
                    </div>

                    {/* Live Availability Validation */}
                    {availabilityStatus === 'checking' && <p className="text-xs text-gold-500 animate-pulse bg-gold-500/10 p-3 rounded-lg border border-gold-500/20">{language==='ar'?'جاري التأكد من جدولة الطلبات الحالية...':'Checking schedule availability...'}</p>}
                    {availabilityStatus === 'unavailable' && (
                      <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex gap-2 text-red-500 text-sm font-bold shadow-inner">
                        <AlertCircle size={18} /> {language==='ar'?'عذراً، لا يوجد توافر كافٍ في التواريخ المختارة.':'Sorry, selected dates are not available.'}
                      </div>
                    )}
                    {availabilityStatus === 'available' && (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl flex gap-2 text-emerald-400 text-sm shadow-inner">
                        <CheckCircle size={18} /> {language==='ar'?'الموعد متاح! يمكنك المضي قدماً في تأكيد طلبك.':'Schedule available! You may proceed with booking.'}
                      </div>
                    )}

                    {/* Promo Code */}
                    <div className="pt-6">
                      <label className="text-xs text-gray-500 flex items-center gap-2 mb-2"><Tag size={14} /> {t('bk_promo_label')}</label>
                      <div className="flex gap-2">
                        <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} className={`w-full bg-deepblack border border-gray-800 focus:border-gold-500 rounded-xl px-4 py-3 text-white outline-none transition-colors uppercase font-mono tracking-widest text-center`} placeholder={t('bk_promo_placeholder')} />
                        <button type="button" onClick={applyPromoCode} className="px-6 bg-gray-800 text-gold-400 rounded-xl font-bold hover:bg-gray-700 transition-colors text-sm">
                          {t('bk_apply')}
                        </button>
                      </div>
                      {discountAmount > 0 && <p className="text-xs text-emerald-400 mt-2">✨ {t('bk_promo_valid')}</p>}
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Sticky Footer Button */}
            {!bookingSuccess && (
              <div className="absolute bottom-0 left-0 w-full p-6 border-t border-gray-800 bg-charcoal/90 backdrop-blur-xl z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
                <button 
                  type="submit"
                  form="booking-form"
                  disabled={availabilityStatus !== 'available'}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                    availabilityStatus === 'available' 
                      ? 'bg-gold-gradient text-deepblack hover:scale-[1.01] shadow-[0_5px_20px_rgba(212,175,55,0.3)]' 
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-70'
                  }`}
                >
                  {availabilityStatus === 'available' ? t('bk_submit') : t('bk_fill_dates')}
                </button>
              </div>
            )}
          </div>

          {/* Locked Media Showcase (Right Side / Visuals) */}
          <div className="hidden md:flex w-full md:w-1/2 h-full relative bg-black flex-col justify-end">
            <img 
              src={car.imageUrl} 
              alt={car.modelName}
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
            {/* Dark elegant gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            
            <div className={`relative z-10 p-12 w-full ${language === 'ar' ? 'text-right border-r-4 pr-12' : 'text-left border-l-4 pl-12'} border-gold-500`}>
              <span className="inline-block px-3 py-1 bg-gold-500/20 text-gold-400 text-xs font-bold rounded-full mb-3 backdrop-blur-sm border border-gold-500/30">
                {type === 'car' ? (language === 'ar' ? 'مركبة مختارة' : 'Selected Vehicle') : (language === 'ar' ? 'خدمة حصرية' : 'Exclusive Service')}
              </span>
              <h3 className="text-4xl font-bold text-white mb-4 leading-tight">{car.modelName}</h3>
              
              <div className={`flex flex-col gap-1 items-start`}>
                <span className="text-gray-400 text-sm font-medium">{type === 'car' ? t('bk_car_price') : t('bk_srv_price')}</span>
                <div className={`flex items-end gap-3 flex-row`}>
                  {discountAmount > 0 && (
                    <p className="text-xl text-red-400/80 line-through decoration-red-500 decoration-2 font-mono">{car.dailyPrice}</p>
                  )}
                  <p className="text-4xl text-gold-500 font-bold font-mono tracking-wider"><span dir="ltr">{finalPrice}</span> <span className="text-base font-normal text-gold-400/80">SAR</span></p>
                </div>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
