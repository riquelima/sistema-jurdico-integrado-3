## Objetivo
- Replicar a interface e comportamento da tela de detalhes de Vistos na tela de detalhes de Ações Trabalhistas, mantendo os fluxos e passos próprios do módulo trabalhista.
- Padronizar UI de etapas (timeline com conectores e ícones clicáveis), conclusão lógica contínua e sistema de notas de processo.

## Ajustes de UI (Etapas)
- Substituir a renderização atual com `<StepItem>` por uma timeline igual à de Vistos: conectores verticais, ícones de estado (atual, concluído, futuro), badges e destaque da etapa atual.
- Reaproveitar o array de passos já existente em `workflow` de Ações Trabalhistas para preencher títulos e quantidade de etapas.
- Replicar o popover "Definir Responsável" com entrada de responsável e seleção de prazo (como em Vistos), mantendo o salvamento em `/api/step-assignments?moduleType=acoes_trabalhistas`.

## Lógica de Conclusão
- Implementar a mesma lógica contínua de Vistos:
  - Concluir etapa N marca concluídas todas as anteriores (`0..N`) e define a próxima (`N+1`) como atual.
  - Desfazer conclusão da etapa N desmarca `N..última` e define `N` como atual.
- Persistir `currentStep` via `PUT /api/acoes-trabalhistas?id=...` (o backend já aceita `currentStep`); calcular concluídas em memória como `index < currentStep` para UI.

## Sistema de Notas
- Manter o `NotesPanel` à direita (campo livre de observações) e adicionar campos de observação por etapa dentro do conteúdo da etapa, seguindo o padrão de Vistos.
- Ao salvar observações por etapa, anexar ao campo `notes` do registro um bloco legível (ex.: `[Etapa X]\n- item: valor`) via `PUT /api/acoes-trabalhistas?id=...`, sem alterar schema.

## Documentos
- Manter o `DocumentPanel` já presente, sem mudanças de API, garantindo o comportamento de drop/upload padronizado igual Vistos.

## Responsáveis e Prazos
- Reaproveitar o mecanismo existente no módulo trabalhista, com salvamento em `/api/step-assignments` e `moduleType=acoes_trabalhistas`.
- Exibir na timeline os badges com Responsável e Prazo quando existirem.

## Acessibilidade e UX
- Preservar `aria-label`, `title` e estados visuais iguais aos de Vistos para os ícones (azul atual, verde concluído, cinza futuro).
- Garantir feedback visual consistente (badges “Atual” e “Concluído”).

## Validação
- Verificar no preview: conclusão de etapas, avanço automático, desfazer conclusão e atualização visual dos conectores.
- Testar notas: inclusão de observações por etapa refletidas no `notes` e exibição no painel.
- Testar upload/drag-and-drop no painel de documentos.

## Entregáveis
- Tela de detalhes de Ações Trabalhistas com UI e comportamento padronizados com Vistos, mantendo os títulos e passos do `workflow` trabalhista.
- Lógica de conclusão contínua e notas por etapa integradas ao campo `notes`, sem alterações de schema.

Confirma aplicar essa padronização agora? 