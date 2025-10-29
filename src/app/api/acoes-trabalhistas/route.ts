import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { acoesTrabalhistas } from '@/db/schema';
import { eq, like, and, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single record by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const record = await db.select()
        .from(acoesTrabalhistas)
        .where(eq(acoesTrabalhistas.id, parseInt(id)))
        .limit(1);

      if (record.length === 0) {
        return NextResponse.json({ 
          error: 'Record not found',
          code: 'NOT_FOUND' 
        }, { status: 404 });
      }

      return NextResponse.json(record[0], { status: 200 });
    }

    // List with pagination, search, and filters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    let query = db.select().from(acoesTrabalhistas);

    // Build where conditions
    const conditions = [];

    if (search) {
      conditions.push(like(acoesTrabalhistas.clientName, `%${search}%`));
    }

    if (status) {
      conditions.push(eq(acoesTrabalhistas.status, status));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(acoesTrabalhistas.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientName, status } = body;

    // Validate required fields
    if (!clientName || clientName.trim() === '') {
      return NextResponse.json({ 
        error: "Client name is required and cannot be empty",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    // Prepare insert data
    const insertData = {
      clientName: clientName.trim(),
      status: status || 'Em Andamento',
      createdAt: new Date().toISOString(),
    };

    const newRecord = await db.insert(acoesTrabalhistas)
      .values(insertData)
      .returning();

    return NextResponse.json(newRecord[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const body = await request.json();
    const { clientName, status } = body;

    // Check if record exists
    const existing = await db.select()
      .from(acoesTrabalhistas)
      .where(eq(acoesTrabalhistas.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Record not found',
        code: 'NOT_FOUND' 
      }, { status: 404 });
    }

    // Prepare update data
    const updateData: Record<string, any> = {};

    if (clientName !== undefined) {
      if (clientName.trim() === '') {
        return NextResponse.json({ 
          error: "Client name cannot be empty",
          code: "INVALID_CLIENT_NAME" 
        }, { status: 400 });
      }
      updateData.clientName = clientName.trim();
    }

    if (status !== undefined) {
      updateData.status = status;
    }

    // Perform update
    const updated = await db.update(acoesTrabalhistas)
      .set(updateData)
      .where(eq(acoesTrabalhistas.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if record exists
    const existing = await db.select()
      .from(acoesTrabalhistas)
      .where(eq(acoesTrabalhistas.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Record not found',
        code: 'NOT_FOUND' 
      }, { status: 404 });
    }

    // Delete record
    const deleted = await db.delete(acoesTrabalhistas)
      .where(eq(acoesTrabalhistas.id, parseInt(id)))
      .returning();

    return NextResponse.json({ 
      message: 'Record deleted successfully',
      record: deleted[0]
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}