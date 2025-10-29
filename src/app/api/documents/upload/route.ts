import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { documents, acoesCiveis } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { supabase, getFilePath, BUCKET_NAME } from '@/lib/supabase';

// Map field names to organized folder structure
const FIELD_TO_STEP_MAP: Record<string, string> = {
  // Documentos Iniciais
  rnmMaeFile: 'documentos-iniciais',
  rnmPaiFile: 'documentos-iniciais',
  rnmSupostoPaiFile: 'documentos-iniciais',
  certidaoNascimentoFile: 'documentos-iniciais',
  comprovanteEnderecoFile: 'documentos-iniciais',
  passaporteFile: 'documentos-iniciais',
  guiaPagaFile: 'documentos-iniciais',
  
  // Exame DNA
  resultadoExameDnaFile: 'exame-dna',
  
  // Procuração
  procuracaoAnexadaFile: 'procuracao',
  
  // Petição
  peticaoAnexadaFile: 'peticao',
  
  // Processo
  processoAnexadoFile: 'processo',
  
  // Exigências
  documentosFinaisAnexadosFile: 'exigencias',
  
  // Finalização
  documentosProcessoFinalizadoFile: 'finalizacao',
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const caseId = formData.get('caseId') as string;
    const fieldName = formData.get('fieldName') as string;

    console.log('🔹 Upload iniciado:', { caseId, fieldName, fileName: file?.name, fileSize: file?.size });

    if (!file || !caseId || !fieldName) {
      console.error('❌ Dados incompletos:', { file: !!file, caseId, fieldName });
      return NextResponse.json(
        { error: 'Arquivo, ID do caso e nome do campo são obrigatórios' },
        { status: 400 }
      );
    }

    // Validate file size (50MB limit)
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    if (file.size > MAX_FILE_SIZE) {
      console.error('❌ Arquivo muito grande:', file.size);
      return NextResponse.json(
        { error: 'Arquivo muito grande. Limite máximo: 50MB' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
    ];

    if (!allowedTypes.includes(file.type)) {
      console.error('❌ Tipo de arquivo não permitido:', file.type);
      return NextResponse.json(
        { error: 'Tipo de arquivo não permitido. Use: PDF, DOC, DOCX, JPG, PNG' },
        { status: 400 }
      );
    }

    // Get step folder from field name
    const stepFolder = FIELD_TO_STEP_MAP[fieldName] || 'outros';

    // Generate file path
    const timestamp = Date.now();
    const originalName = file.name;
    const extension = originalName.split('.').pop();
    const fileNameWithTimestamp = `${fieldName}_${timestamp}.${extension}`;
    const filePath = getFilePath.acoesCiveis(parseInt(caseId), stepFolder, fileNameWithTimestamp);

    console.log('📂 Caminho do arquivo:', filePath);

    // Upload to Supabase Storage
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log('⬆️ Iniciando upload para Supabase Storage...');

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error('❌ Erro no upload do Supabase:', {
        message: uploadError.message,
        name: uploadError.name,
        cause: uploadError.cause,
      });
      return NextResponse.json(
        { 
          error: 'Erro ao fazer upload do arquivo no bucket Supabase', 
          details: uploadError.message,
          hint: 'Verifique se as políticas RLS do bucket estão configuradas corretamente'
        },
        { status: 500 }
      );
    }

    console.log('✅ Upload no Supabase concluído:', uploadData);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

    console.log('🔗 URL pública gerada:', publicUrl);

    // Save document metadata to database
    console.log('💾 Salvando metadados no banco de dados...');
    await db.insert(documents).values({
      moduleType: 'acoes_civeis',
      recordId: parseInt(caseId),
      fileName: originalName,
      filePath: publicUrl,
      fileType: file.type,
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
    });

    // Update the case with the file URL
    const updateData: any = {};
    updateData[fieldName] = publicUrl;

    console.log('🔄 Atualizando registro da ação cível...');
    await db
      .update(acoesCiveis)
      .set(updateData)
      .where(eq(acoesCiveis.id, parseInt(caseId)));

    console.log('✅ Upload completo!');

    return NextResponse.json({
      success: true,
      fileName: originalName,
      fileUrl: publicUrl,
      filePath: filePath,
    });
  } catch (error) {
    console.error('❌ Erro inesperado no upload:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const moduleType = searchParams.get('moduleType');
    const recordId = searchParams.get('recordId');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 200);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    if (id) {
      const documentId = parseInt(id);
      if (isNaN(documentId)) {
        return NextResponse.json(
          { error: 'ID inválido', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const document = await db.select()
        .from(documents)
        .where(eq(documents.id, documentId))
        .limit(1);

      if (document.length === 0) {
        return NextResponse.json(
          { error: 'Documento não encontrado' },
          { status: 404 }
        );
      }

      return NextResponse.json(document[0]);
    }

    if (moduleType && recordId) {
      const recordIdNum = parseInt(recordId);
      if (isNaN(recordIdNum)) {
        return NextResponse.json(
          { error: 'recordId inválido', code: 'INVALID_RECORD_ID' },
          { status: 400 }
        );
      }

      const filteredDocuments = await db.select()
        .from(documents)
        .where(eq(documents.moduleType, moduleType))
        .limit(limit)
        .offset(offset);

      return NextResponse.json(filteredDocuments);
    }

    const allDocuments = await db.select()
      .from(documents)
      .limit(limit)
      .offset(offset);

    return NextResponse.json(allDocuments);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Erro interno: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID é obrigatório', code: 'MISSING_ID' },
        { status: 400 }
      );
    }

    const documentId = parseInt(id);
    if (isNaN(documentId)) {
      return NextResponse.json(
        { error: 'ID inválido', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const existingDocument = await db.select()
      .from(documents)
      .where(eq(documents.id, documentId))
      .limit(1);

    if (existingDocument.length === 0) {
      return NextResponse.json(
        { error: 'Documento não encontrado' },
        { status: 404 }
      );
    }

    const deleted = await db.delete(documents)
      .where(eq(documents.id, documentId))
      .returning();

    return NextResponse.json({
      message: 'Documento excluído com sucesso',
      document: deleted[0]
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Erro interno: ' + (error as Error).message },
      { status: 500 }
    );
  }
}