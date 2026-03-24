import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const cars = await prisma.car.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(cars);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { modelName, dailyPrice, imageUrl, galleryImages, specs, quantity } = body;
    
    const newCar = await prisma.car.create({
      data: {
        modelName,
        dailyPrice: parseFloat(dailyPrice),
        imageUrl,
        galleryImages: JSON.stringify(galleryImages || []),
        specs: JSON.stringify(specs || {}),
        quantity: parseInt(quantity) || 1
      }
    });
    
    return NextResponse.json(newCar);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
