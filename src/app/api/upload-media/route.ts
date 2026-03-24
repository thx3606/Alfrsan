import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    
    if (!file) {
      return NextResponse.json({ success: false, error: 'لم يتم إرفاق ملف' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    // Ensure dir exists
    await mkdir(uploadDir, { recursive: true });

    // Sanitize filename to prevent issues
    const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '');
    const uniqueName = `${Date.now()}-${safeName || 'image.jpg'}`;
    const path = join(uploadDir, uniqueName);
    
    await writeFile(path, buffer);
    
    return NextResponse.json({ success: true, url: `/uploads/${uniqueName}` });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: 'حدث خطأ أثناء الرفع' }, { status: 500 });
  }
}
