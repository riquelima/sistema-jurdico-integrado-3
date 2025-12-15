## Objetivo
- Alterar a listagem de documentos na página de detalhes de Vistos para ícones lado a lado:
  - Ícone clicável abre o documento em nova aba
  - Tooltip com nome do arquivo (via `title`)
  - Botão “x” no canto, visível no hover, para excluir

## Implementação
- Em `src/app/dashboard/vistos/[id]/page.tsx` dentro do card “Documentos do Cliente”:
  - Substituir os cards detalhados por um container `flex flex-wrap gap-3`
  - Para cada documento, renderizar `div.group` com:
    - `<a>` ocupando `w-10 h-10` com `FileText` centralizado, `title` com nome
    - `<button>` `absolute -top-1 -right-1` com `opacity-0 group-hover:opacity-100` que chama `handleDeleteDocument`
  - Prevenir propagação no botão de excluir (`preventDefault`/`stopPropagation`)

## Validação
- Arrastar arquivos para a área e verificar que a lista aparece como ícones
- Hover mostra o “x” e o nome no tooltip; clique abre em nova aba; “x” exclui
- Lint sem erros

## Escopo
- Somente editar `src/app/dashboard/vistos/[id]/page.tsx`; sem novas dependências