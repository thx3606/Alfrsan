"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, User } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'ASd@112233') {
      // In a real app, we'd set an HTTP-only cookie here.
      router.push('/admin/dashboard');
    } else {
      setError('بيانات الدخول غير صحيحة');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md bg-charcoal border border-gold-800/40 p-8 rounded-2xl shadow-[0_0_50px_rgba(212,175,55,0.1)] relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gold-gradient" />
      
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">تسجيل الدخول للإدارة</h1>
        <p className="text-gold-500 text-sm">Cavalry Fleet Master Control</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-2 relative">
          <label className="text-sm text-gray-400">اسم المستخدم</label>
          <div className="relative">
            <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-deepblack border border-gray-800 focus:border-gold-500 rounded-lg pr-12 pl-4 py-3 text-white outline-none transition-colors direction-ltr text-left"
              placeholder="Username"
              dir="ltr"
            />
          </div>
        </div>

        <div className="space-y-2 relative">
          <label className="text-sm text-gray-400">كلمة المرور</label>
          <div className="relative">
            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-deepblack border border-gray-800 focus:border-gold-500 rounded-lg pr-12 pl-4 py-3 text-white outline-none transition-colors direction-ltr text-left"
              placeholder="••••••••"
              dir="ltr"
            />
          </div>
        </div>

        {error && <p className="text-red-400 text-sm text-center font-medium">{error}</p>}

        <button 
          type="submit"
          className="w-full mt-4 bg-gold-gradient text-deepblack py-3 rounded-lg font-bold hover:scale-[1.02] transition-transform duration-300"
        >
          دخول
        </button>
      </form>
    </motion.div>
  );
}
