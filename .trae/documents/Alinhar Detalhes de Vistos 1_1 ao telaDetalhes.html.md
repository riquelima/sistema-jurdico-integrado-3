## Objetivo
- Tornar a tela de detalhes de Vistos visualmente idêntica à referência: mesma hierarquia, espaçamentos, cores, bordas e tipografia.

## Ajustes Globais
- Wrapper da página: aplicar `bg-gray-50` e espaçamento superior/inferior consistente.
- Cards: usar sempre `rounded-xl shadow-sm border border-gray-200 bg-white` para todos os blocos (“Fluxo do Processo”, “Status”, “Observações”, “Documentos do Cliente”, “Responsáveis”).

## Fluxo do Processo
- Timeline:
  - Conector vertical com `w-0.5` e cor verde para segmentos concluídos; cinza para pendentes.
  - Nós:
    - Concluído: círculo com `bg-green-100 border-2 border-green-500` e ícone de check.
    - Atual: círculo com `border-2 border-blue-500` e ponto central `bg-blue-500`.
    - Pendente: círculo com `border-2 border-gray-300` e ícone `radio_button_unchecked`.
  - Cartão da etapa atual: bloco `p-4 bg-blue-50 rounded-lg border border-blue-100` com badge “Atual” e descrição cinza.
  - Botões à direita: “Definir Responsável” com `text-xs border rounded px-3 py-1`, ícone de edição na etapa atual e caret de expandir para conteúdo.
  - Espaços: `pb-10` entre itens, margens alinhadas à esquerda com 12px de deslocamento do conector.

## Status
- Select: `pl-3 pr-10 py-2.5 rounded-lg border`; opções “Em Andamento”, “Pausado”, “Cancelado”, “Concluído”.
- Blocos: títulos em `uppercase` pequenas, valores em `text-sm font-medium`, separadores `border-t border-gray-200`.

## Observações
- Card com cabeçalho e etiqueta “INTERNO”.
- Textarea dentro de `bg-gray-50`, sem borda.
- Barra inferior: ícones “Anexar” e “Formatar” à esquerda (`variant="ghost" size="icon"`), botão “Salvar” à direita. Separador: `border-t border-gray-200`.

## Documentos do Cliente
- Área de drag & drop: `border-2 border-dashed border-gray-300 rounded-lg p-6` com ícone de upload azul e dois textos; hover `hover:bg-gray-50`.
- Grid de cartões: duas colunas; cada card com `bg-gray-50 border border-gray-200 rounded-lg p-3`.
  - Lado esquerdo: tile branco com `border border-gray-200` e ícone (imagem/arquivo).
  - Centro: nome truncado, data/hora `pt-BR`, “Campo: …” em azul.
  - Lado direito: ações (download, excluir, renomear) `variant="ghost"`.

## Responsáveis
- Lista com avatar de iniciais coloridas (bg indigo), nome em `text-sm font-medium`, cargo em `text-xs text-gray-500`, botão de email à direita.
- Rodapé com botão `variant="outline"` e `border-dashed` “Adicionar membro”.

## Implementação
- Ajustar classes Tailwind diretamente em `src/app/dashboard/vistos/[id]/page.tsx` para cada bloco.
- Não reintroduzir componentes antigos (`StepItem`, `NotesPanel`, `DocumentPanel`).
- Manter toda a lógica e handlers atuais (fetch, updates, uploads, assignments, notes).

## Verificação
- Rodar dev, revisar `/dashboard/vistos/{id}` lado a lado com a imagem anexada.
- Confirmar: bordas suaves, sombras leves, cores certas, espaçamentos e alinhamentos idênticos.
- Executar `npm run lint` e garantir zero erros.
