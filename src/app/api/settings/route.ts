import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findMany();
    // Convert to easy-to-use map: { "servicePrices": { ... } }
    const settingsMap = settings.reduce((acc, curr) => {
      try {
        acc[curr.key] = JSON.parse(curr.value);
      } catch {
        acc[curr.key] = curr.value;
      }
      return acc;
    }, {} as Record<string, any>);
    
    return NextResponse.json(settingsMap);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { key, value } = body;
    
    if (!key) return NextResponse.json({ error: 'Key required' }, { status: 400 });

    const strValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
    
    const setting = await prisma.siteSettings.upsert({
      where: { key },
      update: { value: strValue },
      create: { key, value: strValue }
    });
    
    return NextResponse.json({ success: true, setting });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
