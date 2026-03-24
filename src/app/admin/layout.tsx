"use client";

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (isLoginPage) {
    return <div className="min-h-screen bg-deepblack flex items-center justify-center">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col md:flex-row rtl">
      {/* Mobile Top App Bar */}
      <div className="md:hidden flex items-center justify-between bg-deepblack border-b border-gold-800/30 px-6 py-4 sticky top-0 z-30 shadow-md">
         <img src="/logo.png" alt="Cavalry Fleet" className="h-10 w-auto object-contain mix-blend-screen drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]" />
         <button 
           onClick={() => setIsSidebarOpen(true)}
           className="p-2 text-gold-500 bg-gold-500/10 rounded-lg border border-gold-500/30 hover:bg-gold-500/20 transition-colors"
         >
           <Menu size={24} />
         </button>
      </div>

      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 w-full">
        {children}
      </main>
    </div>
  );
}
