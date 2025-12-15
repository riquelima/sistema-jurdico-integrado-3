## Objetivo
- Corrigir e ajustar a página de detalhes de Ações Trabalhistas (`src/app/dashboard/acoes-trabalhistas/[id]/page.tsx`) para garantir replicação exata da UI e funcionalidades da tela de Vistos, incluindo alinhamento vertical das seções inferiores e implementação de gestão de responsáveis.

## Análise e Ajustes Necessários

### 1. Alinhamento Vertical das Seções (Cards Inferiores)
- **Problema**: O user mencionou "alinhar verticalmente todas as seções de evidências" e "altura uniforme". Na estrutura atual de Vistos (que já repliquei), o card de "Responsáveis" (coluna 4) tem `h-full`, mas o card de "Documentos do Cliente" (coluna 8) pode não estar expandindo para preencher a mesma altura se o conteúdo for menor, ou vice-versa.
- **Solução**: Garantir que o container pai use `items-stretch` (padrão do grid) e ambos os cards tenham `h-full flex flex-col`. O conteúdo interno deve usar `flex-1` onde apropriado para ocupar espaço disponível.
    - Card "Documentos": Adicionar `h-full` e garantir estrutura flexível.
    - Card "Responsáveis": Já tem `h-full` e `flex flex-col justify-between`.

### 2. Gestão de Responsáveis ("Adicionar Responsável")
- **Análise**: Na tela de Vistos (`vistos/[id]/page.tsx`), o card "Responsáveis" (linhas 2417-2450) **apenas lista** os responsáveis extraídos de `assignments` (atribuições das etapas). Não há um botão explícito "Adicionar Responsável" global nesse card no código lido.
- **Ação**:
    - O user pediu explicitamente: "Implementar todas as funções de gestão de responsáveis, incluindo Botão 'Adicionar Responsável' visível e funcional".
    - Isso sugere uma funcionalidade *nova* ou que existe em outra versão/referência que o user tem.
    - **Estratégia**: Vou implementar um botão "Adicionar Responsável" no Header do Card "Responsáveis".
    - **Modal de Adição**: Criar um Dialog para adicionar responsável manualmente (não vinculado a uma etapa específica, ou vinculado a uma "Geral").
    - **Persistência**: Como a estrutura atual liga responsável a `stepIndex`, posso usar um `stepIndex` especial (ex: -1 ou null) ou criar uma tabela separada?
    - *Melhor abordagem para não quebrar o padrão*: Manter a atribuição por etapa (que já existe e funciona via Popover na timeline). O botão "Adicionar Responsável" no card pode abrir um modal para atribuir um responsável a uma etapa específica (selecionando a etapa e a pessoa). Isso centraliza a gestão.
    - **Ou**: O user pode estar se referindo à lista de "RESPONSAVEIS" (array fixo no código). Talvez ele queira gerenciar *essa* lista? (Adicionar novos nomes ao sistema).
    - *Interpretação mais segura*: O user quer atribuir responsáveis ao caso. Vou adicionar o botão que abre um modal para "Atribuir Responsável", onde se escolhe a Etapa, O Responsável e o Prazo. Isso complementa os popovers individuais.

### 3. Ajustes Visuais e Funcionais
- **Layout Responsivo**: O grid `lg:grid-cols-12` já é responsivo. Verificar margens e paddings em mobile (`p-4` vs `p-6`).
- **Espaçamento**: Padronizar `gap-4` ou `gap-6` entre os cards principais.
- **Cores/Tipografia**: Garantir uso das classes `text-gray-900`, `font-semibold`, etc., consistentes com Vistos.
- **Hover/Focus**: Botões e inputs já usam classes padrão do shadcn/ui (`hover:bg-slate-100`, `focus:ring`, etc.).
- **Feedback**: Garantir `alert` ou `toast` (via saveMessages) ao salvar.

### 4. Interações
- **Animações**: `transition-all` nos ícones de etapa e botões.
- **Navegação**: Links de voltar e breadcrumbs (se houver) funcionando.

## Plano de Implementação
1.  **Refinar Card de Responsáveis**:
    - Adicionar botão `<Button size="sm" variant="outline"><Plus className="w-4 h-4 mr-2" /> Adicionar</Button>` no Header do Card.
    - Criar estado `showAddResponsibleModal`.
    - Criar `Dialog` com: Select de Etapa (listar passos do workflow), Select de Responsável (lista fixa ou input), DatePicker de Prazo.
    - Ao salvar, chamar `handleSaveAssignment` com o index da etapa selecionada.
2.  **Ajustar Altura dos Cards**:
    - Adicionar `className="h-full flex flex-col"` nos cards de Documentos e Responsáveis.
    - No grid pai, garantir alinhamento (o padrão CSS Grid já faz `stretch`, mas o conteúdo interno precisa crescer).
3.  **Verificação Geral**:
    - Revisar todo o arquivo `acoes-trabalhistas/[id]/page.tsx` comparando com `vistos/[id]/page.tsx` para garantir que nada foi perdido (ex: `DetailLayout` props, `StatusPanel` props).

Confirma a implementação do botão "Adicionar Responsável" (com modal de atribuição a etapas) e ajustes de layout?