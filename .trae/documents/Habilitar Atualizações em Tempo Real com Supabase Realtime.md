## Objetivo
- Atualizar listas e páginas de detalhes instantaneamente após qualquer criação/alteração/exclusão, sem precisar recarregar.

## Abordagem Técnica
- Usar Supabase Realtime (já presente) com `postgres_changes` para escutar `INSERT/UPDATE/DELETE` nas tabelas principais.
- Padronizar um serviço de realtime com hooks para páginas consumirem e atualizarem o estado local imediatamente.
- Combinar com atualizações otimistas no client para feedback instantâneo enquanto o evento Realtime confirma.

## Tabelas a Assinar
- `acoes_civeis`, `acoes_criminais`, `acoes_trabalhistas`, `vistos`, `documents`, `alerts`, `compra_venda_imoveis`.

## Arquivos e Mudanças
- Criar `src/lib/realtime.ts`:
  - Exportar `subscribeTable({ table, events, onChange })` e `unsubscribe(channel)` baseado em `supabase.channel`.
  - Opção de filtro por `recordId` no callback para páginas de detalhes (filtrar no cliente pelo `row.record_id === id`).
- Criar `src/context/RealtimeProvider.tsx` (opcional):
  - Centralizar canais, garantir `unsubscribe` no unmount.
- Páginas de lista (ex.: `src/app/dashboard/acoes-civeis/page.tsx`, `.../acoes-criminais/page.tsx`, `.../vistos/page.tsx`):
  - Ao carregar, `fetch` inicial; depois `subscribeTable` em `INSERT/UPDATE/DELETE` e atualizar o array em memória.
- Páginas de detalhe (ex.: `src/app/dashboard/acoes-civeis/[id]/page.tsx`, `src/app/dashboard/vistos/[id]/page.tsx`):
  - Assinar `UPDATE` da tabela principal e `INSERT/DELETE/UPDATE` de `documents` e `alerts`.
  - Filtrar eventos pelo `recordId` correspondente.
- Atualizações Otimistas
  - Após `POST/PUT/DELETE` para `/api/...`, atualizar estado local imediatamente; Realtime chega e reconcilia (evitar flicker).

## Permissões e Setup Supabase
- Verificar que Realtime está habilitado para as tabelas e que RLS permite `replication` para o `anon` (ver `SUPABASE_SETUP_INSTRUCTIONS.md`).
- Garantir colunas `updated_at` são atualizadas nos `UPDATE` (já presente em schema).

## Exemplos de Uso (alto nível)
- `subscribeTable({ table: 'vistos', events: ['update'], onChange: (payload) => { if (payload.new.id === id) setVisto(payload.new) } })`
- `subscribeTable({ table: 'documents', events: ['insert','delete'], onChange: (p) => { if (p.new?.record_id===id || p.old?.record_id===id) refreshDocuments() } })`

## Verificação
- Criar uma ação cível: aparece imediatamente na lista.
- Alterar status: a linha/Detalhe atualiza sem reload.
- Upload/Exclusão de documento: ícones de anexo atualizam em tempo real.

## Fallback
- Se Realtime indisponível, ativar polling leve (ex.: `setInterval` de 5–10s) apenas como backup.

Posso implementar o serviço Realtime, integrar nas páginas de lista e detalhe e ajustar as APIs/clientes para atualizações otimistas?