## Objetivo
- Recriar a página `src/app/dashboard/vistos/[id]/page.tsx` para seguir fielmente o layout do arquivo `telaDetalhes.html`, mantendo toda a lógica atual (busca de dados, uploads, notas, status, assignments) e apenas reestruturando/estilizando a UI.

## Cabeçalho
- Preservar navegação e exclusão já fornecidas por `DetailLayout` (`src/app/dashboard/vistos/[id]/page.tsx:1940`–`2012`).
- Ajustar título e subtítulo para tipografia e espaçamento da referência.
- Opcional: adicionar toggle de tema no cabeçalho (se já houver suporte global) para refletir o ícone de modo escuro/claro da referência.

## Fluxo do Processo
- Substituir o render atual de lista por uma timeline visual com nós circulares, estados e linhas, como em `telaDetalhes.html` (concluído, atual, pendente).
- Implementação:
  - Manter `WORKFLOWS` e a lógica de passos e estado atual (`src/app/dashboard/vistos/[id]/page.tsx:58`–`92`, `1938`–`1976`).
  - Reescrever o conteúdo do card “Fluxo do Processo” para usar uma timeline vertical:
    - Nó concluído: círculo com borda verde e ícone de check.
    - Nó atual: círculo com ponto central azul e cartão destacado da etapa.
    - Nó pendente: círculo com borda cinza e opacidade reduzida.
  - Preservar expansão, marcação de concluído e assignments utilizando os handlers existentes (`onToggle`, `onMarkComplete`, `onSaveAssignment`) e estados (`expandedSteps`, `assignments`).

## Painel de Status
- Manter `StatusPanel` e ajustar classes para criar aparência igual à referência: select com foco azul, separadores e blocos informativos de etapa atual, criado em, última atualização (`src/app/dashboard/vistos/[id]/page.tsx:1981`–`1989`).
- Continuar usando `handleStatusChange` para persistência (`542`–`553`).

## Observações
- Reestilizar `NotesPanel` para usar um container com borda, fundo sutil e barra inferior com botão “Salvar”, ícones de ações à esquerda, alinhando com `telaDetalhes.html` (`250`–`274`).
- Continuar salvando via `saveStepNotes(0)` e o estado `notes` (`2005`–`2009`).

## Documentos do Cliente
- Reestruturar `DocumentPanel` para:
  - Área de “arraste e solte” no topo com ícone de upload, textos e borda tracejada.
  - Lista de documentos em cartões compactos com ícone do tipo, nome truncado, data de envio e o campo de origem, além de menu de ações.
- Reutilizar a lógica atual de upload, download, rename e delete (`onDropFiles`, `onDocumentDownload`, `onDocumentDelete`, `onDocumentDoubleClick`) e estados já existentes (`uploadingFiles['general']`, `documents`, `editingDocument`).

## Responsáveis
- Criar painel “Responsáveis” na coluna direita com lista de membros (iniciais com círculo colorido, nome e função) e botão “Adicionar membro”.
- Integrar com o endpoint/estado de assignments já utilizado na timeline:
  - Renderizar responsáveis a partir de `assignments` e/ou um estado derivado (quando disponível de `/api/step-assignments`).
  - Botão “Adicionar membro” abre diálogo simples para adicionar um responsável genérico vinculado ao caso.

## Conteúdos de Etapa
- Preservar toda a lógica de conteúdos de etapa já implementados (Cadastro, Agendamento, Preparação, Aguardar, Finalização) e seus uploads específicos (`renderVistoTrabalhoStepContent`, `renderDefaultStepContent`, etc.). Apenas ajustar a aparência para o novo padrão sem alterar endpoints.

## Estilo e Componentização
- Usar Tailwind conforme o projeto, sem inserir comentários no código, mantendo importações atuais de `shadcn/ui` (`Button`, `Select`, `Input`, `Textarea`, `Card`).
- Não introduzir novas dependências.

## Integração e Persistência
- Continuar usando os endpoints existentes:
  - Vistos: `GET/PUT /api/vistos` (`181`–`267`, `555`–`569`).
  - Documentos: `GET /api/documents/:id`, `POST /api/documents/upload`, delete/rename (`269`–`279`, `325`–`353`, `300`–`323`, `281`–`298`).
  - Assignments: `GET/POST /api/step-assignments` (`164`–`178`, `571`–`601`).

## Validação
- Após implementar, verificar visual no dev server, checar:
  - Timeline com estados correto (concluído/atual/pendente).
  - Área de upload por arraste e lista de documentos.
  - Observações com barra de ações e salvar funcionando.
  - Painel de status exibindo dados corretos.
  - Responsáveis listados e botão de adicionar.

## Escopo
- Alterações limitadas a `src/app/dashboard/vistos/[id]/page.tsx` e, se necessário para o visual, ajustes leves em `DetailLayout`, `StepItem`, `StatusPanel`, `DocumentPanel`, `NotesPanel` preservando suas APIs para não quebrar outras páginas.
