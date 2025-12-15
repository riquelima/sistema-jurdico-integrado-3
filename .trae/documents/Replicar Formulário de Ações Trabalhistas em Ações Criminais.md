## Objetivo
Replicar a interface e funcionalidades do formulário de “Nova Ação Trabalhista” para “Nova Ação Criminal”, com os mesmos campos e lógica de uploads, sincronizando com Supabase.

## Revisão de Código Atual
- Lista de Ações Criminais aponta para `/dashboard/acoes-criminais/nova`, mas o arquivo não existe.
- API de Ações Criminais (`src/app/api/acoes-criminais/route.ts`) só suporta `clientName`, `status`, `notes`.
- Conversão de uploads temporários atualiza tabelas, e atualmente só evita atualizações para `acoes_trabalhistas`.

## Alterações Planejadas
1. **Criar Página Nova Ação Criminal**
   - Criar `src/app/dashboard/acoes-criminais/nova/page.tsx` com a mesma UI de Trabalhistas:
     - Seções: Informações da Ação, Documentos, Conteúdo, Status
     - Componentização `DocumentRow`, botão “Upload”, ícones lado a lado com tooltip e botão “X” para remover.
     - Lógica `handleDocumentUpload`, `handleRemoveFile`, `convertTemporaryUploads(caseId)` com `moduleType: "acoes_criminais"`.
     - `handleSubmit` cria via `/api/acoes-criminais` e converte uploads temporários.

2. **Expandir API de Ações Criminais**
   - Atualizar `POST/PUT` em `src/app/api/acoes-criminais/route.ts` para aceitar e persistir:
     - `reu_name`, `autor_name`, `numero_processo`, `responsavel_name`, `responsavel_date`, `resumo`, `acompanhamento`, `contratado`.
   - Continuar sem coluna de documento específica; anexos ficam em `documents`.

3. **Ajustar Conversão de Uploads Temporários**
   - Em `src/app/api/documents/convert-temporary/route.ts`, evitar atualizar tabela principal também para `acoes_criminais` (já evita para `acoes_trabalhistas`).
   - Documentos continuam sendo inseridos em `documents` com `module_type: "acoes_criminais"`.

4. **Banco de Dados**
   - Se desejar armazenar também uma URL principal de documento no registro, posso adicionar colunas ao `acoes_criminais` (como fizemos ao planejar trabalhistas). Caso contrário, operamos apenas pela tabela `documents`.

## Verificação
- Acessar `/dashboard/acoes-criminais/nova`, criar uma ação com anexos múltiplos.
- Confirmar criação sem erro e anexos no bucket e `documents`.

Posso implementar agora conforme acima?