# 📦 SUPABASE STORAGE - BUCKET CONFIGURATION

## 🗂️ Estrutura de Armazenamento de Arquivos

### 1️⃣ Criar Bucket no Supabase

Acesse o **Supabase Dashboard** → **Storage** → **Create Bucket**

**Nome do Bucket:** `juridico-documentos`

**Configurações:**
- **Public bucket:** `false` (privado para segurança)
- **File size limit:** 50 MB
- **Allowed MIME types:** 
  - `application/pdf`
  - `application/msword`
  - `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
  - `image/jpeg`
  - `image/png`
  - `image/jpg`

---

### 2️⃣ Estrutura de Pastas Organizada

```
juridico-documentos/
│
├── acoes-civeis/
│   ├── {case_id}/
│   │   ├── documentos-iniciais/
│   │   │   ├── rnm-mae.pdf
│   │   │   ├── rnm-pai.pdf
│   │   │   ├── rnm-suposto-pai.pdf
│   │   │   ├── certidao-nascimento.pdf
│   │   │   ├── comprovante-endereco.pdf
│   │   │   └── passaporte.pdf
│   │   ├── exame-dna/
│   │   │   └── resultado-exame-dna.pdf
│   │   ├── procuracao/
│   │   │   └── procuracao-assinada.pdf
│   │   ├── peticao/
│   │   │   └── peticao-paternidade.pdf
│   │   ├── processo/
│   │   │   └── processo-protocolado.pdf
│   │   ├── exigencias/
│   │   │   └── documentos-finais.pdf
│   │   └── finalizacao/
│   │       └── documentos-processo-finalizado.pdf
│
├── compra-venda/
│   ├── {property_id}/
│   │   ├── matricula/
│   │   ├── certidoes/
│   │   ├── contratos/
│   │   ├── escrituras/
│   │   └── documentos-pessoais/
│
├── perda-nacionalidade/
│   ├── {case_id}/
│   │   ├── documentos-iniciais/
│   │   ├── procuracao/
│   │   ├── pedido/
│   │   ├── protocolo/
│   │   ├── deferimento/
│   │   └── ratificacao/
│
├── vistos/
│   ├── {visto_id}/
│   │   ├── documentos-pessoais/
│   │   ├── comprovacao-financeira/
│   │   ├── viagem/
│   │   └── empresa/
│
├── acoes-trabalhistas/
│   └── {case_id}/
│       └── documentos/
│
└── acoes-criminais/
    └── {case_id}/
        └── documentos/
```

---

### 3️⃣ SQL para Políticas de Segurança (RLS)

Execute no **Supabase SQL Editor:**

```sql
-- ========================================
-- SUPABASE STORAGE - ROW LEVEL SECURITY
-- ========================================

-- 1. Permitir usuários autenticados fazerem UPLOAD
CREATE POLICY "Authenticated users can upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'juridico-documentos');

-- 2. Permitir usuários autenticados VISUALIZAREM seus arquivos
CREATE POLICY "Authenticated users can view files"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'juridico-documentos');

-- 3. Permitir usuários autenticados ATUALIZAREM seus arquivos
CREATE POLICY "Authenticated users can update files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'juridico-documentos');

-- 4. Permitir usuários autenticados DELETAREM seus arquivos
CREATE POLICY "Authenticated users can delete files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'juridico-documentos');
```

---

### 4️⃣ Função Helper para Organização de Paths

```typescript
// src/lib/storage-helper.ts

export const StoragePaths = {
  acoesCiveis: {
    documentosIniciais: (caseId: number) => 
      `acoes-civeis/${caseId}/documentos-iniciais`,
    exameDna: (caseId: number) => 
      `acoes-civeis/${caseId}/exame-dna`,
    procuracao: (caseId: number) => 
      `acoes-civeis/${caseId}/procuracao`,
    peticao: (caseId: number) => 
      `acoes-civeis/${caseId}/peticao`,
    processo: (caseId: number) => 
      `acoes-civeis/${caseId}/processo`,
    exigencias: (caseId: number) => 
      `acoes-civeis/${caseId}/exigencias`,
    finalizacao: (caseId: number) => 
      `acoes-civeis/${caseId}/finalizacao`,
  },
  
  compraVenda: {
    matricula: (propertyId: number) => 
      `compra-venda/${propertyId}/matricula`,
    certidoes: (propertyId: number) => 
      `compra-venda/${propertyId}/certidoes`,
    contratos: (propertyId: number) => 
      `compra-venda/${propertyId}/contratos`,
    escrituras: (propertyId: number) => 
      `compra-venda/${propertyId}/escrituras`,
    documentosPessoais: (propertyId: number) => 
      `compra-venda/${propertyId}/documentos-pessoais`,
  },
  
  perdaNacionalidade: {
    documentosIniciais: (caseId: number) => 
      `perda-nacionalidade/${caseId}/documentos-iniciais`,
    procuracao: (caseId: number) => 
      `perda-nacionalidade/${caseId}/procuracao`,
    pedido: (caseId: number) => 
      `perda-nacionalidade/${caseId}/pedido`,
    protocolo: (caseId: number) => 
      `perda-nacionalidade/${caseId}/protocolo`,
    deferimento: (caseId: number) => 
      `perda-nacionalidade/${caseId}/deferimento`,
    ratificacao: (caseId: number) => 
      `perda-nacionalidade/${caseId}/ratificacao`,
  },
  
  vistos: {
    documentosPessoais: (vistoId: number) => 
      `vistos/${vistoId}/documentos-pessoais`,
    comprovacaoFinanceira: (vistoId: number) => 
      `vistos/${vistoId}/comprovacao-financeira`,
    viagem: (vistoId: number) => 
      `vistos/${vistoId}/viagem`,
    empresa: (vistoId: number) => 
      `vistos/${vistoId}/empresa`,
  },
  
  acoesTrabalhistas: {
    documentos: (caseId: number) => 
      `acoes-trabalhistas/${caseId}/documentos`,
  },
  
  acoesCriminais: {
    documentos: (caseId: number) => 
      `acoes-criminais/${caseId}/documentos`,
  },
};

