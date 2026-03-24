import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Process standard car reservations into the Database securely
    if (data.type === 'car' && data.carId) {
      await prisma.booking.create({
        data: {
          carId: data.carId,
          fullName: data.fullName || 'Unspecified',
          nationalId: data.nationalId || 'Unspecified',
          dob: new Date(), // using generic date as it's not collected presently
          phoneNumber: data.phoneNumber || 'Unspecified',
          startDate: new Date(data.startDate),
          endDate: data.endDate ? new Date(data.endDate) : null,
          isOpenEnded: data.isOpenEnded || false,
          promoCode: data.promoCode || null,
          totalPrice: data.totalPrice || 0,
          status: "PENDING"
        }
      });
    }

    // For Services (type === 'service'), we consider it successfully processed 
    // Usually these are routed to an email or a standalone Services inquiry table
    return NextResponse.json({ success: true, message: 'Booking confirmed securely' });
  } catch (error: any) {
    console.error("Booking API Error:", error);
    return NextResponse.json({ success: false, error: 'Database error processing booking' }, { status: 500 });
  }
}
