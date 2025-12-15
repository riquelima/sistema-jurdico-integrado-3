## Objetivo
- Replicar exatamente a interface e funcionalidades da tela de detalhes de Vistos para Ações Trabalhistas, mantendo apenas os nomes dos fluxos próprios do módulo trabalhista.

## Sessões e UI a Replicar
- Timeline de etapas com conectores, ícones clicáveis (atual, concluído, futuro) e destaque visual da etapa atual.
- Popover “Definir Responsável” em cada etapa (lista de responsáveis fixa + seletor de data com `CalendarPicker`), exibindo badges de Responsável e Prazo na linha da etapa.
- Card de Observações à direita com botão “Ver” que abre o Modal “Notas do Processo”.
- Modal “Notas do Processo”: listagem de notas com data/hora formatadas, autor e cargo (inferidos da lista de responsáveis), e ação de excluir nota.
- Painel de Documentos com área de drag-and-drop e grid de anexos, idêntico ao de Vistos.
- StatusPanel com `currentStep` e `totalSteps` corretos.

## Lógica e Funcionalidades
- Conclusão contínua: concluir etapa N marca `0..N` como concluídas e define `N+1` como atual; desfazer em N reabre N e seguintes.
- Responsáveis e prazos:
  - Usar `/api/step-assignments` com `moduleType=acoes_trabalhistas` para salvar `responsibleName` e `dueDate` por etapa.
  - Exibir os dados na timeline; replicar lista `RESPONSAVEIS` de Vistos.
- Notas do processo:
  - Implementar `parseNotesArray`, `saveStepNotes`, `deleteNote` igual em Vistos, persistindo em `notes` via `PUT /api/acoes-trabalhistas?id=...` com JSON de notas (id, stepId, content, timestamp, authorName, authorRole).
  - O card de Observações salva a nota na etapa atual; o modal lista todas.
- Documentos:
  - Manter `DocumentPanel` (drag-and-drop, upload para `/api/documents/upload` com `moduleType=acoes_trabalhistas`), ícones por tipo como no componente replicado.
- Realtime (opcional, se disponível):
  - Replicar assinatura `subscribeTable` de Vistos para `acoes_trabalhistas` e `documents` (insert/delete) para atualizar UI em tempo real.

## Adaptações ao Backend Trabalhista
- As rotas existentes já suportam `notes` e recebem `currentStep`; aplicar atualizações via `PUT` mantendo compatibilidade.
- `step-assignments` já está sendo utilizado no módulo trabalhista; padronizar chamadas e mapeamentos.

## Implementação (arquivos)
- Atualizar `src/app/dashboard/acoes-trabalhistas/[id]/page.tsx`:
  - Adicionar `RESPONSAVEIS`, `assignOpenStep`, `assignResp`, `assignDue`.
  - Substituir input de data por `CalendarPicker`; exibir data em `dd/mm/aaaa`.
  - Replicar card de Observações e Modal de Notas.
  - Manter `DocumentPanel` e padronizar drag-and-drop.
  - Padronizar lógica de conclusão contínua.
  - (Opcional) adicionar `subscribeTable` para realtime.

## Validação
- Lint sem erros.
- Preview: navegar pela tela e validar:
  - Conclusão e desfazer conclusão funcionam como em Vistos.
  - Popover “Definir Responsável” salva e exibe corretamente; data via `CalendarPicker`.
  - Observações salvam por etapa e aparecem no modal; exclusão funciona.
  - Upload/drag-and-drop no painel de documentos.

Confirmo aplicar estas mudanças completas, replicando 1:1 as sessões e funções de Vistos na tela de Ações Trabalhistas?