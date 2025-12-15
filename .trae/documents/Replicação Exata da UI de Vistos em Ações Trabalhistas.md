## Objetivo
- Replicar **exatamente** a estrutura e interface da tela de Vistos (`src/app/dashboard/vistos/[id]/page.tsx`) para a tela de Ações Trabalhistas (`src/app/dashboard/acoes-trabalhistas/[id]/page.tsx`), mantendo apenas os nomes dos fluxos trabalhistas.
- Garantir que a "sessão de responsáveis" e "documentos do cliente" (com drag & drop e grid de anexos) estejam idênticas, conforme as imagens e código de Vistos.

## Estrutura a Replicar (baseada em Vistos)
A página deve ter um layout principal com:
1.  **Layout de Detalhe** (`DetailLayout`):
    *   **Esquerda (Timeline)**:
        *   Card com título "Fluxo do Processo".
        *   Lista de etapas (`workflow`) com conectores verticais.
        *   Ícones de estado (Check verde, Ponto azul, Círculo cinza) com `onClick` para `handleStepCompletion`.
        *   Badges "Atual" e "Concluído".
        *   Informação de Responsável e Prazo na linha da etapa.
        *   Ações à direita:
            *   Popover "Definir Responsável" (Lista de nomes + `CalendarPicker` para prazo).
            *   Botão Expandir/Recolher (`ChevronRight`).
    *   **Direita (Painéis)**:
        *   `StatusPanel` (Status, Etapa Atual, Datas).
        *   **Card de Observações**:
            *   Header com título "Observações" e botão ícone de pasta ("Ver todas as notas") que abre o `Modal de Notas`.
            *   `Textarea` para nota rápida da etapa atual.
            *   Botão "Salvar" com feedback "Salvo com sucesso!".
    *   **Abaixo (Sessão Extra)**:
        *   Grid com duas colunas (`lg:col-span-8` e `lg:col-span-4`):
            *   **Esquerda**: Card "Documentos do Cliente".
                *   Área de Drag & Drop (borda tracejada, ícone Upload, texto "Arraste e solte...").
                *   Grid de documentos anexados (ícone de arquivo, nome no title, botão excluir).
            *   **Direita**: Card "Responsáveis".
                *   Lista de responsáveis atribuídos (filtrado de `assignments`), com avatar (imagem genérica), nome, cargo e botão de e-mail (`Mail`).

## Funcionalidades
- **Conclusão de Etapas**: Lógica contínua (marca anteriores, avança atual).
- **Atribuição**: Salvar responsável/prazo por etapa em `/api/step-assignments` (moduleType=`acoes_trabalhistas`).
- **Notas**:
    - Salvar nota da etapa no array `notes` via JSON no campo `notes` do registro.
    - Modal de listagem com exclusão e formatação de data/autor.
- **Documentos**:
    - Upload via drag & drop ou clique.
    - Listagem com ícones e exclusão (`AlertDialog`).
    - Edição de nome (`Dialog`).
- **Responsáveis (Resumo)**: Listar quem está atribuído a alguma etapa no card inferior direito.

## Plano de Execução
1.  **Atualizar `src/app/dashboard/acoes-trabalhistas/[id]/page.tsx`**:
    - Substituir toda a estrutura de renderização para seguir exatamente o layout de colunas e cards de Vistos.
    - Adicionar seção inferior com cards "Documentos do Cliente" e "Responsáveis".
    - Garantir que `assignments` seja populado via `useEffect` e usado para renderizar o card de responsáveis.
    - Ajustar imports (ícones `Mail`, `Upload`, etc.).
    - Manter apenas o array `WORKFLOWS` específico de trabalhistas.

Confirma a replicação exata desta estrutura (Timeline + Status/Obs + Docs/Resp)?