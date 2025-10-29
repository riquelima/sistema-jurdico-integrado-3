import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { compraVendaImoveis } from '@/db/schema';
import { eq, like, and, or, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single record fetch by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const record = await db
        .select()
        .from(compraVendaImoveis)
        .where(eq(compraVendaImoveis.id, parseInt(id)))
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
    const status = searchParams.get('status');

    let query = db.select().from(compraVendaImoveis);

    // Build where conditions
    const conditions = [];

    if (search) {
      conditions.push(like(compraVendaImoveis.enderecoImovel, `%${search}%`));
    }

    if (status) {
      conditions.push(eq(compraVendaImoveis.status, status));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(compraVendaImoveis.createdAt))
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

    // Prepare insert data with defaults
    const insertData = {
      numeroMatricula: body.numeroMatricula ?? null,
      cadastroContribuinte: body.cadastroContribuinte ?? null,
      enderecoImovel: body.enderecoImovel ?? null,
      rgVendedores: body.rgVendedores ?? null,
      cpfVendedores: body.cpfVendedores ?? null,
      dataNascimentoVendedores: body.dataNascimentoVendedores ?? null,
      rnmComprador: body.rnmComprador ?? null,
      cpfComprador: body.cpfComprador ?? null,
      enderecoComprador: body.enderecoComprador ?? null,
      currentStep: body.currentStep ?? 0,
      status: body.status ?? 'Em Andamento',
      prazoSinal: body.prazoSinal ?? null,
      prazoEscritura: body.prazoEscritura ?? null,
      contractNotes: body.contractNotes ?? null,
      stepNotes: body.stepNotes ?? null,
      completedSteps: body.completedSteps ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newRecord = await db
      .insert(compraVendaImoveis)
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

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Check if record exists
    const existingRecord = await db
      .select()
      .from(compraVendaImoveis)
      .where(eq(compraVendaImoveis.id, parseInt(id)))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json(
        { error: 'Record not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    // Only include fields that are provided in the request
    if (body.numeroMatricula !== undefined) updateData.numeroMatricula = body.numeroMatricula;
    if (body.cadastroContribuinte !== undefined) updateData.cadastroContribuinte = body.cadastroContribuinte;
    if (body.enderecoImovel !== undefined) updateData.enderecoImovel = body.enderecoImovel;
    if (body.rgVendedores !== undefined) updateData.rgVendedores = body.rgVendedores;
    if (body.cpfVendedores !== undefined) updateData.cpfVendedores = body.cpfVendedores;
    if (body.dataNascimentoVendedores !== undefined) updateData.dataNascimentoVendedores = body.dataNascimentoVendedores;
    if (body.rnmComprador !== undefined) updateData.rnmComprador = body.rnmComprador;
    if (body.cpfComprador !== undefined) updateData.cpfComprador = body.cpfComprador;
    if (body.enderecoComprador !== undefined) updateData.enderecoComprador = body.enderecoComprador;
    if (body.currentStep !== undefined) updateData.currentStep = body.currentStep;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.prazoSinal !== undefined) updateData.prazoSinal = body.prazoSinal;
    if (body.prazoEscritura !== undefined) updateData.prazoEscritura = body.prazoEscritura;
    if (body.contractNotes !== undefined) updateData.contractNotes = body.contractNotes;
    if (body.stepNotes !== undefined) updateData.stepNotes = body.stepNotes;
    if (body.completedSteps !== undefined) updateData.completedSteps = body.completedSteps;

    const updated = await db
      .update(compraVendaImoveis)
      .set(updateData)
      .where(eq(compraVendaImoveis.id, parseInt(id)))
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

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if record exists
    const existingRecord = await db
      .select()
      .from(compraVendaImoveis)
      .where(eq(compraVendaImoveis.id, parseInt(id)))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json(
        { error: 'Record not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(compraVendaImoveis)
      .where(eq(compraVendaImoveis.id, parseInt(id)))
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