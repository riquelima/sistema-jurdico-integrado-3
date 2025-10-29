import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { alerts } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const alertFor = searchParams.get('alertFor');
    const moduleType = searchParams.get('moduleType');
    const isReadParam = searchParams.get('isRead');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Single alert by ID
    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const alert = await db.select()
        .from(alerts)
        .where(eq(alerts.id, parseInt(id)))
        .limit(1);

      if (alert.length === 0) {
        return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
      }

      return NextResponse.json(alert[0], { status: 200 });
    }

    // List alerts with filtering
    let query = db.select().from(alerts);
    const conditions = [];

    if (alertFor) {
      conditions.push(eq(alerts.alertFor, alertFor));
    }

    if (moduleType) {
      conditions.push(eq(alerts.moduleType, moduleType));
    }

    if (isReadParam !== null) {
      const isReadValue = isReadParam === 'true';
      conditions.push(eq(alerts.isRead, isReadValue));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(alerts.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error.message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { moduleType, recordId, alertFor, message, isRead } = body;

    // Validate required fields
    if (!moduleType || moduleType.trim() === '') {
      return NextResponse.json({ 
        error: "moduleType is required",
        code: "MISSING_MODULE_TYPE" 
      }, { status: 400 });
    }

    if (!recordId) {
      return NextResponse.json({ 
        error: "recordId is required",
        code: "MISSING_RECORD_ID" 
      }, { status: 400 });
    }

    if (isNaN(parseInt(recordId.toString()))) {
      return NextResponse.json({ 
        error: "recordId must be a valid integer",
        code: "INVALID_RECORD_ID" 
      }, { status: 400 });
    }

    if (!alertFor || alertFor.trim() === '') {
      return NextResponse.json({ 
        error: "alertFor is required",
        code: "MISSING_ALERT_FOR" 
      }, { status: 400 });
    }

    if (!message || message.trim() === '') {
      return NextResponse.json({ 
        error: "message is required",
        code: "MISSING_MESSAGE" 
      }, { status: 400 });
    }

    // Create new alert
    const newAlert = await db.insert(alerts)
      .values({
        moduleType: moduleType.trim(),
        recordId: parseInt(recordId.toString()),
        alertFor: alertFor.trim(),
        message: message.trim(),
        isRead: isRead ?? false,
        createdAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newAlert[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error.message 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

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
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error.message 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if alert exists
    const existingAlert = await db.select()
      .from(alerts)
      .where(eq(alerts.id, parseInt(id)))
      .limit(1);

    if (existingAlert.length === 0) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    // Delete alert
    const deleted = await db.delete(alerts)
      .where(eq(alerts.id, parseInt(id)))
      .returning();

    return NextResponse.json({ 
      message: 'Alert deleted successfully',
      alert: deleted[0]
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error.message 
    }, { status: 500 });
  }
}