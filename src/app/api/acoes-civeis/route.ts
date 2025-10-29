import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { acoesCiveis } from '@/db/schema';
import { eq, like, and, or, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
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
        .from(acoesCiveis)
        .where(eq(acoesCiveis.id, parseInt(id)))
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

    let query = db.select().from(acoesCiveis);

    // Build where conditions
    const conditions = [];

    if (search) {
      conditions.push(like(acoesCiveis.clientName, `%${search}%`));
    }

    if (type) {
      conditions.push(eq(acoesCiveis.type, type));
    }

    if (status) {
      conditions.push(eq(acoesCiveis.status, status));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(acoesCiveis.createdAt))
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
    const { 
      clientName, 
      type, 
      currentStep,
      status,
      rnmMae,
      rnmPai,
      rnmSupostoPai,
      cpfMae,
      cpfPai,
      certidaoNascimento,
      comprovanteEndereco,
      passaporte,
      guiaPaga,
      notes,
      dataExameDna,
      procuracaoAnexada,
      peticaoAnexada,
      processoAnexado,
      numeroProtocolo,
      documentosFinaisAnexados,
      // Document URL fields
      rnmMaeFile,
      rnmPaiFile,
      rnmSupostoPaiFile,
      cpfMaeFile,
      cpfPaiFile,
      certidaoNascimentoFile,
      comprovanteEnderecoFile,
      passaporteFile,
      guiaPagaFile,
      resultadoExameDnaFile,
      procuracaoAnexadaFile,
      peticaoAnexadaFile,
      processoAnexadoFile,
      documentosFinaisAnexadosFile,
      documentosProcessoFinalizadoFile
    } = body;

    // Validate required fields
    if (!clientName || clientName.trim() === '') {
      return NextResponse.json({ 
        error: "clientName is required and cannot be empty",
        code: "MISSING_CLIENT_NAME" 
      }, { status: 400 });
    }

    if (!type || type.trim() === '') {
      return NextResponse.json({ 
        error: "type is required and cannot be empty",
        code: "MISSING_TYPE" 
      }, { status: 400 });
    }

    // Prepare insert data with defaults
    const now = new Date().toISOString();
    const insertData: any = {
      clientName: clientName.trim(),
      type: type.trim(),
      currentStep: currentStep !== undefined ? currentStep : 0,
      status: status || 'Em Andamento',
      createdAt: now,
      updatedAt: now,
    };

    // Add optional fields if provided
    if (rnmMae !== undefined) insertData.rnmMae = rnmMae;
    if (rnmPai !== undefined) insertData.rnmPai = rnmPai;
    if (rnmSupostoPai !== undefined) insertData.rnmSupostoPai = rnmSupostoPai;
    if (cpfMae !== undefined) insertData.cpfMae = cpfMae;
    if (cpfPai !== undefined) insertData.cpfPai = cpfPai;
    if (certidaoNascimento !== undefined) insertData.certidaoNascimento = certidaoNascimento;
    if (comprovanteEndereco !== undefined) insertData.comprovanteEndereco = comprovanteEndereco;
    if (passaporte !== undefined) insertData.passaporte = passaporte;
    if (guiaPaga !== undefined) insertData.guiaPaga = guiaPaga;
    if (notes !== undefined) insertData.notes = notes;
    if (dataExameDna !== undefined) insertData.dataExameDna = dataExameDna;
    if (procuracaoAnexada !== undefined) insertData.procuracaoAnexada = procuracaoAnexada;
    if (peticaoAnexada !== undefined) insertData.peticaoAnexada = peticaoAnexada;
    if (processoAnexado !== undefined) insertData.processoAnexado = processoAnexado;
    if (numeroProtocolo !== undefined) insertData.numeroProtocolo = numeroProtocolo;
    if (documentosFinaisAnexados !== undefined) insertData.documentosFinaisAnexados = documentosFinaisAnexados;
    
    // Add document URL fields if provided
    if (rnmMaeFile !== undefined) insertData.rnmMaeFile = rnmMaeFile;
    if (rnmPaiFile !== undefined) insertData.rnmPaiFile = rnmPaiFile;
    if (rnmSupostoPaiFile !== undefined) insertData.rnmSupostoPaiFile = rnmSupostoPaiFile;
    if (cpfMaeFile !== undefined) insertData.cpfMaeFile = cpfMaeFile;
    if (cpfPaiFile !== undefined) insertData.cpfPaiFile = cpfPaiFile;
    if (certidaoNascimentoFile !== undefined) insertData.certidaoNascimentoFile = certidaoNascimentoFile;
    if (comprovanteEnderecoFile !== undefined) insertData.comprovanteEnderecoFile = comprovanteEnderecoFile;
    if (passaporteFile !== undefined) insertData.passaporteFile = passaporteFile;
    if (guiaPagaFile !== undefined) insertData.guiaPagaFile = guiaPagaFile;
    if (resultadoExameDnaFile !== undefined) insertData.resultadoExameDnaFile = resultadoExameDnaFile;
    if (procuracaoAnexadaFile !== undefined) insertData.procuracaoAnexadaFile = procuracaoAnexadaFile;
    if (peticaoAnexadaFile !== undefined) insertData.peticaoAnexadaFile = peticaoAnexadaFile;
    if (processoAnexadoFile !== undefined) insertData.processoAnexadoFile = processoAnexadoFile;
    if (documentosFinaisAnexadosFile !== undefined) insertData.documentosFinaisAnexadosFile = documentosFinaisAnexadosFile;
    if (documentosProcessoFinalizadoFile !== undefined) insertData.documentosProcessoFinalizadoFile = documentosProcessoFinalizadoFile;

    const newRecord = await db.insert(acoesCiveis)
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if record exists
    const existing = await db.select()
      .from(acoesCiveis)
      .where(eq(acoesCiveis.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Record not found',
        code: 'NOT_FOUND'
      }, { status: 404 });
    }

    const body = await request.json();
    const { 
      clientName,
      type,
      currentStep,
      status,
      rnmMae,
      rnmPai,
      rnmSupostoPai,
      cpfMae,
      cpfPai,
      certidaoNascimento,
      comprovanteEndereco,
      passaporte,
      guiaPaga,
      notes,
      dataExameDna,
      procuracaoAnexada,
      peticaoAnexada,
      processoAnexado,
      numeroProtocolo,
      documentosFinaisAnexados,
      // Document URL fields
      rnmMaeFile,
      rnmPaiFile,
      rnmSupostoPaiFile,
      cpfMaeFile,
      cpfPaiFile,
      certidaoNascimentoFile,
      comprovanteEnderecoFile,
      passaporteFile,
      guiaPagaFile,
      resultadoExameDnaFile,
      procuracaoAnexadaFile,
      peticaoAnexadaFile,
      processoAnexadoFile,
      documentosFinaisAnexadosFile,
      documentosProcessoFinalizadoFile
    } = body;

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date().toISOString()
    };

    // Add fields to update if provided
    if (clientName !== undefined) updateData.clientName = clientName.trim();
    if (type !== undefined) updateData.type = type.trim();
    if (currentStep !== undefined) updateData.currentStep = currentStep;
    if (status !== undefined) updateData.status = status;
    if (rnmMae !== undefined) updateData.rnmMae = rnmMae;
    if (rnmPai !== undefined) updateData.rnmPai = rnmPai;
    if (rnmSupostoPai !== undefined) updateData.rnmSupostoPai = rnmSupostoPai;
    if (cpfMae !== undefined) updateData.cpfMae = cpfMae;
    if (cpfPai !== undefined) updateData.cpfPai = cpfPai;
    if (certidaoNascimento !== undefined) updateData.certidaoNascimento = certidaoNascimento;
    if (comprovanteEndereco !== undefined) updateData.comprovanteEndereco = comprovanteEndereco;
    if (passaporte !== undefined) updateData.passaporte = passaporte;
    if (guiaPaga !== undefined) updateData.guiaPaga = guiaPaga;
    if (notes !== undefined) updateData.notes = notes;
    if (dataExameDna !== undefined) updateData.dataExameDna = dataExameDna;
    if (procuracaoAnexada !== undefined) updateData.procuracaoAnexada = procuracaoAnexada;
    if (peticaoAnexada !== undefined) updateData.peticaoAnexada = peticaoAnexada;
    if (processoAnexado !== undefined) updateData.processoAnexado = processoAnexado;
    if (numeroProtocolo !== undefined) updateData.numeroProtocolo = numeroProtocolo;
    if (documentosFinaisAnexados !== undefined) updateData.documentosFinaisAnexados = documentosFinaisAnexados;
    
    // Add document URL fields to update if provided
    if (rnmMaeFile !== undefined) updateData.rnmMaeFile = rnmMaeFile;
    if (rnmPaiFile !== undefined) updateData.rnmPaiFile = rnmPaiFile;
    if (rnmSupostoPaiFile !== undefined) updateData.rnmSupostoPaiFile = rnmSupostoPaiFile;
    if (cpfMaeFile !== undefined) updateData.cpfMaeFile = cpfMaeFile;
    if (cpfPaiFile !== undefined) updateData.cpfPaiFile = cpfPaiFile;
    if (certidaoNascimentoFile !== undefined) updateData.certidaoNascimentoFile = certidaoNascimentoFile;
    if (comprovanteEnderecoFile !== undefined) updateData.comprovanteEnderecoFile = comprovanteEnderecoFile;
    if (passaporteFile !== undefined) updateData.passaporteFile = passaporteFile;
    if (guiaPagaFile !== undefined) updateData.guiaPagaFile = guiaPagaFile;
    if (resultadoExameDnaFile !== undefined) updateData.resultadoExameDnaFile = resultadoExameDnaFile;
    if (procuracaoAnexadaFile !== undefined) updateData.procuracaoAnexadaFile = procuracaoAnexadaFile;
    if (peticaoAnexadaFile !== undefined) updateData.peticaoAnexadaFile = peticaoAnexadaFile;
    if (processoAnexadoFile !== undefined) updateData.processoAnexadoFile = processoAnexadoFile;
    if (documentosFinaisAnexadosFile !== undefined) updateData.documentosFinaisAnexadosFile = documentosFinaisAnexadosFile;
    if (documentosProcessoFinalizadoFile !== undefined) updateData.documentosProcessoFinalizadoFile = documentosProcessoFinalizadoFile;

    const updated = await db.update(acoesCiveis)
      .set(updateData)
      .where(eq(acoesCiveis.id, parseInt(id)))
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if record exists
    const existing = await db.select()
      .from(acoesCiveis)
      .where(eq(acoesCiveis.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Record not found',
        code: 'NOT_FOUND'
      }, { status: 404 });
    }

    const deleted = await db.delete(acoesCiveis)
      .where(eq(acoesCiveis.id, parseInt(id)))
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