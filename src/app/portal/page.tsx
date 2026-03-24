"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Lock, Calendar, Mail, CheckCircle, Shield } from 'lucide-react';
import Link from 'next/link';

export default function UnifiedPortal() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsError(false);

    // Unified Routing Logic
    if (phone === 'admin' && password === 'ASd@112233') {
      window.location.href = '/admin/dashboard'; // Master Admin Gateway route
      return;
    }
    
    // Customer Portal mock logic
    if (phone.startsWith('05') && password.length >= 6) {
      setIsLoggedIn(true);
    } else {
      setIsError(true);
    }
  };

  return (
    <div className="min-h-screen bg-deepblack pt-32 pb-24 border-t border-gold-800/20 px-6 relative">
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-gold-600/5 blur-[150px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <Link href="/" className="text-gray-500 hover:text-gold-500 block text-center mb-8 font-bold">&larr; العودة للرئيسية</Link>
        <AnimatePresence mode="wait">
          {!isLoggedIn ? (
            <motion.div 
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md mx-auto bg-charcoal border border-gold-800/40 p-10 rounded-3xl shadow-[0_0_50px_rgba(212,175,55,0.1)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gold-gradient" />
              
              <div className="text-center mb-10">
                <Shield className="mx-auto text-gold-500 mb-4" size={48} />
                <h1 className="text-2xl font-bold text-white mb-2">البوابة الموحدة للدخول</h1>
                <p className="text-gray-400 text-sm">أدخل رقم الجوال أو بيانات مدير النظام للدخول</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2 relative">
                  <label className="text-sm text-gray-400">اسم المستخدم أ ورقم الجوال</label>
                  <div className="relative">
                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                      required
                      type="text" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-deepblack border border-gray-800 focus:border-gold-500 rounded-lg pr-12 pl-4 py-3 text-white outline-none transition-colors direction-ltr text-left"
                      placeholder="admin أو 05xxxxxxxx"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="space-y-2 relative">
                  <label className="text-sm text-gray-400">كلمة المرور</label>
                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                      required
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-deepblack border border-gray-800 focus:border-gold-500 rounded-lg pr-12 pl-4 py-3 text-white outline-none transition-colors direction-ltr text-left"
                      placeholder="••••••••"
                      dir="ltr"
                    />
                  </div>
                </div>

                {isError && <p className="text-red-500 text-sm text-center">بيانات الدخول غير صحيحة.</p>}

                <button 
                  type="submit"
                  className="w-full mt-6 bg-gold-gradient text-deepblack py-4 rounded-xl font-bold hover:scale-[1.02] transition-transform duration-300 shadow-lg shadow-gold-500/20"
                >
                  تسجيل الدخول الآمن
                </button>
                <div className="text-center mt-4">
                  <span className="text-xs text-gray-600">إذا كنت مدير النظام، أدخل "admin" كـ اسم مستخدم</span>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="portal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center bg-charcoal border border-gray-800 p-6 rounded-2xl">
                <div>
                  <h1 className="text-2xl font-bold text-white">مرحباً بِكَ، عميلنا العزيز</h1>
                  <p className="text-gold-400 mt-1" dir="ltr">{phone}</p>
                </div>
                <button 
                  onClick={() => setIsLoggedIn(false)}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-bold"
                >
                  تسجيل الخروج
                </button>
              </div>

              <div className="bg-charcoal border border-gold-800/40 rounded-3xl p-8 relative overflow-hidden shadow-2xl shadow-black">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-bl-full pointer-events-none" />
                
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-gray-800 pb-4">
                  <Calendar className="text-gold-500" /> حجوزاتك الحالية (Active Bookings)
                </h2>

                <div className="bg-deepblack border border-gray-800 rounded-2xl p-6 relative">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-gray-900 rounded-xl overflow-hidden shrink-0">
                        <img src="https://images.unsplash.com/photo-1631269389201-901ed4fd0bd6?q=80&w=300&auto=format&fit=crop" alt="Car" className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-bold text-white">Mercedes-Maybach S</h3>
                        <p className="text-gray-500 text-sm">CF-89241 <span className="text-gold-500 text-xs">رقم المرجع</span></p>
                        <p className="text-gray-400 text-sm mt-3">من: <span className="text-white">01-04-2026</span></p>
                        <p className="text-gray-400 text-sm">إلى: <span className="text-white">05-04-2026</span></p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end justify-between border-t md:border-t-0 md:border-r border-gray-800 pt-4 md:pt-0 md:pr-6">
                      <span className="flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/20 font-bold mb-4 md:mb-0">
                        <CheckCircle size={14} /> حجز مؤكد
                      </span>
                      <div className="text-right">
                        <p className="text-gray-500 text-xs mb-1 uppercase tracking-wider">الإجمالي</p>
                        <p className="text-gold-400 font-bold text-2xl direction-ltr">4,200 SAR</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-800 flex items-center gap-3 text-sm text-gray-400 bg-gray-900/50 p-4 rounded-xl">
                    <Mail size={18} className="text-gold-500 shrink-0" />
                    تم إرسال رسالة التأكيد والفاتورة لبريدك الإلكتروني، ننتظر تشريفك لنا وتتمنى لك رحلة سعيدة.
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
