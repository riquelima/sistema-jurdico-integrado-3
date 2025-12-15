## Objetivo
- Padronizar o tamanho da fonte de todos os campos de leitura para o mesmo valor, reduzindo inconsistências visuais e ganhando densidade.

## Padrão Proposto
- Campos (linhas de leitura com "Label: Valor"): `text-xs` + `leading-snug`.
- Títulos de seção: manter `text-base`.
- Labels e inputs no modo edição: manter como estão (não são linhas de leitura).

## Onde ajustar
- Arquivo: `src/app/dashboard/vistos/[id]/page.tsx`
- Trocar `text-sm` por `text-xs` nas linhas de leitura:
  - Função `renderField` (read view): `:727` e `:743`.
  - Seções em "Comprovação Financeira PF": `:1135`, `:1153`, `:1171`, `:1189`.
  - Eventuais demais campos com `text-sm` usados como leitura serão convertidos para `text-xs` e, quando apropriado, `leading-snug`.

## Técnica
- Substituição pontual de classes Tailwind (`text-sm` → `text-xs`); adicionar `leading-snug` onde o espaçamento de linha beneficiar a densidade.
- Não alterar títulos e botões.

## Verificação
- Recarregar a tela de detalhes do visto e conferir que todos os campos apresentam o mesmo tamanho de fonte.

Posso aplicar essas alterações conforme mapeado para padronizar a tipografia dos campos?