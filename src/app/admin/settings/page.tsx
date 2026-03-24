"use client";

import { useState, useEffect } from 'react';
import { UploadCloud, Save, Loader } from 'lucide-react';

const SERVICE_NAMES = {
  srv_chauffeur: 'سائق خاص (Chauffeur)',
  srv_airport: 'نقل المطار VIP',
  srv_security: 'مرافقة أمنية للوفود',
  srv_crowd: 'إدارة الحشود وحرس شخصي'
};

export default function SettingsAdmin() {
  const [isUploading, setIsUploading] = useState(false);
  
  // Pricing & Image State
  const [prices, setPrices] = useState({
    srv_chauffeur: 1500,
    srv_airport: 800,
    srv_security: 3500,
    srv_crowd: 2500
  });

  const [serviceImages, setServiceImages] = useState<Record<string, string>>({});
  const [featureImage, setFeatureImage] = useState<string | null>(null);
  const [isSavingPrices, setIsSavingPrices] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if(data && data.servicePrices) setPrices(data.servicePrices);
        if(data && data.serviceImages) setServiceImages(data.serviceImages);
        if(data && data.featureImage) setFeatureImage(data.featureImage);
      })
      .catch(console.error);
  }, []);

  const savePrices = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPrices(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'servicePrices', value: prices })
      });
      if (res.ok) {
        alert('تم حفظ وتحديث الأسعار بنجاح!');
      }
    } catch (error) {
      alert('حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setIsSavingPrices(false);
    }
  };

  const handleFileUpload = async (file: File, endpoint: string) => {
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append(endpoint === '/api/upload-video' ? 'video' : 'logo', file);
    
    try {
      const res = await fetch(endpoint, { method: 'POST', body: formData });
      if (res.ok) {
        alert("تم الرفع بنجاح!");
        setTimeout(() => window.location.reload(), 1500);
      } else alert("خطأ أثناء الرفع");
    } catch(err) {
      alert("تعذر الاتصال بالخادم");
    } finally {
      setIsUploading(false);
    }
  };

  const handleServiceImageUpload = async (key: string, file?: File) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('/api/upload-media', { method: 'POST', body: formData });
      const data = await res.json();
      if(data.url) {
        const updatedImages = { ...serviceImages, [key]: data.url };
        setServiceImages(updatedImages);
        await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'serviceImages', value: updatedImages })
        });
        alert('تم تحديث صورة الخدمة بنجاح!');
      }
    } catch(e) {
      alert('خطأ في رفع الصورة');
    }
  };

  const handleFeatureImageUpload = async (file?: File) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('/api/upload-media', { method: 'POST', body: formData });
      const data = await res.json();
      if(data.url) {
        setFeatureImage(data.url);
        await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'featureImage', value: data.url })
        });
        alert('تم تحديث صورة قسم المميزات بنجاح!');
      }
    } catch(e) {
      alert('خطأ في رفع الصورة');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      <div className="flex justify-between items-center bg-charcoal border border-gray-800 p-6 rounded-2xl">
        <div>
          <h1 className="text-3xl font-bold text-white">إعدادات النظام (Settings)</h1>
          <p className="text-gray-400 mt-1">إدارة الهوية البصرية، وتسعير وصور خدمات النخبة المخصصة.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Elite Services Configuration */}
        <div className="space-y-8">
          <div className="bg-charcoal border border-gray-800 rounded-2xl p-8 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-2">تسعير خدمات النخبة (VIP PRICES)</h3>
            <p className="text-sm text-gray-500 mb-6">قم بتعديل أسعار الخدمات. ستظهر فوراً للمستخدمين في النظام.</p>
            
            <form onSubmit={savePrices} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-gray-400 text-xs font-bold">سائق خاص (يومي)</label>
                  <input type="number" required value={prices.srv_chauffeur} onChange={e => setPrices({...prices, srv_chauffeur: parseInt(e.target.value) || 0})} className="w-full bg-deepblack border border-gray-800 focus:border-gold-500 rounded-xl px-4 py-3 text-white outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-400 text-xs font-bold">نقل المطار (الرحلة)</label>
                  <input type="number" required value={prices.srv_airport} onChange={e => setPrices({...prices, srv_airport: parseInt(e.target.value) || 0})} className="w-full bg-deepblack border border-gray-800 focus:border-gold-500 rounded-xl px-4 py-3 text-white outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-400 text-xs font-bold">مرافقة أمنية (يومي)</label>
                  <input type="number" required value={prices.srv_security} onChange={e => setPrices({...prices, srv_security: parseInt(e.target.value) || 0})} className="w-full bg-deepblack border border-gray-800 focus:border-gold-500 rounded-xl px-4 py-3 text-white outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-400 text-xs font-bold">إدارة حشود (يومي)</label>
                  <input type="number" required value={prices.srv_crowd} onChange={e => setPrices({...prices, srv_crowd: parseInt(e.target.value) || 0})} className="w-full bg-deepblack border border-gray-800 focus:border-gold-500 rounded-xl px-4 py-3 text-white outline-none" />
                </div>
              </div>

              <button 
                type="submit" disabled={isSavingPrices}
                className="w-full mt-4 bg-gold-gradient text-deepblack py-3 rounded-xl font-bold flex justify-center items-center gap-2 hover:scale-[1.01] transition-transform disabled:opacity-50"
              >
                {isSavingPrices ? <><Loader className="animate-spin" size={20} /> جاري الحفظ...</> : <><Save size={20} /> اعتماد الأسعار</>}
              </button>
            </form>
          </div>

          <div className="bg-charcoal border border-gray-800 rounded-2xl p-8 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-2">المرفقات البصرية للخدمات (VIP IMAGES)</h3>
            <p className="text-sm text-gray-500 mb-6">هذه الصور هي التي تظهر للعميل في شاشة حجز الخدمة.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(SERVICE_NAMES).map(([key, name]) => (
                <div key={key} className="bg-deepblack border border-gray-800 p-4 rounded-xl flex flex-col justify-between">
                  <p className="text-gold-400 font-bold mb-3 text-xs">{name}</p>
                  {serviceImages[key] && (
                    <img src={serviceImages[key]} alt={name} className="w-full h-24 object-cover rounded-lg mb-4 border border-gray-700" />
                  )}
                  <label className="flex items-center justify-center py-2 border border-dashed border-gray-600 hover:border-gold-500 transition-colors rounded-lg cursor-pointer group mt-auto text-xs">
                    <span className="text-gray-400 group-hover:text-gold-400 font-bold">رفع صورة جديدة</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleServiceImageUpload(key, e.target.files?.[0])} />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Global Media Upload Modules */}
        <div className="space-y-8">
          <div className="bg-charcoal border border-gray-800 rounded-2xl p-8 shadow-xl">
             <h3 className="text-xl font-bold text-white mb-2">تغيير صورة قسم المميزات (Features)</h3>
             <p className="text-sm text-gray-500 mb-6">استبدل صورة السيارة في قسم "لماذا تختار أسطول الفرسان".</p>
             {featureImage && <img src={featureImage} className="w-full h-40 object-cover rounded-xl mb-4 border border-gray-700" alt="Features Image" />}
             <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-700 hover:border-gold-500 transition-colors rounded-2xl cursor-pointer bg-deepblack group">
                <UploadCloud size={40} className="mb-2 text-gray-600 group-hover:text-gold-500" />
                <span className="text-gray-400 font-bold mb-1">رفع صورة جديدة</span>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFeatureImageUpload(e.target.files?.[0])} />
             </label>
          </div>

          <div className="bg-charcoal border border-gray-800 rounded-2xl p-8 shadow-xl">
             <h3 className="text-xl font-bold text-white mb-2">تغيير الشعار الرسمي (Logo)</h3>
             <p className="text-sm text-gray-500 mb-6">ارفع ملف يحمل اسم الشركة ليتحدث تلقائياً في كافة أنحاء الموقع. (يفضل أن يكون ذو خلفية شفافة).</p>
             <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-700 hover:border-gold-500 transition-colors rounded-2xl cursor-pointer bg-deepblack group">
                <UploadCloud size={40} className="mb-2 text-gray-600 group-hover:text-gold-500" />
                <span className="text-gray-400 font-bold mb-1">تحديث الشعار (PNG, JPG)</span>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e.target.files?.[0] as File, '/api/upload-logo')} />
             </label>
             {isUploading && <p className="text-gold-500 text-sm font-bold text-center mt-4">جاري الرفع...</p>}
          </div>

          <div className="bg-charcoal border border-gray-800 rounded-2xl p-8 shadow-xl">
             <h3 className="text-xl font-bold text-white mb-2">فيديو الواجهة الرئيسية (Hero Video)</h3>
             <p className="text-sm text-gray-500 mb-6">ارفع مقطع MP4 ليظهر كخلفية سينمائية ضخمة خلف الموقع. يتم دمج المقطع تلقائياً تحت طبقات فخمة.</p>
             <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-700 hover:border-gold-500 transition-colors rounded-2xl cursor-pointer bg-deepblack group relative overflow-hidden">
                <UploadCloud size={40} className="mb-2 text-gray-600 group-hover:text-gold-500" />
                <span className="text-gray-400 font-bold mb-1">استبدال خلفية الموقع الكاملة (MP4)</span>
                <input type="file" className="hidden" accept="video/mp4" onChange={(e) => handleFileUpload(e.target.files?.[0] as File, '/api/upload-video')} />
             </label>
             {isUploading && <p className="text-gold-500 text-sm font-bold text-center mt-4">جاري الرفع...</p>}
          </div>
        </div>

      </div>

    </div>
  );
}