// Mapeamento de campos para pastas
export const fieldToFolderMap: Record<string, (id: number) => string> = {
  // Documentos Iniciais (Passo 0)
  rnmMaeFile: (id) => StoragePaths.acoesCiveis.documentosIniciais(id),
  rnmPaiFile: (id) => StoragePaths.acoesCiveis.documentosIniciais(id),
  rnmSupostoPaiFile: (id) => StoragePaths.acoesCiveis.documentosIniciais(id),
  certidaoNascimentoFile: (id) => StoragePaths.acoesCiveis.documentosIniciais(id),
  comprovanteEnderecoFile: (id) => StoragePaths.acoesCiveis.documentosIniciais(id),
  passaporteFile: (id) => StoragePaths.acoesCiveis.documentosIniciais(id),
  
  // Exame DNA (Passo 1)
  resultadoExameDnaFile: (id) => StoragePaths.acoesCiveis.exameDna(id),
  
  // Procuração (Passo 2)
  procuracaoAnexadaFile: (id) => StoragePaths.acoesCiveis.procuracao(id),
  
  // Petição (Passo 3)
  peticaoAnexadaFile: (id) => StoragePaths.acoesCiveis.peticao(id),
  
  // Processo (Passo 4)
  processoAnexadoFile: (id) => StoragePaths.acoesCiveis.processo(id),
  
  // Exigências (Passo 5)
  documentosFinaisAnexadosFile: (id) => StoragePaths.acoesCiveis.exigencias(id),
  
  // Finalização (Passo 6)
  documentosProcessoFinalizadoFile: (id) => StoragePaths.acoesCiveis.finalizacao(id),
};

// Função para obter o path completo do arquivo
export function getFilePath(
  fieldName: string,
  recordId: number,
  fileName: string
): string {
  const folderPath = fieldToFolderMap[fieldName]?.(recordId);
  if (!folderPath) {
    throw new Error(`Field "${fieldName}" não tem mapeamento de pasta definido`);
  }
  return `${folderPath}/${fileName}`;
}

// Função para sanitizar nome de arquivo
export function sanitizeFileName(fileName: string): string {
  const timestamp = Date.now();
  const extension = fileName.split('.').pop();
  const nameWithoutExt = fileName.replace(`.${extension}`, '');
  const sanitized = nameWithoutExt
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-zA-Z0-9-_]/g, '-') // Substitui caracteres especiais
    .toLowerCase();
  
  return `${sanitized}-${timestamp}.${extension}`;
}
```

---

### 5️⃣ Variáveis de Ambiente

Adicione no arquivo `.env`:

```env
# Supabase Storage Configuration
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-aqui
SUPABASE_STORAGE_BUCKET=juridico-documentos
```

---

### 6️⃣ Benefícios da Estrutura Organizada

✅ **Organização por Módulo:** Cada módulo tem sua pasta dedicada  
✅ **Organização por Caso:** Cada caso/processo tem seu ID único  
✅ **Organização por Tipo:** Documentos separados por categoria/passo  
✅ **Fácil Busca:** Estrutura hierárquica facilita localização  
✅ **Escalabilidade:** Suporta milhares de casos sem conflitos  
✅ **Segurança:** RLS garante acesso controlado  
✅ **Backup:** Estrutura facilita backups seletivos  
✅ **Auditoria:** Rastreamento de arquivos por caso/passo  

---

### 7️⃣ Exemplo de Uso na API

```typescript
// src/app/api/documents/upload/route.ts

import { createClient } from '@supabase/supabase-js';
import { getFilePath, sanitizeFileName } from '@/lib/storage-helper';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const caseId = formData.get('caseId') as string;
  const fieldName = formData.get('fieldName') as string;

  // Sanitizar nome do arquivo
  const sanitizedName = sanitizeFileName(file.name);
  
  // Obter path organizado baseado no campo
  const filePath = getFilePath(fieldName, parseInt(caseId), sanitizedName);

  // Upload para Supabase Storage
  const { data, error } = await supabase.storage
    .from('juridico-documentos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  // Obter URL pública assinada (válida por 1 ano)
  const { data: urlData } = await supabase.storage
    .from('juridico-documentos')
    .createSignedUrl(filePath, 31536000); // 1 ano

  return Response.json({
    fileName: sanitizedName,
    path: filePath,
    url: urlData?.signedUrl
  });
}
```

---

## 🎯 Próximos Passos

1. **Criar bucket** `juridico-documentos` no Supabase Dashboard
2. **Executar SQL** das políticas de segurança
3. **Adicionar variáveis** de ambiente no `.env`
4. **Implementar integração** com a API de upload

---

## 📝 Notas Importantes

- Arquivos são privados por padrão (bucket não-público)
- URLs assinadas temporárias para acesso seguro
- Nomes de arquivo sanitizados para evitar conflitos
- Estrutura de pastas facilita organização e backup
- RLS garante que apenas usuários autenticados acessem
