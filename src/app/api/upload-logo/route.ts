import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('logo') as unknown as File;
    
    if (!file) {
      return NextResponse.json({ success: false, error: 'لم يتم إرفاق أي ملف' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Path to public/logo.png
    const path = join(process.cwd(), 'public', 'logo.png');
    
    await writeFile(path, buffer);
    
    return NextResponse.json({ success: true, message: 'تم حفظ الشعار بنجاح' });
  } catch (error) {
    console.error('Error uploading logo:', error);
    return NextResponse.json({ success: false, error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}
