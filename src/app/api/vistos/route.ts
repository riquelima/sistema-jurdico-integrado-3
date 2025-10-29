import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { vistos } from '@/db/schema';
import { eq, like, and, or, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single record fetch by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const record = await db.select()
        .from(vistos)
        .where(eq(vistos.id, parseInt(id)))
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
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    let query = db.select().from(vistos);

    // Build WHERE conditions
    const conditions = [];

    if (search) {
      conditions.push(like(vistos.clientName, `%${search}%`));
    }

    if (type) {
      conditions.push(eq(vistos.type, type));
    }

    if (status) {
      conditions.push(eq(vistos.status, status));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(vistos.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.clientName || body.clientName.trim() === '') {
      return NextResponse.json({ 
        error: "clientName is required and cannot be empty",
        code: "MISSING_CLIENT_NAME" 
      }, { status: 400 });
    }

    if (!body.type || body.type.trim() === '') {
      return NextResponse.json({ 
        error: "type is required and cannot be empty",
        code: "MISSING_TYPE" 
      }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedData = {
      clientName: body.clientName.trim(),
      type: body.type.trim(),
      cpf: body.cpf?.trim() || null,
      rnm: body.rnm?.trim() || null,
      passaporte: body.passaporte?.trim() || null,
      comprovanteEndereco: body.comprovanteEndereco?.trim() || null,
      certidaoNascimentoFilhos: body.certidaoNascimentoFilhos?.trim() || null,
      cartaoCnpj: body.cartaoCnpj?.trim() || null,
      contratoEmpresa: body.contratoEmpresa?.trim() || null,
      escrituraImoveis: body.escrituraImoveis?.trim() || null,
      reservasPassagens: body.reservasPassagens?.trim() || null,
      reservasHotel: body.reservasHotel?.trim() || null,
      seguroViagem: body.seguroViagem?.trim() || null,
      roteiroViagem: body.roteiroViagem?.trim() || null,
      taxa: body.taxa?.trim() || null,
      status: body.status?.trim() || 'Em Andamento',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newRecord = await db.insert(vistos)
      .values(sanitizedData)
      .returning();

    return NextResponse.json(newRecord[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
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

    // Check if record exists
    const existing = await db.select()
      .from(vistos)
      .where(eq(vistos.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Record not found',
        code: 'NOT_FOUND' 
      }, { status: 404 });
    }

    const body = await request.json();

    // Build update object with sanitized data
    const updateData: any = {
      updatedAt: new Date().toISOString()
    };

    if (body.clientName !== undefined) {
      updateData.clientName = body.clientName.trim();
    }

    if (body.type !== undefined) {
      updateData.type = body.type.trim();
    }

    if (body.cpf !== undefined) {
      updateData.cpf = body.cpf?.trim() || null;
    }

    if (body.rnm !== undefined) {
      updateData.rnm = body.rnm?.trim() || null;
    }

    if (body.passaporte !== undefined) {
      updateData.passaporte = body.passaporte?.trim() || null;
    }

    if (body.comprovanteEndereco !== undefined) {
      updateData.comprovanteEndereco = body.comprovanteEndereco?.trim() || null;
    }

    if (body.certidaoNascimentoFilhos !== undefined) {
      updateData.certidaoNascimentoFilhos = body.certidaoNascimentoFilhos?.trim() || null;
    }

    if (body.cartaoCnpj !== undefined) {
      updateData.cartaoCnpj = body.cartaoCnpj?.trim() || null;
    }

    if (body.contratoEmpresa !== undefined) {
      updateData.contratoEmpresa = body.contratoEmpresa?.trim() || null;
    }

    if (body.escrituraImoveis !== undefined) {
      updateData.escrituraImoveis = body.escrituraImoveis?.trim() || null;
    }

    if (body.reservasPassagens !== undefined) {
      updateData.reservasPassagens = body.reservasPassagens?.trim() || null;
    }

    if (body.reservasHotel !== undefined) {
      updateData.reservasHotel = body.reservasHotel?.trim() || null;
    }

    if (body.seguroViagem !== undefined) {
      updateData.seguroViagem = body.seguroViagem?.trim() || null;
    }

    if (body.roteiroViagem !== undefined) {
      updateData.roteiroViagem = body.roteiroViagem?.trim() || null;
    }

    if (body.taxa !== undefined) {
      updateData.taxa = body.taxa?.trim() || null;
    }

    if (body.status !== undefined) {
      updateData.status = body.status.trim();
    }

    const updated = await db.update(vistos)
      .set(updateData)
      .where(eq(vistos.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
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
      .from(vistos)
      .where(eq(vistos.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Record not found',
        code: 'NOT_FOUND' 
      }, { status: 404 });
    }

    const deleted = await db.delete(vistos)
      .where(eq(vistos.id, parseInt(id)))
      .returning();

    return NextResponse.json({ 
      message: 'Record deleted successfully',
      record: deleted[0]
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}