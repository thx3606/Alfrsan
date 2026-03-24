"use client";

import { motion } from 'framer-motion';
import { UploadCloud, Image as ImageIcon, Video } from 'lucide-react';

export default function MediaHub() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white text-gold-gradient inline-block">مكتبة الوسائط</h1>
        <p className="text-gray-400 mt-1">رفع الصور بدقة 4K والفيديوهات الخلفية للسيارات</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-charcoal border border-gray-800 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center hover:border-gold-500/50 transition-colors cursor-pointer group">
          <div className="w-20 h-20 rounded-full bg-deepblack flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(212,175,55,0.1)]">
            <UploadCloud size={40} className="text-gold-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">رفع وسائط جديدة</h3>
          <p className="text-sm text-gray-500 max-w-xs mx-auto">اسحب وأفلت الصور أو الفيديوهات هنا، أو اضغط للاختيار من جهازك.</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-300">أحدث المرفوعات</h3>
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 bg-deepblack border border-gray-800 p-3 rounded-xl">
              <div className="w-16 h-16 bg-gray-900 rounded-lg flex items-center justify-center">
                {i === 1 ? <Video className="text-gold-600" /> : <ImageIcon className="text-gray-500" />}
              </div>
              <div>
                <p className="text-white text-sm font-bold">Phantom_4K_Exterior_{i}.jpg</p>
                <p className="text-gold-500 text-xs">4.2 MB</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
