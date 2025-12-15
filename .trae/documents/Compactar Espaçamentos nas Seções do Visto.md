## Objetivo
- Reduzir espaçamentos verticais e entre colunas para uma leitura mais eficiente, mantendo consistência com a interface atual.

## Estratégia de Ajuste
- Diminuir `space-y` por nível de container para evitar somas excessivas.
- Reduzir `gap` dos grids e `p-*` dos blocos para compactar sem perder respirabilidade.
- Manter tipografia menor já aplicada e botões de edição compactos com ícone.

## Alterações Propostas no Arquivo
- Arquivo: `src/app/dashboard/vistos/[id]/page.tsx`

### Containers principais
- `space-y-6` → `space-y-4` em:
  - Linha `764`: container de seções do bloco "Documentos".
  - Linha `2220`: coluna lateral de status/observações.
  - Linha `1886`: container da área principal.
- `space-y-8` → `space-y-6` em:
  - Linha `1318`: container de seções quando `showBrasil`.
  - Linha `2022`: wrapper com `w-full p-6 space-y-8 bg-gray-50`.

### Seções/títulos e conteúdo interno
- `space-y-4` → `space-y-3` em:
  - Linha `778`: seção "Dados do Cliente".
  - Linha `891`: seção "Documentos Pessoais".
  - Linha `1072`: seção "Comprovação Financeira PF".
  - Linha `1195`: seção "Outros Documentos".
  - Linhas `1319, 1335, 1355, 1371, 1386, 1403, 1421, 1440, 1460, 1474, 1491`: seções do modo Brasil e grupos adicionais.
  - Linha `2272`: container de cartões dentro da coluna de documentos.
  - Linha `2372`: bloco de notas abrangente (se aplicável).
- Em containers com `space-y-2` muito próximos, manter `space-y-2` nos itens, mas reduzir o container pai para `space-y-3` (ex.: linhas `788, 802, 824, 858, 874, ...`).

### Grids e paddings
- `gap-6` → `gap-4` em:
  - Linha `1972`: `grid grid-cols-1 lg:grid-cols-3 gap-6`.
  - Linha `1591`: `grid grid-cols-1 md:grid-cols-2 gap-6`.
- `gap-4` → `gap-3` em:
  - Linhas `787, 900, 1081, 1204, 1328, 1344, 1364, 1380, 1395, 1412, 1430, 1449, 1467, 1481, 1498, 2318`: todos os `grid ... gap-4`.
- `p-4` → `p-3` nos containers de grade:
  - Mesmas linhas acima onde há `p-4 bg-muted rounded-lg`.
- `flex items-center gap-4` → `gap-2` em:
  - Linhas `1968, 2024` para headers ajustarem densidade com os novos títulos.

### Modal de Observações
- Lista de notas: `space-y-4` → `space-y-3` em `src/app/dashboard/vistos/[id]/page.tsx:2246`.
- Cartão individual já tem botão de excluir em hover; manter.

### Ajustes de microtipografia (opcional)
- Adicionar `leading-snug` nos textos de resumo onde já está `text-xs` para compactar altura de linha.
- Aplicar `mb-1` em subtítulos de cartão quando necessário para evitar duplo espaçamento.

## Implementação Técnica
- Substituições diretas nas classes Tailwind conforme mapeamento acima.
- Revisão visual após hot-reload para garantir que não haja colapsos de layout.

## Verificação
- Navegar em `http://localhost:3000/dashboard/vistos/{id}` e revisar:
  - "Dados do Cliente", "Documentos Pessoais", "Comprovação Financeira PF", "Outros Documentos".
  - Seções do modo Brasil (quando ativadas).
  - Colunas laterais de status/observações e modal de notas.
- Confirmar que não existem espaçamentos vazios excessivos entre grupos e itens.

## Rollback
- Caso alguma seção fique apertada demais, restaurar apenas o nível afetado (voltar `space-y-3` → `space-y-4` ou `gap-3` → `gap-4`).

Confirma que posso aplicar esses ajustes nas classes Tailwind conforme listado?