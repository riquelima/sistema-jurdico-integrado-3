## Objetivo Geral
- Recriar e padronizar todas as páginas de detalhes dos módulos (Ações Cíveis, Trabalhistas, Criminais, Compra e Venda, Perda de Nacionalidade, Vistos), mantendo as funcionalidades atuais e elevando a estética/UX.
- Preservar o “Fluxo do Processo” com passos, mas tornar a interface mais viva, harmoniosa e legível em desktop e mobile.
- Unificar a experiência: mesma estrutura, mesma paleta, mesmos padrões de componentes e interações.

## Diretrizes de UX/Visual
- Cabeçalho: área superior full-width com botão de voltar, nome do cliente e tipo de ação, e ação de excluir com AlertDialog.
- Layout: grid responsivo em 3 colunas (lg:grid-cols-3) — 2 colunas para “Fluxo do Processo”, 1 coluna para “Painéis laterais” (Status, Documentos, Observações).
- Paleta: 
  - “Atual” em azul (badge com borda e fundo azul-claro, texto azul).
  - “Concluído” em verde (badge outline com fundo verde-claro).
  - “Aguardando” em neutro (badge cinza/outline).
- Espaçamento: usar “space-y-*” e “gap-*” consistentes, transitions sutis em hover/focus, bordas arredondadas.
- Acessibilidade: foco visível, labels associadas, aria-attributes nas regiões colapsáveis, contraste adequado.

## Componentes (shadcn/ui) e Padrões
- Card, Badge, Collapsible (ou Accordion, conforme necessidade), AlertDialog, Select, Input, Textarea, Progress (para uploads), Tabs (opcional para documentos), Tooltip (icônicos).
- Ícones lucide para status, ações, upload e edição.
- Botões padronizados (ghost/outline/primary) com classes utilitárias consistentes.

## Arquitetura de Componentes
- `src/components/detail/DetailLayout.tsx`: cabeçalho + grid base (slot para fluxo e painéis).
- `src/components/detail/StepItem.tsx`: renderização de um passo (ícone, título, badges de status, trigger/collapsible, acessibilidade).
- `src/components/detail/StepContent.tsx`: conteúdo do passo (inputs/seletores/upload) harmonizados em grid.
- `src/components/detail/StatusPanel.tsx`: painel lateral de status (select para status, passo atual, datas).
- `src/components/detail/DocumentPanel.tsx`: upload drag&drop, lista de documentos, renomear/excluir, estados de progresso.
- `src/components/detail/NotesPanel.tsx`: textarea de observações + salvar.
- `src/components/detail/DeleteAction.tsx`: botão “Excluir” com AlertDialog (confirmar/cancelar).

## Padronização de Fluxo de Passos
- Ações Cíveis (Exame DNA): usar rótulos solicitados (Cadastro Documentos, Agendar Exame DNA, Elaboração Procuração, Aguardar procuração assinada, À Protocolar, Protocolado, Processo Finalizado).
- Demais tipos/módulos: mapear workflows atuais para rótulos equivalentes e harmonizados (manter semântica, simplificar nomes quando necessário).
- Sem diálogos de confirmação ao concluir: apenas atualizar visual e estado.

## Melhoria dos Inputs
- Inputs com Label + ajuda contextual, placeholders discretos, feedback de erro/sucesso.
- Grid por passo (ex.: 2 colunas em desktop, 1 em mobile) para caber harmoniosamente.
- Upload:
  - Área drag&drop com ícone, descrição e estado.
  - Barra de progresso (Progress) durante upload.
  - Lista de arquivos com ações (renomear, excluir) e feedback.

## Reuso de Lógica
- `useCaseDetail` (hook): 
  - Recebe `moduleType` e `id`.
  - Funções: `fetchCase`, `fetchDocuments`, `updateStatus`, `updateStep`, `saveStepData`, `uploadFile`, `deleteFile`, `renameFile`.
  - Integra com APIs existentes (mantendo endpoints atuais).
- Prefetch/cache: manter otimizações já aplicadas; prefetch ao focar/hover em links de detalhes.

## Comportamentos e Estados
- Conclusão de passo: avança `currentStep` e muda badge automaticamente.
- Último passo: altera status para “Finalizado” sem alert modal.
- Status panel: altera status e reflete data de atualização.
- Documentos: drag&drop, renomear, excluir, progress; erros tratados silenciosamente com feedback visual.

## Padrões de Classe/Estilo
- `w-full` no container da página de detalhes; remover qualquer `max-w-*` que imponha constraints.
- Badges:
  - Atual: `variant="outline" border-blue-500 text-blue-700 bg-blue-50 dark:border-blue-400 dark:text-blue-300 dark:bg-blue-950`.
  - Concluído: `variant="outline" bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300`.
  - Aguardando: `variant="outline" text-slate-600 dark:text-slate-300`.

## Integração por Módulo
- Substituir o bloco atual das páginas `[id]/page.tsx` por composição do `DetailLayout` + `StepItem` + `StepContent` + painéis.
- Mapear campos específicos de cada módulo no `StepContent`: manter chaves/nomes dos campos existentes, apenas melhorar UI e disposição.
- Preservar os endpoints/estratégia de persistência; corrigir validações (ex.: datas vazias) com tratamento no frontend antes de enviar ao backend.

## Testes e Validação
- Testar cada módulo: 
  - Navegação e prefetch.
  - Conclusão de passo, mudança de status, uploads.
  - Responsividade (mobile/desktop) e acessibilidade (tab/foco/aria).
- Verificar que não há regressão de dados e que performance permanece boa.

## Entregáveis
- Nova UI padronizada dos detalhes em todos os módulos.
- Componentes compartilhaveis em `src/components/detail/*`.
- Hook `useCaseDetail` para unificar operações.
- Adaptação de workflows por módulo com rótulos harmonizados.

## Próximos Passos
1. Criar os componentes base e hook.
2. Migrar Ações Cíveis para o novo layout (piloto), validar.
3. Replicar em Trabalhistas, Criminais, Compra e Venda, Perda de Nacionalidade e Vistos.
4. Ajustar detalhes finos (cores, ícones, textos) conforme feedback.

Confirma a execução desse plano para eu começar a implementar? 