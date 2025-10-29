# 🔐 Configuração de Políticas do Supabase Storage

## ⚠️ Problema: Documentos não estão sendo salvos no bucket

Se você está recebendo erros ao fazer upload de documentos, é porque as **políticas RLS (Row Level Security)** do bucket não estão configuradas corretamente.

---

## 📋 **Instruções para Configurar Políticas**

### **1. Acesse o Supabase Dashboard**

1. Vá para: https://supabase.com/dashboard/project/phfzqvmofnqwxszdgjch
2. Faça login na sua conta

---

### **2. Configure o Bucket Storage**

1. No menu lateral, clique em **Storage**
2. Você deve ver o bucket `juridico-documentos` que já foi criado
3. Clique no bucket `juridico-documentos`

---

### **3. Configure as Políticas RLS**

1. Clique na aba **Policies** (Políticas)
2. Clique em **New Policy** (Nova Política)
3. **IMPORTANTE**: Escolha a opção **"For full customization"** (Para personalização completa)

#### **Política 1: Permitir Upload (INSERT)**

```sql
-- Nome da política: Permitir upload de documentos
-- Operation: INSERT
-- Policy definition:

CREATE POLICY "Permitir upload de documentos"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'juridico-documentos');
```

**Como adicionar:**
- Nome: `Permitir upload de documentos`
- Allowed operation: Selecione `INSERT`
- Target roles: Selecione `public`
- USING expression: deixe vazio
- WITH CHECK expression: cole isso:
  ```sql
  bucket_id = 'juridico-documentos'
  ```

#### **Política 2: Permitir Leitura (SELECT)**

```sql
-- Nome da política: Permitir leitura de documentos
-- Operation: SELECT
-- Policy definition:

CREATE POLICY "Permitir leitura de documentos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'juridico-documentos');
```

**Como adicionar:**
- Nome: `Permitir leitura de documentos`
- Allowed operation: Selecione `SELECT`
- Target roles: Selecione `public`
- USING expression: cole isso:
  ```sql
  bucket_id = 'juridico-documentos'
  ```
- WITH CHECK expression: deixe vazio

#### **Política 3: Permitir Atualização (UPDATE)**

```sql
-- Nome da política: Permitir atualização de documentos
-- Operation: UPDATE
-- Policy definition:

CREATE POLICY "Permitir atualização de documentos"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'juridico-documentos')
WITH CHECK (bucket_id = 'juridico-documentos');
```

**Como adicionar:**
- Nome: `Permitir atualização de documentos`
- Allowed operation: Selecione `UPDATE`
- Target roles: Selecione `public`
- USING expression: cole isso:
  ```sql
  bucket_id = 'juridico-documentos'
  ```
- WITH CHECK expression: cole isso:
  ```sql
  bucket_id = 'juridico-documentos'
  ```

#### **Política 4: Permitir Exclusão (DELETE)**

```sql
-- Nome da política: Permitir exclusão de documentos
-- Operation: DELETE
-- Policy definition:

CREATE POLICY "Permitir exclusão de documentos"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'juridico-documentos');
```

**Como adicionar:**
- Nome: `Permitir exclusão de documentos`
- Allowed operation: Selecione `DELETE`
- Target roles: Selecione `public`
- USING expression: cole isso:
  ```sql
  bucket_id = 'juridico-documentos'
  ```
- WITH CHECK expression: deixe vazio

---

### **4. Configurações do Bucket (Opcional mas Recomendado)**

1. Volte para a aba **Configuration** do bucket
2. Configure:
   - **Public bucket**: ✅ Marque esta opção (para gerar URLs públicas)
   - **File size limit**: 52428800 (50MB)
   - **Allowed MIME types**: 
     ```
     application/pdf
     image/jpeg
     image/png
     application/msword
     application/vnd.openxmlformats-officedocument.wordprocessingml.document
     ```

---

### **5. Método Alternativo: Usar SQL Editor**

