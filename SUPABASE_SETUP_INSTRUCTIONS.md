# 📋 Instruções de Configuração do Supabase

## 🎯 Visão Geral
Este documento contém todas as instruções para configurar o Supabase como banco de dados e storage para o sistema jurídico.

---

## 📦 PARTE 1: Configuração do Banco de Dados

### Passo 1: Acessar o SQL Editor do Supabase
1. Acesse: https://supabase.com/dashboard/project/phfzqvmofnqwxszdgjch
2. No menu lateral, clique em **SQL Editor**
3. Clique em **New Query**

### Passo 2: Executar o SQL de Migração
1. Abra o arquivo `SUPABASE_MIGRATION.sql` na raiz deste projeto
2. Copie **TODO** o conteúdo do arquivo
3. Cole no SQL Editor do Supabase
4. Clique em **Run** (ou pressione Ctrl+Enter)

### Passo 3: Verificar a Criação das Tabelas
Após executar o SQL, verifique se as tabelas foram criadas:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Você deve ver 9 tabelas:
- ✅ `users`
- ✅ `acoes_civeis`
- ✅ `acoes_trabalhistas`
- ✅ `acoes_criminais`
- ✅ `compra_venda_imoveis`
- ✅ `perda_nacionalidade`
- ✅ `vistos`
- ✅ `documents`
- ✅ `alerts`

---

## 📁 PARTE 2: Configuração do Storage (Bucket)

### Passo 1: Criar o Bucket
1. No dashboard do Supabase, clique em **Storage** no menu lateral
2. Clique em **New bucket**
3. Configure o bucket:
   - **Name:** `juridico-documentos`
   - **Public:** ❌ Desmarque (bucket privado)
   - **File size limit:** `52428800` (50 MB)
   - **Allowed MIME types:** 
     ```
     application/pdf
     image/jpeg
     image/png
     application/msword
     application/vnd.openxmlformats-officedocument.wordprocessingml.document
     ```
4. Clique em **Create bucket**

### Passo 2: Configurar Políticas de Segurança (RLS)

#### 2.1 Permitir Upload
No SQL Editor, execute:
```sql
CREATE POLICY "Permitir upload de documentos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'juridico-documentos');
```

#### 2.2 Permitir Leitura
```sql
CREATE POLICY "Permitir leitura de documentos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'juridico-documentos');
```

#### 2.3 Permitir Atualização
```sql
CREATE POLICY "Permitir atualização de documentos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'juridico-documentos');
```

#### 2.4 Permitir Exclusão
```sql
CREATE POLICY "Permitir exclusão de documentos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'juridico-documentos');
```

---

## 🗂️ Estrutura Organizada do Bucket

Os arquivos serão organizados automaticamente seguindo esta estrutura:

```
juridico-documentos/
├── acoes-civeis/{case_id}/
│   ├── documentos-iniciais/
│   │   ├── rnm_mae.pdf
│   │   ├── rnm_pai.pdf
│   │   ├── certidao_nascimento.pdf
│   │   └── ...
│   ├── exame-dna/
│   │   └── resultado_exame.pdf
│   ├── procuracao/
│   ├── peticao/
│   ├── processo/
│   ├── exigencias/
│   └── finalizacao/
│
├── compra-venda/{property_id}/
│   ├── matricula.pdf
│   ├── certidoes.pdf
│   ├── contrato.pdf
│   └── ...
│
├── perda-nacionalidade/{case_id}/
│   ├── documentos-iniciais/
│   ├── procuracao/
│   ├── protocolo/
│   └── ...
│
├── vistos/{visto_id}/
│   ├── documentos-pessoais/
│   ├── comprovacao-financeira/
│   └── documentos-viagem/
│
├── acoes-trabalhistas/{case_id}/
│   └── documentos/
│
└── acoes-criminais/{case_id}/
    └── documentos/
```

---

## ✅ Verificação Final

### Checklist de Configuração
- [ ] Todas as 9 tabelas criadas no banco de dados
- [ ] Triggers de `updated_at` funcionando
- [ ] Usuário admin criado (admin@admin.com / 1234)
- [ ] Bucket `juridico-documentos` criado
- [ ] Políticas RLS configuradas para o storage
- [ ] Variáveis de ambiente configuradas no `.env`

### Testar a Conexão
Execute esta query no SQL Editor para verificar se tudo está funcionando:
```sql
-- Verificar usuário admin
SELECT * FROM users WHERE email = 'admin@admin.com';

-- Verificar estrutura de uma tabela
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'acoes_civeis';
```

---

## 🚀 Próximos Passos

Após a configuração estar completa:

1. ✅ Banco de dados configurado
2. ✅ Bucket de storage criado
3. ✅ Políticas de segurança aplicadas
4. ⏭️ Integrar as APIs do sistema para usar Supabase

---

## 📊 Informações Técnicas

### Capacidades do Sistema
- **70+ campos** para armazenar URLs de documentos
- **Índices otimizados** para buscas rápidas
- **Triggers automáticos** para timestamps
- **Políticas RLS** para segurança
- **Limite de 50MB** por arquivo
- **Suporte para:** PDF, DOC, DOCX, JPG, PNG

### Tipos de Documentos Suportados
- 📄 PDF (application/pdf)
- 📝 Word (DOC/DOCX)
- 🖼️ Imagens (JPG/PNG)

---

## ❓ Solução de Problemas

### Erro: "relation already exists"
Se você já executou o SQL antes, limpe as tabelas primeiro:
```sql
DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS vistos CASCADE;
DROP TABLE IF EXISTS perda_nacionalidade CASCADE;
DROP TABLE IF EXISTS compra_venda_imoveis CASCADE;
DROP TABLE IF EXISTS acoes_criminais CASCADE;
DROP TABLE IF EXISTS acoes_trabalhistas CASCADE;
DROP TABLE IF EXISTS acoes_civeis CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```

Depois execute o `SUPABASE_MIGRATION.sql` novamente.

### Erro: "bucket already exists"
Se o bucket já existe, você pode:
1. Deletar o bucket existente em Storage > Settings > Delete bucket
2. Ou usar o bucket existente e apenas configurar as políticas

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs no Supabase Dashboard
2. Consulte a documentação: https://supabase.com/docs
3. Verifique se as credenciais no `.env` estão corretas
