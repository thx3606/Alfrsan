"use client";

import { useState } from 'react';
import { CheckCircle, Clock } from 'lucide-react';

const MOCK_BOOKINGS = [
  { id: '1001', car: 'Rolls-Royce Phantom', customer: 'أحمد عبدالله', phone: '0501234567', startDate: '2026-04-01', endDate: '2026-04-05', status: 'CONFIRMED', price: '34,000 ر.س' },
  { id: '1002', car: 'Mercedes-Maybach S', customer: 'خالد الفهد', phone: '0559876543', startDate: '2026-04-10', endDate: 'مفتوح', status: 'PENDING', price: '4,200 ر.س / يوم' },
];

export default function BookingHistory() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white">سجل الحجوزات</h1>
        <p className="text-gray-400 mt-1">عرض وإدارة حجوزات العملاء والطلبات المعلقة</p>
      </div>

      <div className="bg-charcoal border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-deepblack border-b border-gray-800 text-gray-400 text-sm">
            <tr>
              <th className="p-4">رقم الحجز</th>
              <th className="p-4">العميل</th>
              <th className="p-4">رقم الجوال</th>
              <th className="p-4">السيارة</th>
              <th className="p-4">التاريخ</th>
              <th className="p-4">الإجمالي</th>
              <th className="p-4">الحالة</th>
              <th className="p-4">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_BOOKINGS.map((booking) => (
              <tr key={booking.id} className="border-b border-gray-800 hover:bg-white/5 transition-colors">
                <td className="p-4 font-bold text-white">#{booking.id}</td>
                <td className="p-4 text-gray-300">{booking.customer}</td>
                <td className="p-4 text-gray-300" dir="ltr">{booking.phone}</td>
                <td className="p-4 text-gold-400 font-bold">{booking.car}</td>
                <td className="p-4 text-gray-400 text-sm">
                  {booking.startDate} <br /> {booking.endDate}
                </td>
                <td className="p-4 text-white font-mono">{booking.price}</td>
                <td className="p-4">
                  {booking.status === 'CONFIRMED' ? (
                    <span className="flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full w-fit">
                      <CheckCircle size={14} /> مؤكد
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs bg-orange-500/10 text-orange-400 px-3 py-1 rounded-full w-fit">
                      <Clock size={14} /> مبدئي
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <button className="text-sm bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg transition-colors">
                    التفاصيل
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
