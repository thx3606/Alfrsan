"use client";

import { Info, Plus } from 'lucide-react';

export default function Promotions() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">محرك الخصومات والكوبونات</h1>
          <p className="text-gray-400 mt-1">توليد وإدارة أكواد الخصم وتتبع الاستخدام</p>
        </div>
        <button className="bg-gold-gradient text-deepblack px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-[0_0_15px_rgba(212,175,55,0.4)]">
          <Plus size={20} /> توليد كود جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-charcoal border border-gray-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gold-500/10 rounded-bl-[100px]" />
          <h3 className="text-2xl font-bold text-white mb-2 font-mono">VIP2026</h3>
          <p className="text-gold-400 font-bold mb-4">خصم 20%</p>
          <div className="flex justify-between text-sm text-gray-500">
            <span>الاستخدام: 45 / 100</span>
            <span className="text-emerald-400">نشط</span>
          </div>
        </div>

        <div className="bg-charcoal border border-gray-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gray-500/10 rounded-bl-[100px]" />
          <h3 className="text-2xl font-bold text-white mb-2 font-mono">WINTER500</h3>
          <p className="text-gray-300 font-bold mb-4">خصم 500 ريال</p>
          <div className="flex justify-between text-sm text-gray-500">
            <span>الاستخدام: 120 / غير محدود</span>
            <span className="text-red-400">منتهي</span>
          </div>
        </div>
      </div>

      <div className="bg-deepblack/50 border border-gold-800/30 p-4 rounded-xl flex items-start gap-3 mt-8">
        <Info className="text-gold-500 shrink-0" />
        <p className="text-sm text-gray-400 leading-relaxed text-right">
          محرك الخصومات يحسب الخصم تلقائياً عند الدفع. إذا كان الخصم نسبة مئوية، سيتم اقتطاعه من الإجمالي. إذا كان بمبلغ ثابت سيتم إنقاص المبلغ. تأكد من تحديد الحد الأقصى للاستخدام.
        </p>
      </div>
    </div>
  );
}
