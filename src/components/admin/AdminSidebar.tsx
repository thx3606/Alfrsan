"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Car, Image as ImageIcon, Tag, Settings, BarChart3, LogOut, CalendarDays, X } from 'lucide-react';

const MENU_ITEMS = [
  { name: 'اللوحة الرئيسية', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'سجل الحجوزات', href: '/admin/bookings', icon: CalendarDays },
  { name: 'إدارة الأسطول', href: '/admin/cars', icon: Car },
  { name: 'مكتبة الوسائط', href: '/admin/media', icon: ImageIcon },
  { name: 'كوبونات الخصم', href: '/admin/promotions', icon: Tag },
  { name: 'الذكاء الاصطناعي', href: '/admin/dashboard', icon: BarChart3 }, // Pointed to Dashboard where AI is
  { name: 'إعدادات الموقع', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar({ isOpen, onClose }: { isOpen?: boolean, onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 right-0 z-50 w-64 bg-deepblack border-l border-gold-800/30 flex flex-col pt-8 pb-4 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 shadow-[0_0_50px_rgba(0,0,0,0.5)] md:shadow-none min-h-[100dvh] overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Mobile Close Button */}
        <button onClick={onClose} className="md:hidden absolute top-4 left-4 p-2 text-gray-400 hover:text-gold-500 transition-colors">
          <X size={24} />
        </button>

        <div className="px-6 mb-12 flex flex-col items-center mt-4 md:mt-0">
          <img src="/logo.png" alt="Cavalry Fleet" className="h-20 md:h-24 w-auto object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.4)] mb-4 mix-blend-screen" />
          <p className="text-xs text-gray-500 tracking-widest border-t border-gold-800/30 pt-3 w-full text-center">MASTER CONTROL</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={onClose} // Auto-close on mobile selection
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-gold-500/10 text-gold-500 border border-gold-500/20' 
                    : 'text-gray-400 hover:text-white hover:bg-charcoal'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 mt-8">
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-red-400 hover:bg-red-400/10 transition-colors">
            <LogOut size={20} />
            <span className="font-medium text-sm">تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </>
  );
}
