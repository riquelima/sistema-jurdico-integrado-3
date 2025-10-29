import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { perdaNacionalidade } from '@/db/schema';
import { eq, like, and, or, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single record fetch
    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const record = await db
        .select()
        .from(perdaNacionalidade)
        .where(eq(perdaNacionalidade.id, parseInt(id)))
        .limit(1);

      if (record.length === 0) {
        return NextResponse.json(
          { error: 'Record not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(record[0], { status: 200 });
    }

    // List with pagination, search, and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const statusFilter = searchParams.get('status');

    let query = db.select().from(perdaNacionalidade);

    // Build where conditions
    const conditions = [];

    if (search) {
      conditions.push(like(perdaNacionalidade.clientName, `%${search}%`));
    }

    if (statusFilter) {
      conditions.push(eq(perdaNacionalidade.status, statusFilter));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(perdaNacionalidade.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.clientName || body.clientName.trim() === '') {
      return NextResponse.json(
        { error: 'Client name is required', code: 'MISSING_CLIENT_NAME' },
        { status: 400 }
      );
    }

    // Sanitize and prepare data
    const now = new Date().toISOString();
    const insertData = {
      clientName: body.clientName.trim(),
      rnmMae: body.rnmMae?.trim() || null,
      rnmPai: body.rnmPai?.trim() || null,
      cpfMae: body.cpfMae?.trim() || null,
      cpfPai: body.cpfPai?.trim() || null,
      certidaoNascimento: body.certidaoNascimento?.trim() || null,
      comprovanteEndereco: body.comprovanteEndereco?.trim() || null,
      passaportes: body.passaportes?.trim() || null,
      documentoChines: body.documentoChines?.trim() || null,
      traducaoJuramentada: body.traducaoJuramentada?.trim() || null,
      currentStep: body.currentStep ?? 0,
      status: body.status?.trim() || 'Em Andamento',
      createdAt: now,
      updatedAt: now,
    };

    const newRecord = await db
      .insert(perdaNacionalidade)
      .values(insertData)
      .returning();

    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if record exists
    const existing = await db
      .select()
      .from(perdaNacionalidade)
      .where(eq(perdaNacionalidade.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Record not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Prepare update data (only include provided fields)
    const updateData: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    if (body.clientName !== undefined) {
      if (body.clientName.trim() === '') {
        return NextResponse.json(
          { error: 'Client name cannot be empty', code: 'INVALID_CLIENT_NAME' },
          { status: 400 }
        );
      }
      updateData.clientName = body.clientName.trim();
    }

    if (body.rnmMae !== undefined) updateData.rnmMae = body.rnmMae?.trim() || null;
    if (body.rnmPai !== undefined) updateData.rnmPai = body.rnmPai?.trim() || null;
    if (body.cpfMae !== undefined) updateData.cpfMae = body.cpfMae?.trim() || null;
    if (body.cpfPai !== undefined) updateData.cpfPai = body.cpfPai?.trim() || null;
    if (body.certidaoNascimento !== undefined) updateData.certidaoNascimento = body.certidaoNascimento?.trim() || null;
    if (body.comprovanteEndereco !== undefined) updateData.comprovanteEndereco = body.comprovanteEndereco?.trim() || null;
    if (body.passaportes !== undefined) updateData.passaportes = body.passaportes?.trim() || null;
    if (body.documentoChines !== undefined) updateData.documentoChines = body.documentoChines?.trim() || null;
    if (body.traducaoJuramentada !== undefined) updateData.traducaoJuramentada = body.traducaoJuramentada?.trim() || null;
    if (body.currentStep !== undefined) updateData.currentStep = body.currentStep;
    if (body.status !== undefined) updateData.status = body.status.trim();

    const updated = await db
      .update(perdaNacionalidade)
      .set(updateData)
      .where(eq(perdaNacionalidade.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if record exists
    const existing = await db
      .select()
      .from(perdaNacionalidade)
      .where(eq(perdaNacionalidade.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Record not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(perdaNacionalidade)
      .where(eq(perdaNacionalidade.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Record deleted successfully',
        record: deleted[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}