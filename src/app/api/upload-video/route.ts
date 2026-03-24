import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('video') as unknown as File;
    
    if (!file) {
      return NextResponse.json({ success: false, error: 'لم يتم إرفاق أي ملف فيديو' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Save rigidly to public/hero-bg.mp4 so the frontend can statically consume it
    const path = join(process.cwd(), 'public', 'hero-bg.mp4');
    
    await writeFile(path, buffer);
    
    return NextResponse.json({ success: true, message: 'تم حفظ فيديو الخلفية بنجاح' });
  } catch (error) {
    console.error('Error uploading video:', error);
    return NextResponse.json({ success: false, error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}
