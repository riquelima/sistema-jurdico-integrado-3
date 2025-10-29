import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { alerts } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const body = await request.json();
    const { isRead, message } = body;

    // Check if alert exists
    const existingAlert = await db.select()
      .from(alerts)
      .where(eq(alerts.id, parseInt(id)))
      .limit(1);

    if (existingAlert.length === 0) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    // Build update object with only provided fields
    const updateData: any = {};

    if (isRead !== undefined) {
      updateData.isRead = isRead;
    }

    if (message !== undefined && message.trim() !== '') {
      updateData.message = message.trim();
    }

    // Update alert
    const updated = await db.update(alerts)
      .set(updateData)
      .where(eq(alerts.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error.message 
    }, { status: 500 });
  }
}
