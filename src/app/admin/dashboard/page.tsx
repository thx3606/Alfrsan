"use client";

import { motion } from 'framer-motion';
import { TrendingUp, Users, Calendar, AlertCircle } from 'lucide-react';

const STATS = [
  { label: 'إجمالي الإيرادات (الشهر)', value: '١٣٥,٠٠٠ ر.س', change: '+24%', icon: TrendingUp },
  { label: 'الحجوزات النشطة', value: '١٢ سيارة', change: '+2', icon: Calendar },
  { label: 'العملاء الجدد', value: '٤٣ عميل', change: '+15%', icon: Users },
  { label: 'تنبيهات الصيانة', value: '٢', change: '-1', icon: AlertCircle, color: 'text-red-400' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">اللوحة الرئيسية</h1>
          <p className="text-gray-400 mt-1">نظرة عامة على أداء أسطول الفرسان</p>
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label} 
            className="bg-charcoal border border-gray-800 p-6 rounded-2xl flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-deepblack border border-gray-800 ${stat.color || 'text-gold-500'}`}>
                <stat.icon size={24} />
              </div>
              <span className="text-emerald-400 text-sm font-bold bg-emerald-400/10 px-2 py-1 rounded-md direction-ltr">
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">{stat.label}</h3>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* AI Analytics & Reporting Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-charcoal border border-gray-800 p-6 rounded-2xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">الذكاء الاصطناعي: التوقعات</h2>
            <span className="text-xs bg-gold-500/10 text-gold-500 px-3 py-1 rounded-full border border-gold-500/20">AI Engine Active</span>
          </div>
          
          <div className="space-y-6">
            <div className="bg-deepblack p-5 rounded-xl border border-gray-800">
              <h3 className="text-gold-400 font-medium mb-2">⭐ السيارة الأعلى ربحية (الشهر القادم)</h3>
              <p className="text-sm text-gray-300 leading-relaxed mb-4">
                تتوقع الخوارزميات زيادة بنسبة ٣٠٪ في الطلب على <strong>Range Rover SV</strong> خلال الأربعة أسابيع القادمة بسبب دخول موسم المناسبات وكبار الشخصيات.
              </p>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-gold-gradient h-2 rounded-full w-[85%]"></div>
              </div>
              <p className="text-right text-xs text-gray-500 mt-2">معدل الثقة: ٨٥٪</p>
            </div>

            <div className="bg-deepblack p-5 rounded-xl border border-gray-800">
              <h3 className="text-blue-400 font-medium mb-2">📊 ذروة أوقات الحجز</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                معظم طلبات الحجز المكتملة تتم يوم الأربعاء بين <span className="text-white font-bold">٤:٠٠ م - ٨:٠٠ م</span>. ينصح بتفعيل إعلانات الترويج في هذه الأوقات.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-charcoal border border-gray-800 p-6 rounded-2xl"
        >
          <h2 className="text-xl font-bold text-white mb-6">النشاط الأخير</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4 items-start pb-4 border-b border-gray-800 last:border-0 last:pb-0">
                <div className="w-2 h-2 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-200">طلب حجز جديد: Rolls Royce</p>
                  <p className="text-xs text-gray-500 mt-1">منذ {i * 15} دقيقة</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