Se preferir, você pode executar todas as políticas de uma vez no SQL Editor:

1. Vá em **SQL Editor** no menu lateral
2. Cole este script completo:

```sql
-- ========================================
-- POLÍTICAS RLS PARA BUCKET: juridico-documentos
-- ========================================

-- 1. Permitir upload (INSERT)
CREATE POLICY "Permitir upload de documentos"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'juridico-documentos');

-- 2. Permitir leitura (SELECT)
CREATE POLICY "Permitir leitura de documentos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'juridico-documentos');

-- 3. Permitir atualização (UPDATE)
CREATE POLICY "Permitir atualização de documentos"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'juridico-documentos')
WITH CHECK (bucket_id = 'juridico-documentos');

-- 4. Permitir exclusão (DELETE)
CREATE POLICY "Permitir exclusão de documentos"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'juridico-documentos');

-- 5. Habilitar RLS (se ainda não estiver habilitado)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
```

3. Clique em **Run** para executar

---

## ✅ **Verificação Final**

Após configurar as políticas, teste o upload:

1. Vá para uma ação cível em: `/dashboard/acoes-civeis/[id]`
2. Expanda um passo
3. Tente fazer upload de um documento
4. Verifique o console do navegador (F12 → Console)
5. Você deve ver logs de sucesso:
   ```
   🔹 Upload iniciado: { caseId: "3", fieldName: "rnmMaeFile", ... }
   📂 Caminho do arquivo: acoes-civeis/3/documentos-iniciais/...
   ⬆️ Iniciando upload para Supabase Storage...
   ✅ Upload no Supabase concluído
   🔗 URL pública gerada: https://...
   💾 Salvando metadados no banco de dados...
   🔄 Atualizando registro da ação cível...
   ✅ Upload completo!
   ```

6. Se ainda houver erro, verifique o console do navegador para ver a mensagem de erro específica

---

## 🆘 **Problemas Comuns**

### Erro: "new row violates row-level security policy"
- **Solução**: As políticas não foram criadas corretamente. Verifique se TODAS as 4 políticas foram adicionadas.

### Erro: "Bucket not found"
- **Solução**: Certifique-se de que o bucket `juridico-documentos` existe em Storage.

### Erro: "The resource already exists"
- **Solução**: A política já foi criada antes. Isso está OK, pode ignorar.

### Arquivos não aparecem no bucket
- **Solução**: 
  1. Verifique se a política de INSERT foi criada corretamente
  2. Verifique os logs do console (F12) para ver o erro específico
  3. Certifique-se de que as variáveis de ambiente `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão corretas no arquivo `.env`

---

## 📞 **Precisa de Ajuda?**

Se ainda tiver problemas após seguir estas instruções:

1. Abra o console do navegador (F12)
2. Tente fazer upload de um documento
3. Copie a mensagem de erro completa que aparece no console
4. Compartilhe a mensagem de erro para que eu possa ajudar

---

## 🎯 **Estrutura de Pastas no Bucket**

Após configurar corretamente, os arquivos serão organizados assim:

```
juridico-documentos/
  └── acoes-civeis/
        └── {caseId}/
              ├── documentos-iniciais/
              │     ├── rnmMaeFile_*.pdf
              │     ├── rnmPaiFile_*.pdf
              │     ├── certidaoNascimentoFile_*.pdf
              │     └── ...
              ├── exame-dna/
              │     └── resultadoExameDnaFile_*.pdf
              ├── procuracao/
              │     └── procuracaoAnexadaFile_*.pdf
              ├── peticao/
              │     └── peticaoAnexadaFile_*.pdf
              ├── processo/
              │     └── processoAnexadoFile_*.pdf
              ├── exigencias/
              │     └── documentosFinaisAnexadosFile_*.pdf
              └── finalizacao/
                    └── documentosProcessoFinalizadoFile_*.pdf
```

Cada arquivo terá um timestamp no nome para evitar conflitos!
