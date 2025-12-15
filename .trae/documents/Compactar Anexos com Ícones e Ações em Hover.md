## Objetivo
- Substituir a lista vertical de anexos por ícones compactos alinhados lado a lado, com nome no hover, clique para abrir em nova aba e botão de excluir visível no hover.

## Onde alterar
- `src/app/dashboard/vistos/[id]/page.tsx`
- Função: `renderDocLinks(fieldKey: string)` (linha ~420)

## Implementação
- Trocar a renderização atual (título + `<ul><li>...`) por um container horizontal:
  - Wrapper: `div` com `flex flex-wrap gap-2 mt-2`.
  - Para cada documento:
    - `div` com `group relative w-8 h-8` (compacto) contendo:
      - `a` com `target="_blank"` para abrir em nova aba; `title` com nome do documento; conteúdo: um ícone (ex.: `FileText`) centralizado (`rounded-md border bg-white hover:bg-gray-50 flex items-center justify-center`).
      - Botão excluir: `absolute -top-1 -right-1 opacity-0 group-hover:opacity-100` com `X` pequeno; `onClick` chama `handleDeleteDocument(doc)`.
- Remover o cabeçalho “Documento anexado:” para economizar espaço.
- Manter compatibilidade com dados: usar `doc.file_path || doc.url` e `doc.document_name || doc.name || doc.file_name` para `title`.

## Reuso de Lógica Existente
- Usar `handleDeleteDocument(document)` já existente (linhas ~319, ~2347) para confirmar e excluir.
- Reaproveitar padrão visual já usado em `Documentos do Cliente` (mini ícones com hover-delete).

## Verificação
- Abrir `http://localhost:3000/dashboard/vistos/{id}` e verificar se:
  - Anexos aparecem lado a lado abaixo do campo.
  - Nome aparece em hover (`title`).
  - Clique abre em nova aba.
  - Hover mostra “x” e exclusão funciona.

## Rollback
- Se necessário, restaurar a antiga `ul` mantendo a função `renderDocLinks` anterior salva no histórico do editor.