## Objetivo
- Salvar observações apenas no modal de Observações, persistidas no Supabase e sincronizadas com exclusão individual.

## Banco de Dados (Supabase)
- Criar tabela `vistos_notes`:
  - `id` bigint PK
  - `visto_id` bigint FK → `vistos.id` (indexado)
  - `step_id` int (opcional; etapa relacionada)
  - `content` text (conteúdo da observação)
  - `created_at` timestamptz default now()
- Índices:
  - `idx_vistos_notes_visto_id` em (`visto_id`, `created_at DESC`)
- Permissões: uso via chave Service Role no backend (já existente), sem expor no cliente.

## API (Next.js /app/api)
- Novo endpoint `/api/vistos-notes` com métodos:
  - `GET`: lista notas por `recordId` (e opcional `stepId`), ordenado por `created_at DESC`
  - `POST`: cria nota `{ recordId, stepId?, content }`
  - `DELETE`: remove nota por `id`
- Implementação similar ao padrão de `/api/vistos`, usando `createClient` com Service Role.

## UI – Modal Observações
- Botão “Ver todas as notas” (já adicionado) abre modal:
  - Carrega notas via `GET /api/vistos-notes?recordId=<id>`
  - Renderiza lista com: etapa (se houver), `content`, e `created_at` em `dd/mm/aaaa hh:mm`
  - Cada item com botão “x” para excluir (`DELETE /api/vistos-notes?id=<noteId>`), atualizando a lista

## UI – Salvar Observação
- Ao clicar “Salvar” no card:
  - Envia `POST /api/vistos-notes` com `{ recordId, stepId: 0, content: <texto> }`
  - Limpa o campo, mostra confirmação “Salvo com sucesso!” abaixo do botão
  - Atualiza “Última atualização” do `visto` via `PUT /api/vistos?id=<id>` apenas com `updatedAt` (ou reuso do já implementado)
- Não mais escrever em `vistos.notes`; manter esse campo sem uso para Observações.

## Ajustes no Código
- `page.tsx`:
  - Atualizar `saveStepNotes(stepId)` para chamar `POST /api/vistos-notes` ao invés de persistir no campo `notes`
  - No modal, substituir a leitura atual por `GET /api/vistos-notes` e renderizar com data/hora e botão excluir
- `/api/vistos/route.ts`:
  - Sem mudanças obrigatórias além de deixar de usar `notes` para observações (não remover campo por compatibilidade)

## Migração (Opcional)
- Se houver conteúdo legado em `vistos.notes`, criar script de migração que:
  - Parseia blocos existentes e insere em `vistos_notes` com `created_at = now()`

## Validação
- Salvar observação → aparece confirmação e, abrindo modal, nota listada com data/hora.
- Excluir “x” → remove da lista e do banco.
- Lint sem erros; rotas retornam 200.

## Entregáveis
- Tabela `vistos_notes` criada
- Endpoint `/api/vistos-notes` (GET/POST/DELETE)
- UI do modal integrada ao endpoint, com exclusão
- `saveStepNotes` escrevendo apenas em `vistos_notes`